Pages['support'] = function() {
  $('#page-container').innerHTML = `
<div class="page-header">
  <h1>Support</h1>
  <p>Need help? Contact support for account, login, profile, or technical issues.</p>
</div>

<div class="card" style="max-width:760px">
  <div class="card-title" style="margin-bottom:10px">Contact</div>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light);margin-bottom:14px">
    Email:
    <a href="mailto:support.ptescore@gmail.com" style="color:var(--primary);font-weight:700">support.ptescore@gmail.com</a>
  </p>
  <p style="font-size:14px;line-height:1.7;color:var(--text-light);margin-bottom:18px">
    I aim to respond within 2-3 business days.
  </p>

  <div class="card-title" style="margin-bottom:10px">FAQ</div>
  <div style="display:grid;gap:14px;font-size:14px;line-height:1.6;color:var(--text)">
    <div><strong>1. How do I sign in or reset my password?</strong><br><span style="color:var(--text-light)">Use the "Forgot Password" option on the login page and follow the instructions sent to your email.</span></div>
    <div><strong>2. How do I update my profile picture?</strong><br><span style="color:var(--text-light)">Profile picture upload is not currently supported in the app.</span></div>
    <div><strong>3. How do I delete my account?</strong><br><span style="color:var(--text-light)">Go to Profile and select "Delete Account". Follow the confirmation steps to permanently delete your account.</span></div>
    <div><strong>4. What should I do if audio recording or scoring does not work?</strong><br><span style="color:var(--text-light)">Please make sure microphone permission is enabled in your device settings.<br>If the issue continues, try restarting the app.<br>You can also contact support with your device model and issue details for further assistance.</span></div>
  </div>
</div>`;
};
