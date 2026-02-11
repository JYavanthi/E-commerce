const jwt =require("jsonwebtoken");
const multer= require("multer");
const path= require("path");
const cors= require("cors");
const express = require("express");
const sql = require("mssql/msnodesqlv8");
const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const app= express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require("dotenv").config();

const { generateInvoice } = require("./services/invoiceService"); 
const PORT = process.env.PORT || 4000;

// // ------------------- DATABASE CONFIG -------------------
// const dbConfig = {
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   options: {
//     trustedConnection: true,
//     trustServerCertificate: true,
//   },
//   driver: "msnodesqlv8",
// };

const connectionString =
  "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-SVHEEK2\\SQLEXPRESS;Database=Brihati;Trusted_Connection=Yes;TrustServerCertificate=Yes;";

sql.connect({ connectionString })
  .then(() => console.log("✅ Connected to SQL Server successfully!"))
  .catch(err => {
    console.error("❌ Database connection failed:");
    console.error("🔍 Full error object:", JSON.stringify(err, null, 2));
    console.error("Raw error message:", err.message);
  });

  const dbConfig = {
  user: "sa",                 // 👈 your SQL username
  password: "YOUR_PASSWORD",  // 👈 your SQL password
  server: "localhost",        // 👈 or DESKTOP-XXXX
  database: "Brihati",
  options: {
    encrypt: false,           // 🔥 IMPORTANT for local SQL Server
    trustServerCertificate: true
  }
};

//api creation
app.get("/", (req, res) => {
  res.send(`✅ Server is running `);
});

app.listen(PORT,(error)=>{
  if(!error){
    console.log(`server running on port ${PORT}`);
  }
  else{
    console.log("error:"+error)
  }
})

//roles
app.get("/api/roles", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT TOP (1000)
        RoleID,
        RoleName,
        RoleCode,
        RoleDescription,
        Status,
        CreatedBy,
        CreatedDt,
        ModifiedBy,
        ModifiedDt
      FROM RoleMaster
    `);

    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });

  } catch (error) {
    console.error("❌ Error fetching roles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message
    });
  }
});

app.post("/api/roles", async (req, res) => {
  try {
    const {
      RoleName,
      RoleCode,
      RoleDescription,
      Status,
      CreatedBy
    } = req.body;

    // basic validation
    if (!RoleName || !RoleCode) {
      return res.status(400).json({
        success: false,
        message: "RoleName and RoleCode are required"
      });
    }

    const request = new sql.Request();

    request.input("RoleName", sql.NVarChar, RoleName);
    request.input("RoleCode", sql.NVarChar, RoleCode);
    request.input("RoleDescription", sql.NVarChar, RoleDescription);
    request.input("Status", sql.Bit, Status ?? 1);
    request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

    const query = `
      INSERT INTO RoleMaster
      (
        RoleName,
        RoleCode,
        RoleDescription,
        Status,
        CreatedBy,
        CreatedDt
      )
      VALUES
      (
        @RoleName,
        @RoleCode,
        @RoleDescription,
        @Status,
        @CreatedBy,
        GETDATE()
      )
    `;

    await request.query(query);

    res.status(201).json({
      success: true,
      message: "Role created successfully"
    });

  } catch (error) {
    console.error("❌ Error creating role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: error.message
    });
  }
});

//user registration/signup
// app.post("/api/users", async (req, res) => {
//   try {
//     const {
//       RoleID,
//       FirstName,
//       LastName,
//       Email,
//       ContactNo,
//       DOB,
//       Gender,
//       PasswordHash,
//       Status,
//       CreatedBy
//     } = req.body;

//     const pool = await sql.connect(dbConfig);

//     // 🔍 CHECK EXISTING USER
//     const existingUser = await pool.request()
//       .input("Email", sql.NVarChar, Email)
//       .input("ContactNo", sql.NVarChar, ContactNo)
//       .query(`
//         SELECT TOP 1 *
//         FROM UserMaster
//         WHERE Email = @Email OR ContactNo = @ContactNo
//       `);

//     if (existingUser.recordset.length > 0) {
//       const user = existingUser.recordset[0];

//       // 🟡 Deleted user → recovery flow
//       if (user.IsDeleted === true) {
//         return res.status(200).json({
//           success: false,
//           recover: true,
//           message: `Hi ${user.FirstName}, do you want to recover your account?`,
//           userData: {
//             UserID: user.UserID,
//             FirstName: user.FirstName,
//             Email: user.Email,
//             ContactNo: user.ContactNo
//           }
//         });
//       }

//       // 🔴 Active user
//       return res.status(409).json({
//         success: false,
//         message: "User already exists"
//       });
//     }

//     // ✅ CREATE NEW USER
//     const result = await pool.request()
//       .input("RoleID", sql.Int, RoleID)
//       .input("FirstName", sql.NVarChar, FirstName)
//       .input("LastName", sql.NVarChar, LastName)
//       .input("Email", sql.NVarChar, Email)
//       .input("ContactNo", sql.NVarChar, ContactNo)
//       .input("DOB", sql.Date, DOB)
//       .input("Gender", sql.NVarChar, Gender)
//       .input("PasswordHash", sql.NVarChar, PasswordHash)
//       .input("Status", sql.Bit, 1)
//       .input("CreatedBy", sql.Int, CreatedBy ?? 1)
//       .query(`
//         INSERT INTO UserMaster (
//           RoleID, FirstName, LastName, Email, ContactNo, DOB, Gender,
//           PasswordHash, Status, CreatedBy, CreatedDt, IsDeleted
//         )
//         OUTPUT INSERTED.UserID
//         VALUES (
//           @RoleID, @FirstName, @LastName, @Email, @ContactNo, @DOB, @Gender,
//           @PasswordHash, 1, @CreatedBy, GETDATE(), 0
//         )
//       `);

//     res.status(201).json({
//       success: true,
//       userId: result.recordset[0].UserID,
//       message: "User created successfully"
//     });

//   } catch (error) {
//     console.error("❌ Signup error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Signup failed",
//       error: error.message
//     });
//   }
// });

app.post("/api/users", async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Email,
      ContactNo,
      DOB,
      Gender,
      PasswordHash,
      CreatedBy
    } = req.body;

    const pool = await sql.connect(dbConfig);

    // 🔍 CHECK EXISTING USER
    const existingUser = await pool.request()
      .input("Email", sql.NVarChar, Email)
      .input("ContactNo", sql.NVarChar, ContactNo)
      .query(`
        SELECT TOP 1 *
        FROM UserMaster
        WHERE Email = @Email OR ContactNo = @ContactNo
      `);

    if (existingUser.recordset.length > 0) {
      const user = existingUser.recordset[0];

      if (user.IsDeleted === true) {
        return res.status(200).json({
          success: false,
          recover: true,
          message: `Hi ${user.FirstName}, do you want to recover your account?`,
          userData: {
            UserID: user.UserID,
            FirstName: user.FirstName,
            Email: user.Email,
            ContactNo: user.ContactNo
          }
        });
      }

      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // ✅ ALWAYS CUSTOMER ROLE
    const CUSTOMER_ROLE_ID = 5;

    const result = await pool.request()
      .input("RoleID", sql.Int, CUSTOMER_ROLE_ID)   // 🔥 forced
      .input("FirstName", sql.NVarChar, FirstName)
      .input("LastName", sql.NVarChar, LastName)
      .input("Email", sql.NVarChar, Email)
      .input("ContactNo", sql.NVarChar, ContactNo)
      .input("DOB", sql.Date, DOB)
      .input("Gender", sql.NVarChar, Gender)
      .input("PasswordHash", sql.NVarChar, PasswordHash)
      .input("Status", sql.Bit, 1)
      .input("CreatedBy", sql.Int, CreatedBy ?? 1)
      .query(`
        INSERT INTO UserMaster (
          RoleID, FirstName, LastName, Email, ContactNo, DOB, Gender,
          PasswordHash, Status, CreatedBy, CreatedDt, IsDeleted
        )
        OUTPUT INSERTED.UserID
        VALUES (
          @RoleID, @FirstName, @LastName, @Email, @ContactNo, @DOB, @Gender,
          @PasswordHash, 1, @CreatedBy, GETDATE(), 0
        )
      `);

    res.status(201).json({
      success: true,
      userId: result.recordset[0].UserID,
      roleId: CUSTOMER_ROLE_ID,
      message: "Customer registered successfully"
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message
    });
  }
});

