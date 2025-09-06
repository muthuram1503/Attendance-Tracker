"use client";

import React, { useEffect, useState } from "react";
import { LayoutDashboard, GraduationCap, Hand } from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";

function MobileNav() {
  const path = usePathname();
  const params = useParams();

  const [collectionName, setCollectionName] = useState("");

  useEffect(() => {
    if (params?.collectionName) {
      setCollectionName(params.collectionName);
      localStorage.setItem("selectedSubject", params.collectionName);
    } else {
      const stored = localStorage.getItem("selectedSubject");
      if (stored) setCollectionName(stored);
    }
  }, [params]);

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    {
      id: 2,
      name: "Students",
      icon: GraduationCap,
      path: `/dashboard/add-subject/${collectionName || ""}`,
    },
    {
      id: 3,
      name: "Attendance",
      icon: Hand,
      path: `/dashboard/add-subject/${collectionName || ""}/attendance`,
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md p-2 flex justify-around z-50 md:hidden max-[540px]:flex">
      {menuList.map((menu) => {
        const isActive =
          menu.name === "Students"
            ? path === `/dashboard/add-subject/${collectionName}`
            : path === menu.path;

        return (
          <Link href={menu.path} key={menu.id}>
            <div
              className={`flex flex-col items-center text-sm ${
                isActive ? "text-blue-600 font-bold" : "text-slate-500"
              }`}
            >
              <menu.icon size={20} />
              <span>{menu.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default MobileNav;
