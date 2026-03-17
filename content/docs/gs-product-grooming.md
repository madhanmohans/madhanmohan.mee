Meeting Summary:

1. Internal Transfer Visibility and UETR:
   - Confirmation that internal transfers initiated via SFTP are visible and show credit of banks with pick.
   - UETR will be shown as a dash for internal transfers since it's non-cross-border.
   - Payment type for internal transfers will be consistently shown as "internal transfer" across UI and payment confirmations.
   - Existing footer templates from wire payments will be referenced for consistency.

2. Payment Confirmation and Additional Payment Details:
   - Existing logic for additional payment details to prevail; all captured information during payment initiation (not just remittance) should be shown.
   - No changes needed to how additional payment details are handled.
   - A note to remove the specific "remittance information" field and rely on the current extensive list of fields shown.
   - Action: Speaker to check older reference materials with Abba for details on fields shown in payment confirmation.

3. Estimates and Backend Implications:
   - Proposed effort estimated at two story points for Frank and Nishita.
   - No backend changes anticipated since the fees and payment types are already exposed in the UI.

4. Normalize Effects Initiative and Payment Types:
   - Discussion on impacts of normalize effects initiative on SFTP and API initiated payments, especially with approval flows.
   - Agreement to introduce a new payment type "cross-border ACH" for FPS and RMS to support correct filtering and task view displays.
   - Payment type will be identified by channels using validation services and propagated to RMS for correct tagging.
   - FPS filters and RMS will rely on validation services to determine payment type consistently across channels.
   - Action: Team to coordinate with Pratap to clarify how payment types are propagated, and ensure FPS can identify cross-border ACH.
   - Action: Three members (unspecified) to discuss further with Pratap for alignment on validation services.

5. Clarifications and Next Steps:
   - Consensus that payment type for cross-border ACH payments will be explicitly sent and handled.
   - Need to confirm how existing payments initiated via API and SFTP are filtered historically and going forward.
   - Some participants to connect separately offline (Rich and others) for detailed follow-up.

Action Items:
- Attach relevant snippets and evidence for internal transfer visibility in SFTP (Responsible: Speaker who mentioned attachment).
- Remove "remittance information" field and uphold existing logic for additional payment details display (Responsible: Speaker confirming this action).
- Retrieve and review older stories or references for fields displayed in payment confirmation from Abba or previous stories (Responsible: Speaker interested in digging through stories).
- Provide estimates of two story points for Frank and Nishita on these payment confirmation and display changes (Responsible: Speaker who provided estimates).
- Setup discussion with Pratap regarding validation services and payment type propagation to FPS and RMS (Responsible: Relevant team members including Speaker, Vinayak, and Rich).
- Follow up offline on detailed filtering of existing payments initiated via API/SFTP (Responsible: Rich and others).