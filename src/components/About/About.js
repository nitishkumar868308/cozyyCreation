"use client";
import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Users, Package, Award, Headphones } from "lucide-react"

const About = () => {
    return (
        <section className="bg-white text-gray-800 font-functionPro">
            {/* Hero Section */}
            <div className="relative w-full h-[400px] md:h-[500px]">
                <img
                    src="/image/banner1.jpg"
                    alt="About Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide text-center leading-snug">
                        Discover <span className="text-gray-100">Our Story</span>
                        <br />
                        Experience Shopping Like Never Before
                    </h1>
                </div>
            </div>

            {/* Intro Section */}
            <div className="max-w-5xl mx-auto px-6 py-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-600">
                    Welcome to <span className="text-gray-900">Cozyy Creations</span>
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                    At Cozyy Creations, we aim to redefine shopping with premium
                    products, unbeatable offers, and a seamless experience. Our goal is
                    simple: to bring magic to your everyday shopping.
                </p>
            </div>

            {/* Features / Stats Section */}
            <div className="bg-gray-100 py-12">
                <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-center">

                    <div className="flex-1 min-w-[200px] max-w-xs bg-white p-6 rounded-lg shadow">
                        <Users className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                        <h3 className="text-xl font-semibold">10K+ Customers</h3>
                        <p className="text-gray-600 text-sm">
                            Trusted by thousands of happy buyers worldwide
                        </p>
                    </div>

                    <div className="flex-1 min-w-[200px] max-w-xs bg-white p-6 rounded-lg shadow">
                        <Package className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                        <h3 className="text-xl font-semibold">5K+ Products</h3>
                        <p className="text-gray-600 text-sm">
                            A wide range of premium and unique items
                        </p>
                    </div>

                    <div className="flex-1 min-w-[200px] max-w-xs bg-white p-6 rounded-lg shadow">
                        <Award className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                        <h3 className="text-xl font-semibold">Top Rated</h3>
                        <p className="text-gray-600 text-sm">
                            Excellence in quality and customer satisfaction
                        </p>
                    </div>

                    <div className="flex-1 min-w-[200px] max-w-xs bg-white p-6 rounded-lg shadow">
                        <Headphones className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                        <h3 className="text-xl font-semibold">24/7 Support</h3>
                        <p className="text-gray-600 text-sm">
                            Always here to assist you with any queries
                        </p>
                    </div>

                </div>
            </div>




            {/* Call to Action */}
            <div className="bg-gray-200 text-white py-16 text-center">
                <h2 className="text-3xl md:text-4xl text-gray-500 font-bold mb-6">
                    Join the <span className="text-gray-900">Cozyy Creations</span> Family
                </h2>
                <p className="max-w-2xl mx-auto text-gray-700 mb-8">
                    Be the first to know about exclusive drops, offers, and updates from our store.
                </p>

                {/* Social Icons Row */}
                <div className="flex justify-center gap-6">
                    <a href="#" className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition transform hover:scale-110">
                        <Facebook className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="bg-blue-400 hover:bg-blue-500 p-4 rounded-full transition transform hover:scale-110">
                        <Twitter className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="bg-pink-500 hover:bg-pink-600 p-4 rounded-full transition transform hover:scale-110">
                        <Instagram className="w-6 h-6 text-white" />
                    </a>
                    <a href="#" className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition transform hover:scale-110">
                        <Youtube className="w-6 h-6 text-white" />
                    </a>
                </div>
            </div>

        </section>
    );
};

export default About;
