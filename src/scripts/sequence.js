// src/scripts/sequence.js

async function loadSequenceTypes() {
    try {
        const response = await fetch(`${API_CONFIG.sequenceApi}/api/sequence_types`);
        const types = await response.json();
        const sequenceTypeSelect = document.getElementById('sequenceType');
        
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            sequenceTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading sequence types:', error);
    }
}

async function generateSequence() {
    const type = document.getElementById('sequenceType').value;
    const count = document.getElementById('sequenceCount').value;
    const start = document.getElementById('sequenceStart').value;
    const step = document.getElementById('sequenceStep').value;
    const resultDiv = document.getElementById('sequenceResult');

    if (!type || !count) {
        resultDiv.innerHTML = '<p class="error">Please select a sequence type and specify the count.</p>';
        return;
    }

    const data = { type, count: parseInt(count) };
    if (type === 'arithmetic' || type === 'geometric') {
        if (!start || !step) {
            resultDiv.innerHTML = '<p class="error">Please provide start and step/ratio values for arithmetic/geometric sequences.</p>';
            return;
        }
        data.start = parseFloat(start);
        data.step = parseFloat(step);
    }

    try {
        const response = await fetch(`${API_CONFIG.sequenceApi}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.error) {
            resultDiv.innerHTML = `<p class="error">Error: ${result.error}</p>`;
        } else {
            resultDiv.innerHTML = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Sequence:</h3>
                <p>${result.sequence.join(', ')}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p class="error">An error occurred while generating the sequence. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadSequenceTypes();
    const generateButton = document.getElementById('generateSequenceButton');
    if (generateButton) {
        generateButton.addEventListener('click', generateSequence);
    }
});