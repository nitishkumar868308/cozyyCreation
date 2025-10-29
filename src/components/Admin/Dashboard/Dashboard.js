"use client";
import React from "react";
import DefaultPageAdmin from "../Include/DefaultPageAdmin/DefaultPageAdmin";
import Section1 from "./Section1/Section1";
import Section2 from "./Section2/Section2";

const Dashboard = () => {
    return (
        <DefaultPageAdmin>
            <Section1 />
            <Section2 />
        </DefaultPageAdmin>
    );
};

export default Dashboard;
