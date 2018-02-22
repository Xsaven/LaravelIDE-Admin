module.exports = function(data, newItemConfig){
    return function($callback=false){
        newItemConfig.componentState.callback = $callback;
        try {
            if( myLayout.selectedItem === null ) {
                try {
                    myLayout.root.contentItems[ 0 ].addChild( newItemConfig );
                } catch (e) {
                    myLayout.root.addChild( newItemConfig );
                }
            } else {
                myLayout.selectedItem.addChild( newItemConfig );
            }
        } catch(e) {
            console.error(e);
            webix.alert('Oops, something went wrong!');
        }
        return false;
    };
};