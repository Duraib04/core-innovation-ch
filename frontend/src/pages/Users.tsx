import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, UserPlus, Shield, User, Mail, Phone } from 'lucide-react';

export default function Users() {
  const { user, users, isAdmin, updateUser, addUser, deleteUser } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    contactDetails: '',
    role: 'user' as 'admin' | 'user',
  });

  const handleAccessDenied = () => {
    toast.error('Access Denied', {
      description: 'You do not have permission to perform this action',
      className: 'bg-destructive text-destructive-foreground',
    });
  };

  const handleEdit = (userToEdit: any) => {
    if (!isAdmin() && user?.id !== userToEdit.id) {
      handleAccessDenied();
      return;
    }
    setSelectedUser(userToEdit);
    setFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      password: userToEdit.password,
      contactDetails: userToEdit.contactDetails || '',
      role: userToEdit.role,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!isAdmin() && user?.id !== selectedUser?.id) {
      handleAccessDenied();
      return;
    }

    // Non-admin users can only edit their own contact details
    if (!isAdmin()) {
      const updates = { contactDetails: formData.contactDetails };
      const success = await updateUser(selectedUser.id, updates);
      if (success) {
        toast.success('Profile updated successfully');
        setEditDialogOpen(false);
      }
      return;
    }

    // Admin can update everything
    const success = await updateUser(selectedUser.id, formData);
    if (success) {
      toast.success('User updated successfully');
      setEditDialogOpen(false);
    } else {
      toast.error('Failed to update user');
    }
  };

  const handleAddUser = () => {
    if (!isAdmin()) {
      handleAccessDenied();
      return;
    }
    setFormData({
      username: '',
      email: '',
      password: '',
      contactDetails: '',
      role: 'user',
    });
    setAddDialogOpen(true);
  };

  const handleSaveNewUser = async () => {
    if (!isAdmin()) {
      handleAccessDenied();
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const success = await addUser(formData);
    if (success) {
      toast.success('User added successfully');
      setAddDialogOpen(false);
    } else {
      toast.error('Failed to add user');
    }
  };

  const handleDeleteClick = (userToDelete: any) => {
    if (!isAdmin()) {
      handleAccessDenied();
      return;
    }
    if (userToDelete.id === '1') {
      toast.error('Cannot delete main administrator');
      return;
    }
    setSelectedUser(userToDelete);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteUser(selectedUser.id);
    if (success) {
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
    } else {
      toast.error('Failed to delete user');
    }
  };

  // Sort users: Admin first, then others
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    return 0;
  });

  return (
    <div className="container mx-auto p-2 sm:p-2 lg:p-3 space-y-3 sm:space-y-3 lg:space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <Button
          onClick={handleAddUser}
          className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((u) => (
                <TableRow key={u.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={u.profileImage} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {u.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{u.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {u.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-muted-foreground">••••••••</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {u.contactDetails ? (
                        <>
                          <Phone className="w-4 h-4" />
                          {u.contactDetails}
                        </>
                      ) : (
                        <span className="text-muted-foreground/50">Not set</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === 'admin' ? 'default' : 'secondary'}
                      className={
                        u.role === 'admin'
                          ? 'bg-gradient-primary text-primary-foreground'
                          : ''
                      }
                    >
                      {u.role === 'admin' ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : (
                        <User className="w-3 h-3 mr-1" />
                      )}
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(u)}
                        className="hover:bg-accent/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(u)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              {isAdmin()
                ? 'Update user information and permissions'
                : 'You can only update your contact details'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={!isAdmin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isAdmin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={!isAdmin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact Details</Label>
              <Input
                id="edit-contact"
                value={formData.contactDetails}
                onChange={(e) =>
                  setFormData({ ...formData, contactDetails: e.target.value })
                }
                placeholder="Phone number or other contact info"
              />
            </div>
            {isAdmin() && (
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'admin' | 'user',
                    })
                  }
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-gradient-primary">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specified permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-contact">Contact Details</Label>
              <Input
                id="new-contact"
                value={formData.contactDetails}
                onChange={(e) =>
                  setFormData({ ...formData, contactDetails: e.target.value })
                }
                placeholder="Phone number or other contact info"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Role</Label>
              <select
                id="new-role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as 'admin' | 'user',
                  })
                }
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewUser} className="bg-gradient-primary">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account for <strong>{selectedUser?.username}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
