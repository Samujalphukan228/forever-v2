import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const prod = products.find((item) => item._id === productId);
    if (prod) {
      setProductData(prod);
      if (prod.image?.length > 0) setImage(prod.image[0]);
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
    if (!token) return toast.error("Please login to add a review");
    if (!rating || !comment.trim()) return toast.error("Please add rating and comment");
    try {
      const res = await axios.post(
        `${backendUrl}/api/product/review`,
        { productId, rating: Number(rating), comment },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Review added successfully");
        setRating(0);
        setComment("");
        fetchReviews(productId);
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const avgRating = getAverageRating();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {productData.image?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productData.image.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border transition-all ${
                    image === img ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-gray-900">
              {productData.name}
            </h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {avgRating} ({reviews.length})
              </span>
            </div>

            <p className="text-4xl font-semibold mt-5 text-gray-900">
              {currency}
              {productData.price}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed tracking-wide">
            {productData.description}
          </p>

          <button
            onClick={() => addToCart(productData._id)}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition active:scale-95"
          >
            ADD TO CART
          </button>
        </motion.div>
      </div>

      {/* Reviews */}
      <div className="border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-serif font-semibold mb-8 text-gray-900">
          Reviews ({reviews.length})
        </h2>

        {/* Add Review */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-10">
          <h3 className="font-medium text-gray-800 mb-4">Write a Review</h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  className="transition-transform hover:scale-110"
                >
                  <span
                    className={`text-3xl ${
                      num <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your experience..."
              className="w-full border border-gray-300 rounded-xl p-4 resize-none focus:outline-none focus:border-gray-800"
            />

            <button
              onClick={submitReview}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
            >
              Submit Review
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-5">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-lg">
                    {r.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{r.name}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <span
                          key={j}
                          className={`text-lg ${
                            j < r.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed">{r.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No reviews yet — be the first to share your thoughts.
          </div>
        )}
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;
