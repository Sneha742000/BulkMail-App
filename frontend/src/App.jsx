
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emaillist, setemaillist] = useState([]);
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [history, setHistory] = useState([]);

  function handlemsg(e) {
    setmsg(e.target.value);
  }

  function handlefile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map((item) => item.A);
      setemaillist(totalemail);
    };

    reader.readAsArrayBuffer(file);
  }

  function send() {
    setstatus(true);
    axios
      .post("https://bulkmail-app-3exr.onrender.com/sendemail", {
        msg: msg,
        emaillist: emaillist,
      })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully");
          setstatus(false);
          fetchHistory(); 
        } else {
          alert("Failed");
        }
      });
  }

  function handleLogin(e) {
    e.preventDefault();
    axios
      .post("https://bulkmail-app-3exr.onrender.com/login", { password })
      .then((res) => {
        if (res.data === true) {
          setIsLoggedIn(true);
          fetchHistory();
        } else {
          alert("Wrong password");
        }
      });
  }

  function fetchHistory() {
    axios.get("https://bulkmail-app-3exr.onrender.com/history").then((res) => {
      setHistory(res.data.reverse());
    });
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center p-6 bg-gray-200">
        <h2 className="text-xl mb-4 b text-black">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            className="border px-2 py-1 mr-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
          />
          <button type="submit" className="bg-blue-700 text-white px-4 py-1">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
  
  <div className="bg-gray-900 text-white text-center">
    <h1 className="text-2xl font-semibold px-5 py-3 text-red-500">BulkMail</h1>
  </div>


  <div className="bg-gray-800 text-white text-center">
    <h1 className="font-medium px-5 py-3">
      We can help your business with sending multiple emails at once
    </h1>
  </div>

  
  <div className="bg-indigo-700 text-white text-center">
    <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
  </div>

  
  <div className="bg-gray-900 flex flex-col items-center text-black px-5 py-6">
    <textarea
      onChange={handlemsg}
      value={msg}
      className="w-[80%] h-32 py-2 px-3 border border-gray-400 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder="Enter the email text..."
    ></textarea>

    <input
      onChange={handlefile}
      type="file"
      accept=".xlsx,.xls"
      className="border-4 border-dashed py-4 px-6 mt-5 mb-5 bg-white shadow-sm rounded-md cursor-pointer"
    />

    <p className="mb-4  text-blue-700">Total Emails Loaded: {emaillist.length}</p>

    <button
      onClick={send}
      className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-md transition"
    >
      {status ? "Sending..." : "Send"}
    </button>
  </div>

  
  <div className="bg-gray-900 text-black text-center py-6 px-4">
    <h2 className="text-2xl font-semibold mb-4 text-red-500">Email History</h2>

    {history.length === 0 ? (
      <p className="text-gray-500">No emails sent yet.</p>
    ) : (
      history.map((email, index) => (
        <div key={index} className="bg-gray-200 text-left p-4 m-4 rounded shadow-sm">
          <p><strong>To:</strong> {email.emaillist.join(", ")}</p>
          <p><strong>Message:</strong> {email.msg}</p>
          <p><strong>Date:</strong> {new Date(email.time).toLocaleString()}</p>
        </div>
      ))
    )}
  </div>
</div>

  );
}

export default App;
