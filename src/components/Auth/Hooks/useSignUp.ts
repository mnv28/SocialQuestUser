import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AxiosErrorResponse } from "@/utils/shared-types";
import { SIGN_UP_ROUTE } from "@/constants/routes";
import { useAxios } from "@/utils/axios";
import { SignUpFormValues } from "../SignUpForm";

export type UserPayload = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
};

type SignUpApiResponse = {
  user: UserPayload;
  success: boolean;
  message: string;
};

type UseLoginArgs = {
  options?: UseMutationOptions<
    SignUpApiResponse,
    AxiosError<AxiosErrorResponse>,
    Partial<SignUpFormValues>
  >;
};

export const useSignUp = ({ options }: UseLoginArgs) => {
  const { axiosInstance } = useAxios();
  return useMutation({
    mutationKey: ["sing-up"],
    mutationFn: async (fromValue) => {
      const { data } = await axiosInstance.post(`${SIGN_UP_ROUTE}`, fromValue);

      return data;
    },
    ...options,
  });
};
