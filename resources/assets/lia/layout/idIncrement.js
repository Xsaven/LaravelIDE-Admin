module.exports = function(componentName, uniqId){
    return function(id){
        return id+'['+componentName+']['+uniqId+']';
    };
};