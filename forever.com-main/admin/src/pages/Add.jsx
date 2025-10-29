"use client";

import { useState, useRef } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { 
  FiPackage, 
  FiImage, 
  FiDollarSign, 
  FiFileText, 
  FiX, 
  FiCheck, 
  FiAlertCircle,
  FiUploadCloud,
  FiStar,
  FiPlus
} from 'react-icons/fi'

const Add = ({ token }) => {
  // Image states
  const [images, setImages] = useState([null, null, null, null])
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null])
  
  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [bestseller, setBestseller] = useState(false)
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    price: false,
    images: false
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")
  
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Validation functions
  const getNameError = () => {
    if (!touched.name) return ""
    if (!name) return "Product name is required"
    if (name.length < 3) return "Product name must be at least 3 characters"
    return ""
  }

  const getDescriptionError = () => {
    if (!touched.description) return ""
    if (!description) return "Description is required"
    if (description.length < 10) return "Description must be at least 10 characters"
    return ""
  }

  const getPriceError = () => {
    if (!touched.price) return ""
    if (!price) return "Price is required"
    if (price <= 0) return "Price must be greater than 0"
    return ""
  }

  const hasAtLeastOneImage = images.some(img => img !== null)
  const isFormValid = name && description && price && hasAtLeastOneImage && 
                     !getNameError() && !getDescriptionError() && !getPriceError()

  // Image handling
  const handleImageChange = (index, file) => {
    if (file) {
      if (file.size > 5000000) {
        setError("Image size should be less than 5MB")
        return
      }
      
      const newImages = [...images]
      const newPreviews = [...imagePreviews]
      
      newImages[index] = file
      newPreviews[index] = URL.createObjectURL(file)
      
      setImages(newImages)
      setImagePreviews(newPreviews)
      setError("")
    }
  }

  const removeImage = (index) => {
    const newImages = [...images]
    const newPreviews = [...imagePreviews]
    
    newImages[index] = null
    newPreviews[index] = null
    
    setImages(newImages)
    setImagePreviews(newPreviews)
    
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = ""
    }
  }

  const onSubmitHandle = async (e) => {
    e.preventDefault()
    
    setTouched({ name: true, description: true, price: true, images: true })
    
    if (!isFormValid) {
      setError("Please fill in all required fields correctly")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const formData = new FormData()
      
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("bestseller", bestseller)
      
      images.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image)
        }
      })

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success("Product added successfully!")
        
        // Reset form
        setName('')
        setDescription('')
        setPrice('')
        setBestseller(false)
        setImages([null, null, null, null])
        setImagePreviews([null, null, null, null])
        setTouched({ name: false, description: false, price: false, images: false })
        
      } else {
        toast.error(response.data.message || "Failed to add product")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || "An error occurred while adding the product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Add New Product
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Fill in the details to add a new product to your catalog
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <form onSubmit={onSubmitHandle} className="space-y-6">
          
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Images *
            </label>
            <p className="text-xs sm:text-sm text-gray-500 mb-3">
              Upload up to 4 images (at least 1 required, max 5MB each)
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="relative group">
                  {!imagePreviews[index] ? (
                    <label className="block cursor-pointer">
                      <div className={`aspect-square border-2 border-dashed rounded-lg transition-all flex flex-col items-center justify-center ${
                        index === 0 && touched.images && !hasAtLeastOneImage 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <FiUploadCloud className="text-2xl sm:text-3xl text-gray-400 mb-1" />
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium text-center px-2">
                          {index === 0 ? 'Main' : `#${index + 1}`}
                        </span>
                      </div>
                      <input
                        ref={fileInputRefs[index]}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) handleImageChange(index, file)
                        }}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative aspect-square">
                      <img
                        src={imagePreviews[index]}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <FiX className="text-xs" />
                      </button>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                          Main
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {touched.images && !hasAtLeastOneImage && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <FiAlertCircle className="flex-shrink-0" />
                At least one image is required
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <div className="relative">
              <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched({ ...touched, name: true })}
                className={`w-full pl-10 pr-10 py-2.5 border-2 rounded-lg transition-all outline-none text-sm sm:text-base ${
                  getNameError()
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Enter product name"
              />
              {name && !getNameError() && touched.name && (
                <FiCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              )}
            </div>
            {getNameError() && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <FiAlertCircle className="flex-shrink-0" />
                {getNameError()}
              </p>
            )}
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Price *
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={() => setTouched({ ...touched, price: true })}
                className={`w-full pl-10 pr-10 py-2.5 border-2 rounded-lg transition-all outline-none text-sm sm:text-base ${
                  getPriceError()
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {price && !getPriceError() && touched.price && (
                <FiCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              )}
            </div>
            {getPriceError() && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <FiAlertCircle className="flex-shrink-0" />
                {getPriceError()}
              </p>
            )}
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Description *
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-3 text-gray-400 text-lg" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setTouched({ ...touched, description: true })}
                className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg transition-all outline-none resize-none text-sm sm:text-base ${
                  getDescriptionError()
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Describe your product..."
                rows="4"
              />
            </div>
            {getDescriptionError() && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <FiAlertCircle className="flex-shrink-0" />
                {getDescriptionError()}
              </p>
            )}
          </div>

          {/* Bestseller Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="bestseller" className="flex items-center gap-2 cursor-pointer flex-1">
              <FiStar className={`text-lg ${bestseller ? 'text-yellow-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium text-gray-700">Mark as Bestseller</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">
              * Required fields
            </p>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                isSubmitting || !isFormValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              <FiPlus className="text-lg" />
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Add