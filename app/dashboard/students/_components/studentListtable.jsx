"use client";
import React, { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Search, Trash2 } from "lucide-react";
import { useParams,useRouter } from "next/navigation";

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

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const StudentListTable = ({ students = [] }) => {
  const apiRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    const params = useParams();
  const collectionName = params.collectionName;
   const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log(collectionName);

const handleDelete = async () => {
  console.log("Selected Row Index:", selectedRowIndex);
  console.log("Row Data:", rowData);

  if (selectedRowIndex !== null) {
    const selectedStudent = rowData[selectedRowIndex];

    console.log("Selected Student:", selectedStudent);

    try {
      const response = await fetch(
        `${apiUrl}/dashboard/students/${collectionName}/${selectedStudent._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      console.log("student"+result);

      if (!response.ok) {
        throw new Error("Failed to delete student from database");
      }

      // ✅ Update frontend only if backend deletion is successful
      const updatedData = [...rowData];
      updatedData.splice(selectedRowIndex, 1);
      setRowData(updatedData);
      setSelectedRowIndex(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  }
};



  const handleTrashClick = (rowIndex) => { 
    setSelectedRowIndex(rowIndex);
    setIsDialogOpen(true);
  };

  const [colDefs] = useState([
    { field: "name", headerName: "Name", sortable: true, filter: true },
    { field: "dept", headerName: "Department", sortable: true, filter: true },
    { field: "year", headerName: "Year", sortable: true, filter: true },
    { field: "RegNo", headerName: "regNo", sortable: true, filter: true },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params) => {
        const rowIndex = params.node.rowIndex;
        return (
          <button
            onClick={() => handleTrashClick(rowIndex)}
            className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-red-600"
          >
            <Trash2 size={16} />
            Delete
          </button>
        );
      },
      width: 150,
    },
  ]);

  useEffect(() => {
    if (students && Array.isArray(students)) {
      setRowData(students);
    }
  }, [students]);

  useEffect(() => {
    if (apiRef.current && typeof apiRef.current.setQuickFilter === "function") {
      apiRef.current.setQuickFilter(searchInput);
    }
  }, [searchInput]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <>
      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <div className="p-2 mb-4 flex gap-2 max-w-sm border shadow-sm rounded">
          <Search />
          <input
            type="text"
            placeholder="Search..."
            className="outline-none w-full"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>

        <AgGridReact
          onGridReady={(params) => {
            apiRef.current = params.api;
            if (searchInput) {
              params.api.setQuickFilter(searchInput);
            }
          }}
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {/* Alert Dialog Component */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this student's data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StudentListTable;

