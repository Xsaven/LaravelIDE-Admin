module.exports = (id) => {

    const reloadTable = function(){
        $$(id('exceptionsTable')).clearAll();
        let sort = {name : 'exception'};
        if($$(id('exception_reporter_sort_method')).getValue()!='all') sort.met = $$(id('exception_reporter_sort_method')).getValue();
        if($$(id('exception_reporter_sort_code')).getValue()!='') sort.code = $$(id('exception_reporter_sort_code')).getValue();
        if($$(id('exception_reporter_sort_type')).getValue()!='') sort.type = $$(id('exception_reporter_sort_type')).getValue();
        if($$(id('exception_reporter_sort_message')).getValue()!='') sort.message = $$(id('exception_reporter_sort_message')).getValue();
        if($$(id('exception_reporter_sort_path')).getValue()!='') sort.path = $$(id('exception_reporter_sort_path')).getValue();
        if($$(id('exception_reporter_sort_query')).getValue()!='') sort.que = $$(id('exception_reporter_sort_query')).getValue();
        if($$(id('exception_reporter_sort_created_at')).getText()!='') sort.created_at = $$(id('exception_reporter_sort_created_at')).getText();
        $$(id('exceptionsTable')).load(Route('remote.get', sort));
    };

    const modalForm = function(data=null){
        webix.ui({view:"window", id:"modalForm",
            head: "Exception detail",
            position:"center", resize:true, move: true, modal: true, width: $('#layoutContainer').width()/1.5, height: $('#layoutContainer').height()/1,
            body:{
                rows : [
                    {
                        view:"segmented", id:'tabbar', value: 'listRequest', multiview:true, options: [
                        { value: '<i class="fa fa-paper-plane"></i> Request',  id: 'listRequest'},
                        { value: '<i class="fa fa-server"></i> Headers',  id: 'listHeaders'},
                        { value: '<i class="fa fa-database"></i> Cookies',  id: 'listCookies', selected: true},
                        { value: '<i class="fa fa-file-code-o"></i> Exception Trace',  id: 'listTrace'},
                    ]
                    },
                    {   id:"mymultiview",
                        cells:[
                            { id: "listRequest", template: "request", scroll: "y"},
                            { id: "listHeaders", template: "headers", scroll: "y"},
                            { id: "listCookies", template: "cookies", scroll: "y"},
                            { id: "listTrace", rows: [
                                { id: "traceInfo", template: "trace", height:130, scroll: "y"},
                                { view: "resizer" },
                                { view: "list", select: true, data:data.trace, on: {onItemDblClick: function(info){webix.alert({title:'Trace info',ok:"Close",width: info.length*5,text:info,});}}},
                            ]},
                        ]
                    },

                    { view:"toolbar", id:"mybar", align: "center", elements:[
                        { view:"button", value:"Close", click:`$$('modalForm').close();`, hotkey: 'esc' }]
                    }
                ]
            }
        }).show();

        let cookies = JSON.parse(data.cookies);
        let cook = '<table class="table table-condensed"><tr><th>Name</th><th>Value</th></tr>';
        $.each(cookies, function(key,val){
            cook += `<tr><td><strong>${key}: </strong></td><td>${val}</td></tr>`;
        });
        cook += "</table>";
        $$("listCookies").setHTML(cook);

        let headers = JSON.parse(data.headers);
        let head = '<table class="table table-condensed"><tr><th>Name</th><th>Value</th></tr>';
        $.each(headers, function(key,val){
            head += `<tr><td><strong>${key}: </strong></td><td>${val[0]}</td></tr>`;
        });
        head += "</table>";
        $$("listHeaders").setHTML(head);

        let request = '<table class="table table-condensed"><tr><th>Name</th><th>Value</th></tr>';
        request += `<tr><td><strong>Method: </strong></td><td>${data.method}</td></tr>`;
        request += `<tr><td><strong>Url: </strong></td><td><a href="#" id="findPath">${data.path} <i class="fa fa-search-plus"></i></a></td></tr>`;
        var qq = JSON.parse(data.query);
        if(data.query.length>2){
            var query = '<table class="table table-condensed"><tr><th>Name</th><th>Value</th></tr>';
            $.each(qq, function(key,val){
                query += `<tr><td><strong>${key}: </strong></td><td>${val}</td></tr>`;
            });
            query += "</table>";
        }else {
            var query = '<em>Empty</em>';
        }

        request += `<tr><td><strong>Query: </strong></td><td>${query}</td></tr>`;
        request += `<tr><td><strong>Time: </strong></td><td>${data.created_at}</td></tr>`;
        request += `<tr><td><strong>IP: </strong></td><td><a href="#" id="findIp">${data.ip} <i class="fa fa-search-plus"></i></a></td></tr>`;
        request += "</table>";
        $$("listRequest").setHTML(request);

        let trace = '<table class="table table-condensed">';
        trace += `<tr><td><strong>Code: </strong></td><td>${data.code}</td></tr>`;
        trace += `<tr><td><strong>Exception: </strong></td><td>${data.type}</td></tr>`;
        trace += `<tr><td><strong>Message: </strong></td><td>${data.message}</td></tr>`;
        trace += "</table>";
        $$("traceInfo").setHTML(trace);

        $('#findPath').on('click', function(){
            runers['operation_log'](function(windowId){
                $$(windowId('operation_log_sort_path')).setValue(data.path);
            });
            $$('modalForm').close();
            return false;
        });

        $('#findIp').on('click', function(){
            runers['operation_log'](function(windowId){
                $$(windowId('operation_log_sort_ip')).setValue(JSON.parse(data.ip)[0]);
            });
            $$('modalForm').close();
            return false;
        });
    };

    return {
        rows: [
            { view:"toolbar", id:id('filter'), align: "center", elements:[
                { view:"select", id:id('exception_reporter_sort_method'), fillspace: true, options:[
                    { "id":'all', "value":"All methods" },
                    { "id":'POST', "value":"POST" },
                    { "id":'GET', "value":"GET" },
                    { "id":'PATCH', "value":"PATCH" },
                    { "id":'PUT', "value":"PUT" },
                    { "id":'DELETE', "value":"DELETE" }], on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('exception_reporter_sort_code'), fillspace: true, placeholder:"Code", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"button", type: "iconButton", label:"Clear filter", icon:"close", click: function(){
                    $$(id('exception_reporter_sort_method')).setValue('all'); $$(id('exception_reporter_sort_code')).setValue('');
                    $$(id('exception_reporter_sort_type')).setValue(''); $$(id('exception_reporter_sort_message')).setValue('');
                    $$(id('exception_reporter_sort_path')).setValue(''); $$(id('exception_reporter_sort_query')).setValue(''); $$(id('exception_reporter_sort_created_at')).setValue('');
                    reloadTable();
                }},
                { view:"button", type: "iconButton", label:"Reload table", icon:"repeat", click: function(){ reloadTable(); }},
                { view:"button", type: "iconButton", label:"Remove selected", icon:"trash", click: function(){
                    let ids = $$(id('exceptionsTable')).getSelectedId(true, true);
                    webix.confirm({
                        title: "Close",
                        text: `Delete ${ids.length} items?`,
                        type:"confirm-error",
                        callback:function(result){
                            webix.ajax().del(Remote('exception','delete'), {ids:ids}, function(){
                                reloadTable();
                            });
                        }
                    });
                }},
            ]},
            { view:"toolbar", id:id('filter2'), align: "center", elements:[
                { view:"text", id:id('exception_reporter_sort_type'), fillspace: true, placeholder:"Type", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('exception_reporter_sort_message'), fillspace: true, placeholder:"Message", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('exception_reporter_sort_path'), fillspace: true, placeholder:"Path", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"text", id:id('exception_reporter_sort_query'), fillspace: true, placeholder:"Data", align:"center", on: {onChange: function(){reloadTable();}}},
                { view:"datepicker", id: id('exception_reporter_sort_created_at'), placeholder:"Updated at", format:"%Y-%m-%d", editable:true, fillspace: true, on: {onChange: function(){reloadTable();}}},
            ]},

            { view:"datatable", select: true, id: id('exceptionsTable'), multiselect: true,
                columns:[
                    { id:"id", header:"ID"},
                    { id:"method", header:"Method"},
                    { id:"code", header:"Code"},
                    { id:"type", header:"Type", fillspace: true},
                    { id:"message", header:"Message", fillspace: true},
                    { id:"path", header:"Path", fillspace: true},
                    { id:"query", header:"Data", fillspace: true},
                    { id:"created_at", header:"Created at", fillspace: true},
                    { id:"select", header:"", width: 50, template: `<i class="fa fa-search-minus" style="cursor: pointer"></i>`},
                ],
                type:{template:"{common.space()}"},
                url: Remote('exception'),
                on: {
                    onItemClick: function(i){
                        let data = this.getItem(i.row);
                        if(i.column=='select') {
                            modalForm(data);
                            return;
                        }
                    },
                    onItemDblClick: function(i){
                        let data = this.getItem(i.row);
                        if(i.column=='select') {
                            modalForm(data);
                            return;
                        }
                        if(!data[i.column]) return;
                        if(i.column!='method')
                            webix.confirm({
                                title: i.column,
                                width: data[i.column].length*8,
                                text:data[i.column],
                                ok:"Search",
                                cancel:"Cancel",
                                callback:function(result){
                                    if(result) $$(id('exception_reporter_sort_'+i.column)).setValue(data[i.column].replace(/<\/?[^>]+>/gi, ''));
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