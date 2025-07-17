import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import { useTasks } from "@/hooks/useTasks";
import ApperIcon from "@/components/ApperIcon";

const AllTasksPage = () => {
  const { searchTerm } = useOutletContext();
  const { tasks, loading, error, toggleComplete, updateTask, deleteTask, refetch } = useTasks("all");

const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter(task => 
      (task.title_c || task.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description_c || task.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.category_c?.Name || task.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="List" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Clock" className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Clock" className="h-5 w-5 mr-2 text-accent" />
            Pending Tasks ({pendingTasks.length})
          </h2>
          <TaskList
            tasks={pendingTasks}
            loading={loading}
            error={error}
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onRetry={refetch}
            emptyMessage="No pending tasks"
            emptyDescription="All tasks are completed! Great job."
          />
        </motion.div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="CheckCircle" className="h-5 w-5 mr-2 text-success" />
            Completed Tasks ({completedTasks.length})
          </h2>
          <TaskList
            tasks={completedTasks}
            loading={false}
            error=""
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onRetry={refetch}
            emptyMessage="No completed tasks"
            emptyDescription="Complete some tasks to see them here."
          />
        </motion.div>
      )}

      {/* Show empty state when no tasks at all */}
      {!loading && !error && filteredTasks.length === 0 && (
        <TaskList
          tasks={[]}
          loading={loading}
          error={error}
          onToggleComplete={toggleComplete}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onRetry={refetch}
          emptyMessage={searchTerm ? "No tasks match your search" : "No tasks found"}
          emptyDescription={searchTerm ? "Try adjusting your search terms" : "Create your first task to get started"}
        />
      )}
    </div>
  );
};

export default AllTasksPage;