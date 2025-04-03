export const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:5000"; // URL cho môi trường phát triển
    } else {
        return "https://webbanhang-delta-green.vercel.app"; // URL cho môi trường sản xuất
    }
}
