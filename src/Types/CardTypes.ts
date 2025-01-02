import React from "react";

export interface ProductInterface {
    product: {
        category: string;
        description: string;
        id: number;
        image: string;
        price: number;
        rating: { count: number; rate: number };
        title: string
    }
}

export interface ProductsInterface {
    products: {
        category: string;
        description: string;
        id: number;
        image: string;
        price: number;
        rating: { count: number; rate: number };
        title: string
    }[]
}


export interface QuantityDropdownInterface {
    selectedQuantity: number;
    setSelectedQuantity: React.Dispatch<React.SetStateAction<number>>;
    productId: number;
}

export interface existingCartsItemInterface { 


        userId: 5,
        date: Date,
        products: []
    
}

export type Products = {
    category: string;
    description: string;
    id: number;
    image: string;
    price: number;
    rating: { count: number; rate: number };
    title: string
}