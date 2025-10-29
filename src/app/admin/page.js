"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/Include/Modal";
import Login from "@/components/Include/Login";

const Page = () => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // Open modal automatically when page loads
    useEffect(() => {
        setLoginModalOpen(true);
    }, []);

    return (
        <>
            <Modal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
                <Login />
            </Modal>
        </>
    );
};

export default Page;
