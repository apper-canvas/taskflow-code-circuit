import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = React.forwardRef(({ 
  label, 
  type = "text", 
  error, 
  className,
  children,
  ...props 
}, ref) => {
  const renderInput = () => {
    if (children) {
      return children;
    }
    
    switch (type) {
      case "textarea":
        return <Textarea ref={ref} {...props} />;
      case "select":
        return <Select ref={ref} {...props} />;
      default:
        return <Input ref={ref} type={type} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {renderInput()}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;