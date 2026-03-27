const tg = window.Telegram.WebApp;
tg.expand();

function openSellForm(coin, rate) {
    document.getElementById('coin-type-input').value = coin;
    document.getElementById('sell-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('sell-modal').classList.add('hidden');
}

document.getElementById('sell-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        timestamp: new Date().toLocaleString(),
        tgId: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "N/A",
        coinType: document.getElementById('coin-type-input').value,
        senderId: document.getElementById('sender-id-input').value,
        amount: document.getElementById('amount-input').value,
        paymentMethod: document.getElementById('payment-method-select').value,
        paymentNumber: document.getElementById('payment-number-input').value,
        status: 'Pending'
    };

    fetch('https://script.google.com/macros/s/AKfycbxiOgWihx2YrQWC9mnwswY5tSmohfdbNHTrRYXGwfRXoF67q1HjPAUPiA26bNrR3i2r/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    }).then(() => {
        alert('Order Submitted!');
        tg.close();
    });
});