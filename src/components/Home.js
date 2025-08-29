import React from "react";
import "../style/Home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import ResetPassword from "./home/ResetPassword";
import HomePlans from "./HomePlans";
import StoreMap from "./home/Map";
import HomeArticles from "./HomeArticles";

import Lottie from "lottie-react";
import ImageProcessingLotty from "../assets/AI_image_processing.json";
import CookingLotty from "../assets/cooking.json";
import DeliveryLotty from "../assets/delivery.json";
import OrganicFarmingLotty from "../assets/organic_farming.json";

const Home = () => {
  const [isResetPasswordOn, setIsResetPasswordOn] = React.useState(false);

  return (
    <>
      <div className="home-container">
        {/* 🔹 Header with global navigation */}
        <Header />

        {/* 🔹 Hero Section */}
        <motion.div
          className="header-div"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="logo_div">
            <img className="logo_img" src="/logo_transparent.svg" alt="Logo" />
          </div>
          <div className="text-1">
            <p className="text-11">STAY</p>
            <p className="text-11">HEALTHY</p>
            <p className="text-11">WITH</p>
            <p className="text-12">US</p>
            {/* <Link to="/plans" className="cta-button" style={{ marginTop: "20px" }}>
              Explore Plans →
            </Link> */}
          </div>
        </motion.div>
{/* 🔹 Plans Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <HomePlans />
        </motion.div>
        {/* 🔹 Story Section */}
        <motion.div
          className="q1"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="q1-h1">From Our Kitchen to Your Plate, With Love</p>
          <div className="q1-section">
            {/* <div className="q1-step">
              <Lottie
                animationData={OrganicFarmingLotty}
                loop
                autoplay
                style={{ width: 150, height: 150, margin: "auto" }}
              />
              <p className="q1-p">
                It all starts with organic farms — free from chemicals, full of care.
                Every ingredient we use is grown with nature's touch.
              </p>
            </div>
            <div className="q1-step">
              <Lottie
                animationData={ImageProcessingLotty}
                loop
                autoplay
                style={{ width: 150, height: 150, margin: "auto" }}
              />
              <p className="q1-p">
                Every vegetable is scanned using AI to ensure top-notch freshness
                before it enters our kitchen.
              </p>
            </div> */}
            <div className="q1-step">
              <Lottie
                animationData={CookingLotty}
                loop
                autoplay
                style={{ width: 150, height: 150, margin: "auto" }}
              />
              <p className="q1-p">
                In our spotless kitchens, food is prepared with the same love and
                hygiene as a mother’s kitchen.
              </p>
            </div>
            <div className="q1-step">
              <Lottie
                animationData={DeliveryLotty}
                loop
                autoplay
                style={{ width: 150, height: 150, margin: "auto" }}
              />
              <p className="q1-p">
                Finally, it reaches your doorstep — warm, fresh, and full of goodness.
              </p>
            </div>
          </div>
        </motion.div>

        

        {/* 🔹 Social Proof (Testimonials / Counters) */}
        {/* <motion.div
          className="q1"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="q1-h">
            <b>Trusted by Thousands</b>
          </p>
          <p className="q1-p" style={{ textAlign: "center" }}>
            10,000+ meals delivered • 95% customer satisfaction • 300+ daily users
          </p>
        </motion.div> */}

        {/* 🔹 Presence Section (Map) */}
        {/* <div className="q1">
          <p className="q1-h">
            <b>Our Presence</b>
          </p>
          <StoreMap />
        </div> */}

        {/* 🔹 Keto Recipe Teaser */}
        <div className="q1">
          <p className="q1-h">
            <b>Explore Our Keto Recipes</b>
          </p>
          <p className="q1-p">
            Our keto recipes are designed to be delicious, nutritious, and easy to
            prepare. Perfect for both beginners and enthusiasts.
          </p>
          <Link to="/recipes" className="cta-button" style={{ marginTop: "10px" }}>
            Explore Recipes →
          </Link>
        </div>

        {/* 🔹 Join Now */}
        <div className="q1 div-small">
          <p className="q1-h">Haven't joined yet?</p>
          <a href="/regform">
            <p className="join-now">Join Now</p>
          </a>
        </div>

        {/* 🔹 Login / Reset Password */}
        <div className="q1">
          {isResetPasswordOn ? <ResetPassword /> : <Login />}
          <div className="forgot_btn_div">
            <button
              className="forgot_pas_btn"
              onClick={() => setIsResetPasswordOn(!isResetPasswordOn)}
            >
              {isResetPasswordOn ? "Back to Login" : "Forgot password?"}
            </button>
          </div>
        </div>

        {/* 🔹 Articles / Blogs */}
        <HomeArticles />

        {/* 🔹 Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
