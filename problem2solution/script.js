document.addEventListener('DOMContentLoaded', () => {
    const inputAmount = document.getElementById('input-amount');
    const outputAmount = document.getElementById('output-amount');
    const inputCurrency = document.getElementById('input-currency');
    const outputCurrency = document.getElementById('output-currency');
    const errorMessage = document.getElementById('error-message');
    const form = document.getElementById('swap-form');
    
    let tokenPrices = {};
    let tokenIcons = {
        'SWTH': 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg',
        'ETH': 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg',
        'BTC': 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/BTC.svg'
        // Add more tokens as needed
    };
    
    // Fetch token prices
    async function fetchPrices() {
        try {
            const response = await fetch('https://interview.switcheo.com/prices.json');
            if (!response.ok) throw new Error('Network response was not ok');
            tokenPrices = await response.json();
            console.log('Token Prices:', tokenPrices); // Debugging
            populateCurrencyOptions();
        } catch (error) {
            console.error('Failed to fetch token prices:', error);
            errorMessage.textContent = 'Failed to load token prices.';
        }
    }
    
    function populateCurrencyOptions() {
        const currencies = Object.keys(tokenPrices);
        inputCurrency.innerHTML = '';
        outputCurrency.innerHTML = '';
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.innerHTML = `
                <img src="${tokenIcons[currency] || ''}" class="token-icon" alt="${currency}" />
                ${currency}
            `;
            inputCurrency.appendChild(option.cloneNode(true));
            outputCurrency.appendChild(option.cloneNode(true));
        });
    }
    
    function calculateOutputAmount() {
        const amount = parseFloat(inputAmount.value);
        const inputCurrencyValue = inputCurrency.value;
        const outputCurrencyValue = outputCurrency.value;

        console.log('Input Amount:', amount);
        console.log('Input Currency:', inputCurrencyValue);
        console.log('Output Currency:', outputCurrencyValue);

        if (isNaN(amount) || !inputCurrencyValue || !outputCurrencyValue) {
            outputAmount.value = '';
            return;
        }

        const inputPrice = tokenPrices[inputCurrencyValue];
        const outputPrice = tokenPrices[outputCurrencyValue];

        console.log('Input Price:', inputPrice);
        console.log('Output Price:', outputPrice);

        if (!inputPrice || !outputPrice) {
            console.error('Invalid token prices:', inputPrice, outputPrice); // Debugging
            outputAmount.value = '';
            return;
        }

        const result = (amount * inputPrice) / outputPrice;
        console.log('Calculated Result:', result);

        // Ensure result is a valid number
        outputAmount.value = isNaN(result) ? '' : result.toFixed(2);
    }
    
    inputAmount.addEventListener('input', calculateOutputAmount);
    inputCurrency.addEventListener('change', calculateOutputAmount);
    outputCurrency.addEventListener('change', calculateOutputAmount);
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const amount = parseFloat(inputAmount.value);
        const inputCurrencyValue = inputCurrency.value;
        const outputCurrencyValue = outputCurrency.value;
        
        if (isNaN(amount) || !inputCurrencyValue || !outputCurrencyValue) {
            errorMessage.textContent = 'Please fill out all fields correctly.';
            return;
        }
        
        errorMessage.textContent = '';
        alert(`Swapping ${amount} ${inputCurrencyValue} for ${outputAmount.value} ${outputCurrencyValue}`);
    });
    
    fetchPrices();
});
