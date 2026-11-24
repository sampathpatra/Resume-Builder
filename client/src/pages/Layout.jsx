import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Login from "./Login";

export default function Layout() {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-[#FAFAF9] text-slate-900 selection:bg-violet-600/15 selection:text-violet-900 flex flex-col relative antialiased">
            {user ? (
                <>
                    <Navbar />
                    <main className="flex-1 relative">
                        <Outlet />
                    </main>
                </>
            ) : (
                <Login />
            )}
        </div>
    );
}