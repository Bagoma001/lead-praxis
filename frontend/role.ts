// Define role-based route access
const roleRoutes = {
  student: [
    "/dashboard",
    "/dashboard/registration",
    "/dashboard/results",
    "/dashboard/grades",
    "/dashboard/profile",
  ],
  lecturer: [
    "/dashboard",
    "/dashboard/grades",
    "/dashboard/students",
    "/dashboard/profile",
  ],
  department_admin: [
    "/dashboard",
    "/dashboard/approvals",
    "/dashboard/students",
    "/dashboard/courses",
    "/dashboard/profile",
  ],
  super_admin: [
    "/dashboard",
    "/dashboard/faculties",
    "/dashboard/courses",
    "/dashboard/students",
    "/dashboard/approvals",
    "/dashboard/profile",
  ],
};
