import React from "react";
import "../styles/custom-style.css";

export const IndividualProduct = ({ individualProduct, addToCart }) => {
  const handleAddToCart = () => {
    addToCart(individualProduct);
  };
  let backgroundImge = {
    background: `url(${individualProduct.url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  return (
    <div className="product" style={backgroundImge}>
      <div id="price">{individualProduct.price}$</div>
      <div id="Name">{individualProduct.title}</div>
    </div>
    // <div className="product">
    //   <div className="product-img">
    //     <img src={individualProduct.url} alt="product-img" />
    //   </div>
    //   <div className="product-text title">{individualProduct.title}</div>
    //   <div className="product-text description">
    //     {individualProduct.description}
    //   </div>
    //   <div className="product-text price">$ {individualProduct.price}</div>
    //   <div className="btn btn-danger btn-md cart-btn" onClick={handleAddToCart}>
    //     ADD TO CART
    //   </div>
    // </div>
  );
};
