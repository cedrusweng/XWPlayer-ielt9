/**
 * Created by CBS on 17-5-18.
 */
/**
 * Created by CBS on 17-5-16.
 */
;(function(){
    function formatTime(time){
        var min,sec;
        min=Math.floor(time/60);
        sec=Math.floor(time%60);
        min=min<10?'0'+min:min;
        sec=('0'+sec).slice(-2);
        return min+':'+sec;
    }
    function updateCurrent(media,dom){
        var currentTime=media.getCurrentTime();
        if(isNaN(currentTime)){
            currentTime=0;
        }
        dom.text(formatTime(currentTime));
    }
;(function(){
    var pluginName='current';
    var pre=XWPlayer.pre;
    var plugin={
        create:function(player,controls,media){
            console.log('plugin.current');
            var time=$('<div class="'+pre+'_button '+pluginName+'_wrap '+pre+'time"><span class="'+pre+'time-current"></span></div>');
            controls.append(time);
            $(player).on('timeupdate',function(){
                updateCurrent(media,time.find('span'));
            })
        }
    };

        XWPlayer.plugins.add(pluginName,plugin);
})();

;(function(){
    var pluginName='duration';
    var pre=XWPlayer.pre;
    var plugin={
        create:function(player,controls,media){
            console.log('plugin.duration');
            var t=this;
            var dur=$('<div class="'+pre+'button '+pluginName+'wrap '+pre+'time"><span class="'+pre+'time-duration"></span></div>');
            controls.append(dur);
            $(player).on('timeupdate',function(){
                var duration=media.getDuration();
                if(isNaN(duration) || duration === Infinity || duration <0){
                    media.setDuration(0);
                    t.options.duration = 0;
                    duration=0;
                }
                if(t.options.duration > 0){
                    duration= t.options.duration;
                }
                dur.find('span').text(formatTime(duration));
            });
        }
    };

        XWPlayer.plugins.add(pluginName,plugin);
})();
})();