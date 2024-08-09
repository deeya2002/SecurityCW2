import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';


// for showing toast messages
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Khalti from './components/Khalti/Khalti';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEditFood from './pages/admin/AdminEditFood';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminRestaurant from './pages/admin/AdminRestaurant';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cart from './pages/Cart/Cart';
import OrderList from './pages/Cart/Orderlist';
import ChangePassword from './pages/Changepassword/changepassword';
import DescriptionPage from './pages/DescriptionPage';
import ForgotPassword from './pages/Forgotpassword/ResetPassword';
import SendEmail from './pages/Forgotpassword/SendEmail';
import EditProfile from './pages/Profile/EditProfile';
import ProfilePage from './pages/Profile/ProfilePage';
import SeeProfile from './pages/Profile/SeeProfile';
import RestaurantList from './pages/RestaurantList';
import Review from './pages/Review/Review';
import ReviewComponent from './pages/Review/Reviews';
import AdminRoutes from './protected_routes/AdminRoutes';

function App() {
  const DisplayNavbar = () => {
    const location = useLocation();
    const hideNavbarRoutes = ['/login', '/register', '/sendemail', '/verifytoken'];

    if (hideNavbarRoutes.includes(location.pathname.toLowerCase())) {
      return null;
    }
    return <Navbar />;
  };

  const DisplayFooter = () => {
    const location = useLocation();
    const hideFooterRoutes = ['/login', '/register', '/sendemail', '/verifytoken'];

    if (hideFooterRoutes.includes(location.pathname.toLowerCase())) {
      return null;
    }
    return <Footer />;
  };
  return (
    <Router>
      <DisplayNavbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/editprofile' element={<EditProfile />} />
        <Route path='/seeprofile' element={<SeeProfile />} />
        <Route path='/restaurant' element={<RestaurantList />} />
        <Route path='/descriptionpage/:_id' element={<DescriptionPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/userorderlist' element={<OrderList />} />
        <Route path='/payment' element={<Khalti />} />
        <Route path='/review' element={<Review />} />
        <Route path='/reviewlist' element={<ReviewComponent />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/sendemail" element={<SendEmail />} />
        <Route path="/verifytoken" element={<ForgotPassword />} />

        {/* <Route element={<UserRoutes />}>
          <Route path='/profile' element={<h1>Profile</h1>} />
        </Route> */}


        <Route element={<AdminRoutes />} >
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/edit/:id' element={<AdminEditFood />} />
          <Route path='/admin/restaurant' element={<AdminRestaurant />} />
          <Route path='/admin/orderlist' element={<AdminOrderList />} />

        </Route>

      </Routes>
      <DisplayFooter />
    </Router>
  );
}

export default App;
