import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FoodDisplay.css';
import { Link } from 'react-router-dom';

const FoodDisplay = ({category,searchTerm}) => {
  const { foodList } = useContext(StoreContext);

  const filteredFoodList = foodList.filter(food =>(
    (category==='All' ||  food.category===category) && food.name.toLowerCase().includes(searchTerm.toLowerCase())

  ))

  console.log('foodList in FoodDisplay:', foodList); // Debug log

  // Fallback for undefined or null foodList
  if (!foodList) {
    return (
      <div className="container my-5 text-center">
        <h2 className="display-5 fw-bold text-dark">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 display-4 fw-bold food-display-title">
        Explore Our Delicious Menu
      </h2>
      <div className="row">
        {foodList.length === 0 ? (
          <p className="text-center fs-4 text-muted">No items available.</p>
        ) : (
          filteredFoodList.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card border-0 food-card">
                <div className="food-image-container">
                  <img
                    src={item.imageUrl}
                    className="card-img-top food-image"
                    alt={item.name}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300x170?text=Image+Not+Found')}
                  />
                  <div className="food-overlay"></div>
                </div>
                <div className="card-body food-content">
                  <h5 className="card-title food-title">{item.name}</h5>
                  <p className="card-text food-description">{item.description}</p>
                  <p className="card-text food-category">
                    <strong>Category:</strong> <span>{item.category}</span>
                  </p>
                  <p className="card-text food-price">
                    <strong>Price:</strong> <span>₹{item.price}</span>
                  </p>
                  <Link to={`/food/${item.id}`}
                    className="btn food-button"
                    aria-label={`View details of ${item.name}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;