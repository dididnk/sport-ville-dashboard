import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import './app/styles/globals.scss'
import Home from "./app/pages/home/Home";
import Login from "./app/pages/login/Login";
import Users from "./app/pages/users/users";

import Navbar from "./app/components/navbar/Navbar";
import Footer from "./app/components/footer/Footer";
import Menu from "./app/components/menu/Menu";

function App() {

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>

          <div className="contactContainer">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: 'users',
          element: <Users />
        },
      ]
    },
    {
      path: 'login',
      element: <Login />
    }
  ]);


  return (
    <RouterProvider router={router} />
  )
}

export default App
