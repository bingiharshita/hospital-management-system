
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Receipt, Bell, User, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const PatientDashboard: React.FC = () => {
  // Mock upcoming appointment
  const upcomingAppointment = {
    id: 1,
    doctorName: 'Dr. John Smith',
    specialty: 'Cardiologist',
    date: '2025-05-25',
    time: '09:00 AM',
    avatar: ''
  };
  
  // Mock recent visits
  const recentVisits = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Williams',
      specialty: 'General Practitioner',
      date: '2025-05-01',
      diagnosis: 'Common Cold'
    },
    {
      id: 2,
      doctorName: 'Dr. John Smith',
      specialty: 'Cardiologist',
      date: '2025-04-15',
      diagnosis: 'Annual Heart Checkup'
    }
  ];
  
  // Mock prescriptions
  const prescriptions = [
    {
      id: 1,
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      remaining: 5,
      total: 14
    },
    {
      id: 2,
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'As needed for pain',
      remaining: 10,
      total: 20
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patient Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, Jane Doe
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Today's Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="col-span-2 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button className="h-20 flex flex-col gap-1 items-center justify-center" variant="outline">
              <Calendar className="h-5 w-5" />
              <span>Book Appointment</span>
            </Button>
            <Button className="h-20 flex flex-col gap-1 items-center justify-center" variant="outline">
              <FileText className="h-5 w-5" />
              <span>View Records</span>
            </Button>
            <Button className="h-20 flex flex-col gap-1 items-center justify-center" variant="outline">
              <Receipt className="h-5 w-5" />
              <span>Pay Bills</span>
            </Button>
            <Button className="h-20 flex flex-col gap-1 items-center justify-center" variant="outline">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 md:col-span-2">
          <CardHeader>
            <CardTitle>Next Appointment</CardTitle>
            <CardDescription>
              Your upcoming medical visit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={upcomingAppointment.avatar} />
                <AvatarFallback className="bg-hospital-100 text-hospital-600">
                  {upcomingAppointment.doctorName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{upcomingAppointment.doctorName}</p>
                <p className="text-sm text-muted-foreground">{upcomingAppointment.specialty}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{new Date(upcomingAppointment.date).toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{upcomingAppointment.time}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1">Reschedule</Button>
              <Button variant="destructive" className="flex-1">Cancel</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
            <CardDescription>
              Your past medical appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{visit.doctorName}</p>
                      <p className="text-sm text-muted-foreground">{visit.specialty}</p>
                    </div>
                    <p className="text-sm">
                      {new Date(visit.date).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Diagnosis:</span> {visit.diagnosis}
                  </p>
                  <Button variant="link" className="px-0 text-hospital-600 mt-2">
                    View Full Record
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Visits</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Prescriptions</CardTitle>
            <CardDescription>
              Medications you're currently taking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{prescription.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {prescription.dosage} - {prescription.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Remaining</span>
                      <span>{prescription.remaining} of {prescription.total}</span>
                    </div>
                    <Progress value={(prescription.remaining / prescription.total) * 100} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Request Refill</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bills</CardTitle>
          <CardDescription>
            Your pending payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium">Invoice #12345</p>
              <p className="text-sm text-muted-foreground">Annual Checkup - April 15, 2025</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
              <div className="text-right sm:mr-4 w-full sm:w-auto">
                <p className="font-bold">$150.00</p>
                <p className="text-xs text-muted-foreground">Due in 10 days</p>
              </div>
              <Button className="w-full sm:w-auto">Pay Now</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Bills</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientDashboard;
