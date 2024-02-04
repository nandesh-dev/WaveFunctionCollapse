(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=e(n);fetch(n.href,o)}})();const t={BLANK:"BLANK",UP:"UP",DOWN:"DOWN",LEFT:"LEFT",RIGHT:"RIGHT"},a={BLANK:{image:"1.png",conditions:{up:[t.DOWN,t.BLANK],right:[t.LEFT,t.BLANK],down:[t.UP,t.BLANK],left:[t.RIGHT,t.BLANK]}},UP:{image:"2.png",conditions:{up:[t.BLANK,t.DOWN],right:[t.UP,t.RIGHT,t.DOWN],down:[t.RIGHT,t.DOWN,t.LEFT],left:[t.UP,t.LEFT,t.DOWN]}},RIGHT:{image:"5.png",conditions:{up:[t.LEFT,t.UP,t.RIGHT],right:[t.BLANK,t.LEFT],down:[t.RIGHT,t.DOWN,t.LEFT],left:[t.UP,t.LEFT,t.DOWN]}},DOWN:{image:"3.png",conditions:{up:[t.LEFT,t.UP,t.RIGHT],right:[t.RIGHT,t.DOWN,t.UP],down:[t.BLANK,t.UP],left:[t.UP,t.LEFT,t.DOWN]}},LEFT:{image:"4.png",conditions:{up:[t.LEFT,t.UP,t.RIGHT],right:[t.UP,t.RIGHT,t.DOWN],down:[t.RIGHT,t.DOWN,t.LEFT],left:[t.BLANK,t.RIGHT]}}},h=3*1;class d{constructor(){this._init().then(()=>{setInterval(()=>{this._generate(),this._display()})})}async _init(){this._canvas=document.createElement("canvas"),this._ctx=this._canvas.getContext("2d"),this._canvas.height=window.innerHeight,this._canvas.width=window.innerWidth,document.getElementById("app").appendChild(this._canvas),this._dimention=[Math.floor(this._canvas.width/h),Math.floor(this._canvas.height/h)],await this._loadImages(),this._buildMatrix(),this._display()}async _loadImages(){const i=[];Object.keys(a).forEach(s=>{i.push(f("https://raw.githubusercontent.com/nandesh-dev/WaveFunctionCollapse/main/assets/"+a[s].image))});const e=await Promise.all(i);this._images={},Object.keys(a).forEach((s,n)=>{this._images[s]=e[n]})}_buildMatrix(){this._matrix=[];for(let i=0;i<this._dimention[1];i++){this._matrix[i]=[];for(let e=0;e<this._dimention[0];e++)this._matrix[i][e]=new g}for(let i=0;i<this._dimention[1];i++)for(let e=0;e<this._dimention[0];e++){const s=this._matrix[i-1>=0?i-1:this._matrix.length-1][e],n=this._matrix[i+1<this._matrix.length?i+1:0][e],o=this._matrix[i][e+1<this._matrix[i].length?e+1:0],r=this._matrix[i][e-1>=0?e-1:this._matrix[i].length-1];this._matrix[i][e].addNeighbors(s,o,n,r)}this._matrix[0][0].finalize()}_generate(){let i=!1,e={value:-1,blocks:[]};for(let s=0;s<this._dimention[1];s++)for(let n=0;n<this._dimention[0];n++){const o=this._matrix[s][n],r=o.options.length;if(r!==1){o.updateOptions();const l=o.options.length;r!==l&&(i=!0),l==0||(e.value==-1?(e.value=l,e.blocks=[o]):l==e.value?e.blocks.push(o):l<e.value&&(e.value=l,e.blocks=[o]))}}i||e.blocks[Math.round(Math.random()*(e.blocks.length-1))].finalize()}_display(){for(let i=0;i<this._dimention[1];i++)for(let e=0;e<this._dimention[0];e++){const s=this._matrix[i][e].options.length;if(s==1){const n=this._images[this._matrix[i][e].options[0]];this._ctx.drawImage(n,h*e,h*i)}else{switch(s){case 0:this._ctx.fillStyle="#25c374";break;case 2:this._ctx.fillStyle="#596359";break;case 3:this._ctx.fillStyle="#434843";break;case 4:this._ctx.fillStyle="#272927";break;case 5:this._ctx.fillStyle="#181918";break}this._ctx.fillRect(h*e,h*i,h,h)}}}}function f(c){return new Promise(i=>{const e=new Image;e.onload=()=>{i(e)},e.onerror=s=>{console.error("Error fetching image with src: "+c)},e.src=c})}class g{constructor(){this.options=Object.keys(a)}finalize(){if(this.options.length<=1)return;const i=this.options[Math.round(Math.random()*(this.options.length-1))];this.options=[i]}addNeighbors(i,e,s,n){this._neighbors={up:i,right:e,down:s,left:n}}updateOptions(){const i={up:[],right:[],down:[],left:[]};this._neighbors.up.options.forEach(s=>{i.up.push(...a[s].conditions.down)}),this._neighbors.right.options.forEach(s=>{i.right.push(...a[s].conditions.left)}),this._neighbors.down.options.forEach(s=>{i.down.push(...a[s].conditions.up)}),this._neighbors.left.options.forEach(s=>{i.left.push(...a[s].conditions.right)}),this._neighbors.up.options.length==0&&(i.up=Object.keys(t)),this._neighbors.right.options.length==0&&(i.right=Object.keys(t)),this._neighbors.down.options.length==0&&(i.down=Object.keys(t)),this._neighbors.left.options.length==0&&(i.left=Object.keys(t));const e=[];this.options.forEach(s=>{!i.up.includes(s)||!i.right.includes(s)||!i.down.includes(s)||!i.left.includes(s)||e.push(s)}),this.options=e}}new d;
