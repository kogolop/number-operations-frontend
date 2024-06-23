// src/scripts/firstoccur.js

async function searchFirstOccurrence() {
    const searchInput = document.getElementById('searchInput');
    const resultDiv = document.getElementById('result');
    const numberListDiv = document.getElementById('numberList');
    const target = searchInput.value.trim();

    if (target === '') {
        resultDiv.innerHTML = '<p class="error">Please enter a number to search.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.searchApi}/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ target: parseInt(target) }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        numberListDiv.innerHTML = `<p>Random number list: ${data.numbers.join(', ')}</p>`;

        if (data.error) {
            resultDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `<h3>Search Result:</h3><p>${data.message}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p class="error">An error occurred while searching. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const searchButton = document.getElementById('searchFirstOccurrenceButton');
    if (searchButton) {
        searchButton.addEventListener('click', searchFirstOccurrence);
    }
});