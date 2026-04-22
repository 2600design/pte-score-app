Pages['privacy'] = function() {
  $('#page-container').innerHTML = `
<div class="page-header">
  <h1>Privacy Policy</h1>
  <p>Last updated: April 22, 2026</p>
</div>

<div class="card" style="max-width:800px">
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">PTE Score ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our app and website.</p>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Information We Collect</div>
  <ul style="font-size:14px;line-height:1.7;color:var(--text-light);padding-left:20px">
    <li><strong>Account information:</strong> Name and email address when you create an account or sign in (including via Apple or Google).</li>
    <li><strong>Practice data:</strong> Your answers, scores, and progress within the app.</li>
    <li><strong>Audio recordings:</strong> Voice recordings created during practice may be stored locally on your device. If you are logged into an account, recordings may also be securely stored on our servers to enable playback and review of your past practice sessions. These recordings are only accessible to you.</li>
    <li><strong>Device information:</strong> Basic technical data (such as device type and browser) required to operate and improve the app.</li>
  </ul>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">How We Use Your Information</div>
  <ul style="font-size:14px;line-height:1.7;color:var(--text-light);padding-left:20px">
    <li>To provide and maintain core app functionality.</li>
    <li>To allow you to track and review your learning progress.</li>
    <li>To store and display your practice history, including recordings.</li>
    <li>To respond to support requests or account-related communication.</li>
  </ul>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Data Storage</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">Your data may be stored securely using infrastructure providers such as Supabase. Audio recordings are stored only to support your personal practice features (such as playback and history) and are not used for advertising, profiling, or training external AI models.</p>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Third-Party Services</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">We use limited third-party services to operate the app, including Supabase for authentication and database, and Google Cloud for speech processing if applicable.</p>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Data Sharing</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">We do not sell, rent, or trade your personal information. We only share data with service providers as necessary to operate the app or when required by law.</p>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Your Rights</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">You may access, update, or delete your personal data at any time. You can delete your account directly within the app. When your account is deleted, your associated personal data, including recordings, will be removed from our systems within a reasonable timeframe. You may also delete your stored recordings within the app.</p>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Login Services</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">If you sign in using a third-party login provider (such as Apple or Google), we only access basic account information (such as your name and email address) required for authentication. We do not track your activity across other apps or services.</p>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Children's Privacy</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">This app is not intended for children under the age of 13. We do not knowingly collect personal data from children.</p>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Changes to This Policy</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">We may update this Privacy Policy from time to time. Updates will be reflected by revising the "Last updated" date above.</p>

  <div class="card-title" style="margin-top:24px;margin-bottom:10px">Contact Us</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light)">If you have any questions, please contact us at:<br><a href="mailto:2600design@gmail.com" style="color:var(--primary);font-weight:700">2600design@gmail.com</a></p>
</div>`;
};
