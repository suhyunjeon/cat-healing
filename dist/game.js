const $=id=>document.getElementById(id);
let catName='두부';try{const saved=localStorage.getItem('cozy-cat-name');if(saved?.trim()&&saved.trim().length<=12)catName=saved.trim()}catch{}
function named(text){const code=catName.charCodeAt(catName.length-1);const final=code>=0xAC00&&code<=0xD7A3&&(code-0xAC00)%28!==0;return text.replace(/두부([를가와는])?/g,(_,particle)=>catName+(particle?({를:final?'을':'를',가:final?'이':'가',와:final?'과':'와',는:final?'은':'는'}[particle]):''))}
const nameNodes=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;if(!['SCRIPT','STYLE','INPUT'].includes(node.parentElement.tagName)&&node.textContent.includes('두부'))nameNodes.push([node,node.textContent])}const nameAttrs=[];document.querySelectorAll('[aria-label]').forEach(el=>{if(el.getAttribute('aria-label').includes('두부'))nameAttrs.push([el,el.getAttribute('aria-label')])});
function updateName(){nameNodes.forEach(([node,text])=>node.textContent=named(text));nameAttrs.forEach(([el,text])=>el.setAttribute('aria-label',named(text)));document.querySelector('.avatar').textContent=Array.from(catName)[0];document.title=catName+'의 작은 식탁';$('catName').value=catName;if(typeof state!=='undefined')updateCaption()}
function updateCaption(){$('caption').textContent=named(state.toileting?'두부가 화장실에 다녀오는 중이에요':state.sleeping?'낮잠 버튼을 누르면 두부가 일어나요':'두부를 톡 눌러 쓰다듬어 주세요')}
const state={full:45,happy:60,hearts:0,sleeping:false,busy:false,toileting:false,poops:0};let sound=false,audio;const game=document.querySelector('.game');
function render(){for(const [k,v]of [['full',state.full],['happy',state.happy]]){$(k+'Text').textContent=Math.round(v)+'%';$(k+'Bar').style.width=v+'%'}$('hearts').textContent=state.hearts;$('napLabel').textContent=state.sleeping?'일어나기':'낮잠 자기';$('mood').textContent=state.sleeping?'꿈꾸는 고양이':state.happy>=85?'행복한 고양이':'느긋한 고양이';$('level').textContent=state.hearts>=60?'집사 곁이 제일 좋아요':state.hearts>=25?'우린 꽤 친해졌어요':'우리, 알아가는 중이에요';game.classList.toggle('sleeping',state.sleeping);game.classList.toggle('toileting',state.toileting);$('petCat').disabled=state.busy;document.querySelectorAll('[data-action]').forEach(b=>b.disabled=state.busy);renderToilet()}
function say(t){$('bubble').textContent=named(t)}function notes(){if(!sound)return;audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();[523.25,659.25,783.99].forEach((f,i)=>{let o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.13;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+.5);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.55)})}function hearts(){for(let i=0;i<4;i++){let p=document.createElement('span');p.className='particle';p.textContent=state.sleeping?'z':'♥';p.style.left=(44+Math.random()*15)+'%';p.style.setProperty('--drift',(Math.random()*80-40)+'px');p.style.animationDelay=i*.12+'s';$('particles').append(p);setTimeout(()=>p.remove(),2200)}}
async function act(action){if(!['meal','treat','pet','nap'].includes(action))throw Error('알 수 없는 행동이에요.');if(state.busy)return{ok:false,message:state.toileting?'두부가 화장실에 다녀오는 중이에요.':'두부가 맛있게 먹는 중이에요.'};if(state.sleeping&&action!=='nap'){say('쿨쿨… 조금만 더 쉬고 싶어.');return{ok:false,message:'먼저 두부를 깨워 주세요.'}}if(action==='nap'){state.sleeping=!state.sleeping;state.happy=Math.min(100,state.happy+3);say(state.sleeping?'집사 옆이라… 잠이 솔솔…':'잘 잤다! 집사야, 같이 놀자.');updateCaption();if(state.sleeping)hearts();render();return{ok:true,...state}}
if(action==='pet'){state.hearts+=3;state.happy=Math.min(100,state.happy+9);say(['고르릉… 네 손이 제일 좋아.','지금 이대로도 참 좋다냥.','집사야, 내일도 같이 있자.'][Math.floor(Math.random()*3)]);game.classList.add('purring');setTimeout(()=>game.classList.remove('purring'),1500);hearts();notes();render();return{ok:true,...state}}
if(state.full>=100){await useToilet();return{ok:false,message:'화장실에 다녀왔어요. 이제 밥을 줄 수 있어요.'}}state.busy=true;game.classList.add('eating');$('food').setAttribute('opacity','1');say(action==='meal'?'냠냠… 따뜻한 밥이 최고야!':'이건… 내가 제일 좋아하는 간식!');document.querySelectorAll('[data-action]').forEach(b=>b.disabled=true);notes();await new Promise(r=>setTimeout(r,1800));state.full=Math.min(100,state.full+(action==='meal'?23:11));state.happy=Math.min(100,state.happy+8);state.hearts+=action==='meal'?5:4;state.busy=false;game.classList.remove('eating');$('food').setAttribute('opacity','0');document.querySelectorAll('[data-action]').forEach(b=>b.disabled=false);say(state.full>=95?'잘 먹었습니다냥. 배가 아주 든든해!':'맛있다… 집사 마음까지 잘 먹었어.');hearts();render();if(state.full>=100)await useToilet();return{ok:true,...state}}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.action)));$('petCat').onclick=()=>act('pet');$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'♫ 소리 끄기':'♫ 소리 켜기';$('sound').setAttribute('aria-pressed',String(sound));notes()};setInterval(()=>{if(!state.busy){state.full=Math.max(10,state.full-.5);if(state.sleeping)state.happy=Math.min(100,state.happy+1);render()}},5000);render();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'care_for_dubu',description:'두부에게 밥 또는 간식을 주거나, 쓰다듬거나, 낮잠 상태를 전환합니다.',inputSchema:{type:'object',properties:{action:{type:'string',enum:['meal','treat','pet','nap']}},required:['action'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>act(input.action)})).catch(()=>{})}catch{}}

