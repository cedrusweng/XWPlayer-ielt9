/**
 * Created by CBS on 17-5-18.
 */
/**
 * Created by CBS on 17-5-16.
 */
;(function(){
    var pluginName='source';
    var pre=XWPlayer.pre;
    var plugin={
        create:function(player,controls,media){
            console.log('plugin.source');
            var source= player.options.source;
            if(!source){
                return;
            }
            var sourceBtn=$('<div class="'+pre+'_button '+pre+pluginName+'-source-btn"></div>');
            sourceBtn.html('<div class="'+pre+pluginName+'-source-selector '+pre+'offscreen"><ul></ul></div>');
            var souceBox=sourceBtn.find('.'+pre+pluginName+'-source-selector');
            var slist=sourceBtn.find('ul');
            controls.append(sourceBtn);

            for(var i= 0,len=source.length;i<len;i++){
                var item=source[i];
                slist.append('<li data-src="'+item.src+'"><span class="'+pre+pluginName+'-sl-name">'+item.title+'</span></li>');
            }
            var hoverTimeout;
            sourceBtn.on('mouseenter',function(){
                clearTimeout(hoverTimeout);
                souceBox.show();
            });
            sourceBtn.on('mouseleave',function(){
                hoverTimeout=setTimeout(function(){
                    //souceBox.hide();
                },0)
            });
            var curSrc=media.getSrc();
            slist.on('click','li',function(){
                var src=$(this).data('src');
                if(src==curSrc)return;
                curSrc=src;
                var curTime=media.getCurrentTime();
                var paused=media.getPaused();
               // media.pause();
                media.setSrc(src);
                media.load();

                $(player).on('canplay',function(){

                    if(!paused){
                        media.setCurrentTime(curTime);

                        console.log('canplay.source',curTime);
                    }
                    $(player).off('canplay.source');
                });
            });
        }
    };

    XWPlayer.plugins.add(pluginName,plugin);
})();