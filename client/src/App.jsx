
import { Outlet } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'


function App() {
  

  return (
    <>
    <div className='containerCustom'>
    <Toaster position="top-center" reverseOrder={false} />
     <Outlet></Outlet>

    </div>
     
        
    </>
  )
}

export default App

