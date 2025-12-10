import { Link, NavLink } from "react-router-dom";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";

const NavBar = () => {
  const [mobileVisible, setMobileVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const profileRef = useRef(null);
  const searchInputRef = useRef(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

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

  // Focus search input when opened
  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchVisible]);

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

  // Disable scroll when mobile menu or search is open
  useEffect(() => {
    document.body.style.overflow =
      mobileVisible || searchVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileVisible, searchVisible]);

  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const goingDown = currentScrollY > lastScrollY.current;
        const pastThreshold = currentScrollY > 100;

        setIsHidden(goingDown && pastThreshold);
        setIsScrolled(currentScrollY > 10);

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMobileVisible(false);
        setProfileVisible(false);
        setSearchVisible(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchVisible(false);
      setSearchQuery("");
    }
  };

  const cartCount = getCartCount();

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-out bg-gray-50  ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="flex items-center justify-between py-4 lg:py-5 px-5 sm:px-8 lg:px-16 max-w-[1800px] mx-auto">
          {/* Logo */}
          <Link to="/" className="relative group">
            <span className="text-2xl lg:text-[1.6rem] font-extralight tracking-wider text-black">
              for
              <span className="font-light italic">Ever</span>
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-10 xl:gap-12">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${
                    isActive ? "text-black" : "text-gray-500 hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 w-full h-px bg-black transition-transform duration-300 origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchVisible(true)}
              className="group p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Search"
            >
              <svg
                className="w-[18px] h-[18px] text-gray-600 group-hover:text-black transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  if (!token) navigate("/login");
                  else setProfileVisible((prev) => !prev);
                }}
                className="group p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Profile"
                aria-expanded={profileVisible}
              >
                <svg
                  className="w-[18px] h-[18px] text-gray-600 group-hover:text-black transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* Profile Dropdown */}
              <div
                className={`absolute right-0 top-full mt-3 w-44 bg-white border border-gray-100 shadow-xl overflow-hidden transition-all duration-300 origin-top-right ${
                  token && profileVisible
                    ? "opacity-100 scale-100 visible translate-y-0"
                    : "opacity-0 scale-95 invisible -translate-y-2"
                }`}
              >
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setProfileVisible(false);
                    }}
                    className="w-full px-5 py-3 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    My Orders
                  </button>
                  <div className="h-px bg-gray-100 mx-4" />
                  <button
                    onClick={logout}
                    className="w-full px-5 py-3 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative group p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label={`Cart with ${cartCount} items`}
            >
              <svg
                className="w-[18px] h-[18px] text-gray-600 group-hover:text-black transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span
                className={`absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] flex items-center justify-center text-[10px] font-medium bg-black text-white rounded-full transition-all duration-300 ${
                  cartCount > 0 ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileVisible(true)}
              className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Open menu"
              aria-expanded={mobileVisible}
            >
              <svg
                className="w-[18px] h-[18px] text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${
          searchVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={() => setSearchVisible(false)}
        />

        {/* Search Content */}
        <div
          className={`relative h-full flex flex-col items-center justify-center px-6 transition-all duration-500 ${
            searchVisible ? "translate-y-0" : "-translate-y-8"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setSearchVisible(false)}
            className="absolute top-6 right-6 p-3 text-white/60 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <svg
              className="w-6 h-6"
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

          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for jewelry..."
                className="w-full bg-transparent border-b-2 border-white/30 focus:border-white py-4 text-white text-2xl sm:text-3xl font-extralight placeholder:text-white/40 outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <span className="text-white/40 text-xs uppercase tracking-wider">
                Popular:
              </span>
              {["Rings", "Necklaces", "Earrings", "Bracelets"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    navigate(`/collection?category=${item.toLowerCase()}`);
                    setSearchVisible(false);
                  }}
                  className="text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </form>

          {/* Hint */}
          <p className="absolute bottom-8 text-white/30 text-xs tracking-wider">
            Press ESC to close
          </p>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        onClick={() => setMobileVisible(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          mobileVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 bg-white shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          mobileVisible ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <Link
            to="/"
            onClick={() => setMobileVisible(false)}
            className="text-xl font-extralight tracking-wider text-black"
          >
            for<span className="font-light italic">Ever</span>
          </Link>
          <button
            onClick={() => setMobileVisible(false)}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 text-gray-400"
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

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="flex flex-col px-6">
            {links.map((link, index) => (
              <NavLink
                key={link.path}
                onClick={() => setMobileVisible(false)}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-4 text-sm tracking-[0.1em] uppercase transition-all duration-300 border-b border-gray-100 ${
                    isActive
                      ? "text-black font-medium"
                      : "text-gray-500 hover:text-black"
                  }`
                }
                style={{
                  opacity: mobileVisible ? 1 : 0,
                  transform: mobileVisible
                    ? "translateX(0)"
                    : "translateX(20px)",
                  transition: `all 0.4s ease ${index * 0.05 + 0.1}s`,
                }}
              >
                {({ isActive }) => (
                  <span className="flex items-center justify-between">
                    {link.label}
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Account Section */}
          {token && (
            <div
              className="mt-8 px-6"
              style={{
                opacity: mobileVisible ? 1 : 0,
                transition: "opacity 0.4s ease 0.3s",
              }}
            >
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-4">
                Account
              </p>
              <button
                onClick={() => {
                  navigate("/orders");
                  setMobileVisible(false);
                }}
                className="w-full py-3 text-left text-sm tracking-wider uppercase text-gray-500 hover:text-black transition-colors"
              >
                My Orders
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileVisible(false);
                }}
                className="w-full py-3 text-left text-sm tracking-wider uppercase text-gray-500 hover:text-black transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div
          className="px-8 py-6 border-t border-gray-100"
          style={{
            opacity: mobileVisible ? 1 : 0,
            transition: "opacity 0.4s ease 0.4s",
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            {["instagram", "facebook", "pinterest"].map((social) => (
              <a
                key={social}
                href={`#${social}`}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <span className="sr-only">{social}</span>
                <div className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:border-black transition-colors">
                  <span className="text-[10px] uppercase">
                    {social.charAt(0)}
                  </span>
                </div>
              </a>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.15em] text-gray-400">
            © {new Date().getFullYear()} forEver
          </p>
        </div>
      </aside>
    </>
  );
};

export default NavBar;