// TOOL CẮT GHÉP — giao diện. Gọi server.py (127.0.0.1:8779).
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const api = (u, body) => fetch(u, body ? {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)} : {}).then(r => r.json());
const anh = p => '/anh?p=' + encodeURIComponent(p);
const ngayGio = t => t ? new Date(t * 1000).toLocaleString('vi-VN', {hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'}) : '';

let LO = [], KHAU = [], CHON = null, CLIPS = [], KQ = [], TAB = 'quy_trinh', VIEC = [], plPath = null;

function xem(p, ten, info) {
  plPath = p;
  const v = $('#vid');
  v.src = '/file?p=' + encodeURIComponent(p);
  v.play().catch(() => {});
  $('#pl-ten').textContent = ten || p.split(/[\\/]/).pop();
  $('#pl-info').innerHTML = (info ? info + '<br>' : '') + '<span class="muted">' + esc(p) + '</span>';
  $('#pl-mo').disabled = false;
}
$('#pl-mo').onclick = () => plPath && api('/api/mo_thu_muc', {p: plPath});

// ---------- lô ----------
async function taiLo() {
  LO = await api('/api/lo');
  veLo();
}
function veLo() {
  const q = $('#tim-lo').value.trim().toLowerCase();
  const ds = LO.filter(l => !q || l.ten.toLowerCase().includes(q));
  $('#so-lo').textContent = '(' + LO.length + ')';
  $('#ds-lo').innerHTML = ds.map(l => {
    const pl = l.phan_loai ? Object.values(l.phan_loai).reduce((a, b) => a + b, 0) : 0;
    return `<div class="lo ${CHON === l.ten ? 'on' : ''}" data-lo="${esc(l.ten)}">
      <div class="t"><span>${esc(l.ten)}</span><span class="muted">${l.so_clip} clip</span></div>
      <div class="m">${ngayGio(l.moc)}${l.ngoai ? ' · ngoài LOCAL SEND' : ''}</div>
      <div class="chips">
        ${l.qr ? `<span class="chip qr">QR ${l.qr}</span>` : (l.da_quet_qr ? '<span class="chip">không QR</span>' : '')}
        ${pl ? `<span class="chip ok">đã phân loại ${pl}</span>` : ''}
        ${(l.dang_chay || []).map(k => `<span class="chip run">đang chạy: ${esc(k)}</span>`).join('')}
      </div></div>`;
  }).join('') || '<div class="muted">Chưa có lô nào trong LOCAL SEND.</div>';
  document.querySelectorAll('.lo').forEach(e => e.onclick = () => chonLo(e.dataset.lo));
}
$('#tim-lo').oninput = veLo;

async function chonLo(ten) {
  CHON = ten;
  veLo();
  const l = LO.find(x => x.ten === ten) || {};
  $('#sub').textContent = `Lô ${ten} · ${l.so_clip || 0} clip · ${l.path || ''}`;
  $('#hint-lo').innerHTML = `Lô <b>${esc(ten)}</b> — <b>1</b> PHÂN LOẠI CẢ LÔ (mã QR + bảng chữ + nghe kênh → dạng · kênh · mã; lô quay nhiều dạng vẫn tách đúng) → <b>2</b> cắt + đặt tên (nút theo mã QR hoặc theo bảng chữ tuỳ clip). Tool DỪNG ở cắt + đặt tên. Kết quả xem ở tab 3. Nhật ký: <code>_LAM_VIEC\${esc(ten)}\TOOL_CAT_GHEP_LOG</code>.`;
  await Promise.all([taiViec(), taiClip()]);
  veKhau();
}

$('#btn-tai').onclick = async () => {
  $('#btn-tai').disabled = true;
  $('#btn-tai').textContent = 'Đang mở hộp chọn thư mục…';
  const r = await api('/api/chon_thu_muc', {});
  $('#btn-tai').disabled = false;
  $('#btn-tai').textContent = '＋ Tải thư mục lô';
  if (r.loi) return alert(r.loi);
  await taiLo();
  chonLo(r.ten);
};
$('#btn-lam-moi').onclick = async () => { await api('/api/lam_moi', {}); await taiLo(); if (CHON) await chonLo(CHON); if (TAB === 'ket_qua') taiKQ(); };

// ---------- quy trình ----------
async function taiViec() {
  VIEC = CHON ? await api('/api/viec?lo=' + encodeURIComponent(CHON)) : [];
}
function veKhau() {
  if (!CHON) { $('#ds-khau').innerHTML = ''; return; }
  $('#ds-khau').innerHTML = KHAU.map(k => {
    const vs = VIEC.filter(v => v.khau === k.id);
    const v = vs[0];
    const dang = v && v.xong == null && !v.cu;
    let cls = '', tt = 'Chưa chạy trong tool';
    if (dang) { cls = 'chay'; tt = 'ĐANG CHẠY từ ' + ngayGio(v.bat_dau); }
    else if (v) { cls = (v.ma === 0 || v.ma == null) ? 'xong' : 'loi'; tt = (v.cu ? 'Lần chạy trước: ' : 'Xong lúc ') + ngayGio(v.xong) + (v.ma != null ? ' · mã thoát ' + v.ma : ''); }
    return `<div class="step ${cls}">
      <div class="n">${k.buoc || "⚡"}</div>
      <div><h3>${esc(k.ten)}</h3><div class="mo">${esc(k.mo_ta)}</div>
        <div class="tt">${tt} · <span class="tool">${esc(k.tool)}</span></div>
        ${v ? `<details ${dang ? 'open' : ''}><summary class="muted" style="cursor:pointer;margin-top:6px">Nhật ký (${vs.length} lần)</summary><div class="log" data-log="${esc(v.id)}">${esc((v.duoi || []).join('\n'))}</div></details>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="btn hl" data-chay="${k.id}" ${dang ? 'disabled' : ''}>${dang ? 'Đang chạy…' : 'Chạy'}</button>
        ${dang ? `<button class="btn red" data-dung="${esc(v.id)}">Dừng</button>` : ''}
      </div></div>`;
  }).join('');
  document.querySelectorAll('[data-chay]').forEach(b => b.onclick = async () => {
    const k = KHAU.find(x => x.id === b.dataset.chay);
    if (!confirm(`Chạy "${k.ten}" cho lô ${CHON}?`)) return;
    const r = await api('/api/chay', {lo: CHON, khau: k.id});
    if (r.loi) alert(r.loi);
    await taiViec(); veKhau(); taiLo();
  });
  document.querySelectorAll('[data-dung]').forEach(b => b.onclick = async () => {
    if (!confirm('Dừng việc đang chạy?')) return;
    await api('/api/dung', {id: b.dataset.dung});
    await taiViec(); veKhau();
  });
  document.querySelectorAll('.log').forEach(e => e.scrollTop = e.scrollHeight);
}
setInterval(async () => {
  if (!CHON || TAB !== 'quy_trinh') return;
  const coChay = VIEC.some(v => v.xong == null && !v.cu);
  if (!coChay) return;
  await taiViec(); veKhau();
  if (!VIEC.some(v => v.xong == null && !v.cu)) { taiLo(); taiClip(); }
}, 2500);

// ---------- clip trong lô ----------
async function taiClip() {
  if (!CHON) return;
  const r = await api('/api/lo/chi_tiet?lo=' + encodeURIComponent(CHON));
  CLIPS = r.clips || [];
  $('#b-clip').textContent = CLIPS.length;
  const ks = [...new Set(CLIPS.map(c => c.kenh).filter(Boolean))], ds = [...new Set(CLIPS.map(c => c.dang).filter(Boolean))];
  $('#loc-kenh').innerHTML = '<option value="">Mọi kênh</option>' + ks.map(k => `<option>${esc(k)}</option>`).join('');
  $('#loc-dang').innerHTML = '<option value="">Mọi dạng</option>' + ds.map(k => `<option>${esc(k)}</option>`).join('');
  veClip();
}
function veClip() {
  const fk = $('#loc-kenh').value, fd = $('#loc-dang').value, chua = $('#loc-chua-cat').checked;
  const ds = CLIPS.filter(c => (!fk || c.kenh === fk) && (!fd || c.dang === fd) && (!chua || !c.cat.length));
  $('#dem-clip').textContent = `${ds.length} / ${CLIPS.length} clip · đã cắt ${CLIPS.filter(c => c.cat.length).length}`;
  $('#bang-clip tbody').innerHTML = ds.map((c, i) => `<tr>
    <td><img loading="lazy" src="${anh(c.path)}" data-goc="${i}" title="Xem clip gốc"></td>
    <td><b>${esc(c.clip)}</b><div class="muted">${c.mb} MB</div>${c.co.length ? `<div style="color:var(--warn);font-size:12px">⚑ ${esc(c.co.join(' · ')).slice(0, 160)}</div>` : ''}</td>
    <td>${esc(c.kenh || '—')}</td><td>${c.ma ? 'SP' + c.ma : '—'}</td><td>${esc(c.dang || '—')}</td>
    <td>${c.luot ? 'L' + c.luot + ' C' + (c.canh ?? '?') : '—'}</td><td class="muted">${esc(c.nguon || '')}</td>
    <td>${c.cat.length ? c.cat.map((p, j) => `<span class="link" data-cat="${i}:${j}">▶ ${esc(p.split(/[\\/]/).pop().slice(0, 34))}</span>`).join('<br>') : '<span class="muted">chưa</span>'}</td></tr>`).join('');
  document.querySelectorAll('[data-goc]').forEach(e => e.onclick = () => { const c = ds[+e.dataset.goc]; xem(c.path, c.clip + ' (clip gốc)', `${c.kenh || ''} ${c.ma ? 'SP' + c.ma : ''} ${c.luot ? 'L' + c.luot + 'C' + c.canh : ''}`); });
  document.querySelectorAll('[data-cat]').forEach(e => e.onclick = () => { const [i, j] = e.dataset.cat.split(':').map(Number); const p = ds[i].cat[j]; xem(p, p.split(/[\\/]/).pop(), 'cắt từ ' + ds[i].clip); });
}
['#loc-kenh', '#loc-dang', '#loc-chua-cat'].forEach(s => $(s).onchange = veClip);

// ---------- kết quả ----------
async function taiKQ() {
  KQ = await api('/api/ket_qua');
  const ng = [...new Set(KQ.map(r => r.ngay))], kn = [...new Set(KQ.map(r => r.kenh))];
  const cu = $('#kq-ngay').value, cuK = $('#kq-kenh').value;
  $('#kq-ngay').innerHTML = '<option value="">Mọi ngày</option>' + ng.map(x => `<option ${x === cu ? 'selected' : ''}>${x}</option>`).join('');
  $('#kq-kenh').innerHTML = '<option value="">Mọi kênh</option>' + kn.map(x => `<option ${x === cuK ? 'selected' : ''}>${esc(x)}</option>`).join('');
  veKQ();
}
const MO = new Set();
function veKQ() {
  const fn = $('#kq-ngay').value, fk = $('#kq-kenh').value, thieu = $('#kq-chi-thieu').checked;
  const ds = KQ.filter(r => (!fn || r.ngay === fn) && (!fk || r.kenh === fk) && (!thieu || (r.co_phieu && r.co < r.can)));
  $('#kq-dem').textContent = `${ds.length} sản phẩm · ${ds.reduce((a, r) => a + r.so_file, 0)} file · đủ cảnh: ${ds.filter(r => r.co_phieu && r.co >= r.can).length}`;
  let h = '', ngay = null, kenh = null;
  ds.forEach((r, i) => {
    if (r.ngay !== ngay) { ngay = r.ngay; kenh = null; h += `<div class="ngay-h">NGÀY ${esc(r.ngay)}</div>`; }
    if (r.kenh !== kenh) { kenh = r.kenh; h += `<div class="kenh-h">${esc(r.kenh)}</div>`; }
    const key = r.ngay + r.kenh + r.stt, pct = r.can ? Math.round(100 * r.co / r.can) : 100, du = r.co_phieu && r.co >= r.can;
    h += `<div class="sp"><div class="sp-h" data-mo="${esc(key)}">
      <div class="ten">${r.stt ? 'SP' + r.stt + ' ' : ''}${esc(r.ten_sp)} <small>· ${r.so_file} file</small></div>
      <div>${r.co_phieu ? `<div class="thanh ${du ? '' : 'chua'}"><i style="width:${pct}%"></i></div><div class="muted" style="font-size:12px;margin-top:3px">${r.co}/${r.can} cảnh theo phiếu ${du ? '· ĐỦ' : ''}</div>` : '<span class="muted">chưa có phiếu quay</span>'}</div>
      <div><button class="btn" data-tm="${i}">Mở thư mục</button></div></div>`;
    if (MO.has(key)) {
      h += '<div class="sp-b">';
      r.luoi.forEach(l => {
        h += `<div class="luot"><div class="lt"><b>Lượt ${l.luot}</b>${esc((l.ten || '').replace(/^Lượt \d+\.\s*/, '')).slice(0, 60)}</div>`;
        l.canh.forEach(c => {
          h += `<div class="o ${c.files.length ? '' : 'thieu'} ${c.tich ? 'tich' : ''}"><div class="nhan"><b>C${c.canh}</b><span>${c.files.length ? c.files.length + ' file' : (c.tich ? 'THIẾU · đã tích' : 'thiếu · chưa tích')}</span></div>
            <div class="anh">${c.files.map(f => `<img loading="lazy" src="${anh(f.path)}" data-p="${esc(f.path)}" title="${esc(f.img || '')}">`).join('')}</div></div>`;
        });
        for (let k = l.canh.length; k < 4; k++) h += '<div></div>';
        h += '</div>';
      });
      if (r.ngoai_phieu.length) {
        h += `<div class="muted" style="margin:6px 0">Ngoài phiếu / chưa có phiếu (${r.ngoai_phieu.length} ô):</div><div class="anh" style="display:flex;flex-wrap:wrap;gap:6px">` +
          r.ngoai_phieu.map(o => o.files.map(f => `<div class="o" style="min-height:0"><b>L${o.luot}C${o.canh}</b><div class="anh"><img loading="lazy" src="${anh(f.path)}" data-p="${esc(f.path)}"></div></div>`).join('')).join('') + '</div>';
      }
      if (r.khac.length) h += `<div class="muted" style="margin:6px 0">File khác: ${r.khac.map(f => `<span class="link" data-p="${esc(f.path)}">${esc(f.ten)}</span>`).join(' · ')}</div>`;
      h += '</div>';
    }
    h += '</div>';
  });
  $('#ds-kq').innerHTML = h || '<div class="muted">Chưa có kết quả cắt.</div>';
  document.querySelectorAll('[data-mo]').forEach(e => e.onclick = ev => { if (ev.target.closest('button')) return; const k = e.dataset.mo; MO.has(k) ? MO.delete(k) : MO.add(k); veKQ(); });
  document.querySelectorAll('[data-tm]').forEach(e => e.onclick = () => api('/api/mo_thu_muc', {p: ds[+e.dataset.tm].thu_muc}));
  document.querySelectorAll('#ds-kq [data-p]').forEach(e => e.onclick = () => xem(e.dataset.p, e.dataset.p.split(/[\\/]/).pop()));
}
['#kq-ngay', '#kq-kenh', '#kq-chi-thieu'].forEach(s => $(s).onchange = veKQ);

// ---------- luật ----------
async function taiLuat() {
  const g = await api('/api/luat');
  $('#ds-luat').innerHTML = g.map(x => `<div class="luat-g"><h4>${esc(x.nhom)}</h4>${x.muc.map(m => m.url ? `<a class="btn" target="_blank" rel="noopener" href="${esc(m.url)}">${esc(m.ten)} ↗</a>` : `<button class="btn" data-f="${esc(m.file)}">${esc(m.ten)}</button>`).join('')}</div>`).join('');
  document.querySelectorAll('[data-f]').forEach(b => b.onclick = async () => {
    const r = await api('/api/luat/doc?f=' + encodeURIComponent(b.dataset.f));
    $('#doc-luat').classList.remove('hide');
    $('#doc-luat').textContent = (r.ten || '') + '\n\n' + (r.noi_dung || r.loi || '');
  });
}

// ---------- tab ----------
document.querySelectorAll('#tabs button').forEach(b => b.onclick = () => {
  TAB = b.dataset.tab;
  document.querySelectorAll('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('hide', t.id !== 't-' + TAB));
  if (TAB === 'ket_qua') taiKQ();
  if (TAB === 'luat') taiLuat();
  if (TAB === 'clip') taiClip();
});

(async () => {
  KHAU = await api('/api/khau');
  await taiLo();
  if (LO.length) chonLo(LO[0].ten);
})();
