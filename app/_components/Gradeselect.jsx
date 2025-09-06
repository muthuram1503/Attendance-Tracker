"use client";

import React from "react";

function Gradeselect({ onChange = () => {} }) {
  const handleGradeChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <select
        className="border p-2 rounded-lg"
        onChange={handleGradeChange}
      >
        <option value="">Select Year</option>
        <option value="1year">1st year</option>
        <option value="2year">2nd year</option>
        <option value="3year">3rd year</option>
        <option value="4year">4th year</option>
      </select>
    </div>
  );
}

export default Gradeselect;


