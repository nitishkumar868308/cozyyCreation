"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

const categories = [
    {
        name: "Candles",
        links: [
            { name: "Scented", href: "/categories/candles" },
            { name: "Decorative", href: "/categories/candles" },
            { name: "Luxury", href: "/categories/candles" },
        ],
    },
    {
        name: "Herbs",
        links: [
            { name: "Dry Herbs", href: "/categories/herbs/dry" },
            { name: "Powder", href: "/categories/herbs/powder" },
        ],
    },
    {
        name: "Oil",
        links: [
            { name: "Essential Oil", href: "/categories/oil/essential" },
            { name: "Herbal Oil", href: "/categories/oil/herbal" },
        ],
    },
    {
        name: "Clothing",
        links: [
            { name: "Jeans", href: "/categories/clothing/subcategory/jeans" },
            { name: "Shirt", href: "/categories/clothing" },
            { name: "Coat Paint", href: "/categories/clothing" },
        ],
    },
];

const PageHeader = () => {
    //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    //   const [openDropdown, setOpenDropdown] = useState(null);

    const [openDropdown, setOpenDropdown] = useState(null);

    const handleToggle = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <>
            {/* <div className="w-full bg-white py-4 px-4 md:px-0">
    
      <nav className="hidden md:flex justify-center gap-8">
        {categories.map((cat, index) => (
          <div key={index} className="relative group">
            <button className="flex items-center gap-1 font-medium hover:text-blue-600">
              {cat.name} <ChevronDown size={16} />
            </button>
      
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-40">
              {cat.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="md:hidden flex justify-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white mt-2 shadow-lg rounded-md">
          {categories.map((cat, index) => (
            <div key={index} className="border-b">
              <button
                className="flex justify-between items-center w-full px-4 py-3 font-medium"
                onClick={() =>
                  setOpenDropdown(openDropdown === index ? null : index)
                }
              >
                {cat.name}
                <ChevronDown
                  className={`transform transition ${
                    openDropdown === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openDropdown === index && (
                <div className="pl-6 pb-2">
                  {cat.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      className="block py-2 text-gray-700 hover:text-blue-600"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div> */}

            <div className="w-full bg-white py-4 px-4 md:px-0 cursor-pointer">
                <nav className="flex flex-col md:flex-row md:gap-8 ">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="relative w-full md:w-auto"
                            onMouseEnter={() => setOpenDropdown(index)} // Hover open
                            onMouseLeave={() => setOpenDropdown(null)}  // Hover leave close
                        >
                            <button
                                className="flex justify-between md:justify-center items-center w-full md:w-auto font-medium px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
                                onClick={() => handleToggle(index)}
                            >
                                {cat.name} <ChevronDown size={16} className={`ml-1 transition-transform ${openDropdown === index ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown */}
                            <div
                                className={`absolute md:top-full md:left-0 mt-2 md:mt-2 bg-white shadow-lg rounded-md py-2 w-full md:w-44 z-20 transition-all duration-200 ${openDropdown === index ? "opacity-100 visible" : "opacity-0 invisible"
                                    }`}
                            >
                                {cat.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default PageHeader;
