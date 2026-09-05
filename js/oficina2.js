// Mesa Estelar v46.83.1
// Primeira extração funcional da Oficina 2.
// Este módulo NÃO acessa Firebase, labEstado_, objetosMapaDB ou o Mapa da Mesa.

export const gmOficinaV2Cfg_ = {
  ativo: false,
  ferramenta: 'traco',
  cor: '#ffcf4d',
  tamanho: 7,
  opacidade: 1,
  pincel: 'redondo',
  texturaTraco: 'solida'
};

export const gm580_ = {
  mode: 'select',
  selection: new Set(),
  borderColor: '#111111',
  borderWidth: 0,
  borderOpacity: 1
};

export function gmOficinaV2CorRgb_(hex) {
  const h = String(hex || '#ffcf4d').replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(h)) return '255/207/77';
  return `${parseInt(h.slice(0,2),16)}/${parseInt(h.slice(2,4),16)}/${parseInt(h.slice(4,6),16)}`;
}

export function gmOficinaV2Hex_(r,g,b) {
  const q = n => Math.max(0, Math.min(255, Number(n) || 0)).toString(16).padStart(2, '0');
  return `#${q(r)}${q(g)}${q(b)}`;
}

export function gm580Key_(t,id) {
  return `${t}§${id}`;
}

export function gm580Esc_(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

export function gm580Hex_(v, fb='#111111') {
  let x = String(v || '').trim();
  if (!x) return fb;
  if (!x.startsWith('#')) x = '#' + x;
  if (/^#[0-9a-f]{3}$/i.test(x)) x = '#' + x[1]+x[1]+x[2]+x[2]+x[3]+x[3];
  return /^#[0-9a-f]{6}$/i.test(x) ? x.toUpperCase() : fb;
}

export function gm580Rgb_(h) {
  h = gm580Hex_(h).slice(1);
  return [
    parseInt(h.slice(0,2),16),
    parseInt(h.slice(2,4),16),
    parseInt(h.slice(4,6),16)
  ];
}

export function gm580RgbHex_(v) {
  const m = String(v || '').match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
  if (!m) return null;
  return '#' + [m[1],m[2],m[3]]
    .map(n => Math.max(0,Math.min(255,Number(n)||0)).toString(16).padStart(2,'0'))
    .join('').toUpperCase();
}

export function gm580BBox_(it) {
  const r = it.ref;
  if (it.type === 'object') {
    const w = Math.max(.05, Number(r.larguraM || 1));
    const h = Math.max(.05, Number(r.alturaM || 1));
    return {x:Number(r.x||0)-w/2, y:Number(r.y||0)-h/2, w, h};
  }
  if (it.type === 'shape') {
    if (String(r.tipo || '').startsWith('linha')) {
      const x1=Number(r.x||0), y1=Number(r.y||0);
      const x2=Number(r.x2??x1), y2=Number(r.y2??y1);
      return {
        x:Math.min(x1,x2), y:Math.min(y1,y2),
        w:Math.max(.05,Math.abs(x2-x1)),
        h:Math.max(.05,Math.abs(y2-y1))
      };
    }
    return {
      x:Number(r.x||0), y:Number(r.y||0),
      w:Math.max(.05,Math.abs(Number(r.w||.05))),
      h:Math.max(.05,Math.abs(Number(r.h||.05)))
    };
  }
  const pts = r.pts || [];
  if (!pts.length) return {x:0,y:0,w:0,h:0};
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
  return {
    x:Math.min(...xs), y:Math.min(...ys),
    w:Math.max(.05,Math.max(...xs)-Math.min(...xs)),
    h:Math.max(.05,Math.max(...ys)-Math.min(...ys))
  };
}

export function gm580Intersects_(a,b) {
  return a.x<=b.x+b.w && a.x+a.w>=b.x && a.y<=b.y+b.h && a.y+a.h>=b.y;
}
