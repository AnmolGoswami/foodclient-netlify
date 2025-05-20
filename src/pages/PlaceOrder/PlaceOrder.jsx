import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { CalculateCartTotals } from '../../util/CartUtils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RAZORPAY_API_KEY } from '../../util/constants';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { foodList, quantity, setQuantity, token } = useContext(StoreContext);
  const cartItems = foodList.filter(food => quantity[food.id] > 0);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    address: '',
    email: '',
    state: '',
    zip: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("Form Data:", data);
    console.log("Token:", token);

    const request = {
      email: data.email,
      phone: data.phoneNumber,
      address: `${data.firstName} ${data.lastName},${data.address},${data.state},${data.country}`,
      totalAmount: total,
      items: cartItems.map(item => ({
        id: item.id,
        quantity: quantity[item.id]
      }))
    };

    console.log("Request Payload:", request);

    try {
      const response = await axios.post("http://localhost:8080/api/orders/place", request, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Response Status:", response.status);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));

      if (response.status === 201 && response.data.razorpayOrderId) {
        initiatePayment(response.data);
      } else {
        console.log("Missing razorpayOrderId:", response.data.razorpayOrderId);
        console.log("Status mismatch:", response.status);
        toast.error("Unexpected response: Missing razorpayOrderId or incorrect status");
      }
    } catch (error) {
      console.error("Full Error:", error);
      console.error("Error Message:", error.message);
      console.error("Error Response:", error.response?.status, error.response?.data);
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network error: Unable to connect to the server. Please check if the backend is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Failed to place order");
      } else {
        toast.error(`Unexpected error: ${error.message}`);
      }
    }
  };

  const initiatePayment = (order) => {
    console.log("total you have to pay ",total);
    if (!window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      toast.error("Payment initialization failed: Razorpay SDK not loaded. Please check your network or adblocker.");
      return;
    }

    const options = {
      key: RAZORPAY_API_KEY,
      amount: total * 100,
      currency: "INR",
      name: "Foodies",
      description: "Food Order Payment",
      order_id: order.razorpayOrderId,
      handler: async function (razorpayResponse) {
        console.log("Razorpay Response:", razorpayResponse);
        await verifyPayment(razorpayResponse);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber
      },
      theme: {
        color: "#F3722C"
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
        }
      }
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay Initialization Error:", error);
      toast.error("Failed to initialize Razorpay payment: " + error.message);
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    console.log("Verifying payment with data:", razorpayResponse);
    const paymentData = {
      razorpayOrderId: razorpayResponse.razorpay_order_id,
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpaySignature: razorpayResponse.razorpay_signature
    };

    if (!paymentData.razorpayOrderId || !paymentData.razorpayPaymentId || !paymentData.razorpaySignature) {
      console.error("Missing payment data:", paymentData);
      toast.error("Payment verification failed: Incomplete payment data");
      navigate('/');
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/orders/verify-payment", paymentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Payment Verification Response:", response.data, "Status:", response.status);
      if (response.status === 200) {
        toast.success("Payment Successful");
        await clearCart();
        navigate('/orders');
      } else {
        console.error("Verification failed with status:", response.status, "Response:", response.data);
        toast.error("Payment verification failed: Invalid response from server");
        navigate('/');
      }
    } catch (error) {
      console.error("Verification Error:", error);
      console.error("Error Response:", error.response?.status, error.response?.data);
      toast.error(error.response?.data?.message || "Payment verification failed");
      navigate('/');
    }
  };

  const clearCart = async () => {
    try {
      for (const item of cartItems) {
        await axios.delete("http://localhost:8080/api/cart/remove", {
          params: { foodId: item.id },
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setQuantity({});
      console.log("Cart cleared");
    } catch (error) {
      console.error("Clear Cart Error:", error.response?.data);
      toast.error("Unable to clear cart");
    }
  };


  const { subTotal, shipping, tax, total } = CalculateCartTotals(cartItems, quantity);

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Cart Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm rounded-4 p-3">
            <h4 className="mb-4 text-primary fw-bold text-center">🛒 Your Cart</h4>

            {cartItems.length === 0 ? (
              <p className="text-muted text-center">Your cart is empty.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex align-items-start gap-3 p-2 border rounded shadow-sm bg-light">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="rounded"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div className="w-100">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1 fw-semibold">{item.name}</h6>
                        <span className="text-success fw-bold">₹{item.price * quantity[item.id]}</span>
                      </div>
                      <small className="text-muted">{item.description}</small>
                      <div className="mt-1">
                        <span className="badge bg-secondary">Qty: {quantity[item.id]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <hr className="my-4" />

            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between">
                <span>SubTotal</span>
                <strong>₹{subTotal}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Shipping Charges</span>
                <strong>₹{shipping}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Tax</span>
                <strong>₹{tax.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between bg-success text-white">
                <span className="fw-bold">Total (INR)</span>
                <strong>₹{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Billing Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm rounded-4 p-4">
            <h4 className="mb-3 text-primary">Billing Information</h4>
            <form className="needs-validation" Validate onSubmit={onSubmitHandler}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                    type="text"
                    className="form-control"
                    id="firstName"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    name="lastName"
                    onChange={onChangeHandler}
                    value={data.lastName}
                    type="text"
                    className="form-control"
                    id="lastName"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  name="phoneNumber"
                  onChange={onChangeHandler}
                  value={data.phoneNumber}
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="Phone Number"
                  required
                  pattern="[0-9]{10}"
                  title="Phone number must be 10 digits"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  name="address"
                  onChange={onChangeHandler}
                  value={data.address}
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="1234 Main St"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-5 mb-3">
                  <label htmlFor="country" className="form-label">Country</label>
                  <select
                    name="country"
                    value={data.country}
                    onChange={onChangeHandler}
                    className="form-select"
                    id="country"
                    required
                  >
                    <option value="">Choose...</option>
                    <option>India</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="state" className="form-label">State</label>
                  <select
                    name="state"
                    value={data.state}
                    onChange={onChangeHandler}
                    className="form-select"
                    id="state"
                    required
                  >
                    <option value="">Choose...</option>
                    <option>Bihar</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="zip" className="form-label">Zip</label>
                  <input
                    name="zip"
                    value={data.zip}
                    onChange={onChangeHandler}
                    type="text"
                    className="form-control"
                    id="zip"
                    required
                    pattern="[0-9]{6}"
                    title="Zip code must be 6 digits"
                  />
                </div>
              </div>

              <hr className="my-4" />

              <button
                disabled={cartItems.length === 0}
                className="btn btn-success w-100 py-2"
                type="submit"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;