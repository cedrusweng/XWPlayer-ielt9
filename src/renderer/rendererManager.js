/**
 * Created by CBS on 17-5-16.
 */
;(function(){
    var renderCache={};
    var rendererManager={
        add:function(name,renderer){
            renderCache[name]=renderer;
        },
        select:function(name){
            return renderCache[name]||null;
        }
    };
    window.rendererManager=rendererManager;
})();