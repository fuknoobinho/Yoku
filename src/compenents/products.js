import React from "react";
import { IndividualProduct } from "./individualProduct";

const Products = ({ products, addToCart }) => {
  return products.map((individualProduct) => (
    <IndividualProduct
      key={individualProduct.ID}
      individualProduct={individualProduct}
      addToCart={addToCart}
    />
  ));
};
export default Products;
