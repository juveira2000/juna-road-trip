// Juna Road Trip — página: simulador do Trip e entradas das seções. Sem bibliotecas.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- entradas ----------
  var items = document.querySelectorAll('.rise');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- simulador do Trip ----------
  var M = {
    direita:   { ic: 'ic-direita',   start: 300, exit: '',  line: 'chegada 14:32', say: function (d) { return d > 0 ? 'Em ' + d + ' metros, vire à direita.' : 'Vire à direita.'; } },
    rotatoria: { ic: 'ic-rotatoria', start: 400, exit: '2', line: 'chegada 14:32', say: function (d) { return d > 0 ? 'Em ' + d + ' metros, na rotatória, pegue a segunda saída.' : 'Pegue a segunda saída.'; } },
    alerta:    { ic: 'ic-alerta',    start: 200, exit: '',  line: 'lombada',       say: function (d) { return d > 0 ? 'Lombada em ' + d + ' metros.' : 'Lombada.'; } },
    chegada:   { ic: 'ic-chegada',   start: 150, exit: '',  line: 'destino',       say: function (d) { return d > 0 ? 'Em ' + d + ' metros, você chega ao destino.' : 'Você chegou ao destino.'; } }
  };
  var dist = document.getElementById('sim-dist');
  if (!dist) return;
  var unit = document.getElementById('sim-unit');
  var exit = document.getElementById('sim-exit');
  var line = document.getElementById('sim-line');
  var say = document.getElementById('sim-say');
  var chips = document.querySelectorAll('.chip');
  var timer = null;

  function show(name) {
    var m = M[name];
    document.querySelectorAll('.sim__face .ic').forEach(function (g) { g.style.display = g.id === m.ic ? '' : 'none'; });
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.m === name)); });
    exit.textContent = m.exit;
    line.textContent = m.line;
    var d = m.start;
    function paint() {
      dist.textContent = d > 0 ? d : 'agora';
      unit.textContent = d > 0 ? 'm' : '';
    }
    paint();
    say.innerHTML = 'A voz diz: <b>“' + m.say(m.start) + '”</b>';
    clearInterval(timer);
    if (reduce) return;
    timer = setInterval(function () {
      d -= 10;
      if (d <= 0) {
        d = 0; clearInterval(timer);
        say.innerHTML = 'A voz diz: <b>“' + m.say(0) + '”</b>';
      }
      paint();
    }, 110);
  }

  chips.forEach(function (c) { c.addEventListener('click', function () { show(c.dataset.m); }); });
})();
