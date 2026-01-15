"use client";
import { useState } from "react";

import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
    </div>
  );
}
