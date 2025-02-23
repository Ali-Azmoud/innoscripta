import React from "react";
import {Routes, Route} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Search from "../pages/Search";
import Preferences from "../pages/Preferences";
import Feeds from "../pages/Feeds";
import Index from "../pages/Index";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/feeds" element={<Feeds />} />
        </Routes>
    );
};

export default AppRoutes;
