import express from "express"
import verifyAdmin from "../middleware/adminAuth.js"
import multer from "multer";
import { login,logout,verify, customer, deletingMenu, updatingMenu, createMenu, getMenu } from "../controller/admin.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

// Admin login route
router.post("/login", login);

// ✅ Logout route
router.post("/logout", logout);

router.get("/verify", verify);

// ✅ Example protected route (only admin can access)
router.get("/", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard", admin: req.admin });
});

router.get("/customers",verifyAdmin,customer);


// Admin Routes (Protected)

// Create Menu Item (Admin only)
router.post('/create-menu', verifyAdmin,upload.single("image"), createMenu);

// Update Menu Item (Admin only)
router.put('/:id', verifyAdmin,upload.single("image"), updatingMenu);

// Delete Menu Item (Admin only)
router.delete('/:id', verifyAdmin, deletingMenu);

//get all menu item
router.get('/menu',verifyAdmin,upload.single("image"), getMenu);



export default router;