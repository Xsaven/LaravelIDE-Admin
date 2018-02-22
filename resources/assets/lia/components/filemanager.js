module.exports = function(id){
    return {
        view:"filemanager",
        id: id("files"),
        noFileCache: true,
        url: Route('fmanager.index'),
        handlers:{
            "branch"    : Route('fmanager.branch'),
            "search" 	: Route('fmanager.search'),
            "upload" 	: Route('fmanager.upload'),
            "download"	: Route('fmanager.download'),
            "copy"		: Route('fmanager.copy'),
            "move"		: Route('fmanager.move'),
            "remove"	: Route('fmanager.remove'),
            "rename"	: Route('fmanager.rename'),
            "create"	: Route('fmanager.create')
        }
    };
};