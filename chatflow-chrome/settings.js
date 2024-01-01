// Save the selected model
document.getElementById('saveBtn').addEventListener('click', function() {
    var selectedModel = document.getElementById('modelSelect').value;
    chrome.storage.sync.set({defaultModel: selectedModel}, function() {
        console.log('Model set to ' + selectedModel);
    });
});