import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import CategoryPill from "@/components/molecules/CategoryPill";
import ApperIcon from "@/components/ApperIcon";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/utils/cn";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task = null, 
  onCreateTask = null, 
  onUpdateTask = null, 
  onDeleteTask = null,
  mode = "create" // "create" or "edit"
}) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "Personal",
    dueDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task && mode === "edit") {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        category: task.category || "Personal",
        dueDate: task.dueDate || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "Personal",
        dueDate: ""
      });
    }
  }, [task, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      if (mode === "create" && onCreateTask) {
        await onCreateTask(formData);
      } else if (mode === "edit" && onUpdateTask && task) {
        await onUpdateTask(task.Id, formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !onDeleteTask) return;
    
    setIsSubmitting(true);
    try {
      await onDeleteTask(task.Id);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900">
                {mode === "create" ? "Create New Task" : "Edit Task"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Task Info (Edit Mode) */}
            {mode === "edit" && task && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <PriorityBadge priority={task.priority} />
                  <CategoryPill category={task.category} color="#5B4FE5" />
                </div>
                {task.dueDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    <span>Due: {format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
                  </div>
                )}
                {task.completed && (
                  <div className="flex items-center space-x-2 text-sm text-success mt-2">
                    <ApperIcon name="CheckCircle" className="h-4 w-4" />
                    <span>Completed on {format(parseISO(task.completedAt), "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Task Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter task title..."
                required
              />

              <FormField
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Add task description..."
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Priority"
                  type="select"
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </FormField>

                <FormField
                  label="Category"
                  type="select"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.Id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </FormField>
              </div>

              <FormField
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                {mode === "edit" && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                )}
                
                <div className="flex items-center space-x-3 ml-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.title.trim()}
                    className="flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" className="h-4 w-4" />
                        <span>{mode === "create" ? "Create Task" : "Update Task"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;