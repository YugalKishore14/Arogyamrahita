import React from 'react'
// import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Category from '../components/Category'
import Banner from '../components/Banner'
import Handpick from '../components/Handpick'
import Products from '../components/Product'
import DiscountHero from '../components/DiscountHero'
import Fotter from '../components/Fotter'
import Review from "../components/Review"
import ProductsSection from "../components/ProductsSection"

function Home() {
  return (
    <div>
      <Header />
      <Banner />
      <Category />
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
