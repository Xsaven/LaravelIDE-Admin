//require('./layout/cstore');
require('./webix/webix_debug');
webix.debug = false;
require('./webix/filemanager/filemanager');
require('smartmenus');
const layout = require('./layout/app');
require('nprogress/nprogress.css');

require('./webix/filemanager/filemanager.css');
require('./webix/skins/contrast.css');
require('./css/layout.css');
require('./css/AdminLTE.min.css');
require('./css/goldenlayout-base.css');
require('./css/goldenlayout-dark-theme.css');
require('./css/sm-core-css.css');
require('./css/sm-simple/sm-simple.scss');
$(function(){require('./jQuery.inits')();});

exports.CStore = CStore;
exports.layout = layout;

console.log("RunTime:" + new Date());