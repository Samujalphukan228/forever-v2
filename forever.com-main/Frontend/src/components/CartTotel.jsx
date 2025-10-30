import React, { useContext, useState, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiShield, FiLock, FiPercent, FiX, FiArrowRight } from 'react-icons/fi';


const CartTotal = ({ showCheckoutButton = true }) => {
  const { currency, delivery_fee, getCartAmount, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const subtotal = useMemo(() => getCartAmount(), [getCartAmount]);
  const shipping = subtotal === 0 ? 0 : delivery_fee;
  const total = subtotal - discount + shipping;

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    navigate('/place-order');
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1);
      setPromoError('');
    } else if (promoCode.trim()) {
      setPromoError('Invalid promo code');
      setDiscount(0);
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscount(0);
    setPromoError('');
  };

  const isCartEmpty = !cartItems || Object.keys(cartItems).length === 0 || subtotal === 0;

  return (
    <div className="w-full space-y-4">
      
      {/* Main Card */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <FiShield className="text-white w-5 h-5" />
          </div>
        </div>

        {/* Promo Code */}
        {!isCartEmpty && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Have a promo code?
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError('');
                  }}
                  placeholder="Enter code"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                />
                {discount > 0 && (
                  <button
                    onClick={removePromo}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={applyPromo}
                className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
            )}
            {discount > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600 font-medium">
                <FiPercent className="w-4 h-4" />
                <span>Promo code applied!</span>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">
              {currency}{subtotal.toFixed(2)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-semibold text-green-600">
                -{currency}{discount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold text-gray-900">
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `${currency}${shipping.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                {currency}{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        {!isCartEmpty && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <FiTruck className="w-5 h-5 text-gray-700" />
              <div>
                <p className="font-semibold text-gray-900">Estimated Delivery</p>
                <p className="text-gray-600">3-5 business days</p>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && (
          <button
            onClick={handleCheckout}
            disabled={isCartEmpty || isProcessing}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isCartEmpty || isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Checkout
                <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
          <FiLock className="w-3.5 h-3.5" />
          <span>Secure SSL encrypted checkout</span>
        </div>
      </div>

      {/* Trust Badges */}
      {!isCartEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-gray-400 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiShield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
              <p className="text-xs text-gray-500">30-day return policy</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-gray-400 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiTruck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders above ₹500</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTotal;
