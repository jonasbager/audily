
import React, { useState } from 'react';
import { useTeamMembers, useInviteTeamMember, useRemoveTeamMember } from '@/hooks/useTeamMembers';
import { TeamMemberInput } from '@/services/teamMemberService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const TeamMembers: React.FC = () => {
  const { user } = useAuth();
  const { data: teamMembers, isLoading, error } = useTeamMembers();
  const { mutate: inviteTeamMember } = useInviteTeamMember();
  const { mutate: removeTeamMember } = useRemoveTeamMember();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [name, setName] = useState('');

  const handleInviteTeamMember = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please provide an email address for the team member",
        variant: "destructive"
      });
      return;
    }

    const newMember: TeamMemberInput = {
      email,
      role,
      name: name || null
    };

    inviteTeamMember(newMember, {
      onSuccess: () => {
        setEmail('');
        setRole('viewer');
        setName('');
      }
    });
  };

  const handleRemoveMember = (id: string) => {
    removeTeamMember(id);
  };

  const getInitials = (name: string | null, email: string): string => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    } else {
      return email.substring(0, 2).toUpperCase();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Loading team members...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Error loading team data. Please try again.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Team Members
        </CardTitle>
        <CardDescription>
          Manage team access to your compliance platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {teamMembers?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {getInitials(member.name, member.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name || member.email}</div>
                  <div className="text-xs text-muted-foreground">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.status === 'active' ? "outline" : "secondary"}>{member.role}</Badge>
                <Badge variant="outline">{member.status}</Badge>
                {member.invited_by === user?.id && member.user_id !== user?.id && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Invite New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input 
                id="inviteEmail" 
                type="email" 
                placeholder="colleague@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value)}>
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
            <div className="space-y-2 col-span-2">
              <Label htmlFor="inviteName">Name (Optional)</Label>
              <Input 
                id="inviteName" 
                placeholder="Team Member Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleInviteTeamMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
