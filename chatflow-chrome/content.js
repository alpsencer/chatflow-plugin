function populatePrompt(prompt) {
    const textarea = document.getElementById('prompt-textarea');
    if(textarea){
        console.log('Textarea found');
    }
    if (textarea) {
        console.log('Populating prompt with ' + prompt);
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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.model) {
            console.log('Received model', request.model);
            // Add a delay to ensure the model is set before processing the prompt
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const prompt = urlParams.get('prompt');
                if (prompt) {
                    console.log('Prompt found', prompt);
                    populatePrompt(prompt);
                    console.log('Prompt populated');
                }
            }, 1000); // Adjusted the delay to 1000 ms
        }
    }
);