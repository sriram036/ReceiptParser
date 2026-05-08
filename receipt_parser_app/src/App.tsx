import React from 'react';
import { useState } from "react";
import logo from './logo.svg';
import './App.css';
import { sendMessage } from './services/api';
import ImageUpload from "./services/image_upload";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  
  const handleSend = async () => {
    const data = await sendMessage({ message });
    setReply(data.reply);
  };

  return (
    
    <div>
      <ImageUpload />
    </div>

    // <div style={{ padding: 20 }}>
    //   <h2>Chat App</h2>

    //   <input
    //     value={message}
    //     onChange={(e) => setMessage(e.target.value)}
    //   />

    //   <button onClick={handleSend}>Send</button>

    //   <p><b>Reply:</b> {reply}</p>
    // </div>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
