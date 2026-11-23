(function(){
  var $=function(i){return document.getElementById(i)};
  var nome=$("nome"),data=$("data"),hora=$("hora"),KEY="contagem-v1",timer=null,lastText="";
  function pl(n,s,p){return n+" "+(n===1?s:p)}
  function pad(n){return String(n).padStart(2,"0")}
  function store(){try{localStorage.setItem(KEY,JSON.stringify({n:nome.value,d:data.value,h:hora.value}))}catch(e){}}
  function load(){try{var v=JSON.parse(localStorage.getItem(KEY)||"null");if(v){nome.value=v.n||"";data.value=v.d||"";hora.value=v.h||"00:00"}}catch(e){}}
  function target(){
    if(!data.value)return null;
    var p=data.value.split("-"),t=(hora.value||"00:00").split(":");
    return new Date(+p[0],+p[1]-1,+p[2],+t[0],+t[1],0);
  }
  function fmtDate(t){return pad(t.getDate())+"/"+pad(t.getMonth()+1)+"/"+t.getFullYear()+" às "+pad(t.getHours())+":"+pad(t.getMinutes())}
  function render(){
    var t=target();
    clearInterval(timer);
    if(!t||isNaN(t)){$("empty").hidden=false;$("out").hidden=true;return}
    $("empty").hidden=true;$("out").hidden=false;
    $("ev").textContent=(nome.value.trim()?nome.value.trim()+" · ":"")+fmtDate(t);
    tick();timer=setInterval(tick,1000);
  }
  function tick(){
    var t=target(),diff=t-new Date(),past=diff<0,a=Math.abs(diff);
    var d=Math.floor(a/864e5),h=Math.floor(a%864e5/36e5),m=Math.floor(a%36e5/6e4),s=Math.floor(a%6e4/1e3);
    var title=nome.value.trim(),when=fmtDate(t);
    $("d").textContent=d;$("h").textContent=h;$("m").textContent=m;
    $("dl").textContent=d===1?"dia":"dias";$("hl").textContent=h===1?"hora":"horas";$("ml").textContent=m===1?"minuto":"minutos";
    $("s").textContent="e "+pl(s,"segundo","segundos");
    var parts=pl(d,"dia","dias")+", "+pl(h,"hora","horas")+" e "+pl(m,"minuto","minutos");
    var head,line;
    if(past){
      head="Já passou: "+parts+" atrás";
      $("past").hidden=false;$("past").textContent="Essa data já passou há "+parts+".";
      $("count").hidden=true;
    }else{
      head="Faltam "+parts;
      $("past").hidden=true;$("count").hidden=false;
    }
    line=(title?"🎯 "+title+"\n":"")+"📅 "+when;
    lastText="⏳ "+head+"\n"+line;
  }
  function flash(ok){
    var b=$("copy");b.classList.toggle("done",ok);$("copyTxt").textContent=ok?"Copiado!":"Não foi possível copiar";
    setTimeout(function(){b.classList.remove("done");$("copyTxt").textContent="Copiar resultado"},1800);
  }
  function fallback(txt){
    var ta=document.createElement("textarea");ta.value=txt;ta.style.position="fixed";ta.style.opacity="0";
    document.body.appendChild(ta);ta.select();var ok=false;
    try{ok=document.execCommand("copy")}catch(e){}
    document.body.removeChild(ta);flash(ok);
  }
  $("copy").addEventListener("click",function(){
    tick();
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(lastText).then(function(){flash(true)},function(){fallback(lastText)});
    }else fallback(lastText);
  });
  function nextOf(mo,dy){
    var n=new Date(),y=n.getFullYear(),c=new Date(y,mo,dy);
    if(c<=n)c=new Date(y+1,mo,dy);return c;
  }
  [["🎄 Natal",11,25],["🎆 Ano-Novo",0,1]].forEach(function(p){
    var b=document.createElement("button");b.type="button";b.className="chip";b.textContent=p[0];
    b.addEventListener("click",function(){
      var c=nextOf(p[1],p[2]);data.value=c.getFullYear()+"-"+pad(c.getMonth()+1)+"-"+pad(c.getDate());
      hora.value="00:00";nome.value=p[0].replace(/^\S+\s/,"");store();render();
    });
    $("chips").appendChild(b);
  });
  [nome,data,hora].forEach(function(el){el.addEventListener("input",function(){store();render()})});
  load();render();
})();
