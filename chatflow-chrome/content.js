function openMenuAndSelectModel(model) {
    // Open the menu
    const menuButton = document.getElementById('radix-:r5b:'); // Adjust the selector as needed
    if (menuButton) {
        menuButton.click();

        // Wait for the menu to open, then select the model
        setTimeout(() => {
            // Adjust this selector to correctly target the desired model menu item
            const modelMenuItem = document.querySelector('div[role="menuitem"][data-radix-collection-item=""]');
            if (modelMenuItem && modelMenuItem.textContent.includes(model)) {
                modelMenuItem.click();
            } else {
                console.error('Model menu item not found');
            }
        }, 500); // Adjust timeout as necessary
    } else {
        console.error('Menu button not found');
    }
}

function populatePrompt(prompt) {
    const textarea = document.getElementById('prompt-textarea');
    if (textarea) {
        textarea.value = prompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        // Click the send button
        setTimeout(() => {
            const sendButton = document.querySelector('[data-testid="send-button"]');
            if (sendButton) {
                sendButton.click();
            }
        }, 100); // Adjust delay as necessary
    }
}

function processModel(model) {
    openMenuAndSelectModel(model);
    // Additional logic for processing the model can be added here if necessary
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.model) {
            processModel(request.model);

            // Add a delay to ensure the model is set before processing the prompt
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const prompt = urlParams.get('prompt');
                if (prompt) {
                    populatePrompt(prompt);
                }
            }, 1000); // Adjust this delay based on how long the model selection takes
        }
    }
);
