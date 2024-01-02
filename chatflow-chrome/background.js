chrome.runtime.onInstalled.addListener(() => {
    let defaultModel = 'text-davinci-002-render-sha'; // Set your default model here
    chrome.storage.local.set({defaultModel: defaultModel}, () => {
        console.log('Initial default model set to ' + defaultModel);
    });
});

// Default preprompts
const defaultPreprompts = {
    prompt1: "Explain this for me: ",
    prompt2: "Explain the following as if I am a high school student: ",
    prompt3: "Draw the following: ",
    prompt4: "Correct the grammar in the following: "
};

// Get preprompts from local storage or use default
chrome.storage.local.get(['preprompts'], (result) => {
    const preprompts = result.preprompts || defaultPreprompts;

    // Create context menu items for each preprompt
    for (const [key, value] of Object.entries(preprompts)) {
        if (typeof value === 'string') { // Ensure value is a string
            chrome.contextMenus.create({
                id: key,
                title: value,
                contexts: ["selection"]
            });
        } else {
            console.error(`Invalid value for key ${key}: expected string, found ${typeof value}`);
        }
    }
});

// Listen for preprompts update
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.preprompts) {
        // Remove old context menu items
        chrome.contextMenus.removeAll(function() {
            // Create new context menu items
            for (const [key, value] of Object.entries(changes.preprompts.newValue)) {
                chrome.contextMenus.create({
                    id: key,
                    title: value,
                    contexts: ['editable'],
                });
            }
        });
    }
});

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.storage.local.get(['preprompts', 'defaultModel'], (result) => {
        const preprompts = result.preprompts || defaultPreprompts;
        if (info.selectionText) {
            const chosenPreprompt = preprompts[info.menuItemId];
            if (chosenPreprompt) {
                const encodedQuery = encodeURIComponent(chosenPreprompt + info.selectionText);
                // Get the stored model or use default
                const model = result.defaultModel || 'text-davinci-002-render-sha'; // Default to GPT-3.5 if no preference is stored
                console.log('Model set to ' + model);
                const openaiChatUrl = `https://chat.openai.com/?model=${model}&prompt=${encodedQuery}`;
                chrome.tabs.create({ url: openaiChatUrl }); // Open a new tab with the URL
            }
        }
    });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab && tab.url && tab.url.includes("https://chat.openai.com/") && changeInfo.status === 'complete') {
        const urlParams = new URLSearchParams(new URL(tab.url).search);
        const model = urlParams.get('model') || 'text-davinci-002-render-sha'; // Default to GPT-3.5 if no model parameter is provided
        const prompt = urlParams.get('prompt');

        if (model) {
            // Send the model parameter first
            chrome.tabs.sendMessage(tabId, { model: model });
            console.log('Model sent to content script', model);
        }
    }
});