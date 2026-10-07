'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = n => n.toLocaleString('es-CO', { maximumFractionDigits: 1 });

/* ---- Valores de ejemplo: cámbialos por los de tu prototipo ---- */
const SIM = { wp: 100, pr: 0.8, eta: 0.85, bankWh: 1200, floor: 50 };
const CALC = { pr: 0.7, eta: 0.85 };

/* ---- Modo curioso / técnico ---- */
const btn = $('#levelBtn');
function setLevel(tech) {
  document.body.dataset.level = tech ? 'tech' : 'general';
  btn.setAttribute('aria-pressed', tech);
  btn.textContent = tech ? 'Ocultar detalle técnico' : 'Ver detalle técnico';
  try { localStorage.setItem('sos-tech', tech ? '1' : '0'); } catch (e) {}
}
btn.addEventListener('click', () => setLevel(btn.getAttribute('aria-pressed') !== 'true'));
try { if (localStorage.getItem('sos-tech') === '1') setLevel(true); } catch (e) {}

/* ---- Simulador de flujo de energía ---- */
function flow(id, i) {
  const el = $(id);
  el.style.setProperty('--o', (0.15 + 0.85 * i).toFixed(2));
  el.style.setProperty('--t', (1.8 - 1.4 * i).toFixed(2) + 's');
}
function simulate() {
  const h = +$('#hour').value, cloud = +$('#cloud').value, soc = +$('#soc').value, load = +$('#load').value;
  const irr = Math.max(0, Math.sin(Math.PI * (h - 6) / 12));
  const pgen = SIM.wp * irr * (1 - 0.75 * cloud / 100) * SIM.pr;
  const pin = load / SIM.eta;
  const net = pgen - pin;
  const cutoff = net < 0 && soc <= SIM.floor;

  $('#vHour').textContent = `${Math.floor(h)}:${h % 1 ? '30' : '00'}`;
  $('#vCloud').textContent = cloud + ' %';
  $('#vSoc').textContent = soc + ' %';
  $('#oPanel').textContent = Math.round(pgen) + ' W';
  $('#oSoc').textContent = soc + ' %';
  $('#oLoad').textContent = cutoff ? 'Desconectada' : load + ' W';
  $('#bFill').style.width = soc + '%';
  $('#bFill').style.background = soc <= SIM.floor ? 'var(--warn)' : 'var(--leaf)';

  const iGen = Math.min(1, pgen / SIM.wp), iLoad = cutoff ? 0 : Math.min(1, load / 150);
  flow('#l1', iGen); flow('#l2', iGen); flow('#l3', iLoad); flow('#l4', iLoad);

  let msg, bad = false;
  if (cutoff) {
    bad = true;
    msg = `⛔ La batería llegó a su límite de descarga (${SIM.floor} %). El sistema desconecta la carga para proteger la batería.`;
  } else if (net >= 0) {
    msg = soc >= 100
      ? '☀️ El sol cubre la carga y la batería está llena.'
      : `☀️ El sol cubre la carga y sobran unos ${Math.round(net)} W que van a la batería.`;
  } else {
    const hrs = SIM.bankWh * (soc - SIM.floor) / 100 / -net;
    msg = pgen < 1
      ? `🌙 No hay sol. La batería alimenta la carga y dura unas ${fmt(hrs)} horas con este nivel.`
      : `🔋 El sol no alcanza, así que la batería cubre lo que falta. Dura unas ${fmt(hrs)} horas.`;
  }
  const s = $('#status');
  s.textContent = msg;
  s.classList.toggle('bad', bad);
}
$$('#simulador input, #simulador select').forEach(e => e.addEventListener('input', simulate));
simulate();

/* ---- Calculadora de autonomía ---- */
function calculate() {
  const f = new FormData($('#calc'));
  const [wp, hsp, ah, v, dod, w] = ['wp', 'hsp', 'ah', 'v', 'dod', 'w'].map(k => +f.get(k));
  if ([wp, hsp, ah, v, dod, w].some(x => !(x > 0))) return;
  const gen = wp * hsp * CALC.pr;
  const util = v * ah * dod / 100;
  $('#rGen').textContent = fmt(gen);
  $('#rUtil').textContent = fmt(util);
  $('#rAut').textContent = fmt(util * CALC.eta / w);
  $('#rRec').textContent = fmt(util / gen);
}
$('#calc').addEventListener('input', calculate);
calculate();

/* ---- Pestañas de evidencias ---- */
const tabs = $$('[role=tab]');
function openTab(i) {
  tabs.forEach((t, k) => {
    t.setAttribute('aria-selected', k === i);
    t.tabIndex = k === i ? 0 : -1;
    $('#' + t.getAttribute('aria-controls')).hidden = k !== i;
  });
  tabs[i].focus();
}
tabs.forEach((t, i) => {
  t.tabIndex = i ? -1 : 0;
  t.addEventListener('click', () => openTab(i));
  t.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') openTab((i + 1) % tabs.length);
    if (e.key === 'ArrowLeft') openTab((i - 1 + tabs.length) % tabs.length);
  });
});

/* ---- Buscador del glosario ---- */
$('#gSearch').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  let n = 0;
  $$('#gList details').forEach(d => {
    const show = d.textContent.toLowerCase().includes(q);
    d.hidden = !show;
    if (q && show) d.open = true;
    n += show;
  });
  $('#gEmpty').hidden = n > 0;
});
