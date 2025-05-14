const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Thêm thư viện CORS
const path = require('path'); // Thêm thư viện path

const app = express();
const PORT = 3001;

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
    sensorData = req.body; // Lưu dữ liệu vào biến
    res.status(200).send('Data received successfully!');
});

// Endpoint trả dữ liệu cho web
app.get('/data', (req, res) => {
    res.json(sensorData); // Trả dữ liệu cảm biến
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});