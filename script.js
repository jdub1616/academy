const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgf4dBZNBLIBOAcBXntssSvs17CnrRNWQyW__vs1g8EnMJ9lEwMBJVPGWLjZ4PsfaEK0CMilzJDdJt/pub?output=csv";

/* ===============================
   GROUP → FIELD MAP
   (KEYS MUST BE NORMALIZED)
================================ */
const groupToField = {
  "1A": "2A",
  "1B": "2B",
  "2A": "1A",
  "2B": "1B",
  "4A": "3A",
  "4B": "3B",
  "5A": "4A",
  "5B": "4B",
  "7A": "1A",
  "7B": "1B",
  "8A": "2A",
  "8B": "2B",
  "9A": "3A",
  "9B": "3B",
  "10A": "4A",
  "10B": "4B",
  "11A": "5A",
  "11B": "5B",
  "12A": "6A",
  "12B": "6B"
};

/* ===============================
   HELPERS
================================ */
function normalizeGroup(rawGroup) {
  if (!rawGroup) return null;
  return rawGroup.replace(/^Group\s*/i, "").trim().toUpperCase();
}

function getFieldImageForGroup(rawGroup) {
  if (!rawGroup) return null;

  // EXCLUDE 5:30pm group entirely
  if (rawGroup.toLowerCase().includes("5:30")) {
    return null;
  }

  const group = normalizeGroup(rawGroup);
  if (!group) return null;

  const field = groupToField[group];
  if (!field) return null;

  return `images/field-${field.toLowerCase()}.png`;
}

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
          Group: ${normalizeGroup(p.group) || "Not yet assigned"}<br>
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

  const fieldImage = getFieldImageForGroup(p.group);
  const imageHtml = fieldImage
    ? `<img src="${fieldImage}" alt="Field ${normalizeGroup(p.group)} map" style="max-width:100%; margin-top:12px;">`
    : "";

  resultDiv.innerHTML = `
    <p>
      <strong>${p.first_name} ${p.last_name}</strong><br>
      Age Group: ${p.age_group}<br>
      Group: ${normalizeGroup(p.group) || "Not yet assigned"}<br>
      Uniform Size: ${p.uniform_size}
    </p>
    ${imageHtml}
  `;
}

/* ===============================
   CONTACT LINK
================================ */
function contactOffice() {
  window.location.href = "mailto:jonathan@bmocentrelondon.com?subject=Group Lookup Help";
}
