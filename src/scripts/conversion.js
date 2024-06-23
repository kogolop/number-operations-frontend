// src/scripts/conversion.js

async function loadUnits() {
    try {
        const response = await fetch(`${API_CONFIG.conversionApi}/api/units`);
        const units = await response.json();
        const fromUnitSelect = document.getElementById('fromUnit');
        const toUnitSelect = document.getElementById('toUnit');
        
        for (const category in units) {
            const group = document.createElement('optgroup');
            group.label = category.charAt(0).toUpperCase() + category.slice(1);
            
            units[category].forEach(unit => {
                const option = document.createElement('option');
                option.value = unit;
                option.textContent = unit;
                group.appendChild(option);
            });

            fromUnitSelect.appendChild(group.cloneNode(true));
            toUnitSelect.appendChild(group);
        }
    } catch (error) {
        console.error('Error loading units:', error);
    }
}

async function convertUnit() {
    const value = document.getElementById('conversionValue').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const resultDiv = document.getElementById('result');

    if (!value || !fromUnit || !toUnit) {
        resultDiv.innerHTML = '<p class="error">Please fill in all conversion fields.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.conversionApi}/api/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: parseFloat(value), from_unit: fromUnit, to_unit: toUnit }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `<h3>Conversion Result:</h3>
                <p>${data.from_value} ${data.from_unit} = ${data.to_value} ${data.to_unit}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p class="error">An error occurred during conversion. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadUnits();
    const convertButton = document.getElementById('convertUnitButton');
    if (convertButton) {
        convertButton.addEventListener('click', convertUnit);
    }
});