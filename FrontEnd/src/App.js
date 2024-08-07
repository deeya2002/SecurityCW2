import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Register from './pages/Register';

// for showing toast messages
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Khalti from './components/Khalti/Khalti';
import Cart from './pages/Cart';
import DescriptionPage from './pages/DescriptionPage';
import EditProfile from './pages/EditProfile';
import ForgotPasswordCode from './pages/ForgetPasswordCode';
import Login from './pages/Login';
import OrderList from './pages/Orderlist';
import ProfilePage from './pages/ProfilePage';
import ResetPassword from './pages/ResetPassword';
import RestaurantList from './pages/RestaurantList';
import Review from './pages/Review';
import ReviewComponent from './pages/Reviews';
import SeeProfile from './pages/SeeProfile';
import SendEmail from './pages/SendEmail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEditFood from './pages/admin/AdminEditFood';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminRestaurant from './pages/admin/AdminRestaurant';
import AdminRoutes from './protected_routes/AdminRoutes';

function App() {
  const DisplayNavbar = () => {
    const location = useLocation();
    const hideNavbarRoutes = ['/login', '/register'];

    if (hideNavbarRoutes.includes(location.pathname.toLowerCase())) {
      return null;
    }
    return <Navbar />;
  };

  const DisplayFooter = () => {
    const location = useLocation();
    const hideFooterRoutes = ['/login', '/register'];

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
        <Route path='/sendemail' element={<SendEmail />} />
        <Route path='/resetcode' element={<ForgotPasswordCode />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/restaurant' element={<RestaurantList />} />
        <Route path='/descriptionpage/:_id' element={<DescriptionPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/userorderlist' element={<OrderList />} />
        <Route path='/payment' element={<Khalti />} />
        <Route path='/review' element={<Review />} />
        <Route path='/reviewlist' element={<ReviewComponent />} />

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
