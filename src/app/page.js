'use client'

import { useState } from "react";
import Image from "next/image";

const menuItems = [
  {
    name: "Cheeseburger",
    price: "50k IDR",
    image: "https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_640.jpg",
    promo: "Buy 1 Get 1 Free!",
    description: "A classic cheeseburger with melted cheese and fresh toppings."
  },
  {
    name: "Pizza Margherita",
    price: "85k IDR",
    image: "https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_640.jpg",
    promo: "20% Off",
    description: "Traditional Italian pizza with fresh tomatoes, mozzarella, and basil."
  },
  {
    name: "Pasta Carbonara",
    price: "70k IDR",
    image: "https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_640.jpg",
    promo: "Free Drink Included",
    description: "Creamy pasta with crispy pancetta and Parmesan cheese."
  },
];

export default function POS() {
  const [selectedItem, setSelectedItem] = useState(null);

  const closeModal = () => setSelectedItem(null);

  return (
    <div className="bg-white min-h-screen text-blue-900 flex flex-col items-center p-6 sm:p-10">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">POS Menu</h1>
        <p className="text-lg mt-2">Explore our delicious menu and enjoy exclusive promos!</p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {menuItems.map((item, index) => (
          <div
            key={index}
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
            <p className="text-lg font-medium">{item.price}</p>
          </div>
        ))}
      </main>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 sm:w-96 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              x
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
            <p className="text-sm text-gray-700 mb-4">{selectedItem.description}</p>
            <p className="text-lg font-medium mb-4">{selectedItem.price}</p>
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Add to Cart
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-sm text-blue-700">
        <p>Powered by Your Restaurant POS System</p>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white flex justify-around items-center h-16">
        <button className="flex flex-col items-center">
          <Image src="/cart.svg" alt="Cart" width={24} height={24} />
          <span className="text-xs">Cart</span>
        </button>
        <button className="flex flex-col items-center">
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
