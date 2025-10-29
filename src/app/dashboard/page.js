// "use client";
// import { useState, useEffect } from "react";
// import PrivateRoute from "@/components/PrivateRoute";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import Profile from "@/components/Include/UserDashboard/Profile";
// import Address from "@/components/Include/UserDashboard/Address";
// import OrderSummrey from "@/components/Include/UserDashboard/OrderSummrey";
// import { useSearchParams } from "next/navigation";

// export default function Dashboard() {
//     const searchParams = useSearchParams();
//     const tabFromQuery = searchParams.get("tab"); // check if ?tab=addresses
//     const [activeTab, setActiveTab] = useState("orders");
//     const router = useRouter();

//     useEffect(() => {
//         if (tabFromQuery) {
//             setActiveTab(tabFromQuery); // override default if query param exists
//         }
//     }, [tabFromQuery]);

//     return (
//         <PrivateRoute roles={["USER"]}>
//             <div className="bg-gray-50 p-4 md:p-8">
//                 <h1 className="text-3xl font-bold mb-8 text-gray-800">My Dashboard</h1>

//                 {/* Tabs for desktop */}
//                 <div className="hidden md:flex space-x-4 mb-8 ">
//                     {["orders", "addresses", "profile"].map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setActiveTab(tab)}
//                             className={`px-5 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab
//                                 ? "bg-gray-800 text-white shadow-md"
//                                 : "bg-white border border-gray-200 hover:bg-gray-100 cursor-pointer"
//                                 }`}
//                         >
//                             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Accordion for mobile */}
//                 <div className="md:hidden space-y-3 mb-8">
//                     {["orders", "addresses", "profile"].map((tab) => (
//                         <div key={tab} className="bg-white border rounded-lg shadow-sm overflow-hidden">
//                             <button
//                                 onClick={() => setActiveTab(activeTab === tab ? "" : tab)}
//                                 className="w-full text-left px-5 py-4 font-medium flex justify-between items-center text-gray-700 hover:bg-gray-50 transition"
//                             >
//                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                 <span className="text-xl font-bold">{activeTab === tab ? "-" : "+"}</span>
//                             </button>
//                             {activeTab === tab && (
//                                 <div className="p-5 border-t bg-gray-50 cursor-pointer">{renderContent(tab)}</div>
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Desktop content */}
//                 <div className="hidden md:block bg-white shadow-lg rounded-lg p-8">
//                     {renderContent(activeTab)}
//                 </div>
//             </div>
//         </PrivateRoute>
//     );
// }

// // Render content based on active tab
// function renderContent(tab) {
//     switch (tab) {
//         case "orders":
//             return (
//                 <OrderSummrey />
//             );
//         case "addresses":
//             return (
//                 <Address />
//             );
//         case "profile":
//             return (
//                 <Profile />
//             )
//         default:
//             return <p className="text-gray-500">Select a tab</p>;
//     }
// }

"use client";
import { useState, useEffect } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { useRouter } from "next/navigation";
import Profile from "@/components/Include/UserDashboard/Profile";
import Address from "@/components/Include/UserDashboard/Address";
import OrderSummrey from "@/components/Include/UserDashboard/OrderSummrey";
import { useSearchParams } from "next/navigation";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("orders");
    const searchParams = useSearchParams();
    const tabFromQuery = searchParams.get("tab");
    const { user } = useSelector((state) => state.me);
    console.log("user", user)
    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);


    // useEffect(() => {
    //     if (tabFromQuery) setActiveTab(tabFromQuery);

    //     // Optional: Remove query param from URL without reload
    //     if (tabFromQuery) {
    //         router.replace("/dashboard", { shallow: true });
    //     }
    // }, [tabFromQuery]);
    // useEffect(() => { if (tabFromQuery) setActiveTab(tabFromQuery); }, [tabFromQuery]);
    useEffect(() => {
        // Check if URL has ?addresses
        if (searchParams.has("addresses")) {
            setActiveTab("addresses");
        }
    }, [searchParams]);


    return (
        <PrivateRoute roles={["USER"]}>
            <div className="bg-gray-50 p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Dashboard</h1>

                {/* Desktop tabs */}
                <div className="hidden md:flex space-x-4 mb-8 ">
                    {/* {["orders", "addresses", "profile"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab
                                ? "bg-gray-800 text-white shadow-md"
                                : "bg-white border border-gray-200 hover:bg-gray-100 cursor-pointer"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))} */}
                    {["orders", "addresses", "profile"].map((tab) => {
                        const isProfileIncomplete =
                            tab === "profile" &&
                            user && (
                                !user.name?.trim() ||
                                !user.email?.trim() ||
                                !user.phone?.trim() ||
                                !user.gender?.trim() ||
                                !user.profileImage
                            );
                        console.log("isProfileIncomplete", isProfileIncomplete)
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-5 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab
                                    ? "bg-gray-800 text-white shadow-md"
                                    : "bg-white border border-gray-200 hover:bg-gray-100 cursor-pointer"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}

                                {/* Badge */}
                                {tab === "profile" && user && (
                                    <div className="relative group inline-block">
                                        {/* Always visible badge */}
                                        <span
                                            className={`absolute top-0 right-0 mt-2 mr-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full ${isProfileIncomplete
                                                    ? "bg-red-500 text-white"
                                                    : "bg-green-500 text-white"
                                                }`}
                                        >
                                            {isProfileIncomplete ? "Incomplete" : "Complete"}
                                        </span>


                                        {/* Tooltip on hover */}
                                        {isProfileIncomplete && (
                                            <div className="absolute -top-8 right-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {[
                                                    !user.profileImage && "Profile Image",
                                                    !user.phone && "Phone",
                                                    !user.gender && "Gender",
                                                    !user.name && "Name",
                                                    !user.email && "Email"
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}{" "}
                                                pending
                                            </div>
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Mobile accordion */}
                <div className="md:hidden space-y-3 mb-8">
                    {["orders", "addresses", "profile"].map((tab) => (
                        <div key={tab} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={() => setActiveTab(activeTab === tab ? "" : tab)}
                                className="w-full text-left px-5 py-4 font-medium flex justify-between items-center text-gray-700 hover:bg-gray-50 transition"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                <span className="text-xl font-bold">{activeTab === tab ? "-" : "+"}</span>
                            </button>
                            {activeTab === tab && (
                                <div className="p-5 border-t bg-gray-50 cursor-pointer">{renderContent(tab)}</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop content */}
                <div className="hidden md:block bg-white shadow-lg rounded-lg p-8">
                    {renderContent(activeTab)}
                </div>
            </div>
        </PrivateRoute>
    );
}

// Render content based on active tab
function renderContent(tab) {
    switch (tab) {
        case "orders":
            return <OrderSummrey />;
        case "addresses":
            return <Address />;
        case "profile":
            return <Profile />;
        default:
            return <p className="text-gray-500">Select a tab</p>;
    }
}
