"use client";

import { useState } from "react";
import { useCurrentUser, useUpdateUserSemestersAndLevels } from "@/api/Queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Student } from "@/types";
import { User, Mail, Phone, Calendar, Save, GraduationCap } from "lucide-react";

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const student = user as Student;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: student?.phoneNumber || "",
    address: student?.address || "",
  });
  const [academicData, setAcademicData] = useState({
    level: undefined as number | undefined,
    semester: undefined as "first" | "second" | undefined,
  });
  const {
    updateAcademicDetails,
    isPending: isUpdatingAcademicDetails,
    isError: academicUpdateFailed,
    isSuccess: academicUpdateSucceeded,
  } = useUpdateUserSemestersAndLevels();

  if (!student || student.role !== "student") {
    return null;
  }

  const handleSave = () => {
    // updateProfile(formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleAcademicSave = () => {
    updateAcademicDetails({
      level: academicData.level ?? student.level,
      semester: academicData.semester ?? student.semester ?? "first",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-800 mt-1">
            View and manage your personal information
          </p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User className="h-16 w-16" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-black">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-800">
              {student.matriculationNumber}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your basic information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-800">
                  First Name
                </label>
                <Input
                  className="text-black"
                  value={student.firstName}
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">
                  Last Name
                </label>
                <Input
                  className="text-black"
                  value={student.lastName}
                  disabled
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-800">
                  Email Address
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-800" />
                  <Input
                    className="text-black"
                    value={student.email}
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-800" />
                  <Input
                    className="text-black"
                    value={formData.phoneNumber || "Not set"}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-800">
                  Date of Birth
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-700" />
                  <Input
                    className="text-black"
                    value={student.dateOfBirth || "Not set"}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">
                  Gender
                </label>
                <Input
                  className="text-black"
                  value={student.gender || "Not set"}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic Information
          </CardTitle>
          <CardDescription>
            Update your current academic level and semester. Faculty and
            department are managed by your institution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="academic-level"
                className="text-sm font-medium text-gray-800"
              >
                Level
              </label>
              <select
                id="academic-level"
                className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={academicData.level ?? student.level}
                onChange={(event) =>
                  setAcademicData({
                    ...academicData,
                    level: Number(event.target.value),
                  })
                }
                disabled={isUpdatingAcademicDetails}
              >
                {[100, 200, 300, 400, 500, 600].map((level) => (
                  <option key={level} value={level}>
                    {level} Level
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="academic-semester"
                className="text-sm font-medium text-gray-800"
              >
                Semester
              </label>
              <select
                id="academic-semester"
                className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={academicData.semester ?? student.semester ?? "first"}
                onChange={(event) =>
                  setAcademicData({
                    ...academicData,
                    semester: event.target.value as "first" | "second",
                  })
                }
                disabled={isUpdatingAcademicDetails}
              >
                <option value="first">First Semester</option>
                <option value="second">Second Semester</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="academic-faculty"
                className="text-sm font-medium text-gray-800"
              >
                Faculty
              </label>
              <Input
                id="academic-faculty"
                className="mt-1 text-black"
                value={student.faculty?.name || "Not assigned"}
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="academic-department"
                className="text-sm font-medium text-gray-800"
              >
                Department
              </label>
              <Input
                id="academic-department"
                className="mt-1 text-black"
                value={student.department?.name || "Not assigned"}
                disabled
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div aria-live="polite">
              {academicUpdateSucceeded && (
                <p className="text-sm text-green-600">
                  Academic details updated successfully.
                </p>
              )}
              {academicUpdateFailed && (
                <p className="text-sm text-red-600">
                  Unable to update academic details. Please try again.
                </p>
              )}
            </div>
            <Button
              onClick={handleAcademicSave}
              disabled={isUpdatingAcademicDetails}
            >
              {isUpdatingAcademicDetails
                ? "Saving..."
                : "Save Academic Details"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Login History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
