document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('playbookModal');
    const closeBtn = document.querySelector('.close');
    const playbookDisplay = document.getElementById('playbookDisplay');
    const playbooksContainer = document.getElementById('playbooksContainer');


    
    // Fetch the playbooks and render them
    fetch('playbooks.json')
        .then(response => response.json())
        .then(data => renderPlaybooks(data.playbooks))
        .catch(error => console.error('Error fetching playbooks:', error));

    function renderPlaybooks(playbooks) {
        playbooks.forEach(playbook => {
            const playbookCard = document.createElement('div');
            playbookCard.classList.add('playbook-card');

            playbookCard.innerHTML = `
                <img src="${playbook.image}" alt="${playbook.title}">
                <div class="playbook-content">
                    <h2>${playbook.title}</h2>
                    <p>${playbook.summary}</p>
                    <button class="play-button" data-playbook="${playbook.id}">Play</button>
                </div>
            `;

            playbooksContainer.appendChild(playbookCard);
        });

        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', () => {
                const playbookId = button.getAttribute('data-playbook');
                displayPlaybook(playbookId);
            });
        });
    }
    document.getElementById('searchButton').addEventListener('click', function() {
        document.getElementById('playbooksContainer').scrollIntoView({ behavior: 'smooth' });
    });

    function displayPlaybook(playbookId) {
        fetch('playbooks.json')
            .then(response => response.json())
            .then(data => {
                const playbook = data.playbooks.find(pb => pb.id === playbookId);
                if (playbook) {
                    playbookDisplay.innerHTML = `
                        <h2>${playbook.title}</h2>
                        <img src="${playbook.image}" alt="${playbook.title}">
                        <p>${playbook.content}</p>
                        <button class="clsbtn" id=${closeBtn}>Close</button>
                    `;
                    modal.style.display = 'block';
                }
                document.querySelectorAll('.clsbtn').forEach(button => {
                    button.addEventListener('click', () => {
                        modal.style.display = 'none';
                    });
                });
                
            })
            .catch(error => console.error('Error fetching playbook:', error));
            
    }
    

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
