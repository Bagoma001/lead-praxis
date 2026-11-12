'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lecturer } from '@/types';
import { mockCourses, mockCourseAllocations } from '@/lib/mock-data';
import { Save, Send, FileText } from 'lucide-react';

interface StudentGrade {
  id: string;
  matricNumber: string;
  name: string;
  caScore: number;
  examScore: number;
  total: number;
  grade: string;
}

export default function GradesPage() {
  const { user } = useAuthStore();
  const lecturer = user as Lecturer;

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [grades, setGrades] = useState<StudentGrade[]>([
    {
      id: 'STU001',
      matricNumber: 'UNI/2024/001',
      name: 'John Doe',
      caScore: 0,
      examScore: 0,
      total: 0,
      grade: '-',
    },
    {
      id: 'STU002',
      matricNumber: 'UNI/2024/002',
      name: 'Jane Smith',
      caScore: 0,
      examScore: 0,
      total: 0,
      grade: '-',
    },
    {
      id: 'STU003',
      matricNumber: 'UNI/2024/003',
      name: 'Mike Johnson',
      caScore: 0,
      examScore: 0,
      total: 0,
      grade: '-',
    },
  ]);

  if (!lecturer || lecturer.role !== 'lecturer') {
    return null;
  }

  const allocatedCourses = mockCourseAllocations
    .filter((alloc) => alloc.lecturerId === lecturer.id)
    .map((alloc) => mockCourses.find((c) => c.id === alloc.courseId))
    .filter(Boolean);

  const calculateGrade = (total: number): string => {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 45) return 'D';
    if (total >= 40) return 'E';
    return 'F';
  };

  const updateScore = (studentId: string, field: 'caScore' | 'examScore', value: number) => {
    setGrades((prev) =>
      prev.map((grade) => {
        if (grade.id === studentId) {
          const updated = { ...grade, [field]: value };
          updated.total = updated.caScore + updated.examScore;
          updated.grade = calculateGrade(updated.total);
          return updated;
        }
        return grade;
      })
    );
  };

  const handleSaveDraft = () => {
    alert('Grades saved as draft successfully!');
  };

  const handleSubmit = () => {
    const confirmed = confirm(
      'Are you sure you want to submit these grades? Once submitted, they will be sent for departmental approval.'
    );
    if (confirmed) {
      alert('Grades submitted successfully for approval!');
    }
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grade Entry</h1>
          <p className="text-gray-600 mt-1">
            Enter and manage student grades for your assigned courses
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
            <CardDescription>Choose a course to enter or update grades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {allocatedCourses.map((course) => (
                <button
                  key={course?.id}
                  onClick={() => setSelectedCourse(course?.id || '')}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    selectedCourse === course?.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <h3 className="font-semibold">{course?.code}</h3>
                    <p className="text-sm text-gray-600">{course?.title}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="info">{course?.unit} Units</Badge>
                    <p className="text-xs text-gray-600 mt-1">{course?.level} Level</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedCourse && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Grade Entry</CardTitle>
                  <CardDescription>
                    Enter CA scores (max 30) and Exam scores (max 70)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button onClick={handleSubmit} className="gap-2">
                    <Send className="h-4 w-4" />
                    Submit for Approval
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matric Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>CA Score (30)</TableHead>
                    <TableHead>Exam Score (70)</TableHead>
                    <TableHead>Total (100)</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.matricNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="30"
                          value={student.caScore || ''}
                          onChange={(e) =>
                            updateScore(
                              student.id,
                              'caScore',
                              Math.min(30, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="70"
                          value={student.examScore || ''}
                          onChange={(e) =>
                            updateScore(
                              student.id,
                              'examScore',
                              Math.min(70, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="font-semibold">{student.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.grade === 'A'
                              ? 'success'
                              : student.grade === 'B'
                              ? 'info'
                              : student.grade === 'F'
                              ? 'danger'
                              : 'default'
                          }
                        >
                          {student.grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 border-t pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Total Students</h4>
                    <p className="text-2xl font-bold">{grades.length}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Grades Entered</h4>
                    <p className="text-2xl font-bold">
                      {grades.filter((g) => g.total > 0).length}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Status</h4>
                    <Badge variant="warning">Draft</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">CSC301 - Data Structures</p>
                    <p className="text-sm text-gray-600">Submitted on Jan 15, 2024</p>
                  </div>
                </div>
                <Badge variant="success">Approved</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">CSC302 - Database Systems</p>
                    <p className="text-sm text-gray-600">Submitted on Jan 10, 2024</p>
                  </div>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
