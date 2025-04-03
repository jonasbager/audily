
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  File, 
  AlertCircle,
  Bot,
  Download,
  X
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  aiLabel?: string;
  relatedTask?: string;
  controlReference?: string;
}

const mockEvidence: EvidenceFile[] = [
  {
    id: '1',
    name: 'password_policy_implementation.pdf',
    type: 'pdf',
    size: '1.2 MB',
    uploadDate: '2025-04-01',
    aiLabel: 'Password Policy Implementation',
    relatedTask: 'Implement Password Policy',
    controlReference: 'CC6.1',
  },
  {
    id: '2',
    name: 'mfa_config_screenshot.png',
    type: 'image',
    size: '0.8 MB',
    uploadDate: '2025-04-02',
    aiLabel: 'Multi-Factor Authentication Configuration',
    relatedTask: 'Configure MFA for Admin Accounts',
    controlReference: 'CC6.1, CC6.3',
  },
  {
    id: '3',
    name: 'employee_training_records_q1.xlsx',
    type: 'spreadsheet',
    size: '2.4 MB',
    uploadDate: '2025-03-15',
    aiLabel: 'Security Awareness Training Records',
    relatedTask: 'Conduct Security Training',
    controlReference: 'CC2.2',
  },
];

const EvidenceUploader: React.FC = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<EvidenceFile[]>(mockEvidence);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<EvidenceFile | null>(null);
  const [showFileDetail, setShowFileDetail] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Simulate upload
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Add the new file(s)
          const newFile: EvidenceFile = {
            id: `new-${Date.now()}`,
            name: selectedFiles[0].name,
            type: selectedFiles[0].type.split('/')[1] || 'document',
            size: `${(selectedFiles[0].size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split('T')[0],
            aiLabel: 'Analyzing...',
          };
          
          setFiles(prev => [newFile, ...prev]);
          
          // Simulate AI analysis
          setTimeout(() => {
            setFiles(prev => 
              prev.map(file => 
                file.id === newFile.id 
                  ? {
                      ...file,
                      aiLabel: 'Access Control Configuration',
                      relatedTask: 'Complete Access Control Matrix',
                      controlReference: 'CC6.3, CC6.1',
                    }
                  : file
              )
            );
            
            toast({
              title: 'File analyzed',
              description: 'AI has labeled and categorized your evidence',
            });
          }, 3000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    toast({
      title: 'Upload started',
      description: `Uploading ${selectedFiles[0].name}`,
    });
  };
  
  const handleFileDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    toast({
      title: 'File deleted',
      description: 'The file has been removed from your evidence',
    });
  };
  
  const handleFileView = (file: EvidenceFile) => {
    setSelectedFile(file);
    setShowFileDetail(true);
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-destructive" />;
      case 'image':
        return <File className="h-6 w-6 text-info" />;
      case 'spreadsheet':
        return <FileText className="h-6 w-6 text-success" />;
      default:
        return <File className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Evidence Repository</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Upload Evidence</CardTitle>
              <CardDescription>
                Upload files that demonstrate compliance with SOC 2 controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-md p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop files here or click to browse
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Label htmlFor="evidence-upload" className="cursor-pointer">
                        Select Files
                        <Input 
                          id="evidence-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          multiple
                        />
                      </Label>
                    </Button>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Supported formats: PDF, DOCX, XLSX, PNG, JPG</p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-shadow mt-6">
            <CardHeader>
              <CardTitle>Uploaded Evidence</CardTitle>
              <CardDescription>
                {files.length} files in your evidence repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[460px]">
                <div className="space-y-4">
                  {files.map(file => (
                    <div 
                      key={file.id} 
                      className="flex items-start justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {file.size} • Uploaded on {file.uploadDate}
                          </div>
                          {file.aiLabel && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                <Bot className="h-3 w-3 mr-1" />
                                {file.aiLabel}
                              </Badge>
                              {file.controlReference && (
                                <Badge variant="secondary" className="text-xs">
                                  {file.controlReference}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleFileView(file)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleFileDelete(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {files.length === 0 && (
                    <div className="text-center p-6">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">No evidence files yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="card-shadow sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Evidence Analysis
              </CardTitle>
              <CardDescription>
                Our AI helps you categorize and link evidence to SOC 2 controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-medium mb-2">How It Works</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">1</span>
                    <span>Upload your evidence files</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">2</span>
                    <span>Our AI analyzes the content</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">3</span>
                    <span>Files are automatically labeled</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">4</span>
                    <span>Evidence is linked to relevant controls</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Evidence Suggestions</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your SOC 2 checklist, consider uploading:
                </p>
                <ul className="text-sm space-y-3">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>Access control matrix for all systems</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>Backup and recovery test results</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>Vulnerability scan reports</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                View Evidence Guide
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Dialog open={showFileDetail} onOpenChange={setShowFileDetail}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
            <DialogDescription>
              Uploaded on {selectedFile?.uploadDate}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 border rounded-md p-4 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">File preview not available</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">AI Analysis</h3>
                <div className="bg-primary/10 p-3 rounded-md">
                  <p className="text-sm">
                    This document appears to be {selectedFile?.aiLabel}. It demonstrates compliance with {selectedFile?.controlReference} controls.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Linked Task</h3>
                <Badge>{selectedFile?.relatedTask}</Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">SOC 2 Controls</h3>
                <div className="space-y-2">
                  {selectedFile?.controlReference?.split(', ').map(control => (
                    <Badge key={control} variant="outline">{control}</Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">File Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{selectedFile?.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{selectedFile?.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span>{selectedFile?.uploadDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvidenceUploader;
