import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './customer/components/Layout/Layout';
import HomePage from './customer/components/Navigation/Pages/HomePage/HomePage';
import FAQPage from './customer/components/Navigation/Pages/FAQPage/FAQPage';
import SupportPage from "./customer/components/Navigation/Pages/SupportPage/SupportPage";
import ShippingReturnsPage from './customer/components/Navigation/Pages/ShippingReturns/ShippingReturnsPage';
import WholesalePage from './customer/components/Navigation/Pages/WholesalePage/WholesalePage';
import AffiliatePage from './customer/components/Navigation/Pages/AffiliatePage/AffiliatePage';
import WeeklyDealsPage from './customer/components/Navigation/Pages/WeeklyDeals/WeeklyDealsPage';
import AircraftPage from './customer/components/Navigation/Pages/ToyPage/AircraftPage';
import AutomobilePage from './customer/components/Navigation/Pages/ToyPage/AutomobilePage';
import WatercraftPage from './customer/components/Navigation/Pages/ToyPage/WatercraftPage';
import ProgrammablePage from './customer/components/Navigation/Pages/ToyPage/ProgrammablePage';
import ProductPage from './customer/ProductPage/ProductPage';
import NewsletterPage from './customer/components/Navigation/Pages/NewsLetterPage/NewsletterPage';
import LoginPage from './customer/components/Navigation/Pages/AuthPage/Login';
import RegisterPage from './customer/components/Navigation/Pages/AuthPage/Registration';
import AdminPage from './customer/components/Navigation/Pages/AdminPage/AdminPage';
import UserPage from './customer/components/Navigation/Pages/UserPage/UserPage';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/shippingreturns" element={<ShippingReturnsPage />} />
          <Route path="/wholesale" element={<WholesalePage />} />
          <Route path='/affiliate' element={<AffiliatePage />} />
          <Route path='/weeklydeals' element={<WeeklyDealsPage />} />
          <Route path='/aircrafts' element={<AircraftPage />} />
          <Route path='/automobiles' element={<AutomobilePage />} />
          <Route path='/watercrafts' element={<WatercraftPage />} />
          <Route path='/programmables' element={<ProgrammablePage />} />
          <Route path='/products/:productId' element={<ProductPage />} />
          <Route path='/newsletter' element={<NewsletterPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/user/dashboard' element={<UserPage />} />
          <Route path='/admin/dashboard' element={<AdminPage />}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
