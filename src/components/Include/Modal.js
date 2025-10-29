"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Modal = ({ isOpen, onClose, children }) => {
    const pathname = usePathname();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {pathname !== "/admin" && (
                    <button
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white shadow-lg transition-colors duration-200 cursor-pointer"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                )}

                {children}
            </div>
        </div>
    );
};

export default Modal;