const alerts = [
  { id: 1, severity: 'red', type: 'ANDON · MATERIALBRIST', title: 'Station 12 behöver skruv M8', detail: 'Beräknas ta slut om 8 minuter', time: '8 min', action: 'Skicka truck', material: 'Skruv M8', assignee: 'Ej tilldelad' },
  { id: 2, severity: 'amber', type: 'VARNING · MATERIAL', title: 'Station 07 behöver kabelstam', detail: 'Beräknas ta slut om 22 minuter', time: '22 min', action: 'Prioritera', material: 'Kabelstam A14', assignee: 'Truck 3 är närmast' },
  { id: 3, severity: 'amber', type: 'VARNING · TAKT', title: 'Station 16 tappar takt', detail: 'Momentet är 18 % långsammare än normalt', time: '15 min', action: 'Kalla på hjälp', material: 'Monteringsmoment', assignee: 'Lagledare rekommenderas' }
];
const tasks = [
  { id: 1, title: 'Skruv M8 till station 12', station: 'Station 12', level: 'Akut', class: 'high', status: 'Ny', eta: 'Behöver starta nu' },
  { id: 2, title: 'Kabelstam A14 till station 07', station: 'Station 07', level: 'Hög', class: 'medium', status: 'Planerad', eta: 'Senast om 14 min' },
  { id: 4, title: 'Fäste vänster till station 03', station: 'Station 03', level: 'Normal', class: 'medium', status: 'Planerad', eta: 'Senast om 36 min' }
];
const stations = [ ['03','green','43 min'], ['07','amber','22 min'], ['12','red','8 min'], ['16','amber','15 min'], ['18','green','51 min'], ['21','green','38 min'] ];
const history = [ ['Station 04 · clips C3','Levererat av Truck 2','08:19'], ['Station 11 · handtag','Löst manuellt av lagledare','07:54'], ['Station 09 · taktrisk','Extra montör sattes in','07:31'] ];
let resolved = 12;
const $ = s => document.querySelector(s);
function render() {
  $('#alerts').innerHTML = alerts.map(a => `<button class="alert" data-alert="${a.id}"><span class="alert-bar ${a.severity}"></span><span class="alert-main"><span class="alert-label">${a.type}</span><h3>${a.title}</h3><p>${a.detail}</p></span><span class="time ${a.severity}">${a.time}</span></button>`).join('');
  $('#active-count').textContent = `${alerts.length} aktiva`;
  $('#stations').innerHTML = stations.map(([n,c,t]) => `<button class="station" data-station="${n}"><span class="station-top">Station ${n}<i class="dot ${c}"></i></span><strong>${t}</strong><span>till nästa behov</span></button>`).join('');
  $('#tasks').innerHTML = tasks.map(t => `<article class="task"><div class="task-top"><div><p>${t.station}</p><h3>${t.title}</h3></div><span class="badge ${t.class}">${t.level}</span></div><p>${t.eta}</p><button class="${t.status === 'På väg' ? 'done' : ''}" data-task="${t.id}">${t.status === 'På väg' ? 'På väg till stationen' : 'Ta uppdrag'}</button></article>`).join('');
  $('#history').innerHTML = history.map(h => `<div class="history-item"><div><strong>${h[0]}</strong><span>${h[1]}</span></div><span>${h[2]}<br>Åtgärdad</span></div>`).join('');
  $('#resolved-total').textContent = resolved;
}
function toast(message) { const t=$('#toast'); t.textContent=message; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); }
function openAlert(id) { const a=alerts.find(x=>x.id===id); if(!a)return; $('#dialog-type').textContent=a.type; $('#dialog-title').textContent=a.title; $('#dialog-content').innerHTML=`<p>${a.detail}. Systemet bedömer att normal materialkörning inte säkert hinner fram.</p><div class="dialog-info"><p><strong>Material:</strong> ${a.material}</p><p><strong>Rekommendation:</strong> ${a.assignee}</p><p><strong>Åtgärd:</strong> ${a.action}</p></div><button class="primary" id="confirm-action">${a.action}</button>`; $('#detail-dialog').showModal(); $('#confirm-action').onclick=()=>{ $('#detail-dialog').close(); toast(`${a.action} registrerad för stationen.`); } }
document.addEventListener('click', e => { const alert=e.target.closest('[data-alert]'); if(alert) openAlert(+alert.dataset.alert); const task=e.target.closest('[data-task]'); if(task) { const x=tasks.find(t=>t.id===+task.dataset.task); if(x.status!=='På väg') { x.status='På väg'; render(); toast(`Uppdrag till ${x.station} är tilldelat dig.`); }} const station=e.target.closest('[data-station]'); if(station) toast(`Station ${station.dataset.station}: öppna larm eller status i nästa version.`); });
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>{ document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active')); document.querySelectorAll('.view').forEach(x=>x.classList.remove('active')); b.classList.add('active'); $('#'+b.dataset.view).classList.add('active'); });
$('#close-dialog').onclick=()=>$('#detail-dialog').close(); $('#show-all').onclick=()=>toast('Alla stationer visas redan i demonstrationen.');
setInterval(()=>{ const d=new Date(); $('#clock').textContent=d.toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'}); },1000); render();
