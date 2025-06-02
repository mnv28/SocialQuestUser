import { ReactNode } from "react";

export type AxiosErrorResponse = {
  success: boolean;
  message: string;
};

export type AxiosSucessApiResponse = {
  success: boolean;
  message: string;
};

export type DialogTypes = Partial<"add" | "edit">;

export type DialogRenderer = { [key in DialogTypes]?: ReactNode };
