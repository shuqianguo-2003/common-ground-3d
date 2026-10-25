import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';

const zones = [
  {id:'entrance',n:'01',cn:'入口欢迎区',en:'WELCOME',x:0,z:12.7,c:'#d97848',d:'开放、清晰、没有收银台阻挡的第一印象。品牌展示与社区公告在这里迎接访客。'},
  {id:'cashier',n:'02',cn:'收银台',en:'CASHIER',x:-4.85,z:9.75,c:'#bf875d',d:'位于正门入口左侧的室内交界处，提供结账、咨询与会员服务；避开门洞、入口中轴与咖啡桌。'},
  {id:'cafe',n:'03',cn:'咖啡区',en:'CAFÉ',x:-5.2,z:6.1,c:'#d8b783',d:'由老年成员运营的开放式咖啡柜台，整合煮饭、备餐、咖啡与展示功能；柜台内收并避开种植区门洞，三组咖啡桌分散布置。'},
  {id:'retail',n:'04',cn:'开放零售区',en:'RETAIL',x:2.15,z:5.2,c:'#cbb78f',d:'收缩至右侧的两组紧凑低矮货架，把中央面积归还咖啡区，并保持入口与钢琴课堂之间的通透视线。'},
  {id:'classroom',n:'05',cn:'大教室 · 钢琴',en:'FORUM',x:-1.5,z:-5.4,c:'#e69a70',d:'全场核心。参考开放式课堂，环形布置可移动座椅，并与咖啡、零售空间连续相连。'},
  {id:'garden',n:'06',cn:'植物种植区',en:'PLANT GARDEN',x:-9.3,z:-4.6,c:'#8da182',d:'面向外界完全开放，仅以木质矮栅栏围合；面向室内设置通透玻璃，咖啡制作区一侧保留清晰的无门门洞。'},
  {id:'multi',n:'07',cn:'多功能授课空间',en:'MULTI-FUNCTION',x:8.45,z:2.35,c:'#b99879',d:'位于无障碍卫生间与休息社交区之间，用于手工课、数字技能课和社群活动；可移动桌椅可快速切换授课、协作与活动模式。'},
  {id:'lounge',n:'08',cn:'休息 / 社交空间',en:'LOUNGE',x:8.4,z:8.3,c:'#c99c78',d:'安静但不封闭的休息空间，提供阅读、聊天与短暂休憩的软座。'},
  {id:'staff',n:'09',cn:'员工休息与储物',en:'BACK OF HOUSE',x:9.1,z:-10.4,c:'#b9ae9d',d:'员工休息、储物与准备空间，与公共动线分开，但能快速支援前场。'},
  {id:'wc',n:'10',cn:'无障碍卫生间',en:'ACCESSIBLE WC',x:9.4,z:-3.2,c:'#aab9b0',d:'宽门、回转空间与扶手完整预留，靠近主要公共区域且标识清楚。'},
];
const descriptions = Object.fromEntries(zones.map(z=>[z.id,z]));
const englishDescriptions={
  entrance:'An open, legible arrival with no checkout blocking the view. Community notices and the COMMON GROUND identity welcome every visitor.',
  cashier:'Located at the interior threshold immediately left of the main entrance, clear of the doorway, arrival axis and café tables.',
  cafe:'A senior-led open café counter combines cooking, preparation, coffee and display functions. The L-shaped counter sits clear of the garden opening, with three well-spaced social tables beyond.',
  retail:'Two compact low displays are grouped on the right, returning the central floor area to the café while keeping the entrance-to-forum sightline open.',
  classroom:'The heart of the club. Flexible mobile seats form an open learning forum around the piano, continuously connected to café and retail.',
  garden:'The garden is fully open to the outside and enclosed only by timber fencing. A full-height glazed partition faces the interior, with a clear open doorway beside the coffee preparation area.',
  multi:'Located between the accessible WC and social lounge, this flexible teaching studio supports craft workshops, digital-skills classes and community events with mobile tables and stools.',
  lounge:'A calm but connected place for reading, conversation and rest, furnished with supportive soft seating.',
  staff:'A dedicated staff rest, storage and preparation area, separated from public circulation but close to the activity spaces.',
  wc:'An accessible washroom with a wide doorway, turning circle, grab rails and clear wayfinding from the public areas.'
};
const copy={
  zh:{headline:'一个由经验<br>共同建造的地方',intro:'由老年人主导运营，连接咖啡、零售、学习与邻里社交。点击区域名称，靠近探索。',hint:'<b>拖动</b>旋转 · <b>滚轮</b>缩放<br><b>右键 / 双指</b>移动视角',overview:'俯视',human:'漫游',rotate:'旋转',labels:'标签',walls:'剖切',language:'EN',footer:'DESIGN DEVELOPMENT · OCT 2026 <span>暖木 · 暖白 · COMMON GROUND ORANGE</span>'},
  en:{headline:'A PLACE BUILT<br>FROM EXPERIENCE',intro:'A senior-led space connecting coffee, retail, learning and neighbourhood life. Select a zone to move closer.',hint:'<b>DRAG</b> to orbit · <b>SCROLL</b> to zoom<br><b>RIGHT-DRAG / TWO FINGERS</b> to pan',overview:'TOP',human:'WALK',rotate:'ORBIT',labels:'LABELS',walls:'CUT',language:'中文',footer:'DESIGN DEVELOPMENT · OCT 2026 <span>WARM TIMBER · WARM WHITE · COMMON GROUND ORANGE</span>'}
};
let currentLang='zh',activeZoneId=null;

