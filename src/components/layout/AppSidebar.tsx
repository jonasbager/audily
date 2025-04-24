import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Upload, 
  Link as LinkIcon, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ to, icon, label, isActive, onClick }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        "justify-start w-full h-10 mb-1 relative",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { signOut } = useAuth();
  
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col h-screen w-sidebar bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-10">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-4">
          <Link to="/dashboard" className="flex items-center">
            <img 
              src="/audily_logo.svg" 
              alt="Audily Logo" 
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>
        
        <nav className="flex-1 flex flex-col px-4 py-6">
          <SidebarLink 
            to="/dashboard" 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            isActive={isActive('/dashboard')}
          />
          <SidebarLink 
            to="/policies" 
            icon={<FileText className="h-5 w-5" />} 
            label="Policies" 
            isActive={isActive('/policies')}
          />
          <SidebarLink 
            to="/tasks" 
            icon={<CheckSquare className="h-5 w-5" />} 
            label="Tasks" 
            isActive={isActive('/tasks')}
          />
          <SidebarLink 
            to="/evidence" 
            icon={<Upload className="h-5 w-5" />} 
            label="Evidence" 
            isActive={isActive('/evidence')}
          />
          <SidebarLink 
            to="/integrations" 
            icon={<LinkIcon className="h-5 w-5" />} 
            label="Integrations" 
            isActive={isActive('/integrations')}
          />
        </nav>
        
        <div className="px-4 py-6 border-t border-sidebar-border">
          <SidebarLink 
            to="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            isActive={isActive('/settings')}
          />
          <SidebarLink 
            to="#" 
            icon={<LogOut className="h-5 w-5" />} 
            label="Logout" 
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
