import React from "react";

const Card = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
          className="h-56"
        />
      </figure>
      <div className="card-body 800px:p-4">
        <h2 className="card-title">
          Shoes!
          <div className="badge badge-neutral p-4 rounded-lg uppercase">brand here</div>
          <div className="badge badge-primary">NEW</div>
        </h2>
        <h1 className="text-2xl">price here</h1>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Fashion</div>
          <div className="badge badge-outline">Products</div>
        </div>
        <p className="text-sm font-light text-gray-400 "> time</p>
      </div>
    </div>
  );
};

export default Card;