const canvas=document.querySelector('#scene'), stage=document.querySelector('#stage');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
const scene=new THREE.Scene(); scene.background=new THREE.Color('#e9e8e3'); scene.fog=new THREE.Fog('#e9e8e3',40,74);
const camera=new THREE.PerspectiveCamera(38,1,.1,100); camera.position.set(22,26,30);
const controls=new OrbitControls(camera,canvas); controls.enableDamping=true; controls.dampingFactor=.06; controls.target.set(0,0,-.3); controls.minDistance=8; controls.maxDistance=58; controls.maxPolarAngle=Math.PI*.47; controls.minPolarAngle=.12;

scene.add(new THREE.HemisphereLight('#fff8ea','#7c7569',2.05));
const sun=new THREE.DirectionalLight('#fff1d8',3.45); sun.position.set(-12,24,14); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.00025;sun.shadow.normalBias=.018; sun.shadow.camera.left=-24;sun.shadow.camera.right=24;sun.shadow.camera.top=24;sun.shadow.camera.bottom=-24; scene.add(sun);

const root=new THREE.Group(); root.rotation.y=-.05; scene.add(root);
const mat=(color,rough=.78,metal=.02)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
const M={wood:mat('#9b6844',.66),wood2:mat('#d0a16e',.72),woodDark:mat('#6f472f',.62),cream:mat('#eee4d4',.9),white:mat('#fffdf7',.88),ink:mat('#252827',.48,.08),orange:mat('#dd6334',.7),green:mat('#657d62',.82),leaf:mat('#496b50',.78),glass:new THREE.MeshPhysicalMaterial({color:'#cde2df',transparent:true,opacity:.27,roughness:.08,metalness:0,transmission:.42,thickness:.08}),grey:mat('#a9aaa5',.7,.05),brass:mat('#b88a43',.42,.56),fabric:mat('#c88963',.96),tile:mat('#d8ddd8',.82)};
function makeFloorTexture(kind='plank'){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');
  ctx.fillStyle=kind==='tile'?'#f3f0e9':'#efe5d7';ctx.fillRect(0,0,256,256);
  if(kind==='tile'){
    ctx.strokeStyle='rgba(99,91,78,.18)';ctx.lineWidth=2;
    for(let p=0;p<=256;p+=64){ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,256);ctx.stroke();ctx.beginPath();ctx.moveTo(0,p);ctx.lineTo(256,p);ctx.stroke()}
    ctx.strokeStyle='rgba(255,255,255,.34)';ctx.lineWidth=1;for(let p=2;p<256;p+=64){ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,256);ctx.stroke()}
  }else{
    ctx.strokeStyle='rgba(103,72,48,.17)';ctx.lineWidth=2;
    for(let x=0;x<=256;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,256);ctx.stroke()}
    for(let row=0;row<8;row++){const y=row*32,offset=row%2?16:0;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke();for(let x=offset;x<256;x+=64){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+32);ctx.stroke()}}
    ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=1;for(let x=5;x<256;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,256);ctx.stroke()}
  }
  const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return texture;
}
const floorTextures={plank:makeFloorTexture('plank'),tile:makeFloorTexture('tile')};
function floorMaterial(color,kind,w,d){const texture=floorTextures[kind].clone();texture.needsUpdate=true;texture.repeat.set(Math.max(1,w/(kind==='tile'?2.4:3.2)),Math.max(1,d/(kind==='tile'?2.4:3.2)));return new THREE.MeshStandardMaterial({color,map:texture,roughness:.9,metalness:0})}
function box(name,x,y,z,w,h,d,m=M.cream,cast=true){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.name=name;o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;root.add(o);return o}
function cyl(name,x,y,z,r,h,m=M.wood,seg=24){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),m);o.name=name;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;root.add(o);return o}
function zoneFloor(z,w,d){box('zone-'+z.id,z.x,.11,z.z,w,.18,d,mat(z.c));}
const wallMeshes=[];
function wall(name,x,z,w,d,h=3.15,cutaway=false,m=M.white){const material=m.clone();material.transparent=true;const o=box(name,x,h/2,z,w,h,d,material);o.userData.cutaway=cutaway;wallMeshes.push(o);return o}
function framedGlass(x,z,w,d,rot=0){const g=new THREE.Group();const pane=new THREE.Mesh(new THREE.BoxGeometry(w,2.25,d),M.glass);pane.position.y=1.55;g.add(pane);for(const px of [-w/2,w/2]){const f=new THREE.Mesh(new THREE.BoxGeometry(.12,2.65,.12),M.ink);f.position.set(px,1.55,0);g.add(f)}for(const py of [.25,2.87]){const f=new THREE.Mesh(new THREE.BoxGeometry(w+.12,.12,.12),M.ink);f.position.set(0,py,0);g.add(f)}g.position.set(x,0,z);g.rotation.y=rot;root.add(g);return g}
function fenceLine(x1,z1,x2,z2){const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),angle=Math.atan2(dx,dz),cx=(x1+x2)/2,cz=(z1+z2)/2;for(const y of [.4,.72]){const rail=box('garden-fence-rail',cx,y,cz,.1,.1,len,M.wood);rail.rotation.y=angle}const posts=Math.max(2,Math.ceil(len/1.25));for(let i=0;i<=posts;i++){const t=i/posts;box('garden-fence-post',x1+dx*t,.48,z1+dz*t,.17,.96,.17,M.wood)}}
function pendant(x,z,y=2.82){box('pendant-cord',x,y+.18,z,.025,.55,.025,M.ink,false);const shade=new THREE.Mesh(new THREE.CylinderGeometry(.08,.28,.22,24),M.brass);shade.position.set(x,y-.12,z);shade.castShadow=true;root.add(shade);const bulb=new THREE.PointLight('#ffd9a4',.28,5,2);bulb.position.set(x,y-.28,z);root.add(bulb)}
function slattedPanel(x,z,w,h,rot=0){const g=new THREE.Group();const backing=new THREE.Mesh(new THREE.BoxGeometry(w,h,.1),M.woodDark);backing.position.y=h/2;g.add(backing);const count=Math.max(3,Math.floor(w/.24));for(let i=0;i<count;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(.075,h+.04,.14),M.wood2);s.position.set(-w/2+.12+i*w/count,h/2,.06);g.add(s)}g.position.set(x,0,z);g.rotation.y=rot;root.add(g);return g}
function cabinetFace(x,y,z,w,h,rot=0){const g=new THREE.Group();const face=new THREE.Mesh(new THREE.BoxGeometry(w,h,.06),M.wood2);face.position.y=y;g.add(face);const handle=new THREE.Mesh(new THREE.BoxGeometry(w*.42,.035,.055),M.brass);handle.position.set(0,y+h*.23,.06);g.add(handle);g.position.set(x,0,z);g.rotation.y=rot;root.add(g);return g}
function wallArt(x,z,w,h,rot=0,palette=[M.orange,M.green]){const g=new THREE.Group();const frame=new THREE.Mesh(new THREE.BoxGeometry(w+.18,h+.18,.1),M.woodDark);frame.position.y=1.78;g.add(frame);const canvas=new THREE.Mesh(new THREE.BoxGeometry(w,h,.07),M.white);canvas.position.set(0,1.78,.075);g.add(canvas);const block=new THREE.Mesh(new THREE.BoxGeometry(w*.66,h*.22,.035),palette[0]);block.position.set(-w*.08,1.9,.13);block.rotation.z=-.13;g.add(block);const dot=new THREE.Mesh(new THREE.CircleGeometry(Math.min(w,h)*.19,24),palette[1]);dot.position.set(w*.18,1.55,.16);g.add(dot);const line=new THREE.Mesh(new THREE.BoxGeometry(w*.05,h*.52,.035),M.brass);line.position.set(-w*.25,1.7,.15);line.rotation.z=.18;g.add(line);g.position.set(x,0,z);g.rotation.y=rot;root.add(g);return g}
function retailUnit(x,z){box('retail-plinth',x,.18,z,1.38,.28,4.55,M.woodDark);for(const y of [.48,.84])box('retail-shelf',x,y,z,1.32,.1,4.35,M.wood2);for(const zz of [z-2.12,z+2.12])box('retail-end',x,.62,zz,1.38,.95,.1,M.woodDark);for(const zz of [z-1.2,z+1.2]){for(const dx of [-.3,.3]){const product=box('retail-product',x+dx,1.02,zz,.3,.35,.3,Math.random()>.55?M.green:M.orange);product.rotation.y=(Math.random()-.5)*.15}}}

