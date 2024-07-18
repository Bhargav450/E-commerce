// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/auth');
const { sequelize } = require('./config/db');

const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Define the port on which the server will run
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define routes for user authentication, customer management, and order management
app.use('/api', userRoutes);
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);

// Swagger setup for API documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API DOC',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Specify the files where Swagger will look for annotations
};

// Initialize Swagger JSDoc
const specs = swaggerJsdoc(options);

// Serve Swagger UI for API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Function to connect to the database and start the server
const connectDatabases = async () => {
  try {
    // Authenticate the connection to the MySQL database
    await sequelize.authenticate();
    console.log('MySQL connected');

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting to databases:', err);
  }
};

// Connect to the database and start the server
connectDatabases();
