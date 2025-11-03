import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Login from "./components/Login";

const Add = lazy(() => import("./pages/Add"));
const List = lazy(() => import("./pages/List"));
const Orders = lazy(() => import("./pages/Orders"));

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) setAdminToken(storedToken);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {!adminToken ? (
        <Login setAdminToken={setAdminToken} />
      ) : (
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:ml-64">
            {/* Navbar */}
            <NavBar setAdminToken={setAdminToken} setSidebarOpen={setSidebarOpen} />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/orders" replace />} />
                  <Route path="/add" element={<Add token={adminToken} />} />
                  <Route path="/list" element={<List token={adminToken} />} />
                  <Route path="/orders" element={<Orders token={adminToken} />} />
                  <Route path="*" element={<div className="text-center py-20"><h1 className="text-4xl font-bold">404 - Page Not Found</h1></div>} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default App;