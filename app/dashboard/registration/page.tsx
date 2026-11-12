"use client";

import { useFetchRegisteredCourses, useDeleteUserCourses } from "@/api/Queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Trash2 } from "lucide-react";

export default function CourseRegistrationPage() {
  const { data: registeredCourses = [], isLoading } =
    useFetchRegisteredCourses();
  const { deleteCourses, isPending } = useDeleteUserCourses();

  const totalUnits = registeredCourses.reduce(
    (sum, course) => sum + course.unit,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Course Registration
          </h1>
          <p className="text-gray-800 mt-1">
            View and manage your registered courses for the current semester
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-800">Total Units</p>
          <p className="text-3xl font-bold text-blue-600">{totalUnits}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Courses</CardTitle>
          <CardDescription>
            Add new courses from the My Courses page. You can remove registered
            courses here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-gray-600">
              Loading registered courses...
            </p>
          ) : registeredCourses.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center text-gray-600">
              <BookOpen className="h-8 w-8" />
              <p>You have no registered courses yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registeredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium text-black">
                      {course.code}
                    </TableCell>
                    <TableCell className="text-black">{course.title}</TableCell>
                    <TableCell className="text-black">{course.unit}</TableCell>
                    <TableCell>
                      <Badge variant={course.isElective ? "info" : "default"}>
                        {course.isElective ? "Elective" : "Core"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Registered</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteCourses(course.id)}
                        disabled={isPending}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        {isPending ? "Removing..." : "Remove"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
