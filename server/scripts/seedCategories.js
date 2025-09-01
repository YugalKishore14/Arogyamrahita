const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");

dotenv.config();

const categories = [
    { name: "Oils", description: "Cooking oils and edible oils" },
    { name: "Seeds", description: "Various seeds for cooking and health" },
    { name: "Aata", description: "Flour and grain products" },
    { name: "Pickle", description: "Traditional Indian pickles" },
    { name: "Dry fruits", description: "Dried fruits and nuts" },
    { name: "Millets", description: "Ancient grains and millets" },
    { name: "Sabut Masala", description: "Whole spices" },
    { name: "Crush masala", description: "Ground and crushed spices" },
    { name: "Rice", description: "Various types of rice" },
    { name: "Tea", description: "Tea leaves and tea products" },
    { name: "Fast(varat)", description: "Fasting food items" },
    { name: "Self life", description: "Long shelf life products" }
];

const seedCategories = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing categories
        await Category.deleteMany({});
        console.log("Cleared existing categories");

        // Create a dummy admin user ID (you'll need to replace this with actual admin ID)
        const adminUserId = new mongoose.Types.ObjectId();

        // Insert categories
        const categoriesWithAdmin = categories.map(cat => ({
            ...cat,
            createdBy: adminUserId
        }));

        await Category.insertMany(categoriesWithAdmin);
        console.log("Categories seeded successfully!");

        // Display seeded categories
        const seededCategories = await Category.find();
        console.log("Seeded categories:", seededCategories.map(cat => cat.name));

    } catch (error) {
        console.error("Error seeding categories:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

// Run the seed function
seedCategories();
