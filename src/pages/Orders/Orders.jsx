import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { StoreContext } from "../../context/StoreContext";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 9;
  const { token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders with token:", token);
      const response = await axios.get("http://localhost:8080/api/orders/user-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched Orders:", response.data);
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error.response || error.message);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      console.warn("No token found. Cannot fetch orders.");
      setError("Please log in to view your orders.");
      setLoading(false);
    }
  }, [token]);

  const filteredOrders = orders
    .filter((order) => filterStatus === "ALL" || order.orderStatus === filterStatus)
    .filter((order) =>
      order.userAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.razorpayOrderId.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-500 overflow-hidden`}>
      {/* Background Gradient */}
      <div className="bg-overlay"></div>

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-lg z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}
        initial={{ x: -256 }}
        animate={{ x: isSidebarOpen ? 0 : -256 }}
      >
        <div className="p-6">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'} mb-6`}>Filters</h3>
          <div className="space-y-4">
            {["ALL", "CREATED", "CONFIRMED"].map((status) => (
              <motion.button
                key={status}
                onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                  filterStatus === status
                    ? 'bg-neon-cyan/30 text-neon-cyan shadow-neon'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status} ({status === "ALL" ? orders.length : orders.filter((o) => o.orderStatus === status).length})
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <motion.h2
            className={`text-4xl sm:text-5xl font-extrabold ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'} animate-slide-in`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            🍽️ Your Orders
          </motion.h2>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <motion.button
              onClick={toggleSidebar}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-neon-cyan' : 'bg-gray-200 text-gray-800'} hover:bg-opacity-80`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSidebarOpen ? '✖' : '☰'}
            </motion.button>
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-neon-cyan' : 'bg-gray-200 text-gray-800'} hover:bg-opacity-80`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search by address, email, or Razorpay ID..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800/70 text-gray-200 border-neon-cyan/50' : 'bg-white/70 text-gray-800 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-neon-cyan transition-all backdrop-blur-sm placeholder-gray-400`}
          />
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className={`bg-red-500/90 backdrop-blur-sm text-white p-4 mb-8 rounded-xl flex items-center ${isDarkMode ? 'border-red-400' : 'border-red-600'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <span className="mr-2">⚠️</span> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <motion.div
              className="loader w-16 h-16 border-4 border-t-neon-cyan border-gray-200 dark:border-gray-700 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className={`ml-4 text-lg ${isDarkMode ? 'text-neon-cyan' : 'text-gray-600'}`}>
              Loading your orders...
            </p>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {currentOrders.length === 0 ? (
                <motion.div
                  className={`col-span-full ${isDarkMode ? 'bg-gray-800/90' : 'bg-yellow-100/90'} backdrop-blur-sm p-4 rounded-xl text-center ${isDarkMode ? 'text-neon-cyan' : 'text-yellow-800'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  No orders found for the selected filter or search!
                </motion.div>
              ) : (
                currentOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    className={`order-card ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg rounded-xl p-6 border ${isDarkMode ? 'border-neon-cyan/40' : 'border-gray-200/40'} shadow-neon animate-float`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(0, 255, 255, 0.5)" }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'}`}>
                        Order #{order.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium animate-glow ${
                          order.orderStatus === "CONFIRMED"
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`font-medium ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'}`}>📍 Address:</span> {order.userAddress || "N/A"}
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`font-medium ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'}`}>📞 Phone:</span> {order.phoneNumber || "N/A"}
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`font-medium ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'}`}>✉️ Email:</span> {order.email || "N/A"}
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`font-medium ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'}`}>💵 Amount:</span> ₹{order.amount || 0}
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={`font-medium ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'}`}>💳 Payment:</span>{" "}
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-sm animate-glow ${
                            order.paymentStatus === "PAID"
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {order.paymentStatus || "Unknown"}
                        </span>
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        <span className={`font-medium ${isDarkMode ? 'text-neon-cyan' : 'text-gray-800'}`}>🆔 Razorpay ID:</span> {order.razorpayOrderId || "N/A"}
                      </p>
                    </div>
                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-neon-cyan/40' : 'border-gray-200/40'}`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        🕒 Placed on: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      currentPage === page
                        ? 'bg-neon-cyan text-gray-900 shadow-neon'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;