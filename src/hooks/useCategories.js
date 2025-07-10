import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CategoryService from "@/services/api/CategoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const allCategories = await CategoryService.getAll();
      setCategories(allCategories);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const newCategory = await CategoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast.success("Category created successfully!");
      return newCategory;
    } catch (err) {
      toast.error("Failed to create category");
      throw err;
    }
  };

  const updateCategory = async (categoryId, categoryData) => {
    try {
      const updatedCategory = await CategoryService.update(categoryId, categoryData);
      setCategories(prev => prev.map(category => 
        category.Id === categoryId ? updatedCategory : category
      ));
      toast.success("Category updated successfully!");
      return updatedCategory;
    } catch (err) {
      toast.error("Failed to update category");
      throw err;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await CategoryService.delete(categoryId);
      setCategories(prev => prev.filter(category => category.Id !== categoryId));
      toast.success("Category deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete category");
      throw err;
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: loadCategories
  };
};