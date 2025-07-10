import React from "react";
import { motion } from "framer-motion";
import { format, isToday, isPast, parseISO } from "date-fns";
import Card from "@/components/atoms/Card";
import TaskCheckbox from "@/components/molecules/TaskCheckbox";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import CategoryPill from "@/components/molecules/CategoryPill";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, onClick, onToggleComplete }) => {
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed;
  const isDueToday = task.dueDate && isToday(parseISO(task.dueDate));

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onToggleComplete();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "p-4 cursor-pointer transition-all duration-200 border-l-4",
          task.completed 
            ? "opacity-75 bg-gray-50 border-l-gray-300" 
            : "hover:shadow-lg card-shadow",
          isOverdue && !task.completed && "border-l-error bg-error/5",
          isDueToday && !task.completed && "border-l-accent bg-accent/5",
          !isOverdue && !isDueToday && !task.completed && "border-l-primary"
        )}
        onClick={onClick}
      >
        <div className="flex items-start space-x-4">
          <TaskCheckbox
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={cn(
                  "font-medium text-gray-900 mb-1",
                  task.completed && "line-through text-gray-500"
                )}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={cn(
                    "text-sm text-gray-600 mb-3 line-clamp-2",
                    task.completed && "text-gray-400"
                  )}>
                    {task.description}
                  </p>
                )}

                <div className="flex items-center space-x-2 mb-3">
                  <PriorityBadge priority={task.priority} />
                  <CategoryPill category={task.category} color="#5B4FE5" />
                </div>

                {task.dueDate && (
                  <div className={cn(
                    "flex items-center space-x-1 text-sm",
                    isOverdue && !task.completed && "text-error font-medium",
                    isDueToday && !task.completed && "text-accent font-medium",
                    !isOverdue && !isDueToday && "text-gray-500",
                    task.completed && "text-gray-400"
                  )}>
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    <span>
                      {isDueToday 
                        ? "Due today" 
                        : format(parseISO(task.dueDate), "MMM d, yyyy")
                      }
                    </span>
                    {isOverdue && !task.completed && (
                      <span className="text-error font-medium">• Overdue</span>
                    )}
                  </div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 ml-4"
              >
                <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;