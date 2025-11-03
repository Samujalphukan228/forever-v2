import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);

  const [searchParams] = useSearchParams();
  const successParam = (searchParams.get('success') || '').toLowerCase();
  const orderId = searchParams.get('orderId') || '';

  // consider "true", "1", "success" as truthy
  const success =
    successParam === 'true' ||
    successParam === '1' ||
    successParam === 'success';

  const [loading, setLoading] = useState(true);
  const hasVerifiedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    // Only verify once we have token and required query params
    if (hasVerifiedRef.current) return;

    // Guard: missing params
    if (!orderId || typeof success === 'undefined') {
      setLoading(false);
      toast.error('Missing payment information.');
      navigate('/cart', { replace: true });
      return;
    }

    // Wait for token to be available
    if (!token) return;

    const verifyPayment = async () => {
      hasVerifiedRef.current = true;
      setLoading(true);

      try {
        const { data } = await axios.post(
          `${backendUrl}/api/order/verifyStripe`,
          { success, orderId },
          { headers: { token } }
        );

        if (data?.success) {
          setCartItems({}); // clear cart
          toast.success('Payment verified successfully!');
          navigate('/orders', { replace: true });
        } else {
          toast.error(data?.message || 'Payment verification failed.');
          navigate('/cart', { replace: true });
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        toast.error(err?.response?.data?.message || err.message || 'Something went wrong.');
        navigate('/cart', { replace: true });
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    verifyPayment();
  }, [token, success, orderId, backendUrl, navigate, setCartItems]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        {loading ? (
          <>
            <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-700">Verifying payment, please wait...</p>
          </>
        ) : (
          <p className="text-gray-700">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default Verify;