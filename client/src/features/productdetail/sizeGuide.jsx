import { useState } from 'react';

const SizeGuide = ({ availableSizes, selectedSize, setSelectedSize }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className='mb-2'>
            {/* HEADING START */}
            <div
                className='text-md font-medium text-black/[0.5] cursor-pointer underline'
                onClick={() => setShowModal(true)}
            >
                Hướng dẫn chọn size
            </div>
            {/* HEADING END */}


            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-md max-w-lg w-full shadow-lg">
                        <img src="/src/assets/dosize.jpg" alt="" />
                        <button
                            className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() => setShowModal(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SizeGuide;
