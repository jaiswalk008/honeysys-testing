import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import { useEffect, useRef, useState } from 'react';
import { MenuIcon } from './utils/icons';
import Login from './pages/Login';
import Create from './components/Create';
import Saved from './components/Saved';
import { ToastContainer } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import Analytics from './pages/Analytics';
export const webSocketURL = `${process.env.REACT_APP_WEBSOCKET_KEY}`;

function App() {
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState(true);

  let location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      setFlag(false);
    } else {
      setFlag(true);
    }
  }, [location, flag]);

  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.expiry < currentTime;
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('AccessToken');

    if (!token || isTokenExpired(token)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  let reference_content = useRef();
  let reference_container = useRef();

  useEffect(() => {
    if (flag) return;
    if (open) {
      reference_content.current.style.opacity = '1';
      reference_container.current.style.width = 'max-content';
    } else {
      reference_content.current.style.opacity = '0';
      reference_container.current.style.width = '4rem';
    }
  }, [open, flag]);

  return (
    <div className="text-black  font-Poppins" id="home">
      <div className="flex flex-col h-screen overflow-hidden font-monda">
        <Header />
        <div className={`bg-image flex h-full w-full bg-white `}>
          {!flag && (
            <div className={`   pt-5 lg:hidden absolute z-[100] h-fit`} ref={reference_container}>
              <img
                src={MenuIcon}
                alt="baricon"
                onClick={() => setOpen(!open)}
                className="pb-10 pl-5 cursor-pointer"
              />
              <div className="bg-white opacity-0" ref={reference_content}>
                {open && <Sidebar open={open} setOpen={setOpen} text="mob" />}
              </div>
            </div>
          )}
          {!flag && <Sidebar className="hidden lg:block" />}
          <div className="h-full w-full overflow-scroll scroll-style bg-[#F4FDFF]">
            <Routes>
              <Route
                path="/home"
                element={
                  <>
                    <Home />
                  </>
                }
              />
              <Route
                path="/create"
                element={
                  <>
                    <Create />
                  </>
                }
              />
              <Route
                path="/saved"
                element={
                  <>
                    <Saved />
                  </>
                }
              />
               <Route
              path="/analytics"
              element={
                <>
                  <Analytics />
                </>
              }
            />
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </div>
      </div>
      <ToastContainer
        autoClose={3000}
        position="top-right"
        closeButton={false}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
