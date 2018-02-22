module.exports = function(id){

    const reloadTable = function(){
        $$(id('roleTable')).clearAll();
        let sort = {name : 'role'};
        if($$(id('sort_name')).getValue()!='') sort.na = $$(id('sort_name')).getValue();
        if($$(id('sort_slug')).getValue()!='') sort.slug = $$(id('sort_slug')).getValue();
        if($$(id('sort_created_at')).getText()!='') sort.created_at = $$(id('sort_created_at')).getText();
        if($$(id('sort_updated_at')).getText()!='') sort.updated_at = $$(id('sort_updated_at')).getText();
        $$(id('roleTable')).load(Route('remote.get', sort));
    };
    const modalForm = function(data=null){
        webix.ui({view:"window", id:"roleModalForm", head: data ? `Edit ${data.name}` : 'New role', position:"center", resize:true, move: true, modal: true, width: $('#layoutContainer').width()/1.5, height: $('#layoutContainer').height()/1,
            body:{
                rows : [
                    { view:"form", id:"roleForm", elements:[
                        { view:"text", name:"name", placeholder:"Name", label:"Name", align:"center"},
                        { view:"text", name:"slug", placeholder:"Slug", label:"Slug", align:"center"},
                        { view:"forminput", name:"permissions", labelWidth:0, body: {
                            view:"dbllist",
                            labelBottomLeft:"Premission",
                            labelBottomRight:"Selected",
                            url: Route('remote.get', {name: 'premission', list:true}),
                        }},
                    ], rules:{
                        "name":webix.rules.isNotEmpty,
                        "slug":webix.rules.isNotEmpty,
                    }},
                    { view:"toolbar", id:"mybar", align: "center", elements:[
                        { view:"button", value:data ? 'Update' : 'Create', click: function(){
                            if (!$$('roleForm').validate()) return webix.message({ type:"error", text:"Form data is invalid" });
                            webix.ajax().post(Remote('role', data ? 'update' : 'insert'), $$('roleForm').getValues(), function(){
                                $$('roleModalForm').close();
                                reloadTable();
                            });
                        } },
                        { view:"button", value:"Close", click:`$$('roleModalForm').close();` }]
                    }
                ]
            }
        }).show();
        if(data) $$('roleForm').setValues(data);
    };

    return {
        rows: [
            { view:"toolbar", id:id('controlBar'), align: "center", elements:[
                {view:"button", type: "iconButton", label:"New role", icon:"plus", click: function(){ modalForm() }},
                {view:"button", type: "iconButton", label:"Reload table", icon:"repeat", click: function(){ reloadTable(); }},
                {view:"button", type: "iconButton", label:"Select all", icon:"list", click: function(){ $$(id('roleTable')).selectAll(); }},
                {view:"button", type: "iconButton", label:"Unselect all", icon:"list", click: function(){ $$(id('roleTable')).unselectAll() }},
                {view:"button", type: "iconButton", label:"Remove selected", icon:"trash", click: function(){
                    let ids = $$(id('roleTable')).getSelectedId(true, true);
                    webix.confirm({
                        title: "Close",
                        text: `Delete ${ids.length} items?`,
                        type:"confirm-error",
                        callback:function(result){
                            webix.ajax().del(Remote('role','delete'), {ids:ids}, function(){
                                reloadTable();
                            });
                        }
                    });
                }},
            ]
            },
            { view:"toolbar", id:id('filter'), align: "center", elements:[
                { view:"text", id:id('sort_name'), fillspace: true, placeholder:"Name", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('sort_slug'), fillspace: true, placeholder:"Slug", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"datepicker", id: id('sort_created_at'), placeholder:"Created at", format:"%Y-%m-%d", editable:true, fillspace: true, on: {onChange: function(){reloadTable();}}},
                { view:"datepicker", id: id('sort_updated_at'), placeholder:"Updated at", format:"%Y-%m-%d", editable:true, fillspace: true, on: {onChange: function(){reloadTable();}}},
                { view:"button", type: "iconButton", label:"Clear", icon:"close", click: function(){
                    $$(id('sort_name')).setValue(''); $$(id('sort_slug')).setValue('');
                    $$(id('sort_created_at')).setValue(''); $$(id('sort_updated_at')).setValue('');
                    reloadTable();
                }},
            ]
            },
            //{"id":1,"name":"Administrator","slug":"administrator","created_at":"2018-01-05 16:38:16","updated_at":"2018-01-05 16:38:16"}
            { view:"datatable", select: true, multiselect: true, id: id('roleTable'),
                columns:[
                    { id:"id", header:"ID"},
                    { id:"name", header:"Name", fillspace: true},
                    { id:"slug", header:"Slug", fillspace: true},
                    { id:"created_at", header:"Created at", fillspace: true},
                    { id:"updated_at", header:"Updated at", fillspace: true},
                ],
                type:{template:"{common.space()}"},
                url: Route('remote.get', {name : 'role'}),
                on: {
                    onItemDblClick : function(i){
                        let data = this.getItem(i.row);
                        modalForm(data);
                    }
                }
            }
        ]
    };
};