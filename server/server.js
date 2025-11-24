const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const aap = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();



aap.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});