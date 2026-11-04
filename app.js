/* Art of Flying — scripts du site (aucune dépendance) */
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
/* Cadre photo : affiche images/<file> si la photo existe, sinon un cadre "plan" étiqueté */
var EXPO_IMAGES={"expo-machines-volantes.jpg": "assets/4ba52a9ae00e7670bf22.jpg", "expo-passarola.jpg": "assets/61144c6ec49ecfc06718.jpg", "expo-acqua-amore.jpg": "assets/f85b514f0f663b6b84d9.jpg"};
function photo(file,label,alt,ratio){
 var src=EXPO_IMAGES[file];
 if(!src)return '';
 return '<div class="ph" style="aspect-ratio:'+(ratio||'4 / 3')+'"><img src="'+esc(src)+'" alt="'+esc(alt)+'" loading="lazy"></div>';
}

function fig(i) { return (i < 9 ? '0' : '') + (i + 1); }
function collectionOf(id) { return COLLECTIONS.filter(function (c) { return c.id === id; })[0] || COLLECTIONS[0]; }
function card(w, i) {
 return '<a class="card" href="'+esc(w.href)+'"><div class="ph"><img src="'+esc(w.image)+'" alt="'+esc(w.title)+'" loading="lazy"></div><span class="card-title"><strong>'+esc(w.title)+'</strong><span class="caption">FIG. '+fig(i)+'</span></span><span class="caption">'+esc(collectionOf(w.collection).label)+'</span></a>';
}

