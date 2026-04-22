async function uploadFile() {
  console.log("🔥 Upload clicked");

  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Select file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("✅ Response:", data);

    if (!data.IpfsHash) {
      alert("Upload failed");
      return;
    }

    const cid = data.IpfsHash;

    document.getElementById("cid").innerText = cid;

    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

    const link = document.getElementById("fileLink");
    link.href = url;
    link.innerText = "🔗 View File on IPFS";
    link.style.display = "block";

  } catch (err) {
    console.error(err);
    alert("Error uploading file");
  }
}

// 👇 IMPORTANT
window.uploadFile = uploadFile;