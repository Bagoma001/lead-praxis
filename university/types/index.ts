export type UserRole =
  | "student"
  | "lecturer"
  | "department_admin"
  | "super_admin";

export type AccountStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: AccountStatus;
  profilePicture?: string;
}

export interface Student extends User {
  role: "student";
  matriculationNumber: string;
  departmentId: string;
  facultyId: string;
  programId: string;
  level: number;
  semester?: "First" | "Second";
  cgpa: number;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female";
  department?: {
    name: string;
  };
  faculty?: {
    name: string;
  };
}

export interface Lecturer extends User {
  role: "lecturer";
  staffId: string;
  departmentId: string;
  qualification: string;
  specialization: string;
}

export interface DepartmentAdmin extends User {
  role: "department_admin";
  departmentId: string;
}

export interface SuperAdmin extends User {
  role: "super_admin";
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  dean?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  hod?: string;
  createdAt: string;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  duration: number; // in years
  degree: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  unit: number;
  level: number;
  semester: "First" | "Second";
  departmentId: string;
  programId?: string;
  isElective: boolean;
  description?: string;
}

export type UserCourse = Course & {
  studentId?: string;
  courseId?: string;
  registrationStatus?: CourseRegistration["status"];
};

export type RegisteredCourse = UserCourse & {
  course?: UserCourse;
};

export interface UserGrade {
  id?: string;
  courseId: string;
  grade?: string;
  caScore?: number;
  examScore?: number;
  score?: number;
  totalScore?: number;
  status?: "draft" | "submitted" | "approved" | "rejected";
}

export interface UserResults {
  cgpa?: number;
  grades: UserGrade[];
  courses: UserCourse[];
}

export interface CourseAllocation {
  id: string;
  courseId: string;
  lecturerId: string;
  sessionId: string;
  semester: "First" | "Second";
}

export interface CourseRegistration {
  id: string;
  studentId: string;
  courseId: string;
  sessionId: string;
  semester: "First" | "Second";
  status: "registered" | "approved" | "dropped";
  registeredAt: string;
}

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  sessionId: string;
  semester: "First" | "Second";
  caScore?: number;
  examScore?: number;
  totalScore?: number;
  grade?: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedAt?: string;
  approvedAt?: string;
  feedback?: string;
}

export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  currentSemester: "First" | "Second";
  isActive: boolean;
}

export interface DashboardStats {
  totalStudents?: number;
  totalLecturers?: number;
  totalCourses?: number;
  totalDepartments?: number;
  totalFaculties?: number;
  activeRegistrations?: number;
  pendingResults?: number;
  totalPrograms?: number;
}

export interface userType {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  referralCode?: string;
  deviceId?: string;
  confirmPassword: string;
  avatarUrl?: string;
  phoneNumber?: string;
  bio?: string;
  user_agent?: string;
}

export interface SearchUsersResponse {
  users: userType[]; // This matches the "users" key from your backend
  total: number;
  limit: number;
  offset: number;
}

export interface userAcademicType {
  universityId: string;
  facultyId: string;
  departmentId: string;
  degreeType?: string;
  semester: string;
  level: number;
}

export interface userSemesterLevelType {
  semester: string;
  level: number;
}
