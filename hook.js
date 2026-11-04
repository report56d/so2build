var O={worldToScreen:0x2F1A40,screenPointToRay:0x2F2200,setRotation:0x2D4400};
var lib,WALL=true,AIM=true,SPIN=true;
function B(){return lib.base;}
var lastSend=0;
function tsend(o){var n=Date.now();if(n-lastSend<50)return;lastSend=n;send(o);}
function initWall(){var buf=[];Interceptor.attach(B().add(O.worldToScreen),{onLeave:function(r){if(!WALL)return;var x=r.readFloat(),y=r.add(4).readFloat();if(x>-500&&x<3500&&y>-500&&y<3500)buf.push([x,y]);}});setInterval(function(){if(buf.length){tsend({t:"wh",pts:buf});buf=[];}},100);}
var aimTarget=null;
function initAim(){Interceptor.attach(B().add(O.screenPointToRay),{onEnter:function(a){if(!AIM||!aimTarget)return;a[1]=ptr(aimTarget.x);a[2]=ptr(aimTarget.y);}});}
var spinAngle=0,lastSpin=0,spinQ=Memory.alloc(16);
function initSpin(){Interceptor.attach(B().add(O.setRotation),{onEnter:function(a){if(!SPIN)return;var n=Date.now();if(n-lastSpin<60)return;lastSpin=n;spinAngle=(spinAngle+15)%360;var r=spinAngle*Math.PI/180;spinQ.writeFloat(Math.cos(r/2));spinQ.add(4).writeFloat(0);spinQ.add(8).writeFloat(Math.sin(r/2));spinQ.add(12).writeFloat(0);a[1]=spinQ;}});}
recv("aim",function(m){aimTarget={x:m.x,y:m.y};});
Java.perform(function(){lib=Process.findModuleByName("libil2cpp.so");if(!lib)return;initWall();initAim();initSpin();});
