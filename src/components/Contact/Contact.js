"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { sendContactMessage, resetContactState } from "@/app/redux/slices/contact/contactMessageSlice";
import Loader from "../Include/Loader";
import { toast } from "react-hot-toast";

const Contact = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.me);
    const { messages, error, success, loading } = useSelector((state) => state.contactMessage);

    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        if (success) {
            toast.success(success);
            setFormData({
                name: user?.name || "",
                email: user?.email || "",
                message: ""
            });

            dispatch(resetContactState());
        }
        if (error) {
            toast.error(error);
            dispatch(resetContactState());
        }
    }, [success, error, dispatch, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email) {
            toast.error("Email is required!");
            return;
        }

        dispatch(sendContactMessage({
            name: formData.name,
            email: formData.email,
            message: formData.message
        }));

    };

    return (
        <div className="bg-gray-50 font-sans px-0 py-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-gray-900 mb-16">Contact Us</h1>

                <div className="flex flex-col md:flex-row w-full shadow-xl rounded-3xl overflow-hidden">
                    {/* Left Side - Map */}
                    <div className="flex-1 w-full">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.123456789!2d77.2195!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2b1e1e7abcd%3A0x123456789abcdef!2sCozy%20Creations!5e0!3m2!1sen!2sin!4v1693132800000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            className="w-full h-full"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="flex-1 bg-white p-10">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Send us a Message</h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    placeholder=" "
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={!!user}
                                    className={`peer w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none text-gray-800 ${user ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                />

                                <label
                                    htmlFor="name"
                                    className="absolute left-4 -top-3 text-gray-500 text-sm bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                                >
                                    Name
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder=" "
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`peer w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none text-gray-800 ${user ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                    disabled={!!user} // disable if logged in
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 -top-3 text-gray-500 text-sm bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                                >
                                    Email
                                </label>
                            </div>

                            <div className="relative">
                                <textarea
                                    id="message"
                                    placeholder=" "
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:outline-none text-gray-800"
                                ></textarea>
                                <label
                                    htmlFor="message"
                                    className="absolute left-4 -top-3 text-gray-500 text-sm bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base"
                                >
                                    Message
                                </label>
                            </div>

                            {/* Submit Button / Loader */}
                            {loading ? (
                                <Loader />
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer bg-gray-600 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl transition transform hover:scale-105"
                                >
                                    Send Message
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
