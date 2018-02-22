module.exports = (id) => {

    const reloadTable = function(){
        $$(id('routesTable')).clearAll();
        let sort = {name : 'routes'};
        if($$(id('sort_host')).getValue()!='') sort.host = $$(id('sort_host')).getValue();
        if($$(id('sort_method')).getValue()!='all') sort.met = $$(id('sort_method')).getValue();
        if($$(id('sort_uri')).getValue()!='') sort.uri = $$(id('sort_uri')).getValue();
        if($$(id('sort_name')).getValue()!='') sort.na = $$(id('sort_name')).getValue();
        if($$(id('sort_action')).getValue()!='') sort.action = $$(id('sort_action')).getValue();
        if($$(id('sort_middleware')).getValue()!='') sort.middleware = $$(id('sort_middleware')).getValue();
        $$(id('routesTable')).load(Route('remote.get', sort));
    };

    return {
        rows: [
            { view:"toolbar", id:id("filter"), align: "center", elements:[
                { view:"text", id:id('sort_host'), fillspace: true, placeholder:"Host", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"select", id:id('sort_method'), fillspace: true, options:[
                    { "id":'all', "value":"All methods" },
                    { "id":'POST', "value":"POST" },
                    { "id":'GET', "value":"GET" },
                    { "id":'PATCH', "value":"PATCH" },
                    { "id":'PUT', "value":"PUT" },
                    { "id":'DELETE', "value":"DELETE" }], on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('sort_uri'), fillspace: true, placeholder:"Uri", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('sort_name'), fillspace: true, placeholder:"Name", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('sort_action'), fillspace: true, placeholder:"Action", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('sort_middleware'), fillspace: true, placeholder:"Middleware", align:"center", on: {onChange: function(){reloadTable();}}},


                { view:"button", type: "iconButton", label:"Clear filter", icon:"close", click: function(){
                    $$(id('sort_method')).setValue('all'); $$(id('sort_host')).setValue('');
                    $$(id('sort_uri')).setValue(''); $$(id('sort_name')).setValue('');
                    $$(id('sort_action')).setValue(''); $$(id('sort_middleware')).setValue('');
                    reloadTable();
                }},
                { view:"button", type: "iconButton", label:"Reload table", icon:"repeat", click: function(){ reloadTable(); }},
            ]
            },
            { view:"datatable", select: true, id: id('routesTable'),
                columns:[
                    { id:"host", header:"Host"},
                    { id:"method", header:"Method"},
                    { id:"uri", header:"Uri", fillspace: true},
                    { id:"name", header:"Name", fillspace: true},
                    { id:"action", header:"Action", fillspace: true},
                    { id:"middleware", header:"Middleware", fillspace: true}
                ],
                type:{template:"{common.space()}"},
                url: Route('remote.get', {name : 'routes'}),
                on: {
                    onItemDblClick: function(i){
                        let data = this.getItem(i.row);
                        if(!data[i.column]) return;
                        if(i.column!='method')
                            webix.confirm({
                                title: i.column,
                                width: data[i.column].length*8,
                                text:data[i.column],
                                ok:"Search",
                                cancel:"Cancel",
                                callback:function(result){
                                    if(result) $$(id('sort_'+i.column)).setValue(data[i.column].replace(/<\/?[^>]+>/gi, ''));
                                }
                            });
                        else
                            webix.alert({
                                title:i.column,
                                ok:"OK",
                                width: data[i.column].length*8,
                                text:data[i.column],
                            });
                    }
                }
            }
        ]
    };
};