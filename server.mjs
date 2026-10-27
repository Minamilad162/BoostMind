import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const useDist = process.argv.includes('--dist');
const root = useDist ? 'dist' : '.';
const port = Number(process.env.PORT || 5173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.ico':'image/x-icon','.webp':'image/webp'};

async function resolveFile(pathname){
  const clean=normalize(pathname).replace(/^([.][.][/\\])+/, '').replace(/^[/\\]+/, '');
  const candidates=[];
  if(useDist){ candidates.push(join(root,clean)); }
  else{
    candidates.push(join(root,clean));
    candidates.push(join(root,'public',clean));
  }
  for(let f of candidates){
    try{ const s=await stat(f); if(s.isDirectory()) f=join(f,'index.html'); await stat(f); return f; }catch{}
  }
  return null;
}

http.createServer(async(req,res)=>{
  try{
    const u=new URL(req.url,'http://localhost');
    let p=decodeURIComponent(u.pathname);
    if(p==='/'||p==='')p='/index.html';
    const f=await resolveFile(p);
    if(!f) throw new Error('not found');
    const data=await readFile(f);
    res.writeHead(200,{'Content-Type':types[extname(f).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(data);
  }catch{
    try{
      const f=useDist?join('dist','index.html'):join('.','index.html');
      const data=await readFile(f);
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});
      res.end(data);
    }catch{res.writeHead(404);res.end('Not found')}
  }
}).listen(port,()=>console.log(`Boost Mind v33 running at http://localhost:${port}`));