// Foundation and finished floors use the same non-overlapping boundaries as the wall plan.
const foundation=mat('#d9cdbd');
box('foundation-main',-3.4,-.3,4.875,16.4,.55,11.85,foundation);            // x -11.6..4.8, z -1.05..10.8
box('foundation-classroom',-.8,-.3,-6.975,11.2,.55,11.85,foundation);      // x -6.4..4.8, z -12.9..-1.05
box('foundation-garden',-9,-.3,-4.375,5.2,.55,6.65,foundation);            // open garden slab
box('foundation-right',8.2,-.3,-1.05,6.8,.55,23.7,foundation);             // right service wing
box('foundation-entry',0,-.3,12.95,6.7,.55,4.3,foundation);               // south entrance projection
function floorRect(name,x1,x2,z1,z2,color,kind='plank'){const w=x2-x1,d=z2-z1;return box(name,(x1+x2)/2,.11,(z1+z2)/2,w,.18,d,floorMaterial(color,kind,w,d))}
floorRect('floor-garden',-11.6,-6.4,-7.7,-1.05,zones[5].c,'tile');
floorRect('floor-classroom',-6.4,4.8,-12.9,-1.05,zones[4].c);
floorRect('floor-cafe',-11.6,.15,-1.05,10.8,zones[2].c);
floorRect('floor-retail',.15,4.8,-1.05,10.8,zones[3].c);
floorRect('floor-entrance',-3.35,3.35,10.8,15.1,zones[0].c,'tile');
floorRect('floor-staff',8.15,11.6,-12.9,-8.45,zones[8].c,'tile');
floorRect('floor-wc',8.15,11.6,-4.55,-1.1,zones[9].c,'tile');
floorRect('floor-multi',5.35,11.6,-1.1,5.95,zones[6].c);
floorRect('floor-lounge',5.35,11.6,5.95,10.8,zones[7].c);
// Neutral circulation infill closes every remaining bay exactly once.
floorRect('floor-corridor-north',4.8,8.15,-12.9,-8.45,'#eee4d4','tile');
floorRect('floor-corridor-service',4.8,8.15,-8.45,-4.55,'#eee4d4','tile');
floorRect('floor-corridor-east',8.15,11.6,-8.45,-4.55,'#eee4d4','tile');
floorRect('floor-corridor-wc',4.8,8.15,-4.55,-1.1,'#eee4d4','tile');
floorRect('floor-corridor-studio',4.8,5.35,-1.1,5.95,'#eee4d4','tile');
floorRect('floor-lounge-link',4.8,5.35,5.95,10.8,'#eee4d4','tile');
const wallT=.24;
// Full-height envelope follows the stepped footprint in the approved plan.
// The garden is fully carved out of the building envelope: no west or north exterior wall surrounds it.
// The north building wall begins only where the glazed garden-to-interior boundary ends.
wall('west-wall-south',-11.6,4.9,wallT,11.9,3.25,false); wall('east-wall',11.6,-.9,wallT,24.5,3.25,true); wall('north-wall-interior',2.6,-12.9,18.2,wallT,3.25,false);
// Café and lounge terminate at the main south line; only the entrance projects outward.
framedGlass(-7.45,10.8,7.9,.09);wall('entry-return-left',-3.35,12.95,wallT,4.3,3.25,true);wall('entry-return-right',3.35,12.95,wallT,4.3,3.25,true);
wall('entry-front-left',-2.55,15.1,1.6,wallT,3.25,true);wall('entry-front-right',2.55,15.1,1.6,wallT,3.25,true);framedGlass(0,15.02,3.5,.09);
wall('south-link',4.35,10.8,2,wallT,3.25,true);framedGlass(8.45,10.8,6.1,.09);
// Interior walls follow the final plan and preserve clear door openings.
framedGlass(-6.4,-8.8,8.2,.09,Math.PI/2); framedGlass(-6.4,-2.05,2.3,.09,Math.PI/2);
// Café, retail and piano forum flow together as one open community hall with no doors between them.
// The coffee preparation zone is separated from the garden by a wall with a generous open doorway.
wall('cafe-garden-wall-a',-10.35,-1.05,2.5,wallT,3.05,false);wall('cafe-garden-wall-b',-7.25,-1.05,1.7,wallT,3.05,false);
wall('east-spine-a',4.8,-10.5,wallT,4.8,3.05,false); wall('east-spine-b',4.8,-5.7,wallT,2.6,3.05,false);
wall('service-north',6.45,-8.45,3.3,wallT,3.05,false); wall('staff-north',9.9,-8.45,3.2,wallT,3.05,false); wall('staff-divider',8.15,-10.7,wallT,4.3,3.05,false);
wall('wc-north',9.9,-4.55,3.2,wallT,3.05,true); wall('wc-south-a',8.2,-1.1,1.4,wallT,3.05,true); wall('wc-south-b',10.8,-1.1,1.6,wallT,3.05,true); wall('wc-west-a',8.15,-3.65,wallT,1.8,3.05,true); wall('wc-west-b',8.15,-1.7,wallT,1,3.05,true);
wall('studio-west-south',5.35,.2,wallT,2.6,3.05,true); wall('studio-west-north',5.35,4.4,wallT,3.1,3.05,true);
wall('lounge-north-a',6.2,5.95,1.6,wallT,3.05,true); wall('lounge-north-b',9.9,5.95,3.4,wallT,3.05,true); wall('lounge-west-a',5.35,7.75,wallT,3.6,3.05,true); wall('lounge-west-b',5.35,10.25,wallT,1.1,3.05,true);
// Door leaves are intentionally omitted: every opening reads as clear, inclusive circulation.

