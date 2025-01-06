import React from "react";

const AboutPage = () => {
  return (
    <main>
      <section className="flex py-16">
        <div className="container max-w-screen-xl m-auto text-center mx-12 ml-16 ">
          <div className="ml-20">
            <img
              src="https://acabiz.vn/backend/images/blog_images/614844501.jpg"
              alt
              classname="pl-14 h-28"
            />
          </div>
          <div>
            <h3 className="font-bold text-2xl py-4 ">Free ship</h3>
            <p className>
              Shop miễn phí giao hàng cho các sản phẩm có hóa đơn trên 200k
            </p>
          </div>
        </div>
        <div className="container max-w-screen-xl m-auto text-center mx-12 ">
          <div className="ml-20">
            <img
              src="https://magiamgia.com/wp-content/uploads/2020/12/fnal-logo.png"
              alt
              classname="pl-14 h-28"
            />
          </div>
          <div>
            <h3 className="font-bold text-2xl py-4 ">Giảm giá</h3>
            <p className>
              Shop luôn có chương trình giảm giá trong các ngày đặc biệt trong
              năm như ngày lễ tết, ngày sinh nhật shop,...
            </p>
          </div>
        </div>
        <div className="container max-w-screen-xl m-auto text-center mx-12 ">
          <div className="ml-20">
            <img
              src="https://hatdoimackhen.com/wp-content/uploads/2021/01/cach-doi-tra-hang-tren-qua-mien-bac.jpg"
              alt
              classname="pl-14 h-28"
            />{" "}
          </div>
          <div>
            <h3 className="font-bold text-2xl py-4 ">Hoàn trả</h3>
            <p className>
              Hỗ trợ đổi size hoặc trả hàng nếu sản phẩm lỗi hoặc giao nhầm hàng
              hoàn toàn miễn phí (có video bóc hàng)
            </p>
          </div>
        </div>
      </section>
      <section className=" container max-w-screen-xl grid grid-cols-2 mx-16 ">
        <div className=" *:mt-4 w-full">
          <img src="./assets/images/about2.png" alt />
        </div>
        <div classname=" pt-8 ml-2">
          <h2 classname="font-bold text-[32px]">GIỚI THIỆU CHUNG VỀ SHOP</h2>
          <p classname="font-normal mt-4 text-[18px]">
            ra đời vào năm 2020, với mong muốn mang đến cho khách hàng những sản
            phẩm giày chất lượng cao và phong cách đa dạng. Đội ngũ của chúng
            tôi là những người đam mê thời trang và luôn tìm kiếm những mẫu giày
            mới nhất để phục vụ bạn.
          </p>
          <p classname="font-normal mt-2 text-[18px]">
            Chúng tôi cam kết mang đến những sản phẩm giày chất lượng, được sản
            xuất từ nguyên liệu tốt nhất và kiểm tra kỹ lưỡng trước khi đến tay
            khách hàng.
          </p>
          <p classname="font-normal mt-2 text-[18px]">THÔNG TIN LIÊN LẠC</p>
          <p classname="font-normal mt-1 text-[15px]">
            Địa chỉ: Số 10 LK28 KĐT Vân Canh, Hoài Đức, Hà Nội
          </p>
          <p classname="font-normal mt-1 text-[15px]">Sdt: 0123456789</p>
          <p classname="font-normal mt-1 text-[15px]">
            Email: shophoaiducgmail.com.vn
          </p>
        </div>
      </section>
      <section className="my-16 ">
        <div className="mb-4 mx-96 ">
          <h2 className="font-bold text-[32px] text-center ">
            SẢN PHẨM NỔI BẬT
          </h2>
        </div>
        <div className="grid grid-cols-4 mx-16 ">
          <div className="overflow-hidden">
            <img
              src="https://sneakerhs.com/wp-content/uploads/2021/05/giay-Air-Jordan-1-Retro-High-OG-University-Blue-rep-11-gia-re-ha-noi-1536x1536.jpg"
              alt
              classname="hover:scale-125 duration-1000 "
            />
          </div>
          <div className="overflow-hidden">
            <img
              src="http://sadoza.com/upload/product/gtt02/giay-nam-the-thao-dep-unisex-thoai-mai-tre-trung.jpg"
              alt
              classname="hover:scale-125 duration-1000 "
            />
          </div>
          <div className="overflow-hidden">
            <img
              src="https://salt.tikicdn.com/ts/tmp/ed/16/bd/c0690f1303dff3ea4e2804aa10baf7a4.jpg"
              alt
              classname="hover:scale-125 duration-1000 h-30 "
            />
          </div>
          <div className="overflow-hidden">
            <img
              src="https://giaythainguyen.com/wp-content/uploads/2020/04/giay-micky-2.jpg"
              alt
              classname="hover:scale-125 duration-1000 "
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
