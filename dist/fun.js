(() => {
  const day = () => new Date().toLocaleDateString('sv-SE');
  const items = [
    {id:'yarn',name:'알록달록 실타래',icon:'🧶',cost:20,left:'23%'},
    {id:'plant',name:'꽃 한 송이',icon:'🌷',cost:35,left:'72%'},
    {id:'cushion',name:'포근한 곰 인형',icon:'🧸',cost:50,left:'82%'},
    {id:'fountain',name:'프리미엄 정수기',cost:180,left:'76%',bottom:'32%',art:3,description:'찰랑이는 물결, 세이지빛 포인트'},
    {id:'feeder',name:'스마트 자동급식기',cost:350,left:'65%',bottom:'32%',art:2,description:'식사 공간을 완성하는 똑똑한 디자인'},
    {id:'rattan',name:'라탄 라운지 침대',cost:450,left:'14%',bottom:'25%',art:5,description:'폭신한 쿠션을 품은 아늑한 쉼터'},
    {id:'tower',name:'원목 캣타워',cost:650,left:'55%',bottom:'41%',art:1,description:'높이 올라 쉬는 고양이를 위한 선물'},
    {id:'wheel',name:'원목 캣휠',cost:900,left:'28%',bottom:'37%',art:0,description:'활동적인 친구에게 어울리는 큰 선물'},
    {id:'robot',name:'럭셔리 자동화장실',cost:1200,left:'87%',bottom:'32%',art:4,description:'동그란 미래형 디자인의 최고급 소품'},
    {id:'goldTower',name:'순금 캣타워',cost:5000,left:'42%',bottom:'39%',art:'gold',description:'반짝이는 황금빛, 집사를 위한 꿈의 선물'}
  ];
  const careItems=[
    {id:'probiotic',name:'유산균',icon:'🫙',cost:30,description:'매일 챙기는 작은 관심'},
    {id:'omega',name:'오메가3',icon:'🐟',cost:50,description:'차곡차곡 쌓는 돌봄 습관'},
    {id:'stemcell',name:'줄기세포',icon:'🔬',cost:1000,description:'특별한 가상 케어 체험'},
    {id:'exosome',name:'엑소좀',icon:'🫧',cost:500,description:'반짝이는 가상 케어 체험'}
  ];
  let progress={xp:0,owned:[],shown:[],day:day(),counts:{meal:0,pet:0,play:0},claimed:false,careDone:[]};
  const number=(n,max=1000000)=>Number.isFinite(n)?Math.max(0,Math.min(max,n)):0;
  try {const saved=JSON.parse(localStorage.getItem('cozy-cat-progress'));if(saved){progress.xp=number(saved.xp);progress.owned=items.filter(i=>saved.owned?.includes(i.id)).map(i=>i.id);progress.shown=progress.owned.filter(id=>saved.shown?.includes(id));if(saved.day===day()){progress.counts={meal:number(saved.counts?.meal),pet:number(saved.counts?.pet),play:number(saved.counts?.play)};progress.claimed=saved.claimed===true;progress.careDone=careItems.filter(item=>Array.isArray(saved.careDone)&&saved.careDone.includes(item.id)).map(item=>item.id)}state.poops=Math.floor(number(saved.poops,999));state.pees=Math.floor(number(saved.pees,999));state.hearts=number(saved.hearts);state.full=number(saved.full,100);state.happy=number(saved.happy,100)}}catch{}
  function save(){try{localStorage.setItem('cozy-cat-progress',JSON.stringify({...progress,poops:state.poops,pees:state.pees,hearts:state.hearts,full:state.full,happy:state.happy}))}catch{$('funMessage').textContent='이 브라우저에서는 진행을 저장할 수 없어요.'}}
  function freshDay(){if(progress.day!==day()){progress.day=day();progress.counts={meal:0,pet:0,play:0};progress.claimed=false;progress.careDone=[]}}
  const missions=[['meal','든든하게 한 끼',1],['pet','다정하게 쓰다듬기',3],['play','낚싯대로 한 번 놀기',1]];
  let lastUI="";
  function update(){freshDay();const ui=JSON.stringify([progress,state.hearts]);if(ui===lastUI){save();return}lastUI=ui;const level=Math.floor(progress.xp/40)+1;const titles=['작은 인사','익숙한 손길','단짝 친구','마음이 통하는 사이','평생 집사'];$('bondTitle').textContent='Lv.'+level+' '+titles[Math.min(4,level-1)];$('bondNext').textContent='다음 단계까지 '+(40-progress.xp%40)+' 마음';$('bondProgress').value=progress.xp%40;$('level').textContent=titles[Math.min(4,level-1)];$('quests').replaceChildren(...missions.map(([id,label,target])=>{const li=document.createElement('li');li.textContent=(progress.counts[id]>=target?'✓ ':'○ ')+label+' '+Math.min(target,progress.counts[id])+'/'+target;return li}));$('claimQuest').disabled=progress.claimed||!missions.every(([id,,target])=>progress.counts[id]>=target);$('claimQuest').textContent=progress.claimed?'오늘의 선물 받았어요 ✓':'미션 선물 받기 · 하트 +15';renderShop();renderHealth();$('roomDecor').replaceChildren(...items.filter(i=>progress.shown.includes(i.id)).map(item=>{const span=document.createElement('span');if(item.art!==undefined){span.className='premium-decor furniture-art art-'+item.art;span.style.bottom=item.bottom;span.dataset.item=item.id}else{span.textContent=item.icon}span.style.left=item.left;span.setAttribute('role','img');span.setAttribute('aria-label',item.name);return span}));save()}
  function renderShop(){
    $('shopBalance').textContent='보유 하트 ♥ '+state.hearts;
    const sections=[['작은 선물',items.filter(i=>i.art===undefined)],['프리미엄 컬렉션',items.filter(i=>i.art!==undefined)]];
    $('shopItems').replaceChildren(...sections.map(([title,collection])=>{
      const section=document.createElement('section'),heading=document.createElement('h3'),grid=document.createElement('div');
      heading.textContent=title;grid.className='shop-grid';section.append(heading,grid);
      grid.replaceChildren(...collection.map(item=>{
        const owned=progress.owned.includes(item.id),shown=progress.shown.includes(item.id),card=document.createElement('button');
        card.className='shop-item';card.setAttribute('aria-pressed',String(shown));
        const art=document.createElement('span');art.setAttribute('aria-hidden','true');
        if(item.art!==undefined)art.className='furniture-art art-'+item.art;else art.textContent=item.icon;
        const name=document.createElement('strong');name.textContent=item.name;
        const description=document.createElement('span');description.className='item-description';description.textContent=item.description||'우리 방에 작은 행복을 더해요';
        const price=document.createElement('small');price.textContent=owned?(shown?'배치 중 ✓ · 보관하기':'보관 중 · 꺼내기'):'♥ '+item.cost;
        card.append(art,name,description,price);
        card.onclick=()=>{
          if(!progress.owned.includes(item.id)){
            if(state.hearts<item.cost){$('funMessage').textContent=item.name+'까지 하트 '+(item.cost-state.hearts)+'개 더 모아 주세요.';return}
            state.hearts-=item.cost;progress.owned.push(item.id);progress.shown.push(item.id);
            $('funMessage').textContent=item.name+' 선물이 도착했어요! 방에 배치했어요.';hearts();
          }else{
            const visible=progress.shown.includes(item.id);
            progress.shown=visible?progress.shown.filter(id=>id!==item.id):[...progress.shown,item.id];
            $('funMessage').textContent=item.name+(visible?'을 보관했어요. 다시 꺼낼 때 하트는 들지 않아요.':'을 방에 꺼냈어요.');
          }
          render();
        };
        return card;
      }));return section;
    }));
  }
  function renderHealth(){
    $('healthBalance').textContent='보유 하트 ♥ '+state.hearts;
    $('healthCount').textContent='오늘의 돌봄 '+progress.careDone.length+' / '+careItems.length;
    $('healthItems').replaceChildren(...careItems.map(item=>{
      const done=progress.careDone.includes(item.id),card=document.createElement('article');card.className='health-card';
      const icon=document.createElement('span');icon.className='health-icon';icon.textContent=item.icon;icon.setAttribute('aria-hidden','true');
      const title=document.createElement('h3');title.textContent=item.name;
      const description=document.createElement('p');description.textContent=item.description;
      const effect=document.createElement('small');effect.textContent='게임 행복 +5 · 하루 1회';
      const button=document.createElement('button');button.className='fun-button';button.disabled=done;button.textContent=done?'오늘 돌봄 완료 ✓':'♥ '+item.cost+' · 돌봐주기';
      button.onclick=()=>{
        freshDay();
        if(progress.careDone.includes(item.id))return;
        if(state.busy||state.sleeping){$('healthMessage').textContent=state.sleeping?'고양이가 일어나면 돌봐 주세요.':'하던 일을 마치면 돌봐 주세요.';return}
        if(state.hearts<item.cost){$('healthMessage').textContent=item.name+' 돌봄까지 하트 '+(item.cost-state.hearts)+'개가 더 필요해요.';return}
        state.hearts-=item.cost;state.happy=Math.min(100,state.happy+5);progress.careDone.push(item.id);
        $('healthMessage').textContent=item.name+' 가상 돌봄 완료! 오늘의 도장을 남겼어요.';
        say('오늘도 다정하게 챙겨 줘서 고마워!');hearts();render();
      };
      card.append(icon,title,description,effect,button);return card;
    }));
  }
  const originalRender=render;render=()=>{originalRender();update();$('level').textContent=$('bondTitle').textContent.replace(/^Lv\.\d+ /,'')};
  let playing=false,hits=0;
  const originalAct=act;act=async action=>{if(playing){say('깃털을 같이 잡아 보자냥!');return{ok:false,message:'낚싯대 놀이 중이에요.'}}const result=await originalAct(action);if(result.ok){freshDay();if(action==='meal'||action==='pet')progress.counts[action]++;progress.xp+=action==='nap'?1:action==='pet'?3:5;render()}return result};
  $('startPlay').onclick=()=>{if(state.busy||state.sleeping){$('funMessage').textContent=state.sleeping?'낮잠에서 깨운 다음 같이 놀아요.':'잠깐만요, 하던 일을 마치면 같이 놀아요.';return}playing=true;hits=0;$('playField').hidden=false;$('startPlay').disabled=true;$('playCount').textContent='깃털 잡기 0 / 5';$('feather').style.left='40%';$('feather').style.top='40%';say('살랑살랑… 잡았다냥!');$('feather').focus()};
  function stop(){playing=false;$('playField').hidden=true;$('startPlay').disabled=false;game.classList.remove('playing');$('startPlay').focus()}
  $('stopPlay').onclick=()=>{stop();say('잠깐 쉬어도 괜찮아. 곁에 있어 줘.')};
  $('feather').onclick=()=>{if(!playing)return;hits++;$('playCount').textContent='깃털 잡기 '+hits+' / 5';game.classList.remove('playing');void game.offsetWidth;game.classList.add('playing');notes();if(hits===5){stop();freshDay();state.hearts+=8;state.happy=Math.min(100,state.happy+12);state.full=Math.max(10,state.full-10);progress.xp+=10;progress.counts.play++;say('다 잡았다! 집사랑 노는 게 제일 좋아.');$('funMessage').textContent='놀이 완료! 하트 +8, 친밀도 +10. 조금 출출해졌어요.';hearts();render()}else{$('feather').style.left=(10+Math.random()*65)+'%';$('feather').style.top=(22+Math.random()*25)+'%'}};
  $('claimQuest').onclick=()=>{freshDay();if(progress.claimed||!missions.every(([id,,target])=>progress.counts[id]>=target))return;progress.claimed=true;state.hearts+=15;progress.xp+=15;$('funMessage').textContent='오늘도 함께해 줘서 고마워요. 하트 +15!';hearts();notes();render()};
  window.addEventListener('pagehide',save);render();
})();
