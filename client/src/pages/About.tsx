import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div>
      <div className="bg-gray-100 p-10 border-none rounded-lg flex items-center justify-center min-h-[calc(100vh-95px)]">
        <div>
          <h1 className="text-3xl font-semibold">About KV Bank</h1>
          <p className="text-xl mt-5">
            KV Bank is committed to delivering innovative and customer-centric banking services.
            With a strong foundation and a vision for growth, we aim to redefine financial excellence.
          </p>
          <p className="text-xl mt-3">
            Our mission is to provide transparent, efficient, and accessible banking solutions 
            to individuals, families, and businesses across the country.
          </p>
          <p className="text-xl mt-3">
            Backed by a passionate team and advanced technology, KV Bank ensures your money is always in safe hands.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
