import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import AllTasksPage from "@/components/pages/AllTasksPage";
import TodayTasksPage from "@/components/pages/TodayTasksPage";
import CompletedTasksPage from "@/components/pages/CompletedTasksPage";
import CategoryTasksPage from "@/components/pages/CategoryTasksPage";

function App() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TodayTasksPage />} />
          <Route path="/all" element={<AllTasksPage />} />
          <Route path="/today" element={<TodayTasksPage />} />
          <Route path="/completed" element={<CompletedTasksPage />} />
          <Route path="/category/:categoryId" element={<CategoryTasksPage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </motion.div>
  );
}

export default App;