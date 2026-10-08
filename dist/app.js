(function () {
  "use strict";

  const credentials = {
    "demo.pass": {
      username: "demo.pass",
      password: "DemoPass123!",
      code: "123456",
      outcome: "pass",
      name: "Mara Whitford",
      portrait: { skin: "#c99374", hair: "#26211f", shirt: "#006aa6" },
      licence: {
        number: "NVD-4821-913",
        class: "5",
        status: "Valid",
        expiry: "14 May 2029",
        address: "42 Harbour Road, Lunenburg, NS B0J 2C0",
      },
      vehicles: [
        { id: "veh-1", year: "2021", make: "Subaru", model: "Forester", vin: "NVDDMO100000001", plate: "NVD 214", plateExpiry: "31 May 2027", permit: "VP-903124", permitStatus: "Permitted", permitExpiry: "31 May 2027", ownershipCycle: "cycle-1" },
        { id: "veh-2", year: "2018", make: "Toyota", model: "Tacoma", vin: "NVDDMO100000002", plate: "NVD 588", plateExpiry: "30 November 2026", permit: "VP-665930", permitStatus: "Permitted", permitExpiry: "30 November 2026", ownershipCycle: "cycle-1" },
        { id: "veh-4", year: "2017", make: "Mazda", model: "CX-5", vin: "NVDDMO100000004", plate: "", plateExpiry: "", permit: "", permitStatus: "Unpermitted", permitExpiry: "", ownershipCycle: "cycle-1" },
        { id: "veh-70", year: "2014", make: "Ford", model: "Transit", vin: "NVDDMO700000001", plate: "", plateExpiry: "", permit: "", permitStatus: "Unpermitted", permitExpiry: "", ownershipCycle: "cycle-1", seventyTyped: true },
      ],
      history: [
        { ref: "NVD-REQ-10024", service: "Driver's licence renewal", status: "Complete", date: "12 Jun 2026" },
        { ref: "NVD-REQ-10061", service: "Change of address", status: "Complete", date: "03 Sep 2026" },
      ],
    },
    "demo.fail": {
      username: "demo.fail",
      password: "DemoFail123!",
      code: "123456",
      outcome: "fail",
      name: "Elliot Fraser",
      portrait: { skin: "#b77e61", hair: "#40312d", shirt: "#5a5f73" },
      licence: {
        number: "NVD-7710-246",
        class: "5N",
        status: "Valid",
        expiry: "02 February 2028",
        address: "18 Maple Crescent, Truro, NS B2N 4T6",
      },
      vehicles: [
        { id: "veh-3", year: "2020", make: "Honda", model: "Civic", vin: "NVDDMO200000003", plate: "NVD 932", plateExpiry: "31 March 2027", permit: "VP-318872", permitStatus: "Permitted", permitExpiry: "31 March 2027", ownershipCycle: "cycle-1" },
      ],
      history: [{ ref: "NVD-REQ-09918", service: "Vehicle permit replacement", status: "Complete", date: "23 Apr 2026" }],
    },
    "demo.suspended": {
      username: "demo.suspended",
      password: "DemoSuspended123!",
      code: "123456",
      outcome: "pass",
      name: "Nolan Mercer",
      portrait: { skin: "#c48a68", hair: "#2f2623", shirt: "#7a3941" },
      licence: {
        number: "NVD-6604-219",
        class: "5",
        status: "Suspended",
        expiry: "09 August 2028",
        address: "77 Birch Street, Sydney, NS B1P 3A9",
      },
      suspensionRecords: [
        { id: "sus-1", status: "Active", reason: "Fictional unpaid fine suspension", start: "10 May 2026", end: "10 November 2026" },
        { id: "sus-2", status: "Review required", reason: "Fictional medical review hold", start: "04 August 2026", end: "Pending review" },
      ],
      fines: [
        { id: "fine-1", label: "Demo reinstatement fee", amount: "$125.00", status: "Unpaid" },
        { id: "fine-2", label: "Demo outstanding fine", amount: "$310.00", status: "Unpaid" },
      ],
      vehicles: [
        { id: "veh-s1", year: "2019", make: "Hyundai", model: "Kona", vin: "NVDSUS100000001", plate: "NVD 441", plateExpiry: "31 January 2027", permit: "VP-441002", permitStatus: "Permitted", permitExpiry: "31 January 2027", ownershipCycle: "cycle-1" },
        { id: "veh-s2", year: "2015", make: "Chevrolet", model: "Cruze", vin: "NVDSUS100000002", plate: "", plateExpiry: "", permit: "", permitStatus: "Unpermitted", permitExpiry: "", ownershipCycle: "cycle-1" },
      ],
      history: [{ ref: "NVD-REQ-08832", service: "Suspension notice viewed", status: "Open", date: "14 Aug 2026" }],
    },
  };

  // Fictional VIN registry used by the title flow. The 70 typed status belongs to the VIN record, not the applicant.
  const vinRegistry = {
    "NVD1TST70A0000001": { year: "2009", make: "Dodge", model: "Ram 1500", seventyTyped: true, note: "Prior out-of-province salvage brand" },
    "NVD1TST70B0000002": { year: "2012", make: "Nissan", model: "Altima", seventyTyped: true, note: "Rebuilt after flood damage" },
    "NVD1TSTCLN0000003": { year: "2022", make: "Kia", model: "Seltos", seventyTyped: false, note: "Clean history" },
    "NVD1TSTCLN0000004": { year: "2019", make: "Ford", model: "F-150", seventyTyped: false, note: "Clean history" },
    "NVD1TSTCLN0000005": { year: "2016", make: "Volkswagen", model: "Jetta", seventyTyped: false, note: "Clean history" },
  };

  function lookupVin(vin) {
    const record = vinRegistry[(vin || "").trim().toUpperCase()];
    return record ? { ...record, vehicle: `${record.year} ${record.make} ${record.model}` } : null;
  }

  function vinLookupPanel(vin) {
    if (!vin) return '<p class="hint">Enter a VIN to look up the vehicle record.</p>';
    const record = lookupVin(vin);
    if (!record) return '<p class="hint">No vehicle found for this VIN in the demo registry.</p>';
    return `<p><strong>${escapeHtml(record.vehicle)}</strong><br />70 typed: <strong>${record.seventyTyped ? "Yes" : "No"}</strong> - ${escapeHtml(record.note)}</p>`;
  }

  const serviceDetails = {
    licence: {
      title: "Replace driving licence",
      recordTitle: "Driving licence record",
      fee: "$28.75 demo fee",
      needsVehicle: false,
      itemLabel: "Licence",
      confirmation: "No actual payment was taken and no driving licence will be issued.",
    },
    ownership: {
      title: "Replace vehicle ownership certificate",
      recordTitle: "Vehicle ownership record",
      fee: "$13.20 demo fee",
      needsVehicle: true,
      itemLabel: "Vehicle",
      confirmation: "No actual payment was taken and no ownership certificate will be issued.",
    },
    permit: {
      title: "Replace vehicle permit",
      recordTitle: "Vehicle permit record",
      fee: "$13.20 demo fee",
      needsVehicle: true,
      itemLabel: "Vehicle",
      confirmation: "No actual payment was taken and no vehicle permit will be issued.",
    },
  };

  const infoLinks = [
    ["Get a licence", ["Driver's licence", "Learner's (beginner's) licence", "Motorcycle driver's licence", "Newly licensed driver's licence", "Non-residents (driver's licence information)"]],
    ["Renew, replace or upgrade", ["Commercial carrier registration", "Driver's licence renewal", "Licence upgrade", "Motorcycle endorsement", "Replacement licence"]],
    ["Update or restore", ["Alcohol ignition interlock program", "Change of address", "Change of name", "Licence suspension", "Privilege reinstatement fee payment"]],
    ["Driver examination and testing", ["Air brake manual (PDF 2.4MB)", "Book a Road Test", "Driver examination and testing locations"]],
    ["Instructors and schools", ["Driver training instructor licence", "Driver training school licence", "Driver training schools (PDF 113 KB)"]],
    ["Road and driver safety", ["Drive safe", "Road safety", "Safety inspection"]],
  ];

  const app = document.getElementById("app");
  const announcer = document.getElementById("announcer");
  const storeKey = "nordvik-rmv-demo-data";
  let auth = { stage: "public", username: null, twoStep: false, photo: false };
  let verificationTimer = null;
  let activeTransaction = null;
  let activeNoticeVehicleId = null;
  let activeFlow = null;

  const state = loadState();

  window.addEventListener("hashchange", render);
  window.addEventListener("load", () => {
    auth = { stage: "public", username: null, twoStep: false, photo: false };
    render();
  });

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(storeKey) || "{}");
      return {
        requests: stored.requests || {},
        assistance: stored.assistance || [],
        vehicleSales: stored.vehicleSales || {},
        titleTransactions: stored.titleTransactions || {},
        emails: stored.emails || {},
        paidFines: stored.paidFines || {},
        addresses: stored.addresses || {},
        vehicleOverrides: stored.vehicleOverrides || {},
      };
    } catch {
      return { requests: {}, assistance: [], vehicleSales: {}, titleTransactions: {}, emails: {}, paidFines: {}, addresses: {}, vehicleOverrides: {} };
    }
  }

  function saveState() {
    localStorage.setItem(storeKey, JSON.stringify(state));
  }

  function resetState() {
    auth = { stage: "public", username: null, twoStep: false, photo: false };
    state.requests = {};
    state.assistance = [];
    state.vehicleSales = {};
    state.titleTransactions = {};
    state.emails = {};
    state.paidFines = {};
    state.addresses = {};
    state.vehicleOverrides = {};
    saveState();
    activeTransaction = null;
    activeNoticeVehicleId = null;
    activeFlow = null;
    location.hash = "#/";
    announce("Demo reset. Sessions, requests and assistance records cleared.");
    render();
  }

  function profile() {
    return auth.username ? credentials[auth.username] : null;
  }

  function announce(message) {
    announcer.textContent = message;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[char]));
  }

  function ref(prefix) {
    return `${prefix}-${Math.floor(100000 + Math.random() * 899999)}`;
  }

  function navigate(hash) {
    location.hash = hash;
    render();
  }

  function clearAuth() {
    auth = { stage: "public", username: null, twoStep: false, photo: false };
    activeTransaction = null;
  }

  function shell(content, options = {}) {
    const signedIn = auth.stage === "complete" && profile();
    return `
      <div class="screen">
        <header class="topbar">
          <div class="topbar-inner">
            <a href="#/" class="brand" aria-label="NORDVIK demonstration home">
              <span class="brand-mark">NOVA SCOTIA</span>
              <span class="brand-sub">visual reference for fictional NORDVIK demo</span>
            </a>
            <div class="header-tools">
              <a class="language-link" href="#/info/francais">Français</a>
              <form class="search" data-action="search">
                <label for="search">Search / Recherche</label>
                <input id="search" name="search" type="search" placeholder="Search / Recherche" />
                <button class="icon-button" type="submit" aria-label="Search">⌕</button>
              </form>
              ${
                signedIn
                  ? `<button class="secondary-button" data-action="sign-out">Sign out</button>`
                  : `<button class="primary-button" data-nav="#/login">Sign in to online services</button>`
              }
            </div>
          </div>
        </header>
        <main id="app-main">${content}</main>
        <footer class="footer">
          <div class="layout-width">
            <span>NORDVIK Identity demonstration only.</span>
            <button class="secondary-button" data-action="reset">Reset demo</button>
          </div>
        </footer>
      </div>
    `;
  }

  function publicLanding() {
    const firstBand = infoLinks.slice(0, 3);
    const secondBand = infoLinks.slice(3);
    return shell(`
      <section class="hero">
        <div class="layout-width">
          <h1>Registry of Motor Vehicles: driving and road safety</h1>
          <p>Driver education, licences, renewals, vehicle permits, licence plates and other information and services provided by Registry of Motor Vehicles.</p>
          <div class="online-panel">
            <div>
              <h2>RMV online services</h2>
              <p>Access your driving licence and vehicle services, submit requests and track their progress.</p>
            </div>
            <button class="primary-button" data-nav="#/login">Sign in</button>
          </div>
        </div>
      </section>
      <section class="section-band blue">
        <div class="layout-width">
          <h2>Driver licences</h2>
          ${linkGrid(firstBand)}
        </div>
      </section>
      <section class="section-band">
        <div class="layout-width">
          <h2>Driving testing, training and safety</h2>
          ${linkGrid(secondBand)}
        </div>
      </section>
    `);
  }

  function linkGrid(groups) {
    return `<div class="link-grid">${groups.map(([heading, links]) => `
      <div class="link-column">
        <h3>${heading}</h3>
        <ul>${links.map((label) => `
          <li><a href="#/info/${slugify(label)}">${label}</a>${/online|renewal|address|payment|Book/.test(label) ? '<span class="badge">online</span>' : ""}</li>
        `).join("")}</ul>
      </div>
    `).join("")}</div>`;
  }

  function slugify(label) {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function loginScreen(error = "") {
    clearAuth();
    return authShell(`
      <div class="auth-grid">
        <section class="auth-panel" aria-labelledby="login-title">
          <h1 id="login-title">Sign in to online services</h1>
          ${steps("password")}
          ${error ? `<div class="error" role="alert">${escapeHtml(error)}</div>` : ""}
          <form data-action="login">
            <div class="form-row">
              <label for="username">Username</label>
              <input id="username" name="username" autocomplete="username" required />
            </div>
            <div class="form-row">
              <label for="password">Password</label>
              <div class="password-wrap">
                <input id="password" name="password" type="password" autocomplete="current-password" required />
                <button class="secondary-button" type="button" data-action="toggle-password">Show</button>
              </div>
            </div>
            <button class="primary-button" type="submit">Continue</button>
          </form>
        </section>
        ${demoAccountsPanel()}
      </div>
    `);
  }

  function authShell(content) {
    return shell(`<div class="main-panel"><div class="layout-width">${content}</div></div>`);
  }

  function steps(active) {
    const all = [
      ["password", "Username and password"],
      ["code", "Two-step verification"],
      ["photo", "Simulated photo recognition"],
      ["result", "Result"],
    ];
    return `<div class="steps" aria-label="Sign-in progress">${all.map(([key, label]) => `<span class="step-pill ${key === active ? "active" : ""}">${label}</span>`).join("")}</div>`;
  }

  function demoAccountsPanel() {
    return `<aside class="demo-accounts" aria-labelledby="demo-accounts-title">
      <h2 id="demo-accounts-title">Demo accounts</h2>
      <p class="hint">Credentials are public fixtures for presentation only. Buttons fill the form and leave submission to the presenter.</p>
      ${Object.values(credentials).map((account) => `
        <div class="demo-account">
          <h3>${account.username === "demo.suspended" ? "Suspended profile" : account.outcome === "pass" ? "Passing profile" : "Failing profile"}</h3>
          <dl>
            <dt>Username</dt><dd><code>${account.username}</code></dd>
            <dt>Password</dt><dd><code>${account.password}</code></dd>
            <dt>Two-step code</dt><dd><code>${account.code}</code></dd>
            <dt>Photo result</dt><dd>${account.outcome === "pass" ? "Always passes" : "Always fails"}</dd>
          </dl>
          <button class="secondary-button" data-fill="${account.username}">Fill ${account.username}</button>
        </div>
      `).join("")}
    </aside>`;
  }

  function handleLogin(form) {
    const username = form.username.value.trim();
    const password = form.password.value;
    const account = credentials[username];
    if (!account || account.password !== password) {
      app.innerHTML = loginScreen("The username or password is incorrect.");
      bindEvents();
      announce("The username or password is incorrect.");
      return;
    }
    auth = { stage: "code", username, twoStep: false, photo: false };
    navigate("#/verify");
  }

  function verifyScreen(error = "", notice = "") {
    if (!auth.username || auth.stage !== "code") return guarded();
    return authShell(`
      <section class="auth-panel" aria-labelledby="verify-title">
        <h1 id="verify-title">Two-step verification</h1>
        ${steps("code")}
        <p>Code delivery is simulated. No email or text message will be sent.</p>
        <p class="success">Demo code: <code>${profile().code}</code></p>
        ${notice ? `<div class="success" role="status">${escapeHtml(notice)}</div>` : ""}
        ${error ? `<div class="error" role="alert">${escapeHtml(error)}</div>` : ""}
        <form data-action="code">
          <div class="form-row">
            <label for="code">Six-digit code</label>
            <input id="code" name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required />
          </div>
          <div class="actions">
            <button class="primary-button" type="submit">Verify code</button>
            <button class="secondary-button" type="button" data-action="resend">Resend simulated code</button>
            <button class="text-button" type="button" data-action="back-login">Return to login</button>
          </div>
        </form>
      </section>
    `);
  }

  function handleCode(form) {
    if (form.code.value.trim() !== profile().code) {
      app.innerHTML = verifyScreen("The verification code is incorrect.");
      bindEvents();
      announce("The verification code is incorrect.");
      return;
    }
    auth.twoStep = true;
    auth.stage = "photo";
    navigate("#/photo");
  }

  function photoScreen() {
    if (!auth.username || !auth.twoStep || auth.stage !== "photo") return guarded();
    const p = profile();
    const phases = [
      "Position your face within the frame.",
      "Look forwards.",
      "Turn your head slightly.",
      "Checking liveness.",
      "Comparing with the demo RMV photograph.",
      "Display the result.",
    ];
    return authShell(`
      <section class="camera-panel" aria-labelledby="photo-title">
        <h1 id="photo-title">Simulated live photo recognition</h1>
        ${steps("photo")}
        <p>We’ll confirm your identity by comparing a live image with your RMV reference photograph. This demonstration simulates that process.</p>
        <div class="camera-grid">
          <div class="camera-frame" aria-label="Camera-style frame with fictional portrait">
            <span class="camera-label">Simulated verification</span>
            <div class="scan-line" aria-hidden="true"></div>
            <div class="face-outline">
              ${portrait(p.portrait)}
            </div>
          </div>
          <div>
            <h2>Verification progress</h2>
            <ol class="progress-list" id="progress-list">
              ${phases.map((phase, index) => `<li data-phase="${index}"><span class="dot"></span><span>${phase}</span></li>`).join("")}
            </ol>
            <div class="actions">
              <button class="primary-button" data-action="start-photo">Start simulated check</button>
              <button class="secondary-button" data-action="cancel-photo">Cancel and return to sign-in</button>
            </div>
          </div>
        </div>
      </section>
    `);
  }

  function portrait(colors) {
    return `<div class="portrait" style="--skin:${colors.skin};--hair:${colors.hair};--shirt:${colors.shirt}">
      <div class="hair"></div>
      <div class="head"></div>
      <div class="eye left"></div>
      <div class="eye right"></div>
      <div class="mouth"></div>
      <div class="body"></div>
    </div>`;
  }

  function startPhotoSimulation() {
    const list = document.getElementById("progress-list");
    const portraitEl = document.querySelector(".portrait");
    const button = document.querySelector("[data-action='start-photo']");
    if (!list || !button) return;
    button.disabled = true;
    let index = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 120 : 700;
    clearInterval(verificationTimer);
    verificationTimer = setInterval(() => {
      [...list.children].forEach((item, itemIndex) => {
        item.className = itemIndex < index ? "complete" : itemIndex === index ? "current" : "";
      });
      if (portraitEl) portraitEl.style.setProperty("--turn", index === 2 ? "18px" : index === 1 ? "0" : "-10px");
      announce(list.children[index]?.innerText || "Verification complete.");
      index += 1;
      if (index >= list.children.length) {
        clearInterval(verificationTimer);
        auth.photo = profile().outcome === "pass";
        auth.stage = "result";
        navigate("#/result");
      }
    }, delay);
  }

  function resultScreen() {
    if (!auth.username || !auth.twoStep || auth.stage !== "result") return guarded();
    const p = profile();
    if (p.outcome === "pass" && auth.photo) {
      return authShell(`
        <section class="result-panel" aria-labelledby="result-title">
          <h1 id="result-title">Identity confirmed — simulated result</h1>
          ${steps("result")}
          <p>The fictional profile has completed username and password, two-step verification and simulated live photo recognition.</p>
          <button class="primary-button" data-action="grant-access">Continue to online services</button>
        </section>
      `);
    }
    return authShell(`
      <section class="result-panel" aria-labelledby="result-title">
        <h1 id="result-title">Sorry, we couldn’t confirm your identity</h1>
        ${steps("result")}
        <p>Please proceed to your nearest Access Nova Scotia Centre for Services.</p>
        <p>Access to online services and personal records is not granted for this fictional profile.</p>
        <div class="actions">
          <button class="primary-button" data-action="try-photo-again">Try again</button>
          <button class="secondary-button" data-action="another-account">Sign in with another account</button>
          <button class="secondary-button" data-action="assisted">Request assisted verification</button>
        </div>
        ${assistanceList()}
      </section>
    `);
  }

  function assistanceList() {
    const items = state.assistance.filter((item) => item.username === auth.username);
    if (!items.length) return "";
    return `<div class="success" role="status">Pending assistance request created: ${items[items.length - 1].ref}. This does not grant access.</div>`;
  }

  function guarded() {
    clearAuth();
    return authShell(`
      <section class="auth-panel" aria-labelledby="guard-title">
        <h1 id="guard-title">Sign in required</h1>
        <p>For this demonstration, access is granted only after the password, two-step and simulated photo verification stages are complete.</p>
        <button class="primary-button" data-nav="#/login">Sign in</button>
      </section>
    `);
  }

  function dashboardScreen() {
    if (auth.stage !== "complete" || !auth.photo) return guarded();
    const p = profile();
    return shell(`
      <div class="main-panel dashboard">
        <div class="layout-width">
          <h1>Welcome, ${p.name}</h1>
          <p class="hint">Identity verification occurred during sign-in for this demo and is not repeated for each transaction.</p>
          <div class="dashboard-grid">
            <section class="record-card dashboard-card-static">
              <h2>My Summary</h2>
              <dl>
                <dt>Name:</dt><dd>${p.name}</dd>
                <dt>DL #:</dt><dd>${p.licence.number}</dd>
                <dt>Status:</dt><dd>${p.licence.status}</dd>
                <dt>Address:</dt><dd>${p.licence.address}</dd>
                <dt>DL Expiry:</dt><dd>${p.licence.expiry}</dd>
              </dl>
            </section>
            <button class="record-card dashboard-card-button" data-nav="#/dashboard/vehicles">
              <span class="dashboard-card-title">My Vehicles</span>
              <span>${p.vehicles.length} fictional vehicle records</span>
              <span class="card-link-text">View vehicle list and Notice of Sale</span>
            </button>
            <section class="record-card dashboard-card-static">
              <h2>Service Actions</h2>
              <div class="actions">
                <button class="primary-button" data-nav="#/services/licence">Driving Licence</button>
                <button class="primary-button" data-nav="#/services/vehicles">Vehicles</button>
                <button class="primary-button" ${isSuspended() ? "disabled" : 'data-nav="#/services/permits"'}>Permits</button>
              </div>
              ${isSuspended() ? `<p class="restriction-note">Permit services are unavailable in this demonstration while your licence is suspended. Visit an Access Nova Scotia office for assistance.</p>` : ""}
            </section>
            <button class="record-card dashboard-card-button" data-nav="#/dashboard/history">
              <span class="dashboard-card-title">Transaction History</span>
              <span>${combinedHistory(p).length} fictional transactions</span>
              <span class="card-link-text">View all transactions</span>
            </button>
          </div>
        </div>
      </div>
    `);
  }

  function dashboardVehiclesScreen() {
    if (auth.stage !== "complete" || !auth.photo) return guarded();
    const p = profile();
    return shell(`
      <div class="main-panel dashboard">
        <div class="layout-width">
          <button class="text-button" data-nav="#/dashboard">Back to dashboard</button>
          <section class="record-card">
            <h1>My Vehicles</h1>
            <ul class="vehicle-list">${userVehicles().map(vehicleDetail).join("")}</ul>
          </section>
          ${activeNoticeVehicleId ? noticeOfSaleDialog(activeNoticeVehicleId) : ""}
        </div>
      </div>
    `);
  }

  function dashboardHistoryScreen() {
    if (auth.stage !== "complete" || !auth.photo) return guarded();
    const p = profile();
    return shell(`
      <div class="main-panel dashboard">
        <div class="layout-width">
          <button class="text-button" data-nav="#/dashboard">Back to dashboard</button>
          <section class="record-card">
            <h1>Transaction History</h1>
            ${historyList(p)}
            <h2>Demo inbox</h2>
            ${inboxItems().length ? `<ul class="history-list">${inboxItems().map((mail) => `<li class="history-item"><strong>${mail.subject}</strong><br />${mail.body}${mail.documentTitle ? documentPreview(mail.documentTitle) : ""}</li>`).join("")}</ul>` : "<p>No simulated email messages yet.</p>"}
          </section>
        </div>
      </div>
    `);
  }

  function vehicleSummary(v) {
    const sale = vehicleSale(v.id);
    return `<li class="history-item"><strong>${vehicleName(v)}${sale ? ` <span class="sold-mark">sold to ${escapeHtml(sale.personName)}</span>` : ""}</strong><br />Plate ${sale ? "removed" : v.plate}; plate expires ${sale ? "not active" : v.plateExpiry}; permit ${v.permit}</li>`;
  }

  function vehicleDetail(v) {
    const sale = vehicleSale(v.id);
    return `<li class="vehicle-item">
      <div>
        <h2>${vehicleName(v)}${sale ? ` <span class="sold-mark">sold to ${escapeHtml(sale.personName)}</span>` : ""}</h2>
        <dl>
          <dt>Plate</dt><dd>${sale ? "Removed after simulated Notice of Sale" : v.plate}</dd>
          <dt>Plate expiry</dt><dd>${sale ? "Not active" : v.plateExpiry}</dd>
          <dt>Permit</dt><dd>${v.permit}</dd>
          ${sale ? `<dt>Notice of Sale</dt><dd>${escapeHtml(sale.ref)} submitted ${escapeHtml(sale.dateSold)}</dd>` : ""}
        </dl>
      </div>
      <button class="secondary-button" data-open-nos="${v.id}" ${sale ? "disabled" : ""}>Post Notice of Sale</button>
    </li>`;
  }

  function vehicleName(v) {
    return `${v.year} ${v.make} ${v.model}`;
  }

  function vehicleSale(vehicleId) {
    return state.vehicleSales?.[profile().username]?.[vehicleId] || null;
  }

  function noticeOfSaleDialog(vehicleId) {
    const vehicle = profile().vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return "";
    return `<div class="modal-backdrop" role="presentation">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="nos-title">
        <h2 id="nos-title">Post Notice of Sale</h2>
        <p class="hint">${vehicleName(vehicle)} · this is a simulated Notice of Sale.</p>
        <form data-action="notice-sale">
          <input type="hidden" name="vehicleId" value="${vehicle.id}" />
          <div class="form-row">
            <label for="personName">Person's name</label>
            <input id="personName" name="personName" required />
          </div>
          <div class="form-row">
            <label for="buyerDl">DL # (if known)</label>
            <input id="buyerDl" name="buyerDl" />
          </div>
          <div class="form-row">
            <label for="soldProvince">Province sold in</label>
            <input id="soldProvince" name="soldProvince" required />
          </div>
          <div class="form-row">
            <label for="dateSold">Date sold</label>
            <input id="dateSold" name="dateSold" type="date" required />
          </div>
          <div class="actions">
            <button class="primary-button" type="submit">Add simulated Notice of Sale</button>
            <button class="secondary-button" type="button" data-action="close-nos">Cancel</button>
          </div>
        </form>
      </section>
    </div>`;
  }

  function combinedHistory(p) {
    const userRequests = state.requests[p.username] || [];
    return [...userRequests, ...p.history];
  }

  function historyList(p) {
    const history = combinedHistory(p);
    return `<ul class="history-list">${history.map((item) => `
      <li class="history-item">
        <strong>${item.service}</strong><br />
        Reference ${item.ref} · ${item.date || "Today"} · <span class="status">${item.status}</span>
      </li>
    `).join("")}</ul>`;
  }

  function transactionScreen() {
    if (auth.stage !== "complete" || !auth.photo) return guarded();
    const type = location.hash.split("/")[2];
    if (!serviceDetails[type]) return dashboardScreen();
    if (!activeTransaction || activeTransaction.type !== type) {
      activeTransaction = { type, step: 1, reason: "", vehicleId: profile().vehicles[0]?.id || "", addressConfirmed: false, paymentConfirmed: false };
    }
    const detail = serviceDetails[type];
    return shell(`
      <div class="main-panel flow">
        <div class="layout-width">
          <section class="transaction-card">
            <h1>${detail.title}</h1>
            ${transactionSteps(activeTransaction.step)}
            ${transactionStepContent(detail)}
          </section>
        </div>
      </div>
    `);
  }

  function transactionSteps(current) {
    return `<div class="transaction-steps" aria-label="Transaction progress">${[1, 2, 3, 4, 5].map((step) => `<span class="${step <= current ? "active" : ""}"></span>`).join("")}</div>`;
  }

  function transactionStepContent(detail) {
    const p = profile();
    if (activeTransaction.step === 1) {
      return `
        <h2>${detail.recordTitle}</h2>
        <div class="records-grid">
          <div class="record-card">
            <h3>Driving licence</h3>
            <dl>
              <dt>Number</dt><dd>${p.licence.number}</dd>
              <dt>Status</dt><dd>${p.licence.status}</dd>
              <dt>Address</dt><dd>${p.licence.address}</dd>
            </dl>
          </div>
          ${detail.needsVehicle ? `<div class="record-card"><h3>Select vehicle</h3><div class="radio-list">${p.vehicles.map((v) => `
            <label><input type="radio" name="vehicle" value="${v.id}" ${activeTransaction.vehicleId === v.id ? "checked" : ""} /> ${v.year} ${v.make} ${v.model}, plate ${v.plate}</label>
          `).join("")}</div></div>` : ""}
        </div>
        <fieldset class="form-row">
          <legend class="fieldset-label">Replacement reason</legend>
          <div class="radio-list">
            ${["Lost", "Stolen", "Damaged"].map((reason) => `<label><input type="radio" name="reason" value="${reason}" ${activeTransaction.reason === reason ? "checked" : ""} /> ${reason}</label>`).join("")}
          </div>
        </fieldset>
        <div class="actions">
          <button class="primary-button" data-action="transaction-next">Continue</button>
          <button class="secondary-button" data-nav="#/dashboard">Cancel</button>
        </div>
      `;
    }
    if (activeTransaction.step === 2) {
      return `
        <h2>Confirm delivery address</h2>
        <p>${p.licence.address}</p>
        <label class="radio-list"><span><input type="checkbox" id="address-confirmed" ${activeTransaction.addressConfirmed ? "checked" : ""} /> I confirm this fictional delivery address is correct.</span></label>
        <div class="actions">
          <button class="primary-button" data-action="transaction-next">Continue</button>
          <button class="secondary-button" data-action="transaction-back">Back</button>
        </div>
      `;
    }
    if (activeTransaction.step === 3) {
      return `
        <h2>Demo fee and simulated payment</h2>
        <p><strong>${detail.fee}</strong></p>
        <p>No card or banking details are requested. Payment is simulated for this demonstration.</p>
        <label class="radio-list"><span><input type="checkbox" id="payment-confirmed" ${activeTransaction.paymentConfirmed ? "checked" : ""} /> Mark simulated payment as complete.</span></label>
        <div class="actions">
          <button class="primary-button" data-action="transaction-next">Continue</button>
          <button class="secondary-button" data-action="transaction-back">Back</button>
        </div>
      `;
    }
    if (activeTransaction.step === 4) {
      return `
        <h2>Final review</h2>
        ${reviewList(detail)}
        <div class="actions">
          <button class="primary-button" data-action="submit-request">Submit fictional request</button>
          <button class="secondary-button" data-action="transaction-back">Back</button>
        </div>
      `;
    }
    return `
      <h2>Request submitted</h2>
      <div class="success" role="status">Confirmation ${activeTransaction.confirmationRef}</div>
      <p>${detail.confirmation}</p>
      <button class="primary-button" data-nav="#/dashboard">Return to dashboard</button>
    `;
  }

  function reviewList(detail) {
    const vehicle = profile().vehicles.find((v) => v.id === activeTransaction.vehicleId);
    return `<dl class="review-list">
      <dt>Service</dt><dd>${detail.title}</dd>
      <dt>Reason</dt><dd>${activeTransaction.reason}</dd>
      ${detail.needsVehicle ? `<dt>${detail.itemLabel}</dt><dd>${vehicle.year} ${vehicle.make} ${vehicle.model}, plate ${vehicle.plate}</dd>` : ""}
      <dt>Delivery address</dt><dd>${profile().licence.address}</dd>
      <dt>Fee</dt><dd>${detail.fee}</dd>
      <dt>Payment</dt><dd>Simulated only</dd>
    </dl>`;
  }

  function handleTransactionNext() {
    if (activeTransaction.step === 1) {
      const reason = document.querySelector("input[name='reason']:checked");
      const vehicle = document.querySelector("input[name='vehicle']:checked");
      if (!reason) return announce("Select a replacement reason.");
      activeTransaction.reason = reason.value;
      if (vehicle) activeTransaction.vehicleId = vehicle.value;
    }
    if (activeTransaction.step === 2) {
      const confirmed = document.getElementById("address-confirmed")?.checked;
      if (!confirmed) return announce("Confirm the delivery address to continue.");
      activeTransaction.addressConfirmed = true;
    }
    if (activeTransaction.step === 3) {
      const confirmed = document.getElementById("payment-confirmed")?.checked;
      if (!confirmed) return announce("Complete the simulated payment to continue.");
      activeTransaction.paymentConfirmed = true;
    }
    activeTransaction.step += 1;
    render();
  }

  function submitRequest() {
    const detail = serviceDetails[activeTransaction.type];
    const request = {
      ref: ref("NVD-REQ"),
      service: detail.title,
      status: "Submitted",
      date: "Today",
    };
    state.requests[profile().username] = [request, ...(state.requests[profile().username] || [])];
    activeTransaction.confirmationRef = request.ref;
    activeTransaction.step = 5;
    saveState();
    announce(`Request submitted. Reference ${request.ref}.`);
    render();
  }

  function submitNoticeOfSale(form) {
    const vehicleId = form.vehicleId.value;
    const vehicle = profile().vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;
    const sale = {
      ref: ref("NVD-NOS"),
      personName: form.personName.value.trim(),
      buyerDl: form.buyerDl.value.trim(),
      soldProvince: form.soldProvince.value.trim(),
      dateSold: form.dateSold.value,
    };
    if (!sale.personName || !sale.soldProvince || !sale.dateSold) {
      announce("Complete the Notice of Sale fields to continue.");
      return;
    }
    state.vehicleSales[profile().username] = {
      ...(state.vehicleSales[profile().username] || {}),
      [vehicleId]: sale,
    };
    const request = {
      ref: sale.ref,
      service: `Simulated Notice of Sale - ${vehicleName(vehicle)}`,
      status: `Sold to ${sale.personName}`,
      date: sale.dateSold,
    };
    state.requests[profile().username] = [request, ...(state.requests[profile().username] || [])];
    activeNoticeVehicleId = null;
    saveState();
    announce(`Simulated Notice of Sale submitted. Plate removed from ${vehicleName(vehicle)}.`);
    render();
  }

  function isSuspended() {
    return profile()?.licence.status.toLowerCase() === "suspended";
  }

  function currentAddress() {
    return state.addresses[profile().username]?.residential || profile().licence.address;
  }

  function userVehicles() {
    const p = profile();
    const extras = state.vehicleOverrides[p.username] || [];
    return [...p.vehicles, ...extras];
  }

  function inboxItems() {
    return state.emails[profile().username] || [];
  }

  function addHistory(service, status = "Submitted", date = "Today") {
    const item = { ref: ref("NVD-REQ"), service, status, date };
    state.requests[profile().username] = [item, ...(state.requests[profile().username] || [])];
    return item;
  }

  function addEmail(subject, body, documentTitle = "") {
    const item = { ref: ref("NVD-EMAIL"), subject, body, documentTitle, date: "Today" };
    state.emails[profile().username] = [item, ...(state.emails[profile().username] || [])];
    return item;
  }

  function serviceMenuScreen() {
    if (auth.stage !== "complete" || !auth.photo) return guarded();
    const group = location.hash.split("/")[2];
    const titles = { licence: "Driving Licence", vehicles: "Vehicles", permits: "Permits" };
    const suspended = isSuspended();
    const options = {
      licence: [
        { key: "renew", label: "Renew or replace driving licence", disabled: suspended, note: suspended ? "Your driving licence is suspended. Visit an Access Nova Scotia office for assistance." : "" },
        { key: "abstract", label: "Driver's abstract" },
        { key: "test", label: "Write a test" },
        { key: "address", label: "Change my address" },
        { key: "suspensions", label: "My suspensions and fines" },
      ],
      vehicles: [
        { key: "replace-ownership", label: "Replace vehicle ownership" },
        { key: "title-new", label: "Title a vehicle - new transaction (non-dealer)" },
        { key: "title-pending", label: "Title a vehicle - pending transaction (non-dealer)" },
        { key: "cancel-nos", label: "Cancel notice of sale" },
      ],
      permits: [
        { key: "replace-permit", label: "Replace a permit", disabled: suspended, note: suspended ? "Permit services are unavailable in this demonstration while your licence is suspended. Visit an Access Nova Scotia office for assistance." : "" },
        { key: "permit-vehicle", label: "Permit a vehicle", disabled: suspended, note: suspended ? "Permit services are unavailable in this demonstration while your licence is suspended. Visit an Access Nova Scotia office for assistance." : "" },
        { key: "renew-permit", label: "Renew a permit", disabled: suspended, note: suspended ? "Permit services are unavailable in this demonstration while your licence is suspended. Visit an Access Nova Scotia office for assistance." : "" },
        { key: "temporary-permit", label: "Temporary permit", disabled: suspended, note: suspended ? "Permit services are unavailable in this demonstration while your licence is suspended. Visit an Access Nova Scotia office for assistance." : "" },
      ],
    }[group];
    if (!options) return dashboardScreen();
    return shell(`
      <div class="main-panel dashboard">
        <div class="layout-width">
          <button class="text-button" data-nav="#/dashboard">Back to dashboard</button>
          <section class="record-card">
            <h1>${titles[group]}</h1>
            <div class="service-option-list">
              ${options.map((option) => `
                <div class="service-option ${option.disabled ? "disabled-option" : ""}">
                  <div>
                    <h2>${option.label}</h2>
                    ${option.note ? `<p class="restriction-note">${option.note}</p>` : ""}
                  </div>
                  <button class="primary-button" ${option.disabled ? "disabled" : `data-nav="#/service/${group}/${option.key}"`}>Open</button>
                </div>
              `).join("")}
            </div>
            ${group === "vehicles" ? presenterControls() : ""}
          </section>
        </div>
      </div>
    `);
  }

  function presenterControls() {
    const pending = titleTransactions().filter((item) => item.status === "Awaiting invoice");
    if (!pending.length) return "";
    return `<div class="presenter-panel">
      <h2>Presenter controls</h2>
      <p class="hint">Use this to move an awaiting-invoice title transaction into the pending payment list.</p>
      ${pending.map((item) => `<button class="secondary-button" data-invoice="${item.id}">Simulate invoice received for VIN ${escapeHtml(item.vin)}</button>`).join("")}
    </div>`;
  }

  function serviceFlowScreen() {
    if (auth.stage !== "complete" || !auth.photo) return guarded();
    const [, , group, key] = location.hash.split("/");
    if (group === "permits" && isSuspended()) return restrictedScreen("Permit services are unavailable in this demonstration while your licence is suspended. Visit an Access Nova Scotia office for assistance.");
    if (group === "licence" && key === "renew" && isSuspended()) return restrictedScreen("Your driving licence is suspended. Visit an Access Nova Scotia office for assistance.");
    const map = {
      "licence/renew": licenceRenewFlow,
      "licence/abstract": abstractFlow,
      "licence/test": testFlow,
      "licence/address": addressFlow,
      "licence/suspensions": suspensionsFlow,
      "vehicles/replace-ownership": replaceOwnershipFlow,
      "vehicles/title-new": titleNewFlow,
      "vehicles/title-pending": titlePendingFlow,
      "vehicles/cancel-nos": cancelNosFlow,
      "permits/replace-permit": permitReplaceFlow,
      "permits/permit-vehicle": permitVehicleFlow,
      "permits/renew-permit": permitRenewFlow,
      "permits/temporary-permit": temporaryPermitFlow,
    };
    const renderer = map[`${group}/${key}`];
    return renderer ? renderer() : dashboardScreen();
  }

  function restrictedScreen(message) {
    return shell(`
      <div class="main-panel"><div class="layout-width">
        <section class="record-card">
          <h1>Service unavailable</h1>
          <p class="restriction-note">${message}</p>
          <button class="secondary-button" data-nav="#/dashboard">Back to dashboard</button>
        </section>
      </div></div>
    `);
  }

  function flowShell(title, body, back = "#/dashboard") {
    return shell(`<div class="main-panel flow"><div class="layout-width"><section class="transaction-card"><button class="text-button" data-nav="${back}">Back</button><h1>${title}</h1>${body}</section></div></div>`);
  }

  function licenceRenewFlow() {
    return flowShell("Renew or replace driving licence", `
      <form data-action="licence-renew">
        <fieldset class="form-row"><legend class="fieldset-label">Service type</legend><div class="radio-list">
          <label><input type="radio" name="kind" value="Renewal" required /> Renewal</label>
          <label><input type="radio" name="kind" value="Replacement" /> Replacement</label>
        </div></fieldset>
        ${["Do you have full use of your eyes, ears and limbs?", "Have you experienced a loss of consciousness in the last 12 months?", "Do you have a medical condition that could affect your ability to drive?"].map((q, i) => `
          <fieldset class="form-row"><legend class="fieldset-label">${q}</legend><div class="radio-list">
            <label><input type="radio" name="medical${i}" value="yes" required /> Yes</label>
            <label><input type="radio" name="medical${i}" value="no" /> No</label>
          </div></fieldset>`).join("")}
        <p>Mailing address: ${currentAddress()}</p>
        <p><strong>$28.75 demo fee</strong> - payment is simulated.</p>
        <button class="primary-button" type="submit">Review and submit demo request</button>
      </form>`, "#/services/licence");
  }

  function abstractFlow() {
    return flowShell("Driver's abstract", `<form data-action="simple-flow" data-service-name="Driver's abstract" data-doc="Driver abstract preview"><p>Request a fictional driver abstract, review the demo fee and create a watermarked preview.</p><p><strong>$19.10 demo fee</strong></p><button class="primary-button" type="submit">Request abstract</button></form>`, "#/services/licence");
  }

  function testFlow() {
    return flowShell("Write a test", `<form data-action="simple-flow" data-service-name="Written test booking" data-doc="Test booking confirmation"><div class="form-row"><label for="testType">Test type</label><select id="testType" name="testType"><option>Class 5 knowledge test</option><option>Air brake knowledge test</option><option>Motorcycle knowledge test</option></select></div><div class="form-row"><label for="slot">Fictional availability</label><select id="slot" name="slot"><option>14 October 2026 - 10:30 AM</option><option>16 October 2026 - 2:00 PM</option></select></div><button class="primary-button" type="submit">Book demo test</button></form>`, "#/services/licence");
  }

  function addressFlow() {
    return flowShell("Change my address", `<form data-action="change-address"><p>Current residential address: ${currentAddress()}</p><div class="form-row"><label for="residential">New residential address</label><input id="residential" name="residential" required /></div><div class="form-row"><label for="mailing">Mailing address if different</label><input id="mailing" name="mailing" /></div><button class="primary-button" type="submit">Update demo address</button></form>`, "#/services/licence");
  }

  function suspensionsFlow() {
    const p = profile();
    const fines = p.fines || [];
    return flowShell("My suspensions and fines", `
      <h2>Suspensions</h2>
      ${(p.suspensionRecords || []).map((item) => `<div class="history-item"><strong>${item.reason}</strong><br />Status ${item.status}; start ${item.start}; scheduled end ${item.end}. Reinstatement is not automatic in this demo.</div>`).join("") || "<p>No suspension records for this profile.</p>"}
      <h2>Outstanding fines and fees</h2>
      <form data-action="pay-fines">
        ${fines.map((fine) => {
          const paid = state.paidFines[p.username]?.[fine.id];
          return `<label class="fine-row"><input type="checkbox" name="fine" value="${fine.id}" ${paid ? "disabled" : ""} /> ${fine.label} - ${fine.amount} <span class="status">${paid ? "Paid" : fine.status}</span></label>`;
        }).join("") || "<p>No outstanding demo fines.</p>"}
        <p class="hint">Simulated payment does not remove suspended status.</p>
        <button class="primary-button" type="submit">Simulate selected payment</button>
      </form>`, "#/services/licence");
  }

  function replaceOwnershipFlow() {
    return genericVehicleFlow("Replace vehicle ownership", "Replacement ownership request", userVehicles().filter((v) => v.permitStatus === "Permitted"), "#/services/vehicles");
  }

  function titleTransactions() {
    return state.titleTransactions[profile().username] || seedTitleTransactions(profile().username);
  }

  function seedTitleTransactions(username) {
    const seeded = username === "demo.pass" ? [
      { id: "title-awaiting-1", vin: "NVDWAITING00001", cycle: "cycle-1", vehicle: "2022 Kia Soul", status: "Awaiting invoice", wantsPlate: true, safety: "Yes", amount: "$187.40" },
      { id: "title-invoiced-1", vin: "NVDINVOICE00001", cycle: "cycle-1", vehicle: "2020 Volkswagen Golf", status: "Invoice received", wantsPlate: true, safety: "Yes", amount: "$214.80" },
    ] : [];
    state.titleTransactions[username] = seeded;
    saveState();
    return seeded;
  }

  function titleNewFlow() {
    const sampleVins = Object.entries(vinRegistry).map(([vin, v]) => `<li><button class="text-button" type="button" data-fill-vin="${vin}">${vin}</button> - ${v.year} ${v.make} ${v.model}${v.seventyTyped ? " (70 typed)" : ""}</li>`).join("");
    return flowShell("Title a vehicle - new transaction", `<form data-action="title-new"><div class="form-row"><label for="vin">VIN</label><input id="vin" name="vin" autocomplete="off" required /><details class="hint"><summary>Demo VINs</summary><ul>${sampleVins}</ul></details></div><div class="form-row" id="vin-lookup" aria-live="polite">${vinLookupPanel("")}</div><div class="form-row"><label for="cycle">Ownership-cycle identifier</label><input id="cycle" name="cycle" value="cycle-1" required /></div><fieldset class="form-row"><legend class="fieldset-label">Would you like to plate the vehicle?</legend><div class="radio-list"><label><input type="radio" name="wantsPlate" value="yes" required /> Yes</label><label><input type="radio" name="wantsPlate" value="no" /> No</label></div></fieldset><fieldset class="form-row"><legend class="fieldset-label">Is the vehicle safety inspected?</legend><div class="radio-list"><label><input type="radio" name="safety" value="yes" required /> Yes</label><label><input type="radio" name="safety" value="no" /> No</label></div></fieldset><div class="form-row"><label for="insurance">Fictional insurance information or upload note</label><input id="insurance" name="insurance" required /></div><button class="primary-button" type="submit">Submit title demo</button></form>`, "#/services/vehicles");
  }

  function titlePendingFlow() {
    const tx = titleTransactions().filter((item) => item.status === "Invoice received");
    return flowShell("Title a vehicle - pending transaction", tx.length ? `<form data-action="title-pay"><div class="radio-list">${tx.map((item) => `<label><input type="radio" name="titleId" value="${item.id}" required /> ${escapeHtml(item.vehicle)} - VIN ${escapeHtml(item.vin)} - invoice ${item.amount}</label>`).join("")}</div><button class="primary-button" type="submit">Pay demo invoice</button></form>` : "<p>No invoiced vehicle transactions are ready for payment.</p>", "#/services/vehicles");
  }

  function cancelNosFlow() {
    const sold = userVehicles().filter((v) => vehicleSale(v.id));
    return flowShell("Cancel notice of sale", sold.length ? `<form data-action="cancel-nos"><div class="radio-list">${sold.map((v) => `<label><input type="radio" name="vehicleId" value="${v.id}" required /> ${vehicleName(v)} sold to ${escapeHtml(vehicleSale(v.id).personName)}</label>`).join("")}</div><div class="form-row"><label for="reason">Cancellation reason</label><input id="reason" name="reason" required /></div><button class="primary-button" type="submit">Confirm cancellation</button></form>` : "<p>No active Notice of Sale records are available to cancel.</p>", "#/services/vehicles");
  }

  function permitReplaceFlow() {
    return genericVehicleFlow("Replace a permit", "Replacement permit", userVehicles().filter((v) => v.permitStatus === "Permitted"), "#/services/permits", "Printable demo permit");
  }

  function permitVehicleFlow() {
    return genericVehicleFlow("Permit a vehicle", "Vehicle permit", userVehicles().filter((v) => v.permitStatus !== "Permitted"), "#/services/permits", "Printable demo permit");
  }

  function permitRenewFlow() {
    return genericVehicleFlow("Renew a permit", "Permit renewal", userVehicles().filter((v) => v.permitStatus === "Permitted"), "#/services/permits", "Printable demo permit");
  }

  function temporaryPermitFlow() {
    return flowShell("Temporary permit", `<form data-action="temporary-permit"><div class="form-row"><label for="vehicleId">Vehicle</label><select id="vehicleId" name="vehicleId">${userVehicles().map((v) => `<option value="${v.id}">${vehicleName(v)}</option>`).join("")}</select></div><div class="form-row"><label for="insurance">Insurance information</label><input id="insurance" name="insurance" required /></div><fieldset class="form-row"><legend class="fieldset-label">Is the vehicle safety inspected?</legend><div class="radio-list"><label><input type="radio" name="safety" value="yes" required /> Yes - 30-day temporary permit</label><label><input type="radio" name="safety" value="no" /> No - one-day, one-way travel permit</label></div></fieldset><div class="form-row"><label for="travel">Departure, destination and travel date if one-way</label><input id="travel" name="travel" /></div><button class="primary-button" type="submit">Review and issue demo temporary permit</button></form>`, "#/services/permits");
  }

  function genericVehicleFlow(title, serviceName, vehicles, back, doc = "Demo document") {
    return flowShell(title, vehicles.length ? `<form data-action="vehicle-simple" data-service-name="${serviceName}" data-doc="${doc}"><div class="form-row"><label for="vehicleId">Vehicle</label><select id="vehicleId" name="vehicleId">${vehicles.map((v) => `<option value="${v.id}">${vehicleName(v)}${v.seventyTyped ? " - 70 typed" : ""}</option>`).join("")}</select></div><p>Mailing address: ${currentAddress()}</p><p><strong>Demo fee</strong> - payment is simulated.</p><button class="primary-button" type="submit">Submit demo request</button></form>` : "<p>No eligible vehicles are available for this demo service.</p>", back);
  }

  function completionScreen(title, message, docTitle = "") {
    return flowShell(title, `<div class="success" role="status">${message}</div>${docTitle ? documentPreview(docTitle) : ""}<button class="primary-button" data-nav="#/dashboard">Return to dashboard</button>`);
  }

  function documentPreview(title) {
    return `<div class="document-preview"><span>DEMO - NOT VALID</span><h2>${title}</h2><p>This printable preview is fictional and has no legal effect.</p></div>`;
  }

  function handleLicenceRenew(form) {
    const answers = [form.medical0.value, form.medical1.value, form.medical2.value];
    const concern = answers[0] === "no" || answers[1] === "yes" || answers[2] === "yes";
    const kind = form.kind.value;
    const item = addHistory(`${kind} driving licence`, concern ? "Assisted review required" : "Submitted");
    if (concern) {
      addEmail("Assisted medical review created", "This simulated request was routed for assisted review because a medical answer indicated a possible concern.", "Assisted review notice");
      saveState();
      app.innerHTML = completionScreen("Assisted review - simulated", "Your request has been routed to assisted review in this demonstration. No automatic approval was granted.", "Assisted review notice");
      bindEvents();
      return;
    }
    addEmail(`${kind} driving licence confirmation`, `Demo request ${item.ref} was submitted.`, "30-day temporary driving licence");
    saveState();
    app.innerHTML = completionScreen("Shipment confirmation", "Your fictional request was submitted. A 30-day temporary driving licence is shown below.", "30-day temporary driving licence");
    bindEvents();
  }

  function handleSimpleFlow(form) {
    const service = form.dataset.serviceName;
    const doc = form.dataset.doc || "Demo document";
    const item = addHistory(service, "Complete");
    addEmail(`${service} confirmation`, `Demo request ${item.ref} was completed.`, doc);
    saveState();
    app.innerHTML = completionScreen(service, "The simulated request is complete. No real payment was taken.", doc);
    bindEvents();
  }

  function handleChangeAddress(form) {
    state.addresses[profile().username] = {
      residential: form.residential.value.trim(),
      mailing: form.mailing.value.trim() || form.residential.value.trim(),
    };
    addHistory("Change my address", "Complete");
    addEmail("Address change confirmation", "Your fictional residential and mailing address were updated in this demo.", "Address confirmation");
    saveState();
    app.innerHTML = completionScreen("Address updated", "The demo profile address has been updated.", "Address confirmation");
    bindEvents();
  }

  function handlePayFines(form) {
    const selected = [...form.querySelectorAll("input[name='fine']:checked")].map((input) => input.value);
    if (!selected.length) return announce("Select at least one demo fine or fee.");
    state.paidFines[profile().username] = { ...(state.paidFines[profile().username] || {}) };
    selected.forEach((id) => { state.paidFines[profile().username][id] = true; });
    addHistory("Suspension fines and fees payment", "Paid - suspension remains active");
    addEmail("Demo fine payment receipt", "Selected fictional fines or fees were marked paid. The licence remains suspended.", "Payment receipt");
    saveState();
    app.innerHTML = completionScreen("Payment recorded", "Selected demo fines or fees were marked paid. This does not remove the suspended status.", "Payment receipt");
    bindEvents();
  }

  function handleVehicleSimple(form) {
    const vehicle = userVehicles().find((v) => v.id === form.vehicleId.value);
    if (!vehicle) return;
    if (vehicle.seventyTyped && /plate/i.test(form.dataset.serviceName || "")) {
      return announce("70 typed restriction blocks online plate issuance.");
    }
    const item = addHistory(`${form.dataset.serviceName} - ${vehicleName(vehicle)}`, "Submitted");
    addEmail(`${form.dataset.serviceName} confirmation`, `Demo request ${item.ref} was submitted for ${vehicleName(vehicle)}.`, form.dataset.doc || "Demo document");
    saveState();
    app.innerHTML = completionScreen(form.dataset.serviceName, "The simulated vehicle request was submitted.", form.dataset.doc || "Demo document");
    bindEvents();
  }

  function handleTitleNew(form) {
    const vin = form.vin.value.trim().toUpperCase();
    const record = lookupVin(vin);
    if (!record) return announce("No vehicle found for this VIN in the demo registry.");
    const cycle = form.cycle.value.trim();
    const existing = titleTransactions().find((item) => item.vin === vin && item.cycle === cycle && item.status !== "Cancelled");
    if (existing) return announce("A demo title transaction already exists for this VIN and ownership cycle.");
    const seventyTyped = record.seventyTyped;
    const wantsPlate = form.wantsPlate.value === "yes";
    const safety = form.safety.value;
    const tx = {
      id: ref("TITLE"),
      vin,
      cycle,
      vehicle: record.vehicle,
      status: "Awaiting invoice",
      wantsPlate,
      safety: safety === "yes" ? "Yes" : "No",
      seventyTyped,
      amount: "$204.50",
    };
    state.titleTransactions[profile().username] = [tx, ...titleTransactions()];
    const note = seventyTyped && wantsPlate
      ? "70 typed: proof of safety inspection must be presented at an Access Nova Scotia centre before a plate can be issued. Online temporary plate issuance is blocked."
      : wantsPlate && safety === "no"
        ? "A 10-day safety-inspection delay/requirement is shown for this uninspected vehicle."
        : "Awaiting invoice before final documents are available.";
    addHistory(`Title transaction - ${tx.vehicle}`, "Awaiting invoice");
    saveState();
    app.innerHTML = completionScreen("Title transaction submitted", `${note} Final ownership and permit documents are not available until an invoice is issued and paid.`);
    bindEvents();
  }

  function handleTitlePay(form) {
    const id = form.titleId.value;
    const tx = titleTransactions().find((item) => item.id === id);
    if (!tx || tx.status === "Complete") return announce("This invoice cannot be paid again.");
    tx.status = "Complete";
    const vehicle = {
      id: ref("veh"),
      year: tx.vehicle.split(" ")[0] || "2026",
      make: tx.vehicle.split(" ")[1] || "Demo",
      model: tx.vehicle.split(" ").slice(2).join(" ") || "Vehicle",
      vin: tx.vin,
      plate: tx.wantsPlate && !tx.seventyTyped ? `NVD ${Math.floor(100 + Math.random() * 899)}` : "",
      plateExpiry: tx.wantsPlate && !tx.seventyTyped ? "10-day temporary plate" : "",
      permit: tx.wantsPlate && !tx.seventyTyped ? ref("VP") : "",
      permitStatus: tx.wantsPlate && !tx.seventyTyped ? "Permitted" : "Unpermitted",
      permitExpiry: tx.wantsPlate && !tx.seventyTyped ? "Temporary" : "",
      ownershipCycle: tx.cycle,
      seventyTyped: Boolean(tx.seventyTyped),
    };
    state.vehicleOverrides[profile().username] = [vehicle, ...(state.vehicleOverrides[profile().username] || [])];
    addHistory(`Completed title transaction - ${tx.vehicle}`, "Complete");
    addEmail("Title transaction complete", "This simulated email contains demo ownership and permit previews where applicable.", "Ownership and permit documents");
    saveState();
    app.innerHTML = completionScreen("Invoice paid", "The demo invoice was paid and the completed ownership record was added to the profile.", "Ownership and permit documents");
    bindEvents();
  }

  function handleCancelNos(form) {
    const vehicleId = form.vehicleId.value;
    if (state.vehicleSales[profile().username]) delete state.vehicleSales[profile().username][vehicleId];
    addHistory("Cancel notice of sale", "Complete");
    addEmail("Notice of Sale cancellation", "The fictional Notice of Sale was cancelled.", "Notice of Sale cancellation");
    saveState();
    app.innerHTML = completionScreen("Notice of Sale cancelled", "The fictional vehicle record has been updated.", "Notice of Sale cancellation");
    bindEvents();
  }

  function handleTemporaryPermit(form) {
    const vehicle = userVehicles().find((v) => v.id === form.vehicleId.value);
    if (!vehicle) return;
    if (vehicle.seventyTyped) return announce("70 typed restriction blocks temporary plate issuance; proof must be presented at an Access Nova Scotia centre.");
    const type = form.safety.value === "yes" ? "30-day temporary permit" : "one-day, one-way travel permit";
    addHistory(`${type} - ${vehicleName(vehicle)}`, "Complete");
    addEmail("Temporary permit confirmation", `A fictional ${type} was issued.`, "Printable demo temporary permit");
    saveState();
    app.innerHTML = completionScreen("Temporary permit issued", `The selected permit type is ${type}. No real permit was issued.`, "Printable demo temporary permit");
    bindEvents();
  }

  function infoPage() {
    const label = location.hash.split("/").slice(2).join("/").replace(/-/g, " ") || "demo information";
    return shell(`
      <div class="main-panel">
        <div class="layout-width">
          <section class="info-card">
            <h1>${label.charAt(0).toUpperCase() + label.slice(1)}</h1>
            <p>This is a clearly labelled demo information page. Public RMV-style information remains accessible without signing in.</p>
            <p>No official government service, record, payment or application is connected to this page.</p>
            <button class="secondary-button" data-nav="#/">Back to public information</button>
          </section>
        </div>
      </div>
    `);
  }

  function render() {
    clearInterval(verificationTimer);
    const route = location.hash || "#/";
    if (route === "#/" || route === "#") app.innerHTML = publicLanding();
    else if (route === "#/login") app.innerHTML = loginScreen();
    else if (route === "#/verify") app.innerHTML = verifyScreen();
    else if (route === "#/photo") app.innerHTML = photoScreen();
    else if (route === "#/result") app.innerHTML = resultScreen();
    else if (route === "#/dashboard") app.innerHTML = dashboardScreen();
    else if (route === "#/dashboard/vehicles") app.innerHTML = dashboardVehiclesScreen();
    else if (route === "#/dashboard/history") app.innerHTML = dashboardHistoryScreen();
    else if (route.startsWith("#/services/")) app.innerHTML = serviceMenuScreen();
    else if (route.startsWith("#/service/")) app.innerHTML = serviceFlowScreen();
    else if (route.startsWith("#/transaction/")) app.innerHTML = transactionScreen();
    else if (route.startsWith("#/info/")) app.innerHTML = infoPage();
    else app.innerHTML = publicLanding();
    bindEvents();
  }

  function bindEvents() {
    document.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.nav)));
    document.querySelectorAll("[data-fill]").forEach((button) => button.addEventListener("click", () => {
      const account = credentials[button.dataset.fill];
      const username = document.getElementById("username");
      const password = document.getElementById("password");
      if (username && password) {
        username.value = account.username;
        password.value = account.password;
        clearAuth();
        announce(`${account.username} filled. Submit when ready.`);
      }
    }));
    document.querySelectorAll("[data-service]").forEach((button) => button.addEventListener("click", () => {
      activeTransaction = null;
      navigate(`#/transaction/${button.dataset.service}`);
    }));
    const vinInput = document.getElementById("vin");
    const vinLookup = document.getElementById("vin-lookup");
    if (vinInput && vinLookup) vinInput.addEventListener("input", () => { vinLookup.innerHTML = vinLookupPanel(vinInput.value); });
    document.querySelectorAll("[data-fill-vin]").forEach((button) => button.addEventListener("click", () => {
      if (!vinInput || !vinLookup) return;
      vinInput.value = button.dataset.fillVin;
      vinLookup.innerHTML = vinLookupPanel(vinInput.value);
    }));
    document.querySelectorAll("form").forEach((form) => form.addEventListener("submit", (event) => {
      event.preventDefault();
      const action = form.dataset.action;
      if (action === "login") handleLogin(form);
      if (action === "code") handleCode(form);
      if (action === "notice-sale") submitNoticeOfSale(form);
      if (action === "licence-renew") handleLicenceRenew(form);
      if (action === "simple-flow") handleSimpleFlow(form);
      if (action === "change-address") handleChangeAddress(form);
      if (action === "pay-fines") handlePayFines(form);
      if (action === "vehicle-simple") handleVehicleSimple(form);
      if (action === "title-new") handleTitleNew(form);
      if (action === "title-pay") handleTitlePay(form);
      if (action === "cancel-nos") handleCancelNos(form);
      if (action === "temporary-permit") handleTemporaryPermit(form);
      if (action === "search") announce("Search is decorative in this demo.");
    }));
    const actions = {
      reset: resetState,
      "sign-out": () => { clearAuth(); navigate("#/"); announce("Signed out."); },
      "toggle-password": () => {
        const input = document.getElementById("password");
        const button = document.querySelector("[data-action='toggle-password']");
        if (!input || !button) return;
        input.type = input.type === "password" ? "text" : "password";
        button.textContent = input.type === "password" ? "Show" : "Hide";
      },
      resend: () => { app.innerHTML = verifyScreen("", "A new simulated code is displayed below."); bindEvents(); },
      "back-login": () => { clearAuth(); navigate("#/login"); },
      "start-photo": startPhotoSimulation,
      "cancel-photo": () => { clearAuth(); navigate("#/login"); },
      "grant-access": () => { auth.stage = "complete"; navigate("#/dashboard"); },
      "try-photo-again": () => { auth.stage = "photo"; auth.photo = false; navigate("#/photo"); },
      "another-account": () => { clearAuth(); navigate("#/login"); },
      assisted: () => {
        state.assistance.push({ username: auth.username, ref: ref("NVD-AST"), status: "Pending assisted verification" });
        saveState();
        render();
      },
      "transaction-next": handleTransactionNext,
      "transaction-back": () => { activeTransaction.step = Math.max(1, activeTransaction.step - 1); render(); },
      "submit-request": submitRequest,
      "close-nos": () => { activeNoticeVehicleId = null; render(); },
    };
    document.querySelectorAll("[data-action]").forEach((button) => {
      const handler = actions[button.dataset.action];
      if (handler) button.addEventListener("click", handler);
    });
    document.querySelectorAll("[data-open-nos]").forEach((button) => button.addEventListener("click", () => {
      activeNoticeVehicleId = button.dataset.openNos;
      render();
    }));
    document.querySelectorAll("[data-invoice]").forEach((button) => button.addEventListener("click", () => {
      const tx = titleTransactions().find((item) => item.id === button.dataset.invoice);
      if (tx && tx.status === "Awaiting invoice") {
        tx.status = "Invoice received";
        addHistory(`Invoice received - ${tx.vehicle}`, "Ready for payment");
        addEmail("Vehicle title invoice received", `A fictional invoice for VIN ${tx.vin} is ready for payment.`, "Demo invoice");
        saveState();
        announce("Invoice simulated and moved to pending transaction list.");
        render();
      }
    }));
  }
})();
