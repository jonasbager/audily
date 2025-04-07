
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCreateEvidence, useUploadEvidenceFile } from '@/hooks/useEvidence';

interface TaskEvidenceUploaderProps {
  taskId: string;
  onClose: () => void;
}

const TaskEvidenceUploader: React.FC<TaskEvidenceUploaderProps> = ({ taskId, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const createEvidenceMutation = useCreateEvidence();
  const uploadFileMutation = useUploadEvidenceFile();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload file to storage
      const filePath = await uploadFileMutation.mutateAsync(selectedFile);
      
      if (filePath) {
        // Create evidence record linked to the task
        await createEvidenceMutation.mutateAsync({
          task_id: taskId,
          title: `Evidence for Task: ${selectedFile.name}`,
          description: "Uploaded as task evidence",
          file_path: filePath,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          status: 'pending'
        });
        
        toast({
          title: "Evidence uploaded",
          description: "Your evidence has been uploaded successfully"
        });
        
        onClose();
      }
    } catch (error) {
      console.error("Error uploading evidence:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your evidence",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };
  
  return (
    <div className="grid w-full items-center gap-4">
      <Label>Upload Evidence File</Label>
      <div className="border-2 border-dashed rounded-md p-8">
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop a file here or click to browse
            </p>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select File
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Supported formats: PDF, DOCX, PNG, JPG, XLSX
      </p>
      
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? 'Uploading...' : 'Upload Evidence'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TaskEvidenceUploader;
