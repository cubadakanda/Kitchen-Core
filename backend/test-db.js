import { Sequelize } from "sequelize";
import db from "./config/Database.js";

console.log('Database Test Utility');
console.log('====================');
console.log('This script will test your database connection and table access');

// Test database connection
const testConnection = async () => {
  try {
    console.log('\n1. Testing database connection...');
    await db.authenticate();
    console.log('✅ SUCCESS: Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ ERROR: Could not connect to database:');
    console.error(error.message);
    
    if (error.name === 'SequelizeConnectionRefusedError') {
      console.error('\nPossible solutions:');
      console.error('- Make sure MySQL server is running');
      console.error('- Check if the port is correct (default is 3306)');
    } else if (error.name === 'SequelizeConnectionError') {
      console.error('\nPossible solutions:');
      console.error('- Check your username and password in config/Database.js');
      console.error('- Make sure the database "db_web" exists');
      console.error('- Try creating it with: CREATE DATABASE db_web;');
    }
    
    return false;
  }
};

// List all tables in the database
const listTables = async () => {
  try {
    console.log('\n2. Checking database tables...');
    const [results] = await db.query('SHOW TABLES;');
    
    if (results.length === 0) {
      console.log('⚠️ No tables found in the database.');
      return false;
    }
    
    console.log('📋 Tables in database:');
    results.forEach(row => {
      const tableName = Object.values(row)[0];
      console.log(`  - ${tableName}`);
    });
    
    // Check for the categories table specifically
    const hasCategories = results.some(row => 
      Object.values(row)[0].toLowerCase() === 'categories'
    );
    
    if (!hasCategories) {
      console.log('❌ ERROR: "categories" table not found!');
      return false;
    } else {
      console.log('✅ "categories" table exists');
      return true;
    }
  } catch (error) {
    console.error('❌ ERROR: Failed to list tables:');
    console.error(error.message);
    return false;
  }
};

// Check categories table structure
const checkCategoriesTable = async () => {
  try {
    console.log('\n3. Checking "categories" table structure...');
    const [columns] = await db.query('SHOW COLUMNS FROM categories;');
    
    console.log('📋 Columns in "categories" table:');
    columns.forEach(column => {
      console.log(`  - ${column.Field} (${column.Type}) ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Check if all required columns exist
    const requiredColumns = ['id', 'name', 'slug'];
    const missingColumns = requiredColumns.filter(reqCol => 
      !columns.some(col => col.Field === reqCol)
    );
    
    if (missingColumns.length > 0) {
      console.log(`❌ ERROR: Missing required columns: ${missingColumns.join(', ')}`);
      return false;
    }
    
    // Check if description column exists
    const hasDescription = columns.some(col => col.Field === 'description');
    if (!hasDescription) {
      console.log('⚠️ WARNING: "description" column not found in categories table');
      console.log('  This might cause issues with the frontend expecting this field');
    }
    
    return true;
  } catch (error) {
    console.error('❌ ERROR: Failed to check categories structure:');
    console.error(error.message);
    return false;
  }
};

// Quick test to get all categories
const testGetCategories = async () => {
  try {
    console.log('\n4. Testing category retrieval...');
    const [categories] = await db.query('SELECT * FROM categories LIMIT 5;');
    
    if (categories.length === 0) {
      console.log('⚠️ No categories found. The table is empty.');
    } else {
      console.log(`✅ Successfully retrieved ${categories.length} categories:`);
      categories.forEach(cat => {
        console.log(`  - ID: ${cat.id}, Name: ${cat.name}, Slug: ${cat.slug}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ ERROR: Failed to retrieve categories:');
    console.error(error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.log('\n❌ Cannot continue without database connection');
    return;
  }
  
  const tablesExist = await listTables();
  
  if (!tablesExist) {
    console.log('\n❌ Cannot continue without proper tables');
    console.log('\nPossible solutions:');
    console.log('1. Run the backend server with:');
    console.log('   node index.js');
    console.log('2. This should auto-create the required tables');
    return;
  }
  
  const tableStructureOk = await checkCategoriesTable();
  
  await testGetCategories();
  
  console.log('\n====================');
  if (dbConnected && tablesExist && tableStructureOk) {
    console.log('✅ Your database appears to be set up correctly!');
    console.log('If you still encounter issues, check:');
    console.log('1. Network connectivity between frontend and backend');
    console.log('2. CORS settings in the backend');
    console.log('3. Port configuration (backend should run on port 5000)');
  } else {
    console.log('⚠️ Some database issues were detected.');
    console.log('Fix them before continuing.');
  }
};

runTests().finally(() => {
  db.close();
});
