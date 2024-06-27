async function loadSequenceTypes() {
    try {
        const response = await fetch(`${API_CONFIG.sequenceApi}/api/sequence_types`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const types = await response.json();
        const sequenceTypeSelect = document.getElementById('sequenceType');
        
        // Clear existing options
        sequenceTypeSelect.innerHTML = '';
        
        // Add a default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a sequence type';
        sequenceTypeSelect.appendChild(defaultOption);

        // Add sequence types from the API
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            sequenceTypeSelect.appendChild(option);
        });

        console.log('Sequence types loaded successfully:', types);
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

    const token = localStorage.getItem('token');
    const maxTermsForGuests = 10; // Set the limit for non-authenticated users to 10

    if (!token && parseInt(count) > maxTermsForGuests) {
        resultDiv.innerHTML = `<p class="error">Please log in to generate sequences longer than ${maxTermsForGuests} terms.</p>`;
        return;
    }

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
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = token;
        }

        const response = await fetch(`${API_CONFIG.sequenceApi}/api/generate`, {
            method: 'POST',
            headers: headers,
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

function updateUIForAuthStatus() {
    const token = localStorage.getItem('token');
    const sequenceCountInput = document.getElementById('sequenceCount');
    const maxTermsForGuests = 10;

    if (token) {
        sequenceCountInput.removeAttribute('max');
        sequenceCountInput.title = "No limit for authenticated users";
    } else {
        sequenceCountInput.max = maxTermsForGuests;
        sequenceCountInput.title = `Maximum ${maxTermsForGuests} terms for guests. Log in for unlimited terms.`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded. Initializing sequence generator...');
    loadSequenceTypes();
    updateUIForAuthStatus();
    const generateButton = document.querySelector('button[onclick="generateSequence()"]');
    if (generateButton) {
        generateButton.removeAttribute('onclick');
        generateButton.addEventListener('click', generateSequence);
        console.log('Generate button event listener added');
    } else {
        console.error('Generate button not found');
    }
});