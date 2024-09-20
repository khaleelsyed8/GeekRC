// script.js
document.addEventListener('DOMContentLoaded', () => {
    const envelopesContainer = document.getElementById('envelopes-container');
    const popup = document.getElementById('email-popup');
    const closeBtn = document.querySelector('.close-btn');
    const emailDetails = document.getElementById('email-details');

    fetch('emails.json')
        .then(response => response.json())
        .then(data => {
            data.emails.forEach(email => {
                const envelopeDiv = document.createElement('div');
                envelopeDiv.classList.add('envelope');
                envelopeDiv.setAttribute('data-id', email.id);
                
                const closedImg = document.createElement('img');
                closedImg.src = 'closed-envelope.png';
                closedImg.alt = email.title;
                closedImg.classList.add('envelope-img', 'closed');

                const openImg = document.createElement('img');
                openImg.src = 'open-envelope.png';
                openImg.alt = email.title;
                openImg.classList.add('envelope-img', 'open');

                const title = document.createElement('p');
                title.textContent = email.title;

                envelopeDiv.appendChild(closedImg);
                envelopeDiv.appendChild(openImg);
                envelopeDiv.appendChild(title);

                envelopesContainer.appendChild(envelopeDiv);

                envelopeDiv.addEventListener('click', () => {
                    fetchEmailDetails(email.id);
                });
            });
        })
        .catch(error => console.error('Error fetching envelopes:', error));

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    });

    function fetchEmailDetails(id) {
        fetch('emails.json')
            .then(response => response.json())
            .then(data => {
                const email = data.emails.find(email => email.id == id);
                emailDetails.innerHTML = `
                    <p><strong>From:</strong> ${email.from}</p>
                    <p><strong>Subject:</strong> ${email.subject}</p>
                    <p>${email.body}</p>
                `;
                popup.style.display = 'flex';
            })
            .catch(error => console.error('Error fetching email details:', error));
    }
});
