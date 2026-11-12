"use client";

import { useState } from "react";
import { useCurrentUser } from "@/api/Queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Eye, Edit, UserX } from "lucide-react";

interface StudentData {
  id: string;
  matricNumber: string;
  name: string;
  level: number;
  cgpa: number;
  email: string;
  status: "active" | "inactive" | "suspended";
}

export default function StudentsManagementPage() {
  const { data: user } = useCurrentUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const mockStudents: StudentData[] = [
    {
      id: "STU001",
      matricNumber: "UNI/2024/001",
      name: "John Doe",
      level: 300,
      cgpa: 4.25,
      email: "john.doe@student.edu",
      status: "active",
    },
    {
      id: "STU002",
      matricNumber: "UNI/2024/002",
      name: "Jane Smith",
      level: 300,
      cgpa: 3.85,
      email: "jane.smith@student.edu",
      status: "active",
    },
    {
      id: "STU003",
      matricNumber: "UNI/2024/003",
      name: "Mike Johnson",
      level: 200,
      cgpa: 4.1,
      email: "mike.johnson@student.edu",
      status: "active",
    },
  ];

  if (!user) {
    return null;
  }

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage student records and information
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Student
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStudents.filter((s) => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              300 Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStudents.filter((s) => s.level === 300).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average CGPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStudents.reduce((sum, s) => sum + s.cgpa, 0) /
                mockStudents.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Records</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name or matric number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matric Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.matricNumber}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.level}</TableCell>
                  <TableCell>{student.cgpa}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "active"
                          ? "success"
                          : student.status === "inactive"
                            ? "default"
                            : "danger"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
