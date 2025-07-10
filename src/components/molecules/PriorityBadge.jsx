import React from "react";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const PriorityBadge = ({ priority, className }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "urgent":
        return { 
          variant: "urgent", 
          text: "Urgent", 
          className: "priority-urgent" 
        };
      case "high":
        return { 
          variant: "high", 
          text: "High", 
          className: "" 
        };
      case "medium":
        return { 
          variant: "medium", 
          text: "Medium", 
          className: "" 
        };
      case "low":
        return { 
          variant: "low", 
          text: "Low", 
          className: "" 
        };
      default:
        return { 
          variant: "default", 
          text: "Normal", 
          className: "" 
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge 
        variant={config.variant} 
        className={cn(config.className, className)}
      >
        {config.text}
      </Badge>
    </motion.div>
  );
};

export default PriorityBadge;