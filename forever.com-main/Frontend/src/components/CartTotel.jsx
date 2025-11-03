import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { gsap } from 'gsap';
import { FiTruck, FiShield, FiLock, FiPercent, FiX, FiArrowRight, FiCheck } from 'react-icons/fi';
=======
import { FiTruck, FiShield, FiLock, FiPercent, FiX, FiArrowRight } from 'react-icons/fi';
>>>>>>> e1259737f9ef849d4b56356bf2aafe74522540e1

const CartTotal = ({ showCheckoutButton = true }) => {
  const { currency, delivery_fee, getCartAmount, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  // Refs for animations
  const containerRef = useRef(null);
  const totalRef = useRef(null);
  const promoSuccessRef = useRef(null);
  const checkoutBtnRef = useRef(null);

  const subtotal = useMemo(() => getCartAmount(), [getCartAmount]);
  const shipping = subtotal === 0 ? 0 : delivery_fee;
  const total = subtotal - discount + shipping;

  const isCartEmpty = !cartItems || Object.keys(cartItems).length === 0 || subtotal === 0;

  // Animate on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate total when it changes
  useEffect(() => {
    if (totalRef.current) {
      gsap.fromTo(
        totalRef.current,
        { scale: 1.1, color: "#000" },
        { scale: 1, color: "#111", duration: 0.3 }
      );
    }
  }, [total]);

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Animate button
    gsap.to(checkoutBtnRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    await new Promise((r) => setTimeout(r, 500));
    navigate('/place-order');
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1);
      setPromoError('');

      // Success animation
      if (promoSuccessRef.current) {
        gsap.fromTo(
          promoSuccessRef.current,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.4, ease: "back.out(1.4)" }
        );
      }
    } else if (promoCode.trim()) {
      setPromoError('Invalid promo code');
      setDiscount(0);

      // Shake animation on error
      gsap.to('.promo-input', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut"
      });
    }
  };

  const removePromo = () => {
    // Animate removal
    if (promoSuccessRef.current) {
      gsap.to(promoSuccessRef.current, {
        opacity: 0,
        x: 10,
        duration: 0.2,
        onComplete: () => {
          setPromoCode('');
          setDiscount(0);
          setPromoError('');
        }
      });
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-4">
      
      {/* Main Card */}
      <div className=" border border-gray-200 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-black uppercase tracking-wider">Order Summary</h2>
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <FiShield className="text-white w-4 h-4" />
          </div>
        </div>

        {/* Promo Code */}
        {!isCartEmpty && (
          <div className="mb-6">
            <label className="block text-xs font-medium text-black mb-3 uppercase tracking-wider">
              Promo Code
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  placeholder="ENTER CODE"
                  className="promo-input w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors uppercase text-sm font-medium"
                />
                {discount > 0 && (
                  <button
                    onClick={removePromo}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { rotate: 90, duration: 0.2 });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { rotate: 0, duration: 0.2 });
                    }}
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={applyPromo}
                className="px-6 py-3 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-gray-800 transition-colors"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                }}
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-xs text-gray-600 mt-2 font-light">{promoError}</p>
            )}
            {discount > 0 && (
              <div ref={promoSuccessRef} className="mt-3 flex items-center gap-2 text-sm text-black font-medium">
                <FiCheck className="w-4 h-4" />
                <span className="uppercase text-xs tracking-wider">Discount Applied</span>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-light uppercase tracking-wide text-xs">Subtotal</span>
            <span className="font-medium text-black">
              {currency}{subtotal.toFixed(2)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-light uppercase tracking-wide text-xs">Discount</span>
              <span className="font-medium text-black">
                -{currency}{discount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-light uppercase tracking-wide text-xs">Shipping</span>
            <span className="font-medium text-black">
              {shipping === 0 ? (
                <span className="uppercase text-xs tracking-wider">Free</span>
              ) : (
                `${currency}${shipping.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-black uppercase tracking-wider">Total</span>
              <span ref={totalRef} className="text-2xl font-light text-black">
                {currency}{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        {!isCartEmpty && (
          <div className="bg-[#fafafa] p-4 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <FiTruck className="w-5 h-5 text-black" />
              <div>
                <p className="text-xs font-medium text-black uppercase tracking-wider">Estimated Delivery</p>
                <p className="text-xs text-gray-600 font-light mt-1">3-5 business days</p>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {showCheckoutButton && (
          <button
            ref={checkoutBtnRef}
            onClick={handleCheckout}
            disabled={isCartEmpty || isProcessing}
            className={`w-full py-4 font-medium text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${
              isCartEmpty || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            onMouseEnter={(e) => {
              if (!isCartEmpty && !isProcessing) {
                gsap.to(e.currentTarget.querySelector('.arrow-icon'), { x: 3, duration: 0.2 });
              }
            }}
            onMouseLeave={(e) => {
              if (!isCartEmpty && !isProcessing) {
                gsap.to(e.currentTarget.querySelector('.arrow-icon'), { x: 0, duration: 0.2 });
              }
            }}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Checkout
                <FiArrowRight className="arrow-icon w-4 h-4" />
              </>
            )}
          </button>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400 font-light">
          <FiLock className="w-3 h-3" />
          <span className="uppercase tracking-wider">Secure Checkout</span>
        </div>
      </div>

      {/* Trust Badges */}
      {!isCartEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 p-4 flex items-center gap-3 hover:border-black transition-colors">
            <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
              <FiShield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-black uppercase tracking-wider">Easy Returns</p>
              <p className="text-[10px] text-gray-500 font-light mt-1">30-day policy</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4 flex items-center gap-3 hover:border-black transition-colors">
            <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
              <FiTruck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-black uppercase tracking-wider">Free Shipping</p>
              <p className="text-[10px] text-gray-500 font-light mt-1">Orders above ₹500</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTotal;