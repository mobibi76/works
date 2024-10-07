const scriptUrl = 'https://script.google.com/macros/s/AKfycbxTovLT-wvG3C8g2T1TA6ZN_WMk0p8bByJMhJH50-yej9QezlrvBjGNq8qAjljVVVs5/exec';

function fetchGoogleSheetsData() {
    return fetch(scriptUrl)
        .then(response => response.json())
        .then(data => {
            return fetch('./Blog')
                .then(blogResponse => blogResponse.text())
                .then(blogHtml => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(blogHtml, 'text/html');
                    const table = doc.querySelector('table');
                    const ul = table.querySelector('ul');

                    if (ul) {
                        ul.innerHTML = '';
                        
                        data.forEach(row => {
                            const li = document.createElement('li');
                            li.textContent = `${row[0] || ''}: ${row[1] || ''}`;
                            ul.appendChild(li);
                        });
                    }
                    return table.outerHTML;
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return '<p>Error fetching data</p>';
        });
}

function loadBlog() {
    fetchGoogleSheetsData().then(html => {
        document.getElementById('container').innerHTML = html;
    });
}

document.getElementById('load-blog').addEventListener('click', function(e) {
    e.preventDefault();
    loadBlog();
});
