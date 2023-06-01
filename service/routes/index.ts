import * as express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "66K-RTN-INTELLIGENCE" });
});


export default router;