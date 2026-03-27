const tg = window.Telegram.WebApp;
tg.expand();

// ডিফল্ট ভ্যালু
let currentCoin = { name: "Ns coin", rate: 10.50, limit: 10000 };

// ১. এই ফাংশনটি বাটন ক্লিক করলে পেজ বদলাবে
function openSellForm(name, rate, limit, targetId) {
    currentCoin = { 
        name: name, 
        rate: parseFloat(rate), 
        limit: parseInt(limit) 
    }; 
    document.getElementById('formTitle').innerText = "Sell " + name;
    document.getElementById('copyTargetId').innerText = targetId; 
    showPage(2);
}

// ২. রিভিউ পেজে ডাটা দেখানোর ফাংশন
function showReview() {
    const amt = document.getElementById('coinAmount').value;
    const user = document.getElementById('senderUsername').value;
    const method = document.getElementById('paymentMethod').value;
    const num = document.getElementById('walletNumber').value;

    if(!amt || !user || !num) {
        tg.showAlert("দয়া করে সব তথ্য পূরণ করুন!");
        return;
    }

    if(parseInt(amt) < currentCoin.limit) {
        tg.showAlert("সর্বনিম্ন লিমিট " + currentCoin.limit);
        return;
    }

    const totalEarnings = (amt / 1000) * currentCoin.rate;

    document.getElementById('revCoin').innerText = currentCoin.name;
    document.getElementById('revAmount').innerText = amt;
    document.getElementById('revSender').innerText = user;
    document.getElementById('revMethod').innerText = method;
    document.getElementById('revNumber').innerText = num;
    document.getElementById('revTotal').innerText = totalEarnings.toFixed(2) + " ৳";

    showPage(3);
}

// ৩. কপি করার ফাংশন
function copyId() {
    const id = document.getElementById('copyTargetId').innerText;
    navigator.clipboard.writeText(id);
    tg.showAlert("Copied: " + id);
}

// ৪. পেজ নেভিগেশন
function showPage(num) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('step' + num).classList.add('active');
}

function goBack(num) { 
    showPage(num); 
}

// ৫. ফাইনাল সাবমিট (শিটে ডাটা পাঠানোর জন্য)
function finalSubmit() {
    const btn = document.getElementById('submitBtn');
    btn.innerText = "Sending...";
    btn.disabled = true;

    const scriptURL = 'আপনার_গুগল_স্ক্রিপ্ট_লিঙ্ক';

    const data = {
        telegramId: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "N/A",
        coinType: currentCoin.name,
        senderUsername: document.getElementById('senderUsername').value,
        amount: document.getElementById('coinAmount').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        paymentNumber: document.getElementById('walletNumber').value,
        status: "Pending"
    };

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        tg.showAlert("অর্ডার সফল হয়েছে!");
        tg.close();
    }).catch(() => {
        tg.showAlert("ভুল হয়েছে, আবার চেষ্টা করুন।");
        btn.disabled = false;
        btn.innerText = "Confirm & Submit ✓";
    });
}
