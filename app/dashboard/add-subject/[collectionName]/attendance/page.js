"use client";

import React, { useEffect, useState } from "react";
import MonthSelection from "@/app/_components/MonthSelection";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useParams } from "next/navigation";
import { toast } from "sonner";
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

function Attendance() {
  const params = useParams();
  const { collectionName } = params;
  let subjectId = collectionName;

  if (subjectId.startsWith("student")) {
    subjectId = subjectId.replace("student", "");
  } else if (subjectId.startsWith("attendance")) {
    subjectId = subjectId.replace("attendance", "");
  }

  const [SelectedMonth, SetSelectedMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [updatedAttendance, setUpdatedAttendance] = useState({});
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const sDate = localStorage.getItem("startdate");
    const eDate = localStorage.getItem("enddate");
    let selDays = [];
    try {
      const val = localStorage.getItem("selected");
      if (val && val !== "undefined") {
        selDays = JSON.parse(val);
      }
    } catch (err) {
      console.error("Invalid JSON in localStorage for 'selected'", err);
    }

    setStartDate(sDate ? moment(sDate).startOf("day").toDate() : null);
    setEndDate(eDate ? moment(eDate).startOf("day").toDate() : null);
    setSelectedDays(selDays);

    onSearchHandler();
  }, []);

  const onSearchHandler = async () => {
    const selectedMonth = moment(SelectedMonth).format("MM");
    const selectedYear = moment(SelectedMonth).format("YYYY");

    setMonth(selectedMonth);
    setYear(selectedYear);

    const totalDays = getDaysInMonth(selectedMonth, selectedYear);
    setDaysInMonth(totalDays);

    try {
      const res = await fetch(
        `${apiUrl}/api/attendance/view/${subjectId}?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid data from backend:", data);
        toast.error("Failed to fetch attendance.");
        return;
      }

      const sortedData = data.sort((a, b) => a.RegNo.localeCompare(b.RegNo));

      // ✅ Build attendance state per student, per day
      let initialAttendance = {};
      sortedData.forEach((student) => {
        initialAttendance[student._id] = {};

        for (let day = 1; day <= totalDays; day++) {
          const dateObj = moment(
            `${selectedYear}-${selectedMonth}-${day}`,
            "YYYY-MM-DD"
          ).toDate();

          if (!isDateAllowed(dateObj)) continue;

          // find DB record for this day
          const record = student.attendanceRecords.find(
            (r) =>
              r.day === day &&
              r.month === parseInt(selectedMonth) &&
              r.year === parseInt(selectedYear)
          );

          // ✅ if DB record exists → use it, else default absent (false)
          initialAttendance[student._id][day] =
            record !== undefined ? record.present : false;
        }
      });

      setUpdatedAttendance(initialAttendance);
      setAttendanceData(sortedData);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      toast.error("Error fetching attendance!");
    }
  };

  const isDateAllowed = (date) => {
    const today = moment().startOf("day");
    const dayName = moment(date).format("dddd");

    if (startDate && moment(date).isBefore(startDate, "day")) return false;
    if (endDate && moment(date).isAfter(endDate, "day")) return false;
    if (moment(date).isAfter(today, "day")) return false;
    if (selectedDays.length > 0 && !selectedDays.includes(dayName))
      return false;

    return true;
  };

  const handleUpdateAttendance = async () => {
    try {
      const collectionName = `attendance${subjectId}`;

      const payload = {};
      for (const studentId in updatedAttendance) {
        payload[studentId] = {};
        for (const day in updatedAttendance[studentId]) {
          const dateObj = moment(
            `${year}-${month}-${day}`,
            "YYYY-MM-DD"
          ).toDate();
          if (isDateAllowed(dateObj)) {
            payload[studentId][day] = updatedAttendance[studentId][day];
          }
        }
      }

      const res = await fetch(
        `${apiUrl}/api/attendance/update/${collectionName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updatedAttendance: payload, month, year }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("UPDATE SUCCESSFULLY!");
        onSearchHandler(); // ✅ refresh after update
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance!");
    }
  };

  return (
    <div className="p-7">
      <h2 className="text-2xl font-bold">Attendance</h2>

      <div className="flex gap-5 my-5 p-3 border rounded-lg shadow-sm">
        <div className="flex gap-2 items-center">
          <label>Select Month:</label>
          <MonthSelection onChange={SetSelectedMonth} />
        </div>
        <Button onClick={onSearchHandler}>Search</Button>
      </div>

      {attendanceData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">RegisterNumber</th>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  return (
                    <th key={day} className="py-2 px-2 border text-center">
                      {day}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student) => (
                <tr key={student._id}>
                  <td className="py-2 px-4 border">{student.name}</td>
                  <td className="py-2 px-4 border">{student.RegNo}</td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const dayNumber = i + 1;
                    const dateObj = moment(
                      `${year}-${month}-${dayNumber}`,
                      "YYYY-MM-DD"
                    ).toDate();
                    const isAllowed = isDateAllowed(dateObj);

                    const isChecked =
                      updatedAttendance[student._id]?.[dayNumber] ?? false;

                    return (
                      <td
                        key={dayNumber}
                        className="py-2 px-2 border text-center"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={!isAllowed} // ⬅️ THIS prevents editing past/future dates
                          onChange={(e) => {
                            setUpdatedAttendance((prev) => ({
                              ...prev,
                              [student._id]: {
                                ...prev[student._id],
                                [dayNumber]: e.target.checked, // ⬅️ THIS updates attendance state
                              },
                            }));
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5">
            <Button onClick={() => setIsDialogOpen(true)}>
              Update Attendance
            </Button>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will save attendance changes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUpdateAttendance}>
                    Confirm & Update
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
