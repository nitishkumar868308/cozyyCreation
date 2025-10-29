import React from "react";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="bg-[#161619] text-white ">
            <div className="max-w-screen-2xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">

                {/* Logo + Description */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <img
                            src="/image/HWM LOGO 1 GREY 100.png"
                            alt="Logo"
                            className="h-24 w-24 object-contain"
                        />
                    </div>
                    <p className="text-gray-400 text-sm md:text-base font-functionPro">
                        Your ultimate destination for all things magical and mystical.<br />
                        Explore our collection and find everything you need to bring your spells and rituals to life.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-3 font-functionPro">
                    <h3 className="text-lg mb-3">Quick Links</h3>
                    <ul className="flex flex-col gap-2">
                        {[
                            { name: "Home", href: "/" },
                            { name: "Shop", href: "/categories" },
                            { name: "About", href: "/about" },
                            { name: "Contact", href: "/contact" },
                            { name: "FAQ", href: "/faq" },
                        ].map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="transition cursor-pointer px-2 py-1 rounded hover:bg-white hover:text-black"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Policy Links */}
                <div className="flex flex-col gap-3 font-functionPro">
                    <h3 className="text-lg mb-3">Policy</h3>
                    <ul className="flex flex-col gap-2">
                        {[
                            { name: "Privacy Policy", href: "/privacy-policy" },
                            { name: "Terms and Conditions", href: "/terms-and-conditions" },
                            { name: "Refund Policy", href: "/refund-policy" },
                            { name: "Shipping and Return Policy", href: "/shipping-and-return-policy" },
                        ].map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="transition cursor-pointer px-2 py-1 rounded hover:bg-white hover:text-black"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact / Follow */}
                <div className="flex flex-col gap-4 font-functionPro">
                    {/* Get In Touch */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-lg mb-3">Get In Touch</h3>

                        <div className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition cursor-pointer">
                            <MapPin className="h-5 w-5" />
                            <span>27 Deepali, Pitampura, New Delhi 110034</span>

                        </div>

                        <div className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition cursor-pointer">
                            <Mail className="h-5 w-5" />
                            <span>healingherbsoilsshop@gmail.com</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition cursor-pointer">
                            <Phone className="h-5 w-5" />
                            <span>+91 9717033830</span>
                        </div>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-lg mb-3">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-blue-400 transition cursor-pointer">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-pink-500 transition cursor-pointer">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-blue-500 transition cursor-pointer">
                                <Twitter className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-100 space-y-2">
                <h3 className="text-lg font-semibold">Disclaimer</h3>
                <p className="text-sm font-light asd">
                    Results are not guaranteed, and we do not assure any specific outcomes.
                </p>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 mt-6 py-4 text-center text-gray-400 text-sm font-functionPro">
                &copy; {new Date().getFullYear()} Hecate Wizard Mall. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
