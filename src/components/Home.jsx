import React from "react";
import {
  categories,
  newArrivals,
  featuredProducts,
  testimonials,
  services,
} from "../data/products";
import { useStore } from "../context/StoreContext";

function Rating({ value }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) stars.push(<ion-icon key={i} name="star"></ion-icon>);
    else if (value >= i - 0.5)
      stars.push(<ion-icon key={i} name="star-half-outline"></ion-icon>);
    else stars.push(<ion-icon key={i} name="star-outline"></ion-icon>);
  }
  return <div className="showcase-rating">{stars}</div>;
}

export default function Home() {
  const { dispatch, state } = useStore();
  return (
    <main>
      {/* Banner slider would stay static (kept in index.html) or could be refactored later */}

      {/* Dynamic Categories */}
      <div className="category">
        <div className="container">
          <div className="category-item-container has-scrollbar">
            {categories.map((cat) => (
              <div key={cat.id} className="category-item">
                <div className="category-img-box">
                  <img src={cat.icon} alt={cat.name} width="30" />
                </div>
                <div className="category-content-box">
                  <div className="category-content-flex">
                    <h3 className="category-item-title">{cat.name}</h3>
                    <p className="category-item-amount">({cat.count})</p>
                  </div>
                  <a href="#" className="category-btn">
                    Show All
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="product-container">
        <div className="container">
          <div className="product-box">
            <div className="product-minimal">
              <div className="product-showcase">
                <h2 className="title">New Arrivals</h2>
                <div className="showcase-wrapper has-scrollbar">
                  <div className="showcase-container">
                    {newArrivals.map((p) => (
                      <div className="showcase" key={p.id}>
                        <a href="#" className="showcase-img-box">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="showcase-img"
                            width="70"
                          />
                        </a>
                        <div className="showcase-content">
                          <a href="#">
                            <h4 className="showcase-title">{p.title}</h4>
                          </a>
                          <a href="#" className="showcase-category">
                            {p.category}
                          </a>
                          <div className="price-box">
                            <p className="price">${p.price.toFixed(2)}</p>
                            <del>${p.oldPrice.toFixed(2)}</del>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <div className="product-main">
              <h2 className="title">Featured Products</h2>
              <div className="product-grid">
                {featuredProducts.map((prod) => (
                  <div className="showcase" key={prod.id}>
                    <div className="showcase-banner">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="product-img default"
                        width="300"
                      />
                      <img
                        src={prod.images[1]}
                        alt={prod.title}
                        className="product-img hover"
                        width="300"
                      />
                      {prod.badge && (
                        <p className={`showcase-badge ${prod.badgeType || ""}`}>
                          {prod.badge}
                        </p>
                      )}
                      <div className="showcase-actions">
                        <button
                          className="btn-action"
                          onClick={() =>
                            dispatch({ type: "ADD_TO_WISHLIST", payload: prod })
                          }
                        >
                          <ion-icon name="heart-outline"></ion-icon>
                        </button>
                        <button className="btn-action">
                          <ion-icon name="eye-outline"></ion-icon>
                        </button>
                        <button
                          className="btn-action"
                          onClick={() =>
                            dispatch({ type: "ADD_TO_CART", payload: prod })
                          }
                        >
                          <ion-icon name="bag-add-outline"></ion-icon>
                        </button>
                      </div>
                    </div>
                    <div className="showcase-content">
                      <a href="#" className="showcase-category">
                        {prod.category}
                      </a>
                      <a href="#">
                        <h3 className="showcase-title">{prod.title}</h3>
                      </a>
                      <Rating value={prod.rating} />
                      <div className="price-box">
                        <p className="price">${prod.price.toFixed(2)}</p>
                        <del>${prod.oldPrice.toFixed(2)}</del>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials and Services */}
            <div className="container">
              <div className="testimonials-box">
                <div className="testimonial">
                  <h2 className="title">Testimonials</h2>
                  {testimonials.map((t) => (
                    <div key={t.id} className="testimonial-card">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="testimonial-banner"
                        width="80"
                        height="80"
                      />
                      <h3 className="testimonial-name">{t.name}</h3>
                      <p className="testimonial-title">{t.title}</p>
                      <img
                        src="/quote.png"
                        alt="quotation"
                        className="quotation-img"
                        width="30"
                      />
                      <p className="testimonial-desc">"{t.quote}"</p>
                    </div>
                  ))}
                </div>
                <div className="service">
                  <h2 className="title">Our Services</h2>
                  <div className="service-container">
                    {services.map((s) => (
                      <div className="service-item" key={s.title}>
                        <div className="service-icon">
                          <ion-icon name={s.icon}></ion-icon>
                        </div>
                        <div className="service-content">
                          <h3 className="service-title">{s.title}</h3>
                          <p className="service-desc">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
