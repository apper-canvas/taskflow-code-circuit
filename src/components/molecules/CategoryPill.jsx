import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const CategoryPill = ({ category, color, className, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
        "border border-transparent hover:shadow-md",
        className
      )}
      style={{
        backgroundColor: color ? `${color}15` : "#F3F4F6",
        borderColor: color ? `${color}30` : "#E5E7EB",
        color: color || "#6B7280"
      }}
    >
      <div 
        className="w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: color || "#6B7280" }}
      />
      {category}
    </motion.button>
  );
};

export default CategoryPill;