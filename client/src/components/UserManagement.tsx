import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { UserPlus, Trash2, Camera, Check } from "lucide-react";

interface User {
  id: string;
  name: string;
  photo?: string;
  createdAt: string;
}

interface UserManagementProps {
  users: User[];
  currentUserId: string | null;
  onAddUser: (name: string, photo?: string) => void;
  onSwitchUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UserManagement({
  users,
  currentUserId,
  onAddUser,
  onSwitchUser,
  onDeleteUser,
}: UserManagementProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserPhoto, setNewUserPhoto] = useState<string | undefined>();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      onAddUser(newUserName.trim(), newUserPhoto);
      setNewUserName("");
      setNewUserPhoto(undefined);
      setAddDialogOpen(false);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      onDeleteUser(selectedUserId);
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Users</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAddDialogOpen(true)}
          className="gap-2"
          data-testid="button-add-user"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card className="divide-y">
        {users.map((user) => (
          <div key={user.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => onSwitchUser(user.id)}
                data-testid={`button-switch-user-${user.id}`}
              >
                <Avatar className="h-10 w-10">
                  {user.photo ? (
                    <AvatarImage src={user.photo} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium" data-testid={`text-user-name-${user.id}`}>
                      {user.name}
                    </p>
                    {user.id === currentUserId && (
                      <Badge variant="default" className="gap-1">
                        <Check className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {users.length > 1 && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleDeleteClick(user.id)}
                  data-testid={`button-delete-user-${user.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </Card>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user profile to track separate study sessions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  {newUserPhoto ? (
                    <AvatarImage src={newUserPhoto} alt="New user" />
                  ) : (
                    <AvatarFallback className="text-xl">
                      {newUserName.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label
                  htmlFor="new-user-photo"
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover-elevate"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <input
                    id="new-user-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    data-testid="input-new-user-photo"
                  />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="new-user-name">Name</Label>
              <Input
                id="new-user-name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter name"
                required
                data-testid="input-new-user-name"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddDialogOpen(false);
                  setNewUserName("");
                  setNewUserPhoto(undefined);
                }}
                className="flex-1"
                data-testid="button-cancel-add-user"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-confirm-add-user">
                Add User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedUser?.name}"? This will
              permanently remove this user and all their study sessions. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-user">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-user"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
