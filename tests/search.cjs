const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),zlib=require('node:zlib'),path=require('node:path');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const file of ['site-chunk-0.js','site-chunk-1.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const html=zlib.gunzipSync(Buffer.from(ctx.window.__HB_SITE,'base64')).toString();
const unpack=name=>JSON.parse(zlib.gunzipSync(Buffer.from(html.match(new RegExp('const '+name+'_DATA="([^"]+)'))[1],'base64')));
const catalog=unpack('CATALOG'),firearms=unpack('FIREARMS'),S=require('../search.js');
const ids=q=>S.search(catalog,q).map(h=>h.brand+'|'+h.code).sort();
for(const [expected,variants] of [
 ['Smith',['Смит','смид','Сми','Smit','Smid','סמית','смит и вессон']],
 ['Shield Plus',['шилд плюс','шильд плюс','шилт плюс','шил плюс','שילד פלוס']],
 ['Bodyguard 2.0',['бодигард 2.0','боди гард 2.0','бодигуард 2.0']],
 ['Hellcat',['хеллкат','хелкат','хэллкэт']],['Ramon',['рамон','רמון']],['Masada',['масада','массада','מצדה']],
 ['Jericho',['джерико','джерихо','иерихон','יריחו']],['Shadow 2',['шэдоу 2','шадоу 2']],
 ['P365',['п365','Р365','пи 365','п 365','P-365','пи триста шестьдесят пять']],['P365 XL',['п365 хл','пи 365 икс эль']],
 ['P320',['п320','пи320','пи триста двадцать']],['Glock 19',['глок19','глок 19','גלוק 19','G19','г19','глок девятнадцать']],
 ['CZ P-10 C',['чз п10 си','чезет п10 си']],['M&P',['мп','эм пи']],['Walther PDP',['вальтер пдп']],
 ['SIG P226',['сиг п226','зиг зауэр п226']]
])for(const q of variants){assert(ids(expected).length>0,expected);assert.deepEqual(ids(q),ids(expected),q+' should equal '+expected)}
// Every listed firearm must find every catalog item declaring that exact fit.
let pairs=0;for(const f of firearms){const result=S.search(catalog,f.brand+' '+f.model);for(const h of catalog.filter(h=>h.fits.some(x=>x.brand===f.brand&&x.model===f.model))){assert(result.includes(h),f.brand+' '+f.model+' missing '+h.code);pairs++}}
assert(!S.matches('Glock 17','Glock 19'));assert(!S.matches('SIG P365','P366'));assert(!S.matches('Glock 19','Glock 1'));
assert(S.matches('Shield','Sheild'));assert(S.matches('Smith','Сми'));
// Tokens from unrelated fit rows must not combine into a fictitious compatible model.
const fake={brand:'Fobus',code:'TEST',name:'',description:'',fits:[{brand:'Glock',model:'17'},{brand:'SIG',model:'19'}]};assert.equal(S.search([fake],'Glock 19').length,0);
assert.equal(S.search(catalog,'несуществующаямодель99999').length,0);assert.equal(S.search(catalog,'').length,126);
console.log(`Passed: multilingual aliases, numeric exclusions, all ${firearms.length} firearm models (${pairs} compatibility pairs), empty/unknown queries.`);
