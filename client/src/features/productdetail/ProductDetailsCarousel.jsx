import React from 'react'
import { Carousel } from 'react-responsive-carousel'
const ProductDetailsCarousel = ({product}) => {
  console.log(product); 
  return (
    <div className='text-white text-[20px] w-full max-w-[1360px] mx-auto sticky top-[50px]'>
    <Carousel
        infiniteLoop={true}
        showIndicators={false}
        thumbWidth={60}
        showStatus={false}
        className='productCarousel'
    >

    {product?.map((img, index) => (
        <img
          key={img._id} // Sử dụng _id làm key
          src={img.url} // Truy cập vào url trong từng object
          alt={`Slide ${index + 1}`}
          className="carousel-image"
        />
      ))}
    </Carousel>
</div>
  )
}

export default ProductDetailsCarousel