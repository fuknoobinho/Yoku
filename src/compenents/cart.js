import React, { useState, useEffect } from "react";
import { auth, fs } from "./firebase-config";
import { CartProducts } from "./CartProducts";
import StripeCheckout from "react-stripe-checkout";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

function Cart() {
  onAuthStateChanged(auth, (currentUser) => {
    const user = currentUser.displayName;
  });
  const [cartProducts, setCartProducts] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const cartCollection = collection(fs, "Cart " + user.uid);
      onSnapshot(cartCollection, (snapshot) => {
        const newCartProduct = snapshot.docs.map((doc) => ({
          ID: doc.id,
          ...doc.data(),
        }));
        setCartProducts(newCartProduct);
      });
    } else {
      console.log("user is not signed in to retrieve cart");
    }
  });

  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  // reducing the qty in a single value
  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  // console.log(totalQty);

  // getting the TotalProductPrice from cartProducts in a seperate array
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  // reducing the price in a single value
  const reducerOfPrice = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalPrice = price.reduce(reducerOfPrice, 0);

  let Product;

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {
    // console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;
    // updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        const cartDocRef = doc(fs, "Cart " + user.uid, cartProduct.ID);
        updateDoc(cartDocRef, Product)
          .then(() => {
            console.log("increment added" + Product.ID);
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      } else {
        console.log("user is not logged in to increment");
      }
    });
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;
      // updating in database
      auth.onAuthStateChanged((user) => {
        if (user) {
          const cartDocRef = doc(fs, "Cart " + user.uid, cartProduct.ID);
          updateDoc(cartDocRef, Product)
            .then(() => {
              console.log("decrement" + Product.ID);
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        } else {
          console.log("user is not logged in to decrement");
        }
      });
    }
  };
  const handlePayment = async (token) => {
    try {
      // Envoie le token de paiement au serveur pour traitement
      const response = await fetch("/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token.id,
          amount: totalPrice * 100, // Le montant en centimes
          currency: "usd",
        }),
      });

      if (response.ok) {
        // Gérer le succès du paiement
        console.log("Paiement réussi !");
      } else {
        // Gérer l'échec du paiement
        console.log("Échec du paiement");
      }
    } catch (error) {
      console.error("Erreur lors du traitement du paiement :", error);
    }
  };

  return (
    <>
      <br></br>
      {cartProducts.length > 0 && (
        <div className="container-fluid">
          <h1 className="text-center">Cart</h1>
          <div className="products-box">
            <CartProducts
              cartProducts={cartProducts}
              cartProductIncrease={cartProductIncrease}
              cartProductDecrease={cartProductDecrease}
            />
          </div>
          <div className="summary-box">
            <h5>Cart Summary</h5>
            <br></br>
            <div>
              Total No of Products: <span>{totalQty}</span>
            </div>
            <div>
              Total Price to Pay: <span>$ {totalPrice}</span>
            </div>
            <br></br>
            <StripeCheckout
              name="Yoku"
              description="Payment for Cart Items Yoku Shop"
              amount={totalPrice * 100} // Le montant doit être en centimes
              currency="USD"
            />
          </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div className="container-fluid">No products to show</div>
      )}
    </>
  );
}
export default Cart;
