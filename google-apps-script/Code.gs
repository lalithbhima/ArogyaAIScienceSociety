/**
 * ArogyaAI Science Society — Website form handler
 *
 * REQUIRED DEPLOY SETTINGS:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * AFTER PASTING: Save → Deploy → Manage deployments → Edit → New version → Deploy
 * THEN RUN ONCE: authorizeAndTestEmail()  ← grants Gmail/Mail permission & sends test email
 * OPENROUTER: paste your key in OPENROUTER_API_KEY near the top of this file (line ~20)
 * THEN RUN ONCE: authorizeOpenRouterAccess()  ← grants UrlFetch permission for OpenRouter
 * THEN RUN ONCE: testChatProxy()  ← verify chat works (check Execution log)
 */

const SCRIPT_VERSION = 'v6-chat-proxy';
const NOTIFY_EMAIL = 'arogyaaisciencesociety@gmail.com';
const SITE_NAME = 'ArogyaAI Science Society Website';
const OPENROUTER_MODEL = 'openrouter/free';
const OPENROUTER_SITE_URL = 'https://arogyaai.org';
const OPENROUTER_SITE_NAME = 'ArogyaAI Science Society';

// Paste your OpenRouter API key here (Apps Script only — do NOT put this in the website repo).
// Get a key at: https://openrouter.ai/keys
const OPENROUTER_API_KEY = 'PASTE_YOUR_OPENROUTER_KEY_HERE';

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

function getOpenRouterApiKey_() {
  if (OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'PASTE_YOUR_OPENROUTER_KEY_HERE') {
    return OPENROUTER_API_KEY;
  }
  return PropertiesService.getScriptProperties().getProperty('OPENROUTER_API_KEY') || '';
}

function handleChat_(data) {
  var apiKey = getOpenRouterApiKey_();
  if (!apiKey) {
    return json({
      success: false,
      error: 'OpenRouter API key not configured. Run storeOpenRouterApiKey() in Apps Script once.',
    });
  }

  var messages = data.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return json({ success: false, error: 'Missing chat messages' });
  }

  var payload = {
    model: data.model || OPENROUTER_MODEL,
    messages: messages,
    temperature: 0.4,
    max_tokens: 600,
  };

  var response = UrlFetchApp.fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'HTTP-Referer': OPENROUTER_SITE_URL,
      'X-Title': OPENROUTER_SITE_NAME,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var status = response.getResponseCode();
  var body = response.getContentText();

  if (status !== 200) {
    var errorHint = '';
    if (body.indexOf('script.external_request') !== -1 || body.indexOf('UrlFetchApp') !== -1) {
      errorHint = ' Run authorizeOpenRouterAccess() in Apps Script and approve permissions.';
    }
    return json({
      success: false,
      error: 'OpenRouter error (' + status + '): ' + body + errorHint,
    });
  }

  var parsed = JSON.parse(body);
  var reply =
    parsed &&
    parsed.choices &&
    parsed.choices[0] &&
    parsed.choices[0].message &&
    parsed.choices[0].message.content;

  if (!reply) {
    return json({ success: false, error: 'No response from AI model' });
  }

  return json({ success: true, reply: String(reply).trim(), version: SCRIPT_VERSION });
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

    if (data.type === 'chat') {
      return handleChat_(data);
    }

    return json({ success: false, error: 'Unknown form type' });
  } catch (err) {
    var errMsg = err.toString();
    if (errMsg.indexOf('UrlFetchApp') !== -1 || errMsg.indexOf('external_request') !== -1) {
      return json({
        success: false,
        error: errMsg + ' Run authorizeOpenRouterAccess() in Apps Script and approve permissions.',
        version: SCRIPT_VERSION,
      });
    }
    return json({ success: false, error: errMsg, version: SCRIPT_VERSION });
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

  var chatStatus = getOpenRouterApiKey_() ? ' OpenRouter: configured.' : ' OpenRouter: run storeOpenRouterApiKey().';

  return ContentService.createTextOutput(
    SCRIPT_VERSION +
      ' — ArogyaAI form handler is running.' +
      quota +
      chatStatus +
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

/**
 * RUN ONCE: stores your OpenRouter API key securely in Script Properties.
 * Opens a prompt — paste your key from https://openrouter.ai/keys
 */
function storeOpenRouterApiKey() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    'OpenRouter API Key',
    'Paste your OpenRouter API key (starts with sk-or-v1-). It is stored securely and never sent to browsers.',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  var key = String(response.getResponseText() || '').trim();
  if (!key || key.indexOf('sk-or-v1-') !== 0) {
    throw new Error('Invalid OpenRouter API key. It should start with sk-or-v1-');
  }

  PropertiesService.getScriptProperties().setProperty('OPENROUTER_API_KEY', key);
  ui.alert('OpenRouter API key saved. Redeploy the web app, then test the chatbot on your site.');
}

/**
 * RUN ONCE after pasting your OpenRouter API key.
 * Grants UrlFetchApp permission so the web app can call OpenRouter.
 */
function authorizeOpenRouterAccess() {
  var apiKey = getOpenRouterApiKey_();
  if (!apiKey) {
    throw new Error('Paste your OpenRouter API key in OPENROUTER_API_KEY first, then run this again.');
  }

  var response = UrlFetchApp.fetch('https://openrouter.ai/api/v1/models', {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + apiKey,
    },
    muteHttpExceptions: true,
  });

  Logger.log('OpenRouter connection test — HTTP ' + response.getResponseCode());
  Logger.log('If you see 200 above, chat is authorized. Run testChatProxy() next.');
}

function testChatProxy() {
  var result = handleChat_({
    model: OPENROUTER_MODEL,
    messages: [
      {
        role: 'user',
        content: 'Reply with exactly: Chat proxy is working.',
      },
    ],
  });
  Logger.log(result.getContent());
}
