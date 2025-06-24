import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    // These would typically come from the reset link (query params)
    const iv = searchParams.get("iv") || "";
    const content = searchParams.get("content") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
            return;
        }
        if (password !== confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/auth/resetpassword`, {
                iv,
                content,
                newPassword:password,
            });
            toast({ title: "Success", description: "Password reset successfully!" });
            navigate("/");
        } catch (error) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to reset password.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-8 rounded shadow bg-white"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
            >
                <h2 className="text-2xl font-bold mb-4 text-orange-600 text-center">Reset Password</h2>
                <p className="mb-6 text-center text-gray-600">
                    Enter your new password below.
                </p>
                <div className="mb-4">
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <Input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={loading}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </div>
    );
};

export default ResetPassword;
