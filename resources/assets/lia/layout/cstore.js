var containersStore = [];

module.exports = function(uniqId=false, $data=false){
    if(!uniqId) return containersStore;

    if(typeof $data === 'object') {
        if(containersStore[uniqId]==undefined) containersStore[uniqId] = {};
        return containersStore[uniqId] = Object.assign(containersStore[uniqId], $data);
    }

    if(containersStore[uniqId]!=undefined) return containersStore[uniqId];
    else return containersStore[uniqId] = {};
};