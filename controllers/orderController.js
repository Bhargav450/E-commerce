const { validationResult, check } = require("express-validator");
const order = require("../models/order");
const sequelize = require("../config/database");
const Redis = require('ioredis');
const redis = new Redis(); // Create a single Redis client outside the getOrder function

const getOrder = {
    getOrder: async (req, res) => {
        try {
            // Check if data exists in Redis cache
            const data = await redis.get("active_orders");

            if (data !== null) {
                console.log("Data retrieved from Redis cache");
                return res.json(JSON.parse(data));
            } else {
                console.log("Data not found in Redis cache, querying database...");

                // Assuming you have a function or variable called sequelize for database operations
                const orders = await sequelize.query(
                    "SELECT * FROM orders WHERE isActive=1",
                    {
                        type: sequelize.QueryTypes.SELECT,
                    }
                );

                // Store data in Redis cache with expiration time (e.g., 1 hour)
                await redis.setex("active_orders", 3600, JSON.stringify(orders));

                return res.json(orders);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    // Function to invalidate Redis cache when new data is inserted into the table
    invalidateCache: async () => {
      try {
          console.log("Invalidating Redis cache...");
          await redis.del("active_orders"); // Delete the key from Redis cache
      } catch (error) {
          console.error("Error invalidating cache:", error);
      }
  }
};


const getOrderFilter = {
  getOrderFilter: async (req, res) => {
      try {
          // Check if data exists in Redis cache
          await redis.del("filtered_orders");
          const { orderDate, customerNumber } = req.body;
          console.log("orderDate:",orderDate);
          // Construct SQL query with filter conditions
          let sql = 'SELECT * FROM ORDERS WHERE 1=1';

          if (orderDate) {
              sql += ` AND orderdate='${orderDate}'`;
          }

          if (customerNumber) {
              sql += ` AND customernumber=${customerNumber}`;
          }

          console.log("SQL Query:", sql);

          // Execute the SQL query
          const orders = await sequelize.query(sql, {
              type: sequelize.QueryTypes.SELECT,
          });

          // Check if any matching orders found
          if (orders.length === 0) {
              return res.status(400).json({ message: 'No matching orders found.' });
          }

          // Store data in Redis cache with expiration time (e.g., 1 hour)
          await redis.setex("filtered_orders", 3600, JSON.stringify(orders));

          return res.json(orders);
      } catch (error) {
          console.error("Error fetching items:", error);
          return res.status(500).json({ message: "Internal server error" });
      }
  },

  // Function to invalidate Redis cache when new data is inserted into the table
  invalidateCache: async () => {
      try {
          console.log("Invalidating Redis cache...");
          await redis.del("filtered_orders"); // Delete the key from Redis cache
      } catch (error) {
          console.error("Error invalidating cache:", error);
      }
  }
};





// Optionally handle process termination to gracefully close the Redis connection
process.on('SIGINT', async () => {
    await redis.quit();
    process.exit();
});

process.on('SIGTERM', async () => {
    await redis.quit();
    process.exit();
});


// Custom validation function to check if the date is valid
const isValidDate = (value) => {
  // Parse the date string
  const parts = value.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Check if the date is valid
  // Customize this validation logic according to your requirements
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 0 || day > 31) {
    throw new Error("Invalid date");
  }else if(value==='')throw new Error(" date field is required");

  return true;
};

const insertOrder = {
  insertOrder: async (req, res) => {
    try {
      // Validation rules
      const validationsRules = [
        check("orderDate").notEmpty().withMessage("Order date is required").isISO8601().withMessage("Invalid order date").custom(isValidDate),
        check("requiredDate").notEmpty().withMessage("Required date is required").isISO8601().withMessage("Invalid required date").custom(isValidDate),
        check("shippedDate").notEmpty().withMessage("Shipped date is required").isISO8601().withMessage("Invalid shipped date").custom(isValidDate),
        check("status").notEmpty().withMessage("Status is required"),
        check("customerNumber").if((value, { req }) => req.body.shippedDate !== '').notEmpty().withMessage("Customer number is required"),
      ];

      // Validate request body
      await Promise.all(validationsRules.map(validation => validation.run(req)));

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array()[0].msg);
        return res.status(400).json({ errors: errors.array()[0].msg });
      }

      // If validation passes, proceed with database operation
      const { orderDate, requiredDate, shippedDate, status, customerNumber } = req.body;

      // Perform database operation
      await sequelize.query(
        "INSERT INTO orders(orderDate, requiredDate, shippedDate, status, customerNumber) VALUES(?, ?, ?, ?, ?)",
        {
          replacements: [
            orderDate,
            requiredDate,
            shippedDate,
            status,
            customerNumber,
          ],
          type: sequelize.QueryTypes.INSERT,
        }
      );

      console.log("--------------->1<---------------------");
      // Call invalidateCache after successful insertion
      await getOrder.invalidateCache();
      await getOrderFilter.invalidateCache();
      res.status(201).json({
        message: "Order created successfully",
        orderDate,
        requiredDate,
        shippedDate,
        status,
        customerNumber,
      });
    } catch (error) {
      console.error("Error inserting order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

const udpateOrder = {
  udpateOrder: async (req, res) => {
    try {
      const orders = await sequelize.query(
        "update orders set isactive=1 where isactive=0",
        {
          type: sequelize.QueryTypes.UPDATE,
        }
      );
      const affectedRows = orders[1];
      console.log("sds=>", orders[0]);
        // Call invalidateCache after successful updation
        await getOrder.invalidateCache();
      res.status(201).json(affectedRows);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};



module.exports = {
  getOrder: getOrder.getOrder,
  insertOrder: insertOrder.insertOrder,
  udpateOrder: udpateOrder.udpateOrder,
  getOrderFilter: getOrderFilter.getOrderFilter
};

