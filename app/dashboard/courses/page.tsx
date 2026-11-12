"use client";

import { useMemo, useState } from "react";
import {
  useCurrentUser,
  useFetchUserCourses,
  useFetchRegisteredCourses,
  useRegisterCourses,
} from "@/api/Queries";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Student, Lecturer } from "@/types";
import { mockCourseAllocations } from "@/lib/mock-data";

import { BookOpen, CheckCircle2, GraduationCap, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function CoursesPage() {
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { data: userCourses, isPending } = useFetchUserCourses();

  const {
    data: registeredCourses = [],
    isPending: isFetchingRegisteredCourses,
  } = useFetchRegisteredCourses();
  const {
    registerCourses,
    isRegistering,
    registrationError,
    registrationSucceeded,
  } = useRegisterCourses();
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const isStudent = user?.role === "student";
  const isLecturer = user?.role === "lecturer";

  let displayCourses = userCourses;

  if (isStudent) {
    const student = user as Student;
    displayCourses = userCourses?.filter(
      (course) => course.level === student.level,
    );
  }

  if (isLecturer) {
    const lecturer = user as Lecturer;
    const allocatedCourseIds = mockCourseAllocations
      .filter((alloc) => alloc.lecturerId === lecturer.id)
      .map((alloc) => alloc.courseId);
    displayCourses = userCourses?.filter((course) =>
      allocatedCourseIds.includes(course.id),
    );
  }

  const registeredCourseIds = useMemo(
    () =>
      registeredCourses.map(
        (registration) =>
          registration.course?.id ?? registration.courseId ?? registration.id,
      ),
    [registeredCourses],
  );
  const selectedIds = useMemo(
    () => Array.from(new Set([...registeredCourseIds, ...selectedCourseIds])),
    [registeredCourseIds, selectedCourseIds],
  );
  const totalUnits =
    displayCourses
      ?.filter((course) => selectedIds.includes(course.id))
      .reduce((sum, course) => sum + course.unit, 0) ?? 0;
  const isRegistered = (courseId: string) =>
    registeredCourseIds.includes(courseId);
  const isSelected = (courseId: string) => selectedIds.includes(courseId);

  const handleRegister = () => {
    const selectedCoursePayload =
      displayCourses
        ?.filter((course) => selectedIds.includes(course.id))
        .map((course) => ({
          code: course.code,
          courseId: course.id,
          title: course.title,
          unit: course.unit,
        })) ?? [];

    registerCourses(selectedCoursePayload);
  };

  if (isLoadingUser || !user || isPending || isFetchingRegisteredCourses) {
    return (
      <Spinner
        isLoading={true}
        modal={true}
        size="lg"
        label={isLoadingUser || !user ? "Loading user" : "Fetching Courses"}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isStudent
            ? "My Courses"
            : isLecturer
              ? "Teaching Courses"
              : "All Courses"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isStudent
            ? "View available courses for your level"
            : isLecturer
              ? "Courses assigned to you"
              : "Browse all courses in the system"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-800">
              {isStudent ? "Available Courses" : "Total Courses"}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-black font-bold">
              {displayCourses?.length}
            </div>
          </CardContent>
        </Card>

        {isStudent && (
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-800">
                Registered Courses
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-black font-bold">
                {registeredCourses?.length}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Credit Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-black font-bold">
              {displayCourses?.reduce((sum, course) => sum + course.unit, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isStudent
              ? `Courses for ${(user as Student).level} Level`
              : "Course List"}
          </CardTitle>
          <CardDescription>
            {isStudent
              ? "All courses available for your current level"
              : isLecturer
                ? "Your assigned courses"
                : "Complete list of courses"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Type</TableHead>
                {isStudent && <TableHead>Status</TableHead>}
                {isStudent && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCourses?.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium text-black">
                    {course.code}
                  </TableCell>
                  <TableCell className="font-medium text-black">
                    {course.title}
                  </TableCell>
                  <TableCell className="font-medium text-black">
                    {course.unit}
                  </TableCell>
                  <TableCell className="font-medium text-black">
                    {course.level}
                  </TableCell>
                  <TableCell className="font-medium text-black">
                    {course.semester}
                  </TableCell>
                  <TableCell className="font-medium text-black">
                    <Badge variant={course.isElective ? "info" : "default"}>
                      {course.isElective ? "Elective" : "Core"}
                    </Badge>
                  </TableCell>
                  {isStudent && (
                    <TableCell>
                      {isRegistered(course.id) ? (
                        <Badge variant="success">Registered</Badge>
                      ) : (
                        <Badge variant="default">Not registered</Badge>
                      )}
                    </TableCell>
                  )}
                  {isStudent && (
                    <TableCell>
                      {isRegistered(course.id) ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Added</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedCourseIds((current) => [
                              ...current,
                              course.id,
                            ])
                          }
                          disabled={isSelected(course.id)}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {isStudent && (
            <div className="mt-6 flex items-center justify-between border-t pt-6">
              <div>
                <p className="text-sm text-gray-600">
                  {registrationError &&
                    "Registration failed. Please try again."}
                  {registrationSucceeded &&
                    !registrationError &&
                    "Registration submitted successfully."}
                  {!registrationError &&
                    !registrationSucceeded &&
                    totalUnits < 12 &&
                    "Please select at least 12 units to proceed."}
                  {!registrationError &&
                    !registrationSucceeded &&
                    totalUnits > 24 &&
                    "Maximum units exceeded. Please drop some courses."}
                  {!registrationError &&
                    !registrationSucceeded &&
                    totalUnits >= 12 &&
                    totalUnits <= 24 &&
                    "You can proceed with registration."}
                </p>
              </div>
              <Button
                onClick={handleRegister}
                disabled={isRegistering || totalUnits < 12 || totalUnits > 24}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                {isRegistering ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
