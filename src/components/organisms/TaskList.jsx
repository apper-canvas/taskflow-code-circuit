import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const TaskList = ({ 
  tasks, 
  loading, 
  error, 
  onToggleComplete, 
  onUpdateTask, 
  onDeleteTask,
  onRetry,
  emptyMessage = "No tasks found",
  emptyDescription = "Create your first task to get started"
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await onUpdateTask(taskId, taskData);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await onDeleteTask(taskId);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (tasks.length === 0) {
    return (
      <Empty
        message={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
{tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <TaskCard
              task={task}
              onClick={() => handleTaskClick(task)}
              onToggleComplete={() => onToggleComplete(task.Id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        mode="edit"
      />
    </div>
  );
};

export default TaskList;