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
import { useSignUp } from "./Hooks/useSignUp";
import { toast } from "@/hooks/use-toast";
import { ActionButton } from "../ui/ActionButton";

export type User = {
  id: string | number;
  email: string;
  name: string;
};

export const SignUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" })
      .nullable()
      .refine((value) => !!value, {
        message: "Full name is required",
      }),
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
    confirmPassword: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "Confirm Password is required",
      }),
      role:z.enum(["admin", "user"]).default("user"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type SignUpFormValues = z.infer<typeof SignUpSchema>;

export const SignUpForm = () => {
  const {
    control,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: null,
      password: null,
      fullName: null,
      confirmPassword: null,
      role: "user",
    },
    mode: "all",
  });

  const { mutate, isPending } = useSignUp({
    options: {
      onSuccess: (data) => {
        toast({
          title: "Account Created",
          description: data.message,
          variant: "default",
        });

        reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      },
    },
  });

  const onSubmit = handleSubmit((formValues) => {
    mutate(formValues);
  });

  return (
    <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-orange-500" />
          Create Account
        </CardTitle>
        <CardDescription>Join us to start exploring your data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextField
          required
          placeholder="Enter your full name"
          control={control}
          label="Full Name"
          name="fullName"
          className="pl-10 pr-10"
          startIcon={Mail}
          error={!!errors.fullName?.message}
          errorMessage={errors.fullName?.message}
        />

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
          placeholder="Create a password"
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

        <TextField
          placeholder="Confirm your password"
          className="pl-10 pr-10"
          startIcon={Lock}
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          error={!!errors.confirmPassword?.message}
          errorMessage={errors.confirmPassword?.message}
          control={control}
          required
        />
      </CardContent>
      <CardFooter>
        <ActionButton
          onClick={onSubmit}
          loading={isPending}
          disabled={isPending || !isValid || !isDirty}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
        >
          Create Account
        </ActionButton>
      </CardFooter>
    </Card>
  );
};
