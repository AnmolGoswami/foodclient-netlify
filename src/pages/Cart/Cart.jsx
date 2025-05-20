import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { Link, useNavigate } from 'react-router-dom';
import { CalculateCartTotals } from '../../util/CartUtils';

const Cart = () => {
    const navigate = useNavigate();
    const { quantity, removeFromCart, increaseQuantity, decreaseQuantity, foodList } = useContext(StoreContext);
    //Cart Items 

    const cartItems = foodList.filter(food => quantity[food.id] > 0);

    // Calculation of the cart item

   const { subTotal, shipping, tax, total } = CalculateCartTotals (cartItems,quantity);




    return (
        <div className="container py-5">
            <h1 className="mb-5">Your Shopping Cart</h1>
            <div className="row">
                <div className="col-lg-8">


                    {cartItems.length === 0 ? (
                        <p>Your cart is empty. Start adding items to your cart to checkout.</p>
                    ) :
                        (<div className="card mb-4">
                            <div className="card-body">
                                {cartItems.map((food)=>
                                (<div className="row cart-item mb-3">
                                    <div className="col-md-3">
                                        <img src={food.imageUrl} alt={food.name} className="img-fluid rounded" />
                                    </div>
                                    <div className="col-md-5">
                                        <h5 className="card-title">{food.name}</h5>
                                        <p className="text-muted">Category: {food.category}</p>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="input-group">
                                            <button 
                                            onClick={() => decreaseQuantity(food.id)}
                                             className="btn btn-outline-secondary btn-sm" type="button">-</button>
                                            <input value={quantity[food.id]} style={{ "maxwidth": "100px" }} type="text" className="form-control  form-control-sm text-center quantity-input" />
                                            <button
                                            onClick={() => increaseQuantity(food.id)}
                                             className="btn btn-outline-secondary btn-sm" type="button">+</button>
                                        </div>
                                    </div>
                                    <div className="col-md-2 text-end">
                                        <p className="fw-bold">&#8377;{food.price}</p>
                                        <button onClick={() => {removeFromCart(food.id,localStorage.getItem('token'))}} className="btn btn-sm btn-outline-danger">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>)
                                )}
                                <hr />
                                
                            </div>
                        </div>)
                    }



                    <div className="text-start mb-4">
                        <Link to="/explore" className="btn btn-outline-primary">
                            <i className="bi bi-arrow-left me-2"></i>Continue Shopping
                        </Link>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card cart-summary">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Order Summary</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Subtotal</span>
                                <span>&#8377;{subTotal}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Shipping</span>
                                <span>&#8377;{subTotal === 0 ? 0 : shipping}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Tax</span>
                                <span>&#8377;{tax}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-4">
                                <strong>Total</strong>
                                <strong>&#8377;{total}</strong>
                            </div>
                            <button onClick={() => navigate('/order')}  disabled={cartItems.length === 0} className="btn btn-primary w-100">Proceed to Checkout</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Cart