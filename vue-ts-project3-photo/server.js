import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "uploads/");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// 上传照片的接口
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const newPhoto = {
        id: Date.now(),
        url: `/uploads/${req.file.filename}`,
        date: req.body.date,
        location: req.body.location,
    };

    const photos = JSON.parse(fs.readFileSync("photos.json", "utf-8") || "[]");
    photos.push(newPhoto);
    fs.writeFileSync("photos.json", JSON.stringify(photos));

    res.status(200).json({
        message: "File uploaded successfully",
        filePath: newPhoto.url,
    });
});

// 获取照片列表的接口
app.get("/photos", (req, res) => {
    const photos = JSON.parse(fs.readFileSync("photos.json", "utf-8") || "[]");
    res.json(photos);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});