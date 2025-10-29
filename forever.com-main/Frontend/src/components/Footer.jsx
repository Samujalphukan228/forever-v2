import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 py-8 px-5 sm:px-12 border-t border-gray-200">
      {/* Main Grid */}
      <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-8 mb-6">
        
        {/* Logo & Description */}
        <div>
          <h1 className="text-xl font-semibold text-[#0F3D2F] mb-3">forEver</h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-md">
            Discover our exclusive earring collection that combines elegance with affordability. 
            Forever brings premium-quality designs at prices that make luxury accessible.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-base font-semibold mb-3 text-gray-900">Company</p>
          <ul className="flex flex-col gap-1.5 text-gray-600 text-sm">
            {["Home", "About Us", "Delivery", "Privacy Policy"].map((link, idx) => (
              <li
                key={idx}
                className="hover:text-gray-900 cursor-pointer transition-colors duration-300"
              >
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-base font-semibold mb-3 text-gray-900">Get in Touch</p>
          <ul className="flex flex-col gap-1 text-gray-600 text-sm">
            <li><span className="font-medium">Phone:</span> +1 212-456-7890</li>
            <li><span className="font-medium">Email:</span> contact@forever.com</li>
          </ul>
        </div>
      </div>

      {/* Divider & Copyright */}
      <hr className="border-gray-200 mb-3" />
      <p className="text-xs text-center text-gray-500">
        &copy; {new Date().getFullYear()} forEver.com — All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