//untouched
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const request = new sql.Request();
    request.input("UserID", sql.Int, id);

    const result = await request.query(`
      SELECT
        UserID,
        RoleID,
        FirstName,
        LastName,
        Email,
        ContactNo,
        DOB,
        Gender,
        Status,
        CreatedBy,
        CreatedDt,
        ModifiedBy,
        ModifiedDt
      FROM UserMaster
      WHERE UserID = @UserID
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.recordset[0],
    });

  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

//user login
// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { EmailOrPhone, Password } = req.body;

//     const request = new sql.Request();
//     request.input("value", sql.NVarChar, EmailOrPhone);

//     const result = await request.query(`
//       SELECT TOP 1 *
//       FROM UserMaster
//       WHERE (Email = @value OR ContactNo = @value)
//        AND isDeleted=0
//     `);
    
//     const user = result.recordset[0];

  
//     // ❌ No user
//     if (result.recordset.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // ❌ Wrong password
//     if (user.PasswordHash !== Password) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid password"
//       });
//     }

//     // ✅ Success login
//     res.json({
//       success: true,
//       message: "Login successful",
//       user: {
//         UserID: user.UserID,
//         FirstName: user.FirstName,
//         Email: user.Email
//       }
//     });

//   } catch (error) {
//     console.error("❌ Login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Login failed"
//     });
//   }
// });

app.post("/api/auth/login", async (req, res) => {
  try {
    const { EmailOrPhone, Password } = req.body;

    const request = new sql.Request();
    request.input("value", sql.NVarChar, EmailOrPhone);

    const result = await request.query(`
      SELECT TOP 1 *
      FROM UserMaster
      WHERE (Email = @value OR ContactNo = @value)
        AND IsDeleted = 0
    `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.recordset[0];

    if (user.PasswordHash !== Password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    // ✅ SUCCESS
    res.json({
      success: true,
      message: "Login successful",
      user: {
        UserID: user.UserID,
        FirstName: user.FirstName,
        Email: user.Email,
        RoleID: user.RoleID   // 🔥 important
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

//delete account
app.put("/api/users/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;

    await new sql.Request()
      .input("UserID", sql.Int, id)
      .query(`
        UPDATE UserMaster
        SET IsDeleted = 1,
            DeletedAt = GETDATE(),
            Status = 0
        WHERE UserID = @UserID
      `);

    res.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// recover account
app.put("/api/users/:id/recover", async (req, res) => {
  try {
    const { id } = req.params;

    await new sql.Request()
      .input("UserID", sql.Int, id)
      .query(`
        UPDATE UserMaster
        SET IsDeleted = 0,
            DeletedAt = NULL,
            Status = 1
        WHERE UserID = @UserID
      `);

    res.json({
      success: true,
      message: "Account recovered successfully"
    });

  } catch (err) {
    console.error("❌ Recover error:", err);
    res.status(500).json({ message: "Recovery failed" });
  }
});

//to display products from product master table
app.get("/api/products", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const query = `
      SELECT 
        p.ProductID,
        p.ProductName,
        p.ProductDescription,
        p.ProductWeight,
        c.CategoryName,
        pp.Price
      FROM ProductMaster p
      LEFT JOIN ProductCategory c 
        ON p.ProductCategoryID = c.ProductCategoryID
      LEFT JOIN ProductPriceMaster pp 
        ON p.ProductID = pp.ProductID
    `;

    const result = await pool.request().query(query);

    console.log("SQL RESULT 👉", result.recordset);

    const products = result.recordset.map(item => ({
      ProductID: item.ProductID,
      ProductName: item.ProductName,
      ProductDescription: item.ProductDescription,
      ProductWeight: item.ProductWeight,
      CategoryName: item.CategoryName,
      Price: item.Price,
      ImageUrl: `${item.ProductID}.jpg`,
    }));

    res.json(products);

  } catch (err) {
    console.error("PRODUCT API FAILED ❌", err);
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

//to display ind products by id
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const request = new sql.Request();
    request.input("id", sql.Int, id);

    const result = await request.query(`
      SELECT 
        p.ProductID,
        p.ProductName,
        p.ProductDescription,
        p.Quantity AS ProductWeight,
        ISNULL(pr.Price, 0) AS Price,
        ISNULL(pr.DiscountPrice, 0) AS DiscountPrice
      FROM ProductMaster p
      LEFT JOIN ProductPriceMaster pr 
        ON p.ProductID = pr.ProductID
      WHERE p.ProductID = @id
    `);

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error("🔥 SINGLE PRODUCT API ERROR:", err);
    res.status(500).json({
      error: "Single product fetch failed",
      details: err.message
    });
  }
});

//to add products to product master table
app.post("/api/products", async (req, res) => {
  try { 
    const {
      ProductCategoryID,
      ProductName,
      ProductCode,
      ProductDescription,
      Quantity,
      SKU,
      Status,
      IsFeatured,
      CreatedBy
    } = req.body;

    // Basic validation
    if (!ProductCategoryID || !ProductName) {
      return res.status(400).json({
        success: false,
        message: "ProductCategoryID and ProductName are required"
      });
    }

    const request = new sql.Request();

    request.input("ProductCategoryID", sql.Int, ProductCategoryID);
    request.input("ProductName", sql.NVarChar, ProductName);
    request.input("ProductCode", sql.NVarChar, ProductCode ?? null);
    request.input("ProductDescription", sql.NVarChar, ProductDescription ?? null);
    request.input("Quantity", sql.Int, Quantity ?? 0);
    request.input("SKU", sql.NVarChar, SKU ?? null);
    request.input("Status", sql.Bit, Status ?? 1);
    request.input("IsFeatured", sql.Bit, IsFeatured ?? 0);
    request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

    const query = `
      INSERT INTO dbo.ProductMaster
      (
        ProductCategoryID,
        ProductName,
        ProductCode,
        ProductDescription,
        Quantity,
        SKU,
        Status,
        IsFeatured,
        CreatedBy,
        CreatedDt
      )
      OUTPUT INSERTED.ProductID
      VALUES
      (
        @ProductCategoryID,
        @ProductName,
        @ProductCode,
        @ProductDescription,
        @Quantity,
        @SKU,
        @Status,
        @IsFeatured,
        @CreatedBy,
        GETDATE()
      )
    `;

    const result = await request.query(query);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      ProductID: result.recordset[0].ProductID
    });

  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
});

//product categories
app.get("/api/product-categories", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT
        ProductCategoryID,
        CategoryName,
        CategoryDescription,
        Status,
        DisplayOrder,
        CreatedBy,
        CreatedDt,
        ModifiedBy,
        ModifiedDt
      FROM dbo.ProductCategory
      ORDER BY DisplayOrder ASC
    `);

    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });

  } catch (error) {
    console.error("❌ Error fetching product categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product categories",
      error: error.message
    });
  }
});

//adding product categories to product category table
app.post("/api/product-categories", async (req, res) => {
  try {
    const {
      CategoryName,
      CategoryDescription,
      Status,
      DisplayOrder,
      CreatedBy
    } = req.body;

    // Basic validation
    if (!CategoryName) {
      return res.status(400).json({
        success: false,
        message: "CategoryName is required"
      });
    }

    const request = new sql.Request();

    request.input("CategoryName", sql.NVarChar, CategoryName);
    request.input("CategoryDescription", sql.NVarChar, CategoryDescription ?? null);
    request.input("Status", sql.Bit, Status ?? 1);
    request.input("DisplayOrder", sql.Int, DisplayOrder ?? 0);
    request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

    const query = `
      INSERT INTO dbo.ProductCategory
      (
        CategoryName,   
        CategoryDescription,
        Status,
        DisplayOrder,
        CreatedBy,
        CreatedDt
      )
      OUTPUT INSERTED.ProductCategoryID
      VALUES
      (
        @CategoryName,
        @CategoryDescription,
        @Status,
        @DisplayOrder,
        @CreatedBy,
        GETDATE()
      )
    `;

    const result = await request.query(query);

    res.status(201).json({
      success: true,
      message: "Product category created successfully",
      ProductCategoryID: result.recordset[0].ProductCategoryID
    });

  } catch (error) {
    console.error("❌ Error creating product category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product category",
      error: error.message
    });
  }
});

//product prices
app.get("/api/product-prices", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT TOP (1000)
        PriceID,
        ProductID,
        Price,
        DiscountPrice,
        ValidFrom,
        ValidTo,
        CreatedBy,
        CreatedDt,
        ModifiedBy,
        ModifiedDt
      FROM Brihati.dbo.ProductPriceMaster
      ORDER BY CreatedDt DESC
    `);

    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });

  } catch (error) {
    console.error("❌ Error fetching product prices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product prices",
      error: error.message
    });
  }
});

//adding product prices to product price master table
app.post("/api/product-prices", async (req, res) => {
  try {
    const {
      ProductID,
      Price,
      DiscountPrice,
      ValidFrom,
      ValidTo,
      CreatedBy
    } = req.body;

    // Basic validation
    if (!ProductID || Price === undefined) {
      return res.status(400).json({
        success: false,
        message: "ProductID and Price are required"
      });
    }

    if (DiscountPrice && DiscountPrice > Price) {
      return res.status(400).json({
        success: false,
        message: "DiscountPrice cannot be greater than Price"
      });
    }

    const request = new sql.Request();

    request.input("ProductID", sql.Int, ProductID);
    request.input("Price", sql.Decimal(10, 2), Price);
    request.input("DiscountPrice", sql.Decimal(10, 2), DiscountPrice ?? null);
    request.input("ValidFrom", sql.DateTime, ValidFrom ?? new Date());
    request.input("ValidTo", sql.DateTime, ValidTo ?? null);
    request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

    const query = `
      INSERT INTO Brihati.dbo.ProductPriceMaster
      (
        ProductID,
        Price,
        DiscountPrice,
        ValidFrom,
        ValidTo,
        CreatedBy,
        CreatedDt
      )
      OUTPUT INSERTED.PriceID
      VALUES
      (
        @ProductID,
        @Price,
        @DiscountPrice,
        @ValidFrom,
        @ValidTo,
        @CreatedBy,
        GETDATE()
      )
    `;

    const result = await request.query(query);

    res.status(201).json({
      success: true,
      message: "Product price created successfully",
      PriceID: result.recordset[0].PriceID
    });

  } catch (error) {
    console.error("❌ Error creating product price:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product price",
      error: error.message
    });
  }
});

