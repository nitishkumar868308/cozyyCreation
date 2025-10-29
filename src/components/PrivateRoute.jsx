"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchMe } from "@/app/redux/slices/meProfile/meSlice";

const PrivateRoute = ({ children, roles = [] }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.me);
  const [accessDenied, setAccessDenied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // client-side mounted
    dispatch(fetchMe()); // populate Redux store
  }, [dispatch]);

  useEffect(() => {
    if (!mounted) return;
    if (!loading) {
      if (!user) {
        router.push("/"); // redirect if not logged in
      } else if (roles.length && !roles.includes(user.role)) {
        setAccessDenied(true); // role mismatch
      }
    }
  }, [mounted, loading, user?.role, roles.join(","), router]);

  if (!mounted || loading)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return null;
  if (accessDenied)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl font-bold">
        Access Denied! You do not have permission to view this page.
      </div>
    );

  return children;
};

export default PrivateRoute;
