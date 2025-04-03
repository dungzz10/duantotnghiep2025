import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <div className="containerCustom">
        <Toaster position="top-center" reverseOrder={false} />
        <Outlet></Outlet>
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;
