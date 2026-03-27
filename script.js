const tg = window.Telegram.WebApp;
tg.expand();

let currentCoin = { name: "", rate: 0, limit: 0 };

function openSellForm(name, rate, limit, targetId) {
    currentCoin = { name, rate, limit }; 
    document.getElementById('formTitle').innerText = "Sell " + name;
    document.getElementById('copyTargetId').innerText = targetId;
    showPage(2);
}

function showReview() {
    const amt = document.getElementById('coinAmount').value;
    const user = document.getElementById('senderUsername').value;
    const method = document.getElementById('paymentMethod').value;
    const num = document.getElementById('walletNumber').value;

    if(!amt || !user || !num) {
        tg.showAlert("Please fill all fields!");
        return;
    }

    // সঠিক ক্যালকুলেশন (পরিমাণ / ১০০০ * রেট)
    const totalEarnings = (amt / 1000) * currentCoin.rate;

    document.getElementById('revCoin').innerText = currentCoin.name;
    document.getElementById('revAmount').innerText = amt;
    document.getElementById('revSender').innerText = user;
    document.getElementById('revMethod').innerText = method;
    document.getElementById('revNumber').innerText = num;
    document.getElementById('revTotal').innerText = totalEarnings.toFixed(2) + " ৳";

    showPage(3);
}

function finalSubmit() {
    const btn = document.getElementById('submitBtn');
    btn.innerText = "Sending...";
    btn.disabled = true;

    // আপনার অ্যাপস স্ক্রিপ্ট URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxFKoxWfTiKhwtoAmOd13cOB9LSPAwLK1CrcTKYZjnaJV5wcBaLbtd_Jjsxz23dQjcj9w/exec';

    const data = {
        tgId: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "N/A",
        coinType: currentCoin.name,
        senderUsername: document.getElementById('senderUsername').value,
        amount: document.getElementById('coinAmount').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        paymentNumber: document.getElementById('walletNumber').value
    };

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    }).then(() => {
        tg.showAlert("অর্ডারটি শিটে জমা হয়েছে!");
        tg.close();
    }).catch(() => {
        tg.showAlert("Error!");
        btn.disabled = false;
        btn.innerText = "Confirm & Submit ✓";
    });
}

function showPage(num) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('step' + num).classList.add('active');
}

function goBack(num) { showPage(num); }

function copyId() {
    const id = document.getElementById('copyTargetId').innerText;
    navigator.clipboard.writeText(id);
    tg.showAlert("Copied: " + id);
}