// Architectural finish layer: curtain-wall mullions, warm skirtings and timber feature panels.
for(const x of [-9.35,-7.45,-5.55])box('south-glass-mullion',x,1.55,10.74,.075,2.62,.12,M.ink);
for(const x of [6.85,8.45,10.05])box('lounge-glass-mullion',x,1.55,10.74,.075,2.62,.12,M.ink);
for(const x of [-1.15,0,1.15])box('entry-glass-mullion',x,1.55,14.96,.075,2.62,.12,M.ink);
for(const z of [-10.85,-8.8,-6.75])box('garden-glass-mullion',-6.34,1.55,z,.12,2.62,.075,M.ink);
box('north-skirting',2.6,.13,-12.74,18,.18,.08,M.woodDark);box('west-skirting',-11.44,.13,4.9,.08,.18,11.55,M.woodDark);box('east-skirting',11.44,.13,-.9,.08,.18,24.1,M.woodDark);
slattedPanel(-1.1,-12.72,7.2,2.75,0);slattedPanel(-11.42,2.25,4.8,2.5,Math.PI/2);
wallArt(6.55,-12.72,1.35,1.45,0,[M.orange,M.green]);wallArt(8.25,-12.72,1.1,1.45,0,[M.green,M.wood2]);
wallArt(11.42,8.25,1.45,1.55,-Math.PI/2,[M.orange,M.wood2]);wallArt(-11.42,7.45,1.2,1.45,Math.PI/2,[M.green,M.orange]);

