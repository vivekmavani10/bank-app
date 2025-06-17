import React from "react";
import image from "../assets/image.png"
const AboutUs: React.FC = () => {
  return (
    <div className="bg-[#fcfcfc] pt-24 pb-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 gap-12">
        {/* Left Text Section */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-[#004466] mb-4">
            About <span className="text-[#d7555e]">KV Bank</span>
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-4">
            KV Bank is committed to delivering <span className="font-semibold text-[#d7555e]">innovative</span> and
            <span className="font-semibold text-[#d7555e]"> customer-centric</span> banking services.
            With a strong foundation and a vision for growth, we aim to redefine financial excellence.
          </p>
          <p className="text-gray-700 text-lg md:text-xl mb-4">
            Our mission is to provide <span className="font-semibold text-[#d7555e]">transparent</span>, efficient, and
            accessible banking solutions to individuals, families, and businesses across the country.
          </p>
          <p className="text-gray-700 text-lg md:text-xl mb-6">
            Backed by a passionate team and cutting-edge technology, KV Bank ensures your money is always in safe hands—because we value your trust.
          </p>
          <button className="bg-[#d45f5f] text-white px-6 py-3 rounded-full hover:bg-[#008ecc] transition">
            Read More
          </button>
        </div>

        <div className="flex-1">
          <img
            src={image}
            alt=" Banking"
            className="w-full max-w-md mx-auto rounded-xl "
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
