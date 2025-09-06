// app/subjects/[collectionName]/page.js
"use client";

import { useEffect, useState } from "react";
import Addnewstudent from "@/app/dashboard/students/components/Addnewstudent";
import StudentListTable from "@/app/dashboard/students/components/studentListtable";
import { useParams } from "next/navigation";
import DashboardRedirect  from "@/app/dashboard/page.js";
export default function StudentsBySubject() {
  const [studentList, setStudentList] = useState([]);
  const params = useParams();
  const collectionName = params.collectionName;
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  

  useEffect(() => {
  if (!collectionName) return;



  fetch(`${apiUrl}/dashboard/students/${collectionName}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch students");
      return res.json();
    })
    .then((data) => {
      setStudentList(data.students || []);
      console.log("Fetched students:", data.students);
    })
    .catch((err) => {
      console.error("Error fetching students:", err);
    });
}, [collectionName]);


  return (
    <div className="p-7">
      <div className="flex justify-between items-center mb-5">
        
        <Addnewstudent collectionName={collectionName} />
      </div>
      <div>
      <DashboardRedirect collectionName={collectionName} />
      </div>

      <StudentListTable students={studentList} />

    </div>
    
  );
}

