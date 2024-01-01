// Context menu
chrome.contextMenus.create({
    id: "sendToChatGPT",
    title: "Ask to ChatGPT",
    contexts: ["selection"]
});

// Define the preprompts
const preprompts = {
    explain: "Explain this for me: ",
    highSchool: "Explain the following as if I am a high school student: ",
    draw: "Draw the following: ",
    grammar: "Correct the grammar in the following: "
};

// Create context menu items for each preprompt
for (const [key, value] of Object.entries(preprompts)) {
    chrome.contextMenus.create({
        id: key,
        title: value,
        contexts: ["selection"]
    });
}

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.selectionText) {
        const chosenPreprompt = preprompts[info.menuItemId];
        if (chosenPreprompt) {
            const encodedQuery = encodeURIComponent(chosenPreprompt + info.selectionText);
            // Get the stored model or use default
            chrome.storage.sync.get(['defaultModel'], function(result) {
                const model = result.defaultModel || 'gpt-4'; // Default to GPT-4 if no preference is stored
                const openaiChatUrl = `https://chat.openai.com/?prompt=${encodedQuery}&model=${model}`;
                chrome.tabs.create({ url: openaiChatUrl }); // Open a new tab with the URL
            });
        }
    }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.includes("https://chat.openai.com/") && changeInfo.status === 'complete') {
        const urlParams = new URLSearchParams(new URL(tab.url).search);
        const model = urlParams.get('model') || 'gpt-4'; // Default to GPT-4 if no model parameter is provided
        const prompt = urlParams.get('prompt');

        if (model) {
            // Send the model parameter first
            chrome.tabs.sendMessage(tabId, { model: model });

            // After a delay, send the prompt parameter
            if (prompt) {
                setTimeout(() => {
                    chrome.tabs.sendMessage(tabId, { prompt: prompt });
                }, 200); // Delay of 200 milliseconds
            }
        }
    }
});
