"use client";
import React, { useEffect } from "react";
import DefaultPageAdmin from "@/components/Admin/Include/DefaultPageAdmin/DefaultPageAdmin";
import { fetchAllUsers } from "@/app/redux/slices/getAllUser/getAllUser";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
    const dispatch = useDispatch();
    const { list: users, loading, error } = useSelector(
        (state) => state.getAllUser
    );

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    return (
        <DefaultPageAdmin>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Users</h1>

            {loading && <p className="text-gray-500 mb-4">Loading users...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {users.length > 0 ? (
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="shadow-lg overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                            S.No
                                        </th>
                                        <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-white text-sm font-semibold uppercase tracking-wider">
                                            Role
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100 cursor-pointer">
                                    {users.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className={`transition transform hover:scale-[1.01] hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                }`}
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-medium">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role.toLowerCase() === "admin"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No users found.</p>
            )}
        </DefaultPageAdmin>
    );
};

export default Page;
