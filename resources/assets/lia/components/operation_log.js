module.exports = function(id){

    const reloadTable = function(){
        $$(id('logTable')).clearAll();
        let sort = {name : 'log'};
        if($$(id('operation_log_sort_method')).getValue()!='all') sort.met = $$(id('operation_log_sort_method')).getValue();
        if($$(id('operation_log_sort_ip')).getValue()!='') sort.ip = $$(id('operation_log_sort_ip')).getValue();
        if($$(id('operation_log_sort_admin')).getValue()!='all') sort.user_id = $$(id('operation_log_sort_admin')).getValue();
        if($$(id('operation_log_sort_path')).getValue()!='') sort.path = $$(id('operation_log_sort_path')).getValue();
        if($$(id('operation_log_sort_data')).getValue()!='') sort.data = $$(id('operation_log_sort_data')).getValue();
        if($$(id('operation_log_sort_date')).getText()!='') sort.date = $$(id('operation_log_sort_date')).getText();
        $$(id('logTable')).load(Route('remote.get', sort));
    };
    const requestGenerator = function(){
        webix.ui({view:"window", id:id("request"), head: `Request generator`, position:"center", move: true, modal: true, width: 800, height: 600,
            body:{
                rows : [
                    {multi:true, view:"accordion", minWidth: 800,
                        cols:[
                            { header:"Form", body:
                                {view:"form", id:"request-form", elements:
                                    [
                                        { view:"text", name:"path", label:'Path', placeholder:"Path", align:"center"},
                                        { view:"select", name: "method", label:"Method", options:[
                                            { "id":'POST', "value":"POST" },
                                            { "id":'GET', "value":"GET" },
                                            { "id":'PATCH', "value":"PATCH" },
                                            { "id":'PUT', "value":"PUT" },
                                            { "id":'DELETE', "value":"DELETE" }
                                        ]
                                        },
                                        { view:"textarea", name:"input", label:'Data', placeholder:"Data", align:"center"}
                                    ]
                                }
                            },
                            { header:"Request result", body:{ view:"textarea", id:"right" }}
                        ]
                    },
                    { view:"toolbar", id:"mybar", align: "center", elements:[
                        { view:"button", value:"Send data", click: function(){
                            let data = $$('request-form').getValues();

                            var fnResult = function(result){
                                try{
                                    $$("right").setValue(JSON.stringify( JSON.parse(result) , null, "\t"));
                                }catch (e){
                                    $$("right").setValue("Result not JSON");
                                }
                                reloadTable();
                            };
                            if(data.input=='[]') data.input = fnResult;
                            else{
                                try{
                                    data.input = JSON.parse(data.input);
                                }catch (e){
                                    data.input = fnResult;
                                }
                            }

                            let result = eval(`webix.ajax().${data.method.toLowerCase()}(data.path, data.input, fnResult)`);
                            result.fail(function(a){
                                var path = a.responseURL.replace(window.location.origin+'/', '');
                                webix.confirm({
                                    title: "Error "+a.status,
                                    text: "Find in exception report?<br>"+path,
                                    ok:"Search",
                                    cancel:"Cancel",
                                    callback:function(result){
                                        if(result) runers['exception_reporter'](function(windowId){
                                            $$(windowId('exception_reporter_sort_path')).setValue(path);
                                            $$(id("request")).close();
                                        });
                                    }
                                });
                            });
                        } },
                        { view:"button", value:"Close", click:`$$('${id("request")}').close();` }]
                    }
                ]
            }
        }).show();
    };

    return {
        rows: [
            { view:"toolbar", id:id("controlBar"), align: "center", elements:[
                {view:"button", type: "iconButton", label:"New request", icon:"plus", click: function(){ requestGenerator() }},
                {view:"button", type: "iconButton", label:"Reload table", icon:"repeat", click: function(){ reloadTable(); }},
                {view:"button", type: "iconButton", label:"Select all", icon:"list", click: function(){ $$(id('logTable')).selectAll(); }},
                {view:"button", type: "iconButton", label:"Unselect all", icon:"list", click: function(){ $$(id('logTable')).unselectAll(); }},
                {view:"button", type: "iconButton", label:"Remove selected", icon:"trash", click: function(){
                    let ids = $$(id('logTable')).getSelectedId(true, true);
                    webix.confirm({
                        title: "Close",
                        text: `Delete ${ids.length} items?`,
                        type:"confirm-error",
                        callback:function(result){
                            webix.ajax().del(Remote('log','delete'), {ids:ids}, function(){
                                reloadTable();
                            });
                        }
                    });
                }},
            ]
            },
            { view:"toolbar", id:id("operation_log_filter"), align: "center", elements:[
                {view:"select", id:id('operation_log_sort_admin'), fillspace: true, options: Route('remote.get', {name:'log', selectListAdmin:true}), on: {onChange: function(){reloadTable();}}},
                {view:"select", id:id('operation_log_sort_method'), fillspace: true, options:[
                    { "id":'all', "value":"All methods" },
                    { "id":'POST', "value":"POST" },
                    { "id":'GET', "value":"GET" },
                    { "id":'PATCH', "value":"PATCH" },
                    { "id":'PUT', "value":"PUT" },
                    { "id":'DELETE', "value":"DELETE" }], on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('operation_log_sort_path'), fillspace: true, placeholder:"Path", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('operation_log_sort_data'), fillspace: true, placeholder:"Data", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('operation_log_sort_ip'), placeholder:"IP", fillspace: true, align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"datepicker", id: id('operation_log_sort_date'), placeholder:"Date", format:"%Y-%m-%d", editable:true, fillspace: true, on: {onChange: function(){reloadTable();}}},
                { view:"button", type: "iconButton", label:"Clear", icon:"close", click: function(){
                    $$(id('operation_log_sort_method')).setValue('all'); $$(id('operation_log_sort_ip')).setValue('');
                    $$(id('operation_log_sort_admin')).setValue('all'); $$(id('operation_log_sort_path')).setValue('');
                    $$(id('operation_log_sort_data')).setValue(''); $$(id('operation_log_sort_data')).setValue('');
                    reloadTable();
                }},
            ]
            },
            { view:"datatable", select: true, multiselect: true, id: id('logTable'),
                columns:[
                    { id:"id", header:"ID"},
                    { id:"user_id", header:"Admin ID"},
                    { id:"method", header:"Method"},
                    { id:"path", header:"Path", fillspace: true},
                    { id:"input", header:"Data", fillspace: true},
                    { id:"ip", header:"IP", fillspace: true},
                    { id:"created_at", header:"Date", fillspace: true}
                ],
                type:{template:"{common.space()}"},
                url: Route('remote.get', {name : 'log'}),
                on: {
                    onItemDblClick : function(i){
                        let data = this.getItem(i.row);
                        data.input = JSON.stringify( JSON.parse(data.input) , null, "\t");
                        requestGenerator();
                        data.method = data.method.replace(/<\/?[^>]+>/gi, '');
                        $$('request-form').setValues(data);
                    }
                }
            }
        ]
    };
};