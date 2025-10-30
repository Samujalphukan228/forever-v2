import React, { useContext, useState, memo } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { 
  FiHeart, 
  FiShoppingCart, 
  FiEye, 
  FiStar,
  FiTrendingUp,
  FiZap
} from "react-icons/fi";

const ProductItem = memo(({ id, image, name, price, bestseller, rating, reviews }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    await addToCart(id);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const avgRating = rating || (reviews?.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0);

  const reviewCount = reviews?.length || 0;

  return (
    <div className="group relative w-full max-w-xs">
      <article className="bg-white overflow-hidden rounded-2xl border border-gray-200 transition-all duration-300 hover:border-gray-900 hover:shadow-2xl">
        
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {bestseller && (
              <span className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                <FiTrendingUp className="w-3 h-3" />
                Bestseller
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlistClick}
              className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
                isWishlisted 
                  ? "bg-red-500 text-white scale-110" 
                  : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110"
              }`}
              aria-label="Add to wishlist"
            >
              <FiHeart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              className="p-2.5 bg-white/90 rounded-full shadow-lg text-gray-700 hover:bg-white transition-all duration-200 backdrop-blur-sm hover:scale-110"
              aria-label="Quick view"
            >
              <FiEye className="w-4 h-4" />
            </button>
          </div>

          {/* Skeleton Loader */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer" />
          )}

          {/* Product Image */}
          <Link to={`/product/${id}`} className="block h-full">
            {!imageError ? (
              <img
                src={image?.[0] || "/placeholder-image.jpg"}
                alt={name}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } group-hover:scale-110`}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-300">
                <FiZap className="w-12 h-12" />
              </div>
            )}
          </Link>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/20 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAddToCart}
              disabled={isAddingToCart}
              className={`w-full py-3 rounded-lg text-white text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-200 ${
                isAddingToCart 
                  ? "bg-green-500 scale-105" 
                  : "bg-black hover:bg-gray-900 hover:shadow-lg"
              }`}
            >
              {isAddingToCart ? (
                <>
                  <FiShoppingCart className="w-4 h-4 animate-bounce" />
                  Added!
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-4 h-4" />
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <Link to={`/product/${id}`}>
          <div className="p-4 space-y-2.5">
            {/* Rating Section */}
            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-3.5 h-3.5 transition-colors ${
                        i < Math.round(avgRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {avgRating}
                </span>
                {reviewCount > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({reviewCount})
                  </span>
                )}
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight group-hover:text-black transition-colors">
              {name}
            </h3>

            {/* Price & Link */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-lg font-bold text-gray-900">
                {currency}{formattedPrice}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-black transition-colors font-semibold">
                View
              </span>
            </div>
          </div>
        </Link>
      </article>

      {/* Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background-size: 1000px 100%;
        }
      `}</style>
    </div>
  );
});

ProductItem.displayName = "ProductItem";
export default ProductItem;