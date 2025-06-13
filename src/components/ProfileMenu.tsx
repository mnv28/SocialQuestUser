import { useState } from "react";
import { User as LucideUser, Settings, Key, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Login } from "./Auth/LoginForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAxios } from "@/utils/axios";
import { CHANGE_PASSWORD_ROUTE, DELETE_ACCOUNT_ROUTE } from "@/constants/routes";

interface ProfileMenuProps {
  user: Login;
  onLogout: () => void;
}

const ProfileMenu = ({ user, onLogout }: ProfileMenuProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const { toast } = useToast();
  const { axiosInstance } = useAxios();

  const handleChangePassword = async () => {
    setIsLoading(true);

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post(CHANGE_PASSWORD_ROUTE, {
        currentPassword,
        newPassword
      });

      if (data.success) {
        toast({
          title: "Success",
          description: "Password has been updated successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangePasswordOpen(false);
      } else {
        console.log(data.response.data.message);
        throw new Error(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password:', error.response.data.message);
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      // TODO: Replace with actual API call
      // const response = await api.updateProfile({
      //   fullName,
      //   email,
      // });

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      setIsProfileSettingsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: "Error",
        description: "Please enter your password to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.delete(DELETE_ACCOUNT_ROUTE, {
        data: {
          password: deletePassword
        }
      });

      if (data.success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        });
        onLogout();
      } else {
        throw new Error(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error.response?.data?.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeletePassword("");
      setIsDeleteAccountOpen(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-8 w-8 rounded-full"
        >
          <LucideUser className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Dialog
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Key className="mr-2 h-4 w-4" />
              <span>Change Password</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleChangePassword} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isProfileSettingsOpen}
          onOpenChange={setIsProfileSettingsOpen}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile Settings</DialogTitle>
              <DialogDescription>
                Update your profile information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={user?.fullName || ""}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Account</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers. Please enter your password to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="delete-password">Password</Label>
                <Input
                  id="delete-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password to confirm"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isLoading || !deletePassword}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
