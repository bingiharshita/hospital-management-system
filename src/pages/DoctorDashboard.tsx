
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, FileText, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const DoctorDashboard: React.FC = () => {
  // Mock data for today's appointments
  const todayAppointments = [
    {
      id: 1,
      patientName: 'Jane Doe',
      time: '09:00 AM',
      status: 'Checked In',
      reason: 'Annual Checkup',
      avatar: '',
    },
    {
      id: 2,
      patientName: 'John Smith',
      time: '10:30 AM',
      status: 'Scheduled',
      reason: 'Follow-up',
      avatar: '',
    },
    {
      id: 3,
      patientName: 'Alice Johnson',
      time: '01:15 PM',
      status: 'Scheduled',
      reason: 'Consultation',
      avatar: '',
    },
    {
      id: 4,
      patientName: 'Bob Williams',
      time: '03:45 PM',
      status: 'Scheduled',
      reason: 'Test Results Review',
      avatar: '',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, Dr. John Smith
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Today's Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">4 scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">3 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">09:00 AM</div>
            <p className="text-xs text-muted-foreground">Jane Doe - Annual Checkup</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              Your appointments for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={appointment.avatar} />
                      <AvatarFallback className="bg-hospital-100 text-hospital-600">
                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <div className="text-right">
                      <p className="text-sm font-medium">{appointment.time}</p>
                      <p className={`text-xs ${
                        appointment.status === 'Checked In' 
                          ? 'text-green-500' 
                          : 'text-orange-500'
                      }`}>
                        {appointment.status}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
            <CardDescription>
              Latest updates to patient records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 border-b pb-4 last:border-0">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">Patient {i} Record Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() - i * 7200000).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Records</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Week</CardTitle>
            <CardDescription>
              Your schedule for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <p className="font-medium">{day}</p>
                  <div className="text-right">
                    <p className="text-sm">{Math.floor(Math.random() * 6) + 3} appointments</p>
                    <p className="text-xs text-muted-foreground">First: 9:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Full Schedule</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
