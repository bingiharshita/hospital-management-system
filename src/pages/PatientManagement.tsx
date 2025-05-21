import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Update the Patient interface to include the address field
interface Patient {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string; // Added this missing property
  lastVisit: string;
  status: string;
  medicalHistory: string[];
}

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '1985-05-15',
      gender: 'Male',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, USA', // Added the address
      lastVisit: '2023-12-10',
      status: 'Active',
      medicalHistory: ['Hypertension', 'Diabetes']
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      dateOfBirth: '1990-08-22',
      gender: 'Female',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Somecity, USA', // Added the address
      lastVisit: '2024-01-05',
      status: 'Active',
      medicalHistory: ['Asthma']
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      dateOfBirth: '1978-03-10',
      gender: 'Male',
      phone: '(555) 234-5678',
      address: '789 Pine Rd, Otherville, USA', // Added the address
      lastVisit: '2023-11-18',
      status: 'Inactive',
      medicalHistory: ['Arthritis', 'Heart Disease']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Management</CardTitle>
        <CardDescription>Manage and view patient records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.dateOfBirth}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Badge variant={patient.status === 'Active' ? 'secondary' : 'destructive'}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <p>Total patients: {patients.length}</p>
      </CardFooter>
    </Card>
  );
};

export default PatientManagement;
