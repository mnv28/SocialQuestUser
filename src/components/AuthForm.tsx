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
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { toast } = useToast();

  const { control } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Success",
        description:
          "Password reset instructions have been sent to your email.",
      });
      setIsLoading(false);
      setIsForgotPasswordOpen(false);
      setResetEmail("");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Hub
          </h1>
          <p className="text-slate-600 mt-2">Your gateway to data insights</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
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
              <Button onClick={handleForgotPassword} disabled={isLoading}>
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
