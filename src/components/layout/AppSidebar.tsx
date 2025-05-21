
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { 
  User, Users, Calendar, FileText, Receipt, 
  LayoutDashboard, Search, ChartBar, Hospital 
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const { user } = useAuth();

  // Menu items based on user role
  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Dashboard', url: '/admin-dashboard', icon: LayoutDashboard },
          { title: 'Doctors', url: '/doctors', icon: Users },
          { title: 'Patients', url: '/patients', icon: User },
          { title: 'Appointments', url: '/appointments', icon: Calendar },
          { title: 'Medical Records', url: '/records', icon: FileText },
          { title: 'Billing', url: '/billing', icon: Receipt },
          { title: 'Reports', url: '/reports', icon: ChartBar },
        ];
      case 'doctor':
        return [
          { title: 'Dashboard', url: '/doctor-dashboard', icon: LayoutDashboard },
          { title: 'My Patients', url: '/my-patients', icon: User },
          { title: 'Appointments', url: '/appointments', icon: Calendar },
          { title: 'Medical Records', url: '/records', icon: FileText },
        ];
      case 'patient':
        return [
          { title: 'Dashboard', url: '/patient-dashboard', icon: LayoutDashboard },
          { title: 'Book Appointment', url: '/book-appointment', icon: Calendar },
          { title: 'My Records', url: '/my-records', icon: FileText },
          { title: 'My Bills', url: '/my-bills', icon: Receipt },
        ];
      default:
        return [];
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-16 px-6 border-b">
        <div className="flex items-center">
          <Hospital className="text-hospital-600 h-6 w-6 mr-2" />
          <h1 className="font-bold text-xl text-hospital-600">MediCare</h1>
        </div>
        <SidebarTrigger className="md:hidden ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive ? 'text-primary font-medium' : ''
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-center text-muted-foreground">
          <p>© 2025 MediCare Hospital</p>
          <p>All rights reserved</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
