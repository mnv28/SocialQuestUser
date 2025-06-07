import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Lock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { TextField } from "../ui/TextField";
import { ActionButton } from "../ui/ActionButton";

export type Login = {
  email: string;
  fullName?: string;
  status?: string;
};

interface LoginFormProps {
  onLogin: (userData: LoginFormValues) => void;
  setIsForgotPasswordOpen: (isOpen: boolean) => void;
  loading?: boolean;
}

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nullable()
    .refine((value) => !!value, {
      message: "Email is required",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .nullable()
    .refine((value) => !!value, {
      message: "Password is required",
    }),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

export const LoginForm = ({
  setIsForgotPasswordOpen,
  onLogin,
  loading = false,
}: LoginFormProps) => {
  const {
    control,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: null,
      password: null,
    },
    mode: "all",
  });

  const onClickLogin = handleSubmit(({ email, password }) => {
    onLogin({ email, password });
  });

  return (
    <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-orange-500" />
          Welcome Back
        </CardTitle>
        <CardDescription>Sign in to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextField
          type="email"
          placeholder="Enter your email"
          control={control}
          label="Email"
          error={!!errors.email?.message}
          name="email"
          className="pl-10 pr-10"
          errorMessage={errors.email?.message}
          startIcon={Mail}
          required
        />

        <TextField
          placeholder="Enter your password"
          className="pl-10 pr-10"
          startIcon={Lock}
          label="Password"
          name="password"
          type="password"
          error={!!errors.password?.message}
          errorMessage={errors.password?.message}
          control={control}
          required
        />

        <button
          type="button"
          onClick={() => setIsForgotPasswordOpen(true)}
          className="mt-1 text-sm text-orange-600 hover:text-orange-500"
        >
          Forgot your password?
        </button>
      </CardContent>
      <CardFooter>
        <ActionButton
          onClick={onClickLogin}
          loading={loading}
          disabled={loading || !isValid || !isDirty}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
        >
          Sign In
        </ActionButton>
      </CardFooter>
    </Card>
  );
};
