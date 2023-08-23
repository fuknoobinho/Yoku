import { Routes, Route } from "react-router-dom";
import SignIn from "./compenents/Signin";
import SignUp from "./compenents/Signup";
import Dashbord from "./compenents/Dashbord";
import Home from "./compenents/Home";
import AddProducts from "./compenents/addProducts";
import Cart from "./compenents/cart";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/addProduct" element={<AddProducts />} />
        <Route path="/dashbord" element={<Dashbord />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
