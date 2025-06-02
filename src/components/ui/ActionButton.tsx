import { PropsWithChildren } from "react";
import { Button, ButtonProps } from "./button";
import { Spinner } from "./spinner";

type ActionButtonProps = ButtonProps &
  PropsWithChildren & {
    loading?: boolean;
  };

export const ActionButton = ({
  loading,
  children,
  ...props
}: ActionButtonProps) => {
  return <Button {...props}> {loading ? <Spinner /> : children}</Button>;
};