//displaying the products based on their categories
app.get("/api/categories", async (req, res) => {
  try {
    const result = await new sql.Request().query(`
      SELECT 
        ProductCategoryID,
        CategoryName
      FROM ProductCategory
      WHERE Status = 1
      ORDER BY DisplayOrder ASC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Categories API Error:", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
});

// app.get("/api/products/category/:categoryId", async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     const result = await new sql.Request()
//       .input("ProductCategoryID", sql.Int, categoryId)
//       .query(`
//         SELECT 
//           pm.ProductID,
//           pm.ProductName,
//           pm.ProductDescription,
//           pm.ProductWeight,
//           ppm.Price,
//           ppm.DiscountPrice
//         FROM ProductMaster pm
//         INNER JOIN ProductPriceMaster ppm 
//           ON pm.ProductID = ppm.ProductID
//         WHERE pm.ProductCategoryID = @ProductCategoryID
//           AND pm.Status = 1
//           AND GETDATE() BETWEEN ISNULL(ppm.ValidFrom, GETDATE())
//                           AND ISNULL(ppm.ValidTo, GETDATE())
//         ORDER BY pm.CreatedDt DESC
//       `);

//     res.json(result.recordset);
//   } catch (err) {
//     console.error("❌ Products by Category API Error:", err);
//     res.status(500).json({ message: "Failed to load products" });
//   }
// });


//getting cart items from cart table
app.get("/api/products/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    const result = await new sql.Request()
      .input("ProductCategoryID", sql.Int, categoryId)
      .query(`
        SELECT 
          pm.ProductID,
          pm.ProductName,
          pm.ProductDescription,
          pm.ProductWeight,
          ISNULL(ppm.Price, 0) AS Price,
          ISNULL(ppm.DiscountPrice, 0) AS DiscountPrice
        FROM ProductMaster pm
        LEFT JOIN ProductPriceMaster ppm 
          ON pm.ProductID = ppm.ProductID
        WHERE pm.ProductCategoryID = @ProductCategoryID
          AND pm.Status = 1
        ORDER BY pm.CreatedDt DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Products by Category API Error:", err);
    res.status(500).json({ message: "Failed to load products" });
  }
});


//to get the cart items based on the userid from the database
app.get("/api/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT
          c.CartID,
          c.ProductID,
          c.Quantity,
          p.ProductName,
          p.ProductWeight,
          pp.Price
        FROM Cart c
        INNER JOIN ProductMaster p ON c.ProductID = p.ProductID
        LEFT JOIN ProductPriceMaster pp ON p.ProductID = pp.ProductID
        WHERE c.UserID = @UserID
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//adding items to cart table
app.post("/api/cart", async (req, res) => {
  try {
    const { UserID, ProductID, Quantity = 1 } = req.body;

    if (!UserID || !ProductID) {
      return res.status(400).json({
        success: false,
        message: "UserID and ProductID are required",
      });
    }

    const pool = await sql.connect(dbConfig);

    // 1️⃣ Check if product already exists in cart
    const existing = await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("ProductID", sql.Int, ProductID)
      .query(`
        SELECT CartID, Quantity
        FROM Cart
        WHERE UserID = @UserID AND ProductID = @ProductID
      `);

    // 2️⃣ If exists → update quantity
    if (existing.recordset.length > 0) {
      const cart = existing.recordset[0];

      await pool.request()
        .input("CartID", sql.Int, cart.CartID)
        .input("UserID", sql.Int, UserID)
        .input("Quantity", sql.Int, Quantity)
        .query(`
          UPDATE Cart
          SET Quantity = Quantity + @Quantity,
              ModifiedBy = @UserID,
              ModifiedDt = GETDATE()
          WHERE CartID = @CartID
        `);

      return res.status(200).json({
        success: true,
        cartId: cart.CartID,
        quantity: cart.Quantity + Quantity,
        message: "Cart quantity updated",
      });
    }

    // 3️⃣ If not exists → insert new row
    const insert = await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("ProductID", sql.Int, ProductID)
      .input("Quantity", sql.Int, Quantity)
      .input("CreatedBy", sql.Int, UserID)
      .query(`
        INSERT INTO Cart
        (
          UserID,
          ProductID,
          Quantity,
          DateAdded,
          CreatedBy,
          CreatedDt
        )
        OUTPUT INSERTED.CartID
        VALUES
        (
          @UserID,
          @ProductID,
          @Quantity,
          GETDATE(),
          @CreatedBy,
          GETDATE()
        )
      `);

    res.status(201).json({
      success: true,
      cartId: insert.recordset[0].CartID,
      quantity: Quantity,
      message: "Product added to cart",
    });

  } catch (err) {
    console.error("❌ Cart insert error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
    });
  }
});

//icrease/decrease cart item quantity
app.put("/api/cart/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const { action, userId } = req.body;

  const pool = await sql.connect(dbConfig);

  const delta = action === "increase" ? 1 : -1;

  await pool.request()
    .input("CartID", sql.Int, cartId)
    .input("UserID", sql.Int, userId)
    .query(`
      UPDATE Cart
      SET Quantity = CASE 
        WHEN Quantity + (${delta}) < 1 THEN 1
        ELSE Quantity + (${delta})
      END,
      ModifiedBy = @UserID,
      ModifiedDt = GETDATE()
      WHERE CartID = @CartID
    `);

  res.json({ success: true });
});

//remove item from cart
app.delete("/api/cart/:cartId", async (req, res) => {
  const { cartId } = req.params;

  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("CartID", sql.Int, cartId)
      .query(`
        DELETE FROM Cart WHERE CartID = @CartID
      `);

    res.json({ message: "Item removed from cart" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//adding items to wishlist table  
app.post("/api/wishlist", async (req, res) => {
  try {
    const { UserID, ProductID } = req.body;

    if (!UserID || !ProductID) {
      return res.status(400).json({
        success: false,
        message: "UserID and ProductID are required"
      });
    }

    const pool = await sql.connect(dbConfig);

    const exists = await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("ProductID", sql.Int, ProductID)
      .query(`
        SELECT 1 FROM Wishlist
        WHERE UserID = @UserID AND ProductID = @ProductID
      `);

    if (exists.recordset.length > 0) {
      return res.json({
        success: true,
        message: "Already in wishlist"
      });
    }

    const insertResult = await pool.request()
      .input("UserID", sql.Int, UserID)
      .input("ProductID", sql.Int, ProductID)
      .query(`
        INSERT INTO Wishlist (UserID, ProductID, CreatedDt,CreatedBy)
        VALUES (@UserID, @ProductID, GETDATE(), @UserID)
      `);

    if (insertResult.rowsAffected[0] === 0) {
      throw new Error("Insert failed — no rows affected");
    }

    res.status(201).json({
      success: true,
      message: "Added to wishlist"
    });

  } catch (err) {
    console.error("❌ REAL WISHLIST INSERT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add wishlist"
    });
  }
});

//getting wishlist items from wishlist table
app.get("/api/wishlist/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT 
          w.WishlistID,
          p.ProductID,
          p.ProductName,
          p.ProductDescription,
          p.ProductWeight,
                       
          pm.Price
        FROM Wishlist w
        INNER JOIN ProductMaster p ON p.ProductID = w.ProductID
        LEFT JOIN ProductPriceMaster pm ON pm.ProductID = p.ProductID
        WHERE w.UserID = @UserID
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Wishlist fetch error:", err);
    res.status(500).json({ message: "Failed to load wishlist" });
  }
});

//remove item from wishlist
app.delete("/api/wishlist/:wishlistId", async (req, res) => {
  const pool = await sql.connect(dbConfig);

  await pool.request()
    .input("WishlistID", sql.Int, req.params.wishlistId)
    .query("DELETE FROM Wishlist WHERE WishlistID = @WishlistID");

  res.json({ success: true });
});

//phonepe merchant details
const MERCHANT_ID = "M222NJL8ZHVEM";
const SALT_KEY = "3013c44a-99b1-4482-88b7-b1387e079b49";
const SALT_INDEX = "1";

//creating order details and delivery details and also the invoice(which in cludes deliveryId,shippingmode,) and  storing it in the db.
// app.post("/api/order/create", async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       totalAmount,
//       taxAmount,
//       paymentMode,
//       shippingAddress   // optional (if you have address table)
//     } = req.body;

//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "Cart empty" });
//     }

//     /* =========================
//        1️⃣ CREATE ORDER MASTER
//     ========================= */

//     const orderResult = await new sql.Request()
//       .input("UserID", sql.Int, userId)
//       .input("TotalAmount", sql.Decimal(10, 2), totalAmount)
//       .input("TaxAmount", sql.Decimal(10, 2), taxAmount)
//       .input("PaymentMode", sql.VarChar(20), paymentMode || "DUMMY")
//       .input("PaymentStatus", sql.VarChar(20), "PENDING")
//       .input("OrderStatus", sql.VarChar(20), "CREATED")
//       .input("CreatedBy", sql.Int, userId)
//       .query(`
//         INSERT INTO OrderMaster
//         (
//           UserID,
//           OrderDate,
//           TotalAmount,
//           TaxAmount,
//           PaymentMode,
//           PaymentStatus,
//           OrderStatus,
//           CreatedBy,
//           CreatedDt
//         )
//         OUTPUT INSERTED.OrderID
//         VALUES
//         (
//           @UserID,
//           GETDATE(),
//           @TotalAmount,
//           @TaxAmount,
//           @PaymentMode,
//           @PaymentStatus,
//           @OrderStatus,
//           @CreatedBy,
//           GETDATE()
//         )
//       `);

//     const orderId = orderResult.recordset[0].OrderID;

//     /* =========================
//        2️⃣ INSERT ORDER DETAILS
//     ========================= */

//     for (const item of cartItems) {
//       const unitPrice = item.unitPrice;
//       const quantity = item.quantity;
//       const totalPrice = unitPrice * quantity;

//       await new sql.Request()
//         .input("OrderID", sql.Int, orderId)
//         .input("ProductID", sql.Int, item.productId)
//         .input("Quantity", sql.Int, quantity)
//         .input("UnitPrice", sql.Decimal(10, 2), unitPrice)
//         .input("TotalPrice", sql.Decimal(10, 2), totalPrice)
//         .input("CreatedBy", sql.Int, userId)
//         .query(`
//           INSERT INTO OrderDetails
//           (OrderID, ProductID, Quantity, UnitPrice, TotalPrice, CreatedBy, CreatedDt)
//           VALUES
//           (@OrderID, @ProductID, @Quantity, @UnitPrice, @TotalPrice, @CreatedBy, GETDATE())
//         `);
//     }

//     /* =========================
//        3️⃣ AUTO CREATE DELIVERY
//     ========================= */

//     const expectedDate = new Date();
//     expectedDate.setDate(expectedDate.getDate() + 5); // +5 days delivery

//     await new sql.Request()
//       .input("OrderID", sql.Int, orderId)
//       .input("UserID", sql.Int, userId)
//       .input("ShippingMode", sql.VarChar(50), "STANDARD")
//       .input("FromLocation", sql.VarChar(100), "Main Warehouse")
//       .input("ToLocation", sql.VarChar(100), shippingAddress?.city || "Customer Address")
//       .input("DeliveryStatus", sql.VarChar(50), "DELIVERY_PENDING")
//       .input("ExpectedDeliveryDate", sql.DateTime, expectedDate)
//       .input("CreatedBy", sql.Int, userId)
//       .query(`
//         INSERT INTO Delivery
//         (
//           OrderID,
//           UserID,
//           ShippingMode,
//           FromLocation,
//           ToLocation,
//           DeliveryStatus,
//           ExpectedDeliveryDate,
//           CreatedBy,
//           CreatedDt
//         )
//         VALUES
//         (
//           @OrderID,
//           @UserID,
//           @ShippingMode,
//           @FromLocation,
//           @ToLocation,
//           @DeliveryStatus,
//           @ExpectedDeliveryDate,
//           @CreatedBy,
//           GETDATE()
//         )
//       `);

//     /* =========================
//        4️⃣ RESPONSE
//     ========================= */

//     res.json({
//       success: true,
//       orderId,
//       message: "Order + Delivery created successfully"
//     });

//   } catch (err) {
//     console.error("❌ ORDER CREATE ERROR:", err);
//     res.status(500).json({
//       message: "Order creation failed",
//       error: err.message
//     });
//   }
// });

// app.post("/api/order/create", async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       totalAmount,
//       taxAmount,
//       paymentMode
//     } = req.body;

//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "Cart empty" });
//     }

//     // 1️⃣ CREATE ORDER MASTER
//     const orderResult = await new sql.Request()
//       .input("UserID", sql.Int, userId)
//       .input("TotalAmount", sql.Decimal(10, 2), totalAmount)
//       .input("TaxAmount", sql.Decimal(10, 2), taxAmount)
//       .input("PaymentMode", sql.VarChar(20), paymentMode || "DUMMY")
//       .input("PaymentStatus", sql.VarChar(20), "PENDING")
//       .input("OrderStatus", sql.VarChar(20), "CREATED")
//       .input("CreatedBy", sql.Int, userId)
//       .query(`
//         INSERT INTO OrderMaster
//         (
//           UserID,
//           OrderDate,
//           TotalAmount,
//           TaxAmount,
//           PaymentMode,
//           PaymentStatus,
//           OrderStatus,
//           CreatedBy,
//           CreatedDt
//         )
//         OUTPUT INSERTED.OrderID
//         VALUES
//         (
//           @UserID,
//           GETDATE(),
//           @TotalAmount,
//           @TaxAmount,
//           @PaymentMode,
//           @PaymentStatus,
//           @OrderStatus,
//           @CreatedBy,
//           GETDATE()
//         )
//       `);

//     const orderId = orderResult.recordset[0].OrderID;

//     // 2️⃣ INSERT ORDER DETAILS
//     for (const item of cartItems) {
//       const unitPrice = item.unitPrice;
//       const quantity = item.quantity;
//       const totalPrice = unitPrice * quantity;

//       await new sql.Request()
//         .input("OrderID", sql.Int, orderId)
//         .input("ProductID", sql.Int, item.productId)
//         .input("Quantity", sql.Int, quantity)
//         .input("UnitPrice", sql.Decimal(10, 2), unitPrice)
//         .input("TotalPrice", sql.Decimal(10, 2), totalPrice)
//         .input("CreatedBy", sql.Int, userId)
//         .query(`
//           INSERT INTO OrderDetails
//           (OrderID, ProductID, Quantity, UnitPrice, TotalPrice, CreatedBy, CreatedDt)
//           VALUES
//           (@OrderID, @ProductID, @Quantity, @UnitPrice, @TotalPrice, @CreatedBy, GETDATE())
//         `);
//     }

//     res.json({
//       success: true,
//       orderId
//     });

//   } catch (err) {
//     console.error("❌ ORDER CREATE ERROR:", err);
//     res.status(500).json({
//       message: "Order creation failed",
//       error: err.message
//     });
//   }
// });

//getting the order details from database to post it in payment success page
app.post("/api/order/create", async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      totalAmount,
      taxAmount,
      paymentMode,
      shippingAddress
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    /* =========================
       1️⃣ CREATE ORDER MASTER
    ========================= */

    const orderResult = await new sql.Request()
      .input("UserID", sql.Int, userId)
      .input("TotalAmount", sql.Decimal(10, 2), totalAmount)
      .input("TaxAmount", sql.Decimal(10, 2), taxAmount)
      .input("PaymentMode", sql.VarChar(20), paymentMode || "DUMMY")
      .input("PaymentStatus", sql.VarChar(20), "SUCCESS")
      .input("OrderStatus", sql.VarChar(20), "CONFIRMED")
      .input("CreatedBy", sql.Int, userId)
      .query(`
        INSERT INTO OrderMaster
        (
          UserID,
          OrderDate,
          TotalAmount,
          TaxAmount,
          PaymentMode,
          PaymentStatus,
          OrderStatus,
          CreatedBy,
          CreatedDt
        )
        OUTPUT INSERTED.OrderID
        VALUES
        (
          @UserID,
          GETDATE(),
          @TotalAmount,
          @TaxAmount,
          @PaymentMode,
          @PaymentStatus,
          @OrderStatus,
          @CreatedBy,
          GETDATE()
        )
      `);

    const orderId = orderResult.recordset[0].OrderID;

    /* =========================
       2️⃣ INSERT ORDER DETAILS
    ========================= */

    for (const item of cartItems) {
      const unitPrice = item.unitPrice;
      const quantity = item.quantity;
      const totalPrice = unitPrice * quantity;

      await new sql.Request()
        .input("OrderID", sql.Int, orderId)
        .input("ProductID", sql.Int, item.productId)
        .input("Quantity", sql.Int, quantity)
        .input("UnitPrice", sql.Decimal(10, 2), unitPrice)
        .input("TotalPrice", sql.Decimal(10, 2), totalPrice)
        .input("CreatedBy", sql.Int, userId)
        .query(`
          INSERT INTO OrderDetails
          (OrderID, ProductID, Quantity, UnitPrice, TotalPrice, CreatedBy, CreatedDt)
          VALUES
          (@OrderID, @ProductID, @Quantity, @UnitPrice, @TotalPrice, @CreatedBy, GETDATE())
        `);
    }

    /* =========================
       3️⃣ AUTO CREATE DELIVERY
    ========================= */

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 5);

    await new sql.Request()
      .input("OrderID", sql.Int, orderId)
      .input("UserID", sql.Int, userId)
      .input("ShippingMode", sql.VarChar(50), "STANDARD")
      .input("FromLocation", sql.VarChar(100), "Main Warehouse")
      .input("ToLocation", sql.VarChar(100), shippingAddress?.city || "Customer Address")
      .input("DeliveryStatus", sql.VarChar(50), "ORDER_CONFIRMED")
      .input("ExpectedDeliveryDate", sql.DateTime, expectedDate)
      .input("CreatedBy", sql.Int, userId)
      .query(`
        INSERT INTO Delivery
        (
          OrderID,
          UserID,
          ShippingMode,
          FromLocation,
          ToLocation,
          DeliveryStatus,
          ExpectedDeliveryDate,
          CreatedBy,
          CreatedDt
        )
        VALUES
        (
          @OrderID,
          @UserID,
          @ShippingMode,
          @FromLocation,
          @ToLocation,
          @DeliveryStatus,
          @ExpectedDeliveryDate,
          @CreatedBy,
          GETDATE()
        )
      `);

    /* =========================
       4️⃣ AUTO GENERATE INVOICE
    ========================= */

     /* =========================
   AUTO GENERATE INVOICE
========================= */

await generateInvoice({
  orderId,
  userId,
  shippingAddress: `${shippingAddress?.addressLine || ""}, ${shippingAddress?.city || ""}`,
  items: cartItems.map(item => ({
    name: item.productName || `Product ${item.productId}`,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.unitPrice * item.quantity
  })),
  subtotal: totalAmount - taxAmount,
  tax: taxAmount,
  totalAmount
});


    /* =========================
       5️⃣ RESPONSE
    ========================= */

    res.json({
      success: true,
      orderId,
      invoiceUrl: `http://localhost:4000/api/order/${orderId}/invoice`,
      message: "Order + Delivery + Invoice created successfully"
    });

  } catch (err) {
    console.error("❌ ORDER CREATE ERROR:", err);
    res.status(500).json({
      message: "Order creation failed",
      error: err.message
    });
  }
});

app.get("/api/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // 1️⃣ Get order master
    const orderResult = await new sql.Request()
      .input("OrderID", sql.Int, orderId)
      .query(`
        SELECT 
          o.OrderID,
          o.OrderDate,
          o.TotalAmount,
          o.TaxAmount,
          o.PaymentMode,
          o.PaymentStatus,
          o.OrderStatus
        FROM OrderMaster o
        WHERE o.OrderID = @OrderID
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.recordset[0];

    // 2️⃣ Get order items
    const itemsResult = await new sql.Request()
      .input("OrderID", sql.Int, orderId)
      .query(`
        SELECT 
          p.ProductName,
          od.Quantity,
          od.UnitPrice,
          od.TotalPrice
        FROM OrderDetails od
        JOIN ProductMaster p ON od.ProductID = p.ProductID
        WHERE od.OrderID = @OrderID
      `);

    const items = itemsResult.recordset.map(item => ({
      productName: item.ProductName,
      weight: "200gms", // or from DB
      qty: item.Quantity,
      price: item.TotalPrice,
      // imageUrl: item.ProductImage || "https://via.placeholder.com/60"
    }));

    // 3️⃣ Response
    res.json({
      orderId: order.OrderID,
      transactionDate: new Date(order.OrderDate).toDateString(),
      paymentMethod: order.PaymentMode,
      shippingMethod: "Shiprocket",
      subtotal: order.TotalAmount,
      gst: order.TaxAmount,
      shipping: 40,
      total: order.TotalAmount + order.TaxAmount + 40,
      items
    });

  } catch (err) {
    console.error("❌ ORDER FETCH ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch order",
      error: err.message
    });
  }
});

//getting the order details to post it in my orders page
app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Order master
    const ordersResult = await new sql.Request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT 
          o.OrderID,
          o.OrderDate,
          o.OrderStatus,
          o.PaymentStatus
        FROM OrderMaster o
        WHERE o.UserID = @UserID
        ORDER BY o.OrderDate DESC
      `);

    const orders = [];

    for (let order of ordersResult.recordset) {
      // order items
      const itemsResult = await new sql.Request()
        .input("OrderID", sql.Int, order.OrderID)
        .query(`
          SELECT 
            p.ProductName,
            od.Quantity,
            od.UnitPrice,
            od.TotalPrice
          FROM OrderDetails od
          JOIN ProductMaster p ON od.ProductID = p.ProductID
          WHERE od.OrderID = @OrderID
        `);

      orders.push({
        orderId: order.OrderID,
        orderDate: new Date(order.OrderDate).toDateString(),
        orderStatus: order.OrderStatus,
        paymentStatus: order.PaymentStatus,
        items: itemsResult.recordset.map(i => ({
          productName: i.ProductName,
          qty: i.Quantity,
          price: i.TotalPrice,
          weight: "200gms",
          imageUrl: "https://via.placeholder.com/80"
        }))
      });
    }

    res.json({ success: true, data: orders });

  } catch (err) {
    console.error("❌ USER ORDERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
});

//to get the invoice details
app.get("/api/order/:orderId/invoice", (req, res) => {
  const { orderId } = req.params;

  const filePath = path.join(__dirname, "invoices", `invoice_${orderId}.pdf`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Invoice not generated yet" });
  }

  res.download(filePath, `invoice_${orderId}.pdf`);
});

//a function to generate unique transaction ids
function generateTxnId(orderId) {
  return `TXN_${orderId}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

//api to create payment which includes callback,request apis
app.post("/api/payment/create", async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const merchantTxnId = generateTxnId(orderId.toString());

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTxnId,
      merchantUserId: "USER001",
      amount: amount * 100,
      redirectUrl: "http://localhost:4000/api/payment/redirect",
      redirectMode: "POST",
      callbackUrl: "http://localhost:4000/api/payment/callback",
      paymentInstrument: { type: "PAY_PAGE"}
    };

    const payloadBase64 = Buffer
      .from(JSON.stringify(payload))
      .toString("base64");

    const stringToSign =
      payloadBase64 + "/pg/v1/pay" + SALT_KEY;

    const checksum =
      crypto.createHash("sha256")
        .update(stringToSign)
        .digest("hex") + "###" + SALT_INDEX;

    const phonePeRes = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      { request: payloadBase64 },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": MERCHANT_ID
        }
      }
    );

    const redirectUrl =
      phonePeRes.data?.data?.instrumentResponse?.redirectInfo?.url;

    if (!redirectUrl) {
      return res.status(500).json({
        error: "Redirect URL not received",
        phonepe: phonePeRes.data
      });
    }

    // ✅ THIS IS WHAT FRONTEND NEEDS
    res.json({ redirectUrl });

  } catch (err) {
    console.error("❌ PHONEPE ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || { error: err.message });
  }
});

app.post("/api/payment/callback", async (req, res) => {
  try {
    console.log("PhonePe Callback:", req.body);

    const { merchantTransactionId, state, transactionId } = req.body;

    if (state !== "COMPLETED") {
      return res.json({ success: false });
    }

    const request = new sql.Request();

    await pool.request()
      .input("OrderID", sql.Int, merchantTransactionId)
      .input("TransactionID", sql.VarChar(200), transactionId)
      .input("PaymentStatus", sql.VarChar(50), "PAID")
      .input("OrderStatus", sql.VarChar(50), "CONFIRMED")
      .query(`
        UPDATE OrderMaster
        SET 
          TransactionID=@TransactionID,
          PaymentStatus=@PaymentStatus,
          OrderStatus=@OrderStatus,
          ModifiedDt=GETDATE()
        WHERE OrderID=@OrderID
      `);

    res.json({ success: true });

  } catch (err) {
    console.error("Callback error:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/api/payment/redirect", async (req, res) => {
  try {
    const { merchantTransactionId } = req.query;

    // Always redirect to frontend
    res.redirect(
      `http://localhost:4000/payment-result?txn=${merchantTransactionId}`
    );
  } catch (err) {
    res.redirect("http://localhost:4000/payment-result?status=failed");
  }
});

