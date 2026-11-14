// DÂY CHUYỀN SỬA VIDEO — NỀN VŨ TRỤ (05/11/2026)
// Đại ca: "thiết kế ko đẹp, thiết kế dạng giao diện lấy nguyên giao diện nền của tool này đi (bảng điều khiển 8765 /dieu-khien). nhưng xếp theo dạng chuỗi nối nhau"
// Nền ngân hà, thiên hà xoắn ốc, hành tinh HUD lấy NGUYÊN từ LAU_DAI_BOSS_MAI_THI\web\dieu_khien.html (sửa bên đó muốn đồng bộ thì chép lại các hàm này);
// trạm xếp thành CHUỖI RẮN 3 hàng theo đúng thứ tự cac_buoc.BUOC; trạm đang chạy sáng vàng + sóng lan + biển ▶ ĐANG CHẠY; bấm hành tinh = mở bảng trạm (data-tram).
(function () {
const NS = 'http://www.w3.org/2000/svg', DOC = false, R = 56, DONG = !matchMedia('(prefers-reduced-motion: reduce)').matches;
function el(tag, at, cha) {
  const e = document.createElementNS(NS, tag);
  for (const k in at) if (at[k] !== null && at[k] !== undefined) e.setAttribute(k, at[k]);
  if (cha) cha.appendChild(e);
  return e;
}
// ───────── lấy nguyên từ dieu_khien.html (8765) ─────────
function soNgau(s) { return () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }   // cố định hạt giống: vẽ lại sao không nhảy chỗ
function xoay(cha, giay, chieu = 1) { if (DONG) el("animateTransform", {attributeName: "transform", type: "rotate", from: "0", to: String(360 * chieu), dur: giay + "s", repeatCount: "indefinite"}, cha); }
// 02/11/2026 đại ca: "dải ngân hà như này, huyền ảo mà công nghệ": nền vẽ thẳng lên canvas (hàng chục nghìn sao, mây sáng cộng màu, dải bụi tối), chỉ vẽ lại khi đổi cỡ khung
const CHON_MAU = (ngau, ds) => ds[Math.floor(ngau() * ds.length)];
const gauss = ngau => (ngau() + ngau() + ngau() + ngau() - 2) / 2;
function mayMu(c, x, y, r, mau, a) {
  const q = c.createRadialGradient(x, y, 0, x, y, r);
  q.addColorStop(0, `rgba(${mau},${a})`); q.addColorStop(1, `rgba(${mau},0)`);
  c.fillStyle = q; c.fillRect(x - r, y - r, 2 * r, 2 * r);
}
function chamSao(c, ds) { ds.forEach(([x, y, co, m, a]) => { c.globalAlpha = a; c.fillStyle = m; c.fillRect(x, y, co, co); }); c.globalAlpha = 1; }
const MAU_SAO = ["#ffffff", "#ffffff", "#dbe8ff", "#a9c8ff", "#ffe6c4", "#ffc9e8"];
function veDaiXanh(c, ngau, xg, y0, dai, B, w, h) {  // dải ngân hà xanh dựng dọc: nền xanh sâu, cụm sao trắng, khe tối, trăng sáng ở chân
  const X = y => xg + ((y - y0) / dai - .5) * B * 1.3 + Math.sin((y - y0) / dai * 6) * B * .22, Y = () => y0 + ngau() * dai;
  for (let i = 0; i < 26; i++) { const y = Y(); mayMu(c, X(y), y, B * (1.6 + ngau() * 1.4), CHON_MAU(ngau, ["16,60,190", "20,80,210", "12,44,150"]), .05 + ngau() * .05); }
  const cum = [...Array(Math.max(8, Math.round(dai / 45)))].map(() => { const y = Y(); return [X(y) + gauss(ngau) * B * .8, y, B * (.14 + ngau() * .24)]; });
  cum.forEach(([x, y, r]) => { for (let i = 0; i < 16; i++) mayMu(c, x + gauss(ngau) * r * 1.6, y + gauss(ngau) * r * 1.6, r * (.25 + ngau() * .55), CHON_MAU(ngau, ["190,215,255", "235,243,255", "130,175,255"]), .025 + ngau() * .06); });   // cụm mây sao trắng
  const sao = [], so = Math.min(7000, B * dai * .24);
  for (let i = 0; i < so; i++) { const y = Y(); sao.push([X(y) + gauss(ngau) * B * 2.6, y, .4 + ngau() * ngau() * 1, CHON_MAU(ngau, ["#ffffff", "#ffffff", "#e3eeff", "#bcd6ff"]), .3 + ngau() * .55]); }
  chamSao(c, sao);
  c.globalCompositeOperation = "source-over";
  for (let i = 0; i < 110; i++) { const y = Y(); mayMu(c, X(y) - B * .12 + gauss(ngau) * B * .32, y, 4 + ngau() * B * .17, "5,14,56", .14 + ngau() * .26); }   // khe tối giữa dải
  c.globalCompositeOperation = "lighter";
  const hat = [];
  for (let i = 0; i < so * .07; i++) { const y = Y(); hat.push([X(y) + gauss(ngau) * B * 1.3, y, .6 + ngau() * .9, "#ffffff", .5 + ngau() * .5]); }
  chamSao(c, hat);
  mayMu(c, xg, y0 + dai * 1.04, B * 2.6, "255,170,110", .2);   // ráng cam mờ dưới chân
  const my = y0 + dai * (DOC ? .2 : .6), mx = X(my) + B * .3, rm = Math.max(10, B * .15);   // trăng sáng, đặt ở khoảng giữa hai hàng trạm để không che chữ
  mayMu(c, mx, my, rm * 4.5, "190,215,255", .4); mayMu(c, mx, my, rm * 2, "235,243,255", .55);
  c.fillStyle = "#fdfeff"; c.beginPath(); c.arc(mx, my, rm, 0, 7); c.fill();
}
function veNganHa(cv, w, h, k, px, py, xDau, yGiua, dai, xXanh, yXanh, daiXanh) {   // nền tĩnh: sao, tinh vân sau UFO, dải xanh dọc, dải vàng ngang
  cv.width = Math.round(w * k); cv.height = Math.round(h * k);
  const c = cv.getContext("2d"), ngau = soNgau(20261102), B = DOC ? w * .13 : Math.min(w * .085, h * .2);
  c.scale(k, k);
  const nen = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) * .62);
  nen.addColorStop(0, "#080c2c"); nen.addColorStop(.55, "#040720"); nen.addColorStop(1, "#01020a");
  c.fillStyle = nen; c.fillRect(0, 0, w, h);
  c.strokeStyle = "rgba(0,229,255,.03)"; c.lineWidth = 1; c.beginPath();   // lưới toạ độ mờ
  for (let x = 0; x < w; x += 60) { c.moveTo(x, 0); c.lineTo(x, h); }
  for (let y = 0; y < h; y += 60) { c.moveTo(0, y); c.lineTo(w, y); }
  c.stroke();
  c.globalCompositeOperation = "lighter";
  mayMu(c, px, py, Math.min(w, h) * .42, "120,70,255", .2); mayMu(c, px, py, Math.min(w, h) * .24, "255,60,170", .12);
  const so = Math.min(7000, w * h / 170), sao = [];
  for (let i = 0; i < so; i++) sao.push([ngau() * w, ngau() * h, .4 + ngau() * ngau() * 1, CHON_MAU(ngau, MAU_SAO), .25 + ngau() * .6]);
  chamSao(c, sao);
  for (let i = 0; i < (DOC ? 3 : 7); i++) {          // các thiên hà nhỏ phía xa
    const x = ngau() * w, y = ngau() * h, r = 7 + ngau() * 13;
    c.save(); c.translate(x, y); c.rotate(ngau() * 3); c.scale(1, .35);
    mayMu(c, 0, 0, r, CHON_MAU(ngau, ["255,205,160", "190,200,255", "255,170,210"]), .7); mayMu(c, 0, 0, r * .3, "255,255,240", .9);
    c.restore();
  }
  // 02/11/2026 đại ca: "dải thiên hà này cho ngang ra": xoay hệ toạ độ -90 độ, trong khối này trục y là chiều dọc theo dải, chạy từ trái sang phải trên màn hình
  veDaiXanh(c, ngau, xXanh, yXanh, daiXanh, B, w, h);
  c.save(); c.translate(xDau, yGiua); c.rotate(-Math.PI / 2 - .04);
  {
  const h = dai, xb = 0, yDau = 0;
  const X = y => xb + Math.sin(y / h * 5) * B * .18 + Math.sin(y / h * 13 + 1) * B * .07 + (y / h - .5) * B * .4, Y = () => yDau + ngau() * (h + 20 - yDau), am = y => (y - yDau) / (h - yDau);
  mayMu(c, xb, h * 1.05, B * 4.6, "235,110,70", .24); mayMu(c, xb, h * 1.05, B * 2.4, "255,190,120", .26);   // ráng cam dưới chân dải
  mayMu(c, xb - B * 1.7, yDau + (h - yDau) * .62, B * .75, "200,30,70", .3);          // tinh vân đỏ lệch bên
  for (let i = 0; i < 70; i++) { const y = Y(); mayMu(c, X(y) + B * (.45 + gauss(ngau) * 1.2), y, B * (.5 + ngau() * .7), "185,195,215", .006 + ngau() * .012); }   // quầng xám trắng cạnh dải
  for (let i = 0; i < 190; i++) {
    const y = Y(), a = am(y);
    mayMu(c, X(y) + gauss(ngau) * B * .6, y, B * (.1 + ngau() * .42), a > .35 && ngau() < .72 ? CHON_MAU(ngau, ["255,170,90", "255,205,150", "240,130,70"]) : CHON_MAU(ngau, ["170,120,200", "120,130,220", "225,205,215"]), .02 + ngau() * .035);
  }
  for (let i = 0; i < 100; i++) {                    // lõi hồng tím rực
    const y = yDau + Math.pow(ngau(), 1.3) * (h - yDau);
    mayMu(c, X(y) + gauss(ngau) * B * .42, y, 3 + ngau() * B * .17, CHON_MAU(ngau, ["255,40,130", "255,70,170", "90,140,255"]), .16 + ngau() * .28);
  }
  const dac = [];
  for (let i = 0; i < Math.min(9000, w * h / 110); i++) { const y = Y(); dac.push([X(y) + gauss(ngau) * B * 1.5, y, .4 + ngau() * ngau() * 1, CHON_MAU(ngau, MAU_SAO), .3 + ngau() * .65]); }
  chamSao(c, dac);
  c.globalCompositeOperation = "source-over";
  for (let i = 0; i < 190; i++) { const y = Y(); mayMu(c, X(y) + gauss(ngau) * B * .26, y, 3 + ngau() * B * .14, "22,12,18", .14 + ngau() * .26); }   // bụi tối giữa lõi
  c.lineCap = "round";
  for (let i = 0; i < 55; i++) {                     // sợi bụi toả nhánh ra hai bên
    let y = Y(), x = X(y) + gauss(ngau) * B * .3;
    const huong = ngau() < .5 ? -1 : 1;
    c.strokeStyle = `rgba(22,12,16,${(.12 + ngau() * .24).toFixed(2)})`; c.lineWidth = .6 + ngau() * 1.6; c.beginPath(); c.moveTo(x, y);
    for (let b = 0; b < 12; b++) { x += huong * (1 + ngau() * B * .05); y += (ngau() - .5) * B * .14; c.lineTo(x, y); }
    c.stroke();
  }
  c.globalCompositeOperation = "lighter";
  for (let i = 0; i < 46; i++) {                     // sao sáng xanh, vàng nằm quanh dải
    const y = Y(), x = X(y) + gauss(ngau) * B * 2.2, r = 2 + ngau() * 4.5, m = CHON_MAU(ngau, ["120,180,255", "150,200,255", "190,225,255", "255,205,120"]);
    mayMu(c, x, y, r, m, .95);
  }
  const le = [];
  for (let i = 0; i < 900; i++) { const y = Y(); le.push([X(y) + gauss(ngau) * B * .5, y, .5 + ngau() * .7, CHON_MAU(ngau, MAU_SAO), .5 + ngau() * .5]); }
  chamSao(c, le);
  }
  c.restore();
  c.globalCompositeOperation = "source-over";
}
function veXoanOc(cv, Rg, k) {                       // thiên hà xoắn ốc: lõi kem sáng, cánh cuộn chặt, sợi bụi nâu, đám tinh vân hồng; vẽ một lần, CSS quay cả tấm
  const D = Math.round(2 * Rg * k);
  cv.width = cv.height = D; cv.style.width = cv.style.height = 2 * Rg + "px";
  const c = cv.getContext("2d"), ngau = soNgau(1102);
  c.scale(k, k); c.translate(Rg, Rg);
  const tay = (t, a, lech) => { const g = a + 2.9 * Math.log(1 + t * 9), r = Rg * (.05 + .95 * t) + lech; return [r * Math.cos(g), r * Math.sin(g)]; };
  // 02/11/2026 đại ca: "vòng này cho dầy và huyền ảo hơn": cánh rộng gấp đôi, thêm lớp mây mờ phủ dày, bớt sợi mảnh, lõi dịu lại
  const CANH = [[0, 420], [Math.PI, 420], [Math.PI / 2, 220], [3 * Math.PI / 2, 220]];
  c.globalCompositeOperation = "lighter";
  mayMu(c, 0, 0, Rg, "80,95,210", .3); mayMu(c, 0, 0, Rg * .6, "150,130,220", .18);
  CANH.forEach(([a, n]) => { for (let i = 0; i < n * .35; i++) {   // lớp mây mờ phủ rộng, làm cánh dày và mơ ảo
    const t = Math.pow(ngau(), .75), [x, y] = tay(t, a, gauss(ngau) * Rg * .26);
    mayMu(c, x, y, Rg * (.1 + ngau() * .16), CHON_MAU(ngau, ["110,80,230", "70,120,240", "210,80,200", "90,170,240"]), .025 + ngau() * .04);
  } });
  CANH.forEach(([a, n]) => { for (let i = 0; i < n; i++) {
    const t = Math.pow(ngau(), .75), [x, y] = tay(t, a, gauss(ngau) * Rg * .2);
    mayMu(c, x, y, Rg * (.03 + ngau() * .09), t < .16 ? CHON_MAU(ngau, ["255,215,160", "255,190,130"]) : CHON_MAU(ngau, ["255,215,150", "255,110,190", "165,115,255", "115,165,255", "225,235,255"]), .025 + ngau() * .055);
  } });
  const so = Math.min(22000, Rg * Rg * .2), sao = [];
  for (let i = 0; i < so; i++) {
    const t = Math.pow(ngau(), .7), [x, y] = i % 5 ? tay(t, CANH[Math.floor(ngau() * 4)][0], gauss(ngau) * Rg * .24) : [gauss(ngau) * Rg * 1.15, gauss(ngau) * Rg * 1.15];
    sao.push([x, y, .4 + ngau() * ngau() * 1.1, CHON_MAU(ngau, MAU_SAO), .35 + ngau() * .65]);
  }
  chamSao(c, sao);
  const soi = (n, dam, netMax, kieu) => { for (let i = 0; i < n; i++) {   // sợi chạy dọc cánh xoắn
    const a = CANH[Math.floor(ngau() * 4)][0], t0 = .07 + ngau() * .75, dai = .1 + ngau() * .24;
    let lech = (dam ? -.05 : .02) * Rg + gauss(ngau) * Rg * .05;
    c.strokeStyle = kieu(); c.lineWidth = .5 + ngau() * netMax; c.beginPath();
    for (let b = 0; b <= 22; b++) { lech += (ngau() - .5) * Rg * .012; const [x, y] = tay(t0 + dai * b / 22, a, lech); b ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
  } };
  c.lineCap = "round";
  c.globalCompositeOperation = "source-over";
  CANH.forEach(([a]) => { for (let i = 0; i < 70; i++) {   // bụi nâu dạng mảng mờ mép trong cánh, không vẽ thành sợi rõ
    const [x, y] = tay(.1 + ngau() * .85, a, -Rg * .05 + gauss(ngau) * Rg * .07);
    mayMu(c, x, y, Rg * (.012 + ngau() * .04), CHON_MAU(ngau, ["60,32,18", "80,42,22", "30,16,14"]), .12 + ngau() * .22);
  } });
  soi(50, true, 1.2, () => `rgba(${CHON_MAU(ngau, ["72,38,18", "96,50,22", "36,18,12"])},${(.1 + ngau() * .16).toFixed(2)})`);
  c.globalCompositeOperation = "lighter";
  for (let i = 0; i < 170; i++) {                    // đám tinh vân hồng, cụm sao xanh, trắng
    const [x, y] = tay(.14 + ngau() * .86, CANH[Math.floor(ngau() * 4)][0], gauss(ngau) * Rg * .2);
    mayMu(c, x, y, 2 + ngau() * Rg * .03, CHON_MAU(ngau, ["255,90,180", "255,120,210", "130,185,255", "255,225,185", "240,245,255"]), .3 + ngau() * .4);
  }
  mayMu(c, 0, 0, Rg * .3, "255,214,160", .55); mayMu(c, 0, 0, Rg * .13, "255,240,210", .75); mayMu(c, 0, 0, Rg * .05, "255,255,245", .95);
  c.globalCompositeOperation = "destination-in";     // mờ dần ra mép, không lộ cạnh tấm hình
  const mo = c.createRadialGradient(0, 0, Rg * .6, 0, 0, Rg);
  mo.addColorStop(0, "rgba(0,0,0,1)"); mo.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = mo; c.fillRect(-Rg, -Rg, 2 * Rg, 2 * Rg);
  c.globalCompositeOperation = "source-over";
}
// 02/11/2026 đại ca: "code các hành tinh trong hệ mặt trời": 11 trạm là 11 thiên thể, xếp theo thứ tự dây chuyền từ Mặt Trời ra ngoài
// dai = dải mây [y, dày, màu, độ đậm]; dom = vùng bề mặt [số vùng, màu, độ đậm, cỡ nhỏ, cỡ lớn]; ho = miệng hố [số hố, màu]; may = mây trên cùng
const HE_MAT_TROI = {
  tim: {ten: "Mặt Trời", nen: ["#fff8b0", "#ffcc1f", "#f08a00"], dom: [[7, "#f59e0b", .65, 5, 12], [3, "#ffe680", .7, 6, 10]], phat: true},
  dat: {ten: "Sao Thuỷ", nen: ["#eab884", "#b9743a", "#6e3d1a"], dom: [[5, "#f4d3a4", .6, 8, 15]], ho: [7, "#7f4a22"]},
  content: {ten: "Trái Đất", nen: ["#7ceaff", "#1f93dc", "#0b4a8f"], dom: [[5, "#35bf63", .98, 11, 20], [3, "#a6e36a", .85, 5, 9]], may: [[-32, 5, "#ffffff", .55], [24, 6, "#ffffff", .45]], trang: true},   // 02/11/2026 đại ca: Content win là Trái Đất
  so: {ten: "Sao Kim", nen: ["#ffdcae", "#f2a468", "#a8501f"], dai: [[-38, 9, "#fff0d0", .75], [-20, 12, "#e8743a", .8], [-2, 8, "#ffe3b0", .8], [16, 14, "#e8843f", .75], [36, 9, "#fff0d0", .65]]},
  phieu: {ten: "Sao Hoả", nen: ["#ff8250", "#dc3d20", "#7a1408"], dom: [[6, "#a81f0f", .75, 8, 16], [3, "#ffb070", .6, 6, 11]], cuc: "#ffe9dc"},
  quay: {ten: "Sao Mộc", nen: ["#ffe9bd", "#ecb476", "#8a5226"], dai: [[-42, 7, "#f4c48a", .9], [-29, 8, "#8fd8e8", .85], [-14, 10, "#d97a3a", .9], [2, 7, "#fff0d0", .9], [16, 11, "#c8642a", .9], [32, 8, "#8fd8e8", .85], [44, 6, "#e8a060", .9]], domDo: true, trang: true},
  dung: {ten: "Sao Thổ", nen: ["#f6e6b0", "#d9ba72", "#8a6a36"], dai: [[-36, 9, "#fff4cf", .7], [-18, 8, "#bfa062", .7], [0, 11, "#f0d68e", .8], [20, 8, "#b08f55", .7], [38, 8, "#ead08a", .7]], vanh: [[-22, [[88, 20, 8, "#ecd6ac", .9], [72, 16, 4, "#a98a5c", .9]]]]},
  dang: {ten: "Sao Thiên Vương", nen: ["#d0f6ff", "#73cbf0", "#1f7ab8"], dai: [[-30, 10, "#eafcff", .6], [-8, 12, "#4fb0e6", .55], [16, 9, "#d6f6ff", .55], [36, 10, "#3f9ad8", .5]], vanh: [[-62, [[82, 26, 1.8, "#e3f8ff", .95]]]]},
  shopee: {ten: "Sao Hải Vương", nen: ["#6aa6ff", "#2259de", "#0a2a8a"], dai: [[-34, 10, "#8fc0ff", .6], [-14, 11, "#123fb5", .75], [6, 8, "#6ea4ff", .6], [26, 12, "#0f37a0", .75], [42, 6, "#7fb2ff", .5]]},
  bao_cao: {ten: "Sao Diêm Vương", nen: ["#ece6cd", "#bcb196", "#6a5f4f"], dom: [[4, "#8a7a66", .6, 9, 15], [1, "#f6f4ec", .97, 17, 21]]},
  scale: {ten: "Mặt Trăng", nen: ["#d8ecea", "#a2bdbb", "#4f6b6b"], ho: [9, "#74908e"]},
};
function vungDat(x, y, rx, ry, ngau) {              // một vùng bề mặt méo tự nhiên, nối mượt bằng đường cong
  const n = 8, d = [...Array(n)].map((_, i) => { const a = i / n * 2 * Math.PI, k = .68 + ngau() * .55; return [x + rx * k * Math.cos(a), y + ry * k * Math.sin(a)]; });
  const giua = (p, q) => `${((p[0] + q[0]) / 2).toFixed(1)},${((p[1] + q[1]) / 2).toFixed(1)}`;
  return `M${giua(d[n - 1], d[0])} ` + d.map((p, i) => `Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${giua(p, d[(i + 1) % n])}`).join(" ") + " Z";
}
function veHanhTinh(g, sv, x, y, t, mau) {          // hình hành tinh để phân biệt trạm; tình trạng thật nằm ở quầng sáng và vòng tải (đỏ = tắt, xám = chưa nối)
  const c = HE_MAT_TROI[t.hanh || t.id] || HE_MAT_TROI.scale, id = "ht-" + t.id, defs = sv.querySelector("defs"), ngau = soNgau(t.so * 977), P = 2 * R;
  const nen = el("radialGradient", {id: id + "-nen", cx: ".38", cy: ".32", r: ".78"}, defs);
  c.nen.forEach((m, i) => el("stop", {offset: i / 2, "stop-color": m}, nen));
  el("circle", {cx: x, cy: y, r: R}, el("clipPath", {id: id + "-cat"}, defs));
  const than = el("g", {opacity: t.den === "xanh" ? 1 : .45}, g);
  el("title", {}, than).textContent = c.ten;
  const vanh = nua => (c.vanh || []).forEach(([nghieng, cac]) => cac.forEach(([rx, ry, co, m, o]) =>
    el("path", {d: `M${x - rx},${y} A${rx},${ry} 0 0 ${nua} ${x + rx},${y}`, fill: "none", stroke: m, "stroke-width": co, opacity: o, transform: `rotate(${nghieng} ${x} ${y})`}, than)));
  if (c.phat) {                                     // quầng lửa Mặt Trời
    const lua = (ban, lech, soCanh, m, o, giay) => {
      const q = el("g", {transform: `translate(${x} ${y})`}, than), v = el("g", {}, q), d = [...Array(soCanh * 2)].map((_, i) => { const a = i / (soCanh * 2) * 2 * Math.PI, r = ban + (i % 2 ? lech : -lech); return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`; });
      el("polygon", {points: d.join(" "), fill: m, opacity: o, "stroke-linejoin": "round", stroke: m, "stroke-width": 4}, v);
      xoay(v, giay);
    };
    lua(R + 9, 5, 14, "#ff9d0a", .4, 40); lua(R + 5, 4, 11, "#ffd23f", .55, 26);
  }
  vanh(1);                                          // nửa vành phía sau hành tinh
  el("circle", {cx: x, cy: y, r: R, fill: `url(#${id}-nen)`, filter: c.phat ? "url(#sang2)" : null}, than);
  const cat = el("g", {"clip-path": `url(#${id}-cat)`}, than), mat = el("g", {}, cat);
  const dai = ds => (ds || []).forEach(([d, co, m, o]) => {   // dải mây lặp đúng chu kỳ P nên xoay liền mạch
    const a = 3 + ngau() * 4;
    el("path", {d: `M${x - R},${y + d} q${P / 4},${-a} ${P / 2},0 t${P / 2},0 t${P / 2},0 t${P / 2},0`, fill: "none", stroke: m, "stroke-width": co, opacity: o}, mat);
  });
  dai(c.dai);
  (c.dom || []).forEach(([n, m, o, nho, lon]) => { for (let i = 0; i < n; i++) {   // mỗi vùng vẽ hai bản cách nhau P
    const sx = ngau() * P, sy = y + (ngau() * 2 - 1) * 36, rx = nho + ngau() * (lon - nho), ry = rx * (.6 + ngau() * .4), d = vungDat(0, sy, rx, ry, ngau);
    [0, P].forEach(k => el("path", {d, fill: m, opacity: o, transform: `translate(${x - R + sx + k} 0)`}, mat));
  } });
  if (c.ho) for (let i = 0; i < c.ho[0]; i++) {
    const sx = x - R + ngau() * P, sy = y + (ngau() * 2 - 1) * 42, r = 3.5 + ngau() * 7;
    [0, P].forEach(k => { el("circle", {cx: sx + k, cy: sy, r, fill: c.ho[1], opacity: .75}, mat); el("circle", {cx: sx + k + r * .2, cy: sy + r * .2, r: r * .68, fill: "#000", opacity: .14}, mat); });
  }
  if (c.domDo) [0, P].forEach(k => el("ellipse", {cx: x - R + 34 + k, cy: y + 20, rx: 15, ry: 8, fill: "#c8421f", stroke: "#ffe0c0", "stroke-width": 1.5}, mat));   // vết đỏ Sao Mộc
  dai(c.may);
  if (DONG) el("animateTransform", {attributeName: "transform", type: "translate", from: "0 0", to: `${-P} 0`, dur: 18 + t.so * 2 + "s", repeatCount: "indefinite"}, mat);
  if (c.cuc) el("ellipse", {cx: x, cy: y - R + 5, rx: 24, ry: 9, fill: c.cuc}, cat);   // chỏm băng Sao Hoả
  if (!c.phat) el("circle", {cx: x, cy: y, r: R, fill: "url(#bong)"}, than);
  el("ellipse", {cx: x - 20, cy: y - 28, rx: 14, ry: 6, fill: "#fff", opacity: .3, transform: `rotate(-30 ${x - 20} ${y - 28})`}, than);
  vanh(0);                                          // nửa vành phía trước
  el("circle", {class: "luc", cx: x, cy: y, r: R + 1, fill: "none", stroke: mau, "stroke-width": 2, filter: t.den === "xam" ? null : "url(#sang)", "stroke-dasharray": t.den === "xam" ? "5 5" : null}, g);
  // 02/11/2026 đại ca: "mỗi trạm 1 hành tinh, kiểu công nghệ đang xoay": lưới kinh tuyến quay, tia quét, vòng HUD, vệ tinh; màu theo tình trạng thật của trạm
  const luoi = el("g", {"clip-path": `url(#${id}-cat)`, fill: "none", stroke: t.den === "xam" ? "#9fb4c8" : mau, "stroke-width": 1, opacity: .55}, g);
  [-34, -12, 12, 34].forEach(d => el("ellipse", {cx: x, cy: y + d, rx: Math.sqrt(R * R - d * d), ry: 5}, luoi));
  for (let i = 0; i < 3; i++) {
    const kt = el("ellipse", {cx: x, cy: y, rx: R, ry: R}, luoi);
    if (DONG) el("animate", {attributeName: "rx", values: `${R};0;${R}`, dur: "9s", begin: `${-i * 3}s`, repeatCount: "indefinite"}, kt);
  }
  if (DONG) {
    const tia = el("rect", {x: x - R, y: y - R, width: P, height: 3, fill: "#fff", opacity: .4, stroke: "none"}, luoi);
    el("animate", {attributeName: "y", values: `${y - R};${y + R};${y - R}`, dur: 5 + t.so % 4 + "s", repeatCount: "indefinite"}, tia);
  }
  const hud = (ban, net, doc, giay, chieu) => {
    const qg = el("g", {}, el("g", {transform: `translate(${x} ${y})`}, g));
    el("circle", {r: ban, fill: "none", stroke: mau, "stroke-width": net, "stroke-dasharray": doc, opacity: .8}, qg);
    xoay(qg, giay, chieu);
    return qg;
  };
  hud(69, 1.4, "26 10 5 10", 14 + t.so, 1);
  const veTinh = hud(77, 1, "1.5 10", 26 + t.so, -1);
  el("circle", {cx: 77, cy: 0, r: c.trang ? 5 : 2.8, fill: c.trang ? "#d8ecea" : "#fff", filter: "url(#sang)"}, veTinh);
}

// ───────── phần riêng 8779: chuỗi trạm nối nhau trên nền vũ trụ ─────────
const TEN_NGAN = {nhan: 'NHẬN LÔ', trung: 'CHỐNG TRÙNG', qr: 'QUÉT MÃ QR', trang: 'TRANG · GIÁ · WIN', content: 'CONTENT', mat: 'PHÂN MẶT',
  capcut: 'CAPCUT', os: 'CẮT ONE SHORT', canh: 'CẮT CẢNH', anh: 'TÁCH · GHÉP ẢNH', long: 'LỒNG VOICE', dung: 'DỰNG VIDEO', duyet: 'CHỜ DUYỆT'};
const BIEU = {nhan: '📥', trung: '🧬', qr: '🔳', mat: '🧑', capcut: '🎨', os: '🎙', canh: '✂', trang: '🛒', content: '✍', anh: '🖼', long: '🔊', dung: '🎞', duyet: '✅'};
// mỗi trạm một thiên thể (lấy từ hệ mặt trời của bảng điều khiển 8765), thêm 2 hành tinh mới cho đủ 13 trạm
HE_MAT_TROI.hong = {ten: 'Sao Hồng', nen: ['#ffd6f4', '#ff5fc8', '#8a1a6a'], dai: [[-34, 9, '#ffe3f7', .6], [-12, 12, '#d43c9e', .7], [10, 9, '#ffc2ec', .6], [32, 12, '#b82a86', .7]], may: [[-20, 4, '#ffffff', .35]]};
HE_MAT_TROI.tim2 = {ten: 'Sao Tím', nen: ['#e6d6ff', '#9a6bff', '#3a1a8a'], dom: [[5, '#c9b0ff', .7, 8, 15], [3, '#5a32c8', .7, 6, 11]], vanh: [[-14, [[86, 18, 5, '#d9c8ff', .85], [70, 14, 2.5, '#9a7ae0', .9]]]], trang: true};
const HANH = {nhan: 'tim', trung: 'dat', qr: 'so', trang: 'content', content: 'scale', mat: 'phieu', capcut: 'quay', os: 'dang', canh: 'shopee', anh: 'bao_cao', long: 'hong', dung: 'dung', duyet: 'tim2'};
const MAU_TT = {xong: '#39ff88', dang: '#ffb020', mot_phan: '#00e5ff', loi: '#ff3355', cho: '#3a4a5c'};
const CHU_TT = {xong: 'XONG', dang: 'ĐANG CHẠY', mot_phan: 'LÀM DỞ', loi: 'LỖI / DỪNG', cho: 'CHỜ'};
const $v = s => document.querySelector(s);
const escv = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
let VW = 1200, VH = 724, POS = {}, S = 1, CORE = [600, 330];
const XM = 130;                                       // lề: chừa chỗ cho đường vòng xuống hàng
const Y_HANG = [112, 360, 604];
function xepChuoi(ds) {                               // chuỗi rắn: hàng 1 trái→phải, hàng 2 phải→trái, hàng 3 trái→phải; hết hàng thì vòng xuống hàng dưới
  const o = $v('#vt-khung'), cw = o.clientWidth || 1200, maxH = Math.max(540, Math.min(innerHeight * .82, 800));
  VW = Math.max(1200, Math.round(VH * cw / maxH));
  const n = ds.length, k0 = Math.ceil(n / 3), k1 = Math.ceil((n - k0) / 2), k2 = n - k0 - k1;
  POS = {}; let i = 0;
  [k0, k1, k2].forEach((k, r) => { for (let j = 0; j < k; j++) { let f = k === 1 ? .5 : j / (k - 1); if (r === 1) f = 1 - f; POS[ds[i++]] = [XM + f * (VW - 2 * XM), Y_HANG[r]]; } });
  CORE = [VW / 2, Y_HANG[1]];
  $v('#vt-sv').setAttribute('viewBox', `0 0 ${VW} ${VH}`);
}
const RN = 80;                                        // đường nối bắt đầu ngoài vòng HUD của hành tinh
function duongNoi(a, b) {
  const [x1, y1] = POS[a], [x2, y2] = POS[b];
  if (y1 === y2) return `M${x1 + (x2 > x1 ? RN : -RN)},${y1} H${x2 + (x2 > x1 ? -RN : RN)}`;
  const phai = x1 > VW / 2, xv = phai ? VW - 34 : 34;  // xuống hàng: vòng ra mép khung rồi vào trạm dưới, không cắt qua tên trạm
  return `M${x1 + (phai ? RN : -RN)},${y1} H${xv} V${y2} H${x2 + (phai ? RN : -RN)}`;
}
function veVuTru(sv) {                                // sao nhấp nháy, hành tinh nhỏ quanh thiên hà, sao chổi — chỉ trang trí
  const g = el('g', {'pointer-events': 'none'}, sv), ngau = soNgau(20261105);
  for (let i = 0; i < 34; i++) {
    const c = el('circle', {cx: ngau() * VW, cy: ngau() * VH, r: 1.2 + ngau() * 1.2, fill: '#fff', opacity: .3}, g);
    if (DONG) el('animate', {attributeName: 'opacity', values: '.1;1;.1', dur: (2 + ngau() * 4).toFixed(1) + 's', begin: (-ngau() * 5).toFixed(1) + 's', repeatCount: 'indefinite'}, c);
  }
  const [gx, gy] = CORE, rU = VW * .16;
  [['capcut', 7, .62, 34], ['trang', 5, .8, 46], ['canh', 6, .98, 58], ['dung', 7, 1.12, 72], ['long', 4, .5, 28], ['os', 5, .9, 52]].forEach(([id, r, ti, giay], i) => {
    const rx = rU * ti, ry = rx * .54, qd = el('g', {transform: `rotate(-12 ${gx} ${gy})`}, g), dg = 'vtQuy' + i;
    el('path', {id: dg, d: `M${gx - rx},${gy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0`, fill: 'none'}, qd);
    const nho = el('g', {}, qd);
    if (id === 'dung') el('ellipse', {rx: r * 1.9, ry: r * .5, fill: 'none', stroke: '#ecd6ac', 'stroke-width': 1.4, transform: 'rotate(-18)'}, nho);
    el('circle', {r, fill: `url(#ht-${id}-nen)`}, nho); el('circle', {r, fill: 'url(#bong)'}, nho);
    if (DONG) el('mpath', {href: '#' + dg}, el('animateMotion', {dur: giay + 's', begin: `${-giay * i / 6}s`, repeatCount: 'indefinite'}, nho));
  });
  if (DONG) {
    el('path', {id: 'vtChoi', d: `M${VW + 130},${VH * .03} L-130,${VH * .52}`, fill: 'none'}, g);
    const sc = el('g', {}, g);
    el('path', {d: 'M6,-7 C-30,-15 -74,-9 -118,0 C-74,-3 -30,5 6,7 Z', fill: 'url(#luaTL)', opacity: .9}, sc);
    el('circle', {r: 8, fill: '#9a5a2a', stroke: '#ffd27a', 'stroke-width': 1.5}, sc);
    el('circle', {cx: 2, cy: -2, r: 2.4, fill: '#6e3d1a'}, sc);
    el('mpath', {href: '#vtChoi'}, el('animateMotion', {dur: '22s', repeatCount: 'indefinite', rotate: 'auto'}, sc));
  }
}
let KHOA_NEN = '';
function veNenVuTru() {
  const o = $v('#vt-khung'), w = o.clientWidth, h = o.clientHeight;
  if (!w || !h) return;
  const tl = w / VW, k = Math.min(devicePixelRatio || 1, 1.5), Rg = Math.round(VW * .16 * tl);
  const xDau = (CORE[0] - 40) * tl, yGiua = CORE[1] * tl, dai = (VW - CORE[0] + 60) * tl, xXanh = VW * .27 * tl, daiXanh = h;
  const khoa = [w, h, Rg, k].join();
  if (khoa !== KHOA_NEN) { KHOA_NEN = khoa; veNganHa($v('#vt-nen'), w, h, k, CORE[0] * tl, CORE[1] * tl, xDau, yGiua, dai, xXanh, 0, daiXanh); veXoanOc($v('#vt-thienha canvas'), Rg, k); }
  $v('#vt-thienha').style.transform = `translate(${CORE[0] * tl - Rg}px,${CORE[1] * tl - Rg}px)`;
}
const DEFS = `<defs>
  <filter id="sang" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="sang2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <radialGradient id="bong" cx=".36" cy=".32" r=".78"><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#01030c" stop-opacity=".3"/><stop offset="1" stop-color="#01030c" stop-opacity=".72"/></radialGradient>
  <radialGradient id="quangChay"><stop offset="0" stop-color="#ffb020" stop-opacity=".45"/><stop offset="1" stop-color="#ffb020" stop-opacity="0"/></radialGradient>
  <linearGradient id="luaTL" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff3a8"/><stop offset=".5" stop-color="#ff9a2b"/><stop offset="1" stop-color="#ff2b6a" stop-opacity=".2"/></linearGradient></defs>`;
const kcv = s => s < 90 ? Math.round(s) + ' giây' : s < 5400 ? Math.round(s / 60) + ' phút' : (s / 3600).toFixed(1) + ' giờ';
const giov = t => new Date(t * 1000).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit', hour12: false});
function chuPhu(b) {
  const now = Date.now() / 1000;
  if (b.tt === 'dang') return 'ĐANG CHẠY' + (b.tu ? ' · ' + kcv(now - b.tu) : '');
  if (b.tt === 'xong') return 'XONG' + (b.luc ? ' ' + giov(b.luc) : '');
  if (b.tt === 'loi') return 'LỖI / DỪNG';
  if (b.tt === 'mot_phan') return 'LÀM DỞ';
  return b.cho_ai ? cat(b.cho_ai.replace(/^chờ:\s*/i, 'CHỜ: '), 34) : 'CHỜ';
}
const cat = (s, n) => s.length > n ? s.slice(0, n - 1) + '…' : s;
function veSo(lo, bs) {
  xepChuoi(bs.map(b => b.ma));
  const sv = $v('#vt-sv');
  sv.innerHTML = DEFS;
  veVuTru(sv);
  const gLuong = el('g', {}, sv), gHat = el('g', {}, sv);
  for (let i = 0; i + 1 < bs.length; i++) {           // đường nối từng cặp trạm liền nhau
    const a = bs[i], b = bs[i + 1], d = duongNoi(a.ma, b.ma);
    const chay = a.tt === 'dang' || b.tt === 'dang', xong = a.tt === 'xong' && b.tt !== 'cho', loi = a.tt === 'loi' || b.tt === 'loi', dut = !chay && !xong && !loi && b.tt === 'cho' && a.tt !== 'xong';
    const mau = loi ? MAU_TT.loi : chay ? MAU_TT.dang : dut ? '#3a4a5c' : a.tt === 'xong' ? MAU_TT.xong : MAU_TT.mot_phan;
    el('path', {d, class: 'can', stroke: mau, 'stroke-width': chay ? 14 : 10, opacity: chay ? .14 : .08}, gLuong);
    el('path', {id: 've' + i, d, class: 'can' + (dut ? '' : ' vt-chay'), stroke: mau, 'stroke-width': chay ? 3.2 : 2.4, opacity: dut ? .6 : 1, 'stroke-dasharray': dut ? '4 8' : null, filter: dut ? null : 'url(#sang)'}, gLuong);
    if (dut) continue;
    const L = document.getElementById('ve' + i).getTotalLength(), n = chay ? 6 : 3, dur = (L / (chay ? 130 : 70)).toFixed(1);
    for (let j = 0; j < n; j++) {
      const c = el('circle', {r: chay ? 4 : 2.6, fill: chay ? '#fff6dc' : '#ffffff', filter: 'url(#sang)', opacity: chay ? 1 : .75}, gHat);
      if (DONG) el('mpath', {href: '#ve' + i}, el('animateMotion', {dur: dur + 's', repeatCount: 'indefinite', begin: (-dur * j / n).toFixed(2) + 's'}, c));
    }
  }
  bs.forEach((b, i) => {
    const [x, y] = POS[b.ma], mau = MAU_TT[b.tt] || MAU_TT.cho, cho = b.tt === 'cho';
    const p = b.tong ? Math.min(1, b.xong / b.tong) : 0;
    const ngoai = el('g', {class: 'vt-tram ' + b.tt, 'data-tram': lo + '|' + b.ma, tabindex: 0, role: 'button', 'aria-label': b.ten}, sv);
    el('title', {}, ngoai).textContent = b.ten + ' — ' + (b.ghi || '') + ' (bấm để mở trạm: tiến trình · tool · Claude sửa · luật & code)';
    if (b.tt === 'dang') {                            // trạm đang chạy: quầng vàng + sóng lan
      el('circle', {cx: x, cy: y, r: 118, fill: 'url(#quangChay)'}, ngoai);
      for (let k = 0; k < 2; k++) {
        const s = el('circle', {cx: x, cy: y, r: 66, fill: 'none', stroke: mau, 'stroke-width': 2, opacity: 0}, ngoai);
        if (DONG) { el('animate', {attributeName: 'r', values: '66;104', dur: '2.2s', begin: k * 1.1 + 's', repeatCount: 'indefinite'}, s);
          el('animate', {attributeName: 'opacity', values: '.85;0', dur: '2.2s', begin: k * 1.1 + 's', repeatCount: 'indefinite'}, s); }
      }
    }
    el('circle', {cx: x, cy: y, r: 72, fill: 'none', stroke: mau, 'stroke-width': 1, 'stroke-dasharray': '3 9', class: 'vt-vong' + (i % 2 ? '' : ' n'), opacity: .55}, ngoai);
    veHanhTinh(ngoai, sv, x, y, {id: b.ma, so: i + 1, den: cho ? 'xam' : 'xanh', hanh: HANH[b.ma]}, mau);
    const C = 2 * Math.PI * 64;
    el('circle', {cx: x, cy: y, r: 64, fill: 'none', stroke: '#0f2236', 'stroke-width': 4}, ngoai);
    if (p > 0) el('circle', {cx: x, cy: y, r: 64, fill: 'none', stroke: mau, 'stroke-width': 4, 'stroke-dasharray': `${(C * Math.max(.02, p)).toFixed(1)} ${C}`,
      transform: `rotate(-90 ${x} ${y})`, filter: 'url(#sang)', 'stroke-linecap': 'round'}, ngoai);
    const vc = {stroke: '#020612', 'paint-order': 'stroke', 'stroke-linejoin': 'round'};
    el('text', {x, y: y - 26, 'text-anchor': 'middle', fill: '#e8f6ff', 'font-size': 11, 'font-family': 'Orbitron', 'letter-spacing': 2, 'stroke-width': 3.5, ...vc}, ngoai).textContent = 'T' + String(i + 1).padStart(2, '0') + ' ' + (BIEU[b.ma] || '');
    el('text', {x, y: y + 10, 'text-anchor': 'middle', fill: cho ? '#9fb4c8' : '#fff', 'font-size': 26, 'font-weight': 900, 'font-family': 'Orbitron', 'stroke-width': 5, ...vc}, ngoai).textContent = Math.round(p * 100) + '%';
    el('text', {x, y: y + 28, 'text-anchor': 'middle', fill: '#cfe0f0', 'font-size': 10, 'letter-spacing': 1, 'stroke-width': 3, ...vc}, ngoai).textContent = `${b.xong.toLocaleString('vi-VN')} / ${b.tong.toLocaleString('vi-VN')}`;
    el('circle', {cx: x + 44, cy: y - 44, r: 5, fill: mau, filter: 'url(#sang)', class: b.tt === 'dang' ? 'vt-nhay' : ''}, ngoai);
    const nen = {stroke: '#040a15', 'stroke-width': 5, 'paint-order': 'stroke', 'stroke-linejoin': 'round'};
    el('text', {x, y: y + 99, 'text-anchor': 'middle', fill: '#cfe8ff', 'font-size': 13, 'font-weight': 700, 'font-family': 'Orbitron', 'letter-spacing': 1, ...nen}, ngoai).textContent = TEN_NGAN[b.ma] || b.ten.toUpperCase();
    el('text', {x, y: y + 116, 'text-anchor': 'middle', fill: b.tt === 'cho' ? '#8aa4bd' : mau, 'font-size': 10.5, 'font-weight': 700, 'letter-spacing': .6, class: b.tt === 'dang' ? 'vt-nhay' : '', ...nen, 'stroke-width': 3.5}, ngoai).textContent = chuPhu(b);
    if (b.tt === 'dang') {                            // biển ▶ ĐANG CHẠY trên đầu trạm
      const bt = el('g', {class: 'vt-nhay2'}, ngoai);
      el('rect', {x: x - 52, y: y - 104, width: 104, height: 19, rx: 2, fill: 'rgba(255,176,32,.16)', stroke: mau, 'stroke-width': 1.2, filter: 'url(#sang)'}, bt);
      el('text', {x, y: y - 90.5, 'text-anchor': 'middle', fill: mau, 'font-size': 10.5, 'font-weight': 900, 'font-family': 'Orbitron', 'letter-spacing': 1.2}, bt).textContent = '▶ ĐANG CHẠY';
    }
  });
  veNenVuTru();
}
function veDau(lo, bs, so_clip) {
  const tong = bs.reduce((a, b) => a + (b.tong ? Math.min(1, b.xong / b.tong) : 0), 0), pc = Math.round(tong * 100 / Math.max(1, bs.length));
  const dem = k => bs.filter(b => b.tt === k).length, dang = bs.filter(b => b.tt === 'dang');
  $v('#vt-dau').innerHTML = `<div class="vt-logo"><div class="l1">DÂY CHUYỀN SỬA VIDEO</div><div class="l2">LÔ ${escv(lo)}${so_clip ? ' · ' + so_clip + ' CLIP' : ''} · ${bs.length} TRẠM NỐI CHUỖI</div></div>
    <div class="vt-tien"><b>${pc}<small>%</small></b><div class="vt-thanh ${dang.length ? 'chay' : ''}"><i style="width:${pc}%"></i></div></div>
    <div class="vt-chips"><span class="vt-chip x">XONG<b>${dem('xong')}</b></span><span class="vt-chip v">ĐANG CHẠY<b>${dang.length}</b></span>
    <span class="vt-chip c">LÀM DỞ<b>${dem('mot_phan')}</b></span><span class="vt-chip d">LỖI<b>${dem('loi')}</b></span><span class="vt-chip">CHỜ<b>${dem('cho')}</b></span>
    ${dang.length ? `<span class="vt-chip v">▶<b style="margin-left:4px">${dang.map(b => escv(TEN_NGAN[b.ma] || b.ten)).join(' · ')}</b></span>` : ''}</div>`;
}
const CSS = `
#sv-vt{margin:10px 0 4px;position:relative;border:1px solid rgba(0,229,255,.16);border-radius:4px;background:linear-gradient(180deg,rgba(8,17,32,.95),rgba(4,9,18,.95));overflow:hidden}
#sv-vt:before,#sv-vt:after{content:"";position:absolute;width:14px;height:14px;border:2px solid #00e5ff;opacity:.7;z-index:3}
#sv-vt:before{left:-1px;top:-1px;border-right:0;border-bottom:0}#sv-vt:after{right:-1px;bottom:-1px;border-left:0;border-top:0}
#vt-dau{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;padding:10px 16px;border-bottom:1px solid rgba(0,229,255,.16);background:linear-gradient(180deg,#071226,#040910);font-family:"JetBrains Mono",Consolas,monospace}
.vt-logo{font:900 17px Orbitron,"Segoe UI",sans-serif;letter-spacing:.14em;color:#fff;text-shadow:0 0 10px #00e5ff,0 0 22px rgba(0,229,255,.5);line-height:1.25}
.vt-logo .l2{font-size:11.5px;font-weight:700;letter-spacing:.14em;color:#00e5ff}
.vt-tien{display:flex;align-items:center;gap:12px;flex:1;min-width:260px}
.vt-tien b{font:900 30px Orbitron,sans-serif;color:#fff;text-shadow:0 0 12px #39ff88}.vt-tien b small{font-size:15px;margin-left:2px}
.vt-thanh{flex:1;height:8px;background:#0b1a2c;border:1px solid rgba(0,229,255,.25);border-radius:2px;overflow:hidden}
.vt-thanh i{display:block;height:100%;background:linear-gradient(90deg,#00e5ff,#39ff88);box-shadow:0 0 12px #39ff88}
.vt-thanh.chay i{background:repeating-linear-gradient(-45deg,#00e5ff 0 10px,#39ff88 10px 20px);background-size:28px 28px;animation:vtThanh 1s linear infinite}
@keyframes vtThanh{to{background-position:28px 0}}
.vt-chips{display:flex;flex-wrap:wrap;gap:8px}
.vt-chip{border:1px solid rgba(0,229,255,.16);background:rgba(0,229,255,.04);padding:4px 10px;font-size:11px;color:#5f7891;letter-spacing:.06em;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)}
.vt-chip b{color:#cfe8ff;font-weight:700;margin-left:6px}.vt-chip.x b{color:#39ff88}.vt-chip.v b{color:#ffb020}.vt-chip.c b{color:#00e5ff}.vt-chip.d b{color:#ff3355}
.vt-chip.v{border-color:rgba(255,176,32,.45)}
#vt-khung{position:relative;background:#02040c;overflow:hidden}
#vt-khung:after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px)}
#vt-nen{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
#vt-thienha{position:absolute;left:0;top:0;pointer-events:none}
#vt-thienha .troi{animation:vtTroi 26s ease-in-out infinite}#vt-thienha .nghieng{transform:rotate(-12deg) scaleY(.54)}
#vt-thienha canvas{display:block;animation:vtQuay 70s linear infinite}
@keyframes vtQuay{to{transform:rotate(360deg)}}
@keyframes vtTroi{0%,100%{transform:translate(-14px,6px)}33%{transform:translate(12px,-10px)}66%{transform:translate(-4px,12px)}}
#vt-sv{display:block;width:100%;height:auto;position:relative}
#vt-sv .can{stroke-linecap:round;fill:none}
#vt-sv .vt-chay{stroke-dasharray:3 9;animation:vtDong 1s linear infinite}
@keyframes vtDong{to{stroke-dashoffset:-12}}
#vt-sv .vt-vong{transform-box:fill-box;transform-origin:center;animation:vtQuay 14s linear infinite}
#vt-sv .vt-vong.n{animation-duration:22s;animation-direction:reverse}
#vt-sv .vt-tram{cursor:pointer}#vt-sv .vt-tram:hover .luc{stroke-width:3.5}
#vt-sv .vt-tram.on .luc{stroke:#fff;stroke-width:4}
#vt-sv .vt-nhay{animation:vtNhay 1.4s ease-in-out infinite}#vt-sv .vt-nhay2{animation:vtNhay 1.1s ease-in-out infinite}
@keyframes vtNhay{50%{opacity:.25}}
@media(prefers-reduced-motion:reduce){#sv-vt *{animation:none!important}}`;
let KHOA = '', LO = '', BS = [], SO_CLIP = 0, MA = null;
function damBao() {
  const hop = document.getElementById('sv-vt');
  if (!hop || hop.dataset.co) return hop;
  hop.dataset.co = 1;
  if (!document.getElementById('vt-css')) {
    const st = document.createElement('style'); st.id = 'vt-css'; st.textContent = CSS; document.head.appendChild(st);
    const f = document.createElement('link'); f.rel = 'stylesheet'; f.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;600;700&display=swap'; document.head.appendChild(f);
  }
  hop.innerHTML = `<div id="vt-dau"></div><div id="vt-khung"><canvas id="vt-nen"></canvas><div id="vt-thienha"><div class="troi"><div class="nghieng"><canvas></canvas></div></div></div><svg id="vt-sv" role="img" aria-label="Dây chuyền sửa video: các trạm nối chuỗi"></svg></div>`;
  return hop;
}
function chon(ma) { document.querySelectorAll('#vt-sv .vt-tram').forEach(g => g.classList.toggle('on', !!ma && g.dataset.tram === LO + '|' + ma)); }
// gọi từ quan_ly.html mỗi lần có số liệu mới; chỉ vẽ lại sơ đồ khi số liệu đổi (vẽ lại làm hoạt cảnh chạy lại từ đầu)
window.VTDC = {
  ve(lo, bs, ma_chon, so_clip) {
    const hop = damBao(); if (!hop) return;
    hop.style.display = '';
    LO = lo; BS = bs; SO_CLIP = so_clip;
    const khoa = lo + JSON.stringify(bs.map(b => [b.ma, b.tt, b.xong, b.tong, chuPhu(b)])) + '|' + ($v('#vt-khung').clientWidth || 0);
    veDau(lo, bs, so_clip);
    if (khoa !== KHOA) { KHOA = khoa; veSo(lo, bs); }
    MA = ma_chon; chon(ma_chon);
  },
  an() { const h = document.getElementById('sv-vt'); if (h) h.style.display = 'none'; },
};
let hen = null;
addEventListener('resize', () => { clearTimeout(hen); hen = setTimeout(() => { if (LO) { KHOA = ''; VTDC.ve(LO, BS, MA, SO_CLIP); } }, 250); });
})();
