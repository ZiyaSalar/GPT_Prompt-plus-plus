console.log("Email Enhancer Loaded on chatgpt.com");

// --- Get text from the ChatGPT editor ---
function getUserPrompt() {
    const editor = document.querySelector('#prompt-textarea p');
    if (editor) {
        console.log("User prompt:", editor.innerText);
        return editor.innerText;
    }
    return "";
}

// --- Insert text safely into ChatGPT editor ---
function insertTextIntoEditor(text) {
    const editor = document.querySelector('.ProseMirror');
    if (!editor) return;

    // Use document.execCommand to insert text safely
    editor.focus();
    document.execCommand('selectAll', false, null); // optional: replace all text
    document.execCommand('insertText', false, text);
}


// --- Locate the div for placing our button ---
function findBtnDiv() {
    const selectors = [
        '.end-2\\.5',
        '.gap-2',
        '.bottom-2\\.5'
    ];
    for (const selector of selectors) {
        const promptBar = document.querySelector(selector);
        if (promptBar) {
            return promptBar;
        }
    }
    return null;
}

// --- Inject our button into the ChatGPT UI ---
function injectButton() {
    if (document.getElementById("emailEnhancerHost")) return;

    const btnDiv = findBtnDiv();
    if (!btnDiv) return;

    // Host container for shadow DOM
    const host = document.createElement("div");
    host.id = "emailEnhancerHost";
    host.style.position = "relative";
    host.style.display = "inline-block";
    btnDiv.insertBefore(host, btnDiv.firstChild);

    const shadow = host.attachShadow({ mode: "open" });

    // Create the button inside shadow root
    const button = document.createElement("button");
    button.title="GPT Prompt++";


    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icons/gpt-prompt-plus-plus-btn.png");
    img.alt = "GPT Prompt++";
    img.style.width = "20px";
    img.style.height = "20px";
    button.appendChild(img);

    button.id = "emailEnhancerBtn";

    // Button styles
    const style = document.createElement("style");
    style.textContent = `
    #emailEnhancerBtn {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
    }
    #emailEnhancerBtn:hover {
    background: #454545;
    
    }
    #emailEnhancerBtn:active {
    transform: scale(0.95);
    }
    `;

    shadow.appendChild(style);
    shadow.appendChild(button);

    // --- Button click handler ---
    button.addEventListener("click", async () => {
        console.log("Enhancer clicked!");
        try {
            button.disabled = true;

            const userPrompt = getUserPrompt();

            const response = await fetch('http://localhost:8080/api/gptprompt/generate', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    promptContent: userPrompt,
                })
            });

            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            const generatedPrompt = await response.text();
            console.log("i am here");
            console.log("hello"+generatedPrompt);
            // const editor = document.querySelector('#prompt-textarea p');
            // if (!editor) {
            //     throw new Error('API Request Failed');
            // }else{
            //     editor.innerText=generatedPrompt;
            // }

            insertTextIntoEditor(generatedPrompt);

        } catch (error) {
            console.error(error);
            alert("Failed to generate enhanced prompt");
        } finally {
            button.disabled = false;
        }
    });
}

// --- Observe DOM for the chat editor ---
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);

        const hasComposeElements = addedNodes.some((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return false;
            return (
                node.matches(".ProseMirror, ._fallbackbtnDiv_ebv8s_2, ._prosemirror-parent_ebv8s_2") ||
                node.querySelector?.(".ProseMirror, ._fallbackbtnDiv_ebv8s_2, ._prosemirror-parent_ebv8s_2")
            );
        });

        if (hasComposeElements) {
            console.log("Compose Window detected...");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true
});
