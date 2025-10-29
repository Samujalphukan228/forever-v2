import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotel";
import { Minus, Plus, Trash2 } from "lucide-react";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Build cart data (flat structure)
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

  if (cartData.length === 0) {
    return (
      <div className="pt-20 px-4 text-center text-gray-500 text-lg min-h-[70vh]">
        <Title text1="Your" text2="Cart" />
        <p className="mt-10 text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="pt-16 px-4 sm:px-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="flex-1 flex flex-col gap-5">
        <Title text1="Your" text2="Cart" />

        {cartData.map((item, index) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;

          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 rounded-2xl bg-white"
            >
              {/* Product Image */}
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-gray-100"
              />

              {/* Product Info & Quantity */}
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 w-full">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold text-gray-900">{product.name}</p>
                  <p className="text-gray-700 text-sm">
                    {currency}
                    {product.price}
                  </p>
                </div>

                {/* Quantity & Delete Controls */}
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="px-4 py-1.5 border border-gray-300 rounded-lg text-center w-12 text-sm font-medium text-gray-800">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Plus size={16} />
                  </button>

                  <button
                    onClick={() => updateQuantity(item._id, 0)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="lg:w-[400px] w-full">
        <CartTotal showPromoCode={true} showCheckoutButton={true} />
      </div>
    </div>
  );
};

export default Cart;
