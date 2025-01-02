'use client'

import { existingCartsItemInterface, ProductInterface, Products, ProductsInterface, QuantityDropdownInterface } from '@/Types/CardTypes'
import { ChevronDown, Star } from 'lucide-react'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

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

function ProductCard({ product }: ProductInterface) {

    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

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
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
  transition-colors duration-200 mt-auto"
                >
                    Remove from the Cart
                </button>
            </div>
        </div>
    )
}

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
                No products yet
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

const AddToCart = () => {

    const [productsData, setProductsData] = useState<Products[]>([])
    const IdsArr: { id: number, quantity: number }[] = []


    const gettingProducts = async () => {
        const existingCarts = await JSON.parse(localStorage.getItem("carts")!) || [];

        const products = existingCarts.map((item: existingCartsItemInterface) => {
            const products = item.products
            return products;
        })


        products.map((ele: []) => {
            ele.map((item: { productId: number, quantity: number }) => {
                IdsArr.push({ id: item.productId, quantity: item.quantity })
            })
        })

    }

    gettingProducts()

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const products = await Promise.all(
                    IdsArr.map(obj =>
                        fetch(`https://fakestoreapi.com/products/${obj.id}`)
                            .then(res => res.json())
                            .catch(e => console.error(`Error fetching product ${obj.id}:`, e))
                    )
                );

                setProductsData(products)

            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProductDetails()

    }, [])


    setInterval(() => {
        localStorage.clear()
        console.log("Products removed from the shopping cart");
        
    }, 300000);

    return <ProductGrid products={productsData} />;
};

export default AddToCart;