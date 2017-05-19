/**
 * Created by CBS on 17-5-17.
 */
;(function(){
    var pluginName='volume';
    var pre=XWPlayer.pre||'xplayer__';

    var plugin={
        create:function(player,controls,media){
            console.log('volume');
            var t=this;

            var mute=$('<div class="'+pre+'_button '+pluginName+'_wrap"></div>');
            mute.html('' +
                    '<div class="'+pre+pluginName+'-slider" role="slider">' +
                    '<span class="'+pre+'offscreen"></span>' +
                    '<div class="'+pre+pluginName+'-total">' +
                    '<div class="'+pre+pluginName+'-current"></div>' +
                    '<div class="'+pre+pluginName+'-handle"></div>' +
                    '</div>' +
                    '</div> ');
            controls.append(mute);

            var slider=mute.find('.'+pre+pluginName+'-slider'),
                total=mute.find('.'+pre+pluginName+'-total'),
                current=mute.find('.'+pre+pluginName+'-current'),
                handle=mute.find('.'+pre+pluginName+'-handle');
            var mouseIsOver=false,mouseIsDown=false;
            mute.on('click',function(){
                media.setMuted(!media.getMuted());
                $(t).trigger('volumechange');
            });


            mute.on('mouseenter',function(e){
                if(e.target === mute[0]){
                    slider.show();
                    mouseIsOver=true;
                    e.preventDefault();
                    e.stopPropagation();
                }
            }).on('mouseleave',function(){
                mouseIsOver=false;
                if(!mouseIsDown){
                    slider.hide();
                }
            });
            mute.on('focusin',function(){
                slider.show();
                mouseIsOver=true;
            }).on('focusout',function(e){
                if(e.relatedTarget !== mute[0]){
                    slider.hide();
                }
            });

            slider.on('dragstart',function(){return false;});
            slider.on('mouseover',function(){mouseIsOver=true});
            slider.on('focusin',function(){
                slider.show();
                mouseIsOver=true;
            }).on('focusout',function(){
                mouseIsOver=false;
                if(!mouseIsDown){
                    slider.hide();
                }
            });
            var offset,vh;
            function volumeMove(e){
                offset=offset||total.offset();
                var volume=null;
                vh=vh||total.height(),
                    pos= e.pageY-offset.top;
                volume=(vh-pos)/vh;
                volume=Math.max(0,volume);
                volume=Math.min(volume,1);

                if(volume === 0){
                    media.setMuted(true);
                    mute.removeClass(pre+'mute').addClass(pre+'unmute');
                }else{
                    media.setMuted(false);
                    mute.removeClass(pre+'unmute').addClass(pre+'mute');
                }
                current.css({bottom:0,height:volume*100+'%'});
                handle.css({bottom:volume*100+'%','margin-bottom':-handle.height()/2});
                media.setVolume(volume);
                e.preventDefault();
                e.stopPropagation();
            }
            function isInSlider(e){
                return e.target===slider || $(e.target).parents('.'+pre+pluginName+'-slider').size()>0;
            }
            slider.on('mousedown',function(e){
                mouseIsDown=true;
                volumeMove(e);
                $(document).on('mousemove.vol',function(e){
                    if(mouseIsDown){
                        volumeMove(e);
                    }
                });
                $(document).on('mouseup.vol',function(){
                    mouseIsDown=false;
                    $(document).off('mousemove.vol mouseup.vol');
                    if(!mouseIsOver){
                        slider.hide();
                    }
                });
                e.preventDefault();
                e.stopPropagation();
                return false;
            }).on('click',function(e){
                e.preventDefault();
                e.stopPropagation();
            });

            $(this).on('volumechange',function(){
                if(!mouseIsDown){
                    var volume=media.getVolume();
                    if(media.getMuted()){
                        volume=0;
                        mute.removeClass(pre+'mute').addClass(pre+'unmute');
                    }else{
                        mute.removeClass(pre+'unmute').addClass(pre+'mute');
                    }
                    current.css({bottom:0,height:volume*100+'%'});
                    handle.css({bottom:volume*100+'%','margin-bottom':-handle.height()/2});
                }
            });

        }
    };

    XWPlayer.plugins.add(pluginName,plugin);
})();