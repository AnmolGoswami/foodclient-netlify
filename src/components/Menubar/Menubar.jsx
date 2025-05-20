import React, { useContext } from 'react';
import './menubar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Menubar = () => {
  const navigate = useNavigate();
  const { quantity, token, setToken,setQuantity } = useContext(StoreContext);

  // Safely calculate cart quantity
  const cartQuantity = Object.values(quantity || {}).reduce((a, b) => a + b, 0);

  const logout = () => {
    localStorage.removeItem('token');
    setToken("");
    setQuantity({});
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <img src={assets.logo} alt="Logo" className="logo" />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/explore">Explore</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>

          <div className="menubar-right d-flex align-items-center gap-3">
            <div className="position-relative">
              <Link to="/cart">
                <img src={assets.cart} className="cart position-relative" alt="Cart" />
                {cartQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartQuantity}
                  </span>
                )}
              </Link>
            </div>

            <div>
              {!token ? (
                <>
                  <button onClick={() => navigate('/login')} className="btn btn-outline-primary me-2">Login</button>
                  <button onClick={() => navigate('/register')} className="btn btn-outline-success">Register</button>
                </>
              ) : (
                <div className="dropdown text-end">
                  <button
                    className="btn d-block link-dark text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      width={32}
                      height={32}
                      src={assets.profile}
                      className="rounded-circle"
                      alt="Profile"
                    />
                  </button>

                  <ul className="dropdown-menu text-small">
                    <li>
                      <button className="dropdown-item" onClick={() => navigate('/orders')}>
                        Orders
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
