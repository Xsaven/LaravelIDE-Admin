module.exports = () => {
    var menu = webix.ui({
        container: 'menuContainer',
        rows:[
            { type:"clean", cols:[
                {
                    view:"menu",
                    id: "menuContainer",
                    on: {
                        onAfterLoad: function(){
                            if(this.getFirstId()=='load'){
                                this.load(Route('remote.get', {name: 'menu', fromTop:true}), function(){
                                    this.remove('load');
                                });
                            }
                            const menuInit = (obj, data) => {
                                if(data.uri!==null && data.uri!='#'){
                                    obj.on('click', function() {
                                        runers[data.id]();
                                        return false;
                                    });

                                    if(data.type!='modal'){
                                        myLayout.createDragSource( obj, newItem[data.id] );
                                    }
                                }
                            }

                            var timerFindMenu = setInterval(function(){
                                $('a[role="menuitem"]').each(function() {
                                    if($(this).attr('menu-init')==undefined){
                                        let menuId = $(this).attr('webix_l_id');
                                        let menuConfig = window.getMenu(menuId);
                                        if(menuConfig!=null){
                                            $(this).attr('menu-init', 'true');
                                            menuInit($(this), menuConfig);
                                        }
                                    }
                                });
                            },100);
                        }
                    },
                    type:{
                        subsign:true
                    },
                    //data: window.menuItems
                    data: (typeof window.menuFromTop === 'object' ? window.menuFromTop : {id: 'load', value: 'Loading...'})
                }
            ] }
        ]
    });

    return menu;
};