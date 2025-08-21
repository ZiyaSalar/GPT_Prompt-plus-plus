console.log("GPT Prompt++ Loaded on chatgpt.com");

function getUserPrompt() {
    const editor = document.querySelector('#prompt-textarea p');
    if (editor) {
        console.log("User prompt:", editor.innerText);
        return editor.innerText;
    }
    return "";
}

function insertTextIntoEditor(text) {
    const editor = document.querySelector('.ProseMirror');
    if (!editor) return;

    
    editor.focus();
    document.execCommand('selectAll', false, null); 
    document.execCommand('insertText', false, text);
}



function findBtnDiv() {
    const promptBar = document.querySelector(".ms-auto.flex.items-center.gap-1\\.5");
    console.log("Target div:", promptBar);
    return promptBar;
}



function injectButton() {
    if (document.getElementById("emailEnhancerHost")) return;

    const btnDiv = findBtnDiv();
    if (!btnDiv) return;

    
    const host = document.createElement("div");
    host.id = "emailEnhancerHost";
    host.style.position = "relative";
    host.style.display = "inline-block";
    btnDiv.insertBefore(host, btnDiv.firstChild);

    const shadow = host.attachShadow({ mode: "open" });

    
    const button = document.createElement("button");
    button.title="GPT Prompt++";


    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("icons/gpt-prompt-plus-plus-btn.png");
    img.alt = "GPT Prompt++";
    img.style.width = "20px";
    img.style.height = "20px";
    button.appendChild(img);

    button.id = "emailEnhancerBtn";

    
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
    // console.log("ziya");
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
            // console.log("i am here");
            console.log("Generated Enhanced Prompt:\n"+generatedPrompt);
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
