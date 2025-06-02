import { useEffect, useState } from "react";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";
import { Login } from "@/components/Auth/LoginForm";
import { useLogin } from "@/components/Auth/Hooks/useLogin";
import { toast } from "@/hooks/use-toast";
import { EXPIRY } from "@/constants/constants";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (adminToken && tokenExpiry) {
      const now = new Date().getTime();
      if (now < parseInt(tokenExpiry)) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("tokenExpiry");
      }
    }
  }, []);

  const { mutate, isPending } = useLogin({
    options: {
      onSuccess: ({ user, message, token }) => {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminEmail", user.email);
        localStorage.setItem("tokenExpiry", String(EXPIRY));
        localStorage.setItem("user", JSON.stringify(user));

        setIsAuthenticated(true);

        toast({
          title: "Login Successful",
          description: message,
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Login Failed",
          description: error.response?.data.message || "An error occurred",
          variant: "destructive",
        });
      },
    },
  });

  const handleLogin = (userData: Login) => {
    mutate(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
  };

  const user: Login = localStorage.getItem("user") as unknown as Login;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {!isAuthenticated ? (
        <AuthForm loading={isPending} onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