(function () {
  var qs = new URLSearchParams(location.search);

  /* Accueil */
  var home = document.getElementById('home-works');
  if (home) {
    home.innerHTML = CATALOG.filter(function (w) { return w.home; }).map(card).join('');
  }

  /* Œuvres : collections + grille / index */
  var grid = document.getElementById('works');
  if (grid) {
    var st = { col: qs.get('collection') || 'machines', view: 'grid' };
    var tabs = document.getElementById('col-tabs');
    function render() {
      tabs.innerHTML = COLLECTIONS.map(function (c) {
        var n = CATALOG.filter(function (w) { return w.collection === c.id; }).length;
        return '<button type="button" class="col-tab" data-col="' + c.id + '" aria-pressed="' + (c.id === st.col) + '" style="min-height:44px;padding:0;border:0;background:transparent;cursor:pointer;font:inherit;color:inherit;text-underline-offset:6px;text-decoration-thickness:2px;text-decoration:' + (c.id === st.col ? 'underline' : 'none') + '">' + esc(c.label) + ' <span class="muted">(' + n + ')</span></button>';
      }).join('');
      var items = CATALOG.filter(function (w) { return w.collection === st.col; });
      if (st.view === 'grid') {
        grid.className = 'grid';
        grid.innerHTML = items.map(card).join('') || '<p class="lead">Cette collection sera bientôt en ligne.</p>';
      } else {
        grid.className = '';
        grid.innerHTML = '<ul class="index">' + items.map(function (w, i) {
          return '<li><a href="' + esc(w.href) + '"><span class="caption" style="flex:0 0 72px;font-size:13px">FIG. ' + fig(i) + '</span><span class="t">' + esc(w.title) + '</span><span class="caption" style="font-size:13px">' + esc(collectionOf(w.collection).kind) + '</span><span aria-hidden="true" class="mono">→</span></a></li>';
        }).join('') + '</ul>';
      }
      document.getElementById('v-grid').setAttribute('aria-pressed', st.view === 'grid');
      document.getElementById('v-list').setAttribute('aria-pressed', st.view === 'list');
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('[data-col]'); if (b) { st.col = b.dataset.col; render(); } });
    document.getElementById('v-grid').addEventListener('click', function () { st.view = 'grid'; render(); });
    document.getElementById('v-list').addEventListener('click', function () { st.view = 'list'; render(); });
    render();
  }

  /* Fiche d'une œuvre : oeuvre.html?id=... */
  var one = document.getElementById('oeuvre');
  if (one) { var target=CATALOG.find(function(x){return x.id===qs.get('id');})||CATALOG[0]; location.replace(target.href); return;
    var w = CATALOG.filter(function (x) { return x.id === qs.get('id'); })[0] || CATALOG[0];
    var col = collectionOf(w.collection);
    var siblings = CATALOG.filter(function (x) { return x.collection === w.collection; });
    var idx = siblings.indexOf(w);
    document.title = w.title + ' — Art of Flying';
    document.getElementById('o-eyebrow').textContent = 'FIG. ' + fig(idx) + ' — ' + col.label;
    document.getElementById('o-title').textContent = w.title;
    document.getElementById('o-col').textContent = col.label;
    document.getElementById('o-mat').textContent = w.materials;
    document.getElementById('o-size').textContent = w.size;
    document.getElementById('o-year').textContent = w.year;
    document.getElementById('o-status').textContent = w.status;
    document.getElementById('o-ask').href = 'contact.html?topic=achat&oeuvre=' + encodeURIComponent(w.title);
    var views = [
      { id: 'photo', label: 'Photo', file: w.id + '.jpg', tag: 'PHOTO DE LA MACHINE' },
      { id: 'plan', label: 'Plan', file: w.id + '-plan.jpg', tag: 'PLAN / ESQUISSE' },
      { id: 'detail', label: 'Détail', file: w.id + '-detail.jpg', tag: 'PHOTO DE DÉTAIL' }
    ];
    var media = document.getElementById('o-media');
    var vbtns = document.getElementById('o-views');
    function show(v) {
      media.innerHTML = photo(v.file, v.tag, w.title + ' — ' + v.label);
      vbtns.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === v.id); });
    }
    vbtns.innerHTML = views.map(function (v) { return '<button type="button" class="toggle" data-v="' + v.id + '">' + v.label + '</button>'; }).join('');
    vbtns.addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (b) show(views.filter(function (v) { return v.id === b.dataset.v; })[0]); });
    show(views[0]);
    var others = siblings.filter(function (x) { return x !== w; }).slice(0, 4);
    document.getElementById('o-others').innerHTML = others.map(function (x) { return card(x, siblings.indexOf(x)); }).join('');
  }

  /* Expositions : onglets */
  var expo = document.getElementById('expo-panel');
  if (expo) {
    var list = document.getElementById('expo-tabs');
    function showExpo(id) {
      var e = EXHIBITIONS.filter(function (x) { return x.id === id; })[0] || EXHIBITIONS[0];
      list.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', t.dataset.id === e.id); });
      expo.innerHTML = photo('expo-' + e.id + '.jpg', "VUE D'EXPOSITION", e.title, '16 / 9') +
        '<h2 class="h2" style="font-weight:800;font-size:56px;letter-spacing:-0.03em">' + esc(e.title) + '</h2>' +
        '<p class="lead" style="max-width:680px">' + esc(e.text) + '</p>' +
        '<dl class="specs" style="grid-template-columns:180px 1fr;border-top:1px solid var(--line)">' +
        '<dt>Contenu</dt><dd>' + esc(e.content.startsWith('[') ? 'Sélection à définir avec les artistes' : e.content) + '</dd><dt>En option</dt><dd>' + esc(e.options.startsWith('[') ? 'À définir avec les artistes' : e.options) + '</dd>' +
        '<dt>Surface</dt><dd>' + esc(e.surface.startsWith('[') ? 'Selon le lieu et la sélection' : e.surface) + '</dd><dt>Conditions</dt><dd>' + esc(e.conditions.startsWith('[') ? 'Sur demande auprès des artistes' : e.conditions) + '</dd>' +
        '<dt>Déjà présentée</dt><dd>' + esc(e.past.replace(/\s*·?\s*\[[^\]]+\]/g,'')) + '</dd></dl>' +
        '<div style="display:flex;flex-wrap:wrap;gap:12px"><a class="btn btn-accent" href="contact.html?topic=expo&expo=' + encodeURIComponent(e.title) + '">Échanger sur cette exposition →</a>' +
        '<a class="btn" href="expositions-contenus.html">Documents & vues d’exposition →</a></div>';
    }
    list.innerHTML = EXHIBITIONS.map(function (e, i) {
      return '<button type="button" role="tab" class="tab" data-id="' + e.id + '"><small>0' + (i + 1) + ' · ' + esc(e.kind) + '</small><span>' + esc(e.title) + '</span></button>';
    }).join('');
    list.addEventListener('click', function (ev) { var t = ev.target.closest('.tab'); if (t) showExpo(t.dataset.id); });
    showExpo(qs.get('id'));
  }

  /* Contact : choix du motif */
  var topics = document.getElementById('topics');
  if (topics) {
    var topicField = document.getElementById('c-topic');
    var expoFields = document.getElementById('expo-fields');
    function setTopic(t) {
      topicField.value = t;
      topics.querySelectorAll('button').forEach(function (b) {
        var on = b.dataset.t === t;
        b.setAttribute('aria-pressed', on);
        b.style.background = on ? 'var(--accent)' : '#FFFFFF';
        b.style.color = 'var(--ink)';
      });
      expoFields.style.display = t === 'expo' ? 'grid' : 'none';
    }
    topics.addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) setTopic(b.dataset.t); });
    setTopic(qs.get('topic') || 'expo');
    var pre = qs.get('oeuvre') || qs.get('expo');
    if (pre) document.getElementById('c-message').value = 'À propos de : ' + pre + '\n\n';
  }
})();
