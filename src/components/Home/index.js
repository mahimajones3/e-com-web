import './index.css';
import { Link } from 'react-router-dom';
import Header from '../Header';

const Home = () => {
  return (
   <div>
      <Header />
      <div className="home-container">
      <div className="hero-section">
        <h1>Discover the Best Deals on Your Favorite Products!</h1>
        <p>Hello Everyone!!! Your one-stop destination for high-quality products at unbeatable prices.
           From trendy fashion and electronics to home essentials and more, we bring you a curated selection of items to suit your lifestyle.
           Shop with confidence and enjoy fast delivery, secure payments, and exceptional customer service. Start exploring now!</p>
      </div>
      <div className='img-container'>
        <img src='https://i1.wp.com/billionaire365.com/wp-content/uploads/2019/02/Ecommerce-Website.jpg?fit=2048%2C1452&ssl=1' alt="home-img" className='home-img'/>
      </div>

    </div>
    <Link to="/products" className="btn">Shop Now</Link>

   </div>
    
  );
};     
export default Home;