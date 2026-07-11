/**
 * ArogyaAI Science Society — Website form handler
 *
 * REQUIRED DEPLOY SETTINGS:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * AFTER PASTING: Save → Deploy → Manage deployments → Edit → New version → Deploy
 * THEN RUN ONCE: authorizeAndTestEmail()  ← grants Gmail/Mail permission & sends test email
 *
 * Verify deploy: open Web app URL — should say "v4-email-active"
 */

const SCRIPT_VERSION = 'v5-web-app-email';
const NOTIFY_EMAIL = 'arogyaaisciencesociety@gmail.com';
const SITE_NAME = 'ArogyaAI Science Society Website';

function formatTimestamp_(date) {
  const tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
  return Utilities.formatDate(date, tz, 'yyyy-MM-dd HH:mm:ss z');
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function logEmailEvent_(status, formType, subject, errorMsg) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('EmailLog');
    if (!sheet) {
      sheet = ss.insertSheet('EmailLog');
      sheet.appendRow(['Timestamp', 'Status', 'Form Type', 'Subject', 'Error']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    sheet.appendRow([new Date(), status, formType, subject, errorMsg || '']);
  } catch (e) {
    Logger.log('EmailLog write failed: ' + e);
  }
}

function sendNotificationEmail_(subject, plainBody, replyTo) {
  const mailOptions = {
    to: NOTIFY_EMAIL,
    subject: subject,
    body: plainBody,
    name: SITE_NAME,
  };

  if (isValidEmail_(replyTo)) {
    mailOptions.replyTo = String(replyTo).trim();
  }

  // MailApp only needs script.send_mail permission (simpler to authorize)
  MailApp.sendEmail(mailOptions);
}

function getExecutionInfo_() {
  var effective = '';
  var active = '';
  try {
    effective = Session.getEffectiveUser().getEmail() || '(none)';
  } catch (e) {
    effective = 'unknown';
  }
  try {
    active = Session.getActiveUser().getEmail() || '(anonymous visitor)';
  } catch (e) {
    active = 'unknown';
  }
  return { effectiveUser: effective, activeUser: active };
}

function safeSendEmail_(formType, subject, plainBody, replyTo) {
  try {
    sendNotificationEmail_(subject, plainBody, replyTo);
    logEmailEvent_('sent', formType, subject, '');
    return { sent: true, error: '' };
  } catch (err) {
    var message = err && err.toString ? err.toString() : String(err);
    Logger.log('Email send failed (' + formType + '): ' + message);

    // Some web-app contexts reject replyTo; retry without it.
    if (replyTo) {
      try {
        sendNotificationEmail_(subject, plainBody, '');
        logEmailEvent_('sent', formType, subject, 'sent without replyTo after: ' + message);
        return { sent: true, error: '' };
      } catch (retryErr) {
        message = retryErr && retryErr.toString ? retryErr.toString() : String(retryErr);
      }
    }

    var execInfo = getExecutionInfo_();
    var hint =
      ' Deploy must use Execute as: Me (not User accessing). ' +
      'Effective user: ' + execInfo.effectiveUser + '. ' +
      'Run authorizeAndTestEmail() once, then redeploy.';
    logEmailEvent_('failed', formType, subject, message + hint);
    return { sent: false, error: message + hint };
  }
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing POST body');
  }
  return JSON.parse(e.postData.contents);
}

