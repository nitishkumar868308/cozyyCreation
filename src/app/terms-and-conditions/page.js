import React from "react";

const TermsPage = () => {
    return (
        <div className="bg-white  font-functionPro text-black px-6 md:px-16 lg:px-32 py-12 leading-relaxed">
            {/* Page Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                Terms and Conditions
            </h1>

            <div className="flex flex-col gap-12">

                {/* Introduction */}
                <section>
                    <p className="text-lg">
                        These terms and conditions outline the rules and regulations for the use of <strong>Cozyy Creation</strong>’s website, operated by Cozyy Creations (Company Name). By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Cozyy Creation’s website if you do not accept all the terms and conditions stated on this page.
                    </p>
                </section>

                {/* User Responsibility */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">User Responsibility</h2>
                    <p className="text-lg">
                        By using this website, you confirm that you are legally capable of entering into binding contracts.
                    </p>
                </section>

                {/* Intellectual Property Rights */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">Intellectual Property Rights</h2>
                    <p className="text-lg">
                        The content, images, and designs found on this website are owned by or licensed to Cozyy Creations. Unauthorized use or reproduction of any material from this site is prohibited.
                    </p>
                </section>

                {/* Product Information */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">Product Information</h2>
                    <p className="text-lg">
                        Cozyy Creations strives to ensure that all product descriptions, prices, and availability are accurate. However, we do not warrant that these details will always be up to date.
                    </p>
                </section>

                {/* Changes to Terms */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">Changes to Terms</h2>
                    <p className="text-lg">
                        We reserve the right to amend these terms and conditions at any time without prior notice. By continuing to use this website, you agree to be bound by the updated terms.
                    </p>
                </section>
                {/* Disclaimer */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">Disclaimer</h2>
                    <p className="text-lg">
                        Results may vary, and we do not guarantee any specific outcomes. The information provided on this website is for general guidance and informational purposes only.
                    </p>
                </section>
                {/* Operated By */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">Operated By</h2>
                    <p className="text-lg">Kakullie A Jain </p>
                </section>

            </div>
        </div>
    );
};

export default TermsPage;
