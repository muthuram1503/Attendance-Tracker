"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import "./styles/subject.css";
import Link from "next/link";
 import { useRouter } from "next/navigation";
 import "./styles/subjectgrid.css";


const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const departments = ["CSE", "ECE", "MECH", "GEO"];
const years = ["1st", "2nd", "3rd", "4th"];
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function AddNewSubject() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    staffName: "",
    subjectName: "",
    subjectCode: "",
    department: "",
    year: "",
    startDate: "",
    endDate: "",
    timetable: {},
  });
  const [subjects, setSubjects] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null); // holds subject data

  useEffect(() => {
    fetchSubjects();
  }, []);

 




  // const fetchSubjects = async () => {
  //   try {
  //     const res = await fetch(`${apiUrl}/api/subject`);
  //     console.log("hii");
  //     const data = await res.json();
  //     setSubjects(data);
  //     console.log(data);
  //   } catch (err) {
  //     console.error("Error fetching subjects:", err);
  //   }
  // };

  const fetchSubjects = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/subject"); // backend running on 5000
    const data = await res.json();
    setSubjects(data);
  } catch (err) {
    console.error("Error fetching subjects:", err);
  }
};


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTimetableChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        [day]: !prev.timetable[day],
      },
    }));
  };
  const normalizedTimetable = {};
  weekDays.forEach((day) => {
    normalizedTimetable[day] = !!formData.timetable[day]; // if undefined → false
  });

  const payload = {
    ...formData,
    timetable: normalizedTimetable,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

  localStorage.setItem("selectedDept", formData.department);
  localStorage.setItem("selectedYear", formData.year);
  localStorage.setItem("startdate", formData.startDate);
  localStorage.setItem("enddate", formData.endDate);
  // localStorage.setItem("selected", formData.selectdays);
  const selectedDays = Object.keys(formData.timetable || {}).filter(
  day => formData.timetable[day]
);
localStorage.setItem("selected", JSON.stringify(selectedDays));

// localStorage.setItem("selected", JSON.stringify(selectedDays));
  
    
    const normalizedTimetable = {};
    weekDays.forEach((day) => {
      normalizedTimetable[day] = !!formData.timetable[day];
    });

    const payload = {
      ...formData,
      timetable: normalizedTimetable,
    };

    const url = editMode
  ? `${apiUrl}/api/subject/${editSubjectId}`
  : `${apiUrl}/api/subject/add`; // ✅ make sure this is called

const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(editMode ? "Subject Updated ✅" : "New Subject Added ✅");
        setFormData({
          staffName: "",
          subjectName: "",
          subjectCode: "",
          department: "",
          year: "",
          startDate: "",
          endDate: "",
          timetable: {},
        });
        setOpen(false);
        setEditMode(false);
        setEditSubjectId(null);
        fetchSubjects(); // refresh
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!subjectToDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/subject/${subjectToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Subject deleted ✅");
        setSubjects(subjects.filter((s) => s._id !== subjectToDelete._id)); // remove from UI
        setSubjectToDelete(null);
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to delete subject");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };



return (
  <div className="p-6">
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-indigo-700">Subject Details</h1>
    </div>

    <div className="max-w-3xl mx-auto text-center mt-4 px-4">
      <p className="para">
        Add and manage subject-wise attendance details. You can also edit
        existing records. View and track all attendance by department and
        year. Easily select and mark attendance with clarity.
      </p>
    </div>

    <div className="flex justify-end mb-4">
      <Button onClick={() => setOpen(true)} className="button">
        + Add New Subject
      </Button>
    </div>

    {/* Delete confirmation dialog */}
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            subject from <strong>{subjectToDelete?.department}</strong>{" "}
            department for <strong>{subjectToDelete?.year}</strong> year
            students.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Add/Edit Subject dialog */}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="responsive-dialog-content">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="staffName"
                value={formData.staffName}
                onChange={handleChange}
                placeholder="Staff Name"
                required
              />
              <Input
                name="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                placeholder="Subject Name"
                required
              />
              <Input
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleChange}
                placeholder="Subject Code"
                required
              />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Year</option>
                {years.map((yr) => (
                  <option key={yr} value={parseInt(yr)}>
                    {yr}
                  </option>
                ))}
              </select>

              <div className="flex space-x-2">
                <label>Start:</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="flex-1 border p-2 rounded"
                />
                <label>End:</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="flex-1 border p-2 rounded"
                />
              </div>

              <div>
                <label className="font-semibold">Select Days</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {weekDays.map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                         name="selectdays"
                        checked={formData.timetable[day] || false}
                        onChange={() => handleTimetableChange(day)}
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditMode(false);
                    setEditSubjectId(null);
                    setFormData({
                      staffName: "",
                      subjectName: "",
                      subjectCode: "",
                      department: "",
                      year: "",
                      startDate: "",
                      endDate: "",
                      timetable: {},
                    });
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>

                <Button type="submit">
                  {loading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    "Make Attendance"
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

   
   



<div className="subjects-container">
  <div className="subjects-grid">
    {subjects.map((subject, index) => (
      <div key={index} className="subject-card">
        <Link href={`/dashboard/add-subject/student${subject._id}`}>
          <div>
            <h4 className="subject-title">
              📘 {subject.subjectName}
            </h4>
            <p className="subject-text">
              <strong>📄 Code:</strong> {subject.subjectCode}
            </p>
            <p className="subject-text">
              <strong>🏫 Department:</strong> {subject.department}
            </p>
            <p className="subject-text">
              <strong>🎓 Year:</strong> {subject.year}
            </p>
            <hr className="my-4" />
          </div>
        </Link>

        <div className="subject-actions">
          <button
            className="btn-edit"
            onClick={() => {
              setFormData(subject);
              setEditSubjectId(subject._id);
              setEditMode(true);
              setOpen(true);
            }}
          >
            Edit
          </button>

          <button
            className="btn-delete"
            onClick={() => {
              setSubjectToDelete(subject);
              setIsDialogOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


  </div>
);


}