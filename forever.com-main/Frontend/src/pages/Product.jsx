import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  FiStar, 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiCheck,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiCalendar,
  FiMessageCircle,
  FiAlertCircle
} from "react-icons/fi";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token, navigate } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // description, reviews
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const prod = products.find((item) => item._id === productId);
    if (prod) {
      setProductData(prod);
      if (prod.image?.length > 0) setSelectedImage(prod.image[0]);
      fetchReviews(productId);
    }
  }, [productId, products]);

  const fetchReviews = async (id) => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/single/${id}`);
      if (res.data.success) {
        setReviews(res.data.product.reviews || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async () => {
    if (!token) {
      toast.error("Please login to add a review");
      navigate("/login");
      return;
    }
    
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/product/review`,
        { productId, rating: Number(rating), comment },
        { headers: { token } }
      );
      
      if (res.data.success) {
        toast.success("Review added successfully! 🎉");
        setRating(0);
        setComment("");
        fetchReviews(productId);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    for (let i = 0; i < quantity; i++) {
      await addToCart(productData._id);
    }
    
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });
    return dist;
  };

  // Loading State
  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const avgRating = getAverageRating();
  const ratingDist = getRatingDistribution();

  return (
    <div className="min-h-screen ">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto  py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span onClick={() => navigate("/")} className="cursor-pointer hover:text-black">Home</span>
            <span>/</span>
            <span onClick={() => navigate("/collection")} className="cursor-pointer hover:text-black">Shop</span>
            <span>/</span>
            <span className="text-black font-medium truncate">{productData.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border-2 border-gray-200 group">
              <img
                src={selectedImage}
                alt={productData.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Thumbnail Gallery */}
            {productData.image?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productData.image.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                      selectedImage === img 
                        ? "border-black scale-105 shadow-lg" 
                        : "border-gray-200 hover:border-gray-400 hover:scale-105"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {productData.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`text-xl ${
                          i < Math.round(avgRating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {avgRating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {currency}{productData.price}
                </span>
                {productData.bestseller && (
                  <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                    BESTSELLER
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {productData.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block font-semibold text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-all"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-100 transition-all"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {quantity > 1 && `Total: ${currency}${(productData.price * quantity).toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isAddingToCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FiShoppingCart className="text-xl" />
                  Add to Cart
                </>
              )}
            </button>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:border-black transition-all">
                <FiHeart />
                Wishlist
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:border-black transition-all">
                <FiShare2 />
                Share
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FiTruck className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders above ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FiRefreshCw className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">7 days return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FiShield className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-500">SSL encrypted</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 py-4 font-semibold transition-all ${
                activeTab === "description"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "reviews"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "description" ? (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {productData.description}
                </p>
                
                {/* Additional Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Product Details</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• High-quality materials</li>
                      <li>• Durable construction</li>
                      <li>• Easy to maintain</li>
                      <li>• Available in multiple sizes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Care Instructions</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Machine wash cold</li>
                      <li>• Do not bleach</li>
                      <li>• Tumble dry low</li>
                      <li>• Iron on low heat</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Rating Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-2xl">
                  {/* Average Rating */}
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900 mb-2">{avgRating}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`text-2xl ${
                            i < Math.round(avgRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDist[star] || 0;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8">{star}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add Review Form */}
                <div className="border-2 border-gray-200 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiMessageCircle />
                    Write a Review
                  </h3>

                  <div className="space-y-5">
                    {/* Rating Stars */}
                    <div>
                      <label className="block font-semibold text-gray-900 mb-3">Your Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <FiStar
                              className={`text-4xl ${
                                star <= (hoverRating || rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block font-semibold text-gray-900 mb-3">Your Review *</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={5}
                        placeholder="Share your experience with this product..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-black transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {comment.length} characters
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={submitReview}
                      disabled={isSubmittingReview || !rating || !comment.trim()}
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                        isSubmittingReview || !rating || !comment.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-black hover:bg-gray-800"
                      }`}
                    >
                      {isSubmittingReview ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiCheck />
                          Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                    
                    {reviews.map((review, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-2xl p-6 hover:border-gray-400 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {review.name?.charAt(0).toUpperCase() || <FiUser />}
                          </div>

                          {/* Review Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {review.name || "Anonymous"}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <FiStar
                                        key={i}
                                        className={`text-sm ${
                                          i < review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <FiCalendar className="flex-shrink-0" />
                                {new Date(review.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <FiAlertCircle className="text-5xl text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h4>
                    <p className="text-gray-600">Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts
            category={productData.category}
            subCategory={productData.subCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;