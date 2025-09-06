"use client";

import React from 'react';

function DeptSelect({ onChange }) {
  return (
    <select onChange={(e) => onChange(e.target.value)} className="border p-2 rounded">
      <option value="">Select Department</option>
      <option value="CSE">CSE</option>
      <option value="ECE">ECE</option>
      
      <option value="MECH">MECH</option>
      <option value="CIVIL">GEO INFORMATICS</option>
    </select>
  );
}

export default DeptSelect;
