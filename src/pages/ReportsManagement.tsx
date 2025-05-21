
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBar, ChartPie, DownloadCloud, Calendar, Users, User, Receipt, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from 'recharts';
import { toast } from '@/hooks/use-toast';

// Mock data for reports
const appointmentData = [
  { month: 'Jan', count: 45 },
  { month: 'Feb', count: 52 },
  { month: 'Mar', count: 60 },
  { month: 'Apr', count: 70 },
  { month: 'May', count: 85 },
];

const revenueData = [
  { month: 'Jan', amount: 12500 },
  { month: 'Feb', amount: 14200 },
  { month: 'Mar', amount: 16800 },
  { month: 'Apr', amount: 18500 },
  { month: 'May', amount: 22000 },
];

const departmentData = [
  { name: 'Cardiology', value: 25 },
  { name: 'Neurology', value: 18 },
  { name: 'Pediatrics', value: 22 },
  { name: 'Dermatology', value: 15 },
  { name: 'Orthopedics', value: 20 },
];

const patientData = [
  { name: 'New', value: 35 },
  { name: 'Recurring', value: 65 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsManagement: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('appointments');
  
  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Download started",
      description: `${reportType} report download has started.`,
    });
  };

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-md shadow-sm">
          <p className="label font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name === 'amount' ? 'Revenue: $' : ''}
              {entry.value}
              {entry.name === 'count' ? ' appointments' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">312</div>
            <p className="text-xs text-green-600">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$84,000</div>
            <p className="text-xs text-green-600">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Patients
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-green-600">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medical Records
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-green-600">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <Receipt className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Users className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="patients">
            <User className="h-4 w-4 mr-2" />
            Patients
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="m-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Appointment Trends</CardTitle>
                  <CardDescription>
                    Number of appointments per month
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport("Appointment Trends")}
                >
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={appointmentData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Appointments" 
                      fill="#0ea5e9" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="m-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>
                    Monthly revenue figures
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport("Revenue Analytics")}
                >
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      name="Revenue" 
                      stroke="#0ea5e9" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="m-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>
                    Appointments by department
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport("Department Distribution")}
                >
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patients" className="m-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Patient Analysis</CardTitle>
                  <CardDescription>
                    New vs. recurring patients
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadReport("Patient Analysis")}
                >
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={patientData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#0ea5e9" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Summary of recent hospital activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: User, text: "10 new patients registered", time: "2 hours ago" },
                { icon: Calendar, text: "15 appointments scheduled", time: "5 hours ago" },
                { icon: Receipt, text: "$5,240 in payments received", time: "Yesterday" },
                { icon: FileText, text: "36 medical records updated", time: "Yesterday" },
                { icon: Users, text: "2 new doctors joined", time: "3 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <item.icon className="h-4 w-4 text-hospital-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.text}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Available report downloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: ChartBar, title: "Monthly Hospital Performance", description: "Full analysis of hospital operations" },
                { icon: ChartPie, title: "Department Metrics", description: "Performance by department and specialty" },
                { icon: Receipt, title: "Financial Summary", description: "Revenue, expenses and profit analysis" },
                { icon: Users, title: "Staff Productivity", description: "Doctor and staff performance metrics" },
                { icon: Calendar, title: "Appointment Analysis", description: "Scheduling patterns and statistics" },
              ].map((report, index) => (
                <div key={index} className="flex items-start justify-between border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <report.icon className="h-4 w-4 text-hospital-600" />
                    </div>
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownloadReport(report.title)}
                  >
                    <DownloadCloud className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManagement;
