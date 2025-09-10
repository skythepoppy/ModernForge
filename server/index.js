const express = require('express');
const mysql = require('mysql2');
const AWS = require('aws-sdk');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js'); 
const ordersRouter = require('./routes/orders.js');

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/orders", ordersRouter);


// --- MySQL setup ---
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
connection.connect(err => {
    if (err) console.error('DB connection error:', err);
    else console.log('Connected to MySQL');
});

// --- AWS S3 setup ---
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// make connection available to routes
app.set('db', connection);

// --- Helper to generate signed URLs ---
const getSignedUrl = (key) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Expires: 60 * 60 * 24 * 3,
    };
    return s3.getSignedUrl('getObject', params);
};

// --- API route to fetch toys ---
app.get('/api/toys', (req, res) => {
    const { category, status, columns } = req.query;
    let selectCols = '*';

    if (columns) {
        const allowedCols = ['id', 'brand', 'title', 'description', 'price', 'discountedPrice', 'quantity', 'image', 'category', 'status'];
        const requestedCols = columns.split(',').filter(col => allowedCols.includes(col));
        if (requestedCols.length) selectCols = requestedCols.join(',');
    }

    let sql = `SELECT ${selectCols} FROM toys`;
    const params = [];
    const conditions = [];

    if (category) { conditions.push('category = ?'); params.push(category); }
    if (status) { conditions.push('status = ?'); params.push(status); }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');

    connection.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });

        const toysWithUrls = results.map(toy => {
            if (toy.image) return { ...toy, imageUrl: getSignedUrl(toy.image) };

            return toy;
        });


        res.json(toysWithUrls);
    });
});

// --- API route to handle support form ---
app.post('/api/support', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            replyTo: email,
            to: process.env.SMTP_USER,
            subject: `[Support Form] ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', {
            message: error.message,
            code: error.code,
            response: error.response,
            stack: error.stack
        });
        res.status(500).json({ message: 'Email could not be sent' });
    }
});

// --- API route to handle wholesale form ---
app.post('/api/wholesale', async (req, res) => {
    const {
        businessName,
        businessType,
        contactName,
        email,
        phone,
        website,
        shippingAddress,
        billingAddress,
        taxId,
        estimatedOrderVolume,
        productInterest
    } = req.body;

    // validation
    if (
        !businessName || !businessType || !contactName || !email || !phone ||
        !website || !shippingAddress || !billingAddress || !taxId ||
        !estimatedOrderVolume || !productInterest
    ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // email content
        const mailOptions = {
            from: `"${contactName}" <${email}>`,
            replyTo: email,
            to: process.env.SMTP_USER,
            subject: `[Wholesale Inquiry] ${businessName}`,
            text: `
Business Name: ${businessName}
Business Type: ${businessType}
Contact Name: ${contactName}
Email: ${email}
Phone: ${phone}
Website: ${website}
Shipping Address: ${shippingAddress}
Billing Address: ${billingAddress}
Tax ID / Reseller Certificate: ${taxId}
Estimated Order Volume: ${estimatedOrderVolume}
Products of Interest: ${productInterest}
            `,
        };

        // send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Wholesale inquiry sent successfully' });
    } catch (error) {
        console.error('Error sending email:', {
            message: error.message,
            code: error.code,
            response: error.response,
            stack: error.stack
        });
        res.status(500).json({ message: 'Email could not be sent' });
    }
});


// --- API route to affiliate partners --

app.post('/api/affiliate', async (req, res) => {
    const { name, email, website, audienceSize, niche, comments } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required." });
    }

    // Inserting into mySQL
    const sql = `INSERT INTO affiliate_applications
    (name, email, website, audience_size, niche, comments)
    VALUES (?, ?, ?, ?, ?, ?)`
        ;

    const params = [name, email, website, audienceSize, niche, comments];

    connection.query(sql, params, async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to save application" });
        }

        try {
            // email confirmation to modernforge email
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"${name}" <${email}>`,
                to: process.env.SMTP_USER,
                subject: `[Affiliate Application] ${name}`,
                text: `
New affiliate application:

Name: ${name}
Email: ${email}
Website: ${website}
Audience Size: ${audienceSize}
Niche: ${niche}
Comments: ${comments}
Status: pending
                `,
            });

            res.status(200).json({ message: 'Application submitted successfully' });

        } catch (error) {
            console.error('Email error:', error);
            res.status(500).json({ message: 'Application saved, but email failed' });
        }
    });
});

// -- API route for admins to update status and user auto-notification --
app.post('/api/affiliate/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    // update DB
    const sql = `UPDATE affiliate_applications SET status = ? WHERE id = ?`;
    connection.query(sql, [status, id], async (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(500).json({ message: "Failed to update status" });
        };

        // get user email for notification
        const getEmailSql = `SELECT email, name FROM affiliate_applications WHERE id = ?`;
        connection.query(getEmailSql, [id], async (err, rows) => {
            if (err || !rows.length) {
                return res.status(500).json({ message: "User not found" });
            };

            const { email, name } = rows[0];

            console.log('Sending email to:', email, 'Name:', name); //TEST


            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT),
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
                });

                await transporter.sendMail({
                    from: `"ModernForge Team" <${process.env.SMTP_USER}>`,
                    to: String(email),
                    subject: `Your Affiliate Application Status: ${status}`,
                    text: `Hi ${name}, \n\nYour affiliate application has been ${status}.\n\nThank you for applying!\n- ModernForge Team`,
                });

                res.status(200).json({ message: `Status updated to ${status} and notified.` });
            } catch (error) {
                console.error('Email error:', error);
                res.status(500).json({ message: 'Status updated but failed to send email' });
            }

        });
    });
});

// --- API route to handle newsletter signups ---
const rateLimit = {}; // simple in-memory rate limit (IP/email-based)

app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    const ip = req.ip;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // --- rate limiter: max 3 requests per 1 minute per IP ---
    const now = Date.now();
    rateLimit[ip] = rateLimit[ip] || [];
    rateLimit[ip] = rateLimit[ip].filter(t => now - t < 60 * 1000);
    if (rateLimit[ip].length >= 3) {
        return res.status(429).json({ message: "Too many requests. Please try again later." });
    }
    rateLimit[ip].push(now);

    // --- duplicate email handling ---
    connection.query('SELECT * FROM newsletter_subs WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (results.length) return res.status(400).json({ message: "Email already subscribed" });

        // insert into DB
        const sql = `INSERT INTO newsletter_subs (email) VALUES (?)`;
        connection.query(sql, [email], async (err, result) => {
            if (err) return res.status(500).json({ message: "Failed to save email" });

            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT),
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"ModernForge Team" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: `Thanks for subscribing!`,
                    text: `Hi there!\n\nThanks for subscribing to the ModernForge newsletter. You'll receive weekly updates from us.\n\n- ModernForge Team`,
                });

                res.status(200).json({ message: 'Subscribed successfully' });
            } catch (error) {
                console.error('Email error:', error);
                res.status(500).json({ message: 'Saved, but failed to send email' });
            }
        });
    });
});




// --- Start server ---
app.listen(port, () => console.log(`Server running on port ${port}`));
