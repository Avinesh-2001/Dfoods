import jwt from "jsonwebtoken";
   import Admin from "../models/Admin.js";

   export const adminLogin = async (req, res) => {
     const { email, password } = req.body;
     try {
       console.log('Admin login attempt:', { email });
       const admin = await Admin.findOne({ email });
       if (!admin) {
         console.log('Admin not found:', email);
         return res.status(401).json({ message: "Invalid email or password" });
       }
       console.log('Admin found:', { id: admin._id, email: admin.email });

       const isMatch = await admin.matchPassword(password);
       if (!isMatch) {
         console.log('Password mismatch for:', email);
         return res.status(401).json({ message: "Invalid email or password" });
       }
       console.log('Password matched for:', email);

       const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
       console.log('Token generated for:', email);
       res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: "admin" } });
     } catch (error) {
       console.error('Admin login error:', error);
       res.status(500).json({ message: "Server error", error: error.message });
     }
   };