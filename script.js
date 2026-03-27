const tg = window.Telegram.WebApp;
tg.expand();

let currentCoin = { name: "", rate: 0, limit: 0 };

// ১. ফরম ওপেন করার ফাংশন
function openSellForm(name, rate, limit, targetId) {
    currentCoin = { name, rate, limit }; 
    document.getElementById('formTitle').innerText = "Sell " + name;
    document.getElementById('copyTargetId').innerText = targetId;
    showPage(2);
}

// ২. রিভিউ দেখার ফাংশন (যেখানে ক্যালকুলেশন ঠিক করা হয়েছে)
function showReview() {
    const amt = document.getElementById('coinAmount').value;
    const user = document.getElementById('senderUsername').value;
    const method = document.getElementById('paymentMethod').value;
    const num = document.getElementById('walletNumber').value;

    if(!amt || !user || !num) {
        tg.showAlert("দয়া করে সব ঘর পূরণ করুন!");
        return;
    }

    // ১০০০ কয়েনের রেট অনুযায়ী সঠিক ক্যালকুলেশন
    const totalEarnings = (amt / 1000) * currentCoin.rate;

    document.getElementById('revCoin').innerText = currentCoin.name;
    document.getElementById('revAmount').innerText = amt;
    document.getElementById('revSender').innerText = user;
    document.getElementById('revMethod').innerText = method;
    document.getElementById('revNumber').innerText = num;
    document.getElementById('revTotal').innerText = totalEarnings.toFixed(2) + " ৳";

    showPage(3);
}

// ৩. সাবমিট করার ফাংশন (আপনার নতুন লিঙ্কসহ)
function finalSubmit() {
    const btn = document.getElementById('submitBtn');
    btn.innerText = "Sending...";
    btn.disabled = true;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyfwsDiv2pkO-NAi4z41hacOnKeHEl3ykHR2LGZAPvQbMGYlU7TUxxmGHN_0HXgZkzg/exec';

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
        tg.showAlert("অর্ডারটি সফলভাবে জমা হয়েছে!");
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
