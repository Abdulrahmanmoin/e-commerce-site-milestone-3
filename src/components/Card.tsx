'use client'

import React, { useEffect, useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import { ProductInterface, Products, ProductsInterface, QuantityDropdownInterface } from '@/Types/CardTypes';
import Image from 'next/image';

const QuantityDropdown = ({ selectedQuantity, setSelectedQuantity }: QuantityDropdownInterface) => {
    const [isOpen, setIsOpen] = useState(false);
    const quantities = [1, 2, 3, 4, 5];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm border 
        rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:border-blue-500"
            >
                <span>Quantity: {selectedQuantity}</span>
                <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform duration-200 
          ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute bottom-14 left-48  z-10 w-16 mt-1 bg-white border rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {quantities.map((qty) => (
                            <li key={qty}>
                                <button
                                    onClick={() => {
                                        setSelectedQuantity(qty);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100
                    ${selectedQuantity === qty ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                    {qty}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ product }: ProductInterface) => {
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

    const [isAddToCart, setIsAddToCart] = useState("Add to Cart")


    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year} - ${month} - ${day}`;

    const addToCart = async () => {
        try {

            setIsAddToCart("Remove from the Cart")
            const cart = {
                userId: 5,
                date: formattedDate,
                products: [{ productId: product.id, quantity: selectedQuantity }]
            }
            const existingCarts = await JSON.parse(localStorage.getItem("carts")!) || [];
            existingCarts.push(cart);
            localStorage.setItem("carts", JSON.stringify(existingCarts));

           

        } catch (error) {
            console.log(error);

        }

    }

    if (!product) return null;

    return (
        <div className=" bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            {/* Image container with fixed aspect ratio */}
            <div className="relative pt-[100%] bg-gray-100">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.title}
                        height={1000}
                        width={1000}
                        className="absolute top-0 left-0 w-full h-full object-contain p-4"
                    />
                ) : (
                    <Image
                        src="/api/placeholder/400/400"
                        alt="Product placeholder"
                        height={1000}
                        width={1000}
                        className="absolute top-0 left-0 w-full h-full object-contain p-4"
                    />
                )}
            </div>

            {/* Content section */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Category */}
                <span className="text-sm text-blue-600 font-medium capitalize mb-2">
                    {product.category}
                </span>

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{product.rating.rate}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                        ({product.rating.count} reviews)
                    </span>
                </div>

                {/* Price */}
                <div className="text-xl font-bold text-gray-900 mb-4">
                    ${product.price.toFixed(2)}
                </div>

                {/* Quantity Dropdown */}
                <div className="mb-4">
                    <label htmlFor='quantity' className="block text-sm font-medium text-gray-700 mb-2">
                        Select Quantity:
                    </label>

                    <QuantityDropdown
                        selectedQuantity={selectedQuantity}
                        setSelectedQuantity={setSelectedQuantity}
                        productId={product.id}
                    >
                    </QuantityDropdown>

                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={addToCart}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
          transition-colors duration-200 mt-auto"
                >
                    {isAddToCart}
                </button>
            </div>
        </div>
    );
};

const ProductGrid = ({ products }: ProductsInterface) => {
    if (!Array.isArray(products)) {
        console.error('Products prop must be an array');
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                No products available
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
                No products available
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Products) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

// Example usage with sample data
const CardSec = () => {

    const [productData, setProductData] = useState([])


    useEffect(() => {
        const fetchingProducts = async () => {
            const url = await fetch('https://fakestoreapi.com/products');
            const res = await url.json()

            setProductData(res)
        }

        fetchingProducts()
    }, [])



    //     {
    //         id: 1,
    //         title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    //         price: 109.95,
    //         description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    //         category: "men's clothing",
    //         image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    //         rating: {
    //             rate: 3.9,
    //             count: 120
    //         }
    //     },
    //     {
    //         id: 2,
    //         title: "Mens Casual Premium Slim Fit T-Shirts",
    //         price: 22.3,
    //         description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    //         category: "men's clothing",
    //         image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    //         rating: {
    //             rate: 4.1,
    //             count: 259
    //         }
    //     }
    // ];

    return <ProductGrid products={productData} />;
};

export default CardSec;