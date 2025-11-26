import React, { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { handleRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();

    const res = await handleRegister(fullName, email, password);
    if (res.success) {
      alert("Registered Successfully!");
      navigate("/login");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">

      <div className="bg-white shadow-2xl shadow-black/10 rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
          Create your Account
        </h2>

       {/*  <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 shadow-md py-3 rounded-xl hover:bg-gray-50 transition">
          <FcGoogle size={24} />
          <span className="text-gray-700 font-medium">Sign up with Google</span>
        </button>

        <div className="flex items-center my-6">
          <hr className="w-full border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="w-full border-gray-300" />
        </div> */}

        <form className="space-y-4" onSubmit={submitForm}>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-lg hover:bg-blue-700 transition">
            Register
          </button>

        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
