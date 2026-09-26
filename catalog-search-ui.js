(function(){
'use strict';
const input=document.getElementById('textSearch');
input.placeholder='Шилд плюс, Рамон, п365, Глок 19…';
input.setAttribute('aria-label','Поиск по модели пистолета');
input.setAttribute('aria-describedby','modelSearchHelp');
const heading=input.previousElementSibling;if(heading)heading.textContent='Модель пистолета';
const help=document.createElement('p');help.id='modelSearchHelp';help.className='hb-search-help';help.textContent='Название на русском, английском или иврите. Можно без производителя.';
const suggestions=document.createElement('div');suggestions.className='hb-suggestions';suggestions.setAttribute('aria-label','Подходящие модели');
input.after(help,suggestions);
const quick=document.createElement('div');quick.className='hb-model-shortcuts';quick.setAttribute('role','group');quick.setAttribute('aria-label','Популярные модели пистолетов');
document.querySelector('.layout').before(quick);
const models=[['Glock 19','Glock','19'],['Glock 43X','Glock','43X'],['P365','SIG Sauer','P365'],['P320','SIG Sauer','P320'],['Shield Plus','Smith & Wesson','Shield Plus'],['Bodyguard 2.0','Smith & Wesson','Bodyguard 2.0'],['Hellcat','Springfield','Hellcat'],['Ramon','Emtan','Ramon'],['Masada','IWI','Masada'],['Jericho 941','IWI','Jericho 941 Steel'],['Shadow 2','CZ','Shadow 2 Compact']];
function choose(brand,model){document.getElementById('gunBrand').value=brand;updateModels();document.getElementById('gunModel').value=model;input.value='';render();refresh()}
function refresh(){
 suggestions.replaceChildren();
 for(const item of HBSearch.suggestions(catalog,input.value)){const b=document.createElement('button');b.type='button';b.className='hb-model-suggestion';b.textContent=item.name+' · '+item.count;b.onclick=()=>choose(item.brand,item.model);suggestions.append(b)}
 quick.replaceChildren();const label=document.createElement('span');label.textContent='Популярные модели:';quick.append(label);
 for(const [title,brand,model] of models){if(!catalog.some(h=>h.fits.some(f=>f.brand===brand&&f.model===model)))continue;const b=document.createElement('button');b.type='button';b.textContent=title;b.setAttribute('aria-pressed',String(document.getElementById('gunBrand').value===brand&&document.getElementById('gunModel').value===model));b.onclick=()=>choose(brand,model);quick.append(b)}
 const reset=document.createElement('button');reset.type='button';reset.textContent='Все модели';reset.onclick=()=>{document.getElementById('gunBrand').value='';updateModels();document.getElementById('gunModel').value='';input.value='';render();refresh()};quick.append(reset);
}
input.addEventListener('input',()=>{if(document.getElementById('gunModel').value||document.getElementById('gunBrand').value){document.getElementById('gunBrand').value='';updateModels();document.getElementById('gunModel').value='';render()}refresh()});
for(const id of ['gunBrand','gunModel','reset'])document.getElementById(id).addEventListener(id==='reset'?'click':'input',refresh);
const style=document.createElement('style');style.textContent='.hb-search-help{font-size:12px;color:#667085;line-height:1.5}.hb-suggestions{display:grid;gap:4px;margin:8px 0}.hb-model-suggestion{text-align:start;background:#f4f6fa;color:#344054;font-size:12px;font-weight:500;padding:8px}.hb-model-shortcuts{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;margin:0 0 20px}.hb-model-shortcuts span{font-size:12px;color:#667085}.hb-model-shortcuts button{background:none;color:#475467;padding:6px 0;border-radius:0;border-bottom:2px solid transparent}.hb-model-shortcuts button:hover,.hb-model-shortcuts button[aria-pressed=true]{color:#1e5eff;border-bottom-color:#1e5eff}.hb-model-shortcuts button:focus-visible,.hb-model-suggestion:focus-visible{outline:2px solid #1e5eff;outline-offset:3px}';document.head.append(style);
// The compressed catalog finishes loading asynchronously.
const ready=setInterval(()=>{if(catalog.length){clearInterval(ready);refresh()}},100);
})();
