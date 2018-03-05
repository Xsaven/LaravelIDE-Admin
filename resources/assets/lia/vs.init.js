require.config({ paths: { 'vs': 'vendor/lia/vs' }});
require(['vs/editor/editor.main'], function() {
    window.vs = monaco;
    monaco.editor.create(document.getElementsByName("lookValue"), {
        value: result,
        language: "javascript"
    });
});