import React from "react";

interface PageContainerProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  actions,
  children,
}) => {
  return (
    <div className="min-h-[calc(97vh-90px)] bg-gradient-to-br from-gray-100 to-white py-5 px-4 sm:px-6">
      <div className="w-full max-w-screen-2xl mx-auto bg-white shadow-xl rounded-2xl p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-10">
          <h1 className="text-3xl text-center sm:text-3xl lg:text-4xl font-bold text-[#004466] leading-snug sm:leading-tight">
            {title}
          </h1>
          {actions && (
            <div className="w-full sm:w-auto sm:ml-auto">
              {actions}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default PageContainer;
