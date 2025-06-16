import React from "react";

const Home: React.FC = () => {
    return (
        <div>
            <div className="bg-gray-100 p-10 border-none rounded-lg flex items-center justify-center min-h-[calc(100vh-95px)]">
                <div>
                    <h1 className="text-3xl font-semibold">Welcome to KV Bank</h1>
                    <p className="text-xl mt-5">
                        Your trusted partner for secure and reliable banking services. We offer a range of financial solutions tailored to meet your needs.
                    </p>
                    <p className="text-xl mt-3">
                        Explore our services, manage your accounts, and enjoy a seamless banking experience with KV Bank.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home;