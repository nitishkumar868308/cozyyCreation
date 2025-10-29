import React from 'react'
import Dashboard from '@/components/Admin/Dashboard/Dashboard'
import PrivateRoute from "@/components/PrivateRoute";

const page = () => {
    return (
        <>
            <PrivateRoute roles={["ADMIN"]}>
                <Dashboard />
            </PrivateRoute>
        </>
    )
}

export default page