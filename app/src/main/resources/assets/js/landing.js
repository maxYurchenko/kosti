function initCountdown(){$("#days").length&&$("#hours").length&&$("#minutes").length&&$("#seconds").length&&countdown("05/10/2019 06:00:00 PM")}function countdown(t){var i,o,s,r;t=new Date(t).getTime(),isNaN(t)||setInterval(function(){var n=new Date;n=n.getTime();var e=parseInt((t-n)/1e3);{if(!(0<=e))return;i=parseInt(e/86400),e%=86400,o=parseInt(e/3600),e%=3600,s=parseInt(e/60),e%=60,r=parseInt(e),document.getElementById("days").innerHTML=parseInt(i,10),document.getElementById("hours").innerHTML=("0"+o).slice(-2),document.getElementById("minutes").innerHTML=("0"+s).slice(-2),document.getElementById("seconds").innerHTML=("0"+r).slice(-2)}},1e3)}$(document).ready(function(){initCountdown()});