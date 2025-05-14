const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Thêm thư viện CORS
const path = require('path'); // Thêm thư viện path

const app = express();
const PORT = process.env.PORT || 3001; // Sử dụng cổng từ biến môi trường hoặc mặc định là 3001

// Kích hoạt CORS cho các domain cụ thể
app.use(cors({
    origin: ['https://your-vercel-domain.vercel.app', 'https://your-service.onrender.com'], // Thay bằng domain của bạn
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'web/data/TEST')));

// API từ ESP32
let sensorData = {};

// Endpoint nhận dữ liệu từ ESP32
app.post('/data', (req, res) => {
    console.log('Received data:', req.body);
    sensorData = req.body; // Lưu dữ liệu vào biến
    res.status(200).send('Data received successfully!');
});

// Endpoint trả dữ liệu cho web
app.get('/data', (req, res) => {
    res.json(sensorData); // Trả dữ liệu cảm biến
});

// Endpoint kiểm tra trạng thái server
app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});