"use client";
import React, { useState, useEffect } from "react";
import { fetchVideos } from "@/app/redux/slices/videoStory/videoStorySlice";
import { useDispatch, useSelector } from "react-redux";

const StorySection = () => {
    const dispatch = useDispatch();
    const { videos } = useSelector((state) => state.videoStory);
    console.log("videos", videos)
    const [activeStory, setActiveStory] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchVideos());
    }, [dispatch]);

    const openModal = (storyId) => {
        setActiveStory(storyId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setActiveStory(null);
        setModalOpen(false);
    };

    // Filter only active videos
    const activeVideos = videos.filter((video) => video.active);

    return (
        <div className="bg-gray-50 py-6 px-4">
            <h2 className="text-2xl mb-6 font-functionPro">Stories</h2>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-1">
                {activeVideos.map((story) => (
                    <div
                        key={story.id}
                        className="flex flex-col items-center flex-shrink-0 w-20 sm:w-28 md:w-32"
                    >
                        <div
                            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gradient-to-tr from-pink-500 to-yellow-500 cursor-pointer flex items-center justify-center transition-transform hover:scale-105"
                            onClick={() => openModal(story.id)}
                        >
                            <video
                                src={story.url}
                                className="w-full h-full object-cover"
                                muted
                                autoPlay
                                loop
                            />
                        </div>

                        <span className="mt-2 text-xs sm:text-sm text-gray-700 font-functionPro text-center truncate w-full">
                            {story.title}
                        </span>
                    </div>
                ))}

                {activeVideos.length === 0 && (
                    <span className="text-gray-400 italic">No active stories available</span>
                )}
            </div>

            {/* Modal */}
            {modalOpen && activeStory && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative w-full max-w-4xl h-[60vh] sm:h-[70vh] mx-2 bg-black rounded-2xl overflow-hidden flex items-center justify-center">

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-white text-3xl font-bold z-50 hover:text-red-300 cursor-pointer"
                        >
                            &times;
                        </button>

                        {/* Video */}
                        <video
                            src={activeVideos.find((s) => s.id === activeStory)?.url}
                            autoPlay
                            controls
                            className="w-full h-full object-contain max-h-screen"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorySection;
