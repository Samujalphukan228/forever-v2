import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotel";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  // Build cart data
  useEffect(() => {
    const tempData = [];
    for (const productId in cartItems) {
      if (cartItems[productId] > 0) {
        tempData.push({
          _id: productId,
          quantity: cartItems[productId],
        });
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  // Calculate item total
  const getItemTotal = (productId, quantity) => {
    const product = products.find((p) => p._id === productId);
    return product ? (product.price * quantity).toFixed(2) : "0.00";
  };

  // Empty State
  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start adding some products to your cart!</p>
            <button
              onClick={() => navigate("/collection")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartData.length} {cartData.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.map((item) => {
              const product = products.find((p) => p._id === item._id);
              if (!product) return null;

              return (
                <div
                  key={item._id}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex gap-4 sm:gap-6">
                    
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border border-gray-200"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      
                      {/* Top Section */}
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg pr-4">
                            {product.name}
                          </h3>
                          <button
                            onClick={() => updateQuantity(item._id, 0)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {currency}{product.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="flex items-center justify-between mt-4">
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          
                          <span className="w-10 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900">
                            {currency}{getItemTotal(item._id, item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping Button (Mobile) */}
            <button
              onClick={() => navigate("/collection")}
              className="w-full lg:hidden flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiArrowLeft />
              Continue Shopping
            </button>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CartTotal showCheckoutButton={true} />
              
              {/* Continue Shopping Button (Desktop) */}
              <button
                onClick={() => navigate("/collection")}
                className="hidden lg:flex items-center justify-center gap-2 w-full mt-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiArrowLeft />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;