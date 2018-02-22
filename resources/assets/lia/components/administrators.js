module.exports = function(id){

    const reloadTable = function(){
        $$(id('roleTable')).clearAll();
        let sort = {name : 'admin'};
        if($$(id('administrators_sort_username')).getValue()!='') sort.username = $$(id('administrators_sort_username')).getValue();
        if($$(id('administrators_sort_name')).getValue()!='') sort.na = $$(id('administrators_sort_name')).getValue();
        if($$(id('administrators_sort_created_at')).getText()!='') sort.created_at = $$(id('administrators_sort_created_at')).getText();
        if($$(id('administrators_sort_updated_at')).getText()!='') sort.updated_at = $$(id('administrators_sort_updated_at')).getText();
        $$(id('roleTable')).load(Route('remote.get', sort));
    };
    const modalForm = function(data=null){
        webix.ui({view:"window", id:"roleModalForm",
            head: (data ? `Edit ${data.name}` : 'New Admin') + "<img style='width: 50px;margin-right: 0;' id='topUserImg' class='minimazedModalMenu' />",
            position:"center", resize:true, move: true, modal: true, width: $('#layoutContainer').width()/1.5, height: $('#layoutContainer').height()/1,
            body:{
                rows : [
                    { view:"form", id:"roleForm", elements:[
                        { view:"text", name:"username", placeholder:"Username", label:"Username", align:"center"},
                        { view:"text", name:"name", placeholder:"Name", label:"Name", align:"center"},

                        { view:"text", type:"password", name:"password", placeholder:"Password", label:"Password", align:"center"},
                        { view:"text", type:"password", name:"re_password", placeholder:"Re password", label:"Re password", align:"center"},

                        { view:"forminput", name:"permissions", labelWidth:0, body: {
                            view:"dbllist",
                            labelBottomLeft:"Premission",
                            labelBottomRight:"Selected",
                            url: Route('remote.get', {name: 'premission', list:true}),
                        }},
                        { view:"forminput", name:"roles", labelWidth:0, body: {
                            view:"dbllist",
                            labelBottomLeft:"Roles",
                            labelBottomRight:"Selected",
                            url: Route('remote.get', {name: 'role', list:true}),
                        }},
                        {
                            view: "uploader", id:"uplBtn", value: 'Upload Avatar',
                            name:"files", accept:"image/png, image/gif, image/jpg",
                            upload: Route('remote.insert', {'name':'admin'}),
                            on: {
                                onUploadComplete : function(a){
                                    $('#topUserImg').attr('src', `/uploads/${a.sname}`);
                                    let data = $$('roleForm').getValues();
                                    data.avatar = a.sname;
                                    $$('roleForm').setValues(data);
                                    return false;
                                }
                            }
                        }
                    ], rules:{
                        "name":webix.rules.isNotEmpty,
                        "username":webix.rules.isNotEmpty,
                    }},
                    { view:"toolbar", id:"administrators_mybar", align: "center", elements:[
                        { view:"button", value:data ? 'Update' : 'Create', click: function(){
                            if (!$$('roleForm').validate()) return webix.message({ type:"error", text:"Form data is invalid" });
                            let sendData = $$('roleForm').getValues();
                            if(sendData.password!=sendData.re_password) return webix.message({ type:"error", text:"Passwords do not match!" });
                            webix.ajax().post(Remote('admin', data ? 'update' : 'insert'), sendData, function(){
                                $$('roleModalForm').close();
                                reloadTable();
                            });
                        } },
                        { view:"button", value:"Close", click:`$$('roleModalForm').close();` }]
                    }
                ]
            }
        }).show();
        if(data){
            $$('roleForm').setValues(data);
            $('#topUserImg').attr('src', data.avatar);
        }else{
            $('#topUserImg').attr('src', "");
        }
    };

    return {
        rows: [
            { view:"toolbar", id:id("administrators_controlBar"), align: "center", elements:[
                {view:"button", type: "iconButton", label:"New user", icon:"plus", click: function(){ modalForm() }},
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
                            webix.ajax().del(Remote('admin','delete'), {ids:ids}, function(){
                                reloadTable();
                            });
                        }
                    });
                }},
            ]
            },
            { view:"toolbar", id:id("administrators_filter"), align: "center", elements:[
                { view:"text", id:id('administrators_sort_username'), fillspace: true, placeholder:"Username", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('administrators_sort_name'), fillspace: true, placeholder:"Name", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"datepicker", id: id('administrators_sort_created_at'), placeholder:"Created at", format:"%Y-%m-%d", editable:true, fillspace: true, on: {onChange: function(){reloadTable();}}},
                { view:"datepicker", id: id('administrators_sort_updated_at'), placeholder:"Updated at", format:"%Y-%m-%d", editable:true, fillspace: true, on: {onChange: function(){reloadTable();}}},
                { view:"button", type: "iconButton", label:"Clear", icon:"close", click: function(){
                    $$(id('administrators_sort_name')).setValue(''); $$(id('administrators_sort_username')).setValue('');
                    $$(id('administrators_sort_created_at')).setValue(''); $$(id('administrators_sort_updated_at')).setValue('');
                    reloadTable();
                }},
            ]
            },

            { view:"datatable", select: true, multiselect: true, id: id('roleTable'), rowHeight: 80,
                columns:[
                    { id:"id", header:"ID"},
                    { id:"avatar", header:"Avatar", template:"<center><img src='#avatar#' width='50px' /></center>", width:80, height:80},
                    { id:"username", header:"Username", fillspace: true},
                    { id:"name", header:"Name", fillspace: true},
                    { id:"created_at", header:"Created at", fillspace: true},
                    { id:"updated_at", header:"Updated at", fillspace: true},
                ],
                type:{template:"{common.space()}"},
                url: Remote('admin'),
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