import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { ErrorMessage } from "./TextField";
import { SelectProps } from "@radix-ui/react-select";

export type OptionType = {
  label: string;
  value: string;
};

export type AutoCompleteProps<P extends FieldValues> = UseControllerProps<P> &
  SelectProps & {
    label?: string;
    loading?: boolean;
    rows?: number;
    isCapitalize?: boolean;
    isTrimStartDisabled?: boolean;
    error?: boolean;
    errorMessage?: ErrorMessage;
    options: OptionType[];
    placeholder?: string;
  };

export const Autocomplete = <P extends FieldValues>({
  control,
  name,
  defaultValue,
  label = "",
  rules,
  errorMessage,
  placeholder,
  error = false,
  options,
  required,
  ...selectFieldProps
}: AutoCompleteProps<P>) => {
  const {
    field: { onChange, value, ...restField },
  } = useController({ name, control, defaultValue, rules });

  return (
    <div className="flex flex-col gap-3 ">
      {label && (
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <Select
        value={value}
        onValueChange={onChange}
        {...restField}
        {...selectFieldProps}
      >
        <SelectTrigger
          className={
            error
              ? "border-red-300 focus:ring-red-500 focus:ring-offset-2 focus-visible:outline-red-500 "
              : ""
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errorMessage && (
        <span className=" font-medium text-sm text-red-800 ">
          {String(errorMessage)}
        </span>
      )}
    </div>
  );
};
