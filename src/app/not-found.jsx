import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r  text-black px-4">
            <h1 className="text-9xl font-extrabold animate-pulse">404</h1>
            <p className="text-2xl md:text-3xl mt-4 font-semibold">
                Oops! Page Not Found
            </p>
            <p className="mt-2 text-center text-sm md:text-base max-w-md">
                The page you are looking for might have been removed or is temporarily unavailable.
            </p>
            {/* <Link
                href="/"
                className="mt-6 inline-block bg-white text-purple-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300"
            >
                Go Back Home
            </Link> */}
            <div className="mt-10">
                <img
                    src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                    alt="Not Found Illustration"
                    className="w-80 md:w-96"
                />
            </div>
        </div>
    );
}
