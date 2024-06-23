// src/scripts/stats.js
async function calculateStats() {
    const numberInput = document.getElementById('statsInput');
    const resultDiv = document.getElementById('result');
    const numbers = numberInput.value.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));

    if (numbers.length === 0) {
        resultDiv.innerHTML = '<p class="error">Please enter valid numbers separated by commas.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.statsApi}/api/stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numbers: numbers }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        } else {
            let resultHTML = '<h3>Statistics Results:</h3><ul>';
            for (const [key, value] of Object.entries(data)) {
                resultHTML += `<li>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</li>`;
            }
            resultHTML += '</ul>';
            resultDiv.innerHTML = resultHTML;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p class="error">An error occurred while calculating statistics. Please try again later.</p>';
    }
}
// Make sure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    const calculateButton = document.getElementById('calculateStatsButton');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateStats);
    }
});