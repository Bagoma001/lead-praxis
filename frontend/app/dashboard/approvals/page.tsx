'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, Eye, Clock } from 'lucide-react';

interface ResultSubmission {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  studentsCount: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ResultApprovalPage() {
  const { user } = useAuthStore();

  const [submissions, setSubmissions] = useState<ResultSubmission[]>([
    {
      id: 'SUB001',
      courseCode: 'CSC301',
      courseTitle: 'Data Structures and Algorithms',
      lecturer: 'Dr. Sarah Johnson',
      studentsCount: 45,
      submittedDate: '2024-01-15',
      status: 'pending',
    },
    {
      id: 'SUB002',
      courseCode: 'CSC302',
      courseTitle: 'Database Management Systems',
      lecturer: 'Dr. Sarah Johnson',
      studentsCount: 42,
      submittedDate: '2024-01-14',
      status: 'pending',
    },
    {
      id: 'SUB003',
      courseCode: 'CSC303',
      courseTitle: 'Operating Systems',
      lecturer: 'Prof. John Smith',
      studentsCount: 38,
      submittedDate: '2024-01-10',
      status: 'approved',
    },
  ]);

  if (!user || (user.role !== 'department_admin' && user.role !== 'super_admin')) {
    return null;
  }

  const handleApprove = (id: string) => {
    const confirmed = confirm('Are you sure you want to approve this result submission?');
    if (confirmed) {
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: 'approved' as const } : sub))
      );
      alert('Result approved successfully!');
    }
  };

  const handleReject = (id: string) => {
    const feedback = prompt('Please provide feedback for rejection:');
    if (feedback) {
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: 'rejected' as const } : sub))
      );
      alert('Result rejected and feedback sent to lecturer.');
    }
  };

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Result Approval</h1>
          <p className="text-gray-600 mt-1">
            Review and approve submitted examination results
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Submissions</CardTitle>
            <CardDescription>Results awaiting your review and approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions
                  .filter((sub) => sub.status === 'pending')
                  .map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.courseCode}</TableCell>
                      <TableCell>{submission.courseTitle}</TableCell>
                      <TableCell>{submission.lecturer}</TableCell>
                      <TableCell>{submission.studentsCount}</TableCell>
                      <TableCell>{submission.submittedDate}</TableCell>
                      <TableCell>
                        <Badge variant="warning">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(submission.id)}
                            className="text-green-600"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(submission.id)}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processed Submissions</CardTitle>
            <CardDescription>Recently approved or rejected results</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions
                  .filter((sub) => sub.status !== 'pending')
                  .map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.courseCode}</TableCell>
                      <TableCell>{submission.courseTitle}</TableCell>
                      <TableCell>{submission.lecturer}</TableCell>
                      <TableCell>{submission.studentsCount}</TableCell>
                      <TableCell>{submission.submittedDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={submission.status === 'approved' ? 'success' : 'danger'}
                        >
                          {submission.status}
                        </Badge>
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
