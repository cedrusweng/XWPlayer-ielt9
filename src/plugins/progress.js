/**
 * Created by CBS on 17-5-17.
 */
;(function(){
    var pluginName='progress';
    var pre=XWPlayer.pre||'xplayer__';
    function formatTime(time){
        var min,sec;
        min=Math.floor(time/60);
        sec=Math.floor(time%60);
        min=min<10?'0'+min:min;
        sec=('0'+sec).slice(-2);
        return min+':'+sec;
    }
    var plugin={
        create:function(){
            console.log('progress');
            var that=this;

            this.uiProgress=$('<div class="'+pre+'_button '+pre+pluginName+'"></div>');
            this.uiTotal=$('<span class="'+pre+pluginName+'-total" />');
            this.uiBuffer=$('<span class="'+pre+pluginName+'-buffer" />');
            this.uiLoaded=$('<span class="'+pre+pluginName+'-loaded" />');
            this.uiCurrent=$('<span class="'+pre+pluginName+'-current" />');
            this.uiHovered=$('<span class="'+pre+pluginName+'-hovered no-hover" />');
            this.uiHandle=$('<span class="'+pre+pluginName+'-handle" />');
            this.uiTip=$('<span class="'+pre+pluginName+'-float" />');
            this.uiTipCurrent=$('<span class="'+pre+pluginName+'-float-current">00:00</span>');
            this.uiControls.append(this.uiProgress);
            this.uiProgress.append(this.uiTotal);
            this.uiTotal.append(this.uiBuffer);
            this.uiTotal.append(this.uiLoaded);
            this.uiTotal.append(this.uiCurrent);
            this.uiTotal.append(this.uiHovered);
            this.uiTotal.append(this.uiHandle);
            this.uiTotal.append(this.uiTip);
            this.uiTip.append(this.uiTipCurrent);
            this.uiTip.hide();
            this.uiBuffer.hide();

            this.newTime=0;
            this.forcedHandlePause=false;

            var t=this;
            var mouseIsDown=false;
            function mouseMove(e){
                var
                    l=t.uiTotal.offset().left,
                    w= t.uiTotal.width(),
                    percentage= 0,
                    pos= 0,
                    x;
                x= e.pageX;
                if(t.media.getDuration()){
                     x=Math.max(l,Math.min(x,w+l));
                    pos=x-l;
                    percentage=pos/w;
                    t.newTime=percentage<=0.02?0:percentage* t.media.getDuration();
                    if(mouseIsDown){
                        t.setHandle(t.newTime);
                        t.updateCurrent(t.newTime);
                    }
                    t.uiTip.css({
                        left:pos
                    }).show();
                    t.uiTipCurrent.html(formatTime(t.newTime));
                }
            }
            function mouseUp(e){
                if(mouseIsDown && t.media.getCurrentTime() && t.newTime.toFixed(4) !== t.media.getCurrentTime().toFixed(4)){
                    t.media.setCurrentTime(t.newTime);
                    t.setProgress();
                    t.updateCurrent(t.newTime);
                }
                if(t.forcedHandlePause){
                    t.media.play();
                }
                t.forcedHandlePause=false;
            }
            var oAutoRewind= t.options.autoRewind;
            t.uiTotal.on('focus',function(){
                t.options.autoRewind=false;
            }).on('blur',function(){
                t.options.autoRewind=oAutoRewind;
            });
            t.uiTotal.on('dragstart',function(){return false;});
            function isInTotal(e){
                return ($(e.target).hasClass(pre+pluginName+'-total') || $(e.target).parents('.'+pre+pluginName+'-total').size()>0)
            }
            t.uiTotal.on('mousedown touchstart',function(e){
                t.forcedHandlePause=false;
                if(t.media.getDuration() !== Infinity){
                    if(!t.media.getPaused()){
                        t.media.pause();
                        t.forcedHandlePause=true;
                    }
                    mouseIsDown=true;
                    mouseMove(e);
                    t.container.on('mouseup touchend',function(e){
                        if(isInTotal(e)){
                            mouseMove(e);
                        }
                    });
                    $(document).on('mouseup.dur touchend.dur',function(e){
                        mouseUp(e);
                        mouseIsDown=false;
                        t.uiTip.hide();
                        $(document).off('mouseup.dur touchend.dur');
                    })
                }
            });
            t.uiTotal.on('mouseenter',function(e){
                if(isInTotal(e) && t.media.getDuration() !== Infinity){
                    t.container.on('mousemove',function(e){
                        if(isInTotal(e)){
                            mouseMove(e);
                        }
                    });
                    t.uiTip.show();
                }
            });
            t.uiTotal.on('mouseleave',function(){
                if(t.media.getDuration() !== Infinity){
                    if(!mouseIsDown){
                        $(document).off('mousemove.dur');
                        t.uiTip.hide();
                    }
                }
            });

            $(this).on('progress',function(e){
                if(t.media.getDuration() !== Infinity){
                    t.setProgress();
                    if(!t.forcedHandlePause){
                        t.setHandle();
                    }
                }
            });
            $(this).on('timeupdate',function(e){
                if(t.media.getDuration() !== Infinity){
                    t.setProgress();
                    if(!t.forcedHandlePause){
                        t.setHandle();
                    }
                    updateTotal();
                }
            });
            function updateTotal(){
                //
            }
            t.setProgress=function(){

                if(t.media){
                    var buffer= t.media.getBuffered(),percent=null;
                   if(buffer && buffer.length >0 && buffer.end() && t.media.getDuration()){
                        percent= buffer.end();
                    }
                    if(percent !== null){
                        t.uiLoaded.css({
                            width:percent+'%'
                        })
                    }
                }
            };
            t.setHandle=function(time){
                if(t.media.getCurrentTime() && t.media.getDuration()){
                    time=time|| t.media.getCurrentTime();
                    var w= t.uiTotal.width(),
                        p=time / t.media.getDuration(),
                        l=w*p - t.uiHandle.width()/2;
                    l=l<0?0:l;
                    t.uiCurrent.css({
                        width:p*100+'%'
                    });
                    t.uiHandle.css({
                        left:l
                    })
                }
            };
            t.updateCurrent=function(time){

            }

        }
    };

    XWPlayer.plugins.add(pluginName,plugin);
})();