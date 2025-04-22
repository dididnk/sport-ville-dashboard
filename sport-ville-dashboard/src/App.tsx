import Home from "./pages/home/Home"
import './styles/globals.scss'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Users from "./pages/users/users";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";

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
