
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useEvidence, useCreateEvidence, useUploadEvidenceFile } from '@/hooks/useEvidence';
import { FileUp, X, Download, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

const EvidenceUploader: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
  const { data: evidenceList, isLoading } = useEvidence();
  const createEvidenceMutation = useCreateEvidence();
  const uploadFileMutation = useUploadEvidenceFile();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };
  
  const handleUpload = async () => {
    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for the evidence",
        variant: "destructive"
      });
      return;
    }
    
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
        // Create evidence record
        await createEvidenceMutation.mutateAsync({
          title,
          description: description || null,
          file_path: filePath,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          status: 'pending'
        });
        
        // Reset form
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        
        toast({
          title: "Evidence uploaded",
          description: "Your evidence has been uploaded successfully"
        });
      }
    } catch (error) {
      console.error("Error uploading evidence:", error);
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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Evidence Management</h1>
      
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Upload New Evidence</CardTitle>
          <CardDescription>
            Upload supporting documents for your compliance tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Evidence title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about this evidence"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Upload File</Label>
              <div className="border-2 border-dashed rounded-md p-6">
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
                    <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
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
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? 'Uploading...' : 'Upload Evidence'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Evidence Library</CardTitle>
          <CardDescription>
            View and manage your uploaded evidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              ))}
            </div>
          ) : evidenceList && evidenceList.length > 0 ? (
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
                {evidenceList.map((evidence) => (
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
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No evidence uploaded yet. Use the form above to upload your first piece of evidence.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidenceUploader;
