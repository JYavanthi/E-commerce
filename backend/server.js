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
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
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
// Create folder if not exists
const categoryUploadPath = path.join(__dirname, "uploads/categories");

if (!fs.existsSync(categoryUploadPath)) {
  fs.mkdirSync(categoryUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, categoryUploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
});

const productUploadPath = path.join(__dirname, "uploads/products");

if (!fs.existsSync(productUploadPath)) {
  fs.mkdirSync(productUploadPath, { recursive: true });
}

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productUploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const productUpload = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// app.put("/api/users/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       FirstName,
//       LastName,
//       Email,
//       ContactNo,
//       DOB,
//       Gender,
//       PasswordHash
//     } = req.body;

//     const pool = await sql.connect(dbConfig);

//     // 🔍 CHECK if another user already has same email/phone
//     const existingUser = await pool.request()
//       .input("Email", sql.NVarChar, Email)
//       .input("ContactNo", sql.NVarChar, ContactNo)
//       .input("UserID", sql.Int, id)
//       .query(`
//         SELECT TOP 1 *
//         FROM UserMaster
//         WHERE (Email = @Email OR ContactNo = @ContactNo)
//         AND UserID != @UserID
//       `);

//     if (existingUser.recordset.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Email or phone already used by another account"
//       });
//     }

//     // ✅ UPDATE USER
//     await pool.request()
//       .input("UserID", sql.Int, id)
//       .input("FirstName", sql.NVarChar, FirstName)
//       .input("LastName", sql.NVarChar, LastName)
//       .input("Email", sql.NVarChar, Email)
//       .input("ContactNo", sql.NVarChar, ContactNo)
//       .input("DOB", sql.Date, DOB)
//       .input("Gender", sql.NVarChar, Gender)
//       .input("PasswordHash", sql.NVarChar, PasswordHash || null)
//       .query(`
//         UPDATE UserMaster
//         SET FirstName = @FirstName,
//             LastName = @LastName,
//             Email = @Email,
//             ContactNo = @ContactNo,
//             DOB = @DOB,
//             Gender = @Gender,
//             PasswordHash = ISNULL(@PasswordHash, PasswordHash),
//             UpdatedDt = GETDATE()
//         WHERE UserID = @UserID
//       `);

//     res.json({
//       success: true,
//       message: "Profile updated successfully"
//     });

//   } catch (error) {
//     console.error("❌ Update error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Update failed",
//       error: error.message
//     });
//   }
// });

//untouched

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      FirstName,
      LastName,
      Email,
      ContactNo,
      DOB,
      Gender,
      PasswordHash
    } = req.body;

    const pool = await sql.connect(dbConfig);

    /* =========================
       VALIDATION
    ========================= */

    if (!FirstName || !Email || !ContactNo) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    /* =========================
       DUPLICATE CHECK (IMPORTANT FIX)
    ========================= */

    const existingUser = await pool.request()
      .input("Email", sql.NVarChar, Email)
      .input("ContactNo", sql.NVarChar, ContactNo)
      .input("UserID", sql.Int, id)
      .query(`
        SELECT TOP 1 UserID
        FROM UserMaster
        WHERE (Email = @Email OR ContactNo = @ContactNo)
        AND UserID != @UserID
      `);

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email or phone already used by another account"
      });
    }

    /* =========================
       UPDATE USER
    ========================= */

    await pool.request()
      .input("UserID", sql.Int, id)
      .input("FirstName", sql.NVarChar, FirstName)
      .input("LastName", sql.NVarChar, LastName || "")
      .input("Email", sql.NVarChar, Email)
      .input("ContactNo", sql.NVarChar, ContactNo)
      .input("DOB", sql.Date, DOB || null)
      .input("Gender", sql.NVarChar, Gender || null)
      .input("PasswordHash", sql.NVarChar, PasswordHash || null)
      .query(`
        UPDATE UserMaster
        SET FirstName = @FirstName,
            LastName = @LastName,
            Email = @Email,
            ContactNo = @ContactNo,
            DOB = @DOB,
            Gender = @Gender,
            PasswordHash = CASE 
                              WHEN @PasswordHash IS NULL OR @PasswordHash = '' 
                              THEN PasswordHash 
                              ELSE @PasswordHash 
                           END
            
        WHERE UserID = @UserID
      `);

    /* =========================
       RETURN UPDATED USER (🔥 NEW)
    ========================= */

    const updatedUser = await pool.request()
      .input("UserID", sql.Int, id)
      .query(`
        SELECT UserID, FirstName, Email, ContactNo
        FROM UserMaster
        WHERE UserID = @UserID
      `);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser.recordset[0] // 🔥 send updated data
    });

  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message
    });
  }
});

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
// app.get("/api/products", async (req, res) => {
//   try {
//     const pool = await sql.connect(dbConfig);

//     const query = `
//       SELECT 
//         p.ProductID,
//         p.ProductName,
//         p.ProductDescription,
//         p.ProductWeight,
//         c.CategoryName,
//         pp.Price
//       FROM ProductMaster p
//       LEFT JOIN ProductCategory c 
//         ON p.ProductCategoryID = c.ProductCategoryID
//       LEFT JOIN ProductPriceMaster pp 
//         ON p.ProductID = pp.ProductID
//     `;

//     const result = await pool.request().query(query);

//     console.log("SQL RESULT 👉", result.recordset);

//     const products = result.recordset.map(item => ({
//       ProductID: item.ProductID,
//       ProductName: item.ProductName,
//       ProductDescription: item.ProductDescription,
//       ProductWeight: item.ProductWeight,
//       CategoryName: item.CategoryName,
//       Price: item.Price,
//       ImageUrl: `${item.ProductID}.jpg`,
//     }));

//     res.json(products);

//   } catch (err) {
//     console.error("PRODUCT API FAILED ❌", err);
//     res.status(500).json({
//       error: "Server error",
//       details: err.message
//     });
//   }
// });
app.get("/api/products", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const query = `
      SELECT 
        p.ProductID,
        p.ProductName,
        p.ProductDescription,
        p.ProductWeight AS ProductWeight,
        c.CategoryName,
        ISNULL(pp.Price, 0) AS Price,
      

        (
          SELECT TOP 1 AttachmentFile
          FROM Attachments a
          WHERE a.ProductID = p.ProductID
          ORDER BY a.SortOrder ASC
        ) AS ImageUrl

      FROM ProductMaster p

      LEFT JOIN ProductCategory c 
        ON p.ProductCategoryID = c.ProductCategoryID

      LEFT JOIN ProductPriceMaster pp 
        ON p.ProductID = pp.ProductID

      ORDER BY p.CreatedDt DESC
    `;

    const result = await pool.request().query(query);

    const products = result.recordset.map(item => ({
      ProductID: item.ProductID,
      ProductName: item.ProductName,
      ProductDescription: item.ProductDescription,
      ProductWeight: item.ProductWeight,
      CategoryName: item.CategoryName,
      Price: item.Price,
      // DiscountPrice:item.DiscountPrice,
      ImageUrl: item.ImageUrl
        ? `http://localhost:4000${item.ImageUrl}`
        : null
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (err) {
    console.error("❌ GET PRODUCTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message
    });
  }
});

//to display ind products by id
// app.get("/api/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const request = new sql.Request();
//     request.input("id", sql.Int, id);

//     const result = await request.query(`
//       SELECT 
//         p.ProductID,
//         p.ProductName,
//         p.ProductDescription,
//         p.Quantity AS ProductWeight,
//         ISNULL(pr.Price, 0) AS Price,
//         ISNULL(pr.DiscountPrice, 0) AS DiscountPrice
//       FROM ProductMaster p
//       LEFT JOIN ProductPriceMaster pr 
//         ON p.ProductID = pr.ProductID
//       WHERE p.ProductID = @id
//     `);

//     if (!result.recordset || result.recordset.length === 0) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(result.recordset[0]);

//   } catch (err) {
//     console.error("🔥 SINGLE PRODUCT API ERROR:", err);
//     res.status(500).json({
//       error: "Single product fetch failed",
//       details: err.message
//     });
//   }
// });
// app.get("/api/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const pool = await sql.connect(dbConfig);

//     const productResult = await pool.request()
//       .input("id", sql.Int, id)
//       .query(`
//         SELECT 
//           p.ProductID,
//           p.ProductName,
//           p.ProductDescription,
//           p.Quantity AS ProductWeight,
//           ISNULL(pr.Price, 0) AS Price,
//           ISNULL(pr.DiscountPrice, 0) AS DiscountPrice
//         FROM ProductMaster p
//         LEFT JOIN ProductPriceMaster pr 
//           ON p.ProductID = pr.ProductID
//         WHERE p.ProductID = @id
//       `);

//     if (productResult.recordset.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     const imagesResult = await pool.request()
//       .input("id", sql.Int, id)
//       .query(`
//         SELECT AttachmentFile
//         FROM Attachments
//         WHERE ProductID = @id
//         ORDER BY SortOrder ASC
//       `);

//     const product = productResult.recordset[0];

//     const images = imagesResult.recordset.map(img =>
//       `http://localhost:4000${img.AttachmentFile}`
//     );

//     res.status(200).json({
//       success: true,
//       data: {
//         ...product,
//         Images: images
//       }
//     });

//   } catch (err) {
//     console.error("❌ GET SINGLE PRODUCT ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch product",
//       error: err.message
//     });
//   }
// });
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(dbConfig);

    // 🔹 PRODUCT DETAILS
    const productResult = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          p.ProductID,
          p.ProductName,
          p.ProductDescription,
          p.ProductWeight,
          ISNULL(pr.Price, 0) AS Price,
          ISNULL(pr.DiscountPrice, 0) AS DiscountPrice
        FROM ProductMaster p
        LEFT JOIN ProductPriceMaster pr 
          ON p.ProductID = pr.ProductID
        WHERE p.ProductID = @id
      `);

    if (productResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 🔹 FETCH IMAGES FROM ATTACHMENTS TABLE
    const imageResult = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT AttachmentFile
        FROM Attachments
        WHERE ProductID = @id
          AND Section = 'PRODUCT'
        ORDER BY Sortorder ASC
      `);

    const product = productResult.recordset[0];

    const images = imageResult.recordset.map(img =>
      `http://localhost:4000${img.AttachmentFile}`
    );

    res.status(200).json({
      success: true,
      data: {
        ...product,
        Images: images
      }
    });

  } catch (err) {
    console.error("❌ PRODUCT DETAIL ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: err.message
    });
  }
});

//to add products to product master table
// app.post("/api/products", async (req, res) => {
//   try { 
//     const {
//       ProductCategoryID,
//       ProductName,
//       ProductCode,
//       ProductDescription,
//       Quantity,
//       SKU,
//       Status,
//       IsFeatured,
//       CreatedBy
//     } = req.body;

//     // Basic validation
//     if (!ProductCategoryID || !ProductName) {
//       return res.status(400).json({
//         success: false,
//         message: "ProductCategoryID and ProductName are required"
//       });
//     }

//     const request = new sql.Request();

//     request.input("ProductCategoryID", sql.Int, ProductCategoryID);
//     request.input("ProductName", sql.NVarChar, ProductName);
//     request.input("ProductCode", sql.NVarChar, ProductCode ?? null);
//     request.input("ProductDescription", sql.NVarChar, ProductDescription ?? null);
//     request.input("Quantity", sql.Int, Quantity ?? 0);
//     request.input("SKU", sql.NVarChar, SKU ?? null);
//     request.input("Status", sql.Bit, Status ?? 1);
//     request.input("IsFeatured", sql.Bit, IsFeatured ?? 0);
//     request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

//     const query = `
//       INSERT INTO dbo.ProductMaster
//       (
//         ProductCategoryID,
//         ProductName,
//         ProductCode,
//         ProductDescription,
//         Quantity,
//         SKU,
//         Status,
//         IsFeatured,
//         CreatedBy,
//         CreatedDt
//       )
//       OUTPUT INSERTED.ProductID
//       VALUES
//       (
//         @ProductCategoryID,
//         @ProductName,
//         @ProductCode,
//         @ProductDescription,
//         @Quantity,
//         @SKU,
//         @Status,
//         @IsFeatured,
//         @CreatedBy,
//         GETDATE()
//       )
//     `;

//     const result = await request.query(query);

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       ProductID: result.recordset[0].ProductID
//     });

//   } catch (error) {
//     console.error("❌ Error creating product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create product",
//       error: error.message
//     });
//   }
// });

app.post("/api/products", async (req, res) => {
  try {
    const {
      ProductCategoryID,
      ProductName,
      ProductDescription,
      Quantity,
      SKU,
      Status,
      IsFeatured,
      CreatedBy,
      ProductWeight     // ✅ ADD THIS
    } = req.body;

    if (!ProductCategoryID || !ProductName) {
      return res.status(400).json({
        success: false,
        message: "ProductCategoryID and ProductName are required"
      });
    }

    const pool = await sql.connect(dbConfig);

    // ✅ AUTO GENERATE PRODUCT CODE
    const ProductCode = "PRD-" + Date.now();

    const result = await pool.request()
      .input("ProductCategoryID", sql.Int, ProductCategoryID)
      .input("ProductName", sql.NVarChar(200), ProductName)
      .input("ProductCode", sql.NVarChar(100), ProductCode)
      .input("ProductDescription", sql.NVarChar(sql.MAX), ProductDescription ?? "")
      .input("Quantity", sql.Int, Quantity ?? 0)
      .input("SKU", sql.NVarChar(100), SKU ?? "")
      .input("Status", sql.Bit, Status ?? 1)
      .input("IsFeatured", sql.Bit, IsFeatured ?? 0)
      .input("CreatedBy", sql.Int, CreatedBy ?? 1)
      .input("ProductWeight", sql.NVarChar(50), ProductWeight ?? "")  // ✅ ADD THIS
      .query(`
        INSERT INTO ProductMaster
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
          CreatedDt,
          ProductWeight       -- ✅ ADD THIS
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
          GETDATE(),
          @ProductWeight      -- ✅ ADD THIS
        )
      `);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      ProductID: result.recordset[0].ProductID
    });

  } catch (error) {
    console.error("❌ CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      ProductCategoryID,
      ProductName,
      ProductDescription,
      Quantity,
      SKU,
      Status,
      ProductWeight
    } = req.body;

    if (!ProductCategoryID || !ProductName) {
      return res.status(400).json({
        success: false,
        message: "ProductCategoryID and ProductName are required"
      });
    }

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("ProductID", sql.Int, id)
      .input("ProductCategoryID", sql.Int, ProductCategoryID)
      .input("ProductName", sql.NVarChar(200), ProductName)
      .input("ProductDescription", sql.NVarChar(sql.MAX), ProductDescription ?? "")
      .input("Quantity", sql.Int, Quantity ?? 0)
      .input("SKU", sql.NVarChar(100), SKU ?? "")
      .input("Status", sql.Bit, Status ?? 1)
      .input("ProductWeight", sql.NVarChar(50), ProductWeight ?? "")
      .query(`
        UPDATE ProductMaster
        SET
          ProductCategoryID = @ProductCategoryID,
          ProductName = @ProductName,
          ProductDescription = @ProductDescription,
          Quantity = @Quantity,
          SKU = @SKU,
          Status = @Status,
          ProductWeight = @ProductWeight
        WHERE ProductID = @ProductID
      `);

    res.status(200).json({
      success: true,
      message: "Product updated successfully"
    });

  } catch (error) {
    console.error("❌ UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("ProductID", sql.Int, id)
      .query(`
        UPDATE ProductMaster
        SET Status = 0
        WHERE ProductID = @ProductID
      `);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("❌ DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
});


//product categories
// app.get("/api/product-categories", async (req, res) => {
//   try {
//     const result = await sql.query(`
//       SELECT
//         ProductCategoryID,
//         CategoryName,
//         CategoryDescription,
//         Status,
//         DisplayOrder,
//         CreatedBy,
//         CreatedDt,
//         ModifiedBy,
//         ModifiedDt
//       FROM dbo.ProductCategory
//       ORDER BY DisplayOrder ASC
//     `);

//     res.status(200).json({
//       success: true,
//       count: result.recordset.length,
//       data: result.recordset
//     });

//   } catch (error) {
//     console.error("❌ Error fetching product categories:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch product categories",
//       error: error.message
//     });
//   }
// });
app.get("/api/product-categories", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT
        ProductCategoryID,
        CategoryName,
        CategoryDescription,
        CategoryImage   -- ✅ NEW
      FROM dbo.ProductCategory
      ORDER BY DisplayOrder ASC
    `);

    res.status(200).json({
      success: true,
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
// app.post("/api/product-categories", async (req, res) => {
//   try {
//     const {
//       CategoryName,
//       CategoryDescription,
//       Status,
//       DisplayOrder,
//       CreatedBy
//     } = req.body;

//     // Basic validation
//     if (!CategoryName) {
//       return res.status(400).json({
//         success: false,
//         message: "CategoryName is required"
//       });
//     }

//     const request = new sql.Request();

//     request.input("CategoryName", sql.NVarChar, CategoryName);
//     request.input("CategoryDescription", sql.NVarChar, CategoryDescription ?? null);
//     request.input("Status", sql.Bit, Status ?? 1);
//     request.input("DisplayOrder", sql.Int, DisplayOrder ?? 0);
//     request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

//     const query = `
//       INSERT INTO dbo.ProductCategory
//       (
//         CategoryName,   
//         CategoryDescription,
//         Status,
//         DisplayOrder,
//         CreatedBy,
//         CreatedDt
//       )
//       OUTPUT INSERTED.ProductCategoryID
//       VALUES
//       (
//         @CategoryName,
//         @CategoryDescription,
//         @Status,
//         @DisplayOrder,
//         @CreatedBy,
//         GETDATE()
//       )
//     `;

//     const result = await request.query(query);

//     res.status(201).json({
//       success: true,
//       message: "Product category created successfully",
//       ProductCategoryID: result.recordset[0].ProductCategoryID
//     });

//   } catch (error) {
//     console.error("❌ Error creating product category:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create product category",
//       error: error.message
//     });
//   }
// });
app.post("/api/product-categories", upload.single("CategoryImage"), async (req, res) => {
  try {
    const {
      CategoryName,
      CategoryDescription,
      Status,
      DisplayOrder,
      CreatedBy
    } = req.body;

    if (!CategoryName) {
      return res.status(400).json({
        success: false,
        message: "CategoryName is required"
      });
    }

    // Image path
    const imagePath = req.file
      ? `/uploads/categories/${req.file.filename}`
      : null;

    const request = new sql.Request();

    request.input("CategoryName", sql.NVarChar, CategoryName);
    request.input("CategoryDescription", sql.NVarChar, CategoryDescription ?? null);
    request.input("CategoryImage", sql.NVarChar, imagePath);
    request.input("Status", sql.Bit, Status ?? 1);
    request.input("DisplayOrder", sql.Int, DisplayOrder ?? 0);
    request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

    const query = `
      INSERT INTO dbo.ProductCategory
      (
        CategoryName,
        CategoryDescription,
        CategoryImage,
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
        @CategoryImage,
        @Status,
        @DisplayOrder,
        @CreatedBy,
        GETDATE()
      )
    `;

    const result = await request.query(query);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      ProductCategoryID: result.recordset[0].ProductCategoryID,
      CategoryImage: imagePath
    });

  } catch (error) {
    console.error("❌ Error creating category:", error);
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
// app.post("/api/product-prices", async (req, res) => {
//   try {
//     const {
//       ProductID,
//       Price,
//       DiscountPrice,
//       ValidFrom,
//       ValidTo,
//       CreatedBy
//     } = req.body;

//     // Basic validation
//     if (!ProductID || Price === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: "ProductID and Price are required"
//       });
//     }

//     if (DiscountPrice && DiscountPrice > Price) {
//       return res.status(400).json({
//         success: false,
//         message: "DiscountPrice cannot be greater than Price"
//       });
//     }

//     const request = new sql.Request();

//     request.input("ProductID", sql.Int, ProductID);
//     request.input("Price", sql.Decimal(10, 2), Price);
//     request.input("DiscountPrice", sql.Decimal(10, 2), DiscountPrice ?? null);
//     request.input("ValidFrom", sql.DateTime, ValidFrom ?? new Date());
//     request.input("ValidTo", sql.DateTime, ValidTo ?? null);
//     request.input("CreatedBy", sql.Int, CreatedBy ?? 1);

//     const query = `
//       INSERT INTO Brihati.dbo.ProductPriceMaster
//       (
//         ProductID,
//         Price,
//         DiscountPrice,
//         ValidFrom,
//         ValidTo,
//         CreatedBy,
//         CreatedDt
//       )
//       OUTPUT INSERTED.PriceID
//       VALUES
//       (
//         @ProductID,
//         @Price,
//         @DiscountPrice,
//         @ValidFrom,
//         @ValidTo,
//         @CreatedBy,
//         GETDATE()
//       )
//     `;

//     const result = await request.query(query);

//     res.status(201).json({
//       success: true,
//       message: "Product price created successfully",
//       PriceID: result.recordset[0].PriceID
//     });

//   } catch (error) {
//     console.error("❌ Error creating product price:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create product price",
//       error: error.message
//     });
//   }
// });


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

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("ProductID", sql.Int, ProductID)
      .input("Price", sql.Decimal(10, 2), Price)
      .input("DiscountPrice", sql.Decimal(10, 2), DiscountPrice ?? null)
      .input("ValidFrom", sql.DateTime, ValidFrom ?? new Date())
      .input("ValidTo", sql.DateTime, ValidTo ?? null)
      .input("CreatedBy", sql.Int, CreatedBy ?? 1)
      .query(`
        INSERT INTO ProductPriceMaster
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
      `);

    res.status(201).json({
      success: true,
      message: "Product price created successfully",
      PriceID: result.recordset[0].PriceID
    });

  } catch (error) {
    console.error("❌ CREATE PRICE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product price",
      error: error.message
    });
  }
});

app.put("/api/product-prices/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      Price,
      DiscountPrice
    } = req.body;

    if (Price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Price is required"
      });
    }

    if (DiscountPrice && DiscountPrice > Price) {
      return res.status(400).json({
        success: false,
        message: "DiscountPrice cannot be greater than Price"
      });
    }

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("ProductID", sql.Int, productId)
      .input("Price", sql.Decimal(10,2), Price)
      .input("DiscountPrice", sql.Decimal(10,2), DiscountPrice ?? null)
      .query(`
        UPDATE ProductPriceMaster
        SET
          Price = @Price,
          DiscountPrice = @DiscountPrice
        WHERE ProductID = @ProductID
      `);

    res.status(200).json({
      success: true,
      message: "Price updated successfully"
    });

  } catch (error) {
    console.error("❌ UPDATE PRICE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update price",
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
//           ISNULL(ppm.Price, 0) AS Price,
//           ISNULL(ppm.DiscountPrice, 0) AS DiscountPrice
//         FROM ProductMaster pm
//         LEFT JOIN ProductPriceMaster ppm 
//           ON pm.ProductID = ppm.ProductID
//         WHERE pm.ProductCategoryID = @ProductCategoryID
//           AND pm.Status = 1
//         ORDER BY pm.CreatedDt DESC
//       `);

//     res.json(result.recordset);
//   } catch (err) {
//     console.error("❌ Products by Category API Error:", err);
//     res.status(500).json({ message: "Failed to load products" });
//   }
// });
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
          ISNULL(ppm.DiscountPrice, 0) AS DiscountPrice,
          a.AttachmentFile AS ProductImage
        FROM ProductMaster pm

        LEFT JOIN ProductPriceMaster ppm 
          ON pm.ProductID = ppm.ProductID

        LEFT JOIN Attachments a
          ON pm.ProductID = a.ProductID
          AND a.SortOrder = 1   -- ✅ Primary image only

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
// app.get("/api/cart/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const pool = await sql.connect(dbConfig);

//     const result = await pool.request()
//       .input("UserID", sql.Int, userId)
//       .query(`
//         SELECT
//           c.CartID,
//           c.ProductID,
//           c.Quantity,
//           p.ProductName,
//           p.ProductWeight,
//           pp.Price
//         FROM Cart c
//         INNER JOIN ProductMaster p ON c.ProductID = p.ProductID
//         LEFT JOIN ProductPriceMaster pp ON p.ProductID = pp.ProductID
//         WHERE c.UserID = @UserID
//       `);

//     res.json(result.recordset);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

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
          p.ProductWeight AS ProductWeight,
          pp.Price,
          pp.DiscountPrice,

          (
            SELECT TOP 1 AttachmentFile
            FROM Attachments a
            WHERE a.ProductID = p.ProductID
            ORDER BY a.SortOrder ASC
          ) AS ImageUrl

        FROM Cart c
        INNER JOIN ProductMaster p 
          ON c.ProductID = p.ProductID

        LEFT JOIN ProductPriceMaster pp 
          ON p.ProductID = pp.ProductID

        WHERE c.UserID = @UserID
      `);

    const cartItems = result.recordset.map(item => ({
      CartID: item.CartID,
      ProductID: item.ProductID,
      ProductName: item.ProductName,
      ProductWeight: item.ProductWeight,
      Quantity: item.Quantity,
      Price: item.Price,
      DiscountPrice:item.DiscountPrice,
      ImageUrl: item.ImageUrl
        ? `http://localhost:4000${item.ImageUrl}`
        : null
    }));

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems
    });

  } catch (err) {
    console.error("❌ GET CART ERROR:", err);
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
// app.get("/api/wishlist/:userId", async (req, res) => {
//   try {
//     const userId = Number(req.params.userId);
//     if (!userId) {
//       return res.status(400).json({ message: "Invalid userId" });
//     }

//     const pool = await sql.connect(dbConfig);

//     const result = await pool.request()
//       .input("UserID", sql.Int, userId)
//       .query(`
//         SELECT 
//           w.WishlistID,
//           p.ProductID,
//           p.ProductName,
//           p.ProductDescription,
//           p.ProductWeight,            
//           pm.Price
//         FROM Wishlist w
//         INNER JOIN ProductMaster p ON p.ProductID = w.ProductID
//         LEFT JOIN ProductPriceMaster pm ON pm.ProductID = p.ProductID
//         WHERE w.UserID = @UserID
//       `);

//     res.json(result.recordset);
//   } catch (err) {
//     console.error("❌ Wishlist fetch error:", err);
//     res.status(500).json({ message: "Failed to load wishlist" });
//   }
// });
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
          p.ProductWeight AS ProductWeight,
          pm.Price,

          (
            SELECT TOP 1 AttachmentFile
            FROM Attachments a
            WHERE a.ProductID = p.ProductID
            ORDER BY a.SortOrder ASC
          ) AS ImageUrl

        FROM Wishlist w
        INNER JOIN ProductMaster p 
          ON p.ProductID = w.ProductID

        LEFT JOIN ProductPriceMaster pm 
          ON pm.ProductID = p.ProductID

        WHERE w.UserID = @UserID
      `);

    const wishlistItems = result.recordset.map(item => ({
      WishlistID: item.WishlistID,
      ProductID: item.ProductID,
      ProductName: item.ProductName,
      ProductDescription: item.ProductDescription,
      ProductWeight: item.ProductWeight,
      Price: item.Price,
      ImageUrl: item.ImageUrl
        ? `http://localhost:4000${item.ImageUrl}`
        : null
    }));

    res.status(200).json({
      success: true,
      count: wishlistItems.length,
      data: wishlistItems
    });

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
// app.post("/api/order/create", async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       totalAmount,
//       taxAmount,
//       paymentMode,
//       shippingAddress : selectedAddress
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
//       .input("PaymentStatus", sql.VarChar(20), "SUCCESS")
//       .input("OrderStatus", sql.VarChar(20), "CONFIRMED")
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
//     expectedDate.setDate(expectedDate.getDate() + 5);

//     const fullAddress = shippingAddress
//   ? `
//      ${shippingAddress.city || ""},
//      ${shippingAddress.state || ""} - ${shippingAddress.pincode || ""}`
//   : "Customer Address";

//     await new sql.Request()
//       .input("OrderID", sql.Int, orderId)
//       .input("UserID", sql.Int, userId)
//       .input("ShippingMode", sql.VarChar(50), "STANDARD")
//       .input("FromLocation", sql.VarChar(100), "Main Warehouse")
//       .input("ToLocation", sql.VarChar(100),  fullAddress)
//       .input("DeliveryStatus", sql.VarChar(50), "ORDER_CONFIRMED")
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
//        4️⃣ AUTO GENERATE INVOICE
//     ========================= */

//      /* =========================
//    AUTO GENERATE INVOICE
// ========================= */

// await generateInvoice({
//   orderId,
//   userId,
//   shippingAddress: `${shippingAddress?.addressLine || ""}, ${shippingAddress?.city || ""}`,
//   items: cartItems.map(item => ({
//     name: item.productName || `Product ${item.productId}`,
//     quantity: item.quantity,
//     unitPrice: item.unitPrice,
//     total: item.unitPrice * item.quantity
//   })),
//   subtotal: totalAmount - taxAmount,
//   tax: taxAmount,
//   totalAmount
// });


//     /* =========================
//        5️⃣ RESPONSE
//     ========================= */

//     res.json({
//       success: true,
//       orderId,
//       invoiceUrl: `http://localhost:4000/api/order/${orderId}/invoice`,
//       message: "Order + Delivery + Invoice created successfully"
//     });

//   } catch (err) {
//     console.error("❌ ORDER CREATE ERROR:", err);
//     res.status(500).json({
//       message: "Order creation failed",
//       error: err.message
//     });
//   }
// });

// app.get("/api/order/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     // 1️⃣ Get order master
//     const orderResult = await new sql.Request()
//       .input("OrderID", sql.Int, orderId)
//       .query(`
//         SELECT 
//           o.OrderID,
//           o.OrderDate,
//           o.TotalAmount,
//           o.TaxAmount,
//           o.PaymentMode,
//           o.PaymentStatus,
//           o.OrderStatus
//         FROM OrderMaster o
//         WHERE o.OrderID = @OrderID
//       `);

//     if (orderResult.recordset.length === 0) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const order = orderResult.recordset[0];

//     // 2️⃣ Get order items
//     const itemsResult = await new sql.Request()
//       .input("OrderID", sql.Int, orderId)
//       .query(`
//         SELECT 
//           p.ProductName,
//           od.Quantity,
//           od.UnitPrice,
//           od.TotalPrice
//         FROM OrderDetails od
//         JOIN ProductMaster p ON od.ProductID = p.ProductID
//         WHERE od.OrderID = @OrderID
//       `);

//     const items = itemsResult.recordset.map(item => ({
//       productName: item.ProductName,
//       weight: "200gms", // or from DB
//       qty: item.Quantity,
//       price: item.TotalPrice,
//       // imageUrl: item.ProductImage || "https://via.placeholder.com/60"
//     }));

//     // 3️⃣ Response
//     res.json({
//       orderId: order.OrderID,
//       transactionDate: new Date(order.OrderDate).toDateString(),
//       paymentMethod: order.PaymentMode,
//       shippingMethod: "Shiprocket",
//       subtotal: order.TotalAmount,
//       gst: order.TaxAmount,
//       shipping: 40,
//       total: order.TotalAmount + order.TaxAmount + 40,
//       items
//     });

//   } catch (err) {
//     console.error("❌ ORDER FETCH ERROR:", err);
//     res.status(500).json({
//       message: "Failed to fetch order",
//       error: err.message
//     });
//   }
// });



// app.post("/api/order/create", async (req, res) => {
//   const transaction = new sql.Transaction();

//   try {
//     const {
//       userId,
//       cartItems,
//       subTotalAmount,
//       discountAmount,
//       couponDiscount,
//       couponCode,
//       totalAmount,
//       taxAmount,
//       paymentMode,
//       shippingAddress
//     } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "UserId is required" });
//     }

//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     if (!shippingAddress) {
//       return res.status(400).json({ message: "Shipping address required" });
//     }

//     await transaction.begin();

//     const request = new sql.Request(transaction);

//     /* =========================
//        1️⃣ CREATE ORDER MASTER
//     ========================= */

//     const orderResult = await request
//       .input("UserID", sql.Int, userId)
//       .input("SubTotalAmount", sql.Decimal(10, 2), subTotalAmount)
//       .input("DiscountAmount", sql.Decimal(10, 2), discountAmount || 0)
//       .input("CouponCode", sql.NVarChar(50), couponCode)
//       .input("CouponDiscount", sql.Decimal(10, 2), couponDiscount || 0)
//       .input("TotalAmount", sql.Decimal(10, 2), totalAmount)
//       .input("TaxAmount", sql.Decimal(10, 2), taxAmount)
//       .input("PaymentMode", sql.VarChar(20), paymentMode || "COD")
//       .input("PaymentStatus", sql.VarChar(20), "SUCCESS")
//       .input("OrderStatus", sql.VarChar(20), "CONFIRMED")
//       .input("CreatedBy", sql.Int, userId)
//       .query(`
//         INSERT INTO OrderMaster
//         (
//           UserID,
//           OrderDate,
//           SubTotalAmount,
//           DiscountAmount,
//           CouponCode,
//       CouponDiscount,
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
//           @SubTotalAmount,
//           @DiscountAmount,
//            @CouponCode,
//       @CouponDiscount,
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

//       await new sql.Request(transaction)
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
//        3️⃣ CREATE DELIVERY
//     ========================= */

//     const expectedDate = new Date();
//     expectedDate.setDate(expectedDate.getDate() + 5);

//     const cityAddress = `
// ${shippingAddress.city},
// ${shippingAddress.state} - ${shippingAddress.pincode}
// `;

//     const fullAddress = `
// ${shippingAddress.name}
// Ph: ${shippingAddress.mobile}
// No ${shippingAddress.flat},
// ${shippingAddress.street},
// ${shippingAddress.landmark || ""}
// ${shippingAddress.city},
// ${shippingAddress.state} - ${shippingAddress.pincode}
// `;

//     await new sql.Request(transaction)
//       .input("OrderID", sql.Int, orderId)
//       .input("UserID", sql.Int, userId)
//       .input("ShippingMode", sql.VarChar(50), "STANDARD")
//       .input("FromLocation", sql.VarChar(100), "Main Warehouse")
//       .input("ToLocation", sql.NVarChar(500), cityAddress)
//       .input("DeliveryStatus", sql.VarChar(50), "ORDER_CONFIRMED")
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
//        4️⃣ GENERATE INVOICE
//     ========================= */

//     const InvoiceNo = `${Date.now()}-${orderId}`;

//     await generateInvoice({
//       InvoiceNo,
//       orderId,
//       userId,
//       shippingAddress: fullAddress,
//       items: cartItems.map(item => ({
//         name: item.productName || `Product ${item.productId}`,
//         quantity: item.quantity,
//         unitPrice: item.unitPrice,
//         total: item.unitPrice * item.quantity
//       })),
//       subtotal: subTotalAmount,
//       discount: discountAmount || 0,
//       tax: taxAmount,
//       totalAmount
//     });

//     await new sql.Request(transaction)
//       .input("OrderID", sql.Int, orderId)
//       .input("InvoiceNo", sql.VarChar(50), InvoiceNo)
//       .query(`
//         UPDATE OrderMaster
//         SET InvoiceNo = @InvoiceNo
//         WHERE OrderID = @OrderID
//       `);

//       /* =========================
//    5️⃣ CLEAR USER CART
// ========================= */

// await new sql.Request(transaction)
//   .input("UserID", sql.Int, userId)
//   .query(`
//     DELETE FROM Cart
//     WHERE UserID = @UserID
//   `);

//     await transaction.commit();

//     res.json({
//       success: true,
//       orderId,
//       invoiceUrl: `http://localhost:4000/api/order/${orderId}/invoice`,
//       message: "Order + Delivery + Invoice created successfully"
//     });

//   } catch (err) {

//     if (transaction) {
//       await transaction.rollback();
//     }

//     console.error("❌ ORDER CREATE ERROR:", err);

//     res.status(500).json({
//       message: "Order creation failed",
//       error: err.message
//     });
//   }
// });


app.post("/api/order/create", async (req, res) => {
  const transaction = new sql.Transaction();

  try {
    const {
      userId,
      cartItems,
      subTotalAmount,
      discountAmount,
      couponDiscount,
      couponCode,
      totalAmount,
      taxAmount,
      paymentMode,
      shippingAddress
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required"
      });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address required"
      });
    }

    await transaction.begin();

    const request = new sql.Request(transaction);

    /* =========================
       0️⃣ GET USER DETAILS
    ========================= */

    const userResult = await new sql.Request(transaction)
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT TOP 1
          UserID,
          FirstName,
          LastName
        FROM UserMaster
        WHERE UserID = @UserID
      `);

    if (userResult.recordset.length === 0) {
      throw new Error("User not found");
    }

    const user = userResult.recordset[0];

    const userDisplayName =
      `${user.FirstName || ""} ${user.LastName || ""}`.trim() || "Customer";

    /* =========================
       0️⃣ GET DEFAULT BILLING ADDRESS
    ========================= */

    const defaultAddressResult = await new sql.Request(transaction)
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT TOP 1
          AddressID,
          UserID,
          FullName,
          MobileNumber,
          AddressLine1,
          AddressLine2,
          Landmark,
          City,
          State,
          Country,
          Pincode,
          AddressType,
          IsDefault
        FROM Address
        WHERE UserID = @UserID
          AND IsDefault = 1
        ORDER BY AddressID DESC
      `);

    const defaultAddress = defaultAddressResult.recordset[0] || null;

    const billingName =  userDisplayName;

    const billingAddress = defaultAddress
      ? [
          defaultAddress.AddressLine1 || "",
          defaultAddress.AddressLine2 || "",
          defaultAddress.Landmark || "",
          defaultAddress.City || "",
          defaultAddress.State || "",
          defaultAddress.Country || "",
          defaultAddress.Pincode || ""
        ]
          .filter(Boolean)
          .join(", ")
      : "N/A";

    /* =========================
       SHIPPING DETAILS
    ========================= */

    const shippingName = shippingAddress.name || billingName;

    const shippingAddressText = [
      shippingAddress.flat || "",
      shippingAddress.street || "",
      shippingAddress.landmark || "",
      shippingAddress.city || "",
      shippingAddress.state || "",
      shippingAddress.pincode || ""
    ]
      .filter(Boolean)
      .join(", ");

    const fullAddress = `
${shippingName}
Ph: ${shippingAddress.mobile || ""}
${shippingAddress.flat || ""}
${shippingAddress.street || ""}
${shippingAddress.landmark || ""}
${shippingAddress.city || ""}
${shippingAddress.state || ""} - ${shippingAddress.pincode || ""}
`.trim();

    /* =========================
       1️⃣ CREATE ORDER MASTER
    ========================= */

    const orderResult = await request
      .input("UserID", sql.Int, userId)
      .input("SubTotalAmount", sql.Decimal(10, 2), subTotalAmount)
      .input("DiscountAmount", sql.Decimal(10, 2), discountAmount || 0)
      .input("CouponCode", sql.NVarChar(50), couponCode || null)
      .input("CouponDiscount", sql.Decimal(10, 2), couponDiscount || 0)
      .input("TotalAmount", sql.Decimal(10, 2), totalAmount)
      .input("TaxAmount", sql.Decimal(10, 2), taxAmount || 0)
      .input("PaymentMode", sql.VarChar(20), paymentMode || "COD")
      .input("PaymentStatus", sql.VarChar(20), "SUCCESS")
      .input("OrderStatus", sql.VarChar(20), "CONFIRMED")
      .input("CreatedBy", sql.Int, userId)
      .query(`
        INSERT INTO OrderMaster
        (
          UserID,
          OrderDate,
          SubTotalAmount,
          DiscountAmount,
          CouponCode,
          CouponDiscount,
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
          @SubTotalAmount,
          @DiscountAmount,
          @CouponCode,
          @CouponDiscount,
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
      const totalPrice = item.totalPrice || unitPrice * quantity;

      await new sql.Request(transaction)
        .input("OrderID", sql.Int, orderId)
        .input("ProductID", sql.Int, item.productId)
        .input("Quantity", sql.Int, quantity)
        .input("UnitPrice", sql.Decimal(10, 2), unitPrice)
        .input("TotalPrice", sql.Decimal(10, 2), totalPrice)
        .input("CreatedBy", sql.Int, userId)
        .query(`
          INSERT INTO OrderDetails
          (
            OrderID,
            ProductID,
            Quantity,
            UnitPrice,
            TotalPrice,
            CreatedBy,
            CreatedDt
          )
          VALUES
          (
            @OrderID,
            @ProductID,
            @Quantity,
            @UnitPrice,
            @TotalPrice,
            @CreatedBy,
            GETDATE()
          )
        `);
    }

    /* =========================
       3️⃣ CREATE DELIVERY
    ========================= */

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 5);

    const cityAddress = `
${shippingAddress.city || ""},
${shippingAddress.state || ""} - ${shippingAddress.pincode || ""}
`.trim();

    await new sql.Request(transaction)
      .input("OrderID", sql.Int, orderId)
      .input("UserID", sql.Int, userId)
      .input("ShippingMode", sql.VarChar(50), "STANDARD")
      .input("FromLocation", sql.VarChar(100), "Main Warehouse")
      .input("ToLocation", sql.NVarChar(500), cityAddress)
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
       4️⃣ GENERATE INVOICE
    ========================= */

    const InvoiceNo = `${Date.now()}-${orderId}`;

    await generateInvoice({
      InvoiceNo,
      orderId,
      userId,

      billingName,
      billingAddress,

      shippingName,
      shippingAddress: shippingAddressText,

      items: cartItems.map(item => ({
        name: item.productName || `Product ${item.productId}`,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.totalPrice || (item.unitPrice * item.quantity)
      })),

      subtotal: subTotalAmount,
      discount: (discountAmount || 0) + (couponDiscount || 0),
      tax: taxAmount || 0,
      totalAmount
    });

    await new sql.Request(transaction)
      .input("OrderID", sql.Int, orderId)
      .input("InvoiceNo", sql.VarChar(50), InvoiceNo)
      .query(`
        UPDATE OrderMaster
        SET InvoiceNo = @InvoiceNo
        WHERE OrderID = @OrderID
      `);

    /* =========================
       5️⃣ CLEAR USER CART
    ========================= */

    // await new sql.Request(transaction)
    //   .input("UserID", sql.Int, userId)
    //   .query(`
    //     DELETE FROM Cart
    //     WHERE UserID = @UserID
    //   `);
    /* =========================
   5️⃣ CLEAR USER CART (ONLY FOR COD)
========================= */

if (paymentMode === "COD") {
  await new sql.Request(transaction)
    .input("UserID", sql.Int, userId)
    .query(`
      DELETE FROM Cart
      WHERE UserID = @UserID
    `);
}

    await transaction.commit();

    res.json({
      success: true,
      orderId,
      invoiceUrl: `http://localhost:4000/api/order/${orderId}/invoice`,
      message: "Order + Delivery + Invoice created successfully"
    });

  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }

    console.error("❌ ORDER CREATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: err.message
    });
  }
});


// app.get("/api/order/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     const pool = await sql.connect(dbConfig);

//     /* 1️⃣ ORDER MASTER */
//     const orderResult = await pool.request()
//       .input("OrderID", sql.Int, orderId)
//       .query(`
//         SELECT 
//           o.OrderID,
//           o.OrderDate,
//           o.TotalAmount,
//           o.TaxAmount,
//           o.PaymentMode,
//           o.PaymentStatus,
//           o.OrderStatus
//         FROM OrderMaster o
//         WHERE o.OrderID = @OrderID
//       `);

//     if (orderResult.recordset.length === 0) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const order = orderResult.recordset[0];

//     /* 2️⃣ ORDER ITEMS WITH IMAGE */
//     const itemsResult = await pool.request()
//       .input("OrderID", sql.Int, orderId)
//       .query(`
//         SELECT 
//           p.ProductName,
//           p.ProductWeight AS ProductWeight,
//           od.Quantity,
//           od.UnitPrice,
//           od.TotalPrice,

//           (
//             SELECT TOP 1 AttachmentFile
//             FROM Attachments a
//             WHERE a.ProductID = p.ProductID
//             ORDER BY a.SortOrder ASC
//           ) AS ImageUrl

//         FROM OrderDetails od
//         JOIN ProductMaster p 
//           ON od.ProductID = p.ProductID
//         WHERE od.OrderID = @OrderID
//       `);

//     const items = itemsResult.recordset.map(item => ({
//       productName: item.ProductName,
//       weight: item.ProductWeight || "",
//       qty: item.Quantity,
//       price: item.TotalPrice,
//       imageUrl: item.ImageUrl
//         ? `http://localhost:4000${item.ImageUrl}`
//         : null
//     }));

//     /* 3️⃣ FINAL RESPONSE */
//     res.json({
//       orderId: order.OrderID,
//       transactionDate: new Date(order.OrderDate).toDateString(),
//       paymentMethod: order.PaymentMode,
//       shippingMethod: "Shiprocket",
//       subtotal: order.TotalAmount,
//       gst: order.TaxAmount,
//       shipping: "FREE",
//       total: order.TotalAmount + order.TaxAmount ,
//       items
//     });

//   } catch (err) {
//     console.error("❌ ORDER FETCH ERROR:", err);
//     res.status(500).json({
//       message: "Failed to fetch order",
//       error: err.message
//     });
//   }
// });

//getting the order details to post it in myorders page
// app.get("/api/orders/user/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Order master
//     const ordersResult = await new sql.Request()
//       .input("UserID", sql.Int, userId)
//       .query(`
//         SELECT 
//           o.OrderID,
//           o.OrderDate,
//           o.OrderStatus,
//           o.PaymentStatus
//         FROM OrderMaster o
//         WHERE o.UserID = @UserID
//         ORDER BY o.OrderDate DESC
//       `);

//     const orders = [];

//     for (let order of ordersResult.recordset) {
//       // order items
//       const itemsResult = await new sql.Request()
//         .input("OrderID", sql.Int, order.OrderID)
//         .query(`
//           SELECT 
//             p.ProductName,
//             od.Quantity,
//             od.UnitPrice,
//             od.TotalPrice,
            
//           FROM OrderDetails od
//           JOIN ProductMaster p ON od.ProductID = p.ProductID
//           WHERE od.OrderID = @OrderID
//         `);

//       orders.push({
//         orderId: order.OrderID,
//         orderDate: new Date(order.OrderDate).toDateString(),
//         orderStatus: order.OrderStatus,
//         paymentStatus: order.PaymentStatus,
//         items: itemsResult.recordset.map(i => ({
//           productName: i.ProductName,
//           qty: i.Quantity,
//           price: i.TotalPrice,
//           weight: "200gms",
//           imageUrl: "https://via.placeholder.com/80"
//         }))
//       });
//     }

//     res.json({ success: true, data: orders });

//   } catch (err) {
//     console.error("❌ USER ORDERS ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch orders"
//     });
//   }
// });

app.get("/api/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const pool = await sql.connect(dbConfig);

    /* 1️⃣ ORDER MASTER */

    const orderResult = await pool.request()
      .input("OrderID", sql.Int, orderId)
      .query(`
        SELECT 
          o.OrderID,
          o.OrderDate,
          o.SubTotalAmount,
          o.DiscountAmount,
          o.CouponDiscount,
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

    /* 2️⃣ ORDER ITEMS WITH IMAGE */

    const itemsResult = await pool.request()
      .input("OrderID", sql.Int, orderId)
      .query(`
        SELECT 
          p.ProductName,
          p.ProductWeight AS ProductWeight,
          od.Quantity,
          od.UnitPrice,
          od.TotalPrice,

          (
            SELECT TOP 1 AttachmentFile
            FROM Attachments a
            WHERE a.ProductID = p.ProductID
            ORDER BY a.SortOrder ASC
          ) AS ImageUrl

        FROM OrderDetails od
        JOIN ProductMaster p 
          ON od.ProductID = p.ProductID
        WHERE od.OrderID = @OrderID
      `);

    const items = itemsResult.recordset.map(item => ({
      productName: item.ProductName,
      weight: item.ProductWeight || "",
      qty: item.Quantity,
      price: item.TotalPrice,
      imageUrl: item.ImageUrl
        ? `http://localhost:4000${item.ImageUrl}`
        : null
    }));

    /* 3️⃣ FINAL RESPONSE */

    res.json({
      orderId: order.OrderID,
      transactionDate: new Date(order.OrderDate).toDateString(),
      paymentMethod: order.PaymentMode,
      shippingMethod: "Shiprocket",

      subtotal: order.SubTotalAmount,
      discount: order.DiscountAmount,
      couponDiscount:order.CouponDiscount,
      gst: order.TaxAmount,
      shipping: "FREE",
      total: order.TotalAmount,

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


//to get the invoice details

// app.get("/api/orders/user/:userId", async (req, res) => {
//   try {

//     const { userId } = req.params;

//     const ordersResult = await new sql.Request()
//       .input("UserID", sql.Int, userId)
//       .query(`
//         SELECT 
//           o.OrderID,
//           o.OrderDate,
//           o.OrderStatus,
//           o.PaymentStatus,
//           o.SubTotalAmount,
//           o.DiscountAmount,
//           o.TaxAmount,
//           o.TotalAmount
//         FROM OrderMaster o
//         WHERE o.UserID = @UserID
//         ORDER BY o.OrderDate DESC
//       `);

//     const orders = [];

//     for (let order of ordersResult.recordset) {

//       const itemsResult = await new sql.Request()
//         .input("OrderID", sql.Int, order.OrderID)
//         .query(`
//           SELECT 
//             p.ProductName,
//             p.ProductWeight,
//             od.Quantity,
//             od.UnitPrice,
//             od.TotalPrice,

//             (
//               SELECT TOP 1 AttachmentFile
//               FROM Attachments a
//               WHERE a.ProductID = p.ProductID
//               ORDER BY a.SortOrder ASC
//             ) AS ImageUrl

//           FROM OrderDetails od
//           JOIN ProductMaster p 
//             ON od.ProductID = p.ProductID
//           WHERE od.OrderID = @OrderID
//         `);

//       orders.push({
//         orderId: order.OrderID,
//         orderDate: new Date(order.OrderDate).toDateString(),
//         orderStatus: order.OrderStatus,
//         paymentStatus: order.PaymentStatus,

//         subTotal: order.SubTotalAmount,
//         discount: order.DiscountAmount,
//         tax: order.TaxAmount,
//         finalAmount: order.TotalAmount,

//         items: itemsResult.recordset.map(i => ({
//           productName: i.ProductName,
//           qty: i.Quantity,
//           finalAmount: i.TotalPrice,
//           weight: i.ProductWeight || "",
//           imageUrl: i.ImageUrl
//             ? `http://localhost:4000${i.ImageUrl}`
//             : "https://via.placeholder.com/80"
//         }))
//       });

//     }

//     res.json({
//       success: true,
//       data: orders
//     });

//   } catch (err) {

//     console.error("❌ USER ORDERS ERROR:", err);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch orders"
//     });

//   }
// });


app.get("/api/orders/user/:userId", async (req, res) => {
  try {

    const { userId } = req.params;

    const ordersResult = await new sql.Request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT 
          o.OrderID,
          o.OrderDate,
          o.OrderStatus,
          o.PaymentStatus,
          o.SubTotalAmount,
          o.DiscountAmount,
          o.TaxAmount,
          o.TotalAmount
        FROM OrderMaster o
        WHERE o.UserID = @UserID
        ORDER BY o.OrderDate DESC
      `);

    const orders = [];

    for (let order of ordersResult.recordset) {

      const itemsResult = await new sql.Request()
        .input("OrderID", sql.Int, order.OrderID)
        .query(`
          SELECT 
            p.ProductID,
            p.ProductName,
            p.ProductWeight,
            od.Quantity,
            od.UnitPrice,
            od.TotalPrice,

            (
              SELECT TOP 1 AttachmentFile
              FROM Attachments a
              WHERE a.ProductID = p.ProductID
              ORDER BY a.SortOrder ASC
            ) AS ImageUrl

          FROM OrderDetails od
          JOIN ProductMaster p 
            ON od.ProductID = p.ProductID
          WHERE od.OrderID = @OrderID
        `);

      orders.push({
        orderId: order.OrderID,
        orderDate: new Date(order.OrderDate).toDateString(),
        orderStatus: order.OrderStatus,
        paymentStatus: order.PaymentStatus,

        subTotal: order.SubTotalAmount,
        discount: order.DiscountAmount,
        tax: order.TaxAmount,
        finalAmount: order.TotalAmount,

        items: itemsResult.recordset.map(i => ({
          productId: i.ProductID,
          productName: i.ProductName,
          qty: i.Quantity,
          unitPrice: i.UnitPrice,      // product price
          totalPrice: i.TotalPrice,    // qty × price
          weight: i.ProductWeight || "",
          imageUrl: i.ImageUrl
            ? `http://localhost:4000${i.ImageUrl}`
            : "https://via.placeholder.com/80"
        }))
      });

    }

    res.json({
      success: true,
      data: orders
    });

  } catch (err) {

    console.error("❌ USER ORDERS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });

  }
});



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
      redirectUrl: "http://localhost:5173/payment",
      redirectMode: "GET",
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


// ============================================
// GET API - Get Attachments by ProductID
// ============================================

// to get attachments(images) from db to  
app.get("/api/attachments/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await sql.query`
      SELECT AttachmentID, ProductID, AttachmentName, AttachmentFile
      FROM Attachments
      WHERE ProductID = ${productId}
      ORDER BY Sortorder
    `;

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching attachments" });
  }
});

//to post the images related to productid in to the db 
// app.post(
//   "/api/attachments/:productId",
//   upload.array("images", 4), // ✅ max 4 images
//   async (req, res) => {
//     try {
//       const { productId } = req.params;

//       if (!req.files || req.files.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "No images uploaded"
//         });
//       }

//       const pool = await sql.connect(dbConfig);

//       for (let i = 0; i < req.files.length; i++) {
//         const file = req.files[i];

//         await pool.request()
//           .input("ProductID", sql.Int, productId)
//           .input("AttachmentName", sql.NVarChar(255), file.filename)
//           .input("AttachmentFile", sql.NVarChar(500), `/uploads/${file.filename}`)
//           .input("SortOrder", sql.Int, i + 1) // ✅ START FROM 1
//           .input("CreatedBy", sql.Int, 1)
//           .query(`
//             INSERT INTO dbo.Attachments
//             (
//               ProductID,
//               Section,
//               SortOrder,
//               AttachmentName,
//               AttachmentFile,
//               CreatedBy,
//               CreatedDt
//             )
//             VALUES
//             (
//               @ProductID,
//               'PRODUCT',
//               @SortOrder,
//               @AttachmentName,
//               @AttachmentFile,
//               @CreatedBy,
//               GETDATE()
//             )
//           `);
//       }

//       res.status(201).json({
//         success: true,
//         message: "Images uploaded successfully"
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Attachment upload failed",
//         error: error.message
//       });
//     }
//   }
// );


app.post(
  "/api/attachments/:productId",
  productUpload.array("images", 4),
  async (req, res) => {
    try {
      const { productId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No images uploaded"
        });
      }

      const pool = await sql.connect(dbConfig);

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        await pool.request()
          .input("ProductID", sql.Int, productId)
          .input("AttachmentName", sql.NVarChar(255), file.filename)
          .input("AttachmentFile", sql.NVarChar(500), `/uploads/products/${file.filename}`)
          .input("SortOrder", sql.Int, i + 1)
          .input("CreatedBy", sql.Int, 1)
          .query(`
            INSERT INTO dbo.Attachments
            (
              ProductID,
              Section,
              SortOrder,
              AttachmentName,
              AttachmentFile,
              CreatedBy,
              CreatedDt
            )
            VALUES
            (
              @ProductID,
              'PRODUCT',
              @SortOrder,
              @AttachmentName,
              @AttachmentFile,
              @CreatedBy,
              GETDATE()
            )
          `);
      }

      res.status(201).json({
        success: true,
        message: "Images uploaded successfully"
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Attachment upload failed",
        error: error.message
      });
    }
  }
);


app.get("/api/attachments/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await sql.query(`
      SELECT AttachmentID,
             ProductID,
             AttachmentFile,
             SortOrder
      FROM dbo.Attachments
      WHERE ProductID = ${productId}
      ORDER BY SortOrder ASC
    `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error("❌ Fetch attachments failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attachments",
      error: error.message
    });
  }
});


// app.put(
//   "/api/attachments/:productId",
//   productUpload.array("images", 4),
//   async (req, res) => {
//     try {
//       const { productId } = req.params;

//       const pool = await sql.connect(dbConfig);

//       /* STEP 1 — GET OLD IMAGES */

//       const oldImages = await pool.request()
//         .input("ProductID", sql.Int, productId)
//         .query(`
//           SELECT AttachmentFile 
//           FROM dbo.Attachments
//           WHERE ProductID = @ProductID
//         `);

//       const fs = require("fs");
//       const path = require("path");

//       /* STEP 2 — DELETE FILES FROM SERVER */

//       for (const img of oldImages.recordset) {

//         const filePath = path.join(__dirname, img.AttachmentFile);

//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }

//       }

//       /* STEP 3 — DELETE OLD DB RECORDS */

//       await pool.request()
//         .input("ProductID", sql.Int, productId)
//         .query(`
//           DELETE FROM dbo.Attachments
//           WHERE ProductID = @ProductID
//         `);

//       /* STEP 4 — INSERT NEW IMAGES */

//       if (req.files && req.files.length > 0) {

//         for (let i = 0; i < req.files.length; i++) {

//           const file = req.files[i];

//           await pool.request()
//             .input("ProductID", sql.Int, productId)
//             .input("AttachmentName", sql.NVarChar(255), file.filename)
//             .input("AttachmentFile", sql.NVarChar(500), `/uploads/products/${file.filename}`)
//             .input("SortOrder", sql.Int, i + 1)
//             .input("CreatedBy", sql.Int, 1)
//             .query(`
//               INSERT INTO dbo.Attachments
//               (
//                 ProductID,
//                 Section,
//                 SortOrder,
//                 AttachmentName,
//                 AttachmentFile,
//                 CreatedBy,
//                 CreatedDt
//               )
//               VALUES
//               (
//                 @ProductID,
//                 'PRODUCT',
//                 @SortOrder,
//                 @AttachmentName,
//                 @AttachmentFile,
//                 @CreatedBy,
//                 GETDATE()
//               )
//             `);

//         }

//       }

//       res.json({
//         success: true,
//         message: "Product images updated successfully"
//       });

//     } catch (error) {

//       console.error("❌ Update attachments failed:", error);

//       res.status(500).json({
//         success: false,
//         message: "Failed to update images",
//         error: error.message
//       });

//     }
//   }
// );

app.put(
  "/api/attachments/:productId",
  productUpload.array("images", 4),
  async (req, res) => {
    try {
      const { productId } = req.params;

      const pool = await sql.connect(dbConfig);

      // 🔥 ONLY INSERT NEW IMAGES - DON'T DELETE EXISTING ONES
      
      if (req.files && req.files.length > 0) {

        // Get current max SortOrder to continue numbering
        const maxSortResult = await pool.request()
          .input("ProductID", sql.Int, productId)
          .query(`
            SELECT ISNULL(MAX(SortOrder), 0) as MaxSort
            FROM dbo.Attachments
            WHERE ProductID = @ProductID
          `);

        let startSort = maxSortResult.recordset[0].MaxSort + 1;

        for (let i = 0; i < req.files.length; i++) {

          const file = req.files[i];

          await pool.request()
            .input("ProductID", sql.Int, productId)
            .input("AttachmentName", sql.NVarChar(255), file.filename)
            .input("AttachmentFile", sql.NVarChar(500), `/uploads/products/${file.filename}`)
            .input("SortOrder", sql.Int, startSort + i)
            .input("CreatedBy", sql.Int, 1)
            .query(`
              INSERT INTO dbo.Attachments
              (
                ProductID,
                Section,
                SortOrder,
                AttachmentName,
                AttachmentFile,
                CreatedBy,
                CreatedDt
              )
              VALUES
              (
                @ProductID,
                'PRODUCT',
                @SortOrder,
                @AttachmentName,
                @AttachmentFile,
                @CreatedBy,
                GETDATE()
              )
            `);

        }

      }

      res.json({
        success: true,
        message: "Product images updated successfully"
      });

    } catch (error) {

      console.error("❌ Update attachments failed:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update images",
        error: error.message
      });

    }
  }
);
app.put("/api/attachments/set-primary", async (req, res) => {
  try {

    const { productId, attachmentId } = req.body;

    const pool = await sql.connect(dbConfig);

    /* Push all images down */
    await pool.request()
      .input("ProductID", sql.Int, productId)
      .query(`
        UPDATE dbo.Attachments
        SET SortOrder = SortOrder + 1
        WHERE ProductID = @ProductID
      `);

    /* Set selected image as primary */
    await pool.request()
      .input("AttachmentID", sql.Int, attachmentId)
      .query(`
        UPDATE dbo.Attachments
        SET SortOrder = 1
        WHERE AttachmentID = @AttachmentID
      `);

    res.json({
      success: true,
      message: "Primary image updated"
    });

  } catch (error) {

    console.error("Primary image update failed:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update primary image"
    });

  }
});

app.delete("/api/attachments/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const pool = await sql.connect(dbConfig);

    // Get file path
    const result = await pool.request()
      .input("AttachmentID", sql.Int, id)
      .query(`
        SELECT AttachmentFile 
        FROM Attachments 
        WHERE AttachmentID = @AttachmentID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const filePath = result.recordset[0].AttachmentFile;

    // Delete DB record
    await pool.request()
      .input("AttachmentID", sql.Int, id)
      .query(`
        DELETE FROM Attachments 
        WHERE AttachmentID = @AttachmentID
      `);

    // Delete file from server
    const fs = require("fs");
    const path = require("path");

    const fullPath = path.join(__dirname, filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

//admin back office apis 
//to get product categories from the db into admin/category 



// app.get("/api/admin/product-categories", async (req, res) => {
//   try {
//     const result = await sql.query(`
//       SELECT
//         ProductCategoryID,
//         CategoryName,
//         CategoryDescription,
//         CategoryImage,
//         Status,              -- ✅ Include Status
//         DisplayOrder
//       FROM dbo.ProductCategory
//       ORDER BY DisplayOrder ASC
//     `);

//     res.status(200).json({
//       success: true,
//       data: result.recordset
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch categories",
//       error: error.message
//     });
//   }
// });

app.get("/api/admin/product-categories", async (req, res) => {
  try {

    const result = await sql.query(`
      SELECT
        ProductCategoryID,
        CategoryName,
        CategoryDescription,
        CategoryImage,
        Status,
        DisplayOrder
      FROM dbo.ProductCategory
      WHERE Status = 1
      ORDER BY DisplayOrder ASC
    `);

    res.status(200).json({
      success: true,
      data: result.recordset
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });

  }
});


app.put("/api/product-categories/:id", upload.single("CategoryImage"), async (req, res) => {
  try {

    const { id } = req.params;

    const {
      CategoryName,
      CategoryDescription,
      Status,
      DisplayOrder,
      ModifiedBy
    } = req.body;

    if (!CategoryName) {
      return res.status(400).json({
        success: false,
        message: "CategoryName is required"
      });
    }

    const imagePath = req.file
      ? `/uploads/categories/${req.file.filename}`
      : null;

    const request = new sql.Request();

    request.input("ProductCategoryID", sql.Int, id);
    request.input("CategoryName", sql.NVarChar, CategoryName);
    request.input("CategoryDescription", sql.NVarChar, CategoryDescription ?? null);
    request.input("Status", sql.Bit, Status ?? 1);
    request.input("DisplayOrder", sql.Int, DisplayOrder ?? 0);
    request.input("ModifiedBy", sql.Int, ModifiedBy ?? 1);

    let query = `
      UPDATE dbo.ProductCategory
      SET
        CategoryName = @CategoryName,
        CategoryDescription = @CategoryDescription,
        Status = @Status,
        DisplayOrder = @DisplayOrder,
        ModifiedBy = @ModifiedBy,
        ModifiedDt = GETDATE()
    `;

    if (imagePath) {
      request.input("CategoryImage", sql.NVarChar, imagePath);
      query += `, CategoryImage = @CategoryImage`;
    }

    query += ` WHERE ProductCategoryID = @ProductCategoryID`;

    await request.query(query);

    res.status(200).json({
      success: true,
      message: "Category updated successfully"
    });

  } catch (error) {

    console.error("❌ Error updating category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message
    });

  }
});


app.delete("/api/product-categories/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const request = new sql.Request();

    request.input("ProductCategoryID", sql.Int, id);

    const result = await request.query(`
      UPDATE dbo.ProductCategory
      SET 
        Status = 0,
        ModifiedDt = GETDATE()
      WHERE ProductCategoryID = @ProductCategoryID
    `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully (soft delete)"
    });

  } catch (error) {

    console.error("❌ Error deleting category:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message
    });

  }
});

//to get the products from db into admin/products
app.get("/api/admin-products", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT 
        p.ProductID,
        p.ProductName,
        p.ProductCode,
        p.ProductWeight,
        p.Quantity,
        p.Status,
        pr.Price,
        pr.DiscountPrice,
        a.AttachmentFile AS ProductImage
      FROM dbo.ProductMaster p

      LEFT JOIN dbo.ProductPriceMaster pr 
        ON p.ProductID = pr.ProductID

      LEFT JOIN dbo.Attachments a
        ON p.ProductID = a.ProductID
        AND a.SortOrder = 1   -- ✅ ONLY PRIMARY IMAGE

      ORDER BY p.ProductID DESC
    `);

    res.status(200).json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
});


// app.get("/api/admin-products", async (req, res) => {
//   try {
//     const result = await sql.query(`
//       SELECT 
//         p.ProductID,
//         p.ProductName,
//         p.ProductCode,
//         p.ProductWeight,
//         p.Quantity,
//         p.Status,

//         pr.Price,
//         pr.DiscountPrice,

//         a.AttachmentFile AS ProductImage

//       FROM dbo.ProductMaster p

//       OUTER APPLY (
//         SELECT TOP 1 Price, DiscountPrice
//         FROM dbo.ProductPriceMaster
//         WHERE ProductID = p.ProductID
//         ORDER BY ProductPriceID DESC
//       ) pr

//       OUTER APPLY (
//         SELECT TOP 1 AttachmentFile
//         FROM dbo.Attachments
//         WHERE ProductID = p.ProductID
//         AND SortOrder = 1
//       ) a

//       ORDER BY p.ProductID DESC
//     `);

//     res.status(200).json({
//       success: true,
//       data: result.recordset
//     });

//   } catch (error) {
//     console.error("❌ Error fetching products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch products",
//       error: error.message
//     });
//   }
// });


// ==============================
// ADMIN - GET ALL ORDERS WITH DELIVERY
// ==============================
// app.get("/api/admin/orders", async (req, res) => {
//   try {
//     const ordersResult = await new sql.Request().query(`
//       SELECT 
//         o.OrderID,
//         o.UserID,
//         u.FirstName,
//         o.OrderDate,
//         o.TotalAmount,
//         o.PaymentMode,
//         o.PaymentStatus,
//         o.OrderStatus,
//         d.ExpectedDeliveryDate,
//         d.DeliveryStatus
//       FROM OrderMaster o
//       LEFT JOIN Delivery d ON o.OrderID = d.OrderID
//       LEFT JOIN UserMaster u ON o.UserID = u.UserID  
//       ORDER BY o.OrderDate DESC
//     `);

//     const orders = [];

//     for (let order of ordersResult.recordset) {
//       const itemsResult = await new sql.Request()
//         .input("OrderID", sql.Int, order.OrderID)
//         .query(`
//           SELECT 
//             p.ProductName,
//             od.Quantity,
//              p.ProductWeight,
//             od.UnitPrice,
//             od.TotalPrice
//           FROM OrderDetails od
//           JOIN ProductMaster p ON od.ProductID = p.ProductID
//           WHERE od.OrderID = @OrderID
//         `);

//       orders.push({
//         orderId: order.OrderID,
//         userId: order.UserID,
//         FirstName:order.FirstName,
//         orderDate: new Date(order.OrderDate).toLocaleDateString(),
//         expectedDelivery: order.ExpectedDeliveryDate
//           ? new Date(order.ExpectedDeliveryDate).toLocaleDateString()
//           : "-",
//         deliveryStatus: order.DeliveryStatus,
//         orderStatus: order.OrderStatus,
//         paymentStatus: order.PaymentStatus,
//         paymentMode: order.PaymentMode,
//         totalAmount: order.TotalAmount,
//         items: itemsResult.recordset
//       });
//     }

//     res.json({ success: true, data: orders });

//   } catch (err) {
//     console.error("❌ ADMIN ORDER ERROR:", err);
//     res.status(500).json({ success: false });
//   }
// });

app.get("/api/admin/orders", async (req, res) => {
  try {
    const ordersResult = await new sql.Request().query(`
      SELECT 
        o.OrderID,
        o.UserID,
        u.FirstName,
        u.Email,
        u.ContactNo,
        u.CreatedDt,
        o.OrderDate,
        o.TotalAmount,
        o.TaxAmount,
        o.InvoiceNo,
        o.PaymentMode,
        o.TransactionID,
        o.PaymentStatus,
        o.OrderStatus,

        o.CouponCode,
        o.CouponDiscount,
        d.ExpectedDeliveryDate,
        d.DeliveryStatus
      FROM OrderMaster o
      LEFT JOIN Delivery d ON o.OrderID = d.OrderID
      LEFT JOIN UserMaster u ON o.UserID = u.UserID  
      ORDER BY o.OrderDate DESC
    `);

    const orders = [];

    for (let order of ordersResult.recordset) {

      const itemsResult = await new sql.Request()
        .input("OrderID", sql.Int, order.OrderID)
        .query(`
          SELECT 
            p.ProductName,
            p.ProductWeight,
            od.Quantity,
            od.UnitPrice,
            od.TotalPrice
          FROM OrderDetails od
          JOIN ProductMaster p ON od.ProductID = p.ProductID
          WHERE od.OrderID = @OrderID
        `);

      orders.push({
        orderId: order.OrderID,
        userId: order.UserID,
        email:order.Email,
        contact:order.ContactNo,
        regdate:order.CreatedDt,
        customerName: order.FirstName,
        orderDate: new Date(order.OrderDate).toLocaleDateString(),
        expectedDelivery: order.ExpectedDeliveryDate
          ? new Date(order.ExpectedDeliveryDate).toLocaleDateString()
          : "-",
        deliveryStatus: order.DeliveryStatus,
        orderStatus: order.OrderStatus,
        paymentStatus: order.PaymentStatus,
        paymentMode: order.PaymentMode,
        totalAmount: order.TotalAmount,
        taxAmount: order.TaxAmount,
        invoiceNo: order.InvoiceNo,
        transactionId: order.TransactionID,

  couponCode: order.CouponCode,
  couponDiscount: order.CouponDiscount,
        items: itemsResult.recordset
      });
    }

    res.json({ success: true, data: orders });

  } catch (err) {
    console.error("❌ ADMIN ORDER ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// app.get("/api/admin/customers", async (req, res) => {
//   try {
//     const result = await new sql.Request().query(`
//       SELECT 
//         u.UserID,
//         u.FirstName,
//         u.LastName,
//         u.Email,
//         u.ContactNo,
//         u.Status,
//         u.CreatedDt,
//         o.OrderDate,
//       FROM UserMaster u
//       LEFT JOIN (
//           SELECT UserID, 
//                  MAX(OrderDate) AS OrderDate,
//           FROM OrderMaster
//           GROUP BY UserID
//       ) o ON u.UserID = o.UserID
//       WHERE u.RoleID = 5
//       ORDER BY o.CreatedDt DESC
//     `);

//     res.json({
//       success: true,
//       data: result.recordset
//     });

//   } catch (err) {
//     console.error("❌ CUSTOMER API ERROR:", err);
//     res.status(500).json({ success: false });
//   }
// });

app.get("/api/admin/customers", async (req, res) => {
  try {
    const result = await new sql.Request().query(`
      SELECT 
        u.UserID,
        u.FirstName,
        u.LastName,
        u.Email,
        u.ContactNo,
        u.Status,
        u.CreatedDt ,
        o.OrderDate
      FROM UserMaster u
      LEFT JOIN (
          SELECT UserID, 
                 MAX(OrderDate) AS OrderDate
          FROM OrderMaster
          GROUP BY UserID
      ) o ON u.UserID = o.UserID
      WHERE u.RoleID = 5
      ORDER BY u.CreatedDt DESC
    `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.error("❌ CUSTOMER API ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// app.get("/api/cart/recommendations/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const result = await new sql.Request()
//       .input("UserID", sql.Int, userId)
//       .query(`
//         SELECT 
//           pm.ProductID,
//           pm.ProductName,
//           pm.ProductDescription,
//           pm.ProductWeight,
//           ISNULL(ppm.Price, 0) AS Price,
//           ISNULL(ppm.DiscountPrice, 0) AS DiscountPrice,
//           a.AttachmentFile AS ProductImage
//         FROM Cart c

//         INNER JOIN ProductMaster cartPm
//           ON c.ProductID = cartPm.ProductID

//         INNER JOIN ProductMaster pm
//           ON pm.ProductCategoryID = cartPm.ProductCategoryID

//         LEFT JOIN ProductPriceMaster ppm
//           ON pm.ProductID = ppm.ProductID

//         LEFT JOIN Attachments a
//           ON pm.ProductID = a.ProductID
//           AND a.SortOrder = 1

//         WHERE c.UserID = @UserID
//           AND pm.ProductID NOT IN (
//               SELECT ProductID 
//               FROM Cart
//               WHERE UserID = @UserID
//           )
//           AND pm.Status = 1

//         ORDER BY pm.CreatedDt DESC
//       `);

//     res.json(result.recordset);

//   } catch (err) {
//     console.error("❌ Recommendation API Error:", err);
//     res.status(500).json({
//       message: "Failed to load recommendations",
//       error: err.message
//     });
//   }
// });

app.get("/api/cart/recommendations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await new sql.Request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT DISTINCT
            pm.ProductID,
            pm.ProductName,
            pm.ProductDescription,
            pm.ProductWeight,
            ISNULL(ppm.Price, 0) AS Price,
            ISNULL(ppm.DiscountPrice, 0) AS DiscountPrice,
            img.AttachmentFile AS ProductImage

        FROM Cart c

        INNER JOIN ProductMaster cartPm
            ON c.ProductID = cartPm.ProductID

        INNER JOIN ProductMaster pm
            ON pm.ProductCategoryID = cartPm.ProductCategoryID
            AND pm.Status = 1

        LEFT JOIN ProductPriceMaster ppm
            ON pm.ProductID = ppm.ProductID

        OUTER APPLY (
            SELECT TOP 1 AttachmentFile
            FROM Attachments
            WHERE ProductID = pm.ProductID
            ORDER BY SortOrder ASC
        ) img

        WHERE c.UserID = @UserID
          AND pm.ProductID NOT IN (
              SELECT ProductID 
              FROM Cart
              WHERE UserID = @UserID
          )

        ORDER BY pm.ProductID DESC
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error("❌ Recommendation API Error:", err);
    res.status(500).json({
      message: "Failed to load recommendations",
      error: err.message
    });
  }
});

// ADD NEW ADDRESS
app.get("/api/address/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT 
          AddressID,
          UserID,
          FullName,
          MobileNumber,
          AddressLine1,
          AddressLine2,
          Landmark,
          City,
          State,
          Country,
          Pincode,
          AddressType,
          IsDefault
        FROM Address
        WHERE UserID = @UserID
        ORDER BY IsDefault DESC, CreatedDate DESC
      `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.post("/api/address", async (req, res) => {
  try {
    const {
      userId,
      name,
      mobile,
      flat,
      street,
      landmark,
      city,
      state,
      pincode,
      type,
      isDefault
    } = req.body;

    const pool = await sql.connect(dbConfig);

    // Check if first address
    const countResult = await pool.request()
      .input("UserID", sql.Int, userId)
      .query(`SELECT COUNT(*) as total FROM Address WHERE UserID = @UserID`);

    const isFirstAddress = countResult.recordset[0].total === 0;

    // If setting default → remove other defaults
    if (isDefault || isFirstAddress) {
      await pool.request()
        .input("UserID", sql.Int, userId)
        .query(`
          UPDATE Address
          SET IsDefault = 0
          WHERE UserID = @UserID
        `);
    }

    await pool.request()
      .input("UserID", sql.Int, userId)
      .input("FullName", sql.NVarChar, name)
      .input("MobileNumber", sql.NVarChar, mobile)
      .input("AddressLine1", sql.NVarChar, flat)
      .input("AddressLine2", sql.NVarChar, street)
      .input("Landmark", sql.NVarChar, landmark)
      .input("City", sql.NVarChar, city)
      .input("State", sql.NVarChar, state)
      .input("Country", sql.NVarChar, "India")
      .input("Pincode", sql.NVarChar, pincode)
      .input("AddressType", sql.NVarChar, type)
      .input("IsDefault", sql.Bit, isFirstAddress ? 1 : (isDefault ? 1 : 0))
      .query(`
        INSERT INTO Address (
          UserID, FullName, MobileNumber,
          AddressLine1, AddressLine2, Landmark,
          City, State, Country, Pincode,
          AddressType, IsDefault,
          CreatedDate, UpdatedDate
        )
        VALUES (
          @UserID, @FullName, @MobileNumber,
          @AddressLine1, @AddressLine2, @Landmark,
          @City, @State, @Country, @Pincode,
          @AddressType, @IsDefault,
          GETDATE(), GETDATE()
        )
      `);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.put("/api/address/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      mobile,
      flat,
      street,
      landmark,
      city,
      state,
      pincode,
      type,
      isDefault,
      userId
    } = req.body;

    const pool = await sql.connect(dbConfig);

    if (isDefault) {
      await pool.request()
        .input("UserID", sql.Int, userId)
        .query(`
          UPDATE Address
          SET IsDefault = 0
          WHERE UserID = @UserID
        `);
    }

    await pool.request()
      .input("AddressID", sql.Int, id)
      .input("FullName", sql.NVarChar, name)
      .input("MobileNumber", sql.NVarChar, mobile)
      .input("AddressLine1", sql.NVarChar, flat)
      .input("AddressLine2", sql.NVarChar, street)
      .input("Landmark", sql.NVarChar, landmark)
      .input("City", sql.NVarChar, city)
      .input("State", sql.NVarChar, state)
      .input("Pincode", sql.NVarChar, pincode)
      .input("AddressType", sql.NVarChar, type)
      .input("IsDefault", sql.Bit, isDefault ? 1 : 0)
      .query(`
        UPDATE Address
        SET
          FullName = @FullName,
          MobileNumber = @MobileNumber,
          AddressLine1 = @AddressLine1,
          AddressLine2 = @AddressLine2,
          Landmark = @Landmark,
          City = @City,
          State = @State,
          Pincode = @Pincode,
          AddressType = @AddressType,
          IsDefault = @IsDefault,
          UpdatedDate = GETDATE()
        WHERE AddressID = @AddressID
      `);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.delete("/api/address/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("AddressID", sql.Int, id)
      .query(`
        DELETE FROM Address
        WHERE AddressID = @AddressID
      `);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.put("/api/address/set-default/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("UserID", sql.Int, userId)
      .query(`
        UPDATE Address
        SET IsDefault = 0
        WHERE UserID = @UserID
      `);

    await pool.request()
      .input("AddressID", sql.Int, id)
      .query(`
        UPDATE Address
        SET IsDefault = 1
        WHERE AddressID = @AddressID
      `);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


app.get("/api/admin/payments", async (req, res) => {
  try {

    const result = await sql.query(`
      SELECT 
        OM.OrderID,
        OM.UserID,
        UM.FirstName AS CustomerName,
        OM.PaymentMode,
        OM.OrderDate,
        OM.TotalAmount,
        OM.PaymentStatus,
        OM.InvoiceNo
      FROM OrderMaster OM
      LEFT JOIN UserMaster UM ON OM.UserID = UM.UserID
      ORDER BY OM.OrderDate DESC
    `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.error("❌ ADMIN PAYMENT FETCH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment records",
      error: err.message
    });
  }
});
app.post("/api/admin/discount/create", async (req, res) => {
  try {

    const {
      DiscountName,
      CouponCode,
      DiscountType,
      DiscountValue,
      ApplyTo,
      ProductID,
      CategoryID,
      CustomerType,
      MinOrderAmount,
      MaxDiscount,
      StartDate,
      EndDate,
      UsageLimit,
      PerCustomer,
      FirstOrderOnly,
      Status
    } = req.body;

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("DiscountName", sql.NVarChar, DiscountName)
      .input("CouponCode", sql.NVarChar, CouponCode)
      .input("DiscountType", sql.NVarChar, DiscountType)
      .input("DiscountValue", sql.Decimal(10,2), Number(DiscountValue))
      .input("ApplyTo", sql.NVarChar, ApplyTo)
      .input("ProductID", sql.Int, ProductID || null)
      .input("CategoryID", sql.Int, CategoryID || null)
      .input("CustomerType", sql.NVarChar, CustomerType)
      .input("MinOrderAmount", sql.Decimal(10,2), Number(MinOrderAmount))
      .input("MaxDiscount", sql.Decimal(10,2), Number(MaxDiscount))
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .input("UsageLimit", sql.Int, Number(UsageLimit))
      .input("PerCustomer", sql.NVarChar, PerCustomer)
      .input("FirstOrderOnly", sql.Bit, FirstOrderOnly)
      .input("Status", sql.NVarChar, Status)
      .input("CreatedBy", sql.NVarChar, "1")

      .query(`
        INSERT INTO Discounts
        (
          DiscountName,
          CouponCode,
          DiscountType,
          DiscountValue,
          ApplyTo,
          ProductID,
          CategoryID,
          CustomerType,
          MinOrderAmount,
          MaxDiscount,
          StartDate,
          EndDate,
          UsageLimit,
          PerCustomer,
          FirstOrderOnly,
          Status,
          CreatedBy,
          CreatedDt
        )
        VALUES
        (
          @DiscountName,
          @CouponCode,
          @DiscountType,
          @DiscountValue,
          @ApplyTo,
          @ProductID,
          @CategoryID,
          @CustomerType,
          @MinOrderAmount,
          @MaxDiscount,
          @StartDate,
          @EndDate,
          @UsageLimit,
          @PerCustomer,
          @FirstOrderOnly,
          @Status,
          @CreatedBy,
          GETDATE()
        )
      `);

    res.json({
      success: true,
      message: "Discount created successfully"
    });

  } catch (error) {

    console.log("DISCOUNT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

// app.get("/api/discounts", async (req, res) => {
//   try {

//     const pool = await sql.connect(dbConfig);

//     const result = await pool.request().query(`
//       SELECT *
//       FROM Discounts
//       WHERE Status = 'Active'
//       AND GETDATE() BETWEEN StartDate AND EndDate
//     `);

//     res.json({
//       success: true,
//       data: result.recordset
//     });

//   } catch (err) {

//     console.log("DISCOUNT FETCH ERROR:", err);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch discounts"
//     });
//   }
// });


// app.get("/api/discounts", async (req, res) => {
//   try {

//     const pool = await sql.connect(dbConfig);

//     const result = await pool.request().query(`
//       SELECT 
//         DiscountID,
//         CouponCode,
//         DiscountType,
//         DiscountValue,
//         MinOrderValue,
//         MaxDiscount,
//         StartDate,
//         EndDate
//       FROM Discounts
//       WHERE Status = 'Active'
//       AND GETDATE() BETWEEN StartDate AND EndDate
//     `);

//     res.json({
//       success: true,
//       data: result.recordset
//     });

//   } catch (err) {

//     console.log("DISCOUNT FETCH ERROR:", err);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch discounts"
//     });

//   }
// });

app.get("/api/discounts", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT 
        DiscountID,
        CouponCode,
        DiscountType,
        DiscountValue,
        MinOrderAmount,   -- ✅ FIXED
        MaxDiscount,
        StartDate,
        EndDate
      FROM Discounts
      WHERE LTRIM(RTRIM(LOWER(Status))) = 'active'
      AND (
        (StartDate IS NULL OR EndDate IS NULL)
        OR GETDATE() BETWEEN StartDate AND EndDate
      )
    `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.log("❌ DISCOUNT FETCH ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch discounts",
      error: err.message
    });
  }
});

app.get("/api/admin/top-products", async (req, res) => {
  try {

    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT TOP 4 
        p.ProductName,
        SUM(od.Quantity) AS TotalSold
      FROM OrderDetails od
      JOIN ProductMaster p 
        ON od.ProductID = p.ProductID
      GROUP BY p.ProductName
      ORDER BY TotalSold DESC
    `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.error("Top products error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
app.get("/api/location/states", async (req, res) => {
  try {

    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT id, name
      FROM [Brihati].[dbo].[states]
      ORDER BY name
    `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {

    console.error("STATES API ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch states"
    });

  }
});


app.get("/api/location/cities/:stateId", async (req, res) => {

  try {

    const stateId = Number(req.params.stateId);

    if (!stateId) {
      return res.status(400).json({
        success: false,
        message: "Invalid stateId"
      });
    }

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("stateId", sql.Int, stateId)
      .query(`
        SELECT id, name
        FROM [Brihati].[dbo].[cities]
        WHERE state_id = @stateId
        ORDER BY name
      `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {

    console.error("CITIES API ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cities"
    });

  }

});

app.get("/api/location/pincodes", async (req, res) => {

  try {

    const { stateId, cityId } = req.query;

    if (!stateId || !cityId) {
      return res.status(400).json({
        success: false,
        message: "stateId and cityId are required"
      });
    }

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("stateId", sql.Int, Number(stateId))
      .input("cityId", sql.Int, Number(cityId))
      .query(`
        SELECT DISTINCT p.pincode, p.officename
        FROM [Brihati].[dbo].[pincode] p
        LEFT JOIN [Brihati].[dbo].[cities] c
        ON c.id = @cityId
        WHERE p.Stateid = @stateId
        AND (
            p.citiid = @cityId
            OR p.Districtname LIKE '%Bangalore%'
        )
        ORDER BY p.pincode
      `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {

    console.error("PINCODE API ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pincodes"
    });

  }

});

// app.get("/api/location/pincodes", async (req, res) => {

//   try {

//     const { stateId, cityId } = req.query;

//     if (!stateId || !cityId) {
//       return res.status(400).json({
//         success: false,
//         message: "stateId and cityId are required"
//       });
//     }

//     const pool = await sql.connect(dbConfig);

//     const result = await pool.request()
//       .input("stateId", sql.Int, Number(stateId))
//       .input("cityId", sql.Int, Number(cityId))
//       .query(`
//         SELECT DISTINCT 
//           p.pincode, 
//           p.officename
//         FROM [Brihati].[dbo].[pincode] p
//         WHERE p.Stateid = @stateId
//         AND p.citiid = @cityId
//         ORDER BY p.pincode
//       `);

//     res.json({
//       success: true,
//       data: result.recordset
//     });

//   } catch (err) {

//     console.error("PINCODE API ERROR:", err);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch pincodes"
//     });

//   }

// });



app.get("/api/location/validate-pincode", async (req, res) => {

  try {

    const { stateId, cityId, pincode } = req.query;

    if (!stateId || !cityId || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Missing parameters"
      });
    }

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input("stateId", sql.Int, Number(stateId))
      .input("cityId", sql.Int, Number(cityId))
      .input("pincode", sql.NVarChar, pincode)
      .query(`
        SELECT COUNT(*) AS count
        FROM [Brihati].[dbo].[pincode]
        WHERE Stateid = @stateId
        AND citiid = @cityId
        AND pincode = @pincode
      `);

    res.json({
      success: true,
      valid: result.recordset[0].count > 0
    });

  } catch (err) {

    console.error("PINCODE VALIDATION ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});

app.get("/api/admin/discounts", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT 
        DiscountID,
        DiscountName,
        CouponCode,
        DiscountType,
        DiscountValue,
        ApplyTo,
        ProductID,
        CategoryID,
        CustomerType,
        MinOrderAmount,
        MaxDiscount,
        StartDate,
        EndDate,
        UsageLimit,
        PerCustomer,
        FirstOrderOnly,
        Status
      FROM Discounts
      ORDER BY CreatedDt DESC
    `);

    res.json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    console.log("Discount fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch discounts", error: error.message });
  }
});


app.post("/api/admin/discount/update", async (req, res) => {
  try {
    const {
      DiscountID,
      DiscountName,
      CouponCode,
      DiscountType,
      DiscountValue,
      ApplyTo,
      ProductID,
      CategoryID,
      CustomerType,
      MinOrderAmount,
      MaxDiscount,
      StartDate,
      EndDate,
      UsageLimit,
      PerCustomer,
      FirstOrderOnly,
      Status
    } = req.body;

    if (!DiscountID) throw new Error("DiscountID is required for update");

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("DiscountID", sql.Int, DiscountID)
      .input("DiscountName", sql.NVarChar, DiscountName)
      .input("CouponCode", sql.NVarChar, CouponCode)
      .input("DiscountType", sql.NVarChar, DiscountType)
      .input("DiscountValue", sql.Decimal(10,2), Number(DiscountValue))
      .input("ApplyTo", sql.NVarChar, ApplyTo)
      .input("ProductID", sql.Int, ProductID || null)
      .input("CategoryID", sql.Int, CategoryID || null)
      .input("CustomerType", sql.NVarChar, CustomerType)
      .input("MinOrderAmount", sql.Decimal(10,2), Number(MinOrderAmount))
      .input("MaxDiscount", sql.Decimal(10,2), Number(MaxDiscount))
      .input("StartDate", sql.Date, StartDate)
      .input("EndDate", sql.Date, EndDate)
      .input("UsageLimit", sql.Int, Number(UsageLimit))
      .input("PerCustomer", sql.NVarChar, PerCustomer)
      .input("FirstOrderOnly", sql.Bit, FirstOrderOnly)
      .input("Status", sql.NVarChar, Status)
      .query(`
        UPDATE Discounts
        SET
          DiscountName = @DiscountName,
          CouponCode = @CouponCode,
          DiscountType = @DiscountType,
          DiscountValue = @DiscountValue,
          ApplyTo = @ApplyTo,
          ProductID = @ProductID,
          CategoryID = @CategoryID,
          CustomerType = @CustomerType,
          MinOrderAmount = @MinOrderAmount,
          MaxDiscount = @MaxDiscount,
          StartDate = @StartDate,
          EndDate = @EndDate,
          UsageLimit = @UsageLimit,
          PerCustomer = @PerCustomer,
          FirstOrderOnly = @FirstOrderOnly,
          Status = @Status,
          ModifiedBy = '1',
          ModifiedDt = GETDATE()
        WHERE DiscountID = @DiscountID
      `);

    res.json({ success: true, message: "Discount updated successfully" });

  } catch (error) {
    console.log("Discount update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// DELETE /api/admin/discount/:id
app.delete("/api/admin/discount/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("DiscountID", sql.Int, id)
      .query(`
        DELETE FROM Discounts
        WHERE DiscountID = @DiscountID
      `);

    res.json({
      success: true,
      message: "Discount deleted successfully"
    });

  } catch (err) {
    console.error("DELETE DISCOUNT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete discount",
      error: err.message
    });
  }
});




app.get("/api/product-full-details/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const pool = await sql.connect(dbConfig);

    /* PRODUCT DETAILS */
    const productResult = await pool.request()
      .input("ProductID", sql.Int, productId)
      .query(`
        SELECT 
          p.ProductID,
          p.ProductName,
          p.ProductDescription,
          p.ProductCode,
          p.ProductWeight,
          p.Quantity,
          p.SKU,
          p.Status,
          p.ProductCategoryID,
          c.CategoryName
        FROM ProductMaster p
        LEFT JOIN ProductCategory c
        ON p.ProductCategoryID = c.ProductCategoryID
        WHERE p.ProductID = @ProductID
      `);

    /* PRICE */
    const priceResult = await pool.request()
      .input("ProductID", sql.Int, productId)
      .query(`
        SELECT 
          Price,
          DiscountPrice
        FROM ProductPriceMaster
        WHERE ProductID = @ProductID
      `);

    /* IMAGES */
    const imageResult = await pool.request()
      .input("ProductID", sql.Int, productId)
      .query(`
        SELECT 
          AttachmentID,
          AttachmentFile,
          SortOrder
        FROM Attachments
        WHERE ProductID = @ProductID
        ORDER BY SortOrder ASC
      `);

    res.json({
      success: true,
      product: productResult.recordset[0],
      price: priceResult.recordset[0] || {},
      images: imageResult.recordset
    });

  } catch (error) {

    console.error("❌ Product full details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message
    });
  }
});