
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Calendar, CalendarPlus, CalendarX, User, Users } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
}

interface Patient {
  id: string;
  name: string;
  avatar?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

// Mock data for doctors and patients
const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. John Smith', specialty: 'Cardiology' },
  { id: '2', name: 'Dr. Sarah Johnson', specialty: 'Neurology' },
  { id: '3', name: 'Dr. Michael Brown', specialty: 'Pediatrics' },
  { id: '4', name: 'Dr. Emily Chen', specialty: 'Dermatology' },
];

const mockPatients: Patient[] = [
  { id: '1', name: 'Jane Doe' },
  { id: '2', name: 'John Smith' },
  { id: '3', name: 'Alice Johnson' },
  { id: '4', name: 'Robert Williams' },
  { id: '5', name: 'Emily Davis' },
];

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Jane Doe',
    doctorId: '1',
    doctorName: 'Dr. John Smith',
    date: '2025-05-22',
    time: '09:00',
    type: 'Consultation',
    status: 'scheduled',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'John Smith',
    doctorId: '3',
    doctorName: 'Dr. Michael Brown',
    date: '2025-05-21',
    time: '11:30',
    type: 'Follow-up',
    status: 'completed',
    notes: 'Patient reported improvement in symptoms.',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Alice Johnson',
    doctorId: '2',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-05-25',
    time: '14:15',
    type: 'Initial Assessment',
    status: 'scheduled',
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Robert Williams',
    doctorId: '4',
    doctorName: 'Dr. Emily Chen',
    date: '2025-05-20',
    time: '10:45',
    type: 'Treatment',
    status: 'cancelled',
    notes: 'Patient requested cancellation due to schedule conflict.',
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'Emily Davis',
    doctorId: '1',
    doctorName: 'Dr. John Smith',
    date: '2025-05-24',
    time: '16:30',
    type: 'Consultation',
    status: 'scheduled',
  },
];

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Form state for adding/editing appointments
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: '',
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
  
  // Filter appointments based on search term and active tab
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by search term
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && appointment.status === activeTab;
  });
  
  // Handle appointment form submission (add/edit)
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
    
    if (selectedAppointment) {
      // Edit existing appointment
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === selectedAppointment.id 
            ? {
                ...appointment,
                patientId: formData.patientId,
                patientName: selectedPatient.name,
                doctorId: formData.doctorId,
                doctorName: selectedDoctor.name,
                date: formData.date,
                time: formData.time,
                type: formData.type,
                notes: formData.notes,
              } 
            : appointment
        )
      );
      toast({
        title: "Appointment updated",
        description: "The appointment has been successfully updated.",
      });
    } else {
      // Add new appointment
      const newAppointment: Appointment = {
        id: `${appointments.length + 1}`,
        patientId: formData.patientId,
        patientName: selectedPatient.name,
        doctorId: formData.doctorId,
        doctorName: selectedDoctor.name,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        status: 'scheduled',
        notes: formData.notes,
      };
      setAppointments(prev => [...prev, newAppointment]);
      toast({
        title: "Appointment created",
        description: "The appointment has been successfully scheduled.",
      });
    }
    
    // Reset form and close dialog
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  // Handle appointment status change
  const updateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      )
    );
    
    const statusMessages = {
      completed: "Appointment marked as completed.",
      cancelled: "Appointment has been cancelled.",
      scheduled: "Appointment has been rescheduled.",
      'no-show': "Patient has been marked as no-show."
    };
    
    toast({
      title: "Status updated",
      description: statusMessages[newStatus],
    });
  };
  
  // Delete appointment
  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    toast({
      title: "Appointment deleted",
      description: "The appointment has been removed from the system.",
    });
  };
  
  // Reset form and selected appointment
  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      type: '',
      notes: '',
    });
    setSelectedAppointment(null);
  };
  
  // Open edit dialog with appointment data
  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      notes: appointment.notes || '',
    });
    setIsAddDialogOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-500 border-red-500">Cancelled</Badge>;
      case 'no-show':
        return <Badge className="bg-yellow-500">No Show</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Appointment Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-hospital-600 hover:bg-hospital-700"
              onClick={() => {
                resetForm();
                setSelectedAppointment(null);
              }}
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
              </DialogTitle>
              <DialogDescription>
                {selectedAppointment 
                  ? 'Update the appointment details.' 
                  : 'Fill in the details to schedule a new appointment.'}
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
                        {patient.name}
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
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Initial Assessment">Initial Assessment</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency">Emergency</option>
                  </select>
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
                    placeholder="Add any notes or special instructions"
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
                  {selectedAppointment ? 'Update' : 'Schedule'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="space-y-0 pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle>Appointments</CardTitle>
              <CardDescription>
                Manage doctor appointments and schedules
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
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
              <TabsTrigger value="all">
                All
                <span className="ml-2 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {appointments.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                Scheduled
                <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                <span className="ml-2 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs">
                  {appointments.filter(a => a.status === 'completed').length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled
                <span className="ml-2 bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-xs">
                  {appointments.filter(a => a.status === 'cancelled').length}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Calendar className="h-8 w-8 mb-2" />
                          {searchTerm ? 'No appointments match your search' : 'No appointments found'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-hospital-100 text-hospital-600">
                                {appointment.patientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>{appointment.patientName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-hospital-100 text-hospital-600">
                                {appointment.doctorName.split(' ')[1].charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>{appointment.doctorName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.time}
                          </div>
                        </TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(appointment)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {appointment.status === 'scheduled' && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                  >
                                    <CalendarX className="mr-2 h-4 w-4" />
                                    Cancel Appointment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => updateAppointmentStatus(appointment.id, 'no-show')}
                                  >
                                    <User className="mr-2 h-4 w-4" />
                                    Mark as No-Show
                                  </DropdownMenuItem>
                                </>
                              )}
                              {(appointment.status === 'cancelled' || appointment.status === 'no-show') && (
                                <DropdownMenuItem 
                                  onClick={() => updateAppointmentStatus(appointment.id, 'scheduled')}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Reschedule
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleDelete(appointment.id)}
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
              Showing {filteredAppointments.length} of {appointments.length} appointments
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
