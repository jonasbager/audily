
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EvidenceUploader from '@/components/evidence/EvidenceUploader';
import EvidenceList from '@/components/evidence/EvidenceList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EvidencePage: React.FC = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Evidence Management</h1>
        
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="library">Evidence Library</TabsTrigger>
            <TabsTrigger value="upload">Upload Evidence</TabsTrigger>
          </TabsList>
          <TabsContent value="library" className="mt-6">
            <EvidenceList />
          </TabsContent>
          <TabsContent value="upload" className="mt-6">
            <EvidenceUploader />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EvidencePage;