// Entrance: open portal, benches and brand wall, intentionally unobstructed
box('welcome-portal',-2.5,1.5,14.5,.22,3,1.1,M.orange);box('welcome-portal',2.5,1.5,14.5,.22,3,1.1,M.orange);box('welcome-sign',0,2.5,14.5,5.2,.25,.4,M.orange);
box('welcome-bench',1.75,.38,12.5,2.2,.42,.75,M.wood2);box('welcome-bench-leg',1.1,.18,12.5,.18,.4,.6,M.ink);box('welcome-bench-leg',2.4,.18,12.5,.18,.4,.6,M.ink);
for(const x of [-2.18,-1.86,-1.54,-1.22])box('welcome-timber-slat',x,1.45,12.22,.12,2.75,.18,M.woodDark);box('community-board',-1.68,1.55,12.08,1.25,1.2,.08,M.white);for(const [x,y] of [[-1.95,1.75],[-1.55,1.45],[-1.35,1.82]])box('notice-card',x,y,12.02,.24,.3,.03,M.orange,false);

// Café: a continuous L-shaped service counter keeps the garden doorway fully clear.
box('cafe-counter',-10.15,.65,2.25,1.35,1.3,5.7,M.wood);box('counter-top',-10.15,1.36,2.25,1.58,.15,5.95,M.ink);
box('cafe-fridge',-10.78,1.15,5.95,1.08,2.3,1.25,M.white);box('fridge-handle',-10.15,1.2,5.95,.08,.75,.12,M.ink);
box('service-counter',-7.28,.66,1.85,4.5,1.32,1.12,M.wood2);box('service-counter-top',-7.28,1.36,1.85,4.72,.13,1.36,M.white);
box('display-glass',-7.15,1.77,1.52,3.48,.72,.055,M.glass,false);for(const x of [-8.82,-5.48])box('display-post',x,1.72,1.52,.055,.78,.055,M.brass);
for(const x of [-8.25,-7.3,-6.35]){cyl('pastry-plate',x,1.47,1.62,.28,.035,M.white,20);for(const dx of [-.12,.12])cyl('pastry',x+dx,1.54,1.62,.09,.1,M.orange,14)}
box('sink-basin',-10.15,1.43,3.35,.78,.08,.92,M.grey);box('faucet-post',-10.55,1.73,3.35,.08,.6,.08,M.ink);box('faucet-spout',-10.35,1.98,3.35,.48,.08,.08,M.ink);
for(const z of [.7,1.35])for(const x of [-10.43,-9.88])cyl('cooktop-burner',x,1.46,z,.18,.035,M.ink,18);
box('range-hood',-11.18,2.42,1.02,.24,.3,1.9,M.ink);box('range-flue',-11.18,2.78,1.02,.28,.75,.62,M.grey);
for(const z of [.1,1.25,2.4,3.55,4.7])cabinetFace(-9.43,.72,z,.85,.92,Math.PI/2);
for(const x of [-8.72,-7.72,-6.72,-5.72])cabinetFace(x,.7,2.43,.82,.9,0);
box('cafe-upper-shelf',-11.2,2.05,3.8,.26,.12,2.55,M.wood2);for(const z of [3.15,3.8,4.45])cyl('cafe-jar',-11.02,2.32,z,.13,.42,z===3.8?M.orange:M.green,16);
box('espresso-machine',-9.72,1.64,4.55,.72,.42,.65,M.ink);for(const x of [-9.93,-9.52])cyl('coffee-cup',x,1.62,4.05,.09,.16,M.white,16);
function cafeTable(x,z){cyl('coffee-table',x,.72,z,.82,.12,M.wood2);cyl('table-leg',x,.37,z,.12,.65,M.ink);for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const dx=Math.cos(a)*1.28,dz=Math.sin(a)*1.28;cyl('chair',x+dx,.35,z+dz,.42,.7,M.wood2);const back=box('chair-back',x+dx+Math.cos(a)*.34,.82,z+dz+Math.sin(a)*.34,.62,.62,.12,M.fabric);back.rotation.y=Math.PI/2-a}}
// Three café tables are staggered across separate bays so chairs clear the kitchen, cashier and glazed edge.
[[-4.9,4.2],[-2,6.3],[-8.8,8.6]].forEach(p=>cafeTable(...p));
pendant(-4.9,4.2);pendant(-2,6.3);pendant(-8.8,8.6);
// Cash register at café/retail boundary, away from entrance line
box('cashier',-4.85,.65,9.75,2.5,1.25,1.05,M.wood);box('cashier-top',-4.85,1.32,9.75,2.72,.12,1.25,M.ink);box('register',-4.3,1.55,9.75,.62,.42,.5,M.orange);
for(const x of [-5.55,-4.85,-4.15])cabinetFace(x,.68,9.18,.58,.86,0);box('cashier-footrail',-4.85,.28,9.05,2.15,.08,.08,M.brass);

