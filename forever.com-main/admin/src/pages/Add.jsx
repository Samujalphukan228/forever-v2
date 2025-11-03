"use client";

import { useState, useRef } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { FiImage, FiX, FiCheck, FiUploadCloud } from 'react-icons/fi'

const Add = ({ token }) => {
  // Image states
  const [images, setImages] = useState([null, null, null, null])
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null])
  
  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [bestseller, setBestseller] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Validation
  const hasAtLeastOneImage = images.some(img => img !== null)
  const isFormValid = name && description && price && hasAtLeastOneImage

  // Image handling
  const handleImageChange = (index, file) => {
    if (file) {
      if (file.size > 5000000) {
        toast.error("Image size should be less than 5MB")
        return
      }

      const newImages = [...images]
      const newPreviews = [...imagePreviews]
      
      newImages[index] = file
      newPreviews[index] = URL.createObjectURL(file)
      
      setImages(newImages)
      setImagePreviews(newPreviews)
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

    if (!isFormValid) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

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
        
      } else {
        toast.error(response.data.message || "Failed to add product")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <form onSubmit={onSubmitHandle} className="space-y-6">
        
        {/* Image Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Product Images *</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="relative">
                {!imagePreviews[index] ? (
                  <label className="block cursor-pointer">
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-black transition-colors">
                      <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">
                        {index === 0 ? 'Main Image' : `Image ${index + 1}`}
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
                  <div className="relative aspect-square group">
                    <img
                      src={imagePreviews[index]}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="text-black" />
                    </button>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Product Details</h2>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
              placeholder="Describe your product..."
              rows="4"
              required
            />
          </div>

          {/* Bestseller */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <span className="font-medium">Mark as Bestseller</span>
            <button
              type="button"
              onClick={() => setBestseller(!bestseller)}
              className={`w-12 h-6 rounded-full transition-colors ${
                bestseller ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                bestseller ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isSubmitting || !isFormValid
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default Add