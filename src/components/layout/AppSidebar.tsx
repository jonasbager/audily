
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Upload, 
  Link as LinkIcon, 
  Settings, 
  LogOut, 
  Shield 
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const SidebarLink = ({ to, icon, label, isActive }: SidebarLinkProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              "h-10 w-10 p-0 relative",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            {icon}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-popover border-border">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="flex flex-col h-screen w-16 bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-10">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex justify-center py-4">
          <Link to="/dashboard" className="flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          </Link>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-2 px-3 py-8">
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
        
        {/* Bottom Navigation */}
        <div className="px-3 py-4 flex flex-col items-center gap-2">
          <SidebarLink 
            to="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            isActive={isActive('/settings')}
          />
          <SidebarLink 
            to="/auth" 
            icon={<LogOut className="h-5 w-5" />} 
            label="Logout" 
            isActive={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
