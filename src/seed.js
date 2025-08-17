import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

async function w(name, rows){ await fs.writeFile(path.join(DATA_DIR, name+'.json'), JSON.stringify(rows,null,2)); }

function uid(p){ return p + '_' + Math.random().toString(36).slice(2,9); }

const doctors=['Dr. Elif','Dr. Kerem','Dr. Aylin'];
const users = doctors.map(n=>({id:uid('u'), name:n, role:'Hekim'}));
const patients = Array.from({length: 25}).map((_,i)=>({id:uid('pat'), name:`Hasta ${i+1}`, phone:'+90 5'+Math.floor(100000000+Math.random()*899999999), birth: 1980+Math.floor(Math.random()*30), notes:'', createdAt:new Date().toISOString(), teeth:{}}));
const appts = Array.from({length: 20}).map(()=>{
  const d = new Date(); d.setHours(9+Math.floor(Math.random()*8), [0,15,30,45][Math.floor(Math.random()*4)],0,0);
  return {id:uid('appt'), patientId: patients[Math.floor(Math.random()*patients.length)].id, doctor: doctors[Math.floor(Math.random()*doctors.length)], start: d.toISOString(), duration:30, status: ['Onaylı','Beklemede','Geldi','İptal'][Math.floor(Math.random()*4)], createdAt:new Date().toISOString(), price: 300+Math.floor(Math.random()*1500)};
});
const inventory=[{id:uid('inv'),name:'İmplant Vida',stock:12,unit:'adet'},{id:uid('inv'),name:'Anestezik',stock:34,unit:'flakon'},{id:uid('inv'),name:'Kompozit',stock:20,unit:'şırınga'}];
const invoices=[];
const audit=[];

await fs.mkdir(DATA_DIR, {recursive:true});
await w('users', users);
await w('patients', patients);
await w('appts', appts);
await w('inventory', inventory);
await w('invoices', invoices);
await w('audit', audit);

console.log('✅ Örnek veriler hazır. data/*.json');
