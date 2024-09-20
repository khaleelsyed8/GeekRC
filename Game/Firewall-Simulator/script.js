document.getElementById('addRule').addEventListener('click', function() {
    const ipAddress = document.getElementById('ipAddress').value;
    const port = document.getElementById('port').value;
    const action = document.getElementById('action').value;

    if(ipAddress && port && action) {
        addRule(ipAddress, port, action);
    } else {
        alert("Please fill in all fields!");
    }
});

function addRule(ip, port, action) {
    const rulesList = document.getElementById('rulesList');
    const ruleItem = document.createElement('li');
    ruleItem.draggable = true;
    ruleItem.innerHTML = `${action.toUpperCase()} IP: ${ip} Port: ${port} <button class="delete-btn">Delete</button>`;
    
    rulesList.appendChild(ruleItem);

    // Add event listener to delete button
    ruleItem.querySelector('.delete-btn').addEventListener('click', function() {
        ruleItem.remove();
    });

    // Enable drag-and-drop reordering
    ruleItem.addEventListener('dragstart', dragStart);
    ruleItem.addEventListener('dragover', dragOver);
    ruleItem.addEventListener('drop', drop);
    ruleItem.addEventListener('dragend', dragEnd);

    // Clear the input fields
    document.getElementById('ipAddress').value = '';
    document.getElementById('port').value = '';
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.innerHTML);
    this.classList.add('dragging');
}

function dragOver(event) {
    event.preventDefault();
    this.classList.add('over');
}

function drop(event) {
    event.preventDefault();
    const draggedHTML = event.dataTransfer.getData('text/plain');
    const draggingElement = document.querySelector('.dragging');
    this.innerHTML = draggedHTML;
    draggingElement.innerHTML = this.innerHTML;
}

function dragEnd() {
    this.classList.remove('dragging', 'over');
}

document.getElementById('visitUrl').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    const rulesList = document.getElementById('rulesList');
    let accessAllowed = true;

    for(let rule of rulesList.children) {
        const [action, ruleIp, rulePort] = rule.innerText.split(' ');
        
        // Simplified match: checking if URL contains the denied IP or domain
        if(url.includes(ruleIp.replace("IP:", "")) && action === 'DENY') {
            accessAllowed = false;
            break;
        }
    }

    const browserOutput = document.getElementById('browserOutput');
    const logsList = document.getElementById('logsList');
    const logEntry = document.createElement('li');

    if(accessAllowed) {
        browserOutput.textContent = `Access to ${url} allowed.`;
        logEntry.textContent = `ALLOWED: ${url} at ${new Date().toLocaleTimeString()}`;
    } else {
        browserOutput.textContent = `Access to ${url} denied by firewall rule.`;
        logEntry.textContent = `DENIED: ${url} at ${new Date().toLocaleTimeString()}`;
    }

    logsList.appendChild(logEntry);
});
