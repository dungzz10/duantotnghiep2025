import React from "react";

const BannerFooter = () => {
  return (
    <div className=" mx-auto px-4 py-10 my-5 bg-stone-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex justify-center sm:justify-start">
          <div className="flex items-center space-x-3">
            <div className="banner-footer-icon">
              {/* Icon for Free Delivery */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="55"
                height="32"
                viewBox="0 0 55 32"
                className="fill-current text-gray-700"
              >
                {/* Icon path for Free Delivery */}
                <path d="M14.9999 27.4286H10.4285C10.1254 27.4286 9.83471 27.3082 9.62038 27.0938C9.40605 26.8795 9.28564 26.5888 9.28564 26.2857C9.28564 25.9826 9.40605 25.6919 9.62038 25.4776C9.83471 25.2633 10.1254 25.1429 10.4285 25.1429H14.9999C15.303 25.1429 15.5937 25.2633 15.8081 25.4776C16.0224 25.6919 16.1428 25.9826 16.1428 26.2857C16.1428 26.5888 16.0224 26.8795 15.8081 27.0938C15.5937 27.3082 15.303 27.4286 14.9999 27.4286Z" />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h5 className="text-lg font-semibold">Miễn Phí Vận Chuyển</h5>
              <p className="text-sm text-gray-600">
                Miễn phí vận chuyển sản phẩm khi mua trên $500 và nhận giảm giá
                trên sản phẩm.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <div className="banner-footer-icon">
              {/* Icon for 7 Days Return */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 45 45"
                className="fill-current text-gray-700"
              >
                {/* Icon path for 7 Days Return */}
                <path d="M44.9556 32.1431C44.6995 29.5083 43.3504 27.1104 41.1568 25.391C40.3108 24.7279 39.35 24.1736 38.2904 23.7322V11.8524C38.2904 11.729 38.258 11.6077 38.1962 11.5009C38.1345 11.394 38.0458 11.3052 37.9389 11.2435L19.4968 0.596001C19.3899 0.534289 19.2686 0.501801 19.1452 0.501801C19.0218 0.501801 18.9005 0.534289 18.7937 0.596001L0.351562 11.2435C0.244665 11.3052 0.155896 11.394 0.0941818 11.5009C0.0324681 11.6077 -1.4679e-05 11.729 4.97629e-09 11.8524V33.1475C-1.4679e-05 33.271 0.0324681 33.3922 0.0941818 33.4991C0.155896 33.606 0.244665 33.6947 0.351562 33.7564L18.7937 44.4039C18.9005 44.4657 19.0218 44.4981 19.1452 44.4981C19.2686 44.4981 19.3899 44.4657 19.4968 44.4039L37.9389 33.7564C38.0809 33.674 38.1895 33.5444 38.2459 33.3901C38.7256 34.009 39.0578 34.7028 39.2147 35.4341C39.7946 38.1357 38.0473 40.7623 34.6548 42.2889C34.5082 42.3549 34.3887 42.4692 34.3161 42.6126C34.2436 42.7561 34.2224 42.9201 34.256 43.0773C34.2897 43.2345 34.3763 43.3755 34.5012 43.4766C34.6262 43.5778 34.7821 43.633 34.9429 43.6332C34.9878 43.6332 35.0332 43.6289 35.0787 43.62C38.3336 42.9813 40.9975 41.4671 42.7825 39.2411C44.4292 37.1879 45.2009 34.6671 44.9556 32.1431Z" />
              </svg>
            </div>
            <div className="text-center">
              <h5 className="text-lg font-semibold">7 Ngày Đổi Trả</h5>
              <p className="text-sm text-gray-600">
                Sản phẩm có thể được trả lại theo chính sách đổi trả với các
                điều khoản và điều kiện.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <div className="banner-footer-icon">
              {/* Icon for Payment Secure */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 45 45"
                className="fill-current text-gray-700"
              >
                {/* Icon path for Payment Secure */}
                <path d="M3 2h18c1.1 0 1.99.9 1.99 2L21 19c0 1.1-.89 2-1.99 2H3c-1.1 0-1.99-.9-1.99-2L3 4c0-1.1.89-2 1.99-2zm0 2v14h18V6H3zm9 9c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
              </svg>
            </div>
            <div className="text-center">
              <h5 className="text-lg font-semibold">Thanh Toán An Toàn</h5>
              <p className="text-sm text-gray-600">
                Thanh toán sẽ an toàn và thông tin thẻ của bạn sẽ không bị
                tiết lộ.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end">
          <div className="flex items-center space-x-3">
            <div className="banner-footer-icon">
              {/* Icon for Original Product */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 45 45"
                className="fill-current text-gray-700"
              >
                {/* Icon path for Original Product */}
                <path d="M41.6326 26.5428L38.203 20.6028C38.123 20.4642 37.9981 20.357 37.8489 20.299L30.6079 17.4836C30.8384 16.705 30.9553 15.8972 30.9549 15.0853C30.9549 10.4231 27.162 6.6302 22.4998 6.6302C17.8376 6.6302 14.0447 10.4231 14.0447 15.0853C14.0443 15.8972 14.1612 16.705 14.3917 17.4836L7.15067 20.299C7.0015 20.357 6.87658 20.4642 6.79656 20.6028L3.36698 26.5428C3.31626 26.6306 3.28513 26.7283 3.27573 26.8293C3.26633 26.9302 3.27888 27.032 3.31252 27.1277C3.34616 27.2233 3.40009 27.3105 3.47061 27.3834C3.54114 27.4562 3.62658 27.513 3.72109 27.5497L6.70225 28.7089V38.3839C6.70226 38.5256 6.74508 38.6639 6.8251 38.7809C6.90512 38.8978 7.0186 38.9878 7.15067 39.0392L22.2449 44.9082C22.4088 44.972 22.5906 44.972 22.7545 44.9082L37.8488 39.0392C37.9808 38.9878 38.0943 38.8978 38.1743 38.7809C38.2543 38.6639 38.2972 38.5256 38.2972 38.3839V28.7089L41.2783 27.5497C41.3728 27.5129 41.4582 27.4562 41.5287 27.3833C41.5992 27.3105 41.6531 27.2233 41.6868 27.1276C41.7205 27.032 41.7331 26.9302 41.7238 26.8293C41.7144 26.7283 41.6833 26.6306 41.6326 26.5428Z" />
              </svg>
            </div>
            <div className="text-center">
              <h5 className="text-lg font-semibold">Sản Phẩm Chính Hãng</h5>
              <p className="text-sm text-gray-600">
                Bạn sẽ nhận được sản phẩm chính hãng và đảm bảo chất lượng
                sản phẩm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerFooter;