// Reduced retail: two detailed but lightly stocked display units preserve the central route.
retailUnit(1.2,5.15);retailUnit(3,5.15);

// Classroom focal ring, mobile stools, screen and piano
cyl('forum-rug',-1.1,.2,-6.1,3.5,.08,mat('#f5c5a8'),48);
for(let i=0;i<14;i++){const a=(i/14)*Math.PI*2,r=4.7,x=-1.1+Math.cos(a)*r,z=-5.5+Math.sin(a)*r,m=i%3===0?M.orange:M.wood2;cyl('mobile-chair',x,.43,z,.43,.16,m);for(const [dx,dz] of [[-.22,-.22],[.22,-.22],[-.22,.22],[.22,.22]])cyl('chair-caster',x+dx,.19,z+dz,.045,.38,M.ink,8);const back=box('mobile-chair-back',x+Math.cos(a)*.28,1.02,z+Math.sin(a)*.28,.7,.78,.14,m);back.rotation.y=Math.PI/2-a}
box('learning-screen',-1.1,1.6,-11.9,7.5,2.7,.22,M.white);box('screen-accent',-1.1,1.6,-11.75,6.9,2.1,.12,M.orange);
box('screen-frame-top',-1.1,2.72,-11.62,7.15,.08,.08,M.brass);box('screen-frame-bottom',-1.1,.48,-11.62,7.15,.08,.08,M.brass);
// Detailed grand piano: shaped case, raised lid, keyboard, black keys, legs, pedals and bench
const piano=new THREE.Group();piano.name='grand-piano';
function grandPianoShape(){const s=new THREE.Shape();s.moveTo(-1.48,-1.02);s.lineTo(1.34,-1.02);s.lineTo(1.42,-.58);s.bezierCurveTo(1.72,-.05,1.78,.82,1.24,1.4);s.bezierCurveTo(.58,2.04,-.5,1.98,-1.08,1.35);s.bezierCurveTo(-1.43,.88,-1.55,.08,-1.48,-1.02);return s}
function grandLayer(name,depth,y,m,scale=1){const g=new THREE.ExtrudeGeometry(grandPianoShape(),{depth,bevelEnabled:true,bevelSize:.05,bevelThickness:.04,bevelSegments:2});g.rotateX(Math.PI/2);g.scale(scale,scale,scale);const mesh=new THREE.Mesh(g,m);mesh.name=name;mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;piano.add(mesh);return mesh}
grandLayer('piano-case',.46,1.34,M.ink);const lid=grandLayer('piano-lid',.09,1.48,mat('#181a18'),1.02);lid.rotation.z=-.055;
const soundboard=new THREE.Mesh(new THREE.ShapeGeometry(grandPianoShape()),mat('#9b7047'));soundboard.rotation.x=Math.PI/2;soundboard.scale.set(.86,.86,.86);soundboard.position.set(.04,1.405,.08);piano.add(soundboard);
const keys=new THREE.Mesh(new THREE.BoxGeometry(2.5,.15,.74),M.white);keys.name='piano-keyboard';keys.position.set(.05,1.2,-1.25);keys.castShadow=true;piano.add(keys);
for(let i=0;i<10;i++){if([2,6].includes(i))continue;const key=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,.42),M.ink);key.position.set(-1.02+i*.235,1.34,-1.3);piano.add(key)}
for(const [x,z] of [[-1.05,-.55],[1.02,-.55],[-.55,1.12]]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.105,.13,.95,12),M.ink);leg.position.set(x,.48,z);leg.castShadow=true;piano.add(leg)}
const lyre=new THREE.Mesh(new THREE.BoxGeometry(.13,.62,.12),M.wood2);lyre.position.set(.12,.62,-.52);piano.add(lyre);for(const x of [-.08,.13,.34]){const pedal=new THREE.Mesh(new THREE.BoxGeometry(.22,.06,.4),M.wood2);pedal.position.set(x,.25,-.73);pedal.rotation.x=-.14;piano.add(pedal)}
const prop=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1.28,8),M.wood2);prop.position.set(-.72,1.86,.42);prop.rotation.z=-.52;piano.add(prop);
piano.position.set(-1.1,0,-6);piano.rotation.y=-.18;root.add(piano);
box('piano-bench',-.65,.48,-8.05,1.55,.2,.6,M.ink);for(const x of [-1.2,-.1])box('piano-bench-leg',x,.22,-8.05,.1,.45,.1,M.ink);

