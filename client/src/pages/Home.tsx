import React from "react";
import image from "../assets/image.png"

const Home: React.FC = () => {
  return (
    <div className="bg-[#fcfcfc] pt-24 pb-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 gap-12">
        {/* Left Text Section */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-[#004466] mb-4">
           KV Banking <span className="text-[#d7555e]">Service</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-6">
             Explore our services, manage your accounts, and enjoy a seamless banking experience with KV Bank.
              Your trusted partner for secure and reliable banking services. We offer a range of financial solutions tailored to meet your needs.
          </p>
          <button className="bg-[#d45f5f] text-white px-6 py-3 rounded-full hover:bg-[#e799aa] transition">
            Read More
          </button>
        </div>

        <div className="flex-1">
          <img
            src={image}
            alt="Banking"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
