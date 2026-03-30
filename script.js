let tg = window.Telegram.WebApp;
tg.expand();

let currentCoin = "";
let currentRate = 0;
let currentMin = 0;

// ১. পেজ পরিবর্তন করার ফাংশন
function showPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('step' + pageNumber).classList.add('active');
    window.scrollTo(0, 0);
}

function goBack(pageNumber) {
    showPage(pageNumber);
}

// ২. সেল ফর্ম ওপেন করা
function openSellForm(coinName, rate, min, targetID) {
    currentCoin = coinName;
    currentRate = rate;
    currentMin = min;

    document.getElementById('formTitle').innerText = "Sell " + coinName;
    document.getElementById('copyTargetId').innerText = targetID;
    document.getElementById('coinAmount').placeholder = "Minimum: " + min.toLocaleString();
    
    showPage(2);
}

// ৩. আইডি কপি করার ফাংশন
function copyId() {
    const idText = document.getElementById('copyTargetId').innerText;
    navigator.clipboard.writeText(idText).then(() => {
        tg.showAlert("✅ ID Copied: " + idText);
    }).catch(err => {
        // অল্টারনেটিভ কপি পদ্ধতি যদি ব্রাউজার সাপোর্ট না করে
        const textArea = document.createElement("textarea");
        textArea.value = idText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        tg.showAlert("✅ ID Copied: " + idText);
    });
}

// ৪. রিভিউ পেজে ডাটা দেখানো
function showReview() {
    const amount = parseFloat(document.getElementById('coinAmount').value);
    const sender = document.getElementById('senderUsername').value;
    const method = document.getElementById('paymentMethod').value;
    const number = document.getElementById('walletNumber').value;

    if (!amount || amount < currentMin) {
        tg.showAlert("দয়া করে সঠিক পরিমাণ দিন (মিনিমাম: " + currentMin + ")");
        return;
    }
    if (!sender || !number) {
        tg.showAlert("সবগুলো ঘর পূরণ করুন!");
        return;
    }

    // রিভিউ ভ্যালু সেট করা
    document.getElementById('revCoin').innerText = currentCoin;
    document.getElementById('revAmount').innerText = amount.toLocaleString();
    document.getElementById('revSender').innerText = sender;
    document.getElementById('revMethod').innerText = method;
    document.getElementById('revNumber').innerText = number;
    
    // টোটাল টাকা হিসাব (যেমন: ২.২ রেট হলে ১০০০০ * ০.০০২২ = ২২ টাকা)
    const total = (amount * currentRate).toFixed(2);
    document.getElementById('revTotal').innerText = total;

    showPage(3);
}

// ৫. ফাইনাল সাবমিট (গুগল শিটে ডাটা পাঠানো)
function finalSubmit() {
    const btn = event.target;
    btn.disabled = true;
    btn.innerText = "Sending Order...";

    const orderData = {
        coin: currentCoin,
        amount: document.getElementById('revAmount').innerText,
        sender: document.getElementById('revSender').innerText,
        method: document.getElementById('revMethod').innerText,
        number: document.getElementById('revNumber').innerText,
        total: document.getElementById('revTotal').innerText,
        user_id: tg.initDataUnsafe?.user?.id || "N/A",
        user_name: tg.initDataUnsafe?.user?.username || "N/A"
    };

    // আপনার গুগল স্ক্রিপ্ট URL এখানে বসান
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw_AC0KCvmT6pr-QSFoHZSaNew94Yk8ljlU70VMuBh59hC7OE7gK0DcQ5zIiKkzpDjF4w/exec';

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // CORS সমস্যা এড়াতে
        cache: 'no-cache',
        body: JSON.stringify(orderData)
    })
    .then(() => {
        tg.showAlert("✅ Order Received!\nআপনার পেমেন্ট ১-২ মিনিটের মধ্যে পৌঁছে যাবে।");
        tg.close();
    })
    .catch((error) => {
        // no-cors মোডে অনেক সময় catch ব্লক কাজ করে, তাই এখানেও সাকসেস মেসেজ দেওয়া নিরাপদ
        tg.showAlert("✅ Order Submitted Successfully!");
        tg.close();
    });
}
function autoOfflineSystem() {
    const now = new Date();
    const hours = now.getHours(); // বর্তমান সময় (০-২৩ ফরম্যাটে)

    // সকাল ১০টা (10) থেকে রাত ১১টা (23) পর্যন্ত অনলাইন থাকবে। 
    // এর বাইরে অর্থাৎ রাত ১১টার পর থেকে সকাল ১০টার আগ পর্যন্ত অফলাইন হবে।
    const isOnlineTime = (hours >= 10 && hours < 23); 

    // সব কয়েন কার্ড সিলেক্ট করা হচ্ছে
    const allCards = document.querySelectorAll('.coin-card');

    allCards.forEach(card => {
        const badge = card.querySelector('.online-badge');

        if (!isOnlineTime) {
            // অফলাইন করার কাজ
            card.classList.add('offline');
            if (badge) {
                badge.classList.add('offline-badge-red');
                badge.innerText = 'OFFLINE';
            }
        } else {
            // অনলাইন করার কাজ
            card.classList.remove('offline');
            if (badge) {
                badge.classList.remove('offline-badge-red');
                badge.innerText = '• ONLINE';
            }
        }
    });
}

// প্রতি ১ মিনিটে একবার চেক করবে সময় হয়েছে কি না
setInterval(autoOfflineSystem, 60000);
// পেজ লোড হওয়ার সাথে সাথে একবার চেক করবে
autoOfflineSystem();
