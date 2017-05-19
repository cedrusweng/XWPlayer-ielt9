/**
 * Created by CBS on 17-5-16.
 */
;(function(){
    var htmlid=0;
    function Html5Renderer(options){
        this.name='html5';
        this.options=options;
        this.proxy=options.proxy||this;
        this.file=options.file;
        this.id='video_'+options.prefix+''+(++htmlid);
        this.api= null;

        this.create(options.renderTo);
        this.bindEvents();
    }

    Html5Renderer.prototype.create=function(renderTo){
        var attrs=[];
        var autoplay=this.options.autoplay||false,
                src=this.file,
                width=this.options.width,
                height=this.options.height;
        attrs=['width="'+width+'px"','height="'+height+'"px'];
        $(renderTo).append('<video '+attrs.join(' ')+'></video>');
        this.node=$(renderTo).children().last();
        this.api=this.node[0];
        var t=this;
        if(autoplay){
            this.setSrc(src);
            this.proxy.on('canplay',function(){
                t.play();
            });
        }
    };
    Html5Renderer.prototype.bindEvents=function(){
        var that=this;
        $.each([
            'loadstart','progress','suspend','abort','error','emptied','stalled','play','pause','loadedmetadata',
            'loadeddata','waiting','playing','canplay','canplaythrough','seeking','seeked','timeupdate','ended',
            'ratechange','durationchange','volumechange'
        ],function(i,eventName){
            that.api.addEventListener(eventName,function(e){
                that.proxy.trigger(e.type);
            });
        });
    };
    Html5Renderer.prototype.hide=function(){
        this.node.hide();
    };
    Html5Renderer.prototype.show=function(){
        this.node.show();
    };

    Html5Renderer.prototype.setSize=function(w,h){
        this.node.css({
            width:w,
            height:h
        });
    };
    Html5Renderer.prototype.destroy=function(){
        this.node.remove();
    };

    $.each(['load','play','pause','stop'],function(i,name){
        Html5Renderer.prototype[name]=function(){
            var args=[].slice.call(arguments,0);
            if(this.api[name] && typeof this.api[name] == 'function'){
                try{
                    this.api[name].apply(this.api,args);
                }catch(e){

                }
            }
        }
    });
    $.each(['volume','src','currentTime','muted',
        'duration','paused','ended','buffered','error','networkState','readyState','seeking','seekable',
        'currentSrc','preload','bufferedBytes','bufferedTime','initialTime','startOffsetTime',
        'defaultPlaybackRate','playbackRate','played','autoplay','loop','controls'],function(i,name){
        var capName=name.substring(0,1).toUpperCase()+name.substring(1);

        Html5Renderer.prototype['get'+capName]=function(){
            return this.api[name];
        };
        Html5Renderer.prototype['set'+capName]=function(val){
            if(name==='src'){
                this.node.attr('src',val);
                return;
            }
            this.api[name]=(val);
        };

    });

    window.rendererManager&&rendererManager.add('html5',Html5Renderer);
})();