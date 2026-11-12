# University Management System

A modern, full-featured web-based university management system with role-based access control, academic data management, course registration, result management, and administrative oversight.

## Features

### 🎓 For Students
- Secure authentication and personalized dashboard
- View and update profile information
- View department, faculty, program, and matriculation details
- Browse available courses by level and semester
- Register courses for the current semester (12-24 units)
- View registered courses and total credit units
- Access academic results and semester grades
- View cumulative GPA (CGPA) and academic history
- Download/print course summary and result statements

### 👨‍🏫 For Lecturers
- Secure lecturer dashboard
- View assigned courses
- Access student class lists
- Enter continuous assessment (CA) and examination scores
- Save results as drafts before submission
- Submit completed results for departmental review
- Track submission status and feedback
- View course and student performance summaries

### 🏢 For Department Admins
- Department-wide dashboard and analytics
- Register and manage students within department
- Create and manage lecturer profiles
- Create and manage departmental courses
- Assign lecturers to courses
- Manage academic levels and programs
- Monitor student course registrations
- Review and approve submitted examination results
- Return results to lecturers for corrections
- Generate departmental reports

### 👑 For Super Admins
- University-wide dashboard and oversight
- Create and manage faculties and departments
- Create and manage academic programs
- Manage all student and lecturer accounts
- Create and manage academic sessions and semesters
- Manage courses and allocations across the university
- Activate, deactivate, and suspend user accounts
- Manage user roles and permissions
- Monitor course registrations university-wide
- Oversee departmental result approvals
- Access comprehensive university reports
- Monitor system activities and administrative actions

## Technology Stack

- **Framework**: Next.js 16.4.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **UI Components**: Custom-built with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser

## Demo Accounts

Use these credentials to test different user roles:

| Role | Email | Password |
|------|-------|----------|
| Student | student@university.edu | password123 |
| Lecturer | lecturer@university.edu | password123 |
| Department Admin | deptadmin@university.edu | password123 |
| Super Admin | admin@university.edu | password123 |

## Project Structure

```
university/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Dashboard pages for all roles
│   │   ├── registration/        # Student course registration
│   │   ├── results/            # Student results view
│   │   ├── profile/            # Student profile management
│   │   ├── grades/             # Lecturer grade entry
│   │   ├── students/           # Admin student management
│   │   ├── approvals/          # Admin result approval
│   │   └── page.tsx            # Main dashboard (role-based)
│   ├── login/                  # Authentication page
│   └── page.tsx                # Root redirect page
├── components/
│   ├── layout/                 # Layout components
│   └── ui/                     # Reusable UI components
├── store/                      # State management
├── lib/                        # Utilities and mock data
└── types/                      # TypeScript definitions
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Key Features

✅ Role-based access control (RBAC)  
✅ Student course registration with validation  
✅ Lecturer grade entry with draft/submit workflow  
✅ Department admin result approval  
✅ Student results with CGPA calculation  
✅ Profile management  
✅ Modern, responsive UI  
✅ Type-safe with TypeScript  

Built with Next.js and TypeScript
