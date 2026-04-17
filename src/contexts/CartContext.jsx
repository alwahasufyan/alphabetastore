"use client";

import { createContext, useEffect, useMemo, useReducer, useState } from "react";

import {
  CART_RESET_EVENT,
  clearStoredCart,
  getStoredCart,
  saveStoredCart
} from "utils/cart";


// =================================================================================


// =================================================================================
const INITIAL_STATE = {
  cart: []
};


// ==============================================================


// ==============================================================

export const CartContext = createContext({});
const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_CART_AMOUNT":
      const cartList = state.cart;
      const cartItem = action.payload;
      if (cartItem === undefined) return state;
      const existIndex = cartList.findIndex(item => item.id === cartItem.id);

      
// REMOVE ITEM IF QUANTITY IS LESS THAN 1
      if (cartItem.qty < 1) {
        const updatedCart = cartList.filter(item => item.id !== cartItem.id);
        return {
          ...state,
          cart: updatedCart
        };
      }

      
// IF PRODUCT ALREADY EXITS IN CART
      if (existIndex > -1) {
        const updatedCart = [...cartList];
        updatedCart[existIndex].qty = cartItem.qty;
        return {
          ...state,
          cart: updatedCart
        };
      }
      return {
        ...state,
        cart: [...cartList, cartItem]
      };
    case "HYDRATE_CART":
      return {
        ...state,
        cart: Array.isArray(action.payload) ? action.payload : []
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: []
      };
    default:
      {
        return state;
      }
  }
};
export default function CartProvider({
  children
}) {
  const [hydrated, setHydrated] = useState(false);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const storedCart = getStoredCart();
    dispatch({
      type: "HYDRATE_CART",
      payload: storedCart
    });
    setHydrated(true);

    const handleCartReset = () => {
      clearStoredCart();
      dispatch({
        type: "CLEAR_CART"
      });
    };

    window.addEventListener(CART_RESET_EVENT, handleCartReset);

    return () => {
      window.removeEventListener(CART_RESET_EVENT, handleCartReset);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    saveStoredCart(state.cart);
  }, [hydrated, state.cart]);

  const contextValue = useMemo(() => ({
    state,
    dispatch
  }), [state, dispatch]);
  return <CartContext value={contextValue}>{children}</CartContext>;
}