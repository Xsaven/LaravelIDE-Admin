webix.attachEvent("onBeforeAjax",
    function(mode, url, data, request, headers, files, promise) {
        headers["X-CSRF-TOKEN"] = LA.token;
        if(mode=='DELETE'){
            headers["Content-type"] = "application/json";
        }
    }
);

var config = {
    settings: {
        selectionEnabled: true
    },
    content: [{
        type: 'row',
        content:[/*{
            title: 'Welcome page',
            type: 'component',
            componentName: 'page',
            componentState: { href: 'exception_reporter', header: `Welcome to LaravelIDE-Admin`, type: 'webix' }
        }*/]
    }]

    // content: [{
    //     type: 'row',
    //     content:[{
    //         title: 'Config',
    //         type: 'component',
    //         componentName: 'page',
    //         componentState: { href: '/admin/auth/menu', header: 'Config', type: 'link' }
    //     }]
    // }]
};

var savedState = localStorage.getItem( 'savedState' );

if( savedState !== null ) {
    config = JSON.parse( savedState );
}

module.exports = config;