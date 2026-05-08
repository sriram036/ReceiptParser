import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
// import Tesseract from "tesseract.js";
import sharp from "sharp";
import { createWorker, PSM } from "tesseract.js";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
// const upload = multer({
//   dest: "receipts/",
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   }
// });
let fileName = "";
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server running with TypeScript 🚀");
});

app.post("/api/chat", (req: Request, res: Response) => {
  const { message } = req.body;

  res.json({ reply: `You said: ${message}` });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

function parseReceipt(text: string): ReceiptData {

  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  let merchant = "";
  let date = "";
  let total = 0;

  const items: LineItem[] = [];

  // Merchant = first line
  if (lines.length > 0) {
    merchant = lines[0];
  }

  // Date regex
  const dateRegex =
    /(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/;

  // Product regex
  const itemRegex =
    /^(.+?)\s+(\d+)\s+([\d]+\.[\d]{2})$/;

  for (const line of lines) {

    // Date
    const dateMatch = line.match(dateRegex);

    if (dateMatch) {
      date = dateMatch[1];
    }

    // Items
    const itemMatch = line.match(itemRegex);

    if (itemMatch) {

      items.push({
        name: itemMatch[1],
        quantity: itemMatch[2],
        price: itemMatch[3],
        subTotal: itemMatch[2] * itemMatch[3]
      });
    }
  }
  items.forEach(x => total += x.subTotal)
  return {
    merchant,
    date,
    items,
    total
  };
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "receipts/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);
    fileName = uniqueName;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.post(
  "/save_receipt",
  upload.single("image"),
  (req, res) => {
    try {
      // console.log(req);
      // uploaded image info
      const file = req.file;

      // receipt comes as string
      const receiptRaw = req.body.receipt;
      const receiptsDir = path.join(__dirname, "json");

      // create folder if it does not exist
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }

      // convert back to object
      const receipt = JSON.parse(receiptRaw);

      // console.log("FILE:", file);
      // console.log("RECEIPT:", receipt);
      const filePath = path.join(receiptsDir, fileName);
      let jsonData : ReceiptFile ={fileName:filePath,receipt:receipt}
      const data = JSON.stringify(jsonData);
      // console.log(data);

      fs.writeFileSync(filePath+'.json', data, "utf-8");

      res.json({
        success: true,
        // imagePath: file?.path,
        // receipt,
      });
    } catch (err) {
      // console.error(err);

      res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  }
);
const JSON_DIR = path.join(__dirname, "json");
const IMAGE_DIR = path.join(
  __dirname,
  "..",
  "receipts"
);
app.use("/receipts", express.static(IMAGE_DIR));

app.get("/receipts", (req, res) => {
  try {
    // get all json files
    const files = fs
      .readdirSync(JSON_DIR)
      .filter((file) => file.endsWith(".json"));

    const receipts = files.map((file) => {
      const filePath = path.join(
        JSON_DIR,
        file
      );

      const jsonData = fs.readFileSync(
        filePath,
        "utf-8"
      );
      // console.log(jsonData);
      const receiptList = JSON.parse(jsonData);
      return {
        id: file.replace(".json", ""), // safe fallback
        ...receiptList,
      };
      // return JSON.parse(jsonData);
    });

    res.json(receipts);
  } catch (err) {
    // console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to load receipts",
    });
  }
});

app.post(
  "/upload_receipt",
  upload.single("image"),
  async (req: Request, res: Response) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          error: "No image uploaded"
        });
      }
      const imagePath = req.file.path;
      await sharp(imagePath)
        .grayscale()
        .normalize()
        .threshold(150)
        .toFile("processed.png");

      const worker = await createWorker("eng");
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK
      });
      const result = await worker.recognize(imagePath);
      await worker.terminate();
      // const result = await Tesseract.recognize(
      //   imagePath,
      //   "eng",
      //   {
      //     logger: m => console.log(m),
      //   }
      // );


      const extractedText = result.data.text;

      const parsedData =
        parseReceipt(extractedText);

      // Delete uploaded file
      fs.unlinkSync(imagePath);

      return res.json({
        rawText: extractedText,
        parsed: parsedData
      });

    } catch (error) {

      // console.error(error);

      return res.status(500).json({
        error: "OCR failed"
      });
    }
  }
);
export interface ReceiptFile{
  fileName: string;
  receipt: ReceiptData;
}
interface LineItem {
  name: string;
  quantity: string;
  price: number;
  subTotal: number;
}

interface ReceiptData {
  merchant: string;
  date: string;
  items: LineItem[];
  total: number;
}
