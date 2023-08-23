import Products from "./products";
import { auth, fs } from "./firebase-config";
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore"; // Import getDocs
import { onAuthStateChanged } from "firebase/auth";
import { Link, Navigate } from "react-router-dom";
import cadi from "../assets/panier.png";
import defaultPfp from "../assets/profile_null.jpg";
import "../styles/custom-style.css";
import rowBtn from "../assets/row-bottom.png";
import rowUp from "../assets/row-top.png";
function Home() {
  const [products, setProducts] = useState([]);
  const [profileImg, setProfileImg] = useState(defaultPfp);
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.photoURL !== null) {
        setProfileImg(currentUser.photoURL);
      }
    }
  });
  const [user, setUser] = useState(null);

  const getProducts = async () => {
    try {
      const productsCollection = collection(fs, "Products");
      const productsSnapshot = await getDocs(productsCollection);

      const productsArray = productsSnapshot.docs.map((doc) => ({
        ID: doc.id,
        ...doc.data(),
      }));

      setProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  let Product;
  const addToCart = async (product) => {
    if (user !== null) {
      // console.log(product);
      Product = product;
      Product["qty"] = 1;
      Product["TotalProductPrice"] = Product.qty * Product.price;
      try {
        await setDoc(doc(fs, `Cart ${user.uid}`, product.ID), Product);
        console.log("Successfully added to cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      <Navigate to="/signin" />;
    }
  };

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div>
      <div ref={menuRef} className={`drop-menu ${open ? "active" : ""}`}>
        <div>Collection audd</div>
        <div>Collection summer</div>
        <div>Collection deux frére</div>
      </div>

      <div class="navbar" id="menuDrawer">
        <div class="menu-title" id="collectionsTitle">
          Collections <img src="../assets/row-bottom.png" class="row-bottom" />
        </div>

        <div class="menu-subtitles">
          <div class="menu-subtitle">
            Collection 1{" "}
            <img src="../assets/row-bottom.png" class="row-right" />
          </div>
          <div class="menu-subtitle">
            Collection 2{" "}
            <img src="../assets/row-bottom.png" class="row-right" />
          </div>
          <div class="menu-subtitle">
            Collection 3{" "}
            <img src="../assets/row-bottom.png" class="row-right" />
          </div>
        </div>
        <hr />
        <div class="menu-title" id="collectionsTitle">
          Look Book <img src="../assets/row-bottom.png" class="row-bottom" />
        </div>
        <hr />
      </div>
      <header id="header">
        <div class="logo">
          <img alt="logo" src="../assets/QUELAFAMILLE.svg" id="qlf-logo" />
        </div>

        <div id="btn-a">
          <div class="menu-button" onClick={() => setOpen(!open)}>
            Catalogue
            <img src={rowBtn} class="row-btn" />
          </div>
          <div class="menu-button">
            Look Book
            <img src={rowBtn} class="row-btn" />
          </div>
          {
            <div>
              {user && user.displayName ? (
                // If user's displayName is available
                <Link to="/dashbord">
                  <div className="menu-button">{user.displayName}</div>
                </Link>
              ) : (
                // If user's displayName is not available
                <Link to="/signin">
                  <div className="menu-button">
                    Connexion
                    <img src={rowBtn} className="row-right" alt="Row Button" />
                  </div>
                </Link>
              )}
            </div>
          }
          <button class="hamburger">
            <div class="bar"></div>
          </button>
        </div>
        <Link to="/cart">
          <div class="panier">
            <img alt="panier" src={cadi} />
          </div>
        </Link>
      </header>
      <hr />
      <div class="section-header">
        <p>boutique</p>
      </div>
      <div class="divider"></div>
      {products.length > 0 && (
        <div className="container-fluid">
          <div className="container">
            <Products products={products} addToCart={addToCart} />
          </div>
        </div>
      )}
      {products.length < 1 && (
        <div className="container-fluid">Please wait....</div>
      )}
    </div>
  );
}
export default Home;
