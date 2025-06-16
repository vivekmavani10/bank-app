import React from "react";

const ContactUs: React.FC = () => {
  return (
    <div>
      <div className="bg-gray-100 p-10 border-none rounded-lg flex items-center justify-center min-h-[calc(100vh-95px)]">
        <div>
          <h1 className="text-3xl font-semibold">Contact KV Bank</h1>
          <p className="text-xl mt-5">
            We're here to help! Reach out to us for any questions, support, or feedback. Our team is available to assist you with your banking needs.
          </p>
          <p className="text-xl mt-3">
            📍 <strong>Head Office:</strong> 123 Finance Street, Mumbai, India
          </p>
          <p className="text-xl mt-3">
            📞 <strong>Phone:</strong> +91 98765 43210
          </p>
          <p className="text-xl mt-3">
            📧 <strong>Email:</strong> support@kvbank.com
          </p>
          <p className="text-xl mt-3">
            You can also connect with us through our social media platforms for the latest updates and announcements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
