
module.exports = function(data){
    return function(){
        try{
            $$(data.uri).show()
        }catch (e) {
            let defaultConfig = {
                view: "window",
                id: data.uri,
                head: `<i class="fa fa-${data.icon}"></i> ${data.title} <span onclick="$$('${data.uri}').close()" class="minimazedModalMenu"><i class="fa fa-remove"></i></span><span onclick="$$('${data.uri}').hide()" class="minimazedModalMenu"><i class="fa fa-minus-circle"></i></span>`,
            };
            let dataModal = require('../../components/modals/' + data.uri + '.js')(data);
            webix.ui(Object.assign(defaultConfig, dataModal)).show();
        }
    };
};