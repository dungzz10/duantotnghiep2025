import React from 'react'
import Header from '../compodents/Header'
import Banner from '../compodents/Banner'
import Categories from '../compodents/Categories'
import Products from './product/Products'
import Footer from '../compodents/Footer'

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