// Plant garden beds and plants
for(const x of [-10,-8.6,-7.2]){box('plant-bed',x,.45,-4.7,1.05,.8,5.2,M.wood);box('garden-soil',x,.87,-4.7,.86,.08,4.98,mat('#594638',1));for(const z of [-6.2,-4.8,-3.4])plant(x,.95,z,.55)}
// Simple timber fence wraps the garden beds, while the full-height glazed partition keeps the garden visually connected to the club.
fenceLine(-10.8,-7.7,-10.8,-1.8);fenceLine(-10.8,-7.7,-7,-7.7);fenceLine(-10.8,-1.8,-7,-1.8);fenceLine(-7,-7.7,-7,-5.55);fenceLine(-7,-3.75,-7,-1.8);
function plant(x,y,z,s=1){cyl('pot',x,y,z,.32*s,.5*s,mat('#b76539'),12);const g=new THREE.Group();for(let i=0;i<7;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.38*s,10,8),M.leaf);const a=i/7*Math.PI*2;leaf.scale.set(.55,1.5,.35);leaf.position.set(Math.cos(a)*.25*s,.6*s+Math.random()*.2,Math.sin(a)*.25*s);leaf.rotation.z=(Math.random()-.5)*.8;g.add(leaf)}g.position.set(x,y,z);root.add(g)}
function tree(x,z,s=1){cyl('tree-trunk',x,.75*s,z,.16*s,1.5*s,M.woodDark,10);const crown=new THREE.Group();for(let i=0;i<9;i++){const a=i/9*Math.PI*2,r=.48*s+(i%3)*.12*s;const leaf=new THREE.Mesh(new THREE.SphereGeometry(.55*s,10,8),M.leaf);leaf.scale.set(.85,1.15,.82);leaf.position.set(x+Math.cos(a)*r,1.72*s+(i%2)*.25*s,z+Math.sin(a)*r);leaf.castShadow=true;crown.add(leaf)}root.add(crown)}

// Multi-function teaching studio between the accessible WC and the social lounge
for(const z of [.65,3.65]){box('maker-table',8.65,.72,z,3.35,.18,1.05,M.wood);for(const x of [7.55,8.65,9.75]){cyl('maker-stool',x,.38,z-.78,.32,.65,M.wood2);cyl('maker-stool',x,.38,z+.78,.32,.65,M.wood2)}}
box('digital-board',5.57,1.45,4.05,.18,2.2,2.7,M.ink);
box('studio-storage',10.95,.65,2.3,.78,1.3,3.8,M.wood2);
for(const z of [.9,2.05,3.2])cabinetFace(10.54,.68,z,.88,1.02,Math.PI/2);
for(const [x,z] of [[8.1,.65],[9.2,.65],[8.1,3.65],[9.2,3.65]])box('workshop-kit',x,.91,z,.42,.18,.3,Math.random()>.5?M.green:M.orange);
pendant(8.65,.65,2.72);pendant(8.65,3.65,2.72);

// Lounge sofas and round side tables
box('lounge-rug',8.35,.22,8.65,5.45,.055,3.95,mat('#e5d8c8',1));box('sofa',8.3,.48,7.2,4.3,.75,1.15,M.orange);box('sofa-back',8.3,.95,7.72,4.3,1.05,.25,M.orange);box('sofa',8.4,.48,9.9,4.3,.75,1.15,M.wood2);box('sofa-back',8.4,.95,10.42,4.3,1.05,.25,M.wood2);for(const x of [7.25,8.3,9.35]){box('sofa-cushion',x,.92,7.18,.88,.24,.82,M.fabric);box('sofa-cushion',x,.92,9.88,.88,.24,.82,M.cream)}cyl('lounge-table',8.3,.48,8.55,.72,.12,M.wood);cyl('lounge-table-base',8.3,.25,8.55,.2,.48,M.brass);
box('lounge-console',10.95,.68,8.55,.72,1.32,3.4,M.woodDark);for(const z of [7.35,8.55,9.75])cabinetFace(10.55,.68,z,.88,.98,Math.PI/2);

// Staff/storage and accessible washroom
for(const x of [7.8,9,10.2]){box('locker',x,1,-11.5,.85,2,1,M.grey);box('locker-door',x,1,-10.96,.72,1.78,.06,M.white);box('locker-handle',x+.22,1,-10.9,.05,.42,.05,M.brass)}box('staff-table',9.1,.68,-9.8,3.2,.16,1.15,M.wood2);box('staff-bench',10.55,.44,-9.55,.75,.74,1.7,M.fabric);
box('wc-tile-floor',9.88,.215,-2.83,3.25,.04,3.05,M.tile);box('wc-cubicle',9.6,.7,-3.3,3.5,1.4,.2,M.white);cyl('wc',9.6,.42,-3.9,.5,.65,M.white);box('grab-bar',10.6,1,-3.75,.1,.1,1.4,M.orange);cyl('turning-circle',9.3,.24,-2.6,1.05,.025,mat('#dce7df'),32);
box('wc-vanity',10.72,.68,-2.2,1.22,.16,.58,M.wood2);cyl('wash-basin',10.72,.8,-2.2,.42,.15,M.white,24);box('mirror',10.72,1.75,-1.88,1.1,1.25,.05,M.glass,false);box('soap',10.25,.95,-2.16,.13,.25,.13,M.orange);

// Plants throughout
[[-5.5,-10.7],[-5.1,1.1],[5,-10.7],[5.3,4.7],[10.4,11.5],[-10.4,11.8],[5.8,7.1]].forEach(p=>plant(p[0],.45,p[1],.8));
for(const [x,z,s] of [[-13,-5.8,1.1],[-13,1.6,1],[-10.8,13.4,.9],[5.2,14.5,.95],[13.5,7.2,1.05]])tree(x,z,s);