function doPost(e) {
  try {
    const data = parseBody_(e);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var emailResult = { sent: false, error: '' };

    if (data.type === 'newsletter') {
      const sheet = ss.getSheetByName('Newsletter') || ss.insertSheet('Newsletter');
      const timestamp = new Date();
      const subscriberEmail = data.email || '';

      sheet.appendRow([
        timestamp,
        subscriberEmail,
        data.source || 'website',
      ]);

      const timeLabel = formatTimestamp_(timestamp);
      const source = data.source || 'website';
      const displayEmail = subscriberEmail || '(not provided)';

      const plainBody =
        'Notification from the ArogyaAI Science Society website\n\n' +
        displayEmail + ' signed up for your newsletter.\n\n' +
        'Email: ' + displayEmail + '\n' +
        'Time: ' + timeLabel + '\n' +
        'Source: ' + source + '\n\n' +
        'Saved to Google Sheet: Newsletter';

      emailResult = safeSendEmail_(
        'newsletter',
        'ArogyaAI Website: ' + displayEmail + ' signed up for the newsletter',
        plainBody,
        subscriberEmail
      );

      return json({
        success: true,
        emailSent: emailResult.sent,
        emailError: emailResult.error || '',
        version: SCRIPT_VERSION,
      });
    }

    if (data.type === 'contact') {
      const sheet = ss.getSheetByName('ContactMessages') || ss.insertSheet('ContactMessages');
      const timestamp = new Date();

      sheet.appendRow([
        timestamp,
        data.name,
        data.email,
        data.subject,
        data.message,
        data.source || 'contact_page',
      ]);

      const name = data.name || 'Someone';
      const senderEmail = data.email || '(no email provided)';
      const subjectLine = data.subject || '(no subject)';
      const message = data.message || '(empty message)';
      const timeLabel = formatTimestamp_(timestamp);
      const source = data.source || 'contact_page';

      const plainBody =
        'Notification from the ArogyaAI Science Society website\n\n' +
        senderEmail + ' said:\n\n' +
        '"' + message + '"\n\n' +
        'Name: ' + name + '\n' +
        'Email: ' + senderEmail + '\n' +
        'Subject: ' + subjectLine + '\n' +
        'Time: ' + timeLabel + '\n' +
        'Source: ' + source + '\n\n' +
        'Reply to this email to respond directly to ' + senderEmail + '.\n\n' +
        'Saved to Google Sheet: ContactMessages';

      emailResult = safeSendEmail_(
        'contact',
        'ArogyaAI Website: ' + senderEmail + ' said — ' + subjectLine,
        plainBody,
        data.email
      );

      return json({
        success: true,
        emailSent: emailResult.sent,
        emailError: emailResult.error || '',
        version: SCRIPT_VERSION,
      });
    }

    return json({ success: false, error: 'Unknown form type' });
  } catch (err) {
    return json({ success: false, error: err.toString(), version: SCRIPT_VERSION });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var quota = '';
  try {
    quota = ' MailApp quota remaining: ' + MailApp.getRemainingDailyQuota() + '.';
  } catch (e) {
    quota = ' MailApp not authorized yet — run authorizeAndTestEmail().';
  }

  var execInfo = getExecutionInfo_();

  return ContentService.createTextOutput(
    SCRIPT_VERSION +
      ' — ArogyaAI form handler is running.' +
      quota +
      ' Deploy: Execute as Me | Anyone.' +
      ' Effective user: ' + execInfo.effectiveUser + '.'
  );
}

/**
 * RUN THIS ONCE in the Apps Script editor (▶ Run).
 * Approves Gmail + Mail permissions and sends a test email to NOTIFY_EMAIL.
 */
function authorizeAndTestEmail() {
  const subject = 'ArogyaAI test — email is working';
  const body =
    'If you received this, automated emails from your website forms are configured correctly.\n\n' +
    'Script version: ' + SCRIPT_VERSION + '\n' +
    'Time: ' + formatTimestamp_(new Date());

  sendNotificationEmail_(subject, body, '');
  logEmailEvent_('sent', 'test', subject, '');
  Logger.log('Test email sent to ' + NOTIFY_EMAIL);
}

function testNewsletterNotification() {
  doPost({
    postData: {
      contents: JSON.stringify({
        type: 'newsletter',
        email: 'newsletter-test@example.com',
        source: 'manual-test',
      }),
    },
  });
}

function testContactNotification() {
  doPost({
    postData: {
      contents: JSON.stringify({
        type: 'contact',
        name: 'Test User',
        email: 'contact-test@example.com',
        subject: 'Test contact message',
        message: 'This is a test contact message from the website.',
        source: 'manual-test',
      }),
    },
  });
}
