import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { fetchFoodList } from "../services/foodServices";

export const StoreContext = createContext();
const AXIOS_BASE_URL = 'http://localhost:8080/api/cart';

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [token, setToken] = useState(null);

  const increaseQuantity = async (id) => {
    const newQuantity = (quantity[id] || 0) + 1;
    setQuantity(prev => ({ ...prev, [id]: newQuantity }));

    try {
      await axios.put(`${AXIOS_BASE_URL}/update`, {
        foodId: id,
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Increase quantity failed:", error);
    }
  };

  const decreaseQuantity = async (id) => {
    const newQuantity = quantity[id] > 0 ? quantity[id] - 1 : 0;
    setQuantity(prev => ({ ...prev, [id]: newQuantity }));

    try {
      await axios.put(`${AXIOS_BASE_URL}/update`, {
        foodId: id,
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Decrease quantity failed:", error);
    }
  };

 const deleteFromCart = async (id, token) => {
  try {
    const response = await axios.delete(`${AXIOS_BASE_URL}/remove`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { foodId: id }
    });
    console.log("Item removed:", response.data);
  } catch (error) {
    console.error("Failed to remove item:", error.response || error.message);
  }
};

const removeFromCart = async (id) => {
  setQuantity(prev => ({ ...prev, [id]: 0 }));
  const response = await deleteFromCart(id, token);
  console.log(response);
};



  

  const loadCartData = async (token) => {
    try {
      const response = await axios.get(AXIOS_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedQuantities = {};
      response.data.forEach(item => {
        updatedQuantities[item.foodId] = item.quantity;
      });

      setQuantity(updatedQuantities);
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      const response = await fetchFoodList();
      setFoodList(response);

      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }

    loadData();
  }, []);

  const contextValue = {
    foodList,
    increaseQuantity,
    decreaseQuantity,
    quantity,
    setQuantity,
    removeFromCart,
    token,
    setToken,
    loadCartData,
    deleteFromCart
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
