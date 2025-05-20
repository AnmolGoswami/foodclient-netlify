import React from 'react';
import './exploreMenu.css'; 
import { categories } from '../../assets/assets';
// Custom CSS for styling

const ExploreMenu = ({ category, setCategory}) => {
  return (
    <div className="container my-5">
      <h2 className="mb-4" style={{ fontWeight: '700', color: '#1a1a1a', textAlign: 'left' }}>
        Explore Menu
      </h2>
      <div className="d-flex overflow-auto gap-3 pb-3">
        {categories.map((item, index) => (
          <div onClick={
            ()=>{
                setCategory(prev => prev===item.category ? 'All' : item.category);
            }
          }
            key={index}
            className="category-card text-center"
            style={{
              minWidth: '160px',
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              borderRadius: '15px',
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
            }}
          >
            <div className="image-container">
              <img
                src={item.image}
                alt={item.category}
                className={item.category===category ? 'category-image active' : 'category-image'}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #ffffff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              />
            </div>
            <h5
              className="mt-2 mb-3"
              style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#333',
                textTransform: 'capitalize',
              }}
            >
              {item.category}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMenu;