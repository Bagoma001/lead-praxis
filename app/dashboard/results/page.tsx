"use client";

import { useCurrentUser, useFetchUserResults } from "@/api/Queries";
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
import { Download } from "lucide-react";
import { calculateCGPA } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { usePDF } from "react-to-pdf";

export default function ResultsPage() {
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { data: results = [], isLoading: isLoadingResults } =
    useFetchUserResults();
  const { toPDF, targetRef } = usePDF({
    filename: "academic-result-statement.pdf",
    method: "save",
    page: {
      format: "a4",
      orientation: "portrait",
      margin: 10,
    },
    overrides: {
      canvas: {
        onclone: (clonedDocument) => {
          const target = clonedDocument.getElementById("results-statement");

          if (!target) {
            return;
          }

          const elements = [
            target,
            ...Array.from(target.querySelectorAll<HTMLElement>("*")),
          ];
          const unsupportedColor = /(lab|lch|color-mix|oklab|oklch)\(/i;
          const colorProperties = new Set([
            "color",
            "background-color",
            "border-color",
            "border-top-color",
            "border-right-color",
            "border-bottom-color",
            "border-left-color",
            "outline-color",
            "text-decoration-color",
            "fill",
            "stroke",
            "box-shadow",
          ]);

          elements.forEach((element) => {
            const computedStyle =
              clonedDocument.defaultView?.getComputedStyle(element);

            if (!computedStyle) {
              return;
            }

            for (let index = 0; index < computedStyle.length; index += 1) {
              const property = computedStyle.item(index);
              const value = computedStyle.getPropertyValue(property);

              if (!unsupportedColor.test(value)) {
                element.style.setProperty(property, value);
                continue;
              }

              if (property === "box-shadow") {
                element.style.setProperty(property, "none");
              } else if (colorProperties.has(property)) {
                element.style.setProperty(
                  property,
                  property === "background-color" ? "#ffffff" : "#111827",
                );
              }
            }
          });

          clonedDocument
            .querySelectorAll("style, link[rel='stylesheet']")
            .forEach((stylesheet) => stylesheet.remove());
        },
      },
    },
  });

  if (isLoadingUser || isLoadingResults) {
    return (
      <Spinner
        isLoading
        modal
        size="lg"
        label={isLoadingUser ? "Loading student profile" : "Loading results"}
      />
    );
  }

  if (!user || user.role !== "student") {
    return null;
  }

  const resultSet = results[0];
  const grades = resultSet?.grades ?? [];
  const courses = resultSet?.courses ?? [];
  const courseById = new Map(courses.map((course) => [course.id, course]));
  const totalUnits = grades.reduce(
    (sum, result) => sum + (courseById.get(result.courseId)?.unit ?? 0),
    0,
  );
  const getGradeVariant = (grade?: string) => {
    if (!grade) return "default";
    if (grade === "A") return "success";
    if (grade === "B") return "info";
    if (grade === "C") return "warning";
    return "default";
  };

  const cgpa =
    resultSet?.cgpa ??
    calculateCGPA(
      grades.map((result) => ({
        grade: result.grade || "F",
        units: courseById.get(result.courseId)?.unit ?? 0,
      })),
    );

  return (
    <div
      ref={targetRef}
      id="results-statement"
      className="space-y-6 bg-white p-2"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
          <p className="text-gray-600 mt-1">
            View your academic performance and grades
          </p>
        </div>
        <Button onClick={() => toPDF()} className="gap-2">
          <Download className="h-4 w-4" />
          Download Statement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cumulative GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{cgpa}</div>
            <p className="text-xs text-gray-800 mt-1">Out of 5.00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-800">
              Completed Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{grades.length}</div>
            <p className="text-xs text-gray-800 mt-1">Total courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-800">
              Total Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{totalUnits}</div>
            <p className="text-xs text-gray-800 mt-1">Credit hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-800">
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Excellent</Badge>
            <p className="text-xs text-gray-800 mt-2">First Class Honours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Results - 2024/2025 Session</CardTitle>
          <CardDescription>First Semester Results</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>CA Score</TableHead>
                <TableHead>Exam Score</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((result) => {
                const course = courseById.get(result.courseId);
                return (
                  <TableRow key={result.id ?? result.courseId}>
                    <TableCell className="font-medium text-black">
                      {course?.code}
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      {course?.title}
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      {course?.unit}
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      {result.caScore || 0}
                    </TableCell>
                    <TableCell className="font-medium text-black">
                      {result.score}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {result.totalScore}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getGradeVariant(result.grade)}>
                        {result.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">
                        {result.status === "approved"
                          ? "Approved"
                          : (result.status ?? "Published")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-6 border-t pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-black">Semester Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-800">
                      Total Units Registered:
                    </span>
                    <span className="font-medium text-black">{totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">Semester GPA:</span>
                    <span className="font-medium text-black">{cgpa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">Class of Degree:</span>
                    <span className="font-medium text-black">
                      First Class Honours
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-black">Grading System</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-800">A (70-100):</span>
                    <span className="font-medium text-gray-800">
                      5.0 points
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">B (60-69):</span>
                    <span className="font-medium text-gray-800">
                      4.0 points
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800">C (50-59):</span>
                    <span className="font-medium text-gray-800  ">
                      3.0 points
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
