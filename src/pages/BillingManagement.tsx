import React, { useState } from 'react';
import { EyeIcon, Download, Search, PlusCircle, Filter, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const BillingManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [open, setOpen] = useState(false);

  const billingData = [
    {
      id: '1',
      patientName: 'John Doe',
      date: '2024-01-15',
      amount: 150.00,
      status: 'paid',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      date: '2024-01-20',
      amount: 200.00,
      status: 'pending',
    },
    {
      id: '3',
      patientName: 'Alice Johnson',
      date: '2024-01-25',
      amount: 75.00,
      status: 'paid',
    },
    {
      id: '4',
      patientName: 'Bob Williams',
      date: '2024-01-30',
      amount: 300.00,
      status: 'overdue',
    },
  ];

  const filteredBillingData = billingData.filter((billing) => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const patientNameMatch = searchRegex.test(billing.patientName);
    const statusMatch = filterStatus ? billing.status === filterStatus : true;

    return patientNameMatch && statusMatch;
  });

  const sortedBillingData = [...filteredBillingData].sort((a, b) => {
    if (sortColumn === 'patientName') {
      const nameA = a.patientName.toUpperCase();
      const nameB = b.patientName.toUpperCase();
      if (nameA < nameB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    } else if (sortColumn === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortColumn === 'status') {
      const statusA = a.status.toUpperCase();
      const statusB = b.status.toUpperCase();
      if (statusA < statusB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (statusA > statusB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Management</CardTitle>
        <CardDescription>Manage and view billing records.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search patient..."
                  className="max-w-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select onValueChange={(value) => setFilterStatus(value)}>
                  <SelectTrigger className="ml-2 w-[180px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="icon" className="mr-2">
                  <Download className="h-5 w-5" />
                </Button>
                {user?.role === 'admin' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Bill
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add Bill</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input id="name" value="Sofia Davis" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input id="username" value="shadcn" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input type="checkbox" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('patientName')}>
                    Patient Name
                    {sortColumn === 'patientName' && (
                      <ArrowUpDown className="inline-block ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    Date
                    {sortColumn === 'date' && <ArrowUpDown className="inline-block ml-1 h-4 w-4" />}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                    Amount
                    {sortColumn === 'amount' && <ArrowUpDown className="inline-block ml-1 h-4 w-4" />}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    Status
                    {sortColumn === 'status' && <ArrowUpDown className="inline-block ml-1 h-4 w-4" />}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBillingData.map((billing) => (
                  <TableRow key={billing.id}>
                    <TableCell>
                      <input type="checkbox" />
                    </TableCell>
                    <TableCell>{billing.patientName}</TableCell>
                    <TableCell>{billing.date}</TableCell>
                    <TableCell>${billing.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          billing.status === 'paid'
                            ? 'success'
                            : billing.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {billing.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon">
                        <EyeIcon className="h-4 w-4 mr-2" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="paid">
            <p>This is the Paid tab content.</p>
          </TabsContent>
          <TabsContent value="pending">
            <p>This is the Pending tab content.</p>
          </TabsContent>
          <TabsContent value="overdue">
            <p>This is the Overdue tab content.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p>Total records: {billingData.length}</p>
      </CardFooter>
    </Card>
  );
};

export default BillingManagement;
