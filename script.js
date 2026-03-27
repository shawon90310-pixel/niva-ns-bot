const tg = window.Telegram.WebApp;
tg.expand();

let currentCoin = { name: "", rate: 0, limit: 0 };

// ১. কয়েন সিলেক্ট করলে এই ফাংশনটি কল হবে
function openSellForm(name, rate, limit, targetId) {
    currentCoin = { name, rate, limit }; // এখানে বর্তমান কয়েনের তথ্য সেভ হচ্ছে
    document.getElementById('formTitle').innerText = "Sell " + name;
    document.getElementById('copyTargetId').innerText = targetId;
    document.getElementById('minLimitLabel').innerText = limit.toLocaleString();
    
    showPage(2);
}

// ২. ক্যালকুলেশন ফাংশন
function liveCalc() {
    const amt = document.getElementById('coinAmount').value || 0;
    const total = amt * currentCoin.rate;
    // যদি আপনার HTML-এ liveTotal আইডি থাকে তবে এটি কাজ করবে
    if(document.getElementById('liveTotal')) {
        document.getElementById('liveTotal').innerText = total.toFixed(2);
    }
}

// ৩. Next Step ক্লিক করলে রিভিউ দেখানোর ফাংশন (এটি আপনার সমস্যার সমাধান করবে)
function showReview() {
    const amt = document.getElementById('coinAmount').value;
    const user = document.getElementById('senderUsername').value;
    const method = document.getElementById('paymentMethod').value;
    const num = document.getElementById('walletNumber').value;

    if(!amt || !user || !num) {
        tg.showAlert("দয়া করে সব তথ্য পূরণ করুন!");
        return;
    }

    if(parseInt(amt) < currentCoin.limit) {
        tg.showAlert("সর্বনিম্ন সীমা " + currentCoin.limit);
        return;
    }

    // রিভিউ বক্সে তথ্যগুলো বসানো হচ্ছে
    document.getElementById('revCoin').innerText = currentCoin.name;
    document.getElementById('revAmount').innerText = amt;
    document.getElementById('revSender').innerText = user;
    document.getElementById('revMethod').innerText = method;
    document.getElementById('revNumber').innerText = num;
    document.getElementById('revTotal').innerText = (amt * currentCoin.rate).toFixed(2) + " ৳";

    showPage(3); // রিভিউ পেজ ওপেন হবে
}

// ৪. গুগল শিটে ডাটা পাঠানোর ফাংশন
function finalSubmit() {
    const btn = document.getElementById('submitBtn');
    btn.innerText = "Sending...";
    btn.disabled = true;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxFKoxWfTiKhwtoAmOd13cOB9LSPAwLK1CrcTKYZjnaJV5wcBaLbtd_Jjsxz23dQjcj9w/exec';

    const data = {
        tgId: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "N/A",
        coinType: currentCoin.name,
        amount: document.getElementById('coinAmount').value,
        senderId: document.getElementById('senderUsername').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        paymentNumber: document.getElementById('walletNumber').value
    };

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data)
    }).then(() => {
        tg.showConfirm("আপনার রিকোয়েস্ট জমা হয়েছে!", function() {
            tg.close();
        });
    }).catch(() => {
        tg.showAlert("Error! Please try again.");
        btn.disabled = false;
        btn.innerText = "Confirm & Submit ✓";
    });
}

// ৫. পেজ নেভিগেশন
function showPage(num) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('step' + num).classList.add('active');
}

function goBack(num) { showPage(num); }

function copyId() {
    const id = document.getElementById('copyTargetId').innerText;
    navigator.clipboard.writeText(id);
    tg.showAlert("ID Copied: " + id);
}
