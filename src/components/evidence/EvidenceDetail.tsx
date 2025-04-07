
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Image, 
  File,
  Trash2,
  Check,
  X,
  Calendar
} from "lucide-react";
import { Evidence } from '@/services/evidenceService';
import { format } from 'date-fns';
import { useDeleteEvidence, useUpdateEvidence } from '@/hooks/useEvidence';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';

interface EvidenceDetailProps {
  evidence: Evidence | null;
  isOpen: boolean;
  onClose: () => void;
}

const EvidenceDetail: React.FC<EvidenceDetailProps> = ({ evidence, isOpen, onClose }) => {
  const deleteEvidenceMutation = useDeleteEvidence();
  const updateEvidenceMutation = useUpdateEvidence();
  const { user } = useAuth();
  
  if (!evidence) return null;
  
  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <File className="h-16 w-16 text-muted-foreground" />;
    
    if (fileType.startsWith('image/')) {
      return <Image className="h-16 w-16 text-blue-500" />;
    }
    
    return <FileText className="h-16 w-16 text-orange-500" />;
  };
  
  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };
  
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this evidence? This action cannot be undone.")) {
      try {
        await deleteEvidenceMutation.mutateAsync(evidence.id);
        onClose();
      } catch (error) {
        console.error("Failed to delete evidence:", error);
      }
    }
  };
  
  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    try {
      await updateEvidenceMutation.mutateAsync({
        id: evidence.id,
        updates: { status }
      });
    } catch (error) {
      console.error(`Failed to ${status} evidence:`, error);
    }
  };

  const handleDownload = async () => {
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
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{evidence.title}</DialogTitle>
          <DialogDescription>
            Uploaded on {format(new Date(evidence.created_at), 'PPP')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center p-6 bg-secondary/30 rounded-lg">
            {getFileIcon(evidence.file_type)}
            <p className="mt-2 text-sm text-muted-foreground">
              {evidence.file_type || 'Unknown file type'} • {formatFileSize(evidence.file_size)}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={`
                ${evidence.status === 'approved' 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : evidence.status === 'rejected'
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }
              `}>
                {evidence.status.charAt(0).toUpperCase() + evidence.status.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(evidence.created_at), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          
          {evidence.description && (
            <div>
              <h4 className="text-sm font-medium mb-1">Description:</h4>
              <p className="text-sm text-muted-foreground">{evidence.description}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="grow" />
          {evidence.status === 'pending' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive"
                onClick={() => handleStatusUpdate('rejected')}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-success"
                onClick={() => handleStatusUpdate('approved')}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
          {evidence.file_path && (
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceDetail;
