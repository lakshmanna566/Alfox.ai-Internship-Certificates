const SHEET_ID = "1ngyw4BUUUwr6ulwYZXFbRnnd9VlIX0e0EKp5XX3vUws";
const SHEET_NAME = "ALFOX_Internship_Certificates";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

async function validateCert() {
  const certIdInput = document.getElementById("certInput").value.trim().toUpperCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (!certIdInput) {
    resultDiv.innerHTML = "<p style='color:#ff4d4d'>Please enter a certificate ID.</p>";
    return;
  }

  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));

    const headers = json.table.cols.map(c => c.label);
    const rows = json.table.rows.map(r =>
      Object.fromEntries(r.c.map((cell, i) => [headers[i], cell ? cell.v : ""]))
    );

    const cert = rows.find(c => (c.CertificateID || "").toString().toUpperCase() === certIdInput);

    if (cert) {
      resultDiv.innerHTML = `
        <div>
          <h3>Certificate Verified</h3>
          <p><strong>Name:</strong> ${cert.Name}</p>
          <p><strong>Internship:</strong> ${cert.Internship}</p>
          <p><strong>Starting Date:</strong> ${cert.StartingDate}</p>
          <p><strong>Ending Date:</strong> ${cert.EndingDate}</p>
        </div>
      `;
    } else {
      resultDiv.innerHTML = "<p style='color:#ff4d4d'>Certificate not found.</p>";
    }
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "<p style='color:#ff4d4d'>Error loading data. Try again later.</p>";
  }
}
