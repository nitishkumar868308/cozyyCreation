"use client";
import React, { useState } from "react";

const faqData = [
    {
        q: "Who are we?",
        a: (
            <>
                Hecate Wizard Mall specializes in ritual candles, herbs, oils, and witchcraft supplies. We are dedicated to providing high-quality products that enhance your spiritual journey. For more information about us, please visit our website:{" "}
                <a href="https://hecatewizardmall.com" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">
                    hecatewizardmall.com
                </a>.
            </>
        ),
    },
    {
        q: "When Will My Order Ship?",
        a: (
            <>
                When you place an order, it will be immediately confirmed via email. If you do not receive a confirmation email, please check your “Spam/Junk” folders. If you still do not see it, contact us at{" "}
                <a href="mailto:info@hecatewizardmall.com" className="underline hover:text-gray-700">
                    info@hecatewizardmall.com
                </a>{" "}
                or via WhatsApp chat. Typical shipping time for in-stock items is within 24 hours.
            </>
        ),
    },
    {
        q: "How do I make a purchase?",
        a: "You can buy through our website hecatewizardmall.com or place an order on WhatsApp at +91 97170 33830.",
    },
    {
        q: "Are you available in America?",
        a: (
            <>
                Yes, we are available globally. You can order from anywhere through our website. Stay updated by visiting{" "}
                <a href="https://hecatewizardmall.com" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">
                    our website
                </a>{" "}
                or check our products on our Amazon store.
            </>
        ),
    },
    {
        q: "Is my order secure?",
        a: "We are committed to the complete privacy and security of your personal information.",
    },
    { q: "What is your privacy policy?", a: <a href="/privacy-policy" className="underline hover:text-gray-700">View Privacy Policy</a> },
    { q: "How do I contact you?", a: "Visit our website or contact us via email/WhatsApp." },
    {
        q: "What information do you collect from visitors?",
        a: "We collect basic information like name, phone number, and email for order processing and delivery. Your information is secure and private.",
    },
    {
        q: "What types of products does Hecate Wizard Mall offer?",
        a: (
            <ul className="list-disc pl-6 space-y-1">
                <li>Ritual Candles: Infused with herbs and oils, for specific intentions.</li>
                <li>Ritual Herbs: Premium-quality herbs and pooja samagri for sacred practices.</li>
                <li>Ritual Oils: Handcrafted oils for spells, meditation, and rituals.</li>
                <li>Altar Clothes: Beautifully designed clothes to enhance your sacred spaces.</li>
                <li>Bath Salts: Luxurious blends for spiritual cleansing and relaxation.</li>
                <li>Salt Lamps: Natural salt lamps to purify and uplift your environment.</li>
            </ul>
        ),
    },
    {
        q: "Can I track my order after it has been shipped?",
        a: "Yes, you can track your order through our website’s tracking page using your order details.",
    },
    {
        q: "Do you provide guidance or instructions for using the products?",
        a: "Yes! Connect with us via WhatsApp chat for personalized guidance and instructions.",
    },
    {
        q: "How can I contact your customer support team for questions or assistance?",
        a: "Reach out via WhatsApp chat on our website anytime for assistance.",
    },
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white min-h-screen font-functionPro text-black px-6 md:px-16 lg:px-32 py-12 leading-relaxed">
            {/* Page Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h1>

            {/* FAQ Section */}
            <div className="flex flex-col gap-4">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className="border-b border-gray-200 py-3 cursor-pointer"
                        onClick={() => toggleFAQ(index)}
                    >
                        <h2 className="text-lg md:text-xl font-semibold flex justify-between items-center">
                            {item.q}
                            <span className="ml-4 text-gray-500">{openIndex === index ? "-" : "+"}</span>
                        </h2>
                        {openIndex === index && <div className="mt-2 text-base md:text-lg text-gray-800">{item.a}</div>}
                    </div>
                ))}
            </div>

            {/* About Us Section */}
            <div className="mt-16 flex flex-col gap-8">
                <section>
                    <h2 className="text-3xl font-semibold mb-4">About Us</h2>
                    <p className="text-lg">
                        Welcome to Hecate Wizard Mall, your one-stop destination for all things magical and mystical. We are passionate about bringing the ancient wisdom and timeless traditions of witchcraft, spirituality, and the occult into the modern world. Our mission is to provide high-quality products that support and enhance your magical practices.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
                    <p className="text-lg">
                        At Hecate Wizard Mall, we believe in the power of magic and the importance of spirituality in everyday life. Our vision is to create a space where practitioners of all levels can find the tools and resources they need to explore, grow, and manifest their intentions.
                    </p>
                </section>

                <section>
                    <h2 className="text-3xl font-semibold mb-4">Our Commitment</h2>
                    <p className="text-lg">
                        We are committed to providing exceptional customer service and ensuring that each of our customers finds exactly what they need. We understand the importance of each magical tool and take great care in sourcing and preparing our products to align with their intended purposes.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default FAQPage;
