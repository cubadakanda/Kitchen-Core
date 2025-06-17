import express from "express";

// Create a simple test server
const app = express();

app.get('/', (req, res) => {
  res.send('Test server is running!');
});

// Start server on port 5000
try {
  const server = app.listen(5000, () => {
    console.log('Test server running on port 5000');
    console.log('If this works, port 5000 is available');
    console.log('Access http://localhost:5000/ to confirm');
  });

  // Auto-close after 10 seconds
  setTimeout(() => {
    server.close(() => {
      console.log('Test server closed');
      console.log('Port test completed successfully');
      process.exit(0);
    });
  }, 10000);
} catch (error) {
  console.error('Failed to start test server:');
  console.error(error.message);
  console.error('This indicates port 5000 may already be in use.');
  console.error('Stop any other servers using port 5000 before running your backend.');
}
