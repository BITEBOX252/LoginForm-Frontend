import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';

const RestaurantDetail = () => {
  const { id } = useParams();  // Get the restaurant ID from URL
  const [dishes, setDishes] = useState([]);  // State for storing dishes

  useEffect(() => {
    // Fetch dishes for the restaurant
    axios.get(`http://127.0.0.1:8000/api/store/dishes/`, {
      params: { restaurant_id: id }
    })
    .then(response => {
      setDishes(response.data);  // Set the fetched dishes
    })
    .catch(error => {
      console.error("Error fetching dishes:", error);
    });
  }, [id]);

  return (
    <div>
      <h1>Dishes of Restaurant {id}</h1>
      <div className="row">
        {dishes.map((dish, index) => (
          <div key={index} className="col-lg-4 col-md-12 mb-4">
            <div className="card">
              <div className="bg-image hover-zoom ripple" data-mdb-ripple-color="light">
                <Link to={`/dishdetail/${dish.slug}`}><img src={dish.image} className="w-100" /></Link>
              </div>
              <div className="card-body">
                <h5 className="card-title mb-3">{dish.title}</h5>
                <p className="card-text">{dish.description}</p>
                <p className="card-text">Price: {dish.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;
