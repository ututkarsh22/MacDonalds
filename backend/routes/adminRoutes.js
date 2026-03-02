import express from "express"
import verifyAdmin from "../middleware/adminAuth.js"
import { login,logout,verify, customer } from "../controller/admin.controller.js";
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


export default router;