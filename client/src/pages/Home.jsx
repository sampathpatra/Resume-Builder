import React from "react";
import Banner from "../components/Home/Banner";
import HomeNavbar from "../components/Home/HomeNavbar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import About from "../components/Home/About";
import Footer from "../components/Home/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] text-slate-900 selection:bg-violet-600/15 selection:text-violet-900 flex flex-col relative antialiased">
            <Banner />
            <HomeNavbar />
            <main className="flex-grow">
                <Hero />
                <Features />
                <About />
            </main>
            <Footer />
        </div>
    );
}