module.exports = function(container, state, uniqId){
    var widget = null;
    container.on('open', function(){
        const id = require('../layout/idIncrement')(state.href, uniqId);
        var defaultSettings = {
            container: container.getElement()[0],
        }
        try{
            var reqPage = require('../components/' + state.href + '.js')(id, state);
        }catch (e){
            webix.alert(`Error! Component "${state.href}" not found!`);
            var reqPage = require('../components/undefined.js')(state);
            console.error(e);
        }

        widget = webix.ui(Object.assign(defaultSettings, reqPage));
        if(typeof state.callback == 'function') state.callback(id);
        CStore(uniqId, {status: 'done'});
    });

    container.on('resize', function(){
        if( widget ) {
            widget.$setSize( container.width, container.height );
        }
    });
}