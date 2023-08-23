import React, { useState } from "react";
import { storage, fs } from "./firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

function AddProducts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const [imageError, setImageError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

  const types = ["image/jpeg", "image/png"]; // Adjusted valid image types

  const handleProductImg = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (types.includes(selectedFile.type)) {
        setImage(selectedFile);
        setImageError("");
      } else {
        setImage(null);
        setImageError("Please select a valid image file type (jpg or png)");
      }
    }
  };

  const handleAddProducts = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !image) {
      setUploadError("Please fill out all fields");
      return;
    }

    setUploadError("");
    setSuccessMsg("");

    try {
      const storageRef = ref(storage, `product-images/${image.name}`);
      await uploadBytes(storageRef, image);

      const url = await getDownloadURL(
        ref(storage, `product-images/${image.name}`)
      );
      // Use addDoc to add a document to the collection
      await addDoc(collection(fs, "Products"), {
        title,
        description,
        price: parseFloat(price), // Parse the price as a float
        url,
      });

      setSuccessMsg("Product added successfully");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      document.getElementById("file").value = "";
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  // Rest of the component remains the same

  return (
    <div className="container">
      <br></br>
      <br></br>
      <h1>Add Products</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className="success-msg">{successMsg}</div>
          <br></br>
        </>
      )}
      <form
        autoComplete="off"
        className="form-group"
        onSubmit={handleAddProducts}
      >
        <label>Product Title</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <br></br>
        <label>Product Description</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></input>
        <br></br>
        <label>Product Price</label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        ></input>
        <br></br>
        <label>Upload Product Image</label>
        <input
          type="file"
          id="file"
          className="form-control"
          required
          onChange={handleProductImg}
        ></input>

        {imageError && (
          <>
            <br></br>
            <div className="error-msg">{imageError}</div>
          </>
        )}
        <br></br>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-success btn-md">
            SUBMIT
          </button>
        </div>
      </form>
      {uploadError && (
        <>
          <br></br>
          <div className="error-msg">{uploadError}</div>
        </>
      )}
    </div>
  );
}

export default AddProducts;
