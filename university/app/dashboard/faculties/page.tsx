'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockFaculties, mockDepartments } from '@/lib/mock-data';
import { Plus, Building2, Edit, Trash2, Users } from 'lucide-react';

export default function FacultiesPage() {
  const { user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    dean: '',
  });

  if (!user || user.role !== 'super_admin') {
    return null;
  }

  const getDepartmentCount = (facultyId: string) => {
    return mockDepartments.filter((dept) => dept.facultyId === facultyId).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Faculty "${formData.name}" created successfully!`);
    setShowAddModal(false);
    setFormData({ name: '', code: '', dean: '' });
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
            <p className="text-gray-600 mt-1">Create and manage university faculties</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Faculty
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Faculties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockFaculties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDepartments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Faculty List</CardTitle>
            <CardDescription>All faculties in the university</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty Code</TableHead>
                  <TableHead>Faculty Name</TableHead>
                  <TableHead>Dean</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFaculties.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell className="font-medium">{faculty.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        {faculty.name}
                      </div>
                    </TableCell>
                    <TableCell>{faculty.dean || 'Not assigned'}</TableCell>
                    <TableCell>
                      <Badge variant="info">{getDepartmentCount(faculty.id)} depts</Badge>
                    </TableCell>
                    <TableCell>{faculty.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Faculty</CardTitle>
                <CardDescription>Create a new faculty in the university</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Faculty Name"
                    placeholder="e.g., Faculty of Science"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Faculty Code"
                    placeholder="e.g., SCI"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                  <Input
                    label="Dean (Optional)"
                    placeholder="e.g., Prof. John Doe"
                    value={formData.dean}
                    onChange={(e) => setFormData({ ...formData, dean: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Create Faculty
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
}
