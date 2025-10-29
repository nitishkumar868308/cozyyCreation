import React from "react";

const RefundPolicyPage = () => {
    return (
        <div className="bg-white font-functionPro text-black px-6 md:px-16 lg:px-32 py-12 leading-relaxed">
            {/* Page Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                Refund Policy
            </h1>

            <div className="flex flex-col gap-12">
                {/* Introduction */}
                <section>
                    <p className="text-lg">
                        At <strong>Hecate Wizard Mall</strong>, we aim to provide the best shopping experience to our customers. Please carefully review our refund policy:
                    </p>
                </section>

                {/* Order Placement */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">1. Order Placement</h2>
                    <p className="text-lg">
                        Once an order is placed, it cannot be refunded, exchanged, or adjusted. We strongly encourage you to review your order before confirming your purchase.
                    </p>
                </section>

                {/* Refund Requests */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">2. Refund Requests</h2>
                    <p className="text-lg">
                        In case of any issues with your order, you will need to contact our customer care team for assistance. Refunds will only be initiated upon approval by our team.
                    </p>
                </section>

                {/* Refund Process */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">3. Refund Process</h2>
                    <p className="text-lg">
                        Once a refund is initiated, it will take 4-5 business days to settle back to the source account from which the payment was made. Please note that the refund timeline may vary depending on your bank or payment provider.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
                    <p className="text-lg">
                        If you have any questions or concerns, please feel free to reach out to our customer care team at{" "}
                        <a href="mailto:info@hecatewizardmall.com" className="underline hover:text-gray-700">
                            info@hecatewizardmall.com
                        </a>{" "}
                        or call us at +91 97170 33830.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
