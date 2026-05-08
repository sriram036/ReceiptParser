export const sendMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const uploadReceipt = async (data: FormData): Promise<UploadResponse> => {
  const res = await fetch("http://localhost:5000/upload_receipt", {
    method: "POST",
    body: data
  });

  return res.json();
};

export const saveReceipt = async (data: FormData): Promise<SaveResponse> => {  
  const res = await fetch("http://localhost:5000/save_receipt", {
    method: "POST",
    body: data
  });

  return res.json();
};
export interface SaveResponse{
  success: boolean;
}
export interface UploadResponse {
  rawText: string;
  parsed: ReceiptData;
}
export interface LineItem {
  name: string;
  quantity: number;
  price: number;
  subTotal: number;
}
export interface loadData{
  id:string;
  filename:string;
  receipt:ReceiptData
}
export interface ReceiptData {
  id:string;
  merchant: string;
  date: string;
  items: LineItem[];
  total: number;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}