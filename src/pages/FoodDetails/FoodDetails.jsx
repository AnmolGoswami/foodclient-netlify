import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './FoodDetails.css';
import { fetchFoodById } from '../../services/foodServices';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StoreContext } from '../../context/StoreContext';

const FoodDetails = () => {
  const [foodItem, setFoodItem] = useState(null);
  const { id } = useParams();
  const { quantity, increaseQuantity, decreaseQuantity } = useContext(StoreContext);

  useEffect(() => {
    const fetchFoodData = async (id) => {
      try {
        const foodData = await fetchFoodById(id);
        setFoodItem(foodData);
      } catch (error) {
        console.error('Error fetching food item:', error);
      }
    };

    fetchFoodData(id);
  }, [id]);

  useEffect(() => {
    if (foodItem && (quantity?.[foodItem.id] === undefined || quantity?.[foodItem.id] === 0)) {
      increaseQuantity(foodItem.id);
    }
  }, [foodItem]);

  if (!foodItem) {
    return (
      <div className="container my-5 text-center">
        <h2 className="display-5 fw-bold text-dark">Item Not Found</h2>
        <p className="text-muted">The item you're looking for doesn't exist or is unavailable.</p>
      </div>
    );
  }

  const itemQuantity = quantity?.[foodItem.id] || 0;

  return (
    <div className="container food-details-container my-5">
      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-5 position-relative">
          <div className="food-details-image-wrapper">
            <img
              src={foodItem.imageUrl}
              className="food-details-image"
              alt={foodItem.name}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found')}
            />
            <div className="image-frame"></div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="food-details-content card shadow-lg p-4">
            <h1 className="food-details-title mb-3">{foodItem.name}</h1>
            <p className="food-details-category text-muted mb-2">
              <strong>Category:</strong> <span>{foodItem.category}</span>
            </p>
            <p className="food-details-description text-secondary mb-4">{foodItem.description}</p>
            <div className="food-details-price mb-4">
              <strong>Price:</strong> <span className="text-primary fs-4">₹{foodItem.price}</span>
            </div>

            <div className="food-details-quantity d-flex align-items-center mb-4">
              <button
                className="btn btn-outline-secondary"
                onClick={() => decreaseQuantity(foodItem.id)}
              >
                −
              </button>
              <span className="quantity-value mx-3 fs-5">{itemQuantity}</span>
              <button
                className="btn btn-outline-primary"
                onClick={() => increaseQuantity(foodItem.id)}
              >
                +
              </button>
            </div>

            <Link
              to={`/cart`}
              className="btn btn-success"
            >
              Add to Cart (₹{foodItem.price * itemQuantity})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
