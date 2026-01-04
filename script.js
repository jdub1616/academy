const SHEET_URL = "2PACX-1vSgf4dBZNBLIBOAcBXntssSvs17CnrRNWQyW__vs1g8EnMJ9lEwMBJVPGWLjZ4PsfaEK0CMilzJDdJt";

let players = [];

/* ===============================
   LOAD GOOGLE SHEET
================================ */
fetch(SHEET_URL)
  .then(res => res.text())
  .then(csv => {
    players = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true
    }).data;
  })
  .catch(err => {
    console.error("Error loading player data:", err);
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
    resultDiv.innerHTML = errorMessage(
      "Please enter both first and last name."
    );
    return;
  }

  const first = firstInput.toLowerCase();
  const last  = lastInput.toLowerCase();

  const matches = players.filter(p =>
    p.first_name?.trim().toLowerCase() === first &&
    p.last_name?.trim().toLowerCase() === last
  );

  /* ===============================
     NO MATCH FOUND
  ================================ */
  if (matches.length === 0) {
    resultDiv.innerHTML = `
      ${errorMessage("No player found with that exact name.")}
      ${contactButton()}
    `;
    return;
  }

  /* ===============================
     MULTIPLE EXACT MATCHES
  ================================ */
  if (matches.length > 1) {
    resultDiv.innerHTML = `
      ${warningMessage("Multiple players found with this name. Please confirm below.")}
      ${matches.map(renderPlayerCard).join("")}
    `;
    return;
  }

  /* ===============================
     SINGLE MATCH
  ================================ */
  resultDiv.innerHTML = renderPlayerCard(matches[0]);
}

/* ===============================
   PLAYER CARD
================================ */
function renderPlayerCard(player) {
  return `
    <div class="player-card">
      <div class="group-badge">${player.group}</div>
      <p><strong>First Name:</strong> ${player.first_name}</p>
      <p><strong>Last Name:</strong> ${player.last_name}</p>
      <p><strong>Age Group:</strong> ${player.age_group}</p>
      <p><strong>Uniform Size:</strong> ${player.uniform_size}</p>
    </div>
  `;
}

/* ===============================
   UI HELPERS
================================ */
function errorMessage(text) {
  return `<p class="error">${text}</p>`;
}

function warningMessage(text) {
  return `<p class="warning">${text}</p>`;
}

function contactButton() {
  return `
    <button class="contact-btn" onclick="contactOffice()">
      Contact the office for help
    </button>
  `;
}

/* ===============================
   CONTACT ACTION
================================ */
function contactOffice() {
  window.location.href = "mailto:jonathan@bmocentrelondon.com?subject=Group Lookup Help";
}