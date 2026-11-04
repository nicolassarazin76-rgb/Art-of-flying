(function () {
  'use strict';
  var form = document.getElementById('guestbook-form');
  if (!form) return;
  var nameField = document.getElementById('guestbook-name');
  var messageField = document.getElementById('guestbook-message');
  var submit = document.getElementById('guestbook-submit');
  var feedback = document.getElementById('guestbook-feedback');
  var status = document.getElementById('guestbook-service-status');
  var panel = document.getElementById('guestbook-preview-panel');
  var config = window.ART_OF_FLYING_GUESTBOOK || {};
  var endpoint = '';
  if (/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.supabaseUrl || '') &&
      /^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey || '')) {
    endpoint = config.supabaseUrl.replace(/\/$/, '') + '/rest/v1/guestbook_entries';
  }
  function announce(message, error) {
    feedback.textContent = message;
    feedback.setAttribute('role', error ? 'alert' : 'status');
  }
  function validText() {
    nameField.setCustomValidity(nameField.value.trim().length < 2 ? 'Indiquez au moins deux caractères pour votre nom.' : '');
    messageField.setCustomValidity(messageField.value.trim().length < 10 ? 'Écrivez un message d’au moins dix caractères.' : '');
    return nameField.reportValidity() && messageField.reportValidity();
  }
  nameField.addEventListener('input', function () { nameField.setCustomValidity(''); });
  messageField.addEventListener('input', function () {
    messageField.setCustomValidity('');
    document.getElementById('guestbook-count').textContent = messageField.value.length + ' / 2 000 caractères';
  });
  document.getElementById('guestbook-preview').addEventListener('click', function () {
    if (!validText()) return;
    document.getElementById('guestbook-preview-message').textContent = messageField.value.trim();
    document.getElementById('guestbook-preview-author').textContent = nameField.value.trim();
    panel.hidden = false;
    announce('Aperçu affiché. Votre message n’a pas été envoyé.', false);
  });
  function headers() { return { apikey: config.publishableKey, 'Content-Type': 'application/json' }; }
  async function request(url, options) {
    var abort = new AbortController();
    var timer = setTimeout(function () { abort.abort(); }, 15000);
    try { return await fetch(url, Object.assign({}, options, { signal: abort.signal })); }
    finally { clearTimeout(timer); }
  }
  function renderEntry(entry) {
    var article = document.createElement('article');
    article.className = 'guestbook-entry';
    var quote = document.createElement('blockquote');
    quote.textContent = String(entry.message || '');
    var byline = document.createElement('p');
    byline.className = 'caption';
    var date = new Date(entry.created_at);
    byline.textContent = String(entry.author || '') + (Number.isNaN(date.getTime()) ? '' : ' · ' + date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
    article.append(quote, byline);
    return article;
  }
  async function loadMessages() {
    var loadStatus = document.getElementById('guestbook-load-status');
    try {
      var response = await request(endpoint + '?select=id,author,message,created_at&order=created_at.desc&limit=100', { headers: headers(), cache: 'no-store' });
      if (!response.ok) throw new Error('unavailable');
      var entries = await response.json();
      if (!Array.isArray(entries)) throw new Error('invalid');
      document.getElementById('guestbook-new-messages').replaceChildren(...entries.map(renderEntry));
      loadStatus.textContent = '';
      submit.disabled = false;
      status.textContent = 'Les contributions sont ouvertes. Votre message sera visible après validation.';
    } catch (error) {
      submit.disabled = true;
      status.textContent = 'L’envoi est momentanément indisponible. Vous pouvez prévisualiser votre message et réessayer plus tard.';
      loadStatus.textContent = 'Les témoignages déjà recueillis restent consultables ci-dessous.';
    }
  }
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!endpoint) { announce('L’envoi n’est pas encore ouvert. Aucun message n’a été transmis.', true); return; }
    if (!validText() || !form.reportValidity()) return;
    if (document.getElementById('guestbook-website').value) {
      announce('L’envoi n’a pas abouti. Veuillez réessayer.', true); return;
    }
    submit.disabled = true;
    submit.textContent = 'Envoi en cours…';
    announce('', false);
    try {
      var response = await request(endpoint, {
        method: 'POST', headers: Object.assign(headers(), { Prefer: 'return=minimal' }),
        body: JSON.stringify({ author: nameField.value.trim(), message: messageField.value.trim() })
      });
      if (!response.ok) throw new Error('not-saved');
      form.reset();
      panel.hidden = true;
      document.getElementById('guestbook-count').textContent = '0 / 2 000 caractères';
      announce('Merci. Votre message a été reçu et attend la validation des artistes avant publication.', false);
    } catch (error) {
      announce('La réception n’a pas pu être confirmée. Votre texte est conservé dans ce formulaire. Ne le renvoyez pas immédiatement : il a peut-être déjà été reçu.', true);
    } finally {
      submit.disabled = false;
      submit.textContent = 'Soumettre mon message →';
    }
  });
  if (endpoint) loadMessages();
})();
