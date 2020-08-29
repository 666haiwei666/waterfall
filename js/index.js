class particle{
  constructor(ctx,dh){
    this.ctx=ctx
    this.dh=dh

    this.width =  this.random(1,20)
    this.height =  this.random(1,45)
    this.positionX = this.getPositionX()
    this.positionY = -this.height
    this.vy = 0
    this.hue =  this.random(200, 220);
    this.saturation = this.random(30, 60); 
    this.lightness = this.random(30, 60);
  }
  getPositionX(){
    return this.random(10+(this.width/2), waterFallDomWidth-10-(this.width/2));
  }
  getPositionY(){
    return -this.height
  }
  random(min,max){
      // ~~ 快速取整
      return ~~((Math.random()*(max-min+1))+min);
  }
  update(){
    this.vy=this.vy+gravity
    this.positionY += this.vy	
  }
  render(){
    // this.ctx.strokeStyle='white'
    this.ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, .05)';
    this.ctx.beginPath();
    this.ctx.moveTo(this.positionX, this.positionY);  // 移动到某个位置
    this.ctx.lineTo(this.positionX, this.positionY + this.height); // 画一条线
    this.ctx.lineWidth = this.width/2; // 线的宽度
    this.ctx.lineCap = 'round'; // 绘制圆形的结束线帽
    this.ctx.stroke();
  }
  renderBubble(){
    this.ctx.fillStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, .3)';
    this.ctx.beginPath();
    this.ctx.arc(this.positionX+this.width/2, this.dh-10-this.random(0,10), this.random(1,8), 0, Math.PI*2, false);
    this.ctx.fill();
  }
}
// 
class waterFall{
    constructor(ctx,dh){
        this.particles=[]
        this.particleRate=6;
        this.ctx= ctx
        this.dh= dh
    }
    create(){
        for(let i=0;i<this.particleRate;i++){
            this.particles.push(new particle(this.ctx,this.dh));
        }
    }
    render(){
        this.particles.forEach(el=>{
            el.render()
        })					 
    }
    update(){
        this.particles.forEach(el=>{
            el.update()
        })					
    }
    remove(){
        this.particles.forEach((el,index)=>{
            if(el.positionY > this.dh-10-el.height){
                el.renderBubble()
                this.particles.splice(index, 1);
            }
        })
    }
}
class waterFallCanvas{
    constructor(dom,dw,dh){
        this.dom=dom
        this.dw=dom.width=dw
        this.dh=dom.height=dh
     }
     getContext(){
         return this.dom.getContext('2d') || this.dom.getContext ;
     }
     clearCanvas(ctx){			
        // https://segmentfault.com/a/1190000016214908	
        // destination-out 	在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(255,255,255,.03)';
        ctx.fillRect(0,0,this.dw,this.dh);
        // lighter 	显示源图像 + 目标图像。
        ctx.globalCompositeOperation = 'lighter';
    }
    init(){
        let ctx = this.getContext()
        let waterfall = new waterFall(ctx,this.dh)
        let loopIt=()=>{
            window.requestAnimationFrame(loopIt);
            this.clearCanvas(ctx)
            waterfall.create()					
            waterfall.update()					
            waterfall.render()	
            waterfall.remove()
        }
        loopIt();
     }
 }
const waterFallDom = document.getElementById('waterFall')
const waterFallDomHeight = 400;
const waterFallDomWidth = 500;
const gravity = 0.15
 const setupRAF = ()=>{
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    };
    
    if(!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element){
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    };
    
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id){
            clearTimeout(id);
        };
    };
};
const waterfall = new waterFallCanvas(waterFallDom, waterFallDomWidth, waterFallDomHeight);
setupRAF()
waterfall.init()