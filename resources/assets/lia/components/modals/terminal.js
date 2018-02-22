const slimScroll = require('jquery-slimscroll');
const NProgress = require('nprogress');

module.exports = (data) => ({ position:"center", move: true, resize: true,
    width: $('#layoutContainer').width()/1.5,
    height: $('#layoutContainer').height()/1,
    body:{
        id:"bodyTerminal",
        view: "template",
        template: "<div id='terminal-shell' style='width: 100%; height: 100%'></div>",
        width:0,
        height:0
    },
    on: {
        onShow: function(){
            if($('#terminal-shell').html()!='') return true;
            NProgress.start();
            webix.ajax().get(Route('terminal.index', {view:'index'}), function (data) {
                new Terminal("#terminal-shell", JSON.parse(data));
                $('#terminal-shell').height($('[view_id="bodyTerminal"]').height()-22);
                $('#terminal-shell').width($('[view_id="bodyTerminal"]').width());
                $('[view_id="bodyTerminal"] div').css('padding', 0);
                $('.CodeMirror-fullscreen').height($('#layoutContainer').height()+34);
                $('.CodeMirror-scroll').slimScroll({
                    height: $('#layoutContainer').height()+34,
                    color: '#fff'
                });
                $('.CodeMirror-fullscreen').css('position', 'absolute');
                NProgress.done();
            });
        },
        onViewResize: function(){
            $('#terminal-shell').height($('[view_id="bodyTerminal"]').height()-22);
            $('#terminal-shell').width($('[view_id="bodyTerminal"]').width());
        }
    }
});