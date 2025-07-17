import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import SearchBar from "@/components/molecules/SearchBar";
import QuickAddButton from "@/components/molecules/QuickAddButton";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "@/App";
import { cn } from "@/utils/cn";

const Header = ({ onSearch, onQuickAdd, onMobileMenuToggle, title = "Today's Tasks" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearch(term);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 sm:px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="Menu" className="h-5 w-5 text-gray-700" />
        </button>

        {/* Title */}
        <div className="flex-1 lg:flex-none">
          <h1 className="text-xl sm:text-2xl font-display font-bold gradient-text">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1 hidden sm:block">
            Stay organized and accomplish your goals
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search tasks..."
            className="hidden sm:block w-64"
          />
          
          <QuickAddButton
            onClick={onQuickAdd}
            className="hidden sm:block"
          />

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0] || user?.name?.[0] || 'U'}
                </span>
              </div>
              <span className="text-sm text-gray-700">
                {user?.firstName || user?.name || 'User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <ApperIcon name="LogOut" className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ApperIcon name="Search" className="h-5 w-5 text-gray-700" />
          </button>

          {/* Mobile Add Button */}
          <button
            onClick={onQuickAdd}
            className="sm:hidden p-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-lg"
          >
            <ApperIcon name="Plus" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        className="sm:hidden mt-4"
      >
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search tasks..."
          className="w-full"
        />
      </motion.div>
    </motion.header>
  );
};

export default Header;