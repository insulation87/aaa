// 載入必要的模組
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const DB = require("nedb-promises");

// 初始化 Express 應用
const server = express();

// 1. 配置靜態文件目錄
server.use(express.static(__dirname+"/public")); // 靜態文件夾名稱可以改成你的前端文件夾名稱

// 2. 使用 body-parser 處理請求數據
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(fileUpload());

// 3. 初始化資料庫
const ContactDB = DB.create({
    filename: __dirname + "/contact.db", // 資料庫文件的路徑
    autoload: true,                     // 自動創建並加載資料庫
});

// 定義 /contact_me 路由
server.post("/contact_me", async (req, res) => {
    try {
        // 從表單中提取字段
        const { name, email, phone, message } = req.body;

        // 處理文件上傳
        let uploadedFileName = null;
        if (req.files && req.files.myFile1) {
            const file = req.files.myFile1;
            uploadedFileName = `uploads/${Date.now()}_${file.name}`; // 確保文件名唯一
            const uploadPath = __dirname + "/" + uploadedFileName;

            // 保存文件到伺服器
            await file.mv(uploadPath);
        }

        // 保存數據到資料庫
        const newEntry = {
            name,
            email,
            message,
            timestamp: new Date(),
        };

        await ContactDB.insert(newEntry);

        // 返回成功回應
        res.status(200).send("Message and file uploaded successfully");
    } catch (err) {
        console.error("Error processing contact form:", err);
        res.status(500).send("Failed to process contact form");
    }
});

// 啟動伺服器
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
