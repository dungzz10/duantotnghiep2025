import React from 'react'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Categories from '../components/Categories'
import Products from './product/Products'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div>
    <Header></Header>
      <Banner></Banner>
      <Categories></Categories>
      <Products></Products>
      <Footer></Footer>
    </div>
  )
}

export default HomePage