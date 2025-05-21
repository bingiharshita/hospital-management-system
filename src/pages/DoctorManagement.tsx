
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  avatar?: string;
}

// Mock data for doctors
const mockDoctors: Doctor[] = [
  { 
    id: '1', 
    name: 'Dr. John Smith', 
    email: 'john.smith@hospital.com', 
    specialty: 'Cardiology', 
    joinDate: '2022-01-15', 
    status: 'active' 
  },
  { 
    id: '2', 
    name: 'Dr. Sarah Johnson', 
    email: 'sarah.johnson@hospital.com', 
    specialty: 'Neurology', 
    joinDate: '2021-05-22', 
    status: 'active' 
  },
  { 
    id: '3', 
    name: 'Dr. Michael Brown', 
    email: 'michael.brown@hospital.com', 
    specialty: 'Pediatrics', 
    joinDate: '2023-03-10', 
    status: 'active' 
  },
  { 
    id: '4', 
    name: 'Dr. Emily Chen', 
    email: 'emily.chen@hospital.com', 
    specialty: 'Dermatology', 
    joinDate: '2022-08-05', 
    status: 'on-leave' 
  },
  { 
    id: '5', 
    name: 'Dr. Robert Williams', 
    email: 'robert.williams@hospital.com', 
    specialty: 'Orthopedics', 
    joinDate: '2021-11-30', 
    status: 'inactive' 
  },
];

const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for adding/editing doctors
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    status: 'active' as const,
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle doctor deletion
  const handleDelete = (id: string) => {
    setDoctors(prev => prev.filter(doctor => doctor.id !== id));
    toast({
      title: "Doctor removed",
      description: "The doctor has been successfully removed from the system.",
    });
  };
  
  // Handle doctor form submission (add/edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDoctor) {
      // Edit existing doctor
      setDoctors(prev => 
        prev.map(doctor => 
          doctor.id === selectedDoctor.id 
            ? { ...doctor, ...formData } 
            : doctor
        )
      );
      toast({
        title: "Doctor updated",
        description: "The doctor's information has been successfully updated.",
      });
    } else {
      // Add new doctor
      const newDoctor: Doctor = {
        id: `${doctors.length + 1}`,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setDoctors(prev => [...prev, newDoctor]);
      toast({
        title: "Doctor added",
        description: "The new doctor has been successfully added to the system.",
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  // Reset form and selected doctor
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      specialty: '',
      status: 'active',
    });
    setSelectedDoctor(null);
  };
  
  // Open edit dialog with doctor data
  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      status: doctor.status,
    });
    setIsAddDialogOpen(true);
  };

  // Get status badge color
  const getStatusBadge = (status: Doctor['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-500">On Leave</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Doctor Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-hospital-600 hover:bg-hospital-700"
              onClick={() => {
                resetForm();
                setSelectedDoctor(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
              <DialogDescription>
                {selectedDoctor 
                  ? 'Update the doctor\'s information in the system.' 
                  : 'Add a new doctor to the hospital system.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialty" className="text-right">
                    Specialty
                  </Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-hospital-600 hover:bg-hospital-700">
                  {selectedDoctor ? 'Update' : 'Add'} Doctor
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Doctors List</CardTitle>
              <CardDescription>
                Manage all the doctors in the hospital
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <User className="h-8 w-8 mb-2" />
                      {searchTerm ? 'No doctors match your search' : 'No doctors added yet'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={doctor.avatar} />
                          <AvatarFallback className="bg-hospital-100 text-hospital-600">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>
                      {new Date(doctor.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(doctor)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(doctor.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DoctorManagement;
