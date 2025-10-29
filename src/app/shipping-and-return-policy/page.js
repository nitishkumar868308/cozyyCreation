import React from "react";

const ShippingReturnPolicyPage = () => {
    return (
        <div className="bg-white font-functionPro text-black px-6 md:px-16 lg:px-32 py-12 leading-relaxed">
            {/* Page Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                Shipping & Return Policy
            </h1>

            <div className="flex flex-col gap-12">
                {/* Shipping */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">Shipping</h2>
                    <ul className="list-disc pl-6 space-y-2 text-lg">
                        <li>
                            Once your order is received, we aim to deliver the product within 5-6 business days. Delivery times may vary depending on the shipping address and availability of the product.
                        </li>
                        <li>
                            You will receive an email notification once your order has been dispatched, along with a tracking number to monitor your shipment.
                        </li>
                    </ul>
                </section>

                {/* Return Policy */}
                <section>
                    <h2 className="text-2xl font-semibold mb-2">Return Policy</h2>
                    <ul className="list-disc pl-6 space-y-2 text-lg">
                        <li>
                            If you are not completely satisfied with your purchase, you can initiate a return within 4-6 days from the date of purchase.
                        </li>
                        <li>
                            The product must be in its original condition, unopened, and unused, with all packaging intact to be eligible for a return.
                        </li>
                        <li>
                            Please contact our customer service at{" "}
                            <a href="mailto:hecatewizardmall@gmail.com" className="underline hover:text-gray-700">
                                hecatewizardmall@gmail.com
                            </a>{" "}
                            to start your return process.
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default ShippingReturnPolicyPage;
