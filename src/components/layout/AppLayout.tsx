
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
        <main className="flex-1 overflow-y-auto transition-all duration-300 md:ml-64">
          {/* Container with dynamic width adjustment based on panel state */}
          <div className="p-6" style={{ marginRight: isAIPanelOpen ? '320px' : '0' }}>
            {children}
          </div>
        </main>
        <AIAssistantPanel onExpandChange={setIsAIPanelOpen} />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
