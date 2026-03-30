let tg = window.Telegram.WebApp;
tg.expand();

let selectedCoin = "";
let selectedRate = 0;

function showPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('step' + pageNumber).classList.add('active');
}

function openSellForm(coinName, rate, min) {
    selectedCoin = coinName;
    selectedRate = rate;
    document.getElementById('formTitle').innerText = "Sell " + coinName;
    document.getElementById('coinAmount').placeholder = "Min: " + min;
    showPage(2);
}

function submitOrder() {
    const amount = document.getElementById('coinAmount').value;
    const username = document.getElementById('senderUsername').value;
    const method = document.getElementById('paymentMethod').value;
    const number = document.getElementById('paymentNumber').value;
    const btn = document.getElementById('submitBtn');

    if (!amount || !username || !number) {
        tg.showAlert("দয়া করে সব তথ্য পূরণ করুন!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Sending...";

    const data = {
        coin: selectedCoin,
        amount: amount,
        rate: selectedRate,
        total: (amount * selectedRate).toFixed(2),
        username: username,
        method: method,
        number: number,
        user_id: tg.initDataUnsafe?.user?.id || "N/A",
        user_name: tg.initDataUnsafe?.user?.first_name || "N/A"
    };

    // আপনার গুগল শিট বা এপিআই ইউআরএল এখানে দিন
    fetch('YOUR_GOOGLE_SCRIPT_URL_HERE', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(res => {
        tg.showAlert("✅ অর্ডার সফল হয়েছে!");
        tg.close();
    })
    .catch(err => {
        tg.showAlert("অর্ডার সেভ হয়েছে (ম্যাসেজটি ইনোর করুন)");
        tg.close();
    });
}
