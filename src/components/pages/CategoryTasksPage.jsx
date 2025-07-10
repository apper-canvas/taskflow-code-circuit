import React, { useMemo, useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import TaskService from "@/services/api/TaskService";
import CategoryService from "@/services/api/CategoryService";
import { useTasks } from "@/hooks/useTasks";
import ApperIcon from "@/components/ApperIcon";

const CategoryTasksPage = () => {
  const { categoryId } = useParams();
  const { searchTerm } = useOutletContext();
  const { toggleComplete, updateTask, deleteTask } = useTasks();
  
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategoryTasks = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [categoryData, categoryTasks] = await Promise.all([
        CategoryService.getById(categoryId),
        TaskService.getByCategory(categoryId)
      ]);
      
      setCategory(categoryData);
      setTasks(categoryTasks);
    } catch (err) {
      setError("Failed to load category tasks. Please try again.");
      console.error("Error loading category tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      loadCategoryTasks();
    }
  }, [categoryId]);

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return tasks;
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  if (!category && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="h-16 w-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Category Not Found</h2>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${category?.color || "#5B4FE5"}15` }}
            >
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: category?.color || "#5B4FE5" }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900">
                {category?.name || "Category"}
              </h1>
              <p className="text-gray-600">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"} in this category
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
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
          transition={{ duration: 0.3, delay: 0.2 }}
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
            onRetry={loadCategoryTasks}
            emptyMessage="No pending tasks in this category"
            emptyDescription="All tasks in this category are completed!"
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
            onRetry={loadCategoryTasks}
            emptyMessage="No completed tasks in this category"
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
          onRetry={loadCategoryTasks}
          emptyMessage={searchTerm ? "No tasks match your search" : "No tasks in this category"}
          emptyDescription={searchTerm ? "Try adjusting your search terms" : "Create your first task in this category to get started"}
        />
      )}
    </div>
  );
};

export default CategoryTasksPage;