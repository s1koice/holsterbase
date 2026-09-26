/* Stable availability identifiers shared by the editor and the catalog. */
(function(root){
'use strict';
const slug=value=>String(value||'').normalize('NFKC').toLowerCase().trim().replace(/[^a-z0-9а-яё]+/g,'-').replace(/^-+|-+$/g,'');
function id(item){return slug(item.brand)+':'+slug(item.code)}
function available(value){return value===true||!!(value&&typeof value==='object'&&value.available===true)}
function validate(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Неверный формат catalog-status.json');for(const value of Object.values(raw))if(typeof value!=='boolean'&&(!value||typeof value!=='object'||Array.isArray(value)||typeof value.available!=='boolean'))throw new Error('Неверная запись в catalog-status.json');return raw}
function hash(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
// Compatibility with JSON exported before stable model IDs were introduced.
function legacyId(card){const text=String(card.innerText||'').replace(/●?\s*Есть в наличии|Есть в ассортименте/g,'').replace(/\s+/g,' ').trim();return 'удержание-'+hash(text.slice(0,500))}
function read(raw,key,legacy){if(Object.prototype.hasOwnProperty.call(raw,key))return available(raw[key]);return !!legacy&&available(raw[legacy])}
function migrate(raw,items){validate(raw);const result={...raw};for(const {id:key,legacy} of items)if(legacy&&Object.prototype.hasOwnProperty.call(result,legacy)){if(!Object.prototype.hasOwnProperty.call(result,key))result[key]=result[legacy];delete result[legacy]}return result}
function exportState(state){return Object.fromEntries(Object.keys(state).sort().filter(key=>available(state[key])).map(key=>[key,{available:true}]))}
async function load(){const response=await fetch('catalog-status.json?t='+Date.now(),{cache:'no-store'});if(!response.ok)throw new Error('Не удалось загрузить наличие ('+response.status+')');return validate(await response.json())}
root.HBStock={id,available,validate,legacyId,read,migrate,exportState,load};if(typeof module!=='undefined')module.exports=root.HBStock;
})(typeof window!=='undefined'?window:globalThis);
