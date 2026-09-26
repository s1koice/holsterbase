/* Shared catalog/admin search. Numeric model codes never use fuzzy matching. */
(function(root){
'use strict';
const groups=[
 ['smith','smith & wesson','smith and wesson','smith wesson','s&w','s w','sw','smit','smi','smid','смит','смид','сми','смит и вессон','смит энд вессон','смит вессон','смит вессон','смитт','סמית','סמיט','סמית ווסון'],
 ['glock','глок','глокк','глог','גלוק'],['sig','sig sauer','зиг зауэр','сиг зауэр','зиг зауер','сиг зауер','зиг','сиг','זיג זאואר','סיג זאואר','זיג','סיג'],
 ['cz','чезет','чезэт','чизет','чз','цз','си зет','си зи','סי זד'],['walther','вальтер','валтер','וולטר'],['beretta','беретта','берета','ברטה'],
 ['ruger','ругер','рюгер','רוגר'],['taurus','таурус','торус','טאורוס'],['springfield','спрингфилд','спрингфильд','ספרינגפילד'],
 ['canik','каник','джаник','קאניק'],['colt','кольт','קולט'],['kimber','кимбер','קימבר'],['iwi','айвиай','ивиай'],
 ['fobus','фобус','פובוס'],['orpaz','орпаз','אורפז'],['hk','h&k','h k','heckler & koch','heckler koch','хеклер кох','хеклер','хеклер и кох'],
 ['bul','бул','בול'],['staccato','стаккато','стакадто','стакаато','סטקטו'],['emtan','эмтан','емтан','эметан','אמתן'],
 ['bersa','берса'],['fn','эф эн','фн'],['girsan','гирсан'],['grand power','гранд пауэр','гранд павер'],['hs produkt','хс продукт'],
 ['hi point','хай поинт','хайпоинт'],['mossberg','моссберг','мосберг'],['nighthawk','найтхок','найтхоук'],['norinco','норинко'],
 ['psa','пса'],['remington','ремингтон'],['sccy','скки','скай'],['sti','сти'],['sarsilmaz','сарсилмаз','сарсильмаз'],
 ['savage','сэвидж','саваж','севедж'],['shadow systems','шэдоу системс','шадоу системс'],['steyr','штайр','штеер','штейр'],
 ['tanfoglio','танфольо','танфоглио'],['tisas','тисас'],
 // Model names and common spoken names, independent of manufacturer.
 ['shield','шилд','шильд','шилт','щит','שילד'],['plus','плюс','פלוס'],['bodyguard','body guard','бодигард','боди гард','бодигуард','боди гуард','באדיגארד'],
 ['hellcat','hell cat','хеллкат','хелкат','хелкет','хэллкэт','хеллкэт','הלקט'],['echelon','эшелон','эшалон','эшэлон','אשלון'],
 ['jericho','джерико','джерихо','джерихон','иерихон','ерихо','יריחו','ג׳ריקו'],['masada','масада','массада','מצדה'],['ramon','рамон','רמון'],
 ['shadow','шэдоу','шадоу','шедоу','שאדו'],['compact','компакт','компактный','קומפקט'],['subcompact','субкомпакт'],['slim','слим','סלים'],
 ['pro','про','פרו'],['xmacro','x macro','икс макро','х макро','хмакро','экс макро','макро','איקס מקרו'],['xl','икс эль','хл','אקס אל'],
 ['x','икс','экс','איקס'],['gen','поколение','ген','דור'],['mp','m&p','m p','эм энд пи','эм пи','мп','м п','אם פי'],
 ['pdp','пдп','пи ди пи'],['ppq','ппкью','пи пи кью'],['pps','ппс'],['ppk','ппк'],['usp','усп','юсп','ю эс пи'],['vp','вп','ви пи'],
 ['xdm','хдм','икс ди эм'],['xds','хдс','икс ди эс'],['xd','хд','икс ди'],['apx','апх','эй пи икс'],
 ['tp','тп','ти пи'],['px','пх','пи икс'],['p','пи','пэ'],['g','джи','гэ'],['c','си'],['f','эф'],['s','эс'],
 ['security','секьюрити','секурити'],['american','американ'],['lcp','лсп','эл си пи'],['lc','лс','эл си'],['max','макс'],['rxm','рхм','ар икс эм'],
 ['micro','микро'],['dagger','даггер','дагер'],['prodigy','продиджи','продиджи'],['operator','оператор'],['emissary','эмиссари'],
 ['eclipse','эклипс'],['thunder','тандер'],['storm','сторм'],['inox','инокс'],['vertec','вертек'],['elite','элит','элита'],
 ['witness','витнес'],['judge','джадж'],['millennium','миллениум','миллениум'],['stance','станс','стэнс'],['five seven','файв севен','файв сэвен'],
 ['government','говернмент'],['gold cup','голд кап'],['delta','дельта'],['axe','акс'],['hatchet','хэтчет'],['socom','соком'],
 ['polymer','полимер','полимерный'],['steel','сталь','стальной'],['full size','фул сайз','фулл сайз','полноразмерный'],
 ['365','триста шестьдесят пять'],['320','триста двадцать'],['226','двести двадцать шесть'],['19','девятнадцать'],['17','семнадцать'],['43','сорок три']
];
const ru={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sh',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
function basic(v){return String(v||'').normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f\u0591-\u05c7]/g,'').replace(/ё/g,'е').replace(/[^a-z0-9а-яא-ת]+/g,' ').trim().replace(/\s+/g,' ')}
const aliases=new Map();for(const group of groups)for(const alias of group)aliases.set(basic(alias),basic(group[0]));
const prefixes=new Map();for(const [alias,canonical] of aliases){if(alias.includes(' ')||!/[а-яא-ת]/.test(alias))continue;for(let i=3;i<alias.length;i++){const p=alias.slice(0,i);if(!prefixes.has(p))prefixes.set(p,new Set());prefixes.get(p).add(canonical)}}const partialAliases=new Map(aliases);for(const [prefix,values] of prefixes)if(values.size===1&&!aliases.has(prefix))partialAliases.set(prefix,[...values][0]);
const pattern=new RegExp('(^| )('+[...aliases.keys()].sort((a,b)=>b.length-a.length).join('|')+')(?= |$)','g');
const partialPattern=new RegExp('(^| )('+[...partialAliases.keys()].sort((a,b)=>b.length-a.length).join('|')+')(?= |$)','g');
function normalize(v,partial=false){
 let t=basic(v).replace(/([a-zа-я])([0-9])/g,'$1 $2').replace(/([0-9])([a-zа-я])/g,'$1 $2');
 t=t.replace(/(\d) ([хсф])(?= |$)/g,(_,digit,letter)=>digit+' '+({х:'x',с:'c',ф:'f'}[letter]));
 // Map aliases once, avoiding cascading substitutions of canonical names.
 t=t.replace(partial?partialPattern:pattern,(_,space,word,offset,source)=>partial&&!aliases.has(word)&&/^ \d/.test(source.slice(offset+_.length))?_:space+(partial?partialAliases:aliases).get(word));
 t=t.replace(/[а-я]/g,c=>ru[c]??c);
 // Cyrillic visual spellings of Latin model codes (Р365, СZ etc.).
 t=t.replace(/\br (?=\d)/g,'p ').replace(/\b(?:g|gl) (?=\d)/g,'glock ');
 t=t.replace(/\b(p|sp|vp|tp|px|mp|m|fns|fn|lc|lcp|sr|gp|rxm|mr|mc|gx|g|pt|th|tx|sar|st|cpx|hs|nc|sw|ec) (\d+)/g,'$1$2');
 t=t.replace(/(\d) (x|xl|sfx|sf|s|c|f|b|bd|d|a|nd|pro)\b/g,'$1$2');
 return t.trim().replace(/\s+/g,' ');
}
function distance(a,b,limit){if(Math.abs(a.length-b.length)>limit)return limit+1;let prev=Array.from({length:b.length+1},(_,i)=>i),before;for(let i=1;i<=a.length;i++){const row=[i];for(let j=1;j<=b.length;j++){row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]!==b[j-1]));if(before&&i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])row[j]=Math.min(row[j],before[j-2]+1)}before=prev;prev=row}return prev[b.length]}
function tokenScore(word,q){
 if(word===q)return 0;
 if(/^\d+$/.test(q)&&word.match(/^[a-z]+(\d+)[a-z]*$/)?.[1]===q)return 1;
 if(/\d/.test(q)||/\d/.test(word))return word.startsWith(q)&&q.length>=2&&!/^\d/.test(word.slice(q.length))?1:Infinity;
 if(word.startsWith(q))return 1;
 if(q.length<4||word.length<4)return Infinity;
 const limit=q.length>=7?2:1;return distance(word,q,limit)<=limit?3:Infinity;
}
function textScore(text,query){if(!query)return 0;const words=text.split(' '),tokens=query.split(' ');let score=0;for(const q of tokens){const best=Math.min(...words.map(w=>tokenScore(w,q)));if(!Number.isFinite(best))return Infinity;score+=best}return score}
function matches(text,query){return Number.isFinite(textScore(normalize(text),normalize(query,true)))}
const cache=new WeakMap();
function entry(h){if(!cache.has(h))cache.set(h,{fits:h.fits.map(f=>normalize(f.brand+' '+f.model)),code:normalize(h.code),other:normalize([h.brand,h.name,h.description,h.carry].join(' '))});return cache.get(h)}
function score(h,query){const q=normalize(query,true);if(!q)return 0;const e=entry(h);return Math.min(...e.fits.map(f=>textScore(f,q)),20+textScore(e.code,q),40+textScore(e.other,q))}
function search(rows,query){if(!String(query).trim())return rows;return rows.map((h,i)=>({h,i,s:score(h,query)})).filter(x=>Number.isFinite(x.s)).sort((a,b)=>a.s-b.s||a.i-b.i).map(x=>x.h)}
function suggestions(rows,query,limit=8){if(!String(query).trim())return [];const counts=new Map();for(const h of rows){const seen=new Set();for(const f of h.fits){const name=f.brand+' '+f.model;if(seen.has(name))continue;seen.add(name);const rank=textScore(normalize(name),normalize(query,true))+(normalize(f.model)===normalize(query,true)?-1:0);if(!Number.isFinite(rank))continue;const item=counts.get(name)||{brand:f.brand,model:f.model,name,count:0,rank};item.count++;counts.set(name,item)}}return [...counts.values()].sort((a,b)=>a.rank-b.rank||b.count-a.count||a.name.localeCompare(b.name)).slice(0,limit)}
root.HBSearch={normalize,matches,score,search,suggestions};
if(typeof module!=='undefined')module.exports=root.HBSearch;
})(typeof window!=='undefined'?window:globalThis);
