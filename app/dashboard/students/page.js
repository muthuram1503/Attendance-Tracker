"use client";

import { useEffect, useState } from "react";
import Addnewstudent from "./components/Addnewstudent";
import StudentListTable from "./components/studentListtable"; 
// import StudentListPage from "./_components/StudentListPage";// Capitalized correctly


export default function Students() {
  const [studentList, setStudentList] = useState([]);
   const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(`${apiUrl}/students`) // Change if deployed online
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Students:", data);
        setStudentList(data.students); // ✅ Save the data to state
      })
      .catch((err) => console.error("Error fetching students:", err));
      console.log(studentList)
  }, []);

  return (
    <div className="p-7">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-2xl">Students</h2>
        <Addnewstudent />
      </div>

      {/* ✅ Pass the studentList as props */}
      < StudentListTable students={studentList} />
    </div>
  );
}

