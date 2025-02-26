export const formatDate = (isoDate) => {
    const data = new Date(isoDate);
    return data.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}