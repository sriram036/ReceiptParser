import React, { useState, ChangeEvent, useEffect } from "react";
import "./image_upload.css";
import { LineItem, ReceiptData, saveReceipt, uploadReceipt, SaveResponse, loadData } from "./api";

type Row = {
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
};
let imageUrl = "";
const ImageUpload: React.FC = () => {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ReceiptData>({id:"",merchant:"",date:"",items:[],total:0});
  const [preview, setPreview] = useState<string | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<ReceiptData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const receiptsPerPage = 5;

  const totalPages = Math.ceil(receipts.length / receiptsPerPage);

  const startIndex = (currentPage - 1) * receiptsPerPage;

  const currentReceipts = receipts.slice(
    startIndex,
    startIndex + receiptsPerPage
  );
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];

    if (image) {
      setFile(image);
      imageUrl = URL.createObjectURL(image);
      setPreview(imageUrl);
    }
  };
  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    const res = await fetch("http://localhost:5000/receipts");

    const data: loadData[] = await res.json();
    // console.log(data);
    let receipts:ReceiptData[]=[];
    for(const row of data){
      let obj = row.receipt;
      obj.id = row.id;
      receipts.push(obj);
    }
    setReceipts(receipts);
  };
  const deleteReceipt = async (
    id: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    await fetch(`http://localhost:5000/receipts/${id}`, {
      method: "DELETE",
    });

    loadReceipts();
  };
  const closePopup = () => {
    loadReceipts();
    setPreview(null);
  };
  
  const addRow = () => {
    setResult(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          quantity: 1,
          price: 0,
          subTotal:0
        },
      ],
    }));
  };

  // REMOVE ROW
  const removeRow = (index: number) => {
    setResult(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setResult(prev => {
      const updatedItems = [...prev.items];

      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      const updatedItem = {
        ...updatedItems[index],
        [field]: value,
      };
      
      updatedItem.subTotal = updatedItem.quantity * updatedItem.price;

      updatedItems[index] = updatedItem;

      const total = updatedItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      return {
        ...prev,
        items: updatedItems,
        total
      };
    });
  };
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    // console.log(imageUrl);
    const formData = new FormData();
    if(file){
      formData.append("image",file);
    }
    setLoading(true);
    const data = await uploadReceipt(formData);
    setLoading(false);
    // console.log(data.parsed);
    setResult(data.parsed);
    // setReply(data.reply);
  };

  const save= async ()=>{
    const formData = new FormData();
      if(file){
        formData.append("image",file);
      }
      formData.append("receipt",JSON.stringify(result));
      // console.log(formData.values);
      const data = await saveReceipt(formData);
      if(data.success){
        // console.log(data);
        closePopup();
      }
      // setResult(data.parsed);
  };

  return (
    <div className="upload-container">
      <h2>Receipt Parser</h2>
      <div className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <table className="receipt-table">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Date</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentReceipts.map((receipt) => (
            <tr
              key={receipt.id}
              onClick={() =>
                setSelectedReceipt(receipt)
              }
            >
              <td>{receipt.merchant}</td>
              <td>{receipt.date}</td>
              <td>₹{receipt.total}</td>

              <td>
                <button
                  className="delete-btn"
                  onClick={(e) =>
                    setPreviewReceipt(receipt)
                  }
                >
                  preview
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {previewReceipt && (
        <div
          className="popup-overlay"
          onClick={() =>
            setPreviewReceipt(null)
          }
        >
          <div
            className="popup-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="close-btn"
              onClick={() =>
                setPreviewReceipt(null)
              }
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={`http://localhost:5000/receipts/${previewReceipt.id}`}
              alt="Receipt"
              className="preview-image"
            />

            <div className="receipt-container">
              <h2>Receipt Preview</h2>

              <div className="receipt-info">
                <p>
                  <strong>Merchant:</strong>{" "}
                  {previewReceipt.merchant}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {previewReceipt.date}
                </p>

                <p>
                  <strong>Total:</strong> ₹
                  {previewReceipt.total}
                </p>
              </div>

              {/* Items Table */}
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {previewReceipt.items.map(
                    (item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          ₹{item.price}
                        </td>

                        <td>
                          ₹{item.subTotal}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {preview && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}>✕</button>

            <img src={preview} alt="Preview" className="preview-image"/>
            <div>
              <button onClick={handleUpload}>Upload</button>
            </div>
            {loading && (
              <div className="spinner"></div>
            )}
            <div className="receipt-container">
              <h2>Receipt Data</h2>

              <div className="receipt-info">
                <label>
                  Merchant:
                  <input
                    value={result?.merchant}
                    onChange={(e) =>
                      setResult({
                        ...result,
                        merchant: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Date:
                  <input
                    value={result?.date}
                    onChange={(e) =>
                      setResult({
                        ...result,
                        date: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {result?.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          value={item.name}
                          onChange={(e) =>
                            updateItem(index, "name", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, "quantity", Number(e.target.value))
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(index, "price", Number(e.target.value))
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={item.subTotal}
                          readOnly
                        />
                      </td>

                      <td>
                        <button onClick={() => removeRow(index)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />

              <button onClick={addRow}>
                Add Row
              </button>
              <h3>Total: ₹{result?.total}</h3>
              <div>
                <button onClick={save}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;