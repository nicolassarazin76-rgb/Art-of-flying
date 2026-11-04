(function(){
 document.querySelectorAll('.nav details').forEach(function(d){d.addEventListener('toggle',function(){if(d.open)document.querySelectorAll('.nav details').forEach(function(other){if(other!==d)other.open=false;});});});
 document.addEventListener('click',function(e){if(!e.target.closest('.nav'))document.querySelectorAll('.nav details').forEach(function(d){d.open=false;});});
 var dialog=document.createElement('dialog');dialog.className='media-lightbox';dialog.setAttribute('aria-label','Agrandissement de l’image');dialog.innerHTML='<button type="button">Fermer ×</button><img alt="">';document.body.appendChild(dialog);dialog.querySelector('button').onclick=function(){dialog.close();};dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();});
 document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a||!a.querySelector('img')||!(/\.(jpg|jpeg|png|webp)(\?|$)/i.test(a.href)))return;e.preventDefault();var image=dialog.querySelector('img');image.src=a.href;image.alt=a.querySelector('img').alt;dialog.showModal();});
})();
