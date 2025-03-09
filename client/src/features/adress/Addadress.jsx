import React from 'react';
import AddAdddress from './AddAdddress';

const Addadress = () => {
  const openModal = () => {
    const modal = document.getElementById("adress_model");
    if (modal) {
      modal.showModal(); 
    }
  };

  return (
    <div className='section'>
      <div className='flex px-2 justify-between items-center'>
        <h1 className='text-2xl font-semibold'>My Address</h1>
        <button className='btn btn-neutral' onClick={openModal}>Thêm Address</button>  
      </div>
      <h1>table</h1>
      <AddAdddress />
    </div>
  );
};

export default Addadress;
