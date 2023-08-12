import * as express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/upload", (req, res) => {
    res.status(200).json(true);
});


export default router;