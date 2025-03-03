import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Card from '../product/Card';
import { useAllProducts } from '../product/useProducts';

const RelatedProducts = () => {
    const { data, isLoading, isError } = useAllProducts();

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    // Kiểm tra nếu đang tải hoặc có lỗi
    if (isLoading) return <div>Đang tải sản phẩm...</div>;
    if (isError) return <div>Có lỗi xảy ra khi tải sản phẩm.</div>;

    // Lấy danh sách sản phẩm từ data (với cấu trúc phân trang)
    const products = data?.pages?.flatMap((page) => page.products) || [];

    // Kiểm tra nếu không có sản phẩm
    if (products.length === 0) {
        return <div>Không có sản phẩm nào để hiển thị.</div>;
    }

    return (
        <div className='mt-[50px] md:mt-[100px] mb-[100px] md:mb-0'>
            <div className='text-2xl font-bold mb-5'>Có thể bạn sẽ thích</div>
            <Carousel
                responsive={responsive}
                containerClass='-mx-[10px]'
                itemClass='px-[10px]'
            >
                {products.map((product) => (
                    <Card key={product._id} product={product} />
                ))}
            </Carousel>
        </div>
    );
};

export default RelatedProducts;