// to track the userviewlogs and post it in the userviewlogs table 
app.post("/api/user/view-log", async (req, res) => {
  try {
    const {
      userId,
      pageName,
      pageURL,
      timeSpentSeconds
    } = req.body;

    if (!userId || !pageName || !pageURL) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    await new sql.Request()
      .input("UserID", sql.Int, userId)
      .input("PageName", sql.VarChar(100), pageName)
      .input("PageURL", sql.VarChar(255), pageURL)
      .input("TimeSpentSeconds", sql.Int, timeSpentSeconds || 0)
      .input("CreatedBy", sql.Int, userId)
      .query(`
        INSERT INTO UserViewLog
        (
          UserID,
          LoginTime,
          PageName,
          PageURL,
          TimeSpentSeconds,
          CreatedBy,
          CreatedDt
        )
        VALUES
        (
          @UserID,
          GETDATE(),
          @PageName,
          @PageURL,
          @TimeSpentSeconds,
          @CreatedBy,
          GETDATE()
        )
      `);

    res.json({
      success: true,
      message: "User activity logged"
    });

  } catch (err) {
    console.error("❌ USER VIEW LOG ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to log user activity",
      error: err.message
    });
  }
});

// to get the userview details for our admin panel
app.get("/api/admin/userviewlogs", async (req, res) => {
  try {
    const {
      userId,
      pageName,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";

    if (userId) {
      whereClause += ` AND uvl.UserID = ${userId}`;
    }

    if (pageName) {
      whereClause += ` AND uvl.PageName LIKE '%${pageName}%'`;
    }

    if (startDate && endDate) {
      whereClause += ` AND uvl.CreatedDt BETWEEN '${startDate}' AND '${endDate}'`;
    }

    const query = `
      SELECT 
        uvl.UserViewLogID,
        uvl.UserID,
        u.FirstName,
        u.Email,
        uvl.PageName,
        uvl.PageURL,
        uvl.TimeSpentSeconds,
        uvl.LoginTime,
        uvl.LogoutTime,
        uvl.CreatedDt
      FROM UserViewLog uvl
      JOIN Users u ON uvl.UserID = u.UserID
      ${whereClause}
      ORDER BY uvl.CreatedDt DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY;
    `;

    const result = await new sql.Request().query(query);

    res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      count: result.recordset.length,
      data: result.recordset
    });

  } catch (error) {
    console.error("❌ ADMIN USER VIEW LOG FETCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user view logs",
      error: error.message
    });
  }
});

