
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  UserPlus, 
  Trash2, 
  Mail,
  Settings,
  UserCog,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTeamMembers, useInviteTeamMember, useUpdateTeamMember, useRemoveTeamMember } from '@/hooks/useTeamMembers';
import { TeamMember } from '@/services/teamMemberService';
import { Skeleton } from '@/components/ui/skeleton';

const TeamMembers: React.FC = () => {
  const { toast } = useToast();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [inviteName, setInviteName] = useState('');
  
  const { data: members, isLoading, error } = useTeamMembers();
  const inviteMutation = useInviteTeamMember();
  const updateMutation = useUpdateTeamMember();
  const removeMutation = useRemoveTeamMember();
  
  const handleInvite = () => {
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Missing information",
        description: "Please provide both email and role",
        variant: "destructive"
      });
      return;
    }
    
    inviteMutation.mutate({
      email: inviteEmail,
      role: inviteRole,
      name: inviteName
    }, {
      onSuccess: () => {
        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${inviteEmail}`
        });
        setInviteEmail('');
        setInviteRole('viewer');
        setInviteName('');
        setIsInviteDialogOpen(false);
      }
    });
  };
  
  const handleUpdateRole = (memberId: string, newRole: string) => {
    updateMutation.mutate({
      id: memberId,
      updates: { role: newRole }
    }, {
      onSuccess: () => {
        toast({
          title: "Role updated",
          description: "Team member role has been updated"
        });
      }
    });
  };
  
  const handleRemoveMember = (memberId: string) => {
    removeMutation.mutate(memberId, {
      onSuccess: () => {
        toast({
          title: "Member removed",
          description: "Team member has been removed"
        });
      }
    });
  };
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'editor':
        return 'secondary';
      case 'viewer':
      default:
        return 'outline';
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Team Members</h1>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error loading the team members. Please try again later.</p>
            <Button variant="outline" className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your compliance platform team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="inviteName">Name (Optional)</Label>
                <Input 
                  id="inviteName" 
                  placeholder="Enter colleague's name" 
                  value={inviteName} 
                  onChange={(e) => setInviteName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email Address *</Label>
                <Input 
                  id="inviteEmail" 
                  type="email" 
                  placeholder="colleague@example.com" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteRole">Role *</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Admin:</strong> Full access to all features<br />
                  <strong>Editor:</strong> Can edit policies and tasks<br />
                  <strong>Viewer:</strong> View-only access
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={inviteMutation.isPending || !inviteEmail}>
                {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Team Management
          </CardTitle>
          <CardDescription>
            Manage team access and permissions for your compliance platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members?.length ? members.map((member) => (
              <div 
                key={member.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <div className="bg-primary/20 text-primary h-full w-full flex items-center justify-center text-sm font-semibold">
                      {member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase() : member.email.substring(0, 2).toUpperCase()}
                    </div>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name || 'Invited User'}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(member.role)}>{member.role}</Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Team Member</DialogTitle>
                        <DialogDescription>
                          Update role and permissions for {member.name || member.email}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="space-y-2">
                          <Label htmlFor={`role-${member.id}`}>Role</Label>
                          <Select 
                            defaultValue={member.role} 
                            onValueChange={(value) => handleUpdateRole(member.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="destructive" onClick={() => handleRemoveMember(member.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Member
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't added any team members yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Your First Team Member
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMembers;
