import React from 'react'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Handpick from '../components/Handpick'
import Products from '../components/Product'
import DiscountHero from '../components/DiscountHero'
import Fotter from '../components/Fotter'
import Review from "../components/Review"
import ProductsSection from "../components/ProductsSection"

function Home() {
  return (
    <div style={{ backgroundColor: "#f8fafc" }}>
      <Header />
      <Banner />
      <Handpick />
      <Products />
      <ProductsSection />
      <DiscountHero />
      <Review />
      <Fotter />
    </div>
  )
}

export default Home
