
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Edit, Trash, Receipt, User,
  Check, CreditCard, CalendarClock, SquareArrowDown
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  services: {
    serviceId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod?: 'credit_card' | 'cash' | 'insurance' | 'bank_transfer';
  paymentDate?: string;
  notes?: string;
}

// Mock data for patients
const mockPatients: Patient[] = [
  { id: '1', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '(555) 123-4567' },
  { id: '2', name: 'John Smith', email: 'john.smith@example.com', phone: '(555) 987-6543' },
  { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '(555) 456-7890' },
  { id: '4', name: 'Robert Williams', email: 'robert.williams@example.com', phone: '(555) 789-0123' },
  { id: '5', name: 'Emily Davis', email: 'emily.davis@example.com', phone: '(555) 234-5678' },
];

// Mock data for services
const mockServices: Service[] = [
  { id: '1', name: 'General Consultation', price: 100 },
  { id: '2', name: 'Specialist Consultation', price: 200 },
  { id: '3', name: 'Blood Test', price: 75 },
  { id: '4', name: 'X-Ray', price: 150 },
  { id: '5', name: 'MRI Scan', price: 500 },
  { id: '6', name: 'Surgery (Minor)', price: 1000 },
  { id: '7', name: 'Surgery (Major)', price: 5000 },
  { id: '8', name: 'Physical Therapy Session', price: 80 },
];

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Jane Doe',
    invoiceNumber: 'INV-2025-001',
    date: '2025-05-15',
    dueDate: '2025-06-15',
    services: [
      { serviceId: '1', name: 'General Consultation', quantity: 1, price: 100 },
      { serviceId: '3', name: 'Blood Test', quantity: 1, price: 75 },
    ],
    subtotal: 175,
    tax: 17.5,
    discount: 0,
    total: 192.5,
    status: 'pending',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'John Smith',
    invoiceNumber: 'INV-2025-002',
    date: '2025-05-10',
    dueDate: '2025-06-10',
    services: [
      { serviceId: '2', name: 'Specialist Consultation', quantity: 1, price: 200 },
      { serviceId: '4', name: 'X-Ray', quantity: 1, price: 150 },
    ],
    subtotal: 350,
    tax: 35,
    discount: 20,
    total: 365,
    status: 'paid',
    paymentMethod: 'credit_card',
    paymentDate: '2025-05-12',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Alice Johnson',
    invoiceNumber: 'INV-2025-003',
    date: '2025-04-20',
    dueDate: '2025-05-20',
    services: [
      { serviceId: '5', name: 'MRI Scan', quantity: 1, price: 500 },
    ],
    subtotal: 500,
    tax: 50,
    discount: 50,
    total: 500,
    status: 'overdue',
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Robert Williams',
    invoiceNumber: 'INV-2025-004',
    date: '2025-05-05',
    dueDate: '2025-06-05',
    services: [
      { serviceId: '6', name: 'Surgery (Minor)', quantity: 1, price: 1000 },
      { serviceId: '8', name: 'Physical Therapy Session', quantity: 3, price: 80 },
    ],
    subtotal: 1240,
    tax: 124,
    discount: 100,
    total: 1264,
    status: 'paid',
    paymentMethod: 'insurance',
    paymentDate: '2025-05-10',
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'Emily Davis',
    invoiceNumber: 'INV-2025-005',
    date: '2025-05-16',
    dueDate: '2025-06-16',
    services: [
      { serviceId: '1', name: 'General Consultation', quantity: 1, price: 100 },
    ],
    subtotal: 100,
    tax: 10,
    discount: 0,
    total: 110,
    status: 'pending',
  },
];

const BillingManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewInvoiceOpen, setIsViewInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [invoiceServices, setInvoiceServices] = useState<{
    serviceId: string;
    quantity: number;
  }[]>([{ serviceId: '', quantity: 1 }]);
  
  // Form state for adding/editing invoices
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    dueDate: '',
    tax: 10,
    discount: 0,
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
  
  // Filter invoices based on search term and active tab
  const filteredInvoices = invoices.filter(invoice => {
    // Filter by search term
    const matchesSearch = 
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && invoice.status === activeTab;
  });
  
  // Calculate invoice totals
  const calculateInvoiceTotals = () => {
    const services = invoiceServices
      .filter(item => item.serviceId && item.quantity > 0)
      .map(item => {
        const service = mockServices.find(s => s.id === item.serviceId);
        return {
          serviceId: item.serviceId,
          name: service?.name || '',
          quantity: item.quantity,
          price: service?.price || 0
        };
      });
      
    const subtotal = services.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = (subtotal * (parseFloat(formData.tax.toString()) / 100));
    const discount = parseFloat(formData.discount.toString());
    const total = subtotal + tax - discount;
    
    return {
      services,
      subtotal,
      tax,
      discount,
      total
    };
  };
  
  // Add service row
  const addServiceRow = () => {
    setInvoiceServices([...invoiceServices, { serviceId: '', quantity: 1 }]);
  };
  
  // Remove service row
  const removeServiceRow = (index: number) => {
    const updatedServices = [...invoiceServices];
    updatedServices.splice(index, 1);
    setInvoiceServices(updatedServices);
  };
  
  // Handle service selection change
  const handleServiceChange = (index: number, field: string, value: string | number) => {
    const updatedServices = [...invoiceServices];
    updatedServices[index] = { 
      ...updatedServices[index], 
      [field]: value 
    };
    setInvoiceServices(updatedServices);
  };
  
  // Generate invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const invoiceCount = invoices.length + 1;
    return `INV-${year}-${invoiceCount.toString().padStart(3, '0')}`;
  };
  
  // Handle invoice form submission (add)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPatientObj = mockPatients.find(p => p.id === formData.patientId);
    
    if (!selectedPatientObj) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid patient.",
      });
      return;
    }
    
    const { services, subtotal, tax, discount, total } = calculateInvoiceTotals();
    
    if (services.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one service.",
      });
      return;
    }
    
    const newInvoice: Invoice = {
      id: `${invoices.length + 1}`,
      patientId: formData.patientId,
      patientName: selectedPatientObj.name,
      invoiceNumber: generateInvoiceNumber(),
      date: formData.date,
      dueDate: formData.dueDate,
      services,
      subtotal,
      tax,
      discount,
      total,
      status: 'pending',
      notes: formData.notes || undefined,
    };
    
    setInvoices(prev => [...prev, newInvoice]);
    toast({
      title: "Invoice created",
      description: "The invoice has been successfully created.",
    });
    
    // Reset form and close dialog
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  // Handle payment processing
  const processPayment = (invoiceId: string, paymentMethod: Invoice['paymentMethod']) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === invoiceId 
          ? { 
              ...invoice, 
              status: 'paid', 
              paymentMethod, 
              paymentDate: new Date().toISOString().split('T')[0] 
            } 
          : invoice
      )
    );
    
    toast({
      title: "Payment processed",
      description: `Invoice has been marked as paid via ${paymentMethod?.replace('_', ' ')}.`,
    });
  };
  
  // Mark invoice as overdue
  const markAsOverdue = (invoiceId: string) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, status: 'overdue' } 
          : invoice
      )
    );
    
    toast({
      title: "Status updated",
      description: "Invoice has been marked as overdue.",
    });
  };
  
  // Mark invoice as cancelled
  const cancelInvoice = (invoiceId: string) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, status: 'cancelled' } 
          : invoice
      )
    );
    
    toast({
      title: "Invoice cancelled",
      description: "The invoice has been cancelled.",
    });
  };
  
  // Delete invoice
  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    toast({
      title: "Invoice deleted",
      description: "The invoice has been removed from the system.",
    });
  };
  
  // Reset form and selected invoice
  const resetForm = () => {
    setFormData({
      patientId: '',
      date: '',
      dueDate: '',
      tax: 10,
      discount: 0,
      notes: '',
    });
    setInvoiceServices([{ serviceId: '', quantity: 1 }]);
    setSelectedInvoice(null);
  };
  
  // View invoice details
  const viewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewInvoiceOpen(true);
  };
  
  // Get status badge
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Billing Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-hospital-600 hover:bg-hospital-700"
              onClick={() => {
                resetForm();
                setSelectedInvoice(null);
              }}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new invoice.
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
                        {patient.name} ({patient.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Invoice Date
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
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">Services</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left font-medium text-sm pb-2">Service</th>
                          <th className="text-left font-medium text-sm pb-2">Qty</th>
                          <th className="text-left font-medium text-sm pb-2">Price</th>
                          <th className="text-left font-medium text-sm pb-2">Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceServices.map((serviceItem, index) => {
                          const selectedService = mockServices.find(s => s.id === serviceItem.serviceId);
                          const itemTotal = selectedService 
                            ? selectedService.price * serviceItem.quantity 
                            : 0;
                            
                          return (
                            <tr key={index}>
                              <td className="py-2 pr-4">
                                <select
                                  value={serviceItem.serviceId}
                                  onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  required
                                >
                                  <option value="">Select Service</option>
                                  {mockServices.map(service => (
                                    <option key={service.id} value={service.id}>
                                      {service.name} (${service.price.toFixed(2)})
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-2 pr-4">
                                <Input
                                  type="number"
                                  min={1}
                                  value={serviceItem.quantity}
                                  onChange={(e) => handleServiceChange(index, 'quantity', parseInt(e.target.value))}
                                  className="w-20"
                                  required
                                />
                              </td>
                              <td className="py-2 pr-4">
                                {selectedService ? formatCurrency(selectedService.price) : '-'}
                              </td>
                              <td className="py-2 pr-4">
                                {formatCurrency(itemTotal)}
                              </td>
                              <td className="py-2">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => removeServiceRow(index)}
                                  disabled={invoiceServices.length === 1}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addServiceRow}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
                
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">Invoice Summary</h3>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tax" className="text-right">
                        Tax Rate (%)
                      </Label>
                      <Input
                        id="tax"
                        name="tax"
                        type="number"
                        min={0}
                        step={0.01}
                        value={formData.tax}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="discount" className="text-right">
                        Discount Amount ($)
                      </Label>
                      <Input
                        id="discount"
                        name="discount"
                        type="number"
                        min={0}
                        step={0.01}
                        value={formData.discount}
                        onChange={handleInputChange}
                        className="col-span-3"
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
                        className="col-span-3 flex h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Add any notes or payment instructions"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t pt-4 flex flex-col items-end">
                    <div className="w-64 space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateInvoiceTotals().subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({formData.tax}%):</span>
                        <span>{formatCurrency(calculateInvoiceTotals().tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>{formatCurrency(calculateInvoiceTotals().discount)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateInvoiceTotals().total)}</span>
                      </div>
                    </div>
                  </div>
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
                  Create Invoice
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* View Invoice Dialog */}
        <Dialog open={isViewInvoiceOpen} onOpenChange={setIsViewInvoiceOpen}>
          <DialogContent className="sm:max-w-[700px]">
            {selectedInvoice && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle>
                      Invoice #{selectedInvoice.invoiceNumber}
                    </DialogTitle>
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                  <DialogDescription>
                    Created on {new Date(selectedInvoice.date).toLocaleDateString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                      <h4 className="font-medium">Patient</h4>
                      <div className="text-sm mt-1 space-y-1">
                        <p>{selectedInvoice.patientName}</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <h4 className="font-medium">Invoice Details</h4>
                      <div className="text-sm mt-1 space-y-1">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{new Date(selectedInvoice.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                        </div>
                        {selectedInvoice.paymentDate && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">Payment Date:</span>
                            <span>{new Date(selectedInvoice.paymentDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {selectedInvoice.paymentMethod && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">Payment Method:</span>
                            <span className="capitalize">
                              {selectedInvoice.paymentMethod.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInvoice.services.map((service, index) => (
                          <TableRow key={index}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell className="text-right">{service.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(service.price)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(service.price * service.quantity)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="w-64 space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedInvoice.tax)}</span>
                      </div>
                      {selectedInvoice.discount > 0 && (
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span>{formatCurrency(selectedInvoice.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedInvoice.total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedInvoice.notes && (
                    <div className="pt-2">
                      <h4 className="font-medium">Notes</h4>
                      <p className="text-sm mt-1">{selectedInvoice.notes}</p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  {selectedInvoice.status === 'pending' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Process Payment
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            processPayment(selectedInvoice.id, 'credit_card');
                            setIsViewInvoiceOpen(false);
                          }}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit Card
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            processPayment(selectedInvoice.id, 'cash');
                            setIsViewInvoiceOpen(false);
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Cash
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            processPayment(selectedInvoice.id, 'insurance');
                            setIsViewInvoiceOpen(false);
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Insurance
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            processPayment(selectedInvoice.id, 'bank_transfer');
                            setIsViewInvoiceOpen(false);
                          }}
                        >
                          <SquareArrowDown className="mr-2 h-4 w-4" />
                          Bank Transfer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Download invoice functionality would go here
                      toast({
                        title: "Download started",
                        description: "Invoice download has started.",
                      });
                    }}
                  >
                    Download PDF
                  </Button>
                  <Button 
                    className="bg-hospital-600 hover:bg-hospital-700"
                    onClick={() => setIsViewInvoiceOpen(false)}
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
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Manage patient invoices and payments
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
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
                  {invoices.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <span className="ml-2 bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 text-xs">
                  {invoices.filter(i => i.status === 'pending').length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="paid">
                Paid
                <span className="ml-2 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs">
                  {invoices.filter(i => i.status === 'paid').length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Overdue
                <span className="ml-2 bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-xs">
                  {invoices.filter(i => i.status === 'overdue').length}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Receipt className="h-8 w-8 mb-2" />
                          {searchTerm ? 'No invoices match your search' : 'No invoices found'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-hospital-100 text-hospital-600">
                                {invoice.patientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{invoice.patientName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewInvoice(invoice)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              
                              {invoice.status === 'pending' && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => markAsOverdue(invoice.id)}
                                  >
                                    <CalendarClock className="mr-2 h-4 w-4" />
                                    Mark as Overdue
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => cancelInvoice(invoice.id)}
                                    className="text-yellow-600"
                                  >
                                    <CalendarClock className="mr-2 h-4 w-4" />
                                    Cancel Invoice
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {invoice.status === 'pending' && (
                                <DropdownMenuItem>
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Process Payment
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                onClick={() => deleteInvoice(invoice.id)}
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
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingManagement;
