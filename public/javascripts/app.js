(function(){for(var a=0,b=["webkit","moz"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b,c){var e=(new Date).getTime(),g=Math.max(0,16-(e-a)),h=window.setTimeout(function(){b(e+g)},g);a=e+g;return h});window.cancelAnimationFrame||(window.cancelAnimationFrame=
function(a){clearTimeout(a)})})();function KeyboardInputManager(){this.events={};this.listen()}KeyboardInputManager.prototype.on=function(a,b){this.events[a]||(this.events[a]=[]);this.events[a].push(b)};KeyboardInputManager.prototype.emit=function(a,b){var c=this.events[a];c&&c.forEach(function(a){a(b)})};
KeyboardInputManager.prototype.listen=function(){var a=this,b={38:0,39:1,40:2,37:3,75:0,76:1,74:2,72:3,87:0,68:1,83:2,65:3};document.addEventListener("keydown",function(c){var d=b[c.which];c.altKey||c.ctrlKey||c.metaKey||c.shiftKey||(void 0!==d&&(c.preventDefault(),a.emit("move",d)),32===c.which&&a.restart.bind(a)(c))});var c=document.querySelector(".retry-button");c.addEventListener("click",this.restart.bind(this));c.addEventListener("touchend",this.restart.bind(this));c=document.querySelector(".keep-playing-button");
c.addEventListener("click",this.keepPlaying.bind(this));c.addEventListener("touchend",this.keepPlaying.bind(this));var d,f,c=document.getElementsByClassName("game-container")[0];c.addEventListener("touchstart",function(a){1<a.touches.length||(d=a.touches[0].clientX,f=a.touches[0].clientY,a.preventDefault())});c.addEventListener("touchmove",function(a){a.preventDefault()});c.addEventListener("touchend",function(b){if(!(0<b.touches.length)){var c=b.changedTouches[0].clientX-d,h=Math.abs(c);b=b.changedTouches[0].clientY-
f;var m=Math.abs(b);10<Math.max(h,m)&&a.emit("move",h>m?0<c?1:3:0<b?2:0)}})};KeyboardInputManager.prototype.restart=function(a){a.preventDefault();this.emit("restart")};KeyboardInputManager.prototype.keepPlaying=function(a){a.preventDefault();this.emit("keepPlaying")};function HTMLActuator(){this.tileContainer=document.querySelector(".tile-container");this.scoreContainer=document.querySelector(".score-container");this.bestContainer=document.querySelector(".best-container");this.messageContainer=document.querySelector(".game-message");this.score=0}
HTMLActuator.prototype.actuate=function(a,b){var c=this;window.requestAnimationFrame(function(){c.clearContainer(c.tileContainer);a.cells.forEach(function(a){a.forEach(function(a){a&&c.addTile(a)})});c.updateScore(b.score);c.updateBestScore(b.bestScore);b.terminated&&(b.over?c.message(!1,b.score,b.bestScore):b.won&&c.message(!0,b.score,b.bestScore))})};HTMLActuator.prototype["continue"]=function(){this.clearMessage()};HTMLActuator.prototype.clearContainer=function(a){for(;a.firstChild;)a.removeChild(a.firstChild)};
HTMLActuator.prototype.addTile=function(a){var b=this,c=document.createElement("div"),d=document.createElement("div"),f=this.positionClass(a.previousPosition||{x:a.x,y:a.y}),e=["tile","tile-"+a.value,f];2048<a.value&&e.push("tile-super");this.applyClasses(c,e);d.classList.add("tile-inner");d.textContent=a.value;a.previousPosition?window.requestAnimationFrame(function(){e[2]=b.positionClass({x:a.x,y:a.y});b.applyClasses(c,e)}):a.mergedFrom?(e.push("tile-merged"),this.applyClasses(c,e),a.mergedFrom.forEach(function(a){b.addTile(a)})):
(e.push("tile-new"),this.applyClasses(c,e));c.appendChild(d);this.tileContainer.appendChild(c)};HTMLActuator.prototype.applyClasses=function(a,b){a.setAttribute("class",b.join(" "))};HTMLActuator.prototype.normalizePosition=function(a){return{x:a.x+1,y:a.y+1}};HTMLActuator.prototype.positionClass=function(a){a=this.normalizePosition(a);return"tile-position-"+a.x+"-"+a.y};
HTMLActuator.prototype.updateScore=function(a){this.clearContainer(this.scoreContainer);var b=a-this.score;this.score=a;this.scoreContainer.textContent=this.score;0<b&&(a=document.createElement("div"),a.classList.add("score-addition"),a.textContent="+"+b,this.scoreContainer.appendChild(a))};HTMLActuator.prototype.updateBestScore=function(a){this.bestContainer.textContent=a};
HTMLActuator.prototype.message=function(a,b,c){var d=a?"game-won":"game-over",f=a?"You win!":"Game over!",e=$("#timer").text().split(":");$.ajax({url:"/score",type:"post",data:JSON.stringify({best:c,score:b,time:e,win:!0===a?!0:!1}),contentType:"application/json",success:function(a){console.log(a)}});Stop();this.messageContainer.classList.add(d);this.messageContainer.getElementsByTagName("p")[0].textContent=f};
HTMLActuator.prototype.clearMessage=function(){this.messageContainer.classList.remove("game-won");this.messageContainer.classList.remove("game-over");Start()};function Grid(a){this.size=a;this.cells=[];this.build()}Grid.prototype.build=function(){for(var a=0;a<this.size;a++)for(var b=this.cells[a]=[],c=0;c<this.size;c++)b.push(null)};Grid.prototype.randomAvailableCell=function(){var a=this.availableCells();if(a.length)return a[Math.floor(Math.random()*a.length)]};Grid.prototype.availableCells=function(){var a=[];this.eachCell(function(b,c,d){d||a.push({x:b,y:c})});return a};
Grid.prototype.eachCell=function(a){for(var b=0;b<this.size;b++)for(var c=0;c<this.size;c++)a(b,c,this.cells[b][c])};Grid.prototype.cellsAvailable=function(){return!!this.availableCells().length};Grid.prototype.cellAvailable=function(a){return!this.cellOccupied(a)};Grid.prototype.cellOccupied=function(a){return!!this.cellContent(a)};Grid.prototype.cellContent=function(a){return this.withinBounds(a)?this.cells[a.x][a.y]:null};Grid.prototype.insertTile=function(a){this.cells[a.x][a.y]=a};
Grid.prototype.removeTile=function(a){this.cells[a.x][a.y]=null};Grid.prototype.withinBounds=function(a){return 0<=a.x&&a.x<this.size&&0<=a.y&&a.y<this.size};function Tile(a,b){this.x=a.x;this.y=a.y;this.value=b||2;this.mergedFrom=this.previousPosition=null}Tile.prototype.savePosition=function(){this.previousPosition={x:this.x,y:this.y}};Tile.prototype.updatePosition=function(a){this.x=a.x;this.y=a.y};window.fakeStorage={_data:{},setItem:function(a,b){return this._data[a]=String(b)},getItem:function(a){return this._data.hasOwnProperty(a)?this._data[a]:void 0},removeItem:function(a){return delete this._data[a]},clear:function(){return this._data={}}};function LocalScoreManager(){this.key="bestScore";this.storage=this.localStorageSupported()?window.localStorage:window.fakeStorage}
LocalScoreManager.prototype.localStorageSupported=function(){var a=window.localStorage;try{return a.setItem("test","1"),a.removeItem("test"),!0}catch(b){return!1}};LocalScoreManager.prototype.get=function(){return this.storage.getItem(this.key)||0};LocalScoreManager.prototype.set=function(a){this.storage.setItem(this.key,a)};function GameManager(a,b,c,d){this.size=a;this.inputManager=new b;this.scoreManager=new d;this.actuator=new c;this.startTiles=2;this.inputManager.on("move",this.move.bind(this));this.inputManager.on("restart",this.restart.bind(this));this.inputManager.on("keepPlaying",this.keepPlaying.bind(this));this.setup()}GameManager.prototype.restart=function(){this.actuator["continue"]();this.setup();Reset()};GameManager.prototype.keepPlaying=function(){this.keepPlaying=!0;this.actuator["continue"]()};
GameManager.prototype.isGameTerminated=function(){return this.over||this.won&&!this.keepPlaying?!0:!1};GameManager.prototype.setup=function(){this.grid=new Grid(this.size);this.score=0;this.keepPlaying=this.won=this.over=!1;this.addStartTiles();this.actuate();Start()};GameManager.prototype.addStartTiles=function(){for(var a=0;a<this.startTiles;a++)this.addRandomTile()};
GameManager.prototype.addRandomTile=function(){if(this.grid.cellsAvailable()){var a=0.9>Math.random()?2:4,a=new Tile(this.grid.randomAvailableCell(),a);this.grid.insertTile(a)}};GameManager.prototype.actuate=function(){this.scoreManager.get()<this.score&&this.scoreManager.set(this.score);this.actuator.actuate(this.grid,{score:this.score,over:this.over,won:this.won,bestScore:this.scoreManager.get(),terminated:this.isGameTerminated()})};
GameManager.prototype.prepareTiles=function(){this.grid.eachCell(function(a,b,c){c&&(c.mergedFrom=null,c.savePosition())})};GameManager.prototype.moveTile=function(a,b){this.grid.cells[a.x][a.y]=null;this.grid.cells[b.x][b.y]=a;a.updatePosition(b)};
GameManager.prototype.move=function(a){var b=this;if(!this.isGameTerminated()){var c,d,f=this.getVector(a),e=this.buildTraversals(f),g=!1;this.prepareTiles();e.x.forEach(function(a){e.y.forEach(function(e){c={x:a,y:e};if(d=b.grid.cellContent(c)){e=b.findFarthestPosition(c,f);var k=b.grid.cellContent(e.next);if(k&&k.value===d.value&&!k.mergedFrom){var l=new Tile(e.next,2*d.value);l.mergedFrom=[d,k];b.grid.insertTile(l);b.grid.removeTile(d);d.updatePosition(e.next);b.score+=l.value;2048===l.value&&
(b.won=!0)}else b.moveTile(d,e.farthest);b.positionsEqual(c,d)||(g=!0)}})});g&&(this.addRandomTile(),this.movesAvailable()||(this.over=!0),this.actuate())}};GameManager.prototype.getVector=function(a){return{0:{x:0,y:-1},1:{x:1,y:0},2:{x:0,y:1},3:{x:-1,y:0}}[a]};GameManager.prototype.buildTraversals=function(a){for(var b={x:[],y:[]},c=0;c<this.size;c++)b.x.push(c),b.y.push(c);1===a.x&&(b.x=b.x.reverse());1===a.y&&(b.y=b.y.reverse());return b};
GameManager.prototype.findFarthestPosition=function(a,b){var c;do c=a,a={x:c.x+b.x,y:c.y+b.y};while(this.grid.withinBounds(a)&&this.grid.cellAvailable(a));return{farthest:c,next:a}};GameManager.prototype.movesAvailable=function(){return this.grid.cellsAvailable()||this.tileMatchesAvailable()};
GameManager.prototype.tileMatchesAvailable=function(){for(var a,b=0;b<this.size;b++)for(var c=0;c<this.size;c++)if(a=this.grid.cellContent({x:b,y:c}))for(var d=0;4>d;d++){var f=this.getVector(d);if((f=this.grid.cellContent({x:b+f.x,y:c+f.y}))&&f.value===a.value)return!0}return!1};GameManager.prototype.positionsEqual=function(a,b){return a.x===b.x&&a.y===b.y};window.requestAnimationFrame(function(){new GameManager(4,KeyboardInputManager,HTMLActuator,LocalScoreManager)});$("#stop").hide();var startTime=0,start=0,end=0,diff=0,reset=!1,timerID=0;$("#start").click(function(a){a.preventDefault();Start();return!1});$("#stop").click(function(a){a.preventDefault();Stop();return!1});$("#reset").click(function(a){a.preventDefault();Reset();return!1});
function chrono(){end=new Date;diff=end-start;diff=new Date(diff);var a=diff.getMilliseconds(),b=diff.getSeconds(),c=diff.getMinutes(),d=diff.getHours()-diff.getHours();10>a?a="00"+a:100>a&&(a="0"+a);10>b&&(b="0"+b);10>c&&(c="0"+c);10>d&&(d="0"+d);$("#timer").html(d+" : "+c+" : "+b+" : "+a)}function Start(){$(".tog").toggle();reset?start=new Date:(start=new Date-diff,start=new Date(start));timerID=setInterval(chrono,10)}
function Reset(){$("#timer").html("00 : 00 : 00 <em>000</em>");start=new Date;reset=!0}function Stop(){$(".tog").toggle();clearTimeout(timerID)}$(".leaderboard h2").on("click",function(){$(".tabs").toggle(400)});$("#facebookShare").on("click",function(){ga("send","event","share","click","facebook",1,{nonInteraction:1})});$("#twitterShare").on("click",function(){ga("send","event","share","click","twitter",1,{nonInteraction:1})});
$("#googleShare").on("click",function(){ga("send","event","share","click","google",1,{nonInteraction:1})});window.onbeforeunload=sendView;function sendView(){ga("send","pageview","/exit")}$(".keep-playing-button").on("click",function(){ga("send","event","game","click","continue",1,{nonInteraction:1})});$(".retry-button").on("click",function(){ga("send","event","game","click","retry",1,{nonInteraction:1});ga("send","pageview","/retry")});