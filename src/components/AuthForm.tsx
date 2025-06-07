import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Login, LoginForm } from "./Auth/LoginForm";
import { SignUpForm } from "./Auth/SignUpForm";
import { TextField } from "./ui/TextField";
import { useForm } from "react-hook-form";

interface AuthFormProps {
  onLogin: (userData: Login) => void;
  loading?: boolean;
}

const AuthForm = ({ onLogin, loading }: AuthFormProps) => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { control, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // Add your password reset logic here
      toast({
        title: "Reset Instructions Sent",
        description: "Please check your email for password reset instructions.",
      });
      setIsForgotPasswordOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset instructions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.webp" 
              alt="Social Quest" 
              className="h-16 w-auto"
            />
          </div>
          {/* <p className="text-orange-600 mt-2 font-medium">Your Social Media Analytics Platform</p> */}
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-orange-50">
            <TabsTrigger value="login" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm setIsForgotPasswordOpen={setIsForgotPasswordOpen} loading={loading} onLogin={onLogin} />
          </TabsContent>

          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>

        <Dialog
          open={isForgotPasswordOpen}
          onOpenChange={setIsForgotPasswordOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your email address and we'll send you instructions to
                reset your password.
              </DialogDescription>
            </DialogHeader>

            <TextField
              type="email"
              placeholder="Enter your email"
              control={control}
              label="Email"
              name="email"
              className="pl-10 pr-10"
            />
            <DialogFooter>
              <Button 
                onClick={handleForgotPassword} 
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AuthForm;
