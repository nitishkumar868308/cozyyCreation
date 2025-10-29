"use client";
import React from "react";
import DefaultPageAdmin from "@/components/Include/DefaultPageAdmin/DefaultPageAdmin";

export default function AdminLayout({ children }) {
    return <DefaultPageAdmin>{children}</DefaultPageAdmin>;
}
