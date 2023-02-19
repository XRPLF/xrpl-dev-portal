import '../../index.css';

import { isValidClassicAddress, xrpToDrops } from 'xrpl';

import addXrplLogo from '../helpers/addXrplLogo';
import { submitTransactionToLedger } from '../helpers/submitTransactionToLedger';

addXrplLogo();

// Get the elements from the DOM
const homeButton = document.querySelector('#home_button');
const txHistoryButton = document.querySelector('#transaction_history_button');
const destinationAddress = document.querySelector('#destination_address');
const amount = document.querySelector('#amount');
const destinationTag = document.querySelector('#destination_tag');
const submitTxBtn = document.querySelector('#submit_tx_button');

// Disable the submit button by default
submitTxBtn.disabled = true;
let isValidDestinationAddress = false;
const allInputs = document.querySelectorAll('#destination_address, #amount');

// Add event listener to the redirect buttons
homeButton.addEventListener('click', () => {
    window.location.pathname = '/index.html';
});

txHistoryButton.addEventListener('click', () => {
    window.location.pathname =
        '/src/transaction-history/transaction-history.html';
});

const validateAddress = () => {
    destinationAddress.value = destinationAddress.value.trim();
    // Check if the address is valid
    if (isValidClassicAddress(destinationAddress.value)) {
        // Remove the invalid class if the address is valid
        destinationAddress.classList.remove('invalid');
        isValidDestinationAddress = true;
    } else {
        // Add the invalid class if the address is invalid
        isValidDestinationAddress = false;
        destinationAddress.classList.add('invalid');
    }
};

// Add event listener to the destination address
destinationAddress.addEventListener('input', validateAddress);

// Add event listener to the amount input
amount.addEventListener('keydown', (event) => {
    const codes = [8, 190];
    const regex = /^[0-9\b.]+$/;

    // Allow: backspace, delete, tab, escape, enter and .
    if (!(regex.test(event.key) || codes.includes(event.keyCode))) {
        event.preventDefault();
        return false;
    }

    return true;
});

// NOTE: Keep this code at the bottom of the other input event listeners
// All the inputs should have a value to enable the submit button
for (let i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener('input', () => {
        let values = [];
        allInputs.forEach((v) => values.push(v.value));
        submitTxBtn.disabled =
            !isValidDestinationAddress || values.includes('');
    });
}

// Add event listener to the submit button
submitTxBtn.addEventListener('click', async () => {
    try {
        console.log('Submitting transaction');
        submitTxBtn.disabled = true;
        submitTxBtn.textContent = 'Submitting...';
        // Create the transaction object
        const txJson = {
            TransactionType: 'Payment',
            Amount: xrpToDrops(amount.value),
            Destination: destinationAddress.value,
        };

        // Get the destination tag if it exists
        if (destinationTag?.value !== '') {
            txJson.DestinationTag = destinationTag.value;
        }

        // Submit the transaction to the ledger
        const { result } = await submitTransactionToLedger({ tx: txJson });
        const txResult =
            result?.meta?.TransactionResult || result?.engine_result || '';

        if (txResult === 'tesSUCCESS') {
            alert('Transaction submitted successfully!');
        } else {
            throw new Error(txResult);
        }
    } catch (error) {
        alert('Error submitting transaction, Please try again.');
        console.error(error);
    } finally {
        submitTxBtn.disabled = false;
        submitTxBtn.textContent = 'Submit Transaction';
    }
});
