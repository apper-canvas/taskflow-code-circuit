import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-start space-x-4">
            {/* Checkbox skeleton */}
            <div className="w-5 h-5 bg-gray-200 rounded mt-1 animate-pulse" />
            
            <div className="flex-1">
              {/* Title skeleton */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
              
              {/* Description skeleton */}
              <div className="h-3 bg-gray-200 rounded w-full mb-3 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-3 animate-pulse" />
              
              {/* Badges skeleton */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
              </div>
              
              {/* Date skeleton */}
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
            
            {/* Arrow skeleton */}
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;