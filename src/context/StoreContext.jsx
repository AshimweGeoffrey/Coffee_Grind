import { createContext, useContext, useReducer } from "react";

const StoreContext = createContext();

const initialState = {
  cart: [],
  wishlist: [],
  notifications: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cart.find((i) => i.id === action.payload.id);
      const updated = exists
        ? {
            ...state,
            cart: state.cart.map((i) =>
              i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
            ),
          }
        : { ...state, cart: [...state.cart, { ...action.payload, qty: 1 }] };
      return {
        ...updated,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: "success",
            message: `${action.payload.title} added to cart`,
          },
        ],
      };
    }
    case "ADD_TO_WISHLIST": {
      if (state.wishlist.find((i) => i.id === action.payload.id))
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { id: Date.now(), type: "info", message: "Already in wishlist" },
          ],
        };
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: "success",
            message: `${action.payload.title} added to wishlist`,
          },
        ],
      };
    }
    case "REMOVE_FROM_CART": {
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
        notifications: [
          ...state.notifications,
          { id: Date.now(), type: "warn", message: "Item removed from cart" },
        ],
      };
    }
    case "REMOVE_FROM_WISHLIST": {
      return {
        ...state,
        wishlist: state.wishlist.filter((i) => i.id !== action.payload),
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: "warn",
            message: "Item removed from wishlist",
          },
        ],
      };
    }
    case "CLEAR_NOTIFICATION": {
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    }
    case "CLEAR_CART": {
      return {
        ...state,
        cart: [],
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: "success",
            message: "Order placed successfully",
          },
        ],
      };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
