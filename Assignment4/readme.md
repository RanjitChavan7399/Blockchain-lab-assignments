# Assignment 4: IPFS Integration

## 📌 Project Overview

This project demonstrates how to upload and retrieve files using IPFS (InterPlanetary File System). It uses a web interface connected to a backend server that interacts with the Pinata IPFS service.

The system allows users to:

* Upload files to IPFS
* Generate a unique CID (Content Identifier)
* Retrieve files using the CID

---

## 🧰 IPFS Service / Library Used

This project uses:

* **Pinata** (IPFS Pinning Service)
* **Node.js + Express** (Backend Server)
* **Multer** (File upload handling)
* **FormData & node-fetch** (API communication)

Pinata is used to upload files to IPFS and store them permanently using pinning.

---

## 🔗 How Files are Stored

1. User selects a file from the frontend
2. The file is sent to the backend server (`/upload` endpoint)
3. Backend converts file into proper multipart/form-data format
4. File is sent to Pinata API using JWT authentication
5. Pinata uploads file to IPFS network
6. A unique CID (Content Identifier) is generated

---

## 🔍 How Files are Retrieved

* Each file is retrieved using its CID
* Files are accessed through an IPFS gateway

### Example:

```id="ex1"
https://gateway.pinata.cloud/ipfs/<CID>
```

---

## 📌 Example IPFS Hash (CID)

```id="ex2"
QmXyz123ExampleCID456abc789
QmAbc987ExampleCID654xyz321
```

---

## ⚙️ Features Implemented

✔ Upload file to IPFS using Pinata
✔ Backend integration for secure API handling
✔ Generate and display CID
✔ Retrieve file using IPFS gateway
✔ Clickable link to view uploaded file

---

## 🚀 How to Run the Project

### 1. Install Dependencies

```id="run1"
npm install
```

---

### 2. Add Pinata JWT

In `server.js`, add your JWT:

```id="run2"
const PINATA_JWT = "YOUR_PINATA_JWT";
```

---

### 3. Start Backend Server

```id="run3"
node server.js
```

---

### 4. Run Frontend

Open:

```id="run4"
index.html
```

---

### 5. Upload File

* Select file
* Click "Upload"
* CID and link will be displayed

---


### 1. File Upload Success

* File selected and uploaded
* CID displayed on screen

### 2. CID Link

* Clickable link to IPFS file
* File opens in browser

### 3. Transaction Link (Event Page Only)

* If integrated with blockchain, include:

  * MetaMask transaction
  * Explorer link (Etherscan)

---

## 🔐 Security Note

* API keys are not exposed in frontend
* Backend is used to securely handle Pinata API requests
* JWT authentication ensures secure communication

---

## 🎯 Conclusion

This project successfully demonstrates decentralized file storage using IPFS. By integrating Pinata with a backend server, it ensures secure, reliable, and permanent storage of files with easy retrieval using CID.

---
