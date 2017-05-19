/**
 * Created by CBS on 17-5-16.
 */
;(function(){
    var flashid=0;
    var isIE=navigator.userAgent.match(/msie/i);
    var flashApiStack=[];

    function FlashRenderer(options){
        this.options=options;
        this.proxy=options.proxy||this;
        this.file=options.file;
        this.id=this.proxy.id+'_'+options.prefix;
        this.api= null;
        this.create(options.renderTo);
    }
    FlashRenderer.prototype.create=function(renderTo){
        var flash={},html='',settings=[],flashVars=[];
        var autoplay=this.options.autoplay||false,
            uid=this.id,
            allowScriptAccess=this.options.allowScriptAccess||'sameDomain',
            src=this.file,
            width=this.options.width,
            height=this.options.height,
            swfUrl=this.options.swfUrl;


        flashVars=['uid='+uid,'autoplay='+autoplay,'allowScriptAccess='+allowScriptAccess,'src='+src];
        if(this.options.enablePseudoStreaming===true){
            flashVars.push('pseudostreamstart='+this.options.pseudoStreamingStartQueryParam);
            flashVars.push('pseudostreamtype='+this.options.pseudoStreamingType);
        }
        if(isIE){
            settings=[
                'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"',
                'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"',
                'id="__'+this.id+'"',
                'width="'+width+'"',
                'height="'+height+'"'
            ];
            html='<object '+settings.join(' ')+'>'+
            '<param name="movie" value="'+swfUrl+'?x='+(new Date).getTime()+'" />' +
            '<param name="flashVars" value="'+flashVars.join('&amp;')+'" />' +
            '<param name="quality" value="high" />' +
            '<param name="bgcolor" value="#000000" />' +
            '<param name="wmode" value="transparent" />' +
            '<param name="allowScriptAccess" value="'+allowScriptAccess+'" />' +
            '<param name="allowFullScreen" value="true" />' +
            '<div>下载安装flash插件</div>' +
            '</object>';
        }else{
            settings=[
                'id="__'+this.id+'"',
                'name="__'+this.id+'"',
                'play="true"',
                'loop="false"',
                'quality="high"',
                'bgcolor="#000000"',
                'wmode="transparent"',
                'allowScriptAccess="'+allowScriptAccess+'"',
                'allowFullScreen="true"',
                'type="application/x-shockwave-flash"',
                'pluginspage="//www.macromedia.com/go/getflashplayer"',
                'src="'+swfUrl+'"',
                'flashvars="'+flashVars.join('&')+'"',
                'width="'+width+'"',
                'height="'+height+'"'
            ];
            html='<embed '+settings.join(' ')+'>'
        }
        $(renderTo).append(html);
        this.node=$(renderTo).last();
        this.bindGlobalEvent();
        var t=this;
        if(autoplay){
            t.setSrc(src);
            $(this.proxy).on('canplay',function(){
                t.play();
            })
        }
    };
    FlashRenderer.prototype.bindGlobalEvent=function(){
        var that=this;
        window['__ready__'+this.id]=function(){
            that.flashReady=true;
            that.api=document.getElementById('__'+that.id);
            if(flashApiStack.length){
                $.each(flashApiStack,function(i,itm){
                    var capName=itm.propName.substring(0,1).toUpperCase()+itm.propName.substring(1);
                    if(itm.type==='set'){
                        that['set'+capName](itm.value);
                    }
                    if(itm.type==='call'){
                        that[itm.methodName]();
                    }
                })
            }
        };
        window['__event__'+this.id]=function(eventName,message){
            $(that.proxy).trigger(eventName,{message:message});
        }
    };
    FlashRenderer.prototype.hide=function(){
        this.node.hide();
    };
    FlashRenderer.prototype.show=function(){
        this.node.show();
    };

    FlashRenderer.prototype.setSize=function(w,h){
        $(this.api).css({
            width:w,
            height:h
        });
        if(this.api !== null && typeof this.api.fire_setSize==='function'){
            this.api.fire_setSize(w,h);
        }
    };
    FlashRenderer.prototype.destroy=function(){
        this.node.remove();
    };

    $.each(['load','play','pause','stop'],function(i,name){
        FlashRenderer.prototype[name]=function(){
            if(this.api !== null){
                if(this.api['fire_'+name]){
                    try{
                        this.api['fire_'+name]();
                    }catch(ex){

                    }
                }
            }
        }
    });
    $.each(['volume','src','currentTime','muted',
        'duration','paused','ended','buffered','error','networkState','readyState','seeking','seekable',
        'currentSrc','preload','bufferedBytes','bufferedTime','initialTime','startOffsetTime',
        'defaultPlaybackRate','playbackRate','played','autoplay','loop','controls'],function(i,name){
        var capName=name.substring(0,1).toUpperCase()+name.substring(1);
        FlashRenderer.prototype['get'+capName]=function(){
            if(this.api!==null){
                if(this.api['get_'+name] !== undefined){
                    var val=this.api['get_'+name]();
                    if(name==='buffered'){
                        return {
                            start:function(){
                                return 0;
                            },
                            end:function(){
                                return val;
                            },
                            length:1
                        }
                    }
                    return val;
                }
            }
            return null;
        };
        FlashRenderer.prototype['set'+capName]=function(val){
            if(this.api !==null && typeof this.api['set_'+name] !== 'undefined'){
                this.api['set_'+name](val);
            }else{
                flashApiStack.push({
                    type:'set',
                    propName:name,
                    value:val
                })
            }
        }

    });
    window.rendererManager&&rendererManager.add('flash',FlashRenderer);
    window.FlashRenderer=FlashRenderer;
})();