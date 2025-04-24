
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import AIAssistantPanel from './AIAssistantPanel';
import { useChat } from '@/contexts/ChatContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isChatVisible, setIsChatVisible } = useChat();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ml-sidebar ${isChatVisible ? 'mr-80' : ''}`}> 
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
        <AIAssistantPanel onExpandChange={setIsChatVisible} />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
