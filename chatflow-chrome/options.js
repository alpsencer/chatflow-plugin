var modelSelect = document.getElementById('modelSelect');
var currentModel = document.getElementById('currentModel');

function updateCurrentModel() {
    var modelName = modelSelect.options[modelSelect.selectedIndex].text;
    currentModel.textContent = 'Current Model: ' + modelName;
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['defaultModel'], function(result) {
        modelSelect.value = result.defaultModel;
        updateCurrentModel();
    });
});

document.getElementById('saveBtn').addEventListener('click', function() {
    var selectedModel = modelSelect.value;
    if(!selectedModel){
        selectedModel = 'text-davinci-002-render-sha'; // Set your default model here
    }
    else if(selectedModel == 'GPT-4'){
        selectedModel = 'gpt-4';
    }
    else if(selectedModel == "GPT-3.5"){
        selectedModel = 'text-davinci-002-render-sha';
    }
    chrome.storage.local.set({defaultModel: selectedModel}, function() {
        console.log('Model set to ' + selectedModel);
        updateCurrentModel();
    });
});


// Default preprompts
const defaultPreprompts = {
    1: "Explain this for me: ",
    2: "Explain the following as if I am a high school student: ",
    3: "Draw the following: ",
    4: "Correct the grammar in the following: "
};

// Load existing preprompts
chrome.storage.local.get(['preprompts'], (result) => {
    const preprompts = result.preprompts || defaultPreprompts;
    const container = document.getElementById('prepromptsContainer');

    // Create input fields for each preprompt
    for (const [key, value] of Object.entries(preprompts)) {
        const promptContainer = document.createElement('div');
        promptContainer.className = 'prompt-container'; // Add class to container

        const label = document.createElement('label');

        // Format the label text
        let labelText = key;
        labelText += ': '; // Add colon and space at the end

        label.textContent = labelText;
        label.className = 'my-label-class'; // Add class to label

        const input = document.createElement('input');
        input.type = 'text';
        input.id = key;
        input.value = value;
        input.className = 'my-input-class'; // Add class to input

        promptContainer.appendChild(label);
        promptContainer.appendChild(input);
        container.appendChild(promptContainer);
    }
});

// Save updated preprompts
document.getElementById('prepromptsForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const preprompts = {};
    for (const input of document.querySelectorAll('#prepromptsContainer input')) {
        preprompts[input.id] = input.value;
    }

    chrome.storage.local.set({ preprompts }, () => {
        console.log('Preprompts updated');
    });
});

document.getElementById('addPrompt').addEventListener('click', (e) => {
    e.preventDefault();

    // Add a new prompt
    const promptContainer = document.createElement('div');
    promptContainer.className = 'prompt-container'; // Add class to container
    const label = document.createElement('label');
    const input = document.createElement('input');

    // Set up the new prompt
    // You'll need to generate a unique key for each new prompt
    const key = (document.querySelectorAll('#prepromptsContainer input').length + 1);
    label.textContent = key + ': ';
    input.id = key;
    label.className = 'my-label-class'; // Add class to label
    input.className = 'my-input-class'; // Add class to input

    // Add the new prompt to the form
    promptContainer.appendChild(label);
    promptContainer.appendChild(input);
    document.getElementById('prepromptsContainer').appendChild(promptContainer);
});

document.getElementById('removePrompt').addEventListener('click', (e) => {
    e.preventDefault();

    // Remove the last prompt
    const container = document.getElementById('prepromptsContainer');
    if (container.children.length > 0) {
        container.removeChild(container.lastChild);
    }
});