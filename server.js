const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Thay bằng token bot trong menu.js
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID'; // Thay bằng chat_id nhận file

const FILE_LIST_PATH = path.join(__dirname, 'file-list.json');

// Đảm bảo file-list.json tồn tại
if (!fs.existsSync(FILE_LIST_PATH)) fs.writeFileSync(FILE_LIST_PATH, '[]');

// API upload file
app.post('/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    try {
        // Gửi file lên Telegram bot
        const telegramRes = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                document: fs.createReadStream(file.path)
            },
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );

        // Lưu thông tin file
        const fileList = JSON.parse(fs.readFileSync(FILE_LIST_PATH));
        fileList.push({
            file_name: file.originalname,
            telegram_url: `https://t.me/${TELEGRAM_CHAT_ID}/${telegramRes.data.result.message_id}`
        });
        fs.writeFileSync(FILE_LIST_PATH, JSON.stringify(fileList, null, 2));

        fs.unlinkSync(file.path); // Xóa file tạm
        res.send('OK');
    } catch (err) {
        res.status(500).send('Upload failed');
    }
});

// API lấy danh sách file
app.get('/api/files', (req, res) => {
    const fileList = JSON.parse(fs.readFileSync(FILE_LIST_PATH));
    res.json(fileList);
});

// Phục vụ file HTML
app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/send-to-telegram.html');
});
