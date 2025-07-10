import tasksData from "@/services/mockData/tasks.json";
import { format, isToday, parseISO } from "date-fns";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay();
    return [...this.tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async getById(id) {
    await this.delay();
    return this.tasks.find(task => task.Id === parseInt(id));
  }

  async getTodayTasks() {
    await this.delay();
    const today = new Date();
    return this.tasks.filter(task => {
      if (!task.dueDate) return false;
      return isToday(parseISO(task.dueDate));
    }).sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async getCompletedTasks() {
    await this.delay();
    return this.tasks.filter(task => task.completed)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  async getPendingTasks() {
    await this.delay();
    return this.tasks.filter(task => !task.completed)
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  async getByCategory(category) {
    await this.delay();
    return this.tasks.filter(task => task.category === category)
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  async create(taskData) {
    await this.delay();
    const newTask = {
      Id: this.getNextId(),
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      category: taskData.category || "Personal",
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay();
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...this.tasks[taskIndex],
      ...taskData,
      Id: parseInt(id)
    };
    
    this.tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay();
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    this.tasks.splice(taskIndex, 1);
    return true;
  }

  async toggleComplete(id) {
    await this.delay();
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    const task = this.tasks[taskIndex];
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    };
    
    this.tasks[taskIndex] = updatedTask;
    return { ...updatedTask };
  }

  getNextId() {
    return Math.max(...this.tasks.map(task => task.Id), 0) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new TaskService();