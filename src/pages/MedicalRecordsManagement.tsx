
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Edit, FileText, Eye, FilePlus, Trash,
  Calendar, User, UserCheck, Stethoscope
} from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  avatar?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  recordType: 'consultation' | 'lab_result' | 'prescription' | 'surgery' | 'imaging';
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

// Mock data for patients and doctors
const mockPatients: Patient[] = [
  { id: '1', name: 'Jane Doe', dateOfBirth: '1985-06-15', gender: 'Female' },
  { id: '2', name: 'John Smith', dateOfBirth: '1978-11-23', gender: 'Male' },
  { id: '3', name: 'Alice Johnson', dateOfBirth: '1992-04-07', gender: 'Female' },
  { id: '4', name: 'Robert Williams', dateOfBirth: '1965-09-30', gender: 'Male' },
  { id: '5', name: 'Emily Davis', dateOfBirth: '2000-02-12', gender: 'Female' },
];

const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. John Smith', specialty: 'Cardiology' },
  { id: '2', name: 'Dr. Sarah Johnson', specialty: 'Neurology' },
  { id: '3', name: 'Dr. Michael Brown', specialty: 'Pediatrics' },
  { id: '4', name: 'Dr. Emily Chen', specialty: 'Dermatology' },
];

// Mock data for medical records
const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Jane Doe',
    doctorId: '1',
    doctorName: 'Dr. John Smith',
    date: '2025-05-15',
    recordType: 'consultation',
    diagnosis: 'Hypertension',
    treatment: 'Prescribed Lisinopril 10mg daily',
    notes: 'Patient should return for follow-up in 1 month.'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'John Smith',
    doctorId: '3',
    doctorName: 'Dr. Michael Brown',
    date: '2025-05-10',
    recordType: 'lab_result',
    notes: 'Complete blood count normal. Cholesterol slightly elevated.'
  },
  {
    id: '3',
    patientId: '1',
    patientName: 'Jane Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-05-05',
    recordType: 'imaging',
    diagnosis: 'No abnormalities detected',
    notes: 'Chest X-ray performed, results normal.'
  },
  {
    id: '4',
    patientId: '3',
    patientName: 'Alice Johnson',
    doctorId: '4',
    doctorName: 'Dr. Emily Chen',
    date: '2025-05-18',
    recordType: 'prescription',
    treatment: 'Topical corticosteroid cream, apply twice daily',
    notes: 'For treatment of eczema flare-up.'
  },
  {
    id: '5',
    patientId: '4',
    patientName: 'Robert Williams',
    doctorId: '1',
    doctorName: 'Dr. John Smith',
    date: '2025-05-12',
    recordType: 'surgery',
    diagnosis: 'Coronary artery disease',
    treatment: 'Coronary bypass surgery',
    notes: 'Surgery successful. Patient recovering well.'
  },
];

const MedicalRecordsManagement: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Form state for adding/editing records
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    recordType: 'consultation' as MedicalRecord['recordType'],
    diagnosis: '',
    treatment: '',
    notes: '',
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Filter records based on search term and active tab
  const filteredRecords = records.filter(record => {
    // Filter by search term
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && record.recordType === activeTab;
  });
  
  // Handle record form submission (add/edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedDoctor = mockDoctors.find(d => d.id === formData.doctorId);
    const selectedPatient = mockPatients.find(p => p.id === formData.patientId);
    
    if (!selectedDoctor || !selectedPatient) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select valid doctor and patient.",
      });
      return;
    }
    
    if (selectedRecord) {
      // Edit existing record
      setRecords(prev => 
        prev.map(record => 
          record.id === selectedRecord.id 
            ? {
                ...record,
                patientId: formData.patientId,
                patientName: selectedPatient.name,
                doctorId: formData.doctorId,
                doctorName: selectedDoctor.name,
                date: formData.date,
                recordType: formData.recordType,
                diagnosis: formData.diagnosis,
                treatment: formData.treatment,
                notes: formData.notes,
              } 
            : record
        )
      );
      toast({
        title: "Record updated",
        description: "The medical record has been successfully updated.",
      });
    } else {
      // Add new record
      const newRecord: MedicalRecord = {
        id: `${records.length + 1}`,
        patientId: formData.patientId,
        patientName: selectedPatient.name,
        doctorId: formData.doctorId,
        doctorName: selectedDoctor.name,
        date: formData.date,
        recordType: formData.recordType,
        diagnosis: formData.diagnosis || undefined,
        treatment: formData.treatment || undefined,
        notes: formData.notes || undefined,
      };
      setRecords(prev => [...prev, newRecord]);
      toast({
        title: "Record created",
        description: "The new medical record has been successfully added.",
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  // Delete record
  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
    toast({
      title: "Record deleted",
      description: "The medical record has been removed from the system.",
    });
  };
  
  // Reset form and selected record
  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      recordType: 'consultation',
      diagnosis: '',
      treatment: '',
      notes: '',
    });
    setSelectedRecord(null);
  };
  
  // Open edit dialog with record data
  const openEditDialog = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setFormData({
      patientId: record.patientId,
      doctorId: record.doctorId,
      date: record.date,
      recordType: record.recordType,
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      notes: record.notes || '',
    });
    setIsAddDialogOpen(true);
  };
  
  // Open view dialog with record data
  const openViewDialog = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };
  
  // Get record type badge
  const getRecordTypeBadge = (type: MedicalRecord['recordType']) => {
    switch (type) {
      case 'consultation':
        return <Badge className="bg-blue-500">Consultation</Badge>;
      case 'lab_result':
        return <Badge className="bg-purple-500">Lab Result</Badge>;
      case 'prescription':
        return <Badge className="bg-green-500">Prescription</Badge>;
      case 'surgery':
        return <Badge className="bg-red-500">Surgery</Badge>;
      case 'imaging':
        return <Badge className="bg-yellow-500">Imaging</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Medical Records</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-hospital-600 hover:bg-hospital-700"
              onClick={() => {
                resetForm();
                setSelectedRecord(null);
              }}
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedRecord ? 'Edit Medical Record' : 'Add New Medical Record'}
              </DialogTitle>
              <DialogDescription>
                {selectedRecord 
                  ? 'Update the medical record details.' 
                  : 'Fill in the details to create a new medical record.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patientId" className="text-right">
                    Patient
                  </Label>
                  <select
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select Patient</option>
                    {mockPatients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.dateOfBirth} ({patient.gender})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doctorId" className="text-right">
                    Doctor
                  </Label>
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {mockDoctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recordType" className="text-right">
                    Record Type
                  </Label>
                  <select
                    id="recordType"
                    name="recordType"
                    value={formData.recordType}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="consultation">Consultation</option>
                    <option value="lab_result">Lab Result</option>
                    <option value="prescription">Prescription</option>
                    <option value="surgery">Surgery</option>
                    <option value="imaging">Imaging</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="diagnosis" className="text-right">
                    Diagnosis
                  </Label>
                  <Input
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Patient diagnosis (if applicable)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="treatment" className="text-right">
                    Treatment
                  </Label>
                  <Input
                    id="treatment"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Treatment plan (if applicable)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right align-top pt-2">
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Additional notes or details about the record"
                  />
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
                  {selectedRecord ? 'Update' : 'Save'} Record
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* View Record Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedRecord && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    {getRecordTypeBadge(selectedRecord.recordType)}
                    <DialogTitle>
                      Medical Record
                    </DialogTitle>
                  </div>
                  <DialogDescription>
                    Detailed view of the medical record
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-hospital-100 text-hospital-600">
                          {selectedRecord.patientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-muted-foreground">Patient</p>
                        <p className="font-medium">{selectedRecord.patientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-hospital-100 text-hospital-600">
                          {selectedRecord.doctorName.split(' ')[0][0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-muted-foreground">Doctor</p>
                        <p className="font-medium">{selectedRecord.doctorName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Date</span>
                      <span>{new Date(selectedRecord.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    {selectedRecord.diagnosis && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Diagnosis</span>
                        <span>{selectedRecord.diagnosis}</span>
                      </div>
                    )}
                    
                    {selectedRecord.treatment && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Treatment</span>
                        <span>{selectedRecord.treatment}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedRecord.notes && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        {selectedRecord.notes}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline"
                    onClick={() => openEditDialog(selectedRecord)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    className="bg-hospital-600 hover:bg-hospital-700"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="space-y-0 pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>
                Manage patient medical records and history
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Types</TabsTrigger>
              <TabsTrigger value="consultation">Consultations</TabsTrigger>
              <TabsTrigger value="lab_result">Lab Results</TabsTrigger>
              <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
              <TabsTrigger value="surgery">Surgeries</TabsTrigger>
              <TabsTrigger value="imaging">Imaging</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Diagnosis/Treatment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="h-8 w-8 mb-2" />
                          {searchTerm ? 'No records match your search' : 'No medical records found'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-hospital-100 text-hospital-600">
                                {record.patientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>{record.patientName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-hospital-100 text-hospital-600">
                                {record.doctorName.split(' ')[1].charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>{record.doctorName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>{getRecordTypeBadge(record.recordType)}</TableCell>
                        <TableCell>
                          <div className="truncate max-w-xs">
                            {record.diagnosis || record.treatment || 'No details provided'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openViewDialog(record)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(record)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(record.id)}
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
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredRecords.length} of {records.length} records
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MedicalRecordsManagement;
