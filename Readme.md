
# Line Item

Since line item is not specified I've used quantity, price and subtotal

# On Failed of LLM

Retry again on failed response from LLM

# Low Quality data

The image would be rendered on before upload so you can decide whether to upload or not

# Data Correction

Since the data would be reflected back the user can add,update and delete the values

# Model Usage

I've used a LLM which is free and that's really optimize.

# What's Build

A simple web app that takes receipts as inputs and convert it to a json and stores it

# The Biggest Tradeoff

The LLM which is used for image to text is Tesseract and that not so efficient. But on production I can change it to something better like Gemini.

# The LLM Usage

The LLM used to convert the image to json in the Node js 

# The improvements in a week

The efficiency and reliablilty of a image to text parser logic would be first priority

# The spec which can be pushed back

The lineitem could be explained more 

# Receipt Parser App

A full-stack Receipt Scanner application built using **React.js** and **Node.js** that allows users to upload receipt images, extract receipt data, edit details, preview receipts, and save them for future reference.

---

# Features

- Upload receipt images
- Preview uploaded images
- Extract receipt data automatically
- Edit extracted receipt information
- Add or remove receipt items
- Auto subtotal and total calculation
- View saved receipts
- Receipt preview popup
- Pagination (5 receipts per page)
- Responsive modern UI

---

# Tech Stack

## Frontend
- React.js
- TypeScript
- CSS

## Backend
- Node.js
- Express.js
- Multer
- Tesseract
---

# Project Structure

```bash
project-root/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├──src
│   │  ├──index.js
│   │
│   ├── receipts/
│   └── package.json
│   
│
└── README.md
```

---

# Frontend Setup

## Navigate to frontend folder

```bash
cd receipt_parse_app
```

## Install dependencies

```bash
npm install
```

## Start React app

```bash
npm run start
```

Frontend runs at:

```bash
http://localhost:3000
```

---

# Backend Setup

## Navigate to backend folder

```bash
cd server
```

## Install dependencies

```bash
npm install
```

## Start backend server

```bash
npm run dev
```

or

```bash
node index.js
```

Backend runs at:

```bash
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file inside the server folder.

Example:

```env
PORT=5000
```

---

# API Endpoints

## Upload Receipt

```http
POST /upload
```

Uploads a receipt image and extracts receipt data.

---

## Save Receipt

```http
POST /save
```

Saves receipt information.

---

## Get Receipts

```http
GET /receipts
```

Returns all saved receipts.

---

## Preview Receipt Image

```http
GET /receipts/:id
```

Returns receipt image.

---

# Application Features

## Upload Section
- Upload receipt image
- Preview image before upload

## Receipt Data Editor
- Edit merchant name
- Edit date
- Add new items
- Remove items
- Auto subtotal calculation
- Auto total calculation

## Receipt History
- Paginated table view
- Maximum 5 receipts per page
- Receipt preview modal

---

# Pagination

The application supports pagination for the receipt table.

Features:
- 5 receipts per page
- Previous and Next navigation
- Responsive pagination controls

---

# Available Scripts

## Frontend

```bash
npm start
npm run build
```

## Backend

```bash
npm run dev
npm start
```

---

# Future Improvements

- User authentication
- Cloud image storage
- Search and filter receipts
- Export receipts as PDF
- Improved OCR support
- Mobile app version

---


# Author

Sriram Ravichandran

---

# License

MIT License