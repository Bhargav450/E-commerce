const sequelize = require("../config/database");
const { validationResult, check } = require("express-validator");

const insertProduct = {
  insertProduct: async (req, res) => {
    const productsData = req.body;
    console.log(productsData);
    try {
      await sequelize.query(
        `INSERT INTO products ( productName, productLine, productScale, productVendor, productDescription, quantityInStock, buyPrice, MSRP) VALUES ${productsData
          .map(
            (product) =>
              `( '${product.productName}', '${product.productLine}', '${product.productScale}', '${product.productVendor}', '${product.productDescription}', ${product.quantityInStock}, ${product.buyPrice}, ${product.MSRP})`
          )
          .join(",")}`
      );
      res.status(201).json({
        message: "Products added successfully", 
        productsData,
      });
    } catch (error) {
      // If a Sequelize validation error occurs (e.g., duplicate record)
      if (error.name === "SequelizeUniqueConstraintError") {
        res
          .status(400)
          .json({ message: "Product already exist, please add new one!!!" });
      } else {
        // For other errors, send internal server error response
        console.error("Error creating item:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  },
};

const updateProduct = {
  updateProduct: async (req, res) => {
    const productCode = req.query.productCode; 
    console.log(productCode)
    console.log(typeof(productCode))
    const {  productName, productLine,  productScale, productVendor, productDescription, quantityInStock, buyPrice, MSRP } = req.body;

    try {
        const validationsRules = [
            check("productName").notEmpty().isString().withMessage("Product name is required"),
            check("productLine").notEmpty().isString().withMessage("Product line is required"),
            check("productScale").notEmpty().isString().withMessage("Product scale is required"),
            check("productVendor").notEmpty().isString().withMessage("Product vendor is required"),
            check("productDescription").notEmpty().isString().withMessage("Product description is required"),
            check("quantityInStock").notEmpty().isNumeric().withMessage("Quantity in stock is required"),
            check("buyPrice").notEmpty().isNumeric().withMessage("Buy price is required"),
            check("MSRP").notEmpty().isNumeric().withMessage("MSRP is required"),
          ];
          //validate request body
          await Promise.all(validationsRules.map(validation=>validation.run(req)));

          //check for validation error
          const errors=validationResult(req);
          if(!errors.isEmpty()){
            console.error("Validation errors:", errors.array()[0]);
            return res.status(400).json({ errors: errors.array()[0]});
          }

      const existingProduct = await sequelize.query(
        `SELECT *FROM products WHERE productCode='${productCode} LIMIT 1'`
      );
      console.log(existingProduct[0]);
      if (!existingProduct || existingProduct[0].length === 0) {
        // return res.status(404).json({ message: "Product Code not found!!!" });
        console.log("inside !existingProduct if block")
        await sequelize.query(
            `INSERT INTO products ( productName, productLine, productScale, productVendor, productDescription, quantityInStock, buyPrice, MSRP) VALUES ('${productName}', '${productLine}', '${productScale}', '${productVendor}', '${productDescription}', '${quantityInStock}', '${buyPrice}','${MSRP}')`
        );
        
        return res.status(200).json({message: "Product Inserted Successfully!!!"});
      }
    //   if (existingProduct[0][0].productName === productName) {
    //     return res
    //       .status(400)
    //       .json({ message: "Product name is the same, no update needed!!!" });
    //   }
    else {
        console.log(existingProduct);
        const updateQueryExistingCheck = await sequelize.query(
            `SELECT 1 FROM products WHERE productName = ? AND productCode != ?`,
            { replacements: [productName, productCode] }
        );
        console.log("update-------->>>>>>", updateQueryExistingCheck[0].length);
        if (updateQueryExistingCheck[0].length===0) {
            await sequelize.query(
                `UPDATE products SET productName=?, productLine=?, productScale=?, productVendor=?, productDescription=?, quantityInStock=?, buyPrice=?, MSRP=? WHERE productCode=?`,
                { replacements: [productName, productLine, productScale, productVendor, productDescription, quantityInStock, buyPrice, MSRP, productCode] }
            );
            return res.status(200).json({ message: "Product Updated Successfully!!!" });
        }
        else{
            return res
         .status(400) .json({ message: "Product name is the same, no update needed!!!" });
        }
    }
    
    } catch (error) { // If a Sequelize validation error occurs (e.g., duplicate record)
        // if (error.name === "SequelizeUniqueConstraintError") {
        //     const uniqueFields = error.errors.map(err => err.path);
        //     // Check if the error is due to a unique constraint on productName
        //     if (uniqueFields.includes('productName')) {
        //         return res.status(400).json({ message: "Product already exists with the same name, please add a new one!!!" });
        //     } else {
        //         // If the error is not related to productName, assume it's an update and proceed
        //         return res.status(200).json({ message: "Product Updated Successfully!!!" });
        //     }
        // } else {
            // For other errors, send internal server error response
            console.error("Error updating product:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
  },
};




const getProducts={
    getProducts:async(req,res)=>{
        try {
            const productsData=await sequelize.query('SELECT *FROM PRODUCTS');
            return res.json(productsData);
        } catch (error) {
            console.error("Error fetching items:", error);
           return res.status(500).json({ message: "Internal server error" });
        }
    }
}


// const updateProduct2 = {
//     updateProduct: async (req, res) => {
//       const { productCode, productName } = req.body;
  
//       try {
//         const existingProduct = await findOne
//         console.log(existingProduct);
//         if (!existingProduct || existingProduct[0].length === 0) {
//           return res.status(404).json({ message: "Product Code not found!!!" });
//         }
//         if (existingProduct[0][0].productName === productName) {
//           return res
//             .status(400)
//             .json({ message: "Product name is the same, no update needed!!!" });
//         }
  
//         console.log(existingProduct);
//         await sequelize.query(
//           `UPDATE products set productName='${productName}' where productCode='${productCode}'`
//         );
//         return res
//           .status(200)
//           .json({ message: "Product Updated Successfully!!!" });
//       } catch (error) {
//         // If a Sequelize validation error occurs (e.g., duplicate record)
//         if (error.name === "SequelizeUniqueConstraintError") {
//           return res
//             .status(400)
//             .json({ message: "Product already exist, please add new one!!!" });
//         } else {
//           // For other errors, send internal server error response
//           console.error("Error creating item:", error);
//           return res.status(500).json({ message: "Internal server error" });
//         }
//       }
//     },
//   };

module.exports = {
  insertProduct: insertProduct.insertProduct,
  updateProduct: updateProduct.updateProduct,
  getProducts:getProducts.getProducts
};
