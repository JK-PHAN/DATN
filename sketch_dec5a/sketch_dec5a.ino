#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#include <MHZ19.h>
#include <SDS011.h>
#include <Wire.h>
#include <VEML6075.h>

// Define sensor pins
#define DHTPIN 4
#define DHTTYPE DHT22
#define CO2_RX_PIN 16
#define CO2_TX_PIN 17
#define PM25_RX_PIN 2
#define PM25_TX_PIN 15

// Initialize sensors
DHT dht(DHTPIN, DHTTYPE);
MHZ19 co2;
SDS011 pm25(PM25_RX_PIN, PM25_TX_PIN);
VEML6075 uvSensor;

// WiFi credentials
const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";

// Create WebServer object
WebServer server(80);

void setup() {
  Serial.begin(115200);
  
  // Setup sensors
  dht.begin();
  co2.begin(CO2_RX_PIN, CO2_TX_PIN);
  uvSensor.begin();
  pm25.begin();

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());  // In ra địa chỉ IP của ESP32
  
  // Handle HTTP GET request for sensor data
  server.on("/sensor-data", HTTP_GET, [](){
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int co2_ppm = co2.getCO2();
    float pm25_value = pm25.getPM2_5();
    float uv_index = uvSensor.readUV();

    String jsonResponse = "{";
    jsonResponse += "\"temperature\": " + String(temperature) + ",";
    jsonResponse += "\"humidity\": " + String(humidity) + ",";
    jsonResponse += "\"co2\": " + String(co2_ppm) + ",";
    jsonResponse += "\"pm25\": " + String(pm25_value) + ",";
    jsonResponse += "\"uvIndex\": " + String(uv_index) + "}";
    
    server.send(200, "application/json", jsonResponse);
  });

  // Start the server
  server.begin();
}

void loop() {
  server.handleClient(); // Handle incoming client requests
}
