import React from 'react'
import '../style/Home.css';
import Login from './Login';
import Footer from './Footer';
import Header from './Header';
import HomePlans from './HomePlans';
import StoreMap from './home/Map';
import HomeArticles from './HomeArticles';
import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import ImageProcessingLotty from "../assets/AI_image_processing.json";
import CookingLotty from "../assets/cooking.json";
import DeliveryLotty from "../assets/delivery.json";
import OrganicFarmingLotty from "../assets/organic_farming.json";
import ResetPassword from './home/ResetPassword';

const Home = () => {
const [isResetPasswordOn, setIsResetPasswordOn] = React.useState(false);


  return (
    <>
      
     
      <div className='home-container' >
      <Header />
      <div className="info-section animate-fade-in delay-400">
        <strong>300+ surveys already submitted</strong>
          <h2>Help Us Understand Your Needs</h2>
          <p>
            We're creating a revolutionary meal service tailored to your preferences.
            Help us by taking our survey and shape the future of food delivery!
          </p>
          
          <Link to ="/survey/marketsize" className="cta-button">
            Take Our Survey
          </Link>
        </div>
        <div className='header-div'>
          <div className='logo_div'>
            <img className='logo_img' src='/logo_transparent.svg' />

          </div>
          <div className='text-1'>
            <p className='text-11'>STAY</p>
            <p className='text-11'>HEALTHY</p>
            <p className='text-11'>WITH</p>
            <p className='text-12'>US</p>
          </div>
        </div>
        {/* <div className='q1' >
          <p className='q1-h'>Meal Delight

          </p>
          <p className='q1-p'>Meal Delight is your go-to kitchen for fresh, hygienic, and healthy meals that taste just like home. We bring the comfort of home-cooked food straight to your door step, ensuring every bite is nutritious and full of care

          </p><p className='q1-p'>

            Our dedicated team has made a pledge to provide fresh, hygienic meals to every individual who, due to their busy lives, finds it challenging to prepare food. We are here to ensure that you never have to compromise on health or taste, even on your busiest days


          </p>
        </div>
        <div className='q1' >
          <p className='q1-h'>Why Choose Us ?</p>
          <p className='q1-p'>

            <b>Our Vision</b>
            <p>To make a Healthy India by providing fresh, nutritious, and chemical-free meals that promote overall well-being.</p>

          </p>
          <p className='q1-p'>

            <b>Our Promise</b>


            <p>We use fresh mustard oil, rich in healthy fats, to enhance both taste and nutrition.

            </p>
            <p>Our in-house ground spices ensure no chemicals, preservatives, or additives, giving you authentic and pure flavors.
            </p>


          </p>

          <p className='q1-p'>
            <b>Health Impact of Unhygienic Food and Refined Ingredients</b>


            <p>
              <b>80%</b> of heart diseases are linked to the consumption of refined oils, which are low in essential nutrients and high in unhealthy fats.
            </p>
            <p>
              Nearly <b>60%</b> of gastrointestinal infections are caused by consuming unhygienic food and adulterated spices.
            </p>
            <p>
              Refined and packed spices often contain chemicals that can lead to long-term health issues, including digestive problems and increased risk of chronic diseases like cancer.

            </p>

          </p>
          <br />

          
        </div> */}
        <div className='q1'>
  <p className='q1-h1'>From Farm to Your Plate, With Love</p>
  <div className='q1-section'>
    {/* 1. Organic Farming */}
    <div className='q1-step'>
    <Lottie animationData={OrganicFarmingLotty} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />

      <p className='q1-p'>
        It all starts with organic farms — free from chemicals, full of care. Every ingredient we use is grown with nature's touch.
      </p>
    </div>

    {/* 2. AI Quality Testing */}
    <div className='q1-step'>
    <Lottie animationData={ImageProcessingLotty} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />

      <p className='q1-p'>
        Every vegetable is scanned using AI image processing to ensure top-notch quality, color, and freshness before it enters our kitchen.
      </p>
    </div>

    {/* 3. Hygienic Cooking */}
    <div className='q1-step'>
    <Lottie animationData={CookingLotty} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />

      <p className='q1-p'>
        In our spotless kitchens, your food is prepared with the same love, care, and hygiene as a mother’s kitchen.
      </p>
    </div>

    {/* 4. Fresh Delivery */}
    <div className='q1-step'>
    <Lottie animationData={DeliveryLotty} loop autoplay style={{ width: 150, height: 150,marginLeft:'auto',marginRight:'auto' }} />

      <p className='q1-p'>
        Finally, it reaches your doorstep — warm, fresh, and full of the goodness your body deserves.
      </p>
    </div>
  </div>
</div>

        <HomePlans />
          <div className='q1' >
            <p className='q1-h'>

              <b>Our Presence</b></p>
            <StoreMap />

          </div>
        <br />

        <div className='q1' >
            <p className='q1-h'>

              <b>Explore Our Keto Recipe</b></p>
            
            <p className='q1-p'>

              Our keto recipes are designed to be delicious, nutritious, and easy to prepare. Whether you're a seasoned keto enthusiast or just starting out, our recipes will help you stay on track while enjoying every bite.
</p>
<Link style={{textDecoration:'underline'}} to="/recipes" className='q1-p'>Explore</Link>
          </div>
        <br />

        <div className='q1 div-small'>
          <p className='q1-h'>Haven't joined yet ?</p>
          <a href='/regform' ><p className='join-now'>join now</p></a>

        </div>
     
     {(isResetPasswordOn) ?  <ResetPassword/> : <Login /> }
        
       
        <div className='forgot_btn_div' >
    <button className='forgot_pas_btn' onClick={() => setIsResetPasswordOn(!isResetPasswordOn)}>
      {(isResetPasswordOn) ? 'Login': 'Forget password?'}
    </button>
</div>
        
        <HomeArticles/>
        <div className='div-small' >

          <br />

        </div>
        <Footer />
      </div>
      
     
      {/* <div class="wave">
  
  
</div> */}
    </>
  )
}

export default Home
