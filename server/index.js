const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const mongoUri = process.env.MONGO_URI;
mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Error:", err));

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/products", require("./routes/product.route"));
app.use("/api/categories", require("./routes/category.route"));
app.use("/api/cart", require("./routes/cart.route"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));