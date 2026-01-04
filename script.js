const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgf4dBZNBLIBOAcBXntssSvs17CnrRNWQyW__vs1g8EnMJ9lEwMBJVPGWLjZ4PsfaEK0CMilzJDdJt/pub?output=csv";

let players = [];

/* ===============================
   LOAD AND PARSE CSV
================================ */
fetch(SHEET_URL)
  .then(response => response.text())
  .then(text => {
    const rows = text.trim().split("\n");
    const headers = rows[0].split(",");

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(",");
      let player = {};

      headers.forEach((header, index) => {
        player[header.trim()] = values[index]?.trim() || "";
      });

      players.push(player);
    }
  })
  .catch(err => {
    console.error("Failed to load player data:", err);
  });

/* ===============================
   SEARCH FUNCTION
================================ */
function searchPlayer() {
  const firstInput = document.getElementById("firstName").value.trim();
  const lastInput  = document.getElementById("lastName").value.trim();
  const resultDiv  = document.getElementById("result");

  resultDiv.innerHTML = "";

  if (!firstInput || !lastInput) {
    resultDiv.textContent = "Please enter both first and last name.";
    return;
  }

  const first = firstInput.toLowerCase();
  const last  = lastInput.toLowerCase();

  const matches = players.filter(p =>
    p.first_name.toLowerCase() === first &&
    p.last_name.toLowerCase() === last
  );

  /* ===============================
     NO MATCH
  ================================ */
  if (matches.length === 0) {
    resultDiv.innerHTML = `
      <p>No player found with that exact name.</p>
      <button onclick="contactOffice()">Contact the office</button>
    `;
    return;
  }

  /* ===============================
     MULTIPLE MATCHES
  ================================ */
  if (matches.length > 1) {
    resultDiv.innerHTML = "<p>Multiple players found:</p>";
    matches.forEach(p => {
      resultDiv.innerHTML += `
        <p>
          ${p.first_name} ${p.last_name}<br>
          Age Group: ${p.age_group}<br>
          Group: ${p.group}<br>
          Uniform Size: ${p.uniform_size}
        </p>
      `;
    });
    return;
  }

  /* ===============================
     SINGLE MATCH
  ================================ */
  const p = matches[0];
  resultDiv.innerHTML = `
    <p>
      <strong>${p.first_name} ${p.last_name}</strong><br>
      Age Group: ${p.age_group}<br>
      Group: ${p.group}<br>
      Uniform Size: ${p.uniform_size}
    </p>
  `;
}

/* ===============================
   CONTACT LINK
================================ */
function contactOffice() {
  window.location.href = "mailto:jonathan@bmocentrelondon.com?subject=Group Lookup Help";
}