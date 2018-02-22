module.exports = function(state){
    return {
        type:"line",
        rows: [
            { view:"template", type:"header", template:state.header },
            { template:"<h1>Undefined template</h1>"},
        ]
    };
}