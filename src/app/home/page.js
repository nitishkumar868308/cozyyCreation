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
            <ProductSlider />
            <TestMonial />
        </>
    );
}
