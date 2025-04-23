
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import AIAssistantPanel from './AIAssistantPanel';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className={`flex-1 overflow-y-auto transition-[margin] duration-300 md:ml-64 ${isAIPanelOpen ? 'mr-80' : ''}`}> 
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
        <AIAssistantPanel onExpandChange={setIsAIPanelOpen} />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
