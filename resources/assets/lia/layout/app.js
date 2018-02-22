'use strict';

const config = require('./config.js');
const GoldenLayout = require('golden-layout');
const NProgress = require('nprogress');
require('./global')();

window.myLayout = new GoldenLayout( config , '#layoutContainer');

myLayout.registerComponent( 'page', function( container, state ){
    NProgress.start();
    let uniqId = (new Date().getTime()).toString(16);
    CStore(uniqId, {status: 'loading'});
    container.getElement().attr('id', uniqId);
    container.getElement().attr('data-state-href', state.href);
    try{
        require('../pageTypes/' + state.type + '.js')(container, state, uniqId, myLayout);
    }catch (e){
        require('../pageTypes/webix.js')(container, state, uniqId, myLayout);
    }

    NProgress.done();
    return false;
});

myLayout.on( 'stackCreated', function( stack ){
    stack.header.controlsContainer.prepend( `<a class='container-cog'><i class='fa fa-cog'></i></a>` );
});

myLayout.on( 'stateChanged', function(){
    var state = JSON.stringify( myLayout.toConfig() );
    localStorage.setItem( 'savedState', state );
});

$(function(){
    require('./menu')(myLayout);
    /*$('[view_id="menuContainer"] a').each(function(){
        let menuId = $(this).attr('webix_l_id');
        let menuConfig = window.getMenu(menuId);
        console.log(menuConfig);
        if($(this).attr('href')!='#'){
            var newItemConfig = {
                title: $(this).html(),
                type: 'component',
                componentName: 'page',
                componentState: {
                    href: $(this).attr('href'),
                    header: $(this).html(),
                    type: $(this).attr('type')
                }
            };
            myLayout.createDragSource( $(this), newItemConfig );
            $(this).on('click', function(){
                try {
                    if( myLayout.selectedItem === null ) {
                        myLayout.root.contentItems[ 0 ].addChild( newItemConfig );
                    } else {
                        myLayout.selectedItem.addChild( newItemConfig );
                    }
                } catch(e) {
                    webix.alert('No container is found, only the Drag and Drop method is possible.');
                }
                return false;
            });
        }else{
            $(this).on('click', function(){
                return false;
            });
        }
    });*/
});

window.addEventListener('resize', function(){
    myLayout.updateSize();
    if($('.CodeMirror-fullscreen').length>0){
        $('.CodeMirror-fullscreen').height($('#layoutContainer').height()+34);
    }
});

myLayout.init();
module.exports = myLayout;