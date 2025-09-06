"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LayoutDashboard, GraduationCap, Hand } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

function SideNav() {
  const { user } = useKindeBrowserClient();
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
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutDashboard,
      path: `/dashboard/add-subject/${collectionName || ""}/dash`,
    },
  

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
    <div className="border shadow-md h-screen p-5">
      <Image src={"/logo.svg"} width={100} height={50} alt="logo" priority />
      <hr className="my-5" />

      <nav>
        <ul>
          {menuList.map((menu) => {
            const isActive =
              menu.name === "Students"
                ? path === `/dashboard/add-subject/${collectionName}`
                : path === menu.path;

            return (
              <Link href={menu.path} key={menu.id}>
                <li
                  className={`flex items-center gap-3 text-md p-4 text-slate-500 hover:bg-primary hover:text-white cursor-pointer my-2 rounded-lg ${
                    isActive ? "bg-primary text-white" : ""
                  }`}
                >
                  <menu.icon />
                  {menu.name}
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <div className="flex gap-2 items-center bottom-5 fixed pd-2">
        {user?.picture ? (
          <Image
            src={user.picture}
            width={35}
            height={35}
            alt="profile"
            className="rounded-full"
          />
        ) : (
          <div className="w-[35px] h-[35px] bg-gray-300 rounded-full" />
        )}

        <div>
          <h2 className="text-sm font-bold">
            {user?.["given_name"]} {user?.["family_name"]}
          </h2>
          <h2 className="text-xs text-slate-400">{user?.email}</h2>
        </div>
      </div>
    </div>
  );
}

export default SideNav;



