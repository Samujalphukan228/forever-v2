import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext); // fixed
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const success = searchParams?.get('success');
  const orderId = searchParams?.get('orderId');
  const [loading, setLoading] = useState(true);

  const verifyPayment = async () => {
    if (!token || !success || !orderId) {
      toast.error('Missing payment information.');
      navigate('/cart');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      );

      console.log('Verify response:', response.data);

      if (response.data.success) {
        setCartItems({}); // cleared cart using correct setter
        toast.success('Payment verified successfully!');
        navigate('/orders');
      } else {
        toast.error('Payment verification failed.');
        navigate('/cart');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error(error?.response?.data?.message || error.message || 'Something went wrong.');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token, success, orderId]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? <p>Verifying payment, please wait...</p> : <p>Redirecting...</p>}
    </div>
  );
};

export default Verify;
