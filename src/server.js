import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5050;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

const app = express();
app.use(cors());
app.use(express.json({limit: '2mb'}));

const collections = ['patients','appts','inventory','invoices','users','audit'];

// ensure data dir & files
async function ensureFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  for (const col of collections) {
    const p = path.join(DATA_DIR, `${col}.json`);
    try { await fs.access(p); } catch { await fs.writeFile(p, '[]', 'utf-8'); }
  }
}

function newId(prefix) {
  return `${prefix}_${crypto.randomBytes(5).toString('hex')}`;
}

async function readCol(col){
  const file = path.join(DATA_DIR, `${col}.json`);
  const txt = await fs.readFile(file,'utf-8');
  try { return JSON.parse(txt); } catch { return []; }
}
async function writeCol(col, data){
  const file = path.join(DATA_DIR, `${col}.json`);
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

// generic list with query, pagination and sort
app.get('/api/:col', async (req,res)=>{
  try{
    const { col } = req.params;
    if(!collections.includes(col)) return res.status(404).json({error:'collection not found'});
    let data = await readCol(col);
    const { q, offset='0', limit='100', sort, dir='asc' } = req.query;
    if(q){
      const k = q.toString().toLowerCase();
      data = data.filter(row => JSON.stringify(row).toLowerCase().includes(k));
    }
    if(sort){
      data = data.slice().sort((a,b)=>{
        const av=a[sort], bv=b[sort];
        if(av==null && bv==null) return 0;
        if(av==null) return dir==='asc' ? -1 : 1;
        if(bv==null) return dir==='asc' ? 1 : -1;
        if(av > bv) return dir==='asc'?1:-1;
        if(av < bv) return dir==='asc'?-1:1;
        return 0;
      });
    }
    const off = parseInt(offset); const lim = Math.min(parseInt(limit), 1000);
    return res.json({ total: data.length, items: data.slice(off, off+lim) });
  }catch(err){ console.error(err); res.status(500).json({error:'list failed'}); }
});

app.get('/api/:col/:id', async (req,res)=>{
  try{
    const { col, id } = req.params;
    if(!collections.includes(col)) return res.status(404).json({error:'collection not found'});
    const data = await readCol(col);
    const item = data.find(x=>x.id===id);
    if(!item) return res.status(404).json({error:'not found'});
    res.json(item);
  }catch(err){ res.status(500).json({error:'get failed'}); }
});

app.post('/api/:col', async (req,res)=>{
  try{
    const { col } = req.params;
    if(!collections.includes(col)) return res.status(404).json({error:'collection not found'});
    const body = req.body || {};
    if(!body.id) body.id = newId(col.slice(0,3));
    if(body.createdAt==null) body.createdAt = new Date().toISOString();
    const data = await readCol(col);
    data.push(body);
    await writeCol(col, data);
    if(col!=='audit') await logAudit('create', {col, id: body.id});
    res.status(201).json(body);
  }catch(err){ console.error(err); res.status(500).json({error:'create failed'}); }
});

app.put('/api/:col/:id', async (req,res)=>{
  try{
    const { col, id } = req.params;
    if(!collections.includes(col)) return res.status(404).json({error:'collection not found'});
    const data = await readCol(col);
    const idx = data.findIndex(x=>x.id===id);
    if(idx===-1) return res.status(404).json({error:'not found'});
    data[idx] = { ...data[idx], ...req.body, id };
    await writeCol(col, data);
    if(col!=='audit') await logAudit('update', {col, id});
    res.json(data[idx]);
  }catch(err){ res.status(500).json({error:'update failed'}); }
});

app.delete('/api/:col/:id', async (req,res)=>{
  try{
    const { col, id } = req.params;
    if(!collections.includes(col)) return res.status(404).json({error:'collection not found'});
    const data = await readCol(col);
    const idx = data.findIndex(x=>x.id===id);
    if(idx===-1) return res.status(404).json({error:'not found'});
    const [removed] = data.splice(idx,1);
    await writeCol(col, data);
    if(col!=='audit') await logAudit('delete', {col, id});
    res.json({ok:true, removed});
  }catch(err){ res.status(500).json({error:'delete failed'}); }
});

// bulk import for a collection
app.post('/api/:col/import', async (req,res)=>{
  try{
    const { col } = req.params;
    if(!collections.includes(col)) return res.status(404).json({error:'collection not found'});
    const rows = Array.isArray(req.body) ? req.body : [];
    const data = await readCol(col);
    for(const row of rows){
      if(!row.id) row.id = newId(col.slice(0,3));
      data.push(row);
    }
    await writeCol(col, data);
    await logAudit('import', {col, count: rows.length});
    res.json({ok:true, count: rows.length});
  }catch(err){ res.status(500).json({error:'import failed'}); }
});

// export / import all
app.get('/api/export/all', async (_req,res)=>{
  try{
    const out = {};
    for(const col of collections) out[col] = await readCol(col);
    res.json(out);
  }catch(err){ res.status(500).json({error:'export failed'}); }
});

app.post('/api/import/all', async (req,res)=>{
  try{
    const body = req.body || {};
    for(const col of collections){
      if(Array.isArray(body[col])) await writeCol(col, body[col]);
    }
    await logAudit('import_all', {cols: Object.keys(body)});
    res.json({ok:true});
  }catch(err){ res.status(500).json({error:'import all failed'}); }
});

app.get('/health', (_req,res)=> res.json({ ok:true, time:new Date().toISOString() }));

async function logAudit(action, detail){
  const data = await readCol('audit');
  data.push({ id: Date.now().toString(36)+Math.random().toString(36).slice(2,6), time: new Date().toISOString(), action, detail });
  await writeCol('audit', data);
}

// static hosting (optional): put your built SPA into ./public
const PUBLIC_DIR = process.env.PUBLIC_DIR || path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR));

// fallback for SPA
app.get('*', async (req,res,next)=>{
  try{
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    const stat = await fs.stat(indexPath).catch(()=>null);
    if(stat && stat.isFile()) return res.sendFile(indexPath);
    return next();
  }catch{ return next(); }
});

// boot
ensureFiles().then(()=>{
  app.listen(PORT, ()=>{
    console.log(`✅ Klinik backend hazır: http://localhost:${PORT}`);
    console.log(`📁 Veri dizini: ${DATA_DIR}`);
  });
});
