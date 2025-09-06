"use client";

import React, { createContext, useContext, useState } from "react";

// Create the context
const AttendanceContext = createContext();

// Provider component
export const AttendanceProvider = ({ children }) => {
  const [updatedAttendance, setUpdatedAttendance] = useState({});
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  return (
    <AttendanceContext.Provider
      value={{
        updatedAttendance,
        setUpdatedAttendance,
        month,
        setMonth,
        year,
        setYear,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

// Custom hook to access context values easily
export const useAttendanceContext = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
      throw new Error("useAttendanceContext must be used within an AttendanceProvider");
    }
    return context;
  };
  


