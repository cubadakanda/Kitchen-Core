import db from "./config/Database.js";

// Import all models
import UserModel from "./models/usersModel.js";
import CategoryModel from "./models/categoriesModel.js";
import RecipeModel from "./models/recipesModel.js";
import { Sequelize } from "sequelize";

// Function to seed the database with initial data
const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");
    
    // Connect to database
    await db.authenticate();
    console.log("Database connection established.");
    
    // Sync models (optional, can be removed if already synced in main app)
    await db.sync({ alter: false });
    
    // Create default categories
    const categories = [
      { name: "Indonesian Food", description: "Traditional dishes from Indonesia" },
      { name: "Italian Food", description: "Classic Italian cuisine" },
      { name: "Desserts", description: "Sweet treats and desserts" },
      { name: "Beverages", description: "Drinks and refreshments" },
      { name: "Healthy Food", description: "Nutritious and balanced meals" }
    ];
    
    console.log("Creating categories...");
    for (const category of categories) {
      await CategoryModel.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
    }
    
    // Create a default admin user
    console.log("Creating admin user...");
    const [adminUser] = await UserModel.findOrCreate({
      where: { email: "admin@kitchencore.com" },
      defaults: {
        name: "Admin User",
        email: "admin@kitchencore.com",
        password: "$2b$10$MUqfR9PTky2Z3ZbR1wF.DeljpFVvsSGW/QkJ4DO9GF6xVj92amJDa", // hashed 'password123'
        role: "admin",
        status: "active"
      }
    });
    
    // Create sample recipes
    const recipes = [
      {
        user_id: adminUser.id,
        category_id: 1, // Indonesian Food
        title: "Nasi Goreng Spesial",
        slug: "nasi-goreng-spesial",
        description: "Nasi goreng dengan bumbu rempah pilihan dan telur",
        ingredients: "Nasi putih\nTelur ayam\nBawang merah\nBawang putih\nKecap manis\nCabai\nGaram\nMinyak goreng",
        instructions: "Panaskan minyak dalam wajan\nTumis bawang merah dan putih hingga harum\nMasukkan telur, orak-arik\nTambahkan nasi putih\nBeri kecap manis dan garam\nAduk rata dan sajikan",
        image_url: "/images/recipes/nasi-goreng.jpg",
        prep_time: 10,
        cook_time: 15,
        servings: "2 porsi",
        status: "published",
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        user_id: adminUser.id,
        category_id: 2, // Italian Food
        title: "Spaghetti Carbonara",
        slug: "spaghetti-carbonara",
        description: "Pasta Italia klasik dengan saus creamy",
        ingredients: "Spaghetti\nTelur\nKeju parmesan\nBacon\nBawang putih\nMerica hitam\nGaram",
        instructions: "Rebus spaghetti hingga al dente\nGoreng bacon hingga crispy\nCampur telur dengan keju parmesan\nCampur pasta dengan saus telur\nTaburi merica hitam dan sajikan",
        image_url: "/images/recipes/spaghetti.jpg",
        prep_time: 10,
        cook_time: 15,
        servings: "2 porsi",
        status: "published",
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        user_id: adminUser.id,
        category_id: 1, // Indonesian Food
        title: "Rendang Daging",
        slug: "rendang-daging",
        description: "Masakan khas Padang dengan cita rasa yang kaya",
        ingredients: "Daging sapi\nSantan kelapa\nSerai\nDaun jeruk\nLengkuas\nCabai merah\nBawang merah\nBawang putih\nKemiri",
        instructions: "Haluskan bumbu\nTumis bumbu hingga harum\nMasukkan daging, aduk rata\nTuang santan\nMasak dengan api kecil hingga mengental\nSajikan dengan nasi putih",
        image_url: "/images/recipes/rendang.jpg",
        prep_time: 30,
        cook_time: 120,
        servings: "4 porsi",
        status: "published",
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    ];
    
    console.log("Creating recipes...");
    for (const recipe of recipes) {
      await RecipeModel.findOrCreate({
        where: { slug: recipe.slug },
        defaults: recipe
      });
    }
    
    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the database connection
    await db.close();
    console.log("Database connection closed.");
  }
};

// Run the seeder
seedDatabase();
