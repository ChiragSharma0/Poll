import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { handleLogin, handleGoogleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // GOOGLE LOGIN CALLBACK
  const handleGoogleResponse = async (response) => {
    try {
      const res = await handleGoogleLogin(response.credential);

      if (res.success) {
        alert("Google Login Successful!");
        navigate("/app/dashboard");
      } else {
        alert(res.message || "Google Login Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Google Login Error!");
    }
  };

  // LOAD GOOGLE BUTTON
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, []);

  // EMAIL LOGIN SUBMIT
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await handleLogin(email, password);

      if (res.success) {
        alert("Login Successful!");
        navigate("/app/dashboard");
      } else {
        alert(res.message || "Login Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>

        {/* {/* GOOGLE LOGIN BUTTON }
        <div id="googleBtn" className="w-full mb-6"></div>

        {/* OR SEPARATOR }
        <div className="flex items-center my-6">
          <hr className="w-full border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="w-full border-gray-300" />
        </div> */}

        {/* EMAIL LOGIN FORM */}
        <form className="space-y-4" onSubmit={submitForm}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 bg-blue-600 text-white rounded-xl ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
