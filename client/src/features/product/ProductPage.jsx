import React from 'react'
import { Link } from 'react-router-dom'

const ProductPage = () => {
  return (
    <>
      {/*
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}
      <section className="relative bg-[url(https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
              Let us find your
              <strong className="block font-extrabold text-rose-500">
                {" "}
                Forever Home.{" "}
              </strong>
            </h1>
            <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
              illo tenetur fuga ducimus numquam ea!
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-center">
              <a
                href="#"
                className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
              >
                Get Started
              </a>
              <a
                href="#"
                className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow hover:text-rose-700 focus:outline-none focus:ring active:text-rose-500 sm:w-auto"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>


      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-[36px]">Tất cả sản phẩm</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            {/* More products... */}
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-[36px]">Sản phẩm đang giảm giá</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            {/* More products... */}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductPage