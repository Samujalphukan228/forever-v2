import React, { useContext, useState, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck, Truck, ArrowRight, Lock } from 'lucide-react';

const CartTotal = ({ showCheckoutButton = true, showPromoCode = false }) => {
  const { currency, delivery_fee, getCartAmount, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = useMemo(() => getCartAmount(), [getCartAmount]);
  const shipping = subtotal === 0 ? 0 : delivery_fee;
  const discount = promoDiscount;
  const total = subtotal - discount + shipping;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') setPromoDiscount(subtotal * 0.1);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    navigate('/place-order');
  };

  const isCartEmpty = !cartItems || Object.keys(cartItems).length === 0 || subtotal === 0;

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5"
      >
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <Title text1="Order" text2="Summary" />
        </div>

        {/* Price details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {showPromoCode && !isCartEmpty && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:outline-none"
                />
                <button
                  onClick={applyPromoCode}
                  className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Apply
                </button>
              </div>
              <AnimatePresence>
                {promoDiscount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex justify-between text-green-600"
                  >
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span className="font-medium">
              {shipping === 0 && subtotal > 0 ? 'FREE' : formatCurrency(shipping)}
            </span>
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          <div className="flex justify-between text-gray-900 font-semibold text-base">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {!isCartEmpty && (
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg text-gray-700 text-sm">
            <Truck className="w-5 h-5 text-gray-600" />
            Estimated delivery: <span className="font-medium ml-1">3–5 days</span>
          </div>
        )}

        {showCheckoutButton && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isCartEmpty || isProcessing}
            onClick={handleCheckout}
            className={`w-full mt-4 py-3 rounded-xl font-medium flex justify-center items-center gap-2 text-white transition ${
              isCartEmpty || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        )}

        <div className="flex items-center justify-center text-gray-500 text-xs gap-1 mt-2">
          <Lock size={14} /> Secure Checkout
        </div>
      </motion.div>

      {/* Info badges */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg">
          <BadgeCheck className="text-green-600 w-5 h-5" />
          <div className="text-sm">
            <p className="font-medium text-gray-800">Free Returns</p>
            <p className="text-gray-500 text-xs">30-day return policy</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg">
          <Truck className="text-blue-600 w-5 h-5" />
          <div className="text-sm">
            <p className="font-medium text-gray-800">Fast Shipping</p>
            <p className="text-gray-500 text-xs">Express delivery available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
