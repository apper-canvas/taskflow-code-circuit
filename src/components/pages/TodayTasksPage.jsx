import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import { useTasks } from "@/hooks/useTasks";
import ApperIcon from "@/components/ApperIcon";

const TodayTasksPage = () => {
  const { searchTerm } = useOutletContext();
  const { tasks, loading, error, toggleComplete, updateTask, deleteTask, refetch } = useTasks("today");

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  const completionRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display mb-2">Today's Progress</h2>
            <p className="text-white/90">
              {completedTasks.length} of {tasks.length} tasks completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold mb-1">{completionRate}%</div>
            <div className="text-sm text-white/80">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-white rounded-full h-2"
          />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Clock" className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Today</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="AlertCircle" className="h-5 w-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sm:col-span-1 col-span-2">
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
      </motion.div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Target" className="h-5 w-5 mr-2 text-primary" />
            Focus on Today ({pendingTasks.length})
          </h2>
          <TaskList
            tasks={pendingTasks}
            loading={loading}
            error={error}
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onRetry={refetch}
            emptyMessage="No pending tasks for today"
            emptyDescription="You're all caught up! Take a break or plan for tomorrow."
          />
        </motion.div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Trophy" className="h-5 w-5 mr-2 text-success" />
            Completed Today ({completedTasks.length})
          </h2>
          <TaskList
            tasks={completedTasks}
            loading={false}
            error=""
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onRetry={refetch}
            emptyMessage="No completed tasks today"
            emptyDescription="Complete some tasks to see your achievements here."
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
          emptyMessage={searchTerm ? "No tasks match your search" : "No tasks due today"}
          emptyDescription={searchTerm ? "Try adjusting your search terms" : "Great! You have no tasks due today. Take a break or plan ahead."}
        />
      )}
    </div>
  );
};

export default TodayTasksPage;