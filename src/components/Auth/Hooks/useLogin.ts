import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AxiosErrorResponse } from "@/utils/shared-types";
import { LoginFormValues } from "../LoginForm";
import { LOGIN_ROUTE } from "@/constants/routes";
import { useAxios } from "@/utils/axios";

export type StatusEnum = "active" | "inactive" | "banned";
export type RoleEnum = "admin" | "user" | "moderator";

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: StatusEnum;
  status: RoleEnum;
  lastLoginDate: string;
  loginCount: number;
};

type LoginApiResponse = {
  user: User;
  success: boolean;
  message: string;
  token: string;
};

type UseLoginArgs = {
  options?: UseMutationOptions<
    LoginApiResponse,
    AxiosError<AxiosErrorResponse>,
    LoginFormValues
  >;
};

export const useLogin = ({ options }: UseLoginArgs) => {
  const { axiosInstance } = useAxios();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (fromValue) => {
      const { data } = await axiosInstance.post(`${LOGIN_ROUTE}`, fromValue);

      return data;
    },
    ...options,
  });
};
