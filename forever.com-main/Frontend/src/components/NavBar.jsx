import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const [mobileVisible, setMobileVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } =
    useContext(ShopContext);
  const profileRef = useRef(null);
  const lastScrollY = useRef(0);

  const links = [
    { path: "/", label: "HOME" },
    { path: "/collection", label: "COLLECTION" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setProfileVisible(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Disable scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileVisible ? "hidden" : "unset";
  }, [mobileVisible]);

  // Navbar hide/show on scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const cartCount = getCartCount();

  return (
    <>
      {/* Navbar */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: showNav ? 0 : -80 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 w-screen z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="flex items-center justify-between py-4 lg:py-5 px-5 lg:px-12 xl:px-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl lg:text-3xl font-serif font-light tracking-wide text-gray-900"
          >
            forEver
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex gap-10 xl:gap-12">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-[13px] tracking-[0.1em] uppercase font-light transition-colors duration-300 ${
                    isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <motion.span
                      layoutId="underline"
                      className={`absolute bottom-[-4px] left-0 h-[1px] bg-gray-900 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-5 lg:gap-7">
            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="group p-2 hover:bg-gray-50 rounded-full transition-all duration-300"
              aria-label="Search"
            >
              <img
                src={assets.search_icon}
                className="w-[18px] lg:w-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                alt="Search"
              />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  if (!token) navigate("/login");
                  else setProfileVisible((prev) => !prev);
                }}
                className="group p-2 hover:bg-gray-50 rounded-full transition-all duration-300"
                aria-label="Profile"
              >
                <img
                  src={assets.profile_icon}
                  className="w-[18px] lg:w-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  alt="Profile"
                />
              </button>

              <AnimatePresence>
                {token && profileVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-44 py-3 bg-white border border-gray-100 text-gray-700 flex flex-col overflow-hidden rounded-md"
                  >
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setProfileVisible(false);
                      }}
                      className="px-5 py-2.5 text-left text-sm font-light tracking-wide hover:bg-gray-50 transition-colors duration-200"
                    >
                      Orders
                    </button>
                    <div className="h-[1px] bg-gray-100 mx-3" />
                    <button
                      onClick={logout}
                      className="px-5 py-2.5 text-left text-sm font-light tracking-wide hover:bg-gray-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative group p-2 hover:bg-gray-50 rounded-full transition-all duration-300"
            >
              <img
                src={assets.cart_icon}
                className="w-[18px] lg:w-5 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                alt="Cart"
              />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center text-[9px] font-medium bg-gray-900 text-white rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileVisible(true)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-all duration-300"
              aria-label="Menu"
            >
              <img src={assets.menu_icon} className="w-[18px] opacity-70" alt="Menu" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileVisible(false)}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${
          mobileVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-white transform transition-transform duration-500 flex flex-col border-l border-gray-100 ${
          mobileVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-serif font-light tracking-wide text-gray-900">Menu</span>
          <button
            onClick={() => setMobileVisible(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col mt-6 gap-1 px-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              onClick={() => setMobileVisible(false)}
              to={link.path}
              className={({ isActive }) =>
                `py-3.5 px-5 text-sm tracking-[0.08em] uppercase font-light transition-all duration-200 ${
                  isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="mt-auto px-6 py-6 border-t border-gray-100">
          <p className="text-xs tracking-widest text-gray-400 font-light">
            &copy; {new Date().getFullYear()} forEver
          </p>
        </div>
      </div>
    </>
  );
};

export default NavBar;
