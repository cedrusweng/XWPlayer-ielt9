/**
 * Created by CBS on 17-5-16.
 */
;(function(){
    var isSupportFlash=(function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsIphone = sUserAgent.match(/iphone/i) == "iphone";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        return !(bIsIpad || bIsIphoneOs || bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)
    })();
    var getNextId=(function(){
        var uid=0;
        return function(){
            return ++uid;
        }
    })();
    var pre=XWPlayer.pre||'xplayer__';

    var def={
        plugins:['progress','playpause','fullscreen','volume','current','duration','source']
    };
    function XPlayer(container,options){
        this.id=pre+getNextId();
        this.container=$(container);
        this.options= $.extend({},def,options);
        this.width=this.options.width||this.container.width();
        this.height=this.options.height||this.container.height();
        this.createUI();
        this.createMedia();
        this.plugins=this.options.plugins||[];
        this.initPlugins();
    }
    XPlayer.prototype={
        createUI:function(){
            this.container.append('<div id="'+this.id+'" class="'+pre+'container">' +
                    '<div class="'+pre+'inner">' +
                    '<div class="'+pre+'media"></div>' +
                    '<div class="'+pre+'layers"></div>' +
                    '<div class="'+pre+'controls"></div>' +
                    '</div>' +
                    '</div>');
            this.container=this.container.find('.'+pre+'container');
            this.uiMedia=this.container.find('.'+pre+'media');
            this.uiControls=this.container.find('.'+pre+'controls');
            this.uiLayers=this.container.find('.'+pre+'layers');
        },
        createMedia:function(){
            var mediaContainer=this.uiMedia;
            var rendererName,opts={
                proxy:this,
                renderTo:mediaContainer
            };
            if(isSupportFlash){
                rendererName='flash';
                opts.swfUrl='../asserts/flash_player.swf';
                opts.allowScriptAccess='sameDomain';
            }else{
                rendererName='html5';
            }
            opts.width=this.width;
            opts.height=this.height;
            opts.prefix=rendererName;
            var Media=rendererManager.select(rendererName);
            opts=$.extend({},this.options,opts);
            this.media=new Media(opts);
        },
        initPlugins:function(){
            var method='create';
            for(var i= 0,len=this.plugins.length;i<len;i++){
                var plugin=XWPlayer.plugins.get(this.plugins[i]);
                if(plugin && typeof plugin[method]=='function'){
                    plugin[method].call(this,this,this.uiControls,this.media);
                }
            }
        }
    };

    window.XPlayer=XPlayer;
})();