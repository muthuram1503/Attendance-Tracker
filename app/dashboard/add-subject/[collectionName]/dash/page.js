

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import moment from "moment";
import "@/app/dashboard/add-subject/styles/table.css";
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

/** tiny helper to join classes */
const cx = (...a) => a.filter(Boolean).join(" ");

function Dashboard() {
  const { setTheme } = useTheme();
  const params = useParams();
  const { collectionName } = params;

  // derive subjectId like your other page
  let subjectId = collectionName;
  if (subjectId?.startsWith("student")) subjectId = subjectId.replace("student", "");
  else if (subjectId?.startsWith("attendance")) subjectId = subjectId.replace("attendance", "");

  const [attendanceData, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    presentPercentage: 0,
    absentPercentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [daysInMonth, setDaysInMonth] = useState(0);

  // local settings (from your Attendance page spec)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  // util: days in month
  const getDaysInMonth = (mm, yyyy) => new Date(yyyy, Number(mm), 0).getDate();

  useEffect(() => {
    setTheme("light");

    // read local system (localStorage) settings
    const sDate = localStorage.getItem("startdate");
    const eDate = localStorage.getItem("enddate");
    let selDays = [];
    try {
      const val = localStorage.getItem("selected");
      if (val && val !== "undefined") selDays = JSON.parse(val);
    } catch {
      console.error("Invalid JSON in localStorage for 'selected'");
    }

    setStartDate(sDate ? moment(sDate).startOf("day").toDate() : null);
    setEndDate(eDate ? moment(eDate).startOf("day").toDate() : null);
    setSelectedDays(selDays);

    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDateAllowed = (date) => {
    const today = moment().startOf("day");
    const dayName = moment(date).format("dddd");

    if (startDate && moment(date).isBefore(startDate, "day")) return false;
    if (endDate && moment(date).isAfter(endDate, "day")) return false;
    if (moment(date).isAfter(today, "day")) return false;
    if (selectedDays.length > 0 && !selectedDays.includes(dayName)) return false;

    return true;
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");

    const now = new Date();
    const selectedMonth = moment(now).format("MM");
    const selectedYear = moment(now).format("YYYY");

    setMonth(selectedMonth);
    setYear(selectedYear);

    const totalDays = getDaysInMonth(selectedMonth, selectedYear);
    setDaysInMonth(totalDays);

    try {
      const res = await fetch(
        `${apiUrl}/api/attendance/view/${subjectId}?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await res.json();
      console.log(data);

      if (!Array.isArray(data)) {
        setError("Invalid data format received from server.");
        return;
      }

      const sortedData = data.sort((a, b) => (a.RegNo || "").localeCompare(b.RegNo || ""));

      // --- Per-student calculation (Anna University) ---
      let totalConducted = 0;
      let totalAttended = 0;

      const withPercentages = sortedData.map((student) => {
        let conducted = 0;
        let attended = 0;

        (student.attendanceRecords || []).forEach((record) => {
          const dateObj =
            record.date
              ? new Date(record.date)
              : new Date(
                  Number(record.year || selectedYear),
                  Number(record.month || selectedMonth) - 1,
                  Number(record.day || 1)
                );

          if (isDateAllowed(dateObj)) {
            conducted += 1;
            if (record.present) attended += 1;
          }
        });

        totalConducted += conducted;
        totalAttended += attended;

        const pct = conducted > 0 ? (attended / conducted) * 100 : 0;
        return {
          ...student,
          conducted,
          attended,
          percentage: Number(pct.toFixed(2)),
        };
      });

      const presentPercentage =
        totalConducted > 0 ? Number(((totalAttended / totalConducted) * 100).toFixed(2)) : 0;
      const absentPercentage = Number((100 - presentPercentage).toFixed(2));

      setAttendance(withPercentages);
      setStats({
        total: sortedData.length,
        present: totalAttended,
        absent: totalConducted - totalAttended,
        presentPercentage,
        absentPercentage,
      });
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const hasData = attendanceData.length > 0;

  const lastUpdated = useMemo(() => moment().format("DD MMM YYYY, hh:mm A"), []);

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAttendance}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 shadow transition"
          >
            Refresh
          </button>
          <span className="hidden sm:block text-xs text-gray-500">
            Last updated: {lastUpdated}
          </span>
        </div>
      </div>

      {/* Load & error */}
      {loading && (
        <div className="animate-pulse bg-white rounded-xl shadow p-6">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      )}
      {error && !loading && (
<div
  className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-6 student overflow-y-auto"
  style={{  borderBottomWidth: "300px" }}
>
          {error}
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div
  className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-6 student overflow-y-auto"
  style={{  borderBottomWidth: "300px" }}
>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="text-sm text-blue-700">Total Students</div>
              <div className="mt-1 text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-green-50 border border-green-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-green-700">Attendance %</div>
                <div className="text-xs text-green-700">Anna Univ. formula</div>
              </div>
              <div className="mt-1 text-2xl font-bold text-green-900">
                {stats.presentPercentage}%
              </div>
              <div className="mt-3 h-2 w-full bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${stats.presentPercentage}%` }}
                  aria-hidden
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-100">
              <div className="text-sm text-red-700">Absent %</div>
              <div className="mt-1 text-2xl font-bold text-red-900">
                {stats.absentPercentage}%
              </div>
            </div>
          </div>

          {/* Student-wise section */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Student-wise Attendance
            </h3>

           

            {/* Desktop/Table (>= md) */}
            <div className="hidden md:block rounded-xl border border-gray-200 max-h-[600px] overflow-y-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="text-left">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Register Number
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
                      Classes Conducted
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
                      Classes Attended
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hasData ? (
                    attendanceData.map((s, idx) => (
                      <tr
                        key={s._id}
                        className={cx(
                          idx % 2 ? "bg-white" : "bg-gray-50",
                          "hover:bg-gray-100/60"
                        )}
                      >
                        <td className="py-3 px-4">{s.name}</td>
                        <td className="py-3 px-4">{s.RegNo}</td>
                        <td className="py-3 px-4 text-center">{s.conducted}</td>
                        <td className="py-3 px-4 text-center">{s.attended}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={cx(
                                  "h-full",
                                  s.percentage < 75 ? "bg-red-500" : "bg-green-500"
                                )}
                                style={{ width: `${s.percentage}%` }}
                              />
                            </div>
                            <span
                              className={cx(
                                "text-sm font-bold",
                                s.percentage < 75 ? "text-red-600" : "text-green-600"
                              )}
                            >
                              {s.percentage.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500">
                        No student data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile cards (<= md) */}
<div className="mobile-cards">
  {hasData ? (
    attendanceData.map((s) => (
      <div key={s._id} className="student-card">
        <div className="student-header">
          <div>
            <div className="student-name">{s.name}</div>
            <div className="student-reg">Reg No: {s.RegNo}</div>
          </div>
          <div className={`student-percentage ${s.percentage < 75 ? "low" : "high"}`}>
            {s.percentage.toFixed(2)}%
          </div>
        </div>
        <div className="student-body">
          <div className="student-stats">
            <span>Conducted: {s.conducted}</span>
            <span>Attended: {s.attended}</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${s.percentage < 75 ? "low" : "high"}`}
              style={{ width: `${s.percentage}%` }}
            />
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="no-data">No student data found</div>
  )}
</div>


            <p className="mt-3 text-xs text-gray-500">
              * Attendance % = (Attended / Conducted) × 100. Dates are constrained by your local
              settings (start date, end date, selected weekdays, no future days).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
