const NProgress = require('nprogress');
const slimScroll = require('jquery-slimscroll');
const ajaxSubmit = require('jquery-form');
const cookie = require('js-cookie');

module.exports = function(container, state, uniqId){
    var widget = container.getElement();
    var tabId = `tab_${uniqId}`;
    var history = [];

    const findATags = function(){
        let widget = $('#'+uniqId);
        widget.find('a:not(a[target="_blank"],a[data-toggle],a[href^="javascript:"])').each(function(){
            $(this).on('click', function(){
                if($(this).attr('href')=='#' || $(this).attr('href')==undefined) return false;
                NProgress.start();
                state.href = $(this).attr('href');
                setGetState();
                return false;
            });
        });
    };

    const ajaxSubmit = function(){
        let widget = $('#'+uniqId);
        widget.find('form').each(function(e){
            $(this).submit(function() {
                let form = $(this);
                let containerUrl = `${form.attr('action')}&${form.serialize()}`;
                $(this).ajaxSubmit({
                    url: form.attr('action'),
                    target: '#' + uniqId,
                    beforeSubmit: function(arr, $form, options) {
                        NProgress.start();
                        CStore(uniqId, {status: 'loading'});
                        form.find('[type="submit"]').prop('disabled', true);
                    },
                    beforeSerialize: function($form, options) {

                    },
                    success: function(responseText, statusText, xhr, $form){
                        form.find('[type="submit"]').prop('disabled', false);
                        if(responseText.status!=undefined){
                            webix.message({
                                text:responseText.message,
                                type:(responseText.status ? "info" : "error"),
                                expire: 10000
                            });
                            setBackHistoryState(2);
                            setGetState();
                        }else{
                            containerUrl = noOriginLocation(containerUrl);
                            widget.attr('data-state-href', containerUrl);
                            history.push(containerUrl);
                            initFunctions();
                        }
                        NProgress.done();
                    },
                    error: function(error, b, c, d, e){
                        webix.modalbox({
                            title:`${error.statusText}! Status: ${error.status}`,
                            buttons:["Close"],
                            width:'80%',
                            text:`${error.responseJSON.message}`,
                            callback:function(result){
                                form.find('[type="submit"]').prop('disabled', false);
                                NProgress.done();
                                CStore(uniqId, {status: 'done'});
                            }
                        });
                        console.log('--ErrorLog-->', error);
                        CStore(uniqId, {status: 'error', error: error});
                    }
                });
                return false;
            });
        });
    };

    const findPerPager = function(){
        let widget = $('#'+uniqId);
        widget.find('.grid-per-pager').on("change", function(e) {
            state.href = $(this).val();
            setGetState();
        });
    };

    const findRefreshBtn = function(){
        let widget = $('#'+uniqId);
        widget.find('.grid-refresh').on("click", function(e) {
            setGetState({}, true);
        });
    };

    const findHistoryBackButton = function(){
        let widget = $('#'+uniqId);
        widget.find('.form-history-back').on("click", function(e) {
            setBackHistoryState(2);
            setGetState();
        });
    };

    const findDeletesActions = function(){
        let widget = $('#'+uniqId);
        widget.find('.grid-row-delete, .tree_branch_delete').on("click", function(e) {
            let deleteButtonObj = $(this);
            webix.confirm({
                title: "Delete",
                text: "Are you sure to delete this item?",
                type:"confirm-warning",
                callback:function(result){
                    if(result){
                        NProgress.start();
                        $.ajax({
                            url: deleteButtonObj.data('delete-uri'),
                            type: 'delete',
                            data: {
                                _token:LA.token,
                            },
                            success: function(data) {
                                if (typeof data === 'object') {
                                    webix.message({
                                        text:data.message,
                                        type:(data.status ? "info" : "error"),
                                        expire: 10000
                                    });
                                }
                                NProgress.done();
                                setGetState({}, true);
                            },
                        });
                    }
                }
            });
            return false;
        });
    };

    const setGetState = function(attrs = {}, noSaveHistory=false){
        NProgress.start();
        CStore(uniqId, {status: 'loading'});
        noOriginLocation();
        widget.attr('data-state-href', state.href);
        if(!noSaveHistory) history.push(state.href);
        $.get(state.href, attrs, function(data){
            widget.html(data).slimScroll({
                height: container.height,
                color: '#fff'
            });
            initFunctions();
        }).fail(function(error) {
            require('../components/error')( container, state, error );
            CStore(uniqId, {status: 'error', error: error});
        }).always(function() {
            NProgress.done();
        });
    };

    const initFunctions = function(){
        noOriginLocation();
        findATags();
        ajaxSubmit();
        findPerPager();
        findRefreshBtn();
        findDeletesActions();
        findHistoryBackButton();
        CStore(uniqId, {status: 'done'});
    };

    const noOriginLocation = function(link=false){
        state.href = state.href.replace(window.location.origin,'');
        if(link) return link.replace(window.location.origin,'');
    };

    const setBackHistoryState = function(num=1){
        if(history[(history.length-num)]==undefined) num-=1;
        state.href = history[(history.length-num)];
    };

    setGetState();

    const storeEvents = function(){
        //console.log(myLayout);
        let store = CStore(uniqId);
        if(store.status=='reload') setGetState({}, true);
    };

    var timer = setInterval(storeEvents, 100);

    container.on('open', function(){

    });

    container.on('resize', function(){
        if(widget){
            widget.slimScroll({height: container.height, color: '#fff'});
        }
    });

    container.on('destroy', function(){
        history = [];
        clearInterval(timer);
    });
};
