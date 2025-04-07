
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { File, FileText, Image, MoreHorizontal } from 'lucide-react';
import { useEvidence } from '@/hooks/useEvidence';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardRecentEvidence: React.FC = () => {
  const { data: evidenceList, isLoading } = useEvidence();
  
  // Get the 5 most recent evidence items
  const recentEvidence = React.useMemo(() => {
    if (!evidenceList) return [];
    
    return [...evidenceList]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [evidenceList]);
  
  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <File className="h-8 w-8 text-muted-foreground" />;
    
    if (fileType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    
    return <FileText className="h-8 w-8 text-orange-500" />;
  };
  
  return (
    <Card className="card-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>Recent Evidence</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recentEvidence.length > 0 ? (
          <div className="space-y-4">
            {recentEvidence.map((evidence) => (
              <div key={evidence.id} className="flex items-start gap-3">
                {getFileIcon(evidence.file_type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{evidence.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(evidence.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${evidence.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : evidence.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }
                `}>
                  {evidence.status.charAt(0).toUpperCase() + evidence.status.slice(1)}
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/evidence">View All Evidence</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No evidence uploaded yet.</p>
            <Link to="/evidence" className="text-sm text-primary hover:underline mt-2 inline-block">
              Upload your first evidence
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardRecentEvidence;
