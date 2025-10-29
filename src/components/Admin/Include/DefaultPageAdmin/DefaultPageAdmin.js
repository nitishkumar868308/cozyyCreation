"use client";
import React, { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const DefaultPageAdmin = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-functionPro">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Section */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Header */}
                <Header toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="p-6 flex-1">{children}</main>
            </div>
        </div>
    );
};

export default DefaultPageAdmin;


// "use client";
// import React, { useState } from "react";
// import Header from "../Header/Header";
// import Sidebar from "../Sidebar/Sidebar";

// const DefaultPageAdmin = ({ children }) => {
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     const toggleSidebar = () => {
//         setSidebarOpen(!sidebarOpen);
//     };

//     return (
//         <div className="flex  font-functionPro">
//             {/* Sidebar */}
//             {/* Desktop Sidebar */}
//             <div className="hidden md:block w-64 fixed inset-y-0">
//                 <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
//             </div>

//             {/* Mobile Sidebar (overlay) */}
//             {sidebarOpen && (
//                 <div className="fixed inset-0 z-40 flex md:hidden">
//                     {/* Overlay background */}
//                     <div
//                         className="fixed inset-0 bg-black bg-opacity-50"
//                         onClick={toggleSidebar}
//                     ></div>

//                     {/* Sidebar content */}
//                     <div className="relative w-64 bg-white shadow-lg z-50">
//                         <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//                     </div>
//                 </div>
//             )}

//             {/* Main Section */}
//             <div className="flex-1 flex flex-col md:ml-64">
//                 {/* Header */}
//                 <Header toggleSidebar={toggleSidebar} />

//                 {/* Page Content */}
//                 {/* <main className="p-6 flex-1">{children}</main> */}
//             </div>
//         </div>
//     );
// };

// export default DefaultPageAdmin;

