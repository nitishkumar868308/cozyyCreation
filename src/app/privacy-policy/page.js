import React from "react";

const PrivacyPolicyPage = () => {
    return (
        <div className="bg-white min-h-screen font-functionPro text-black px-6 md:px-16 lg:px-32 py-12">
            {/* Page Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                Privacy Policy
            </h1>

            {/* Container for all sections */}
            <div className="flex flex-col gap-8">

                {/* Section Template */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-3">Who We Are :</h2>
                    <p>
                        Our website address is:
                        <a
                            href="https://cozyycreations.com/"
                            className="underline hover:text-gray-700"
                        >
                            https://cozyycreations.com/
                        </a>.
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-3">Comments :</h2>
                    <p>
                        When visitors leave comments on the site, we collect the data shown
                        in the comments form, along with the visitor’s IP address and
                        browser user agent string to help spam detection.
                    </p>
                    <p className="mt-2">
                        An anonymized string (hash) may be provided to the Gravatar service
                        to see if you are using it. The Gravatar service privacy policy is
                        available{" "}
                        <a
                            href="https://hecatewizardmall.com/privacy/"
                            className="underline hover:text-gray-700"
                        >
                            here
                        </a>
                        . After approval of your comment, your profile picture is visible
                        in the context of your comment.
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-3">Media :</h2>
                    <p>
                        If you upload images to the website, avoid including embedded
                        location data (EXIF GPS). Visitors can download and extract any
                        location data from images.
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm ">
                    <h2 className="text-2xl font-semibold mb-3">Cookies :</h2>
                    <p>
                        If you leave a comment, you may opt-in to saving your name, email
                        address, and website in cookies for convenience. These cookies last
                        one year.
                    </p>
                    <p className="mt-2">
                        Login cookies store your login information and screen preferences.
                        Temporary cookies check if your browser accepts cookies. Cookies
                        expire based on your selections (2 days, 2 weeks, or 1 year).
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-3">
                        Embedded Content from Other Websites :
                    </h2>
                    <p>
                        Articles may include embedded content (videos, images, articles).
                        Embedded content behaves as if the visitor visited the other website
                        directly. These websites may collect data, use cookies, and monitor
                        interactions.
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-3">Information We Collect :</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Personal info: name, email, shipping address, payment details.
                        </li>
                        <li>
                            Usage: processing orders, managing accounts, personalizing shopping
                            experience.
                        </li>
                        <li>
                            Security: secure servers and encryption methods are used, but
                            internet transmission is not 100% secure.
                        </li>
                        <li>
                            Cookies: improve user experience and personalization.
                        </li>
                        <li>
                            Changes: Cozyy Creations Mall may update this policy anytime.
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-3">Contact Us:</h2>
                    <p>Address: New Delhi</p>
                    <p>Phone: +91 9355135307</p>
                    <p>
                        Email:{" "}
                        <a
                            href="mailto:kakullieajain@gmail.com"
                            className="underline hover:text-gray-700"
                        >
                            kakullieajain@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
