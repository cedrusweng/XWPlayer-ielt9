/**
 * Created by CBS on 17-5-16.
 */
;(function(){
    var pluginName='playpause';
    var pre=XWPlayer.pre;
    var plugin={
        create:function(){
            console.log('plugin.playpause');
            var that=this;
            this.uiControls.append('<div class="'+pre+'_button '+pluginName+'_wrap"></div>');
            this.playpauseBtn=this.uiControls.find('.'+pluginName+'_wrap');
            this.playpauseBtn.on('click',function(){
                if(that.paused){
                    that.media.play();
                }else{
                    that.media.pause();
                }
            });
           /* $(this).on('click',function(){
                if(that.paused){
                    that.media.play();
                }else{
                    that.media.pause();
                }
            });*/
            $(this).on('play',function(){
                that.paused=false;
                that.playpauseBtn.addClass(pluginName+'_play').removeClass(pluginName+'_pause');
            });
            $(this).on('pause',function(){
                that.paused=true;
                that.playpauseBtn.addClass(pluginName+'_pause').removeClass(pluginName+'_play');
            });
        }
    };

    XWPlayer.plugins.add(pluginName,plugin);
})();