// src/scripts/operations.js

async function performOperation() {
    const operationSelect = document.getElementById('operation');
    const numberInput = document.getElementById('opsInput');
    const resultDiv = document.getElementById('result');
    const operation = operationSelect.value;
    const numbers = numberInput.value.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));

    if (numbers.length < 2) {
        resultDiv.innerHTML = '<p class="error">Please enter at least two valid numbers separated by commas.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.operationsApi}/api/operate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ operation: operation, numbers: numbers }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        } else {
            let resultHTML = `<h3>Operation Result:</h3>`;
            resultHTML += `<p>${numbers.join(` ${operation} `)} = ${data.result}</p>`;
            resultDiv.innerHTML = resultHTML;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p class="error">An error occurred while performing the operation. Please try again later.</p>';
    }
}

// Make sure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    const operateButton = document.getElementById('performOperationButton');
    if (operateButton) {
        operateButton.addEventListener('click', performOperation);
    }
});