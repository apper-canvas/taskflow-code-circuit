import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const { categories } = useCategories();

  const navigationItems = [
    { path: "/today", label: "Today", icon: "Calendar", count: null },
    { path: "/all", label: "All Tasks", icon: "List", count: null },
    { path: "/completed", label: "Completed", icon: "CheckCircle", count: null },
  ];

  const NavItem = ({ item, onClick }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-r-2 border-primary"
            : "text-gray-600 hover:text-primary hover:bg-gray-50"
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center space-x-3">
            <ApperIcon 
              name={item.icon} 
              className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-gray-500 group-hover:text-primary"
              )} 
            />
            <span>{item.label}</span>
          </div>
          {item.count !== null && (
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              isActive 
                ? "bg-primary text-white" 
                : "bg-gray-200 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              {item.count}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  const CategoryItem = ({ category, onClick }) => (
    <NavLink
      to={`/category/${category.Id}`}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
            : "text-gray-600 hover:text-primary hover:bg-gray-50"
        )
      }
    >
      <>
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span>{category.name}</span>
        </div>
        <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">
          {category.taskCount}
        </span>
      </>
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
<div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold gradient-text">TaskFlow Pro</h1>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Categories
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <CategoryItem key={category.Id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className={cn(
          "lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className={cn(
          "lg:hidden fixed left-0 top-0 w-80 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
<div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold gradient-text">TaskFlow Pro</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item, index) => (
              <NavItem key={index} item={item} onClick={onClose} />
            ))}
          </nav>

          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <CategoryItem key={category.Id} category={category} onClick={onClose} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;