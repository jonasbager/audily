
import React, { useState } from 'react';
import { useEvidence, useDeleteEvidence } from '@/hooks/useEvidence';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EvidenceDetail from './EvidenceDetail';
import { Evidence } from '@/services/evidenceService';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';

const EvidenceList: React.FC = () => {
  const { data: evidenceList, isLoading } = useEvidence();
  const deleteEvidenceMutation = useDeleteEvidence();
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredEvidence = React.useMemo(() => {
    if (!evidenceList) return [];
    
    return evidenceList.filter((evidence) => {
      const matchesSearch = evidence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evidence.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesStatus = statusFilter === 'all' || evidence.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [evidenceList, searchTerm, statusFilter]);
  
  const handleViewEvidence = (evidence: Evidence) => {
    setSelectedEvidence(evidence);
    setIsDetailOpen(true);
  };

  const handleDeleteEvidence = async (id: string) => {
    if (confirm("Are you sure you want to delete this evidence? This action cannot be undone.")) {
      try {
        await deleteEvidenceMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete evidence:", error);
      }
    }
  };

  const handleDownloadEvidence = async (evidence: Evidence) => {
    if (!evidence.file_path) {
      toast({
        title: "Download failed",
        description: "No file associated with this evidence",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('evidence')
        .download(evidence.file_path);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = evidence.file_path.split('/').pop() || 'evidence-file';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Could not download the file",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search evidence..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredEvidence.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Uploaded On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvidence.map((evidence) => (
              <TableRow key={evidence.id}>
                <TableCell className="font-medium">{evidence.title}</TableCell>
                <TableCell>{formatDate(evidence.created_at)}</TableCell>
                <TableCell>
                  <div className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${evidence.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : evidence.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }
                  `}>
                    {evidence.status.charAt(0).toUpperCase() + evidence.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewEvidence(evidence)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownloadEvidence(evidence)}
                    disabled={!evidence.file_path}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteEvidence(evidence.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          {searchTerm || statusFilter !== 'all' ? (
            <p>No evidence matching your search criteria.</p>
          ) : (
            <p>No evidence uploaded yet.</p>
          )}
        </div>
      )}
      
      <EvidenceDetail 
        evidence={selectedEvidence} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};

export default EvidenceList;
