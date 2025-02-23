import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  return (
    <div className="relative text-[20px] w-full max-w-[1360px] mx-auto text-white">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showIndicators={false}
        showStatus={false}
      >
        <div>
          <img src="/src/assets/slide-1.png" />
        </div>
        <div>
          <img src="/src/assets/slide-2.png" />
        </div>
        <div>
          <img src="/src/assets/slide-3.png" />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
