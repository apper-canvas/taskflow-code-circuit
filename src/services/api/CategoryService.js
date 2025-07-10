import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await this.delay();
    return [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(id) {
    await this.delay();
    return this.categories.find(category => category.Id === parseInt(id));
  }

  async create(categoryData) {
    await this.delay();
    const newCategory = {
      Id: this.getNextId(),
      name: categoryData.name,
      color: categoryData.color || "#5B4FE5",
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await this.delay();
    const categoryIndex = this.categories.findIndex(category => category.Id === parseInt(id));
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    
    const updatedCategory = {
      ...this.categories[categoryIndex],
      ...categoryData,
      Id: parseInt(id)
    };
    
    this.categories[categoryIndex] = updatedCategory;
    return { ...updatedCategory };
  }

  async delete(id) {
    await this.delay();
    const categoryIndex = this.categories.findIndex(category => category.Id === parseInt(id));
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }
    this.categories.splice(categoryIndex, 1);
    return true;
  }

  getNextId() {
    return Math.max(...this.categories.map(category => category.Id), 0) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export default new CategoryService();