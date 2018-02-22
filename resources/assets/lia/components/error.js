module.exports = function( container, state, error, uniqId=false ){
    console.error('--ErrorLog-->', error);
    var err = error.responseJSON;
    let widget = webix.ui({
        container: uniqId ? uniqId : container.getElement()[0],
        rows:[
            { view:"template", type:"header", template:`${err.file} Line: ${err.line}` },
            { view:"template", type:"header", template:`${err.message}` },
        ]
    });
    container.on('resize', function(){
        if( widget ) {
            widget.$setSize( container.width, container.height );
        }
    });
    webix.alert(`Error! Status: ${error.status} <br> ${error.statusText}`);
}