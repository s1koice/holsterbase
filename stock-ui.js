(function(){
'use strict';
const results=document.getElementById('results');
let state=null;
function decorate(){if(!state)return;for(const card of results.querySelectorAll(':scope > .card')){
 const key=card.dataset.stockId;if(!key)continue;
 const legacy=card.dataset.stockLegacyId||(card.dataset.stockLegacyId=HBStock.legacyId(card));
 const inStock=HBStock.read(state,key,legacy);let badge=card.querySelector(':scope > .hb-status');
 if(!inStock){if(badge)badge.remove();continue}
 if(!badge){badge=document.createElement('div');badge.className='hb-status';const text=document.createElement('span');text.className='hb-badge available';text.textContent='● Есть в наличии';badge.append(text);card.querySelector('.code').after(badge)}
}}
// Watch replacement of cards, not mutations caused by adding their badges.
new MutationObserver(decorate).observe(results,{childList:true});
async function load(){try{state=await HBStock.load();document.getElementById('stockLoadError')?.remove();decorate()}catch(error){if(document.getElementById('stockLoadError'))return;const notice=document.createElement('p');notice.id='stockLoadError';notice.setAttribute('role','status');notice.textContent='Не удалось загрузить наличие. ';const retry=document.createElement('button');retry.textContent='Повторить';retry.onclick=load;notice.append(retry);results.before(notice)}}
load();
if(!document.querySelector('.hb-admin-link')){const a=document.createElement('a');a.className='hb-admin-link';a.href='admin.html';a.textContent='Редактор ассортимента';document.body.append(a)}
})();
