"use client";
import React, { useState, useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { X, Trash2, Edit, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "@/components/Include/Loader";
import {
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
} from "@/app/redux/slices/videoStory/videoStorySlice";
import { useDispatch, useSelector } from "react-redux";

const VideoStory = () => {
    const dispatch = useDispatch();
    const { videos, loading } = useSelector((state) => state.videoStory);

    const [modalOpen, setModalOpen] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [title, setTitle] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteVideoId, setDeleteVideoId] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editVideo, setEditVideo] = useState(null);
    const [editFile, setEditFile] = useState(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState(null);

    useEffect(() => {
        dispatch(fetchVideos());
    }, [dispatch]);

    // Utility to upload video file
    const handleVideoUpload = async (file) => {
        const formData = new FormData();
        formData.append("video", file);
        // console.log("formData" , formData)

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        // console.log("res" , res)
        let data;
        try {
            data = await res.json();
            // console.log("data" , data)
        } catch (err) {
            throw new Error("Server did not return valid JSON");
        }

        if (!res.ok) throw new Error(data.message || "Upload failed");

        // Handle array or string
        const url = Array.isArray(data.urls) ? data.urls[0] : data.urls;
        if (!url) throw new Error("No URL returned from server");

        return url;
    };


    // Upload new video
    const handleUpload = async () => {
        if (!videoFile || !title) {
            toast.error("Please provide title and select a video file");
            return;
        }

        try {
            const url = await handleVideoUpload(videoFile);

            await dispatch(
                createVideo({ title, url }) // your slice expects title + url
            ).unwrap();

            toast.success("Video uploaded successfully ✅");
            setModalOpen(false);
            setVideoFile(null);
            setPreviewUrl(null);
            setTitle("");
        } catch (err) {
            toast.error(err.message || "Upload failed");
        }
    };

    // Toggle video active status
    const toggleActive = async (video) => {
        try {
            await dispatch(
                updateVideo({ ...video, active: !video.active })
            ).unwrap();
            toast.success("Status updated");
        } catch (err) {
            toast.error(err.message || "Status update failed");
        }
    };

    // Delete video
    const handleDelete = async () => {
        try {
            await dispatch(deleteVideo(deleteVideoId)).unwrap();
            toast.success("Video deleted successfully");
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Delete failed");
        }
    };

    // Edit video
    const handleEdit = (video) => {
        setEditVideo(video);
        setEditPreviewUrl(video.url);
        setEditFile(null);
        setEditModalOpen(true);
    };

    // Update video
    const handleUpdate = async () => {
        if (!editVideo.title) {
            toast.error("Title cannot be empty");
            return;
        }

        try {
            let url = editVideo.url;

            if (editFile) {
                url = await handleVideoUpload(editFile);
            }

            await dispatch(
                updateVideo({ ...editVideo, url })
            ).unwrap();

            toast.success("Video updated ✅");
            setEditModalOpen(false);
            setEditVideo(null);
            setEditFile(null);
            setEditPreviewUrl(null);
        } catch (err) {
            toast.error(err.message || "Update failed");
        }
    };

    return (
        <DefaultPageAdmin>
            {loading && <Loader />}

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Video Stories</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-gray-500 hover:bg-gray-800 cursor-pointer text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Upload Video
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {videos.map((v, idx) => (
                                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4">{v.title}</td>
                                    <td className="px-6 py-4">
                                        <video src={v.url} className="w-28 rounded" controls />
                                    </td>
                                    <td className="px-6 py-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={v.active}
                                                onChange={() => toggleActive(v)}
                                                className="sr-only"
                                            />
                                            <span
                                                className={`w-12 h-6 flex items-center flex-shrink-0 p-1 rounded-full duration-300 ease-in-out ${v.active ? "bg-green-500" : "bg-gray-300"}`}
                                            >
                                                <span
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${v.active ? "translate-x-6" : "translate-x-0"}`}
                                                />
                                            </span>
                                            <span
                                                className={`ml-3 text-sm font-medium ${v.active ? "text-green-600" : "text-gray-500"}`}
                                            >
                                                {v.active ? "Active" : "Inactive"}
                                            </span>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(v)}
                                                className="p-2 text-gray-500 hover:text-gray-800 cursor-pointer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteVideoId(v.id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {videos.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                                        No videos found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Upload Video Story</h2>

                        <input
                            type="text"
                            placeholder="Enter video title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4"
                        />

                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400">
                            <span className="text-gray-600">Click to select video file</span>
                            <input type="file" accept="video/*" onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setVideoFile(file);
                                    setPreviewUrl(URL.createObjectURL(file));
                                }
                            }} className="hidden" />
                        </label>

                        {previewUrl && <video src={previewUrl} controls className="mb-4 w-full rounded-lg mt-4" />}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-lg border cursor-pointer hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                className="px-4 py-2 rounded-lg bg-gray-500 cursor-pointer text-white hover:bg-gray-800"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && editVideo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Video Story</h2>

                        <input
                            type="text"
                            value={editVideo.title}
                            onChange={(e) => setEditVideo({ ...editVideo, title: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-4"
                        />

                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400">
                            <span className="text-gray-600">Click to replace video file</span>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setEditFile(file);
                                        setEditPreviewUrl(URL.createObjectURL(file));
                                    }
                                }}
                                className="hidden"
                            />
                        </label>

                        {editPreviewUrl && <video src={editPreviewUrl} controls className="mb-4 w-full rounded-lg mt-4" />}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 cursor-pointer rounded-lg border hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 rounded-lg cursor-pointer bg-gray-500 text-white hover:bg-gray-800"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
                        <button onClick={() => setDeleteModalOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this video?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2  rounded-lg border hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg  bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultPageAdmin>
    );
};

export default VideoStory;
