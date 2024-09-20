// script.js
document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggle');
    const body = document.body;

    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    });
});
