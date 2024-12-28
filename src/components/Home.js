import React from 'react'
import '../style/Home.css';
import Login from './Login';
import Footer from './Footer';
import Header from './Header';
import HomePlans from './HomePlans';
import StoreMap from './home/Map';

const Home = () => {



  return (
    <>
      <Header />
      <div className='home-container' >
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
        <div className='q1' >
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

          
        </div>
        <HomePlans />
          <div className='q1' >
            <p className='q1-h'>

              <b>Our Presence</b></p>
            <StoreMap />

          </div>
        <br />
        <div className='q1 div-small'>
          <p className='q1-h'>Haven't joined yet ?</p>
          <a href='/regform' ><p className='join-now'>join now</p></a>

        </div>

        <Login />

        <div className='div-small' >

          <br />

        </div>

      </div>

      <Footer />
      {/* <div class="wave">
  
  
</div> */}
    </>
  )
}

export default Home
