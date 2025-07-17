import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import TaskList from "@/components/organisms/TaskList";
import { useTasks } from "@/hooks/useTasks";
import ApperIcon from "@/components/ApperIcon";

const CompletedTasksPage = () => {
  const { searchTerm } = useOutletContext();
  const { tasks, loading, error, toggleComplete, updateTask, deleteTask, refetch } = useTasks("completed");

const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter(task => 
      (task.title_c || task.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description_c || task.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.category_c?.Name || task.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const thisWeekTasks = filteredTasks.filter(task => {
    if (!task.completedAt) return false;
    const completedDate = parseISO(task.completedAt);
    return isWithinInterval(completedDate, { start: weekStart, end: weekEnd });
  });

  const earlierTasks = filteredTasks.filter(task => {
    if (!task.completedAt) return false;
    const completedDate = parseISO(task.completedAt);
    return !isWithinInterval(completedDate, { start: weekStart, end: weekEnd });
  });

  const totalTasks = filteredTasks.length;
  const categoryStats = filteredTasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryStats).reduce((max, [category, count]) => 
    count > max.count ? { category, count } : max, { category: "None", count: 0 }
  );

  return (
    <div className="space-y-8">
      {/* Achievement Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-success to-emerald-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display mb-2">Your Achievements</h2>
            <p className="text-white/90">
              {totalTasks} tasks completed • Keep up the great work!
            </p>
          </div>
          <div className="text-right">
            <ApperIcon name="Trophy" className="h-12 w-12 text-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Completed</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Calendar" className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{thisWeekTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Star" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Top Category</p>
              <p className="text-lg font-bold text-gray-900">{topCategory.category}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* This Week's Completed Tasks */}
      {thisWeekTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Calendar" className="h-5 w-5 mr-2 text-info" />
            This Week ({thisWeekTasks.length})
          </h2>
          <TaskList
            tasks={thisWeekTasks}
            loading={false}
            error=""
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onRetry={refetch}
            emptyMessage="No tasks completed this week"
            emptyDescription="Complete some tasks to see them here."
          />
        </motion.div>
      )}

      {/* Earlier Completed Tasks */}
      {earlierTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Archive" className="h-5 w-5 mr-2 text-gray-600" />
            Earlier ({earlierTasks.length})
          </h2>
          <TaskList
            tasks={earlierTasks}
            loading={false}
            error=""
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onRetry={refetch}
            emptyMessage="No earlier completed tasks"
            emptyDescription="Your task history will appear here."
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
          emptyMessage={searchTerm ? "No completed tasks match your search" : "No completed tasks yet"}
          emptyDescription={searchTerm ? "Try adjusting your search terms" : "Complete some tasks to see your achievements here!"}
        />
      )}
    </div>
  );
};

export default CompletedTasksPage;