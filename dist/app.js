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
        { id: "veh-1", year: "2021", make: "Subaru", model: "Forester", plate: "NVD 214", permit: "VP-903124" },
        { id: "veh-2", year: "2018", make: "Toyota", model: "Tacoma", plate: "NVD 588", permit: "VP-665930" },
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
        { id: "veh-3", year: "2020", make: "Honda", model: "Civic", plate: "NVD 932", permit: "VP-318872" },
      ],
      history: [{ ref: "NVD-REQ-09918", service: "Vehicle permit replacement", status: "Complete", date: "23 Apr 2026" }],
    },
  };

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
      };
    } catch {
      return { requests: {}, assistance: [] };
    }
  }

  function saveState() {
    localStorage.setItem(storeKey, JSON.stringify(state));
  }

  function resetState() {
    auth = { stage: "public", username: null, twoStep: false, photo: false };
    state.requests = {};
    state.assistance = [];
    saveState();
    activeTransaction = null;
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
          <h3>${account.outcome === "pass" ? "Passing profile" : "Failing profile"}</h3>
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
            <section class="record-card">
              <h2>Driving licence summary</h2>
              <dl>
                <dt>Licence</dt><dd>${p.licence.number}</dd>
                <dt>Class</dt><dd>${p.licence.class}</dd>
                <dt>Status</dt><dd>${p.licence.status}</dd>
                <dt>Expiry</dt><dd>${p.licence.expiry}</dd>
              </dl>
            </section>
            <section class="record-card">
              <h2>Registered vehicles</h2>
              <ul class="summary-list">${p.vehicles.map(vehicleSummary).join("")}</ul>
            </section>
            <section class="record-card">
              <h2>Service actions</h2>
              <div class="actions">
                <button class="primary-button" data-service="licence">Replace driving licence</button>
                <button class="primary-button" data-service="ownership">Replace vehicle ownership certificate</button>
                <button class="primary-button" data-service="permit">Replace vehicle permit</button>
              </div>
            </section>
            <section class="record-card">
              <h2>Request history</h2>
              ${historyList(p)}
            </section>
          </div>
        </div>
      </div>
    `);
  }

  function vehicleSummary(v) {
    return `<li class="history-item"><strong>${v.year} ${v.make} ${v.model}</strong><br />Plate ${v.plate}; permit ${v.permit}</li>`;
  }

  function historyList(p) {
    const userRequests = state.requests[p.username] || [];
    const history = [...userRequests, ...p.history];
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
    document.querySelectorAll("form").forEach((form) => form.addEventListener("submit", (event) => {
      event.preventDefault();
      const action = form.dataset.action;
      if (action === "login") handleLogin(form);
      if (action === "code") handleCode(form);
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
    };
    document.querySelectorAll("[data-action]").forEach((button) => {
      const handler = actions[button.dataset.action];
      if (handler) button.addEventListener("click", handler);
    });
  }
})();
