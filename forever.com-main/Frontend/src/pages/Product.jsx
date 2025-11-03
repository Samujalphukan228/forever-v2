import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";
import { FiStar, FiShoppingCart, FiChevronRight, FiChevronDown } from "react-icons/fi";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token, navigate } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // toggle panel measurement
  const panelRef = useRef(null);
  const [panelMaxHeight, setPanelMaxHeight] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const prod = products.find((p) => p._id === productId);
    if (prod) {
      setProductData(prod);
      setSelectedImage(prod.image?.[0] || "");
      fetchReviews(productId);
    }
  }, [productId, products]);

  const fetchReviews = async (id) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/single/${id}`);
      if (data.success) setReviews(data.product.reviews || []);
    } catch {}
  };

  const avgRating = useMemo(
    () =>
      reviews.length
        ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : "0.0",
    [reviews]
  );

  const handleAddToCart = async () => {
    if (!productData) return;
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) await addToCart(productData._id);
    setTimeout(() => setIsAdding(false), 300);
  };

  const submitReview = async () => {
    if (!token) {
      toast.error("Please login to add a review");
      navigate("/login");
      return;
    }
    if (!rating || !comment.trim()) {
      toast.error("Select rating and write a comment");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/product/review`,
        { productId, rating: Number(rating), comment },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Review added!");
        setComment("");
        setRating(0);
        fetchReviews(productId);
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // measure panel height for smooth toggle
  useEffect(() => {
    if (!panelRef.current) return;
    if (reviewOpen) {
      setPanelMaxHeight(panelRef.current.scrollHeight);
    } else {
      setPanelMaxHeight(0);
    }
  }, [reviewOpen, comment, rating, reviews.length]);

  if (!productData) {
    return (
      <div className="min-h-screen  pt-24 lg:pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pt-18 lg:pt-21">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto  py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <button onClick={() => navigate("/")} className="hover:text-black">Home</button>
            <FiChevronRight className="w-3 h-3" />
            <button onClick={() => navigate("/collection")} className="hover:text-black">Shop</button>
            <FiChevronRight className="w-3 h-3" />
            <span className="text-black truncate">{productData.name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto  pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white border border-gray-200 overflow-hidden">
              <img
                src={selectedImage}
                alt={productData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {productData.image?.length > 1 && (
              <div className="flex gap-3">
                {productData.image.map((img) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square w-16 border ${
                      selectedImage === img ? "border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                    aria-label="Select image"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="space-y-8">
            {/* Title + Rating */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-extralight text-black leading-tight">
                {productData.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(Number(avgRating)) ? "fill-black text-black" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-black font-medium">{avgRating}</span>
                <span className="text-sm text-gray-500">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl font-light text-black">
                  {currency}{Number(productData.price).toFixed(2)}
                </span>
                {productData.bestseller && (
                  <span className="text-[10px] uppercase tracking-[0.2em] bg-black text-white px-2 py-1">
                    Bestseller
                  </span>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-black uppercase tracking-wide">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {productData.description}
              </p>
            </div>

            {/* Quantity + Add to cart */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-black uppercase tracking-wide">
                Quantity
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center border border-gray-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-6 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {quantity > 1 && (
                  <span className="text-sm text-gray-600">
                    Total: {currency}{(Number(productData.price) * quantity).toFixed(2)}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full py-3 text-xs uppercase tracking-[0.2em] font-medium text-white ${
                  isAdding ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
              >
                {isAdding ? "Adding..." : (
                  <span className="inline-flex items-center gap-2">
                    <FiShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </span>
                )}
              </button>
            </div>

            {/* Slim feature line */}
            <div className="text-xs text-gray-500">
              Free delivery over ₹500 • 7-day returns • Secure SSL checkout
            </div>
          </div>
        </div>

        {/* Reviews (proper toggle) */}
        <div className="max-w-[800px] mt-12">
          <div className="border border-gray-200 bg-white">
            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-lg font-light text-black">Customer Reviews</h3>
              <button
                onClick={() => setReviewOpen((v) => !v)}
                aria-expanded={reviewOpen}
                aria-controls="reviews-panel"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black hover:opacity-80"
              >
                {reviewOpen ? "Hide" : "Write a review"}
                <FiChevronDown
                  className={`w-4 h-4 transition-transform ${reviewOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Preview last 2 reviews */}
            <div className="px-6 pb-4 space-y-3">
              {reviews.slice(-2).reverse().map((r, i) => (
                <div key={i} className="border border-gray-200 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <FiStar
                          key={j}
                          className={`w-3 h-3 ${j < r.rating ? "fill-black text-black" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
            </div>

            {/* Collapsible review form */}
            <div
              id="reviews-panel"
              className="px-6 overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{ maxHeight: panelMaxHeight }}
            >
              <div ref={panelRef} className="pb-6 space-y-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                      className={`p-1 ${s <= rating ? "text-black" : "text-gray-300"}`}
                    >
                      <FiStar className={`w-5 h-5 ${s <= rating ? "fill-black" : ""}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black"
                />
                <button
                  onClick={submitReview}
                  disabled={isSubmittingReview || !rating || !comment.trim()}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.2em] text-white ${
                    isSubmittingReview || !rating || !comment.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {isSubmittingReview ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
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