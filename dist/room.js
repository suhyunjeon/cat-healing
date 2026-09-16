// Room controls share the existing care and progress state.
(() => {
  state.water=65;
  try{const saved=Number(localStorage.getItem('cozy-cat-water'));if(localStorage.getItem('cozy-cat-water')!==null&&Number.isFinite(saved))state.water=Math.max(0,Math.min(100,saved))}catch{}
  const previousRender=render;
  render=()=>{previousRender();$('giveWater').disabled=state.busy;$('waterSpot').disabled=state.busy;$('waterText').textContent=Math.round(state.water)+'%';$('waterBar').style.width=state.water+'%';try{localStorage.setItem('cozy-cat-water',state.water)}catch{}};
  document.querySelectorAll('[data-panel]').forEach(button=>button.onclick=()=>$(button.dataset.panel).showModal());
  document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>button.closest('dialog').close());
  $('playDialog').addEventListener('close',()=>{if(!$('playField').hidden)$('stopPlay').click()});
  const available=()=>{if(state.busy||state.sleeping||!$('playField').hidden){say(state.sleeping?'쿨쿨… 일어나면 같이 하자.':'잠깐만, 하던 일을 마치고 하자냥!');return false}return true};
  $('giveWater').onclick=$('waterSpot').onclick=async()=>{
    if(!available())return;
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    state.busy=true;
    game.classList.remove('purring');
    game.classList.add('going-to-water');
    say('목이 말랐어. 물 마시러 갈게!');
    render();
    try{
      await wait(1000);
      game.classList.add('drinking');
      say('찰박찰박… 시원하다냥.');
      notes();
      await wait(1800);
      state.water=Math.min(100,state.water+25);
      state.happy=Math.min(100,state.happy+3);
      game.classList.remove('drinking');
      say('시원한 물 고마워, 집사야!');
      render();
    }finally{
      game.classList.remove('drinking','going-to-water');
      await wait(1000);
      state.busy=false;
      render();
    }
  };
  $('brushCat').onclick=()=>{if(!available())return;state.happy=Math.min(100,state.happy+6);game.classList.add('purring');setTimeout(()=>game.classList.remove('purring'),1600);say('살살 빗어 주니까… 고르릉.');hearts();render()};
  $('watchWindow').onclick=()=>{if(!available())return;state.busy=true;game.classList.add('watching');say('나뭇잎이 살랑살랑… 새가 왔나?');render();setTimeout(()=>{game.classList.remove('watching');state.busy=false;render()},3500)};
  setInterval(()=>{if(!state.busy){state.water=Math.max(0,state.water-.25);render()}},10000);
  const note=document.querySelector('.daily-note');
  const mobile=matchMedia('(max-width:700px)');
  function placeNote(){(mobile.matches?$('journalDialog'):game).append(note)}
  mobile.addEventListener('change',placeNote);placeNote();
  render();
})();
