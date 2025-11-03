import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { gsap } from "gsap";

const NavBar = () => {
  const [mobileVisible, setMobileVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } =
    useContext(ShopContext);

  const profileRef = useRef(null);
  const lastScrollY = useRef(0);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const iconsRef = useRef([]);

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

  // Initial GSAP animation (tighter distances/durations)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set([logoRef.current, ...linksRef.current, ...iconsRef.current], {
        opacity: 0,
        y: -12,
      });

      tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(
          linksRef.current,
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.3"
        )
        .to(
          iconsRef.current,
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
          "-=0.3"
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

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

  // Navbar hide/show on scroll (smaller translation)
  useEffect(() => {
    const controlNavbar = () => {
      const goingDown = window.scrollY > lastScrollY.current;
      const pastThreshold = window.scrollY > 64;
      gsap.to(navRef.current, {
        y: goingDown && pastThreshold ? -72 : 0,
        duration: 0.25,
        ease: "power2.out",
      });
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  // Profile dropdown animation
  useEffect(() => {
    if (profileVisible) {
      gsap.fromTo(
        ".profile-dropdown",
        { opacity: 0, y: -6, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" }
      );
    }
  }, [profileVisible]);

  const cartCount = getCartCount();

  return (
    <>
      {/* Navbar */}
      <header
        ref={navRef}
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      >
        <div className="flex items-center justify-between py-3 lg:py-3.5 px-4 lg:px-12 max-w-[1600px] mx-auto">
          {/* Logo */}
          <Link
            ref={logoRef}
            to="/"
            className="text-xl lg:text-[1.25rem] font-extralight tracking-wide text-black"
          >
            forEver
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex gap-8 xl:gap-10">
            {links.map((link, index) => (
              <NavLink
                key={link.path}
                ref={(el) => (linksRef.current[index] = el)}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-[10px] tracking-[0.15em] uppercase font-medium transition-colors duration-200 ${
                    isActive ? "text-black" : "text-gray-500 hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-[-5px] left-0 w-full h-[1px] bg-black" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4 lg:gap-5">
            {/* Search */}
            <button
              ref={(el) => (iconsRef.current[0] = el)}
              onClick={() => setShowSearch(true)}
              className="group p-1.5 hover:bg-gray-50 rounded-full transition-all duration-150"
              aria-label="Search"
            >
              <img
                src={assets.search_icon}
                className="w-4 opacity-70 group-hover:opacity-100 transition-opacity"
                alt="Search"
              />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                ref={(el) => (iconsRef.current[1] = el)}
                onClick={() => {
                  if (!token) navigate("/login");
                  else setProfileVisible((prev) => !prev);
                }}
                className="group p-1.5 hover:bg-gray-50 rounded-full transition-all duration-150"
                aria-label="Profile"
              >
                <img
                  src={assets.profile_icon}
                  className="w-4 opacity-70 group-hover:opacity-100 transition-opacity"
                  alt="Profile"
                />
              </button>

              {token && profileVisible && (
                <div className="profile-dropdown absolute right-0 top-full mt-2 w-36 py-2 bg-white border border-gray-100 flex flex-col overflow-hidden shadow-sm">
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setProfileVisible(false);
                    }}
                    className="px-4 py-2 text-left text-[11px] uppercase tracking-[0.15em] hover:bg-gray-50 transition-colors"
                  >
                    Orders
                  </button>
                  <div className="h-[1px] bg-gray-100 mx-3" />
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-left text-[11px] uppercase tracking-[0.15em] hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              ref={(el) => (iconsRef.current[2] = el)}
              to="/cart"
              className="relative group p-1.5 hover:bg-gray-50 rounded-full transition-all duration-150"
            >
              <img
                src={assets.cart_icon}
                className="w-4 opacity-70 group-hover:opacity-100 transition-opacity"
                alt="Cart"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center text-[8px] font-medium bg-black text-white rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              ref={(el) => (iconsRef.current[3] = el)}
              onClick={() => setMobileVisible(true)}
              className="lg:hidden p-1.5 hover:bg-gray-50 rounded-full transition-all duration-150"
              aria-label="Menu"
            >
              <img src={assets.menu_icon} className="w-4 opacity-70" alt="Menu" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileVisible(false)}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200 z-40 ${
          mobileVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-50 bg-white transform transition-transform duration-350 ease-out flex flex-col ${
          mobileVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="text-lg font-extralight tracking-wide text-black">Menu</span>
          <button
            onClick={() => setMobileVisible(false)}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col mt-6 gap-1 px-5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              onClick={() => setMobileVisible(false)}
              to={link.path}
              className={({ isActive }) =>
                `py-3 px-5 text-[10px] tracking-[0.15em] uppercase font-medium transition-all duration-150 ${
                  isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="mt-auto px-6 py-5 border-t border-gray-100">
          <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase">
            &copy; {new Date().getFullYear()} forEver
          </p>
        </div>
      </div>
    </>
  );
};

export default NavBar;