updateName();$('nameForm').addEventListener('submit',event=>{event.preventDefault();const value=$('catName').value.trim();if(!value||value.length>12){$('nameMessage').textContent='이름을 1~12자로 입력해 주세요.';$('catName').focus();return}catName=value;updateName();let saved=true;try{localStorage.setItem('cozy-cat-name',catName)}catch{saved=false}$('nameMessage').textContent=saved?'이름을 저장했어요. 언제든 바꿀 수 있어요.':'이름을 바꿨어요. 이 브라우저에서는 저장할 수 없어요.';say('내 이름은 '+catName+'! 잘 부탁해, 집사야.');});

const characters={cheese:{label:'치즈냥',colors:['#efd6ad','#f4dfbc','#fbefd8','#d2b284','#d8ba8e','#685849','#8e7660']},tuxedo:{label:'턱시도',colors:['#484b50','#484b50','#f7f4e9','#484b50','transparent','#e8e6cb','#8e7660']},siamese:{label:'샴',colors:['#e9dcc4','#8c7161','#f7ecdb','#71594c','transparent','#c5e2ea','#efe3d0']},gray:{label:'회색냥',colors:['#b0b6bc','#c0c6cb','#e7e9e8','#8f979f','#969ea7','#505965','#6a7280']}};
function selectCharacter(key,save=false){if(!Object.hasOwn(characters,key))throw Error('선택할 수 없는 고양이예요.');const character=characters[key];$('cat').dataset.character=key;['fur','face','bib','tail','stripe','eyes','mouth'].forEach((property,i)=>$('cat').style.setProperty('--'+property,character.colors[i]));document.querySelectorAll('[name="character"]').forEach(input=>input.checked=input.value===key);if(save){let stored=true;try{localStorage.setItem('cozy-cat-character',key)}catch{stored=false}$('characterMessage').textContent=character.label+' 선택 완료! '+(stored?'다음에도 이 모습으로 만나요.':'이 브라우저에서는 선택을 저장할 수 없어요.')}return{character:key,label:character.label}}
let savedCharacter='cheese';try{const saved=localStorage.getItem('cozy-cat-character');if(Object.hasOwn(characters,saved))savedCharacter=saved}catch{}selectCharacter(savedCharacter);document.querySelectorAll('[name="character"]').forEach(input=>input.addEventListener('change',()=>selectCharacter(input.value,true)));

function renderToilet(){
  $('toiletCount').textContent=state.poops?'맛동산 '+state.poops+'개':'깨끗한 모래';
  $('litterBox').classList.toggle('has-poop',state.poops>0);
  $('litterBox').setAttribute('aria-label','화장실 열기 · '+$('toiletCount').textContent);
  $('litterContents').textContent=state.poops?'💩 '.repeat(Math.min(state.poops,12)):'✨';
  $('toiletMessage').textContent=state.toileting?'쉬… 지금 화장실에 있는 중이에요.':state.poops?'맛동산 '+state.poops+'개가 생겼어요! 모래를 치워 주세요.':'보송보송 깨끗한 모래예요.';
  $('cleanToilet').disabled=!state.poops||state.toileting;
}
async function useToilet(){
  if(state.busy||state.sleeping)return;
  state.busy=true;state.toileting=true;game.classList.remove('purring');
  say('배가 빵빵… 화장실 다녀올게!');updateCaption();render();
  await new Promise(resolve=>setTimeout(resolve,2600));
  state.poops=Math.min(999,state.poops+1);state.full=55;
  say('모래를 덮고… 아, 시원하다냥!');render();
  await new Promise(resolve=>setTimeout(resolve,1000));
  state.toileting=false;render();
  await new Promise(resolve=>setTimeout(resolve,900));
  state.busy=false;updateCaption();render();
}
$('openToilet').onclick=$('litterBox').onclick=()=>{renderToilet();$('toiletDialog').showModal()};
$('closeToilet').onclick=()=>$('toiletDialog').close();
$('cleanToilet').onclick=()=>{if(state.toileting)return;state.poops=0;render();say('깨끗하게 치워 줘서 고마워, 집사야!')};
