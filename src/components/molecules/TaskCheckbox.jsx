import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const TaskCheckbox = ({ checked, onChange, className }) => {
  return (
    <motion.div
      className={cn("flex items-center", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="task-checkbox"
      />
    </motion.div>
  );
};

export default TaskCheckbox;