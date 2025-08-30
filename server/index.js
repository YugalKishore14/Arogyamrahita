const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// app.use(cors({
//     origin: "https://arogyamrahita.onrender.com",
//     credentials: true
// }));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/arogyamrahita';

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Error:", err));

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/products", require("./routes/product.route"));
app.use("/api/cart", require("./routes/cart.route"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));