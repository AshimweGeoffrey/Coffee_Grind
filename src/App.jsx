import React from "react";
import Home from "./components/Home";
import { StoreProvider, useStore } from "./context/StoreContext";

function CartDrawer({ open, onClose }) {
  const { state, dispatch } = useStore();
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
  return (
    <div
      className={`drawer cart-drawer ${open ? "open" : ""}`}
      aria-hidden={!open}
    >
      <div className="drawer-header">
        <h3>Cart</h3>
        <button
          onClick={onClose}
          className="drawer-close"
          aria-label="Close Cart"
        >
          ✕
        </button>
      </div>
      <div className="drawer-body">
        {state.cart.length === 0 && <p className="drawer-empty">Cart empty</p>}
        {state.cart.map((item) => (
          <div key={item.id} className="drawer-item">
            <img src={item.images?.[0] || item.image} alt={item.title} />
            <div className="meta">
              <p className="title">{item.title}</p>
              <p className="price">
                ${item.price.toFixed(2)} × {item.qty}
              </p>
              <button
                className="remove-btn"
                onClick={() =>
                  dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="drawer-footer">
        <p className="total-label">Total</p>
        <p className="total-value">${total}</p>
        <button className="checkout-btn" disabled={state.cart.length === 0}>
          Checkout (dummy)
        </button>
      </div>
    </div>
  );
}

function WishlistDrawer({ open, onClose }) {
  const { state, dispatch } = useStore();
  return (
    <div
      className={`drawer wishlist-drawer ${open ? "open" : ""}`}
      aria-hidden={!open}
    >
      <div className="drawer-header">
        <h3>Wishlist</h3>
        <button
          onClick={onClose}
          className="drawer-close"
          aria-label="Close Wishlist"
        >
          ✕
        </button>
      </div>
      <div className="drawer-body">
        {state.wishlist.length === 0 && (
          <p className="drawer-empty">Wishlist empty</p>
        )}
        {state.wishlist.map((item) => (
          <div key={item.id} className="drawer-item">
            <img src={item.images?.[0] || item.image} alt={item.title} />
            <div className="meta">
              <p className="title">{item.title}</p>
              <p className="price">${item.price.toFixed(2)}</p>
              <button
                className="remove-btn"
                onClick={() =>
                  dispatch({ type: "REMOVE_FROM_WISHLIST", payload: item.id })
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderCounts({ onOpenCart, onOpenWishlist }) {
  const { state } = useStore();
  React.useEffect(() => {
    const wishlistEls = document.querySelectorAll(
      ".header-user-actions .action-btn:nth-child(2) .count, .mobile-bottom-navigation .action-btn:nth-child(4) .count"
    );
    wishlistEls.forEach((el) => (el.textContent = state.wishlist.length));
    const cartEls = document.querySelectorAll(
      ".header-user-actions .action-btn:nth-child(3) .count, .mobile-bottom-navigation .action-btn:nth-child(2) .count"
    );
    cartEls.forEach(
      (el) => (el.textContent = state.cart.reduce((sum, i) => sum + i.qty, 0))
    );
  }, [state]);

  // Attach open events once
  React.useEffect(() => {
    const heartBtn = document.querySelector(
      ".header-user-actions .action-btn:nth-child(2)"
    );
    const cartBtn = document.querySelector(
      ".header-user-actions .action-btn:nth-child(3)"
    );
    const mobileHeartBtn = document.querySelector(
      ".mobile-bottom-navigation .action-btn:nth-child(4)"
    );
    const mobileCartBtn = document.querySelector(
      ".mobile-bottom-navigation .action-btn:nth-child(2)"
    );
    heartBtn && heartBtn.addEventListener("click", onOpenWishlist);
    mobileHeartBtn && mobileHeartBtn.addEventListener("click", onOpenWishlist);
    cartBtn && cartBtn.addEventListener("click", onOpenCart);
    mobileCartBtn && mobileCartBtn.addEventListener("click", onOpenCart);
    return () => {
      heartBtn && heartBtn.removeEventListener("click", onOpenWishlist);
      mobileHeartBtn &&
        mobileHeartBtn.removeEventListener("click", onOpenWishlist);
      cartBtn && cartBtn.removeEventListener("click", onOpenCart);
      mobileCartBtn && mobileCartBtn.removeEventListener("click", onOpenCart);
    };
  }, [onOpenCart, onOpenWishlist]);
  return null;
}

function Overlay({ active, onClick }) {
  return (
    <div
      className={`drawer-overlay ${active ? "active" : ""}`}
      onClick={onClick}
    />
  );
}

function Notifications() {
  const { state, dispatch } = useStore();
  React.useEffect(() => {
    state.notifications.forEach((n) => {
      setTimeout(
        () => dispatch({ type: "CLEAR_NOTIFICATION", payload: n.id }),
        4000
      );
    });
  }, [state.notifications, dispatch]);
  return (
    <div className="notify-container">
      {state.notifications.slice(-5).map((n) => (
        <div key={n.id} className={`notify ${n.type}`}>
          <span>{n.message}</span>
          <button
            aria-label="Close"
            onClick={() =>
              dispatch({ type: "CLEAR_NOTIFICATION", payload: n.id })
            }
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function RootApp() {
  const [cartOpen, setCartOpen] = React.useState(false);
  const [wishOpen, setWishOpen] = React.useState(false);
  const anyOpen = cartOpen || wishOpen;
  const closeAll = () => {
    setCartOpen(false);
    setWishOpen(false);
  };
  return (
    <>
      <HeaderCounts
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishOpen(true)}
      />
      <Home />
      <Notifications />
      <CartDrawer open={cartOpen} onClose={closeAll} />
      <WishlistDrawer open={wishOpen} onClose={closeAll} />
      <Overlay active={anyOpen} onClick={closeAll} />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <RootApp />
    </StoreProvider>
  );
}