// to track the delivery status,this api is integrated once our admin panel is created
app.put("/api/delivery/status", async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await new sql.Request()
      .input("OrderID", sql.Int, orderId)
      .input("DeliveryStatus", sql.VarChar, status)
      .query(`
        UPDATE Delivery
        SET DeliveryStatus = @DeliveryStatus,
            ModifiedDt = GETDATE()
        WHERE OrderID = @OrderID
      `);

    res.json({
      success: true,
      message: "Delivery status updated",
      orderId,
      status
    });

  } catch (error) {
    console.error("❌ STATUS UPDATE ERROR:", error);
    res.status(500).json({ success: false, message: "Status update failed" });
  }
});

app.get("/api/delivery/track/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await new sql.Request()
      .input("OrderID", sql.Int, orderId)
      .query(`
        SELECT *
        FROM Delivery
        WHERE OrderID = @OrderID
      `);

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found"
      });
    }

    res.json({
      success: true,
      delivery: result.recordset[0]
    });

  } catch (error) {
    console.error("❌ TRACK ERROR:", error);
    res.status(500).json({ success: false, message: "Track failed" });
  }
});

app.get("/api/delivery/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await new sql.Request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT *
        FROM Delivery
        WHERE UserID = @UserID
        ORDER BY CreatedDt DESC
      `);

    res.json({
      success: true,
      deliveries: result.recordset
    });

  } catch (error) {
    console.error("❌ USER DELIVERY ERROR:", error);
    res.status(500).json({ success: false });
  }
});

// warehouse details are updated once admin panel is ready
app.get("/api/warehouse", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT
        WarehouseID,
        ProductID,
        Quantity,
        Status,
        CreatedBy,
        CreatedDt,
        ModifiedBy,
        ModifiedDt
      FROM Brihati.dbo.Warehouse
      ORDER BY CreatedDt DESC
    `);

    res.status(200).json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });

  } catch (error) {
    console.error("❌ Error fetching warehouse data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch warehouse data",
      error: error.message
    });
  }
});
app.post("/api/warehouse", async (req, res) => {
  try {
    const {
      ProductID,
      Quantity,
      Status,
      CreatedBy
    } = req.body;

    // Basic validation
    if (!ProductID || Quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "ProductID and Quantity are required"
      });
    }

    const request = new sql.Request();

    request.input("ProductID", sql.Int, ProductID);
    request.input("Quantity", sql.Int, Quantity);
    request.input("Status", sql.Bit, Status ?? 1);
    request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

    const query = `
      INSERT INTO Brihati.dbo.Warehouse
      (
        ProductID,
        Quantity,
        Status,
        CreatedBy,
        CreatedDt
      )
      OUTPUT INSERTED.WarehouseID
      VALUES
      (
        @ProductID,
        @Quantity,
        @Status,
        @CreatedBy,
        GETDATE()
      )
    `;

    const result = await request.query(query);

    res.status(201).json({
      success: true,
      message: "Warehouse stock added successfully",
      WarehouseID: result.recordset[0].WarehouseID
    });

  } catch (error) {
    console.error("❌ Error adding warehouse stock:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add warehouse stock",
      error: error.message
    });
  }
});
