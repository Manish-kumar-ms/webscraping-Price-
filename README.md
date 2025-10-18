# 🛒 Price Tracker — MERN + Puppeteer + Node Cron

A full-stack **price tracking system** built with **Node.js, Express, MongoDB, Puppeteer**, and **Node-Cron**.  
It automatically scrapes product prices (from Amazon and Flipkart), stores them in MongoDB, and keeps only the **latest 10 entries** per product.

---

---

## 🌐 Live Demo
 
- **Backend**: [https://webscraping-price-backend.onrender.com](https://webscraping-price-backend.onrender.com)

---

## 🚀 Features

- 🧠 **Automated Web Scraping** using Puppeteer  
- 🕒 **Hourly Price Updates** via Node-Cron  
- 💾 **MongoDB Database** to store product and price data  
- ✂️ **Auto-clean older price history** (keeps latest 10 entries per product)  
- ⚙️ **API endpoint** to trigger scraping manually  
- 📈 Easily extendable for other e-commerce websites  

---

## 🧩 Tech Stack

| Layer     | Technology     |
|-----------|----------------|
| Backend   | Node.js, Express.js |
| Database  | MongoDB + Mongoose |
| Scraper   | Puppeteer        |
| Scheduler | Node-Cron        |
| Environment Config | dotenv  |
| CORS Handling       | cors    |

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js                # MongoDB connection
│   ├── nodecron.js          # Hourly cron job 
    ├── puppeteer.js  
setup
├── controller/
│   ├── AddUrl.controller.js # Main controller  logic
├── model/
│   ├── Product.model.js     # Product schema
│   ├── Price.model.js       # Price schema
├── routes/
│   ├── product.router.js    # Express routes
├── server.js                # Main server entry point
├── .env                     # Environment variables
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions


### 1 Install dependencies  
```bash
npm install
```

### 2 Setup environment variables  

Create a `.env` file in the backend folder:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/priceTrackerDB
PORT=8000

```

### 3 Run the server  
```bash
npm start
```

> The app runs on `http://localhost:8000`

---

## 🧠 How It Works

### 🕸️ Scraping Logic  
- Uses **Puppeteer** to visit Amazon/Flipkart product pages.  
- Reads the price using specific CSS selectors:  
  - **Amazon:** `.a-price-symbol`, `.a-price-whole`  
  - **Flipkart:** `.Nx9bqj.CxhGGd`  
- Stores prices in MongoDB and keeps only the **10 most recent** entries per product.

### 🧭 Cron Job  
- Defined in `config/nodecron.js`  
- Runs **every hour** (`0 * * * *`)  
- Executes the `runScraper()` function automatically  


### 📦 Data Retention  
For each product:  
- Only the **latest 10 prices** are stored  
- Older entries are deleted automatically

---

## 🧪 API Endpoints

### ➤ Add a Product  
**POST** `/api/target`

```json
{
  "url": "https://www.amazon.in/dp/B09V4MXBS1/"
}
```

### ➤ Trigger Manual Scraping  
**POST** `/api/scrape-now`

**Response:**
```json
{
  "message": "Scrape completed",
  "results": [
    {
      "url": "https://www.amazon.in/dp/B09V4MXBS1/",
      "price": "₹9,999",
      "currency": "₹"
    }
  ]
}
```

### ➤ Get Price History (Last 10 Entries)  
**GET** `/api/prices?url=<product_url>`

**Example:**  
```
GET http://localhost:8080/api/prices?url=https://www.amazon.in/dp/B09V4MXBS1/
```

**Response:**
```json
[
  {
    "price": "₹9,999",
    "currency": "₹",
    "timestamp": "18 Oct 2025, 12:05 PM"
  }
]
```


## 🧩 Future Enhancements  
- 📱 WhatsApp or Email notifications when price drops  
- 📊 Dashboard with charts for price history  
- 🔎 Support for more e-commerce sites (Myntra, Croma, etc.)  
- 🌐 Front-end integration (React dashboard)

---


