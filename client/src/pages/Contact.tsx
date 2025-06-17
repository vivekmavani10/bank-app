import React from "react";
import image from "../assets/image.png";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

// Icon wrapper component
const IconWrapper: React.FC<{ Icon: any }> = ({ Icon }) => {
  return <Icon />;
};

const ContactUs: React.FC = () => {
  return (
    <div className="bg-[#fcfcfc] pt-24 pb-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 gap-12">
        {/* Left Text Section */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-[#004466] mb-6">
            Contact <span className="text-[#d7555e]">KV Bank</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-4">
            We're here to help! Reach out to us with your questions, concerns,
            or feedback. Our dedicated support team is always ready to assist you.
          </p>
          <div className="space-y-3 text-gray-700 text-lg md:text-xl mb-6">
            <p>📍 <span className="font-semibold">Head Office:</span> 123 Finance Street, Mumbai, Maharashtra, India – 400001</p>
            <p>📞 <span className="font-semibold">Phone:</span> +91 98765 43210</p>
            <p>📧 <span className="font-semibold">Email:</span> support@kvbank.com</p>
            <p>🕒 <span className="font-semibold">Working Hours:</span> Mon - Sat, 9:00 AM – 6:00 PM</p>
          </div>
          <div className="mt-6">
            <div className="flex gap-6 text-[#ef636c] text-3xl">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#005f99]">
                <IconWrapper Icon={FaFacebook} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#005f99]">
                <IconWrapper Icon={FaTwitter} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#005f99]">
                <IconWrapper Icon={FaLinkedin} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#005f99]">
                <IconWrapper Icon={FaInstagram} />
              </a>
            </div>
          </div>
        </div>
        {/* Right Image Section */}
        <div className="flex-1">
          <img
            src={image}
            alt="Contact KV Bank"
            className="w-full max-w-md mx-auto rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;