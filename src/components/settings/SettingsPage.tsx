
import React from 'react';
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Building, 
  Bell, 
  Lock, 
  KeyRound, 
  Save,
  UserPlus,
  Trash2
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
    });
  };
  
  const handleSaveCompany = () => {
    toast({
      title: 'Company settings updated',
      description: 'Company information has been successfully updated.',
    });
  };
  
  const handleInviteUser = () => {
    toast({
      title: 'Invitation sent',
      description: 'An invitation has been sent to the new team member.',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-xl font-semibold">
                    SJ
                  </div>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG or GIF, max 2MB
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Sarah Johnson" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="sarah@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="CTO" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="America/Los_Angeles">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="company">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Company Information
              </CardTitle>
              <CardDescription>
                Update your company details and audit settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue="software">
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software">Software & Technology</SelectItem>
                      <SelectItem value="financial">Financial Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Select defaultValue="11-50">
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditType">SOC 2 Audit Type</Label>
                  <Select defaultValue="type1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select audit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditDate">Target Audit Date</Label>
                  <Input id="auditDate" type="date" defaultValue="2025-06-30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditor">Auditor Firm (Optional)</Label>
                  <Input id="auditor" placeholder="Enter auditor name" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveCompany}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage team access to your compliance platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Admin (You)' },
                  { name: 'Michael Chen', email: 'michael@example.com', role: 'Editor' },
                  { name: 'David Wilson', email: 'david@example.com', role: 'Viewer' },
                ].map((user, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <div className="bg-primary/20 text-primary h-full w-full flex items-center justify-center text-sm font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{user.role}</Badge>
                      {user.role !== 'Admin (You)' && (
                        <Button variant="ghost" size="icon">
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
                    <Input id="inviteEmail" type="email" placeholder="colleague@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inviteRole">Role</Label>
                    <Select defaultValue="editor">
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
                <Button onClick={handleInviteUser}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { id: 'taskNotify', label: 'Task Assignment Notifications', description: 'Receive notifications when you are assigned to a task' },
                  { id: 'evidenceNotify', label: 'Evidence Analysis Notifications', description: 'Get notified when AI analyzes uploaded evidence' },
                  { id: 'taskDueNotify', label: 'Task Due Date Reminders', description: 'Receive reminders about upcoming task deadlines' },
                  { id: 'weeklyDigest', label: 'Weekly Compliance Digest', description: 'Get a weekly summary of compliance progress' },
                  { id: 'riskAlerts', label: 'High Risk Alerts', description: 'Immediate notification of high-risk compliance issues' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id}>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch id={item.id} defaultChecked={item.id !== 'weeklyDigest'} />
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notification Settings</h3>
                <div className="space-y-2">
                  <Label htmlFor="emailFrequency">Email Frequency</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                      <SelectItem value="none">No Emails</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2 col-span-1"></div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button variant="outline">
                  Update Password
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="2fa" defaultChecked />
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm">
                    Two-factor authentication is enabled for your account. 
                    You will need to enter a code from your authenticator app when logging in.
                  </p>
                </div>
                <Button variant="outline">
                  Reconfigure 2FA
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Login Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                    <div>
                      <div className="font-medium">Current Session</div>
                      <div className="text-xs text-muted-foreground">
                        MacBook Pro • San Francisco, CA • Started 2 hours ago
                      </div>
                    </div>
                    <Badge>Active Now</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                    <div>
                      <div className="font-medium">iPhone 13</div>
                      <div className="text-xs text-muted-foreground">
                        iOS 16 • San Francisco, CA • Last active 2 days ago
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Log Out
                    </Button>
                  </div>
                </div>
                <Button variant="outline">
                  Log Out All Other Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage API keys for external integrations and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div>
                    <div className="font-medium">Production API Key</div>
                    <div className="text-xs text-muted-foreground">
                      Created on April 1, 2025 • Last used 2 days ago
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Show Key
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Create New API Key</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input id="keyName" placeholder="e.g., Development Key" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyPermissions">Permissions</Label>
                    <Select defaultValue="read">
                      <SelectTrigger>
                        <SelectValue placeholder="Select permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Read Only</SelectItem>
                        <SelectItem value="write">Read & Write</SelectItem>
                        <SelectItem value="admin">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyExpiry">Expiration (Optional)</Label>
                    <Input id="keyExpiry" type="date" />
                  </div>
                </div>
                <Button>
                  Generate API Key
                </Button>
              </div>
              
              <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                <h4 className="font-medium text-destructive mb-1">Important Security Notice</h4>
                <p className="text-sm">
                  API keys grant access to your compliance data. Never share your keys 
                  and revoke them immediately if compromised.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