// Ground plane and path
const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),mat('#ddd7cd'));ground.rotation.x=-Math.PI/2;ground.position.y=-.62;ground.receiveShadow=true;scene.add(ground);
for(let i=-10;i<=10;i+=2.2)box('entry-paver',i,-.55,18,1.9,.08,3.2,mat(i%4?'#c7bbb0':'#d2c6bb'),false);
for(const x of [-8.5,7.2]){box('outdoor-bench-seat',x,-.28,13.6,3,.18,.62,M.wood2);for(const dx of [-1.15,1.15])box('outdoor-bench-leg',x+dx,-.46,13.6,.12,.45,.52,M.ink)}

// Labels and navigation
const labelsEl=document.querySelector('#labels');
zones.forEach(z=>{const el=document.createElement('button');el.className='label';el.dataset.zone=z.id;labelsEl.append(el);z.el=el});
const nav=document.querySelector('#zones');
function renderZones(){
  nav.innerHTML=zones.map(z=>`<button class="zone-button${activeZoneId===z.id?' active':''}" data-zone="${z.id}"><b>${z.n}</b><span>${currentLang==='zh'?z.cn:z.en}</span><em>${currentLang==='zh'?z.en:z.cn}</em></button>`).join('');
  zones.forEach(z=>z.el.textContent=currentLang==='zh'?z.cn:z.en);
}
function setLanguage(lang){
  currentLang=lang;document.documentElement.lang=lang==='zh'?'zh-CN':'en';const t=copy[lang];
  document.querySelector('#headline').innerHTML=t.headline;document.querySelector('#intro').textContent=t.intro;document.querySelector('#hintText').innerHTML=t.hint;
  document.querySelector('#viewOverview').textContent=t.overview;document.querySelector('#viewHuman').textContent=t.human;document.querySelector('#viewRotate').textContent=t.rotate;document.querySelector('#viewLabels').textContent=t.labels;document.querySelector('#viewWalls').textContent=t.walls;document.querySelector('#viewLanguage').textContent=t.language;document.querySelector('#footerText').innerHTML=t.footer;
  renderZones();if(activeZoneId)updateInfo(descriptions[activeZoneId]);
}
renderZones();
const info=document.querySelector('#info');
function updateInfo(z){info.querySelector('.info-no').textContent=z.n;info.querySelector('h3').textContent=currentLang==='zh'?z.cn:z.en;info.querySelector('p:last-child').textContent=currentLang==='zh'?z.d:englishDescriptions[z.id]}
function showInfo(id){const z=descriptions[id];activeZoneId=id;document.querySelectorAll('[data-zone]').forEach(e=>e.classList.toggle('active',e.dataset.zone===id));updateInfo(z);info.classList.add('visible');focusZone(z)}
function focusZone(z){targetTween={fromP:camera.position.clone(),toP:new THREE.Vector3(z.x+8,8,z.z+10),fromT:controls.target.clone(),toT:new THREE.Vector3(z.x,.4,z.z),t:0}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-zone]');if(b)showInfo(b.dataset.zone)});document.querySelector('#closeInfo').onclick=()=>{activeZoneId=null;info.classList.remove('visible');document.querySelectorAll('.zone-button').forEach(b=>b.classList.remove('active'))};

let targetTween=null,autoRotate=false;
function setView(type){document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===type));const overview=type==='overview';targetTween={fromP:camera.position.clone(),toP:overview?new THREE.Vector3(22,27,30):new THREE.Vector3(0,4.8,20),fromT:controls.target.clone(),toT:new THREE.Vector3(0,0,overview?0:2),t:0}}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.querySelector('#rotate').onclick=e=>{autoRotate=!autoRotate;controls.autoRotate=autoRotate;controls.autoRotateSpeed=.65;e.currentTarget.classList.toggle('active',autoRotate)};
document.querySelector('#toggleLabels').onclick=e=>{labelsEl.classList.toggle('labels-off');e.currentTarget.classList.toggle('active')};
let cutaway=true;
function applyWallMode(){wallMeshes.forEach(w=>{const ghost=cutaway&&w.userData.cutaway;w.material.opacity=ghost ? .13 : 1;w.material.depthWrite=!ghost});document.querySelector('#toggleWalls').classList.toggle('active',cutaway)}
document.querySelector('#toggleWalls').onclick=()=>{cutaway=!cutaway;applyWallMode()};applyWallMode();
document.querySelector('#toggleLanguage').onclick=()=>setLanguage(currentLang==='zh'?'en':'zh');

function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock(),v=new THREE.Vector3();
function tick(){requestAnimationFrame(tick);const dt=clock.getDelta();if(targetTween){targetTween.t=Math.min(1,targetTween.t+dt*1.55);const q=1-Math.pow(1-targetTween.t,3);camera.position.lerpVectors(targetTween.fromP,targetTween.toP,q);controls.target.lerpVectors(targetTween.fromT,targetTween.toT,q);if(targetTween.t===1)targetTween=null}controls.update();zones.forEach(z=>{v.set(z.x,2.3,z.z).applyMatrix4(root.matrixWorld).project(camera);const visible=v.z<1;z.el.style.left=`${(v.x*.5+.5)*stage.clientWidth}px`;z.el.style.top=`${(-v.y*.5+.5)*stage.clientHeight}px`;z.el.style.display=visible?'block':'none'});renderer.render(scene,camera)}
tick();setTimeout(()=>document.querySelector('#loading').classList.add('hide'),500);
