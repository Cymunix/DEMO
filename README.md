# NORDVIK Identity RMV Demo

This is a static, fictional identity demonstration for RMV-style online services.

Run locally by serving the `dist` directory:

```powershell
npx serve dist
```

Demo accounts:

- Passing: `demo.pass` / `DemoPass123!` / `123456`
- Failing: `demo.fail` / `DemoFail123!` / `123456`

What is simulated:

- Two-step delivery is simulated and the demo code is displayed on screen.
- Live photo recognition is an animated deterministic simulation with fictional portraits.
- Payment, records, requests and assisted verification are fictional.
- Medical-question answers route to either demo completion or simulated assisted review; they are not stored in request history.
- The “70 typed” marker is a fictional restriction that blocks online plate or temporary plate issuance and prompts Access Nova Scotia handling.
- Title transactions use a VIN plus ownership-cycle identifier to prevent duplicate demo submissions until a later ownership cycle.
- Safety-inspection timing, invoices, emails, documents and temporary permits are demonstration-only behaviours.
- No real government APIs, RMV records, camera capture, biometrics, email, SMS, banking details or document issuance are used.

Integration notes for a production system:

- Replace the `credentials` fixture and simulated verification flow in `dist/app.js` with a real identity provider and server-side session enforcement.
- Store authentication state server-side with secure, HttpOnly, SameSite cookies and short-lived session tokens.
- Integrate a privacy-reviewed biometric or identity assurance provider only with clear consent, retention limits, audit logging, data minimisation and human review paths.
- Enforce route and transaction access on the backend; the static route protection here is illustrative and not production security.
- Use a certified payment processor and never collect card or banking details directly in this app.
