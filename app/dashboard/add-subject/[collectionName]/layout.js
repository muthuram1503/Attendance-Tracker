

import React from "react";


import SideNav from "@/app/dashboard/_components/SideNav";
import Header from "@/app/dashboard/_components/Header";
import { AttendanceProvider } from "@/app/_context/AttendanceContext"; // ✅ import the context
 import MobileNav from "@/app/dashboard/_components/MobileNav";

function layout({ children }) {
  return (
    
        <AttendanceProvider>
      <div className="flex">
        {/* ✅ Desktop Sidebar (always fixed left) */}
        <div className="hidden md:block fixed left-0 top-0 h-screen w-[250px] border-r bg-white">
          <SideNav />
        </div>

        {/* ✅ Mobile Navbar (fixed top) */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-[56px] border-b bg-white z-50">
          <MobileNav />
        </div>

        {/* ✅ Main Content */}
        <div className="flex-1 w-full p-4 mt-[56px] md:mt-0 md:ml-[250px]">
          <Header />
          {children}
        </div>
      </div>
    </AttendanceProvider>
  );
}

export default layout;


