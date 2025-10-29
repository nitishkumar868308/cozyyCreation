import Image from "next/image";
import HomeSlider from "@/components/HomeSlider/HomeSlider";
import ProductSlider from "@/components/Product/Product";
import TestMonial from "@/components/Testmonial/TestMonial";
import StorySection from "@/components/StorySection/StorySection";

export default function Home() {
  return (
    <>
      <HomeSlider />
      <StorySection />
      <ProductSlider showSection={['featured', 'new']} />
      <TestMonial />
    </>
  );
}


// "use client";
// import React from "react";
// import { FaTools } from "react-icons/fa";
// import { FaAmazon } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";

// const Page = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-4">
//       <div className="bg-white shadow-lg rounded-2xl max-w-lg w-full p-8 text-center">
//         {/* Icon */}
//         <div className="flex justify-center mb-6">
//           <FaTools className="text-orange-500 text-6xl animate-bounce" />
//         </div>

//         {/* Title */}
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">
//           🚧 Under Maintenance 🚧
//         </h1>

//         {/* Description */}
//         <p className="text-gray-600 mb-8">
//           Our website is currently under maintenance.
//           Please check back soon.
//           Meanwhile, visit Amazon or contact us for more details.
//         </p>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <a
//             href="https://www.amazon.in"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition"
//           >
//             <FaAmazon className="text-xl" />
//             Go to Amazon
//           </a>

//           <a
//             href="mailto:healingherbsoilsshop@gmail.com"
//             className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold shadow-md hover:bg-gray-900 transition"
//           >
//             <MdEmail className="text-xl" />
//             Contact Us
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
