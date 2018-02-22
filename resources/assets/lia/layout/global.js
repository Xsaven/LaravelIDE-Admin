module.exports = function () {
    window.buildMenuFunctions = function(freshData=null){
        var savedMenu = freshData!=null ? freshData : JSON.parse(localStorage.getItem('savedMenu'));
        window.runers = [];
        window.newItem = [];
        if(savedMenu==null) return ;
        savedMenu.forEach(function(data){
            if(data.uri!==null && data.uri!='#'){
                var newItemConfig = {
                    title: `<i class="fa fa-${data.icon}"></i> ${data.title}`,
                    type: 'component',
                    componentName: 'page',
                    componentState: {
                        href: data.type=='link' ? `/${adminPrefix}/${data.uri}` : data.uri,
                        header: `<i class="fa fa-${data.icon}"></i> ${data.title}`,
                        type: data.type
                    }
                };

                newItem[data.id] = newItemConfig;

                if(data.type=='modal') {
                    var runer = require('./runerTypes/'+data.type)(data);
                }else{
                    var runer = require('./runerTypes/other')(data, newItemConfig);
                }
                runers[data.id] = runer;
                runers[data.uri] = runer;
                if(data.hotkey!=null){
                    webix.UIManager.addHotKey(data.hotkey, function() {
                        runers[data.id]();
                        return false;
                    });
                }
            }
        });
    };

    window.menuFromTop = function(){
        var menuFromTop = localStorage.getItem( 'menuFromTop' );
        if( menuFromTop !== null ) {
            window.menuFromTop = JSON.parse( menuFromTop );
        } else {
            webix.ajax().get(Route('remote.get', {name: 'menu'}), {fromTop:true}, function(data){
                window.menuFromTop = JSON.parse(data);
                localStorage.setItem( 'menuFromTop', JSON.stringify(window.menuFromTop) );
                updateMenuData();
                buildMenuFunctions();
            });
        }
    };

    window.reloadTopMenu = function(){
        $$('menuContainer').clearAll();
        $$('menuContainer').load(Route('remote.get', {name: 'menu', fromTop:true}));
        updateMenuData();
        webix.ajax().get(Route('remote.get', {name: 'menu'}), {fromTop:true}, function(data){
            window.menuFromTop = JSON.parse(data);
            localStorage.setItem( 'menuFromTop', JSON.stringify(window.menuFromTop) );
            buildMenuFunctions();
        });
    };
    menuFromTop();

    window.updateMenuData = function () {
        webix.ajax().get(Route('remote.get', {name: 'menu'}), {noTree:true}, function(data){
            window.menuItems = JSON.parse(data);
            localStorage.setItem( 'savedMenu', JSON.stringify(window.menuItems) );
            buildMenuFunctions(window.menuItems);
        });
    };
    buildMenuFunctions();

    window.getMenu = id => {
        var returned = null;
        $.each(window.menuItems, function(key,val) {
            if(val.id==id) returned = window.menuItems[key];
        });
        return returned;
    };

    var savedMenu = localStorage.getItem( 'savedMenu' );
    if( savedMenu !== null ) {
        window.menuItems = JSON.parse( savedMenu );
    } else {
        window.updateMenuData();
    }

};