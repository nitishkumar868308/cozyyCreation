"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HomeSlider = () => {
    const slides = [
        { id: 1, image: "/image/Untitled-1.png", text: "Welcome to Our Website" },
        { id: 2, image: "/image/Untitled-1-Picsart-AiImageEnhancer.png", text: "Explore Our Services" },
        { id: 3, image: "/image/download3.jpg", text: "Innovative Solutions" },
        { id: 4, image: "/image/download4.jpg", text: "Grow With Us" },
        { id: 5, image: "/image/download5.jpg", text: "Your Success, Our Goal" },
        { id: 6, image: "/image/download6.jpg", text: "Quality & Excellence" },
        { id: 7, image: "/image/download7.jpg", text: "Join Our Community" },
        { id: 8, image: "/image/download8.jpg", text: "Start Your Journey" },
    ];

    return (
        <div className="w-full">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-[300px] md:h-[500px] lg:h-[800px]  md:mt-0">
                            <Image
                                src={slide.image}
                                alt={`Slide ${slide.id}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8">
                                <h2 className="text-white text-2xl md:text-4xl lg:text-6xl drop-shadow-lg text-center">
                                    {slide.text}
                                </h2>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

    );
};

export default HomeSlider;
