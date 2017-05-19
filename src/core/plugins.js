/**
 * Created by CBS on 17-5-16.
 */
(function(){
    window.XWPlayer=window.XWPlayer||{};
    var pluginCache={};
    XWPlayer.plugins={
        add:function(name,definition){
            pluginCache[name]=definition;
        },
        get:function(name){
            return pluginCache[name]||null;
        }
    }
})();