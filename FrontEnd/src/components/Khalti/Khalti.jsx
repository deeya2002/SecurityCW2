import KhaltiCheckout from "khalti-checkout-web";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderPayment } from "../../apis/Api";
import config from './khaltiConfig';

const Khalti = () => {

  const navigate = useNavigate ();
  const handleSubmit= async(e)=>{
    e.preventDefault();
    console.log("COD")
    const res=await orderPayment({paymentType:"COD"});
    console.log(res?.data)
    if (res.data.success === false) {
      toast.error (res.data.message);
    } else {
      toast.success ("Ordered the food");
      navigate ('/home');
    }
  }


  let checkout = new KhaltiCheckout(config);
  let buttonStyles ={
    backgroundColor:'purple',
    padding:'10px',
    color:'white',
    cursor:'pointer',
    fontWeight:'bold',
    border: '1px solid white'

  };

  return (
    <div>
        <h3>Payment Method</h3>
   <button onClick={()=> checkout.show({amount: 1000})} style={buttonStyles}>Pay Via Khalti</button>  <br></br> 
   <button className="btn btn-outline-success " onClick={handleSubmit}>Cash on delivery</button>
  
    </div>
   
  )
}

export default Khalti ;
