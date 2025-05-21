
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, Calendar, Receipt, Search, ChartBar } from 'lucide-react';

const DashboardCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, description, icon, color }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`p-2 rounded-md ${color}`}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to the hospital management system.
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Today's Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Doctors"
          value="24"
          description="3 new this month"
          icon={<Users className="h-4 w-4 text-white" />}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Total Patients"
          value="345"
          description="15 new this week"
          icon={<User className="h-4 w-4 text-white" />}
          color="bg-green-500"
        />
        <DashboardCard
          title="Appointments"
          value="42"
          description="Today's scheduled"
          icon={<Calendar className="h-4 w-4 text-white" />}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Revenue"
          value="$12,345"
          description="This month"
          icon={<Receipt className="h-4 w-4 text-white" />}
          color="bg-purple-500"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest activities in the hospital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">Patient {i} registered</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Commonly used functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-md">
                <Users className="h-5 w-5" />
                <span>Add New Doctor</span>
              </button>
              <button className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-md">
                <User className="h-5 w-5" />
                <span>Register Patient</span>
              </button>
              <button className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-md">
                <Calendar className="h-5 w-5" />
                <span>Schedule Appointment</span>
              </button>
              <button className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-md">
                <Search className="h-5 w-5" />
                <span>Search Records</span>
              </button>
              <button className="w-full flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-md">
                <ChartBar className="h-5 w-5" />
                <span>Generate Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
