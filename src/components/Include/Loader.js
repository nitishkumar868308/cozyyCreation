import React from "react";
import Image from "next/image";

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-[9999]">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 relative animate-spin-slow">
                    <Image
                        src="/image/logo.jpg"
                        alt="Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <p className="mt-4 text-gray-600 text-lg font-medium">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default Loader;
