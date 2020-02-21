/*! Player 56s v0.5.0 https://github.com/dymio/player-56s */
!function(a){"use strict";function q(a,b){this.version="0.5.0",this.$link=a,this.options=b,this.minimal=a.hasClass("minimal"),this.isPlaying=!1,this.isPlayed=!1,this.totalTime=0,this.fullyLoaded=!1,this.fullTimeDisplayed=!1,this.waitForLoad=!1,this.seekTime=0,this.preloaderTimeout=null,this.isSeeking=!1,this.tracks=[],this.currentTrack=0,this.init()}var b=!1,c=function(){var a=document.createElement("div");return a.innerHTML="<svg/>","http://www.w3.org/2000/svg"==(a.firstChild&&a.firstChild.namespaceURI)},d=function(){return("object"==typeof Modernizr&&"boolean"==typeof Modernizr.inlinesvg&&Modernizr.inlinesvg||c())&&(b=!0),this},e=function(a){var b=" - ";return a.indexOf(" — ")>-1&&(b=" — "),a.toString().split(b)},f=function(a){var b=e(a);return b.length>1?b[1]:b[0]},g=function(a){var b=e(a);return b.length>1?"by "+b[0]:""},h=function(a){if("number"!=typeof a)return a;var b=Math.round(a)%60,c=(Math.round(a)-b)%3600/60,d=(Math.round(a)-b-60*c)/3600;return(d?d+":":"")+(d&&c<10?"0"+c:c)+":"+(b<10?"0"+b:b)},i=function(a){if("number"==typeof a)return a;for(var b=a.split(":").reverse(),c=0,d=0;d<b.length;d++)c+=b[d]*Math.pow(60,d);return c},j=function(a,b){return a},k=function(a){return a},l=function(a,b){if(a.fullyLoaded&&a.totalTime||!a.isPlayed)return a;var c=Math.round(b.seekPercent);return c>=100?(a.fullyLoaded=!0,a.totalTime=b.duration):c>0?a.totalTime=b.duration:a.totalTime=0,a.$container.find(".player56s-timeline-load").css({width:Math.floor(Math.min(100,c))+"%"}),a},m=function(a,b){return a.seekTime&&!a.isSeeking?a:(a.$container.find(".player56s-timeline-done").css("width",b+"%"),a)},n=function(a,b){if(a.$container.find(".player56s-time").length<1)return a;if(a.totalTime<=0&&!a.options.length)return a;var c=a.totalTime||i(a.options.length);return(a.isPlaying||a.waitForLoad)&&(c||a.seekTime)&&a.$container.find(".player56s-time").html(h(c-(a.seekTime?a.seekTime:b))),a},o=function(a,b){var c=b.toFixed(2);return c<0?c=0:c>100&&(c=100),m(a,c),j(a),a.waitForLoad=!0,a.$jPlayer.jPlayer("playHead",c),a.pseudoPlay(),a.fullTimeDisplayed?(a.seekTime=a.totalTime/100*c,n(a,a.seekTime)):a.options.length?(a.seekTime=i(a.options.length)/100*c,n(a,a.seekTime)):a.seekTime=.01,a},p=function(b){var c=b.$container.find(".player56s-title");if(!c.length)return b;var d=c.children("span");if(d.length&&d.height()-10>c.height()){for(d.css({display:"block",position:"relative"}).width(c.width());d.height()-10>c.height();)d.width(d.width()+20);var e=function(){if(!this)return!1;var b=a(this),c=b.parent();if(!c.length)return!1;var d=b.width()-c.width();b.animate({left:b.css("left")},1e3,function(){b.css("left","0"),b.animate({left:"0"},2e3,function(){b.animate({left:"-"+d+"px"},40*d,"linear",e)})})};e.call(d[0])}return b};a.fn.player56s=function(b){var c=[];return this.each(function(){var d=a(this),e=d.attr("class"),f=d.attr("rel"),g=e.indexOf("minimal")>-1,h=!g&&f,i=e.indexOf("player56s-skin-"),j=d.data("player56s"),k="",l=!0;if(h)for(var m=0;m<c.length;m++)if(c[m].group==f){var n=d.attr("href"),o=d.html();c[m].pl56s.addTrack(n,o,a.extend({},d.data())),d.detach(),l=!1;break}if(l)if(j);else{i>0&&(k=e.substr(i+12,e.indexOf(" ",i)>0?e.indexOf(" ",i):e.length));var p=new q(d,a.extend({},a.fn.player56s.defaults,b,d.data(),{skin:k}));h&&c.push({group:f,pl56s:p})}})},a.fn.player56s.defaults={swfPath:"./vendor/",swfFilename:"jquery.jplayer.swf",supplied:"mp3",volume:.6,length:0,scrollOnSpace:!1,pauseOnSpace:!0,hideTimelineOnPause:!1,skin:""},q.prototype.init=function(){this.tracks.push({audiofileLink:this.$link.attr("href"),filename:this.$link.html(),length:this.options.length}),this.checkOptions(),this.createDOM(),this.initPlayerPlugin(),this.bindEvents(),this.insertDOM()},q.prototype.addTrack=function(b,c,d){this.tracks.push({audiofileLink:b,filename:c,length:d?d.length:null}),this.$container.find(".player56s-track-next").addClass("enabled")},q.prototype.destroy=function(){var c=this.$container.attr("id");return this.$container.after(this.$link).remove(),a(document).off("."+c),this.$link.removeData("player56s"),this.$link},q.prototype.pause=function(){return k(this),this.seekTime||(this.waitForLoad=!1),"undefined"!=typeof this.$jPlayer&&this.$jPlayer.jPlayer&&(this.isPlaying||this.waitForLoad)&&(this.isPlaying=!1,this.waitForLoad=!1,this.$jPlayer.jPlayer("pause")),this.isPlaying||this.pseudoPause(),this},q.prototype.pseudoPause=function(){this.$container.removeClass("player56s-status-playing")},q.prototype.stop=function(){return"undefined"!=typeof this.$jPlayer&&this.$jPlayer.jPlayer&&this.isPlaying&&this.$jPlayer.jPlayer("stop"),this},q.prototype.play=function(){return j(this,!this.seekTime&&500),this.isPlayed=!0,"undefined"!=typeof this.$jPlayer&&this.$jPlayer.jPlayer&&(this.isPlaying||this.$jPlayer.jPlayer("play")),this},q.prototype.pseudoPlay=function(){a(document).trigger("player56s-pause",this),this.isPlayed=!0,this.$container.addClass("player56s-status-playing")},q.prototype.setVolume=function(b,c){var d=!1;return"undefined"!=typeof this.$jPlayer&&this.$jPlayer.jPlayer&&(b=b||0,c=c||1,b>c&&(b=c),this.$jPlayer.jPlayer("volume",b/c),d=!0),d},q.prototype.switchTrack=function(b){if(void 0===b&&(b=!0),"undefined"!=typeof this.$jPlayer&&this.$jPlayer.jPlayer){if(b&&this.currentTrack>this.tracks.length-2)return!1;if(!b&&this.currentTrack<1)return!1;this.pseudoPause(),this.pause(),this.stop(),this.$jPlayer.jPlayer("clearMedia"),this.currentTrack=this.currentTrack+(b?1:-1);var c=this.tracks[this.currentTrack];this.$jPlayer.jPlayer("setMedia",{mp3:c.audiofileLink}),this.$container.find(".player56s-title").html("<span>"+f(c.filename)+"</span>"),this.$container.find(".player56s-author").html("<span>"+g(c.filename)+"</span>"),this.waitForLoad=!0,this.pseudoPlay(),this.play(),this.$container.find(".player56s-track-prev").toggleClass("enabled",this.currentTrack>0),this.$container.find(".player56s-track-next").toggleClass("enabled",this.currentTrack<this.tracks.length-1),p(this)}},q.prototype.onPause=function(){this.isPlaying=!1,this.isSeeking=!1,this.waitForLoad=!1,this.$container.removeClass("player56s-status-playing")},q.prototype.onStop=function(){console.log("stop"),this.isPlaying=!1,this.seekTime=0,this.isSeeking=!1,this.waitForLoad=!1,this.$container.removeClass("player56s-status-playing")},q.prototype.onPlay=function(){a(document).trigger("player56s-pause",this),this.$container.addClass("player56s-status-playing"),this.waitForLoad=!1,this.isPlaying=!0,this.isPlayed=!0},q.prototype.checkOptions=function(){parseInt(this.options.length)||(this.options.length=0)},q.prototype.createDOM=function(){var c=a(document.createElement("div")),d=a(document.createElement("div")),e=a(document.createElement("div")),j=this.tracks[0].filename,k=this,l=function(){return[a(document.createElement("div")).addClass("player56s-timeline").append(a(document.createElement("div")).addClass("player56s-timeline-load"),a(document.createElement("div")).addClass("player56s-timeline-done")),a(document.createElement("div")).addClass("player56s-button"),a(document.createElement("div")).addClass("player56s-volume").append(a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active").addClass("zero-vol"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active"),a(document.createElement("div")).addClass("player56s-vol-pin"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("max-vol")),a(document.createElement("div")).addClass("player56s-time").html(k.options.length?h(i(k.options.length)):"")]},m=function(){return[a(document.createElement("div")).addClass("player56s-title").html("<span>"+f(j)+"</span>"),a(document.createElement("div")).addClass("player56s-author").html("<span>"+g(j)+"</span>"),a(document.createElement("div")).addClass("player56s-timeline").append(a(document.createElement("div")).addClass("player56s-timeline-load"),a(document.createElement("div")).addClass("player56s-timeline-done")),a(document.createElement("div")).addClass("player56s-button"),a(document.createElement("div")).addClass("player56s-volume").append(a(document.createElement("div")).addClass("player56s-vol-pin").addClass("max-vol"),a(document.createElement("div")).addClass("player56s-vol-pin"),a(document.createElement("div")).addClass("player56s-vol-pin"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active"),a(document.createElement("div")).addClass("player56s-vol-pin").addClass("active").addClass("zero-vol")),a(document.createElement("div")).addClass("player56s-tracks").append(a(document.createElement("div")).addClass("player56s-track-nav").addClass("player56s-track-prev"),a(document.createElement("div")).addClass("player56s-track-nav").addClass("player56s-track-next"))]},n=function(){return k.minimal?l():m()};return this.$container=c.data("player56s",this).addClass("player56s").addClass(k.minimal?"minimal":"normal").attr("id","player56s-ui-zone-"+(1e3+Math.round(8999*Math.random()))).append(d.addClass("player56s-invisible-object"),e.addClass("player56s-content").append(n())),this},q.prototype.initPlayerPlugin=function(){var c=this,d=c.$container.find(".player56s-invisible-object");return this.$jPlayer=d.jPlayer({solution:"html",wmode:"window",preload:"metadata",swfPath:c.options.swfPath+c.options.swfFilename,supplied:c.options.supplied,volume:c.options.volume,ready:function(){var b=c.tracks[0].audiofileLink,e=c.$container.attr("id");d.jPlayer("setMedia",{mp3:b}),c.$container.find(".player56s-button").on("click",function(a){a.preventDefault(),a.stopPropagation(),c.isPlaying?(c.pseudoPause.call(c),c.pause.call(c)):(c.waitForLoad=!0,c.pseudoPlay.call(c),c.play.call(c))}),c.$container.find(".player56s-volume .player56s-vol-pin").on("click",function(b){b.preventDefault(),b.stopPropagation();var d=a(this),e=c.minimal?d.prevAll():d.nextAll(),f=e.length,g=d.siblings().length;if(c.setVolume.call(c,f,g)){e.addClass("active"),d.addClass("active");var h=c.minimal?d.nextAll():d.prevAll();h.removeClass("active")}}),c.$container.find(".player56s-track-nav").on("click",function(b){b.preventDefault(),b.stopPropagation(),c.switchTrack.call(c,a(this).hasClass("player56s-track-next"))}),c.$container.find(".player56s-timeline").on("mousedown."+e,function(b){if(1!==b.which)return!1;b.stopPropagation(),b.preventDefault(),c.isSeeking=!0;var d=a(this),f=(b.pageX-d.offset().left)/d.width()*100;a(document).off("mouseup."+e).one("mouseup."+e,function(){c.isSeeking=!1,j(c)}),a(document).off("mousemove."+e).on("mousemove."+e,function(a){if(a.stopPropagation(),a.preventDefault(),!c.isSeeking)return!1;var b=(a.pageX-d.offset().left)/d.width()*100;o(c,b)}),o(c,f)})},pause:function(){c.onPause.call(c)},stop:function(){c.onStop.call(c)},ended:function(){c.switchTrack.call(c)},play:function(){c.onPlay.call(c)},progress:function(a){l(c,a.jPlayer.status),n(c,a.jPlayer.status.currentTime)},timeupdate:function(a){l(c,a.jPlayer.status),n(c,a.jPlayer.status.currentTime),m(c,a.jPlayer.status.currentPercentAbsolute.toFixed(2)),k(c),c.waitForLoad&&(c.waitForLoad=!1,c.seekTime=0,c.play(),k(c))}}),this.$jPlayer.data("jPlayer").status.noVolume&&(c.$container.addClass("volumeless"),c.$container.find(".player56s-volume").remove(),this.setVolume(1,1)),this},q.prototype.insertDOM=function(){return this.$link.after(this.$container),this.$link.data("player56s",this),this.$link.detach(),p(this),this},q.prototype.bindEvents=function(){var c=this,d=c.$container.attr("id");return a(document).on("player56s-pause."+d,function(a,b){c!==b&&c.pause()}),a(document).on("keydown."+d,function(a){32===a.keyCode&&c.isPlaying&&c.options.pauseOnSpace&&c.$jPlayer.jPlayer("pause")}),this},d();var r=function(){a(".player56s").player56s()};a(r)}(jQuery);