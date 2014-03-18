// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
});

$("#stop").hide();
var startTime = 0;
var start = 0;
var end = 0;
var diff = 0;
var reset = false;
var timerID = 0;
 
          $("#start").click(function(e){
e.preventDefault();
Start();
return false;
});
 
          $("#stop").click(function(e){
e.preventDefault();
Stop();
return false;
});
 
          $("#reset").click(function(e){
e.preventDefault();
Reset();
return false;
});
            
 
function chrono(){
           end = new Date();
           diff = end - start;
           diff = new Date(diff);
           var msec = diff.getMilliseconds();
           var sec = diff.getSeconds();
           var min = diff.getMinutes();
           var hr = diff.getHours() - diff.getHours();
         
           if(msec < 10){
           msec = "00" +msec;
           }
           else if(msec < 100){
           msec = "0" +msec;
           }
           if (sec < 10){
           sec = "0" + sec;
           }
           if (min < 10){
           min = "0" + min;
           }
           if (hr < 10){
           hr = "0" + hr;
           }
           $("#timer").html(hr+" : "+min+" : "+sec+" : "+msec);
          }
         
function Start(){
         $(".tog").toggle();
           if (reset) start = new Date();
           else{
           start = new Date()-diff
               start = new Date(start)
            }
           timerID = setInterval(chrono, 10);
          }
 
function Reset(){
          $("#timer").html("00 : 00 : 00 <em>000</em>");
          start = new Date();
          reset = true;
          }
    
function Stop(){
          $(".tog").toggle();
          clearTimeout(timerID);
          }