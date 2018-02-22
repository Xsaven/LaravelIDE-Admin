require('../webix/kanban');
require('../webix/kanban.css');

module.exports = function(id,state){

    const editForm = function(clickEvent, idItem){
        let item = $$(id('taskList')).getItem(idItem);
        var window = webix.ui({
            id: "taskModal_"+idItem,
            view:"window",
            position:"center",
            move: true,
            modal: true,
            head:"Edit Task",
            body:{
                rows: [
                    { cols:[
                        {view:"form", id:"editTaskForm_"+idItem, width: 500, elements:
                            [
                                { view:"select", name: "status", label:"Status", value:1, options:[
                                    { "id":'new', "value":"new" },
                                    { "id":'work', "value":"work" },
                                    { "id":'test', "value":"test" },
                                    { "id":'done', "value":"done" }
                                ]
                                },
                                { view:"textarea", name:"text", placeholder:"Text", align:"center"},
                                { view:"text", name:"tags", placeholder:"Tags", align:"center"},
                                { view:"colorpicker", label:"Color", name:"color", value:"#00FF00"}
                            ],
                            rules:{
                                "text":webix.rules.isNotEmpty
                            }
                        }
                    ]
                    },
                    { view:"toolbar", id:"mybar", align: "center", elements:[
                        { view:"button", value:"OK", width:70, click: function(){
                            if (!$$(`editTaskForm_${idItem}`).validate())
                                webix.message({ type:"error", text:"Form data is invalid" });
                            else{
                                let editTaskValues = Object.assign({ _token:LA.token}, $$(`editTaskForm_${idItem}`).getValues());
                                webix.ajax().post(Route('tasks.store'),editTaskValues, function(result){
                                    $$(id('taskList')).updateItem(idItem, JSON.parse(result));
                                    $$(`taskModal_${idItem}`).close();
                                });
                            }
                        }, hotkey: "enter" },
                        { view:"button", value:"Close", width:70, click:`$$('taskModal_${idItem}').close();` }]
                    }
                ]
            }
        }).show();

        $$(`editTaskForm_${idItem}`).setValues(item);
    };

    webix.type(webix.ui.kanbanlist,{
        name: "task",
        icons:[
            {icon: "comment", template:function(obj){
                if(obj.comments==null) return 0;
                if(typeof obj.comments == 'string') {
                    obj.comments = JSON.parse(obj.comments);
                }
                return obj.comments.length;
            }, click: (clickEvent, idItem)=>{
                let item = $$(id('taskList')).getItem(idItem);
                if(!item.comments) item.comments = [];
                var window = webix.ui({
                    id: "commentModal_"+idItem,
                    view:"window",
                    position:"center",
                    modal: true,
                    head:"Comments",
                    body:{
                        rows: [
                            {
                                cols:[
                                    { view:"list", template:"<div>#text#</div>",
                                        on: {
                                            onItemDblClick: function(idItem){
                                                let item = this.getItem(idItem);
                                                webix.alert(item.text);
                                            }
                                        },
                                        id: "commentList",
                                        select:true,
                                        width: 500,
                                        height: 200,
                                        data: item.comments
                                    }
                                ]
                            },
                            {view:"form", id:"commentsForm_"+idItem, width: 500, elements:
                                [
                                    { view:"text", name:"comment", placeholder:"New comment", align:"center"}
                                ],
                                rules:{
                                    "comment":webix.rules.isNotEmpty
                                }
                            },
                            { view:"toolbar", id:"mybar", align: "center", elements:[
                                { view:"button", value:"Add comment", click: ()=>{
                                    if (!$$(`commentsForm_${idItem}`).validate())
                                        webix.message({ type:"error", text:"Form data is invalid" });
                                    else {
                                        let newItem = {id: Date.now(), text: $$(`commentsForm_${idItem}`).getValues().comment};
                                        $$('commentList').add(newItem);
                                        if(typeof item.comments == 'string') item.comments = JSON.parse(item.comments);
                                        item.comments.push(newItem);
                                        $$(`commentsForm_${idItem}`).clear();
                                        $$(id('taskList')).updateItem(idItem, item);
                                        let editTaskValues = Object.assign({ _token:LA.token}, {id:idItem, comments: item.comments});
                                        webix.ajax().post(Route('tasks.store'),editTaskValues);
                                    }
                                }, hotkey: "enter" },
                                { view:"button", value:"Close", click: `$$('commentModal_${idItem}').close();` },
                                { view:"button", value:"Remove selected", type:"danger", click: function(){
                                    var idComment = $$("commentList").getSelectedId();
                                    if(!idComment){ return webix.alert("Please selected a card that you want to remove!"); }
                                    $$("commentList").remove(idComment);
                                    if(typeof item.comments == 'string') item.comments = JSON.parse(item.comments);
                                    var newUpdComments = [];
                                    item.comments.forEach(function(val, key){
                                        if(val.id!=idComment) newUpdComments.push(item.comments[key]);
                                    });
                                    item.comments = newUpdComments;
                                    $$(id('taskList')).updateItem(idItem, item);
                                    let editTaskValues = Object.assign({ _token:LA.token}, {id:idItem, comments: item.comments});
                                    webix.ajax().post(Route('tasks.store'),editTaskValues);
                                } }]
                            }
                        ]
                    }
                }).show();
            }},
            {icon: "pencil", click: editForm}
        ],
        templateBody: function(obj){
            return `
            <p><small><i class="fa fa-clock-o"></i> Create : ${obj.created_at} <br> <i class="fa fa-clock-o"></i> Update : ${obj.updated_at}</small></p>
            <p>${obj.text}</p>
        `;
        }
    });

    return {
        rows:[
            //{ view:"template", type:"header", template:`<center>${state.header}</center>` },
            { view:"toolbar", id:id("mybar"), align: "center", elements:
                [
                    {view:"button", value:"New", click: function(){
                        webix.ui({
                            id: "newTask",
                            view:"window",
                            position:"center",
                            modal: true,
                            head:"New Task",
                            body:{
                                rows: [
                                    { cols:[
                                        {view:"form", id:"newTaskForm", width: 500, elements:
                                            [
                                                { view:"select", name: "status", label:"Status", value:1, options:[
                                                        { "id":'new', "value":"new" },
                                                        { "id":'work', "value":"work" },
                                                        { "id":'test', "value":"test" },
                                                        { "id":'done', "value":"done" }
                                                    ]
                                                },
                                                { view:"textarea", name:"text", placeholder:"Text", align:"center"},
                                                { view:"text", name:"tags", placeholder:"Tags", align:"center"},
                                                { view:"colorpicker", label:"Color", name:"color", value:"#00FF00"}
                                            ],
                                            rules:{
                                                "text":webix.rules.isNotEmpty
                                            }
                                        }
                                    ]
                                    },
                                    { view:"toolbar", id:id("mybar"), align: "center", elements:[
                                        { view:"button", value:"OK", width:70, click: function(){
                                            if (!$$("newTaskForm").validate())
                                                webix.message({ type:"error", text:"Form data is invalid" });
                                            else{
                                                let newTaskValues = Object.assign({ _token:LA.token}, $$("newTaskForm").getValues());
                                                webix.ajax().post(Route('tasks.store'),newTaskValues, function(result){
                                                    $$(id('taskList')).add(JSON.parse(result));
                                                    $$('newTask').close();
                                                });
                                            }
                                        }, hotkey: "enter" },
                                        { view:"button", value:"Close", width:70, click:`$$('newTask').close();` },
                                        { view:"button", value:"Clear Form", width:85, click:"$$('newTaskForm').clear()"}]
                                    }
                                ]
                            }
                        }).show();
                    }},
                    {view:"button", value:"Reload", icon:"refresh", click: () => {
                        $$(id('taskList')).load(Route('tasks.index'));
                    }},
                    {view: "button", type: "danger", label: "Remove selected", click: () => {
                        var id = $$(id('taskList')).getSelectedId();
                        if(!id){ return webix.alert("Please selected a card that you want to remove!"); }
                        if(typeof id === 'string'){
                            webix.ajax().del(Route('tasks.destroy', {task:id}), { _token:LA.token});
                        }else{
                            $.each(id, function(key,val){ webix.ajax().del(Route('tasks.destroy', {task:val}), { _token:LA.token}); });
                        }
                        console.log(id, typeof id);
                        $$(id('taskList')).remove(id);
                    }},
                ]
            },
            { view:"kanban", type:"space",
                id: id('taskList'),
                on:{
                    onListItemDblClick: function(id,e,node,list){
                        editForm(e,id);
                    },
                    onListAfterDrop: function(dragContext,e,list){
                        let item = this.getItem(dragContext.start);
                        let status = dragContext.to.config.status;
                        let updPosition = { _token:LA.token, id: item.id, status:status, sort: item.$index};
                        webix.ajax().post(Route('tasks.store'), updPosition);
                    }
                },
                cols:[
                    { header:"Backlog", body:{ view:"kanbanlist", status:"new", type: "task", multiselect: true }},
                    { header:"In Progress", body:{ view:"kanbanlist", status:"work", type: "task", multiselect: true}},
                    { header:"Testing", body:{ view:"kanbanlist", status:"test", type: "task", multiselect: true }},
                    { header:"Done", body:{ view:"kanbanlist", status:"done", type: "task", multiselect: true }}
                ],
                url: Route('tasks.index')
            }
        ]
    };
}