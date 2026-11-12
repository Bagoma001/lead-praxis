"use client";

import {
  useCurrentUser,
  useFetchRegisteredCourses,
  useFetchUserResults,
} from "@/api/Queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  FileText,
  Building2,
  ClipboardList,
} from "lucide-react";
import { Student, Lecturer, DepartmentAdmin, SuperAdmin } from "@/types";
import { mockCourses, mockDepartments, mockFaculties } from "@/lib/mock-data";
import { Spinner } from "@/components/ui/spinner";

function StudentDashboard({ student }: { student: Student }) {
  const { data: registeredCourses = [], isPending } =
    useFetchRegisteredCourses();
  const { data: userResults = [], isLoading: resultsLoading } =
    useFetchUserResults();

  if (isPending) {
    return (
      <Spinner
        modal={true}
        isLoading={true}
        size="lg"
        label="Fetching Courses"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">
              Current Level
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-black font-bold">
              {student.level} Level
            </div>
            <p className="text-xs text-gray-800 mt-1">
              Academic Year 2024/2025
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">
              Registered Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-black font-bold">
              {registeredCourses.length || 0}
            </div>
            <p className="text-xs text-gray-800 mt-1">Current Semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">
              CGPA
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-black font-bold">
              {resultsLoading ? (
                <Spinner isLoading size="sm" label="Loading CGPA" />
              ) : (
                userResults[0]?.cgpa || 0.0
              )}
            </div>
            <p className="text-xs text-green-600 mt-1">Excellent Performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-800">
              Completed Courses
            </CardTitle>
            <Award className="h-4 w-4 text-gray-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-black font-bold">
              {userResults[0]?.grades?.length || 0}
            </div>
            <p className="text-xs text-gray-800 mt-1">Total Courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-800">Matric Number:</span>
              <span className="font-medium text-black">
                {student.matriculationNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">Department:</span>
              <span className="font-medium text-black">
                {" "}
                {student.department?.name}{" "}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">Faculty:</span>
              <span className="font-medium text-black">
                {" "}
                {student.faculty?.name}{" "}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Program:</span>
              <span className="font-medium">B.Sc. Computer Science</span>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            {resultsLoading ? (
              <div className="flex min-h-24 items-center justify-center">
                <Spinner isLoading size="sm" label="Loading recent results" />
              </div>
            ) : (
              <div className="space-y-3">
                {userResults[0]?.grades?.slice(0, 3).map((result) => {
                  const course = userResults[0]?.courses.find(
                    (c) => c.id === result.courseId,
                  );
                  return (
                    <div
                      key={course?.id ?? result.courseId}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {course?.code}
                        </p>
                        <p className="text-sm text-black">{course?.title}</p>
                      </div>
                      <Badge
                        variant={
                          result.grade === "A"
                            ? "success"
                            : result.grade === "B"
                              ? "info"
                              : "default"
                        }
                      >
                        Grade: {result.grade}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LecturerDashboard({ lecturer }: { lecturer: Lecturer }) {
  const allocatedCourses = 2;
  const totalStudents = 45;
  const pendingSubmissions = 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {lecturer.firstName}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Assigned Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allocatedCourses}</div>
            <p className="text-xs text-gray-600 mt-1">Current Semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-gray-600 mt-1">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Submissions
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions}</div>
            <p className="text-xs text-orange-600 mt-1">Requires action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Submitted Results
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-green-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lecturer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Staff ID:</span>
            <span className="font-medium">{lecturer.staffId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Department:</span>
            <span className="font-medium">Computer Science</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Qualification:</span>
            <span className="font-medium">{lecturer.qualification}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Specialization:</span>
            <span className="font-medium">{lecturer.specialization}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DepartmentAdminDashboard({ admin }: { admin: DepartmentAdmin }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Department Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Welcome back, {admin.firstName}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-gray-600 mt-1">In department</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Lecturers
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600 mt-1">Active staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCourses.length}</div>
            <p className="text-xs text-gray-600 mt-1">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Approvals
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-orange-600 mt-1">Requires review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Department:</span>
            <span className="font-medium">Computer Science</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Faculty:</span>
            <span className="font-medium">Science</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">HOD:</span>
            <span className="font-medium">Prof. Michael Williams</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SuperAdminDashboard({ admin }: { admin: SuperAdmin }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">University Management Overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Faculties
            </CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFaculties.length}</div>
            <p className="text-xs text-gray-600 mt-1">Active faculties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Departments
            </CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDepartments.length}</div>
            <p className="text-xs text-gray-600 mt-1">Across all faculties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-gray-600 mt-1">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Lecturers
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-gray-600 mt-1">Active staff</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">New student registered</p>
                  <p className="text-xs text-gray-600">
                    Computer Science Department
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Results approved</p>
                  <p className="text-xs text-gray-600">
                    Mathematics Department
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-500" />
                <div>
                  <p className="text-sm font-medium">New course created</p>
                  <p className="text-xs text-gray-600">
                    Civil Engineering Department
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Session:</span>
              <span className="font-medium">2024/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Semester:</span>
              <span className="font-medium">First Semester</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Programs:</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">System Status:</span>
              <Badge variant="success">Operational</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  return (
    <>
      {user.role === "student" && (
        <StudentDashboard student={user as Student} />
      )}
      {user.role === "lecturer" && (
        <LecturerDashboard lecturer={user as Lecturer} />
      )}
      {user.role === "department_admin" && (
        <DepartmentAdminDashboard admin={user as DepartmentAdmin} />
      )}
      {user.role === "super_admin" && (
        <SuperAdminDashboard admin={user as SuperAdmin} />
      )}
    </>
  );
}
