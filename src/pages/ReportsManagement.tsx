
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReportsManagement: React.FC = () => {
  // Mock data for charts
  const appointmentData = [
    { month: 'Jan', count: 35 },
    { month: 'Feb', count: 28 },
    { month: 'Mar', count: 42 },
    { month: 'Apr', count: 38 },
    { month: 'May', count: 50 },
    { month: 'Jun', count: 45 },
    { month: 'Jul', count: 52 },
    { month: 'Aug', count: 48 },
    { month: 'Sep', count: 55 },
    { month: 'Oct', count: 60 },
    { month: 'Nov', count: 58 },
    { month: 'Dec', count: 62 },
  ];

  const revenueData = [
    { month: 'Jan', amount: 12500 },
    { month: 'Feb', amount: 10800 },
    { month: 'Mar', amount: 15200 },
    { month: 'Apr', amount: 14300 },
    { month: 'May', amount: 18500 },
    { month: 'Jun', amount: 16700 },
    { month: 'Jul', amount: 19200 },
    { month: 'Aug', amount: 17800 },
    { month: 'Sep', amount: 20500 },
    { month: 'Oct', amount: 22000 },
    { month: 'Nov', amount: 21500 },
    { month: 'Dec', amount: 23200 },
  ];

  const patientData = [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 132 },
    { month: 'Mar', count: 145 },
    { month: 'Apr', count: 155 },
    { month: 'May', amount: 168 },
    { month: 'Jun', count: 180 },
    { month: 'Jul', count: 192 },
    { month: 'Aug', count: 205 },
    { month: 'Sep', count: 218 },
    { month: 'Oct', count: 230 },
    { month: 'Nov', count: 245 },
    { month: 'Dec', count: 260 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Reports Management</h2>
        <div>
          <p className="text-sm text-muted-foreground">
            Today's Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">Appointment Statistics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="patients">Patient Growth</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Appointments</CardTitle>
              <CardDescription>
                Number of appointments scheduled each month in 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={appointmentData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>
                Revenue generated each month in 2024 (in USD)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patients" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Growth</CardTitle>
              <CardDescription>
                Cumulative number of patients registered by month in 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={patientData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;
