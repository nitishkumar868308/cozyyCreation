import React from 'react'

const Section1 = () => {
    return (
        <>
            <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">1,250</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-2">Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">$12,430</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-2">Active Products</h3>
                    <p className="text-3xl font-bold text-purple-600">34</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Products</h3>
                    <p className="text-3xl font-bold text-orange-600">120</p>
                </div>
            </section>
        </>
    )
}

export default Section1