const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Thêm thư viện CORS
const path = require('path'); // Thêm thư viện path

const app = express();
const PORT = process.env.PORT || 3001; // Sử dụng cổng từ biến môi trường hoặc mặc định là 3001

// Kích hoạt CORS cho tất cả các nguồn
app.use(cors({
    origin: '*', // Cho phép tất cả các nguồn
    methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
    allowedHeaders: ['Content-Type'] // Chỉ cho phép header Content-Type
}));

app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'web/data/TEST')));

// API từ ESP32
let sensorData = {};

// Endpoint nhận dữ liệu từ ESP32
app.post('/data', (req, res) => {
    console.log('Received data:', req.body);
    if (Object.keys(req.body).length === 0) {
        console.error('No data received or invalid JSON format');
        return res.status(400).send('Invalid data format');
    }
    sensorData = req.body; // Lưu dữ liệu vào biến
    res.status(200).send('Data received successfully!');
});

// Endpoint trả dữ liệu cho web
app.get('/data', (req, res) => {
    if (Object.keys(sensorData).length === 0) {
        return res.status(404).json({ error: 'No data available' });
    }
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
