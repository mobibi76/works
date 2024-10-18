function insertEmail() {
    const emailElement = document.getElementById('email');
    if (emailElement) {
        emailElement.innerHTML = 
            '<a href="mailto:processdesignbase@gmail.com">processdesignbase@gmail.com</a> (125-51-00257)';
    } else {
        console.error('Email Element Not Found.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        const emailElement = document.getElementById('email');
        if (emailElement) {
            insertEmail();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
