'use client'
import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaListAlt , FaHistory } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cart, setCart] = useState([]);
  const formatCurrency = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };
  const totalCart = cart.reduce((acc, item) => {
    return (item.price * item.quantity);
  }, 0);
  const order = async () => {
    try {
      let orderDetail = [];
      cart.forEach((x) => {
        orderDetail.push({
          menuId: x.id,
          quantity: x.quantity
        })
      }) 
      
      let code = Math.floor(Math.random() * 10 ** 10);
      const response = await fetch('/api/order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          total: totalCart,
          details: orderDetail,
        }),
      });
      if (response.ok) {
        const existingCodes = JSON.parse(sessionStorage.getItem('orderCodes')) || [];
        if (!existingCodes.includes(code)) {
          existingCodes.push(code); 
        }
        sessionStorage.setItem('orderCodes', JSON.stringify(existingCodes));

        localStorage.removeItem('cart');
        setCart([]);
        setShowCartModal(false)
        toast.success('Berhasil membuat order');
      } else {
        setShowCartModal(false)
        toast.error('Eror ketika membuat order');
      }
    } catch (error) {
      setShowCartModal(false)
      toast.error('Eror ketika membuat order');
    }
  }
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    const fetchOrders = async () => {
        try {
          const codes = JSON.parse(sessionStorage.getItem("orderCodes")) || [];
      
          if (codes.length === 0) {
            setOrders([]);
            setLoading(false);
            return;
          }
      
          let fetchedOrders = [];
      
          for (const code of codes) {
            try {
              console.log("Fetching order for code:", code); 
              const response = await fetch(`/api/order?code=${code}`);
              if (response.ok) {
                const order = await response.json();
                fetchedOrders.push(order); 
              } else {
                console.error(`Failed to fetch order for code ${code}`);
              }
            } catch (err) {
              console.error(`Error fetching order for code ${code}:`, err);
            }
          }
      
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching order history:", error);
        } finally {
          setLoading(false);
        }
    };
      
    
    fetchOrders();
  }, []);
  console.log(orders)
  if (loading) {
    return (
        <div className="bg-white min-h-screen text-blue-900 flex flex-col items-center p-6 sm:p-10">
            <div className="text-center mt-8 text-blue-700">Loading...</div>
        </div>
    );
  }

  if (orders.length === 0) {
    return (
        <>
            <div className="bg-white min-h-screen text-blue-900 flex flex-col items-center p-6 sm:p-10">
                <h1 className="text-xl font-bold mb-4 text-center">Order History</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div key={1} className="border rounded-lg shadow-lg p-4">
                    <h2 className="text-lg font-semibold text-blue-700">
                    Order Tidak Ada
                    </h2>
                    <p className="text-sm text-gray-500">Total: Rp 0</p>
                    <div className="mt-2">
                    <h3 className="text-md font-medium">Items: - </h3>
                    </div>
                </div>
                </div>

                <nav className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white flex justify-around items-center h-16">
                    <button onClick={() => setShowCartModal(true)} className="flex flex-col items-center">
                    <FaShoppingCart size={24} />
                    <span className="text-xs">Cart</span>
                    </button>
                    <button className="flex flex-col items-center">
                    <FaHistory size={24} />
                    <span className="text-xs">History</span>
                    </button>
                </nav>
            </div>
        </>
    );
  }

  return (
    <div className="bg-white min-h-screen text-blue-900 flex flex-col items-center p-6 sm:p-10">
        <div className="p-4">
        <h1 className="text-xl font-bold mb-4 text-center">Order History</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
            <div key={order.id} className="border rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold text-blue-700">
                Order #{order.code}
                </h2>
                <p className="text-sm text-gray-500">Total: Rp {order.total}</p>
                <div className="mt-2">
                <h3 className="text-md font-medium">Items:</h3>
                <ul className="list-disc ml-4">
                    {order.OrderDetail.map((item) => (
                    <li key={item.id} className="text-sm text-gray-700">
                        <span>{item.Menu.name}</span> - <span>{item.quantity}</span>
                        <br />
                        <img
                        src={item.Menu.image}
                        alt={item.Menu.name}
                        className="w-full rounded-md mt-2"
                        />
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            ))}
        </div>
        {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={() => setShowCartModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cart.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <p className="font-semibold">{cartItem.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {cartItem.quantity}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-2 py-1 bg-green-500 text-white rounded-lg"
                      onClick={() => addToCart(cartItem)}
                    >
                      +
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded-lg"
                      onClick={() => uncart(cartItem.id)}
                    >
                      -
                    </button>
                  </div>
                </div>
              ))
            )}
            <p className="mb-2">Total Harga : {formatCurrency(totalCart)}</p>
            <button
              className=" px-4 py-2 font-bold bg-blue-500 rounded-lg text-white hover:text-gray-800"
              onClick={() => order()}
            >
              Order Sekarang
            </button>
          </div>
        </div>
      )}
        <footer className="mt-12 text-center text-sm text-blue-700">
            <p>Powered by Warung Euy POS System</p>
        </footer>
            
        <nav className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white flex justify-around items-center h-16">
            <Link href="/">
                <button className="flex flex-col items-center">
                <FaListAlt size={24} />
                <span className="text-xs">Menu</span>
                </button>
            </Link>
            <button onClick={() => setShowCartModal(true)} className="flex flex-col items-center">
            <FaShoppingCart size={24} />
            <span className="text-xs">Cart</span>
            </button>
            <Link href="/order">
                <button className="flex flex-col items-center">
                <FaHistory size={24} />
                <span className="text-xs">History</span>
                </button>
            </Link>
        </nav>
        </div>
    </div>
  );
};

export default History;
