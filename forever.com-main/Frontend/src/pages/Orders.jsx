import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null); // 🔹 Track which order is expanded

  const loadOrderData = async () => {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status || "Pending",
              payment: order.payment || false,
              paymentMethod: order.paymentMethod || "COD",
              date: order.date,
              trackingId: order._id, // add order id for tracking reference
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      } else {
        setError(response.data.message || "Failed to load orders.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (!token) return <p className="p-4 text-gray-700">You must be logged in to see your orders.</p>;
  if (loading) return <p className="p-4 text-gray-700">Loading orders...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (orderData.length === 0) return <p className="p-4 text-gray-700">No orders found.</p>;

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="pt-20 px-4 md:px-10 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <Title text1="MY" text2="ORDERS" />
        <p className="text-gray-500 mt-2">Track and manage all your recent orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white overflow-hidden"
          >
            {/* Image + Info */}
            <div className="flex items-start gap-4 p-4 border-b border-gray-100">
              <img
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {currency}
                  {item.price} • Qty: {item.quantity} • Size: {item.size}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.date).toLocaleDateString()} • {item.paymentMethod}
                </p>
              </div>
            </div>

            {/* Status + Action */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  statusColors[item.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {item.status}
              </span>

              <button
                onClick={() => setExpanded(expanded === index ? null : index)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
              >
                {expanded === index ? "Hide" : "Track →"}
              </button>
            </div>

            {/* Expanded tracking section */}
            {expanded === index && (
              <div className="px-4 py-3 text-sm text-gray-700 bg-gray-50 border-t border-gray-100">
                <p>
                  <span className="font-medium">Tracking ID:</span> {item.trackingId}
                </p>
                <p className="mt-1">
                  <span className="font-medium">Estimated Delivery:</span>{" "}
                  {item.status === "Delivered"
                    ? "Delivered Successfully"
                    : "3–5 business days"}
                </p>
                <p className="mt-1 text-gray-500">
                  Current status: <strong>{item.status}</strong>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
