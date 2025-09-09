import React from "react";
import Home from "./components/Home";
import { StoreProvider, useStore } from "./context/StoreContext";
import { formatRWF } from "./utils/currency";

const EXCHANGE_RATE = 1; // prices already in RWF

function CartDrawer({ open, onClose }) {
  const { state, dispatch } = useStore();
  const total = state.cart.reduce(
    (s, i) => s + i.price * EXCHANGE_RATE * i.qty,
    0
  );
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
                {formatRWF(item.price * EXCHANGE_RATE)} × {item.qty}
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
        <p className="total-value">{formatRWF(total)}</p>
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
              <p className="price">{formatRWF(item.price * EXCHANGE_RATE)}</p>
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

function CheckoutModal({ open, onClose }) {
  const { state, dispatch } = useStore();
  const canvasRef = React.useRef(null);
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  React.useEffect(() => {
    if (!open) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const items = state.cart;
    const sum = items.reduce((s, i) => s + i.price * i.qty, 0) || 1;
    let start = 0;
    const colors = [
      "#6b4f3a",
      "#c17f59",
      "#a25a2b",
      "#deb887",
      "#8b4513",
      "#d2b48c",
    ];
    ctx.clearRect(0, 0, 300, 300);
    items.forEach((item, idx) => {
      const slice = ((item.price * item.qty) / sum) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.fillStyle = colors[idx % colors.length];
      ctx.arc(150, 150, 140, start, start + slice);
      ctx.fill();
      start += slice;
    });
  }, [open, state.cart]);
  const placeOrder = () => {
    dispatch({ type: "CLEAR_CART" });
    onClose();
  };
  return (
    <div className={`checkout-modal ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="checkout-card">
        <div className="checkout-head">
          <h3>Checkout (Dummy)</h3>
          <button className="close-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="checkout-body">
          {state.cart.length === 0 && <p className="empty">Cart empty.</p>}
          {state.cart.length > 0 && (
            <>
              <canvas
                ref={canvasRef}
                width="300"
                height="300"
                className="checkout-chart"
              />
              <ul className="checkout-list">
                {state.cart.map((i) => (
                  <li key={i.id}>
                    <span className="label">{i.title}</span>
                    <span className="value">{formatRWF(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="checkout-total">
                <span>Total</span>
                <span>{formatRWF(total)}</span>
              </div>
              <button className="place-order" onClick={placeOrder}>
                Place Order (dummy)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RootApp() {
  const [cartOpen, setCartOpen] = React.useState(false);
  const [wishOpen, setWishOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const anyOpen = cartOpen || wishOpen || checkoutOpen;
  const closeAll = () => {
    setCartOpen(false);
    setWishOpen(false);
    setCheckoutOpen(false);
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
      <CheckoutModal open={checkoutOpen} onClose={closeAll} />
      <Overlay active={anyOpen} onClick={closeAll} />
      <button
        className="floating-checkout"
        onClick={() => setCheckoutOpen(true)}
      >
        Checkout
      </button>
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
