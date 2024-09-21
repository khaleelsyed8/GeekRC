let playerName = '';
let playerRole = '';
let stats = {
    security: 50,
    budget: 100000,
    risk: 50,
    compliance: 20,
    morale: 75
};
let scenarios = [];
let currentScenario = null; // Track the current scenario

// Load scenarios from JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        scenarios = data.scenarios;
        startGame();
    });

function startGame() {
    addMessage("Welcome! Please enter your name:");
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();

    if (!userInput) return;  // Prevent empty input

    // Show user input as a chat message
    addMessage(userInput, true);

    if (!playerName) {
        playerName = userInput;
        addMessage(`Hi ${playerName}! What role would you like to start as? (1)CISO (2)Internal Auditor (3)Risk Manager`);
    } else if (!playerRole) {
        setPlayerRole(userInput);
    } else {
        processChoice(userInput);
    }

    document.getElementById('user-input').value = '';  // Clear input field
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function setPlayerRole(input) {
    const roleMapping = {
        "1": "CISO",
        "2": "Internal Auditor",
        "3": "Risk Manager",
        "CISO": "CISO",
        "Internal Auditor": "Internal Auditor",
        "Risk Manager": "Risk Manager"
    };

    if (roleMapping[input]) {
        playerRole = roleMapping[input];
        addMessage(`Great, you're starting as ${playerRole}. Let's begin!`);
        presentScenario();
    } else {
        addMessage("We don't have this role in our company for now.");
    }
}

function presentScenario() {
    const filteredScenarios = scenarios.filter(s => s.role === playerRole);
    if (filteredScenarios.length > 0) {
        const randomScenario = filteredScenarios[Math.floor(Math.random() * filteredScenarios.length)];
        currentScenario = randomScenario; // Track the current scenario
        addMessage(randomScenario.question);

        // Create clickable options with delay
        randomScenario.options.forEach((option, index) => {
            setTimeout(() => {
                const choiceButton = document.createElement('button');
                choiceButton.textContent = `(${index + 1}) ${option.text}`;
                choiceButton.classList.add('choice-button');
                choiceButton.dataset.index = index;
                choiceButton.addEventListener('click', handleChoice);
                const chatBox = document.getElementById('chat-box');
                chatBox.appendChild(choiceButton);
            }, 500); // Delay options by 500ms for better UX
        });
    } else {
        addMessage("No scenarios available for your role at the moment.");
    }
}

function handleChoice(event) {
    const choiceIndex = event.target.dataset.index;
    processChoice(choiceIndex + 1); // Process it as if the player selected it

    // Hide all choices after one is clicked
    document.querySelectorAll('.choice-button').forEach(button => {
        button.disabled = true; // Optionally disable buttons
        button.style.display = 'none'; // Hide buttons
    });
}

function processChoice(choice) {
    if (currentScenario) {
        const selectedOption = currentScenario.options[parseInt(choice) - 1];

        if (selectedOption) {
            updateStats(selectedOption.effects);
            addMessage(`You chose: ${selectedOption.text}`, true);
            updateStatDisplay(true); // Highlight the stats that have changed
            
            // Check for game over
            if (stats.risk >= 100) {
                gameOver("You failed to get the company ISO 27001 Certified.");
                return;
            }

            // Check for positive action
            if (stats.security >= 200 || stats.risk <= 10) {
                gameOver("You're taking the right action and close to getting ISO 27001 certified.");
                return;
            }

            setTimeout(presentScenario, 1000); // Delay next scenario by 1s
        } else {
            addMessage("Invalid choice, please try again.");
        }
    }
}

function updateStats(effects) {
    Object.keys(effects).forEach(stat => {
        stats[stat] += effects[stat];
    });
}

function updateStatDisplay(highlight = false) {
    Object.keys(stats).forEach(stat => {
        const statElement = document.getElementById(stat);
        statElement.textContent = stats[stat];
        
        // Highlight changed stats
        if (highlight) {
            statElement.classList.add('highlight');
            setTimeout(() => {
                statElement.classList.remove('highlight');
            }, 500); // Remove highlight after 500ms
        }
    });
}

function gameOver(message) {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = ''; // Clear the chat box

    const gameOverMessage = document.createElement('div');
    gameOverMessage.classList.add('message');
    gameOverMessage.classList.add('game-over');
    gameOverMessage.textContent = message;
    chatBox.appendChild(gameOverMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(text, user = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (user) {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('bot-message');
    }
    messageElement.textContent = text;
    const chatBox = document.getElementById('chat-box');
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Adding scroll feature
    if (chatBox.scrollHeight > chatBox.clientHeight) {
        chatBox.style.overflowY = "scroll";
    }
}
