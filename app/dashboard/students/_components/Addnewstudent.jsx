

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import "@/app/dashboard/add-subject/styles/student.css";

function Addnewstudent({ collectionName }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
   const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const storedDept = localStorage.getItem("selectedDept");
    const storedYear = localStorage.getItem("selectedYear");

    if (storedDept && storedYear) {
      setDept(storedDept);
      setYear(parseInt(storedYear));
    }

    
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    const finalData = {
      ...data,
      dept,
      year,
    };

      console.log("collection:"+collectionName);

    try {

    
      const response = await fetch(
        `${apiUrl}/dashboard/students/${collectionName}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
          
        }
        
      );
     

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        reset();
        setOpen(false);
        toast("NEW STUDENT ADDED !");
      } else {
        alert("Error: " + result.message);
        
      }
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to connect to the server ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>+ Add New Student</Button>
      <Dialog open={open} onOpenChange={setOpen} style={{top:300}}>
        <DialogContent style={{ top: 300 }}>
          <DialogHeader>
            <DialogTitle>+ Add New Student</DialogTitle>
            <DialogDescription >
              <form onSubmit={handleSubmit(onSubmit)} >
                <div className="custom-box" >
                  <div className="flex flex-col">
                    <label className="font-semibold">Full Name</label>
                    <Input
                      placeholder="Ex. Ravikumar"
                      className="border p-2 rounded-lg"
                      {...register("name", {
                        required: "Full Name is required",
                      })}
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Phone Number</label>
                    <Input
                      placeholder="Ex. 9876543210"
                      className="border p-2 rounded-lg"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                    />
                    {errors.phoneNumber && (
                      <span className="text-red-500">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">Email</label>
                    <Input
                      type="email"
                      placeholder="Ex. student@example.com"
                      className="border p-2 rounded-lg"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold">RegNo</label>
                    <Input
                      placeholder="Ex.950022104017"
                      className="border p-2 rounded-lg"
                      {...register("RegNo", { required: "RegNo is required" })}
                    />
                    {errors.RegNo && (
                      <span className="text-red-500">
                        {errors.RegNo.message}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="px-4 py-2 text-white rounded-lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <LoaderIcon className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Addnewstudent;
