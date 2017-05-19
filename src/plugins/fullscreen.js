/**
 * Created by CBS on 17-5-17.
 */
;(function(){
    var pluginName='fullscreen';
    var ua=navigator.userAgent;
    var pre=XWPlayer.pre||'xplayer__';
    var dT=document.createElement('video');
    var fullScreenEventName='';
    var isHasNativeFullScreen=(function(){
        dT.webkitRequestFullScreen&&(fullScreenEventName='webkitfullscreenchange');
        dT.mozRequestFullScreen&&(fullScreenEventName='mozfullscreenchange');
        dT.msRequestFullScreen&&(fullScreenEventName='MSFullscreenChange');
        return dT.webkitRequestFullScreen||dT.mozRequestFullScreen||dT.msRequestFullScreen;
    })();
    var isFullScreen=function(){
        return isHasNativeFullScreen && (document.mozFullScreen||document.webkitIsFullScreen||document.msFullScreenElement);
    };
    function requestFullScreen(el){
        if(isHasNativeFullScreen){
            el.webkitRequestFullScreen&&el.webkitRequestFullScreen();
            el.mozRequestFullScreen&&el.mozRequestFullScreen();
            el.msRequestFullScreen&&el.msRequestFullScreen();
        }
    }
    function cancelFullScreen(){
        if(isHasNativeFullScreen){
            document.webkitCancelFullScreen&&document.webkitCancelFullScreen();
            document.mozCancelFullScreen&&document.mozCancelFullScreen();
            document.msExitFullScreen&&document.msExitFullScreen();
        }
    }
    var plugin={
        create:function(){
            console.log('fullscreen');
            var that=this;
            this.uiControls.append('<div class="'+pre+'_button '+pluginName+'_wrap"></div>');
            this.fullscreenBtn=this.uiControls.find('.'+pluginName+'_wrap');
            this.fullscreenBtn.on('click',function(){
                if(isFullScreen() || that.isFullScreen){
                    that.isFullScreen=false;
                    plugin.exitFullScreen.call(that);
                }else{
                    that.isFullScreen=true;
                    plugin.enterFullScreen.call(that);
                }

            });
            $(window).on('keydown',function(e){
                var key= e.which || e.keyCode || 0;
                if(key==27){
                    plugin.exitFullScreen.call(that);
                }
            });
            $(window).on(fullScreenEventName,function(){
                if(isFullScreen()){
                    console.log('controls');
                }else{
                    plugin.exitFullScreen.call(that);
                }
            })

        },
        enterFullScreen:function(){
            if(isHasNativeFullScreen){
                requestFullScreen($(this.container)[0]);
            }
            $('html').addClass(pre+'fullscreen');
            this.fullscreenBtn.addClass(pre+'fullscreen');
            this.container.addClass(pre+'container-fullscreen');
            if(!isHasNativeFullScreen){
                this.media.setSize($(window).width(),$(window).height())
            }
            var t=this;
            this.uiControls.hide();

            t.tout=null;
            $(this.media.node).on('mousemove.uic',function(e){
                t.uiControls.show();
                t.tout&&clearTimeout(t.tout);
                t.tout=setTimeout(function(){
                    t.uiControls.fadeOut();
                },2000)
            });
            $(t.uiControls).on('mouseenter.uic mousemove.uic',function(){
                t.tout&&clearTimeout(t.tout);
            });
        },
        exitFullScreen:function(){
            var t=this;
            if(isFullScreen()||this.isFullScreen){
                cancelFullScreen();
            }else{
                this.media.setSize(this.width,this.height);
            }
            $('html').removeClass(pre+'fullscreen');
            this.container.removeClass(pre+'container-fullscreen');
            t.tout&&clearTimeout(t.tout);
            $(this).trigger('exitedfullscreen');
            $(this.container).off('mousemove.uic');
            $(t.uiControls).off('mouseenter.uic')
        }
    };

    XWPlayer.plugins.add(pluginName,plugin);
})();