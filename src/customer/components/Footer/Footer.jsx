import { useNavigate } from 'react-router-dom';
import { Gi3dHammer } from "react-icons/gi";
import { Grid, Typography, Button, TextField, Box } from '@mui/material'

const Footer = () => {
    const navigate = useNavigate();
    return (
        <div>

            <Grid className='bg-gray-900 text-gray-300 text-center mt-10'
                container
                spacing={3}
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                sx={{ bgcolor: "gray-900", color: "#D1D5DB", py: 3 }}>
                <Grid container justifyContent="center" sx={{ bgcolor: "#111827", py: 5 }}>
                    <Grid item xs={12} sm={8} md={6} textAlign="center">
                        <Typography variant="h6" sx={{ mb: 2, color: "#D1D5DB" }}>
                            Newsletter
                        </Typography>
                        <Box component="form" sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <TextField
                                variant="outlined"
                                placeholder="Sign up now..."
                                size="small"
                                sx={{ bgcolor: "#D1D5DB", borderRadius: 1, width: "70%" }}
                            />
                            <Button variant="contained" sx={{ bgcolor: "#F97316", "&:hover": { bgcolor: "darkorange" } }}>
                                Subscribe
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6} md={3} textAlign={'left'}>
                    
                    <Gi3dHammer className="text-orange-500 w-12 h-12 mx-auto mb-3" />
                    <Typography variant="body2" sx={{ maxWidth: "250px", mx: "auto", textAlign: "center" }}>
                        At ModelForge, our mission is to inspire builders of all ages to craft, play, and enjoy the art of building together.
                    </Typography>
                    <Box
                        sx={{
                            maxWidth: "250px",
                            mx: "auto",
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "orange.900",
                            boxShadow: 1,
                        }}
                    >
                        <Typography variant="body2" fontWeight="bold">
                            ModernForge
                        </Typography>
                        <Typography variant="body2">
                            1234 Qualhurst Ln Suite 4
                        </Typography>
                        <Typography variant="body2">
                            Travherst, TX 1470
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant='h6' gutterBottom>Quick Links</Typography>
                    <Button color="inherit">About</Button><br />
                    <Button color="inherit" onClick={() => navigate("/wholesale")}>Wholesale</Button><br />
                    <Button color="inherit">Earn $$$</Button><br />
                    <Button color="inherit" onClick={() => navigate("/faq")}>FAQs</Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant='h6' gutterBottom>Support</Typography>
                    <Button color="inherit" onClick={() => navigate("/support")}>Help Center</Button><br />
                    <Button color="inherit" onClick={() => navigate("/support")}>Contact Us</Button><br />
                    <Button color="inherit" onClick={() => navigate("/shippingreturns")}>Shipping Info</Button><br />
                    <Button color="inherit" onClick={() => navigate("/shippingreturns")}>Returns</Button><br />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant='h6' gutterBottom>Legal</Typography>
                    <Button color="inherit">Privacy Policy</Button><br />
                    <Button color="inherit">Return Policy</Button><br />
                    <Button color="inherit">Terms & Conditions</Button><br />
                    <Button color="inherit">Shipping Policies</Button>
                </Grid>
            </Grid>

        </div>

    )
}

export default Footer
