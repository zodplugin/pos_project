'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function POS() {
  const [menuItems, setmenuItems] = useState([]);
  const [flashSaleItems, setflashSaleItems] = useState([])
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/menu');
      const data = await response.json();
      const regularItems = data.filter(item => item.type === 'regular');
      const flashSaleItems = data.filter(item => item.type === 'flash-sale');
      setmenuItems(regularItems);
      setflashSaleItems(flashSaleItems);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const endTime = new Date().getTime() + 3600000; // 1 hour from now
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft("Sale Ended");
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setCart(savedCart);
    setWishlist(savedWishlist);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const uncart = (id) => {
    const existingItem = cart.find((cartItem) => cartItem.id === id);
    if (existingItem.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      removeFromCart(id);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((cartItem) => cartItem.id !== id));
  };

  const addToWishlist = (item) => {
    if (!wishlist.some((wishlistItem) => wishlistItem.id === item.id)) {
      setWishlist([...wishlist, item]);
    }
  };

  const unwishlist = (id) => {
    setWishlist(wishlist.filter((wishlistItem) => wishlistItem.id !== id));
  };

  const quantityCart = (id) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    return item ? item.quantity : 0;
  };
  const isAddedToCart = (id) => cart.some((cartItem) => cartItem.id === id);
  const isAddedToWishlist = (id) => wishlist.some((wishlistItem) => wishlistItem.id === id);

  const closeModal = () => setSelectedItem(null);

  return (
    <div className="bg-white min-h-screen text-blue-900 flex flex-col items-center p-6 sm:p-10">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">POS Menu</h1>
        <p className="text-lg mt-2">Explore our delicious menu and enjoy exclusive promos!</p>
      </header>

      {/* Flash Sale Section */}
      <section className="mb-10 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Flash Sale! Ends in: {timeLeft}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {flashSaleItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-yellow-50 rounded-lg shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                  {item.promo}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-lg font-medium">{formatCurrency(item.price)}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-blue-50 rounded-lg shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative mb-4">
              <Image
                src={item.image}
                alt={item.name}
                width={300}
                height={200}
                className="rounded-lg"
              />
              <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded">
                {item.promo}
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-lg font-medium">{formatCurrency(item.price)}</p>
          </div>
        ))}
      </main>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 sm:w-96 shadow-lg relative"
          >
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
                            onClick={closeModal}
            >
              &times;
            </button>
            <div className="mb-4">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                width={300}
                height={200}
                className="rounded-lg"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
            <p className="text-lg font-medium text-gray-700 mb-4">{formatCurrency(selectedItem.price)}</p>
            <p className="text-sm text-gray-500 mb-4">{selectedItem.description}</p>
            <p className="text-sm text-gray-500 mb-4">Quantity : {quantityCart(selectedItem.id)}</p>
            <div className="flex justify-between items-center">
              <button
                className={`px-4 py-2 rounded-lg text-white ${
                  isAddedToCart(selectedItem.id) ? "bg-green-500" : "bg-blue-500"
                }`}
                onClick={() => addToCart(selectedItem)}
              >
                {isAddedToCart(selectedItem.id) ? "Add More" : "Add to Cart"}
              </button>
              {isAddedToCart(selectedItem.id) && (
                <button
                  className="px-4 py-2 rounded-lg bg-red-500 text-white"
                  onClick={() => uncart(selectedItem.id)}
                >
                  Remove One
                </button>
              )}
              <button
                className={`px-4 py-2 rounded-lg text-white ${
                  isAddedToWishlist(selectedItem.id) ? "bg-yellow-500" : "bg-gray-500"
                }`}
                onClick={() =>
                  isAddedToWishlist(selectedItem.id)
                    ? unwishlist(selectedItem.id)
                    : addToWishlist(selectedItem)
                }
              >
                {isAddedToWishlist(selectedItem.id) ? "Unwishlist" : "Wishlist"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={() => setShowWishlistModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
            {wishlist.length === 0 ? (
              <p className="text-gray-500">Your wishlist is empty.</p>
            ) : (
              wishlist.map((wishlistItem) => (
                <div
                  key={wishlistItem.id}
                  className="flex justify-between items-center mb-4"
                >
                  <p className="font-semibold">{wishlistItem.name}</p>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => unwishlist(wishlistItem.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <footer className="mt-12 text-center text-sm text-blue-700">
        <p>Powered by Your Restaurant POS System</p>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white flex justify-around items-center h-16">
        <button onClick={() => setShowCartModal(true)} className="flex flex-col items-center">
          <Image src="/cart.svg" alt="Cart" width={24} height={24} />
          <span className="text-xs">Cart</span>
        </button>
        <button onClick={() => setShowWishlistModal(true)} className="flex flex-col items-center">
          <Image src="/wishlist.svg" alt="Wishlist" width={24} height={24} />
          <span className="text-xs">Wishlist</span>
        </button>
        <button className="flex flex-col items-center">
          <Image src="/history.svg" alt="Order History" width={24} height={24} />
          <span className="text-xs">History</span>
        </button>
      </nav>
    </div>
  );
}


      