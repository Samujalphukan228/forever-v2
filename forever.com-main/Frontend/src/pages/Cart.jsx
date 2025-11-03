import React, { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotel";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [hasAnimated, setHasAnimated] = useState(false); // Track if initial animation has run
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);
  const summaryRef = useRef(null);
  const emptyStateRef = useRef(null);
  const deleteRefs = useRef([]);

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

  // Initial page animation - ONLY RUN ONCE
  useEffect(() => {
    if (hasAnimated) return; // Skip if already animated

    if (cartData.length === 0) {
      if (emptyStateRef.current) {
        gsap.fromTo(emptyStateRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" }
        );
        setHasAnimated(true);
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
        onComplete: () => setHasAnimated(true) // Mark as animated after completion
      });

      gsap.set([headerRef.current, ...itemsRef.current, summaryRef.current], {
        opacity: 0,
        y: 20
      });

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6
      })
      .to(itemsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08
      }, "-=0.3")
      .to(summaryRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5
      }, "-=0.3");

    }, containerRef);

    return () => ctx.revert();
  }, [cartData.length > 0 && !hasAnimated]); // Only trigger when cart has items AND hasn't animated yet

  // Hover animations - Set up ONCE
  useEffect(() => {
    if (!hasAnimated || cartData.length === 0) return;

    itemsRef.current.forEach((item) => {
      if (!item) return;
      
      const handleMouseEnter = () => {
        gsap.to(item, {
          scale: 1.01,
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
          duration: 0.3
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(item, {
          scale: 1,
          boxShadow: "none",
          duration: 0.3
        });
      };

      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup
      return () => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, [hasAnimated, cartData.length]);

  // Calculate item total
  const getItemTotal = (productId, quantity) => {
    const product = products.find((p) => p._id === productId);
    return product ? (product.price * quantity).toFixed(2) : "0.00";
  };

  // Animate quantity change
  const handleQuantityChange = (itemId, newQuantity, buttonElement) => {
    if (newQuantity < 1) return; // Prevent going below 1

    // Animate button press
    gsap.to(buttonElement, {
      scale: 0.8,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    // Animate quantity number
    const quantityElement = buttonElement.parentElement.querySelector('.quantity-display');
    if (quantityElement) {
      gsap.fromTo(quantityElement,
        { scale: 1.2 },
        { scale: 1, duration: 0.3 }
      );
    }

    updateQuantity(itemId, newQuantity);
  };

  // Animate item removal
  const handleRemoveItem = (itemId, index) => {
    const itemElement = itemsRef.current[index];
    if (itemElement) {
      gsap.to(itemElement, {
        x: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          updateQuantity(itemId, 0);
        }
      });
    } else {
      updateQuantity(itemId, 0);
    }
  };

  // Empty State
  if (cartData.length === 0) {
    return (
      <div className="min-h-screen  pt-24 lg:pt-28 py-12 ">
        <div className="max-w-2xl mx-auto">
          <div 
            ref={emptyStateRef}
            className="bg-white border border-gray-200 p-16 text-center"
          >
            <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-black mb-2">Your cart is empty</h2>
            <p className="text-gray-500 font-light mb-8">Start adding some products to your cart</p>
            <button
              onClick={() => navigate("/collection")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget.querySelector('svg'), { x: -2, duration: 0.2 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget.querySelector('svg'), { x: 0, duration: 0.2 });
              }}
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
    <div ref={containerRef} className="min-h-screen bg-[#fafafa] pt-24 lg:pt-28">
      <div className="px-6 lg:px-16 xl:px-24 py-8 lg:py-12 max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extralight text-black mb-2">Shopping Cart</h1>
          <p className="text-gray-500 font-light">
            {cartData.length} {cartData.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.map((item, index) => {
              const product = products.find((p) => p._id === item._id);
              if (!product) return null;

              return (
                <div
                  key={item._id}
                  ref={(el) => (itemsRef.current[index] = el)}
                  className="bg-white border border-gray-200 p-6 hover:border-black transition-colors cursor-pointer"
                >
                  <div className="flex gap-6">
                    
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-28 h-28 lg:w-32 lg:h-32 object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      
                      {/* Top Section */}
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-black text-lg pr-4">
                            {product.name}
                          </h3>
                          <button
                            ref={(el) => (deleteRefs.current[index] = el)}
                            onClick={() => handleRemoveItem(item._id, index)}
                            className="text-gray-400 hover:text-black transition-colors flex-shrink-0"
                            aria-label="Remove item"
                            onMouseEnter={(e) => {
                              gsap.to(e.currentTarget, { rotate: -15, scale: 1.1, duration: 0.2 });
                            }}
                            onMouseLeave={(e) => {
                              gsap.to(e.currentTarget, { rotate: 0, scale: 1, duration: 0.2 });
                            }}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-gray-500 text-sm font-light">
                          {currency}{product.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Bottom Section */}
                      <div className="flex items-center justify-between mt-4">
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 border border-gray-200 p-1">
                          <button
                            onClick={(e) => handleQuantityChange(item._id, item.quantity - 1, e.currentTarget)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          
                          <span className="quantity-display w-10 text-center font-medium text-black">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={(e) => handleQuantityChange(item._id, item.quantity + 1, e.currentTarget)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Subtotal</p>
                          <p className="text-lg font-medium text-black">
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
              className="w-full lg:hidden flex items-center justify-center gap-2 py-3 border border-gray-300 font-medium text-gray-700 hover:border-black transition-colors"
            >
              <FiArrowLeft />
              Continue Shopping
            </button>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div ref={summaryRef} className="sticky top-6">
              <CartTotal showCheckoutButton={true} />
              
              {/* Continue Shopping Button (Desktop) */}
              <button
                onClick={() => navigate("/collection")}
                className="hidden lg:flex items-center justify-center gap-2 w-full mt-4 py-3 border border-gray-300 text-xs uppercase tracking-[0.15em] font-medium text-black hover:border-black hover:bg-black hover:text-white transition-all"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget.querySelector('svg'), { x: -2, duration: 0.2 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget.querySelector('svg'), { x: 0, duration: 0.2 });
                }}
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