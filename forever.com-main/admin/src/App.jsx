import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Login from "./components/Login";

// Lazy-loaded pages
const Add = lazy(() => import("./pages/Add"));
const List = lazy(() => import("./pages/List"));
const Orders = lazy(() => import("./pages/Orders"));

// Environment variables
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

// Simple loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

const App = () => {
  // use "adminToken" for clarity
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize admin token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setAdminToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  // Sync token with localStorage
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  // Show loading screen while initializing
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* If not logged in → show Login page */}
      {!adminToken ? (
        <Login setAdminToken={setAdminToken} />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <NavBar setAdminToken={setAdminToken} setSidebarOpen={setSidebarOpen} />

          {/* Main layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/orders" replace />} />
                    <Route path="/add" element={<Add token={adminToken} />} />
                    <Route path="/list" element={<List token={adminToken} />} />
                    <Route path="/orders" element={<Orders token={adminToken} />} />

                    {/* 404 Page */}
                    <Route
                      path="*"
                      element={
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                          <p className="text-gray-600 mb-6">
                            The page you're looking for doesn't exist.
                          </p>
                          <a
                            href="/orders"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Go to Dashboard
                          </a>
                        </div>
                      }
                    />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
