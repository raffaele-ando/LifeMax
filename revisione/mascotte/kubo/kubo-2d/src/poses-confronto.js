const F=n=>require('fs').readdirSync(__dirname+'/../../kubo-zip/kubo').sort()[n];
module.exports=[
 {label:'Felice in salto',crop:[F(15),0.1,0.12,0.9,0.92],vb:'-500 -800 1000 833',pose:{y:-80,rot:-12,turn:0.4,expr:{felici:1},mouth:0,sy:1.05,sx:0.96,
   handL:{x:10,y:-20,rot:-30},handR:{x:-10,y:-60,rot:35},footL:{x:-14,y:-4,rot:22},footR:{x:34,y:-30,rot:-35},antRot:-10,shadowS:0.8}},
 {label:'Calmo',crop:[F(6),0.805,0.235,0.985,0.375],noSparks:1,pose:{rot:3,turn:-0.1,expr:{sereno:1},handL:{y:8,rot:-8},handR:{y:8,rot:8},footL:{rot:-6},footR:{rot:6},antRot:3}},
 {label:'Concentrato',crop:[F(8),0.0,0.27,0.25,0.47],noSparks:1,prop:'laptop',propBehindHands:1,pose:{handsFront:1,rot:-3,turn:0.2,y:0,expr:{concentrato:1},gazeY:10,gazeX:12,handL:{x:70,y:120,rot:60},handR:{x:10,y:130,rot:-40},antRot:-4,sy:0.96,sx:1.02}},
 {label:'Assonnato',crop:[F(8),0.25,0.52,0.5,0.72],noSparks:1,feetFront:1,prop:'puff',pose:{rot:6,turn:-0.15,y:40,sy:0.92,sx:1.04,expr:{assonnato:1},gazeY:8,handL:{y:50,rot:-20},handR:{y:46,rot:16},footL:{x:-30,y:-40,rot:-12,s:1.05},footR:{x:30,y:-40,rot:12,s:1.05},antRot:10,capRot:6,shadowS:1.1}},
];
