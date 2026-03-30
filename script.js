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
    
    // নতুন ডিজাইনের জন্য লিমিট ও রেট টেক্সট আপডেট (যদি ইনপুট থাকে)
    if(document.getElementById('minLimitText')) {
        document.getElementById('minLimitText').innerText = limit.toLocaleString();
    }
    if(document.getElementById('appliedRateText')) {
        document.getElementById('appliedRateText').innerText = rate + "৳";
    }
    
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

    // ক্যালকুলেশন: প্রতি ১০০০ কয়েনের রেট অনুযায়ী
       const totalEarnings = (amt / 1000) * currentCoin.rate;

   document.getElementById('revCoin').innerText = currentCoin.name;
   document.getElementById('revAmount').innerText = amt;
   document.getElementById('revSender').innerText = user;
   document.getElementById('revMethod').innerText = method;
   document.getElementById('revTotal').innerText = totalEarnings.toFixed(2);
   
   showPage(3);
}

// ৩. কপি করার ফাংশন
function copyId() {
    const id = document.getElementById('copyTargetId').innerText;
    navigator.clipboard.writeText(id).then(() => {
        tg.showAlert("Copied: " + id);
    });
}

// ৪. পেজ নেভিগেশন
function showPage(num) {
    // সব পেজ লুকিয়ে ফেলা
    document.querySelectorAll('.page').forEach(p => {
        p.style.display = 'none';
        p.classList.remove('active');
    });

    // নির্দিষ্ট পেজটি দেখানো
    const targetPage = document.getElementById('step' + num);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
        window.scrollTo(0, 0); // পেজ পরিবর্তনের পর একদম উপরে নিয়ে যাবে
    }
}

function goBack(num) {
    // আগের পেজে যাওয়ার সময় বর্তমান পেজ হাইড করা
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    showPage(num);
}

// ৫. ফাইনাল সাবমিট
function finalSubmit() {
    const btn = document.getElementById('submitBtn');
    if(!btn) return;
    
    btn.innerText = "Sending...";
    btn.disabled = true;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxAZuxyFc1gRgeS8yY2PJgUj55aNeVLAyKweQhD7kyfeHFRmHHO9ZpX9fUv8-R6f7zQ/exec';

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
     // ১. আগে অ্যানিমেশন চালু করুন
     startSuccessAnimation(); 

     // ২. মেসেজ দেখান
     tg.showAlert("✅ Order Received!\nExpect your payment within 1-2 minutes.");

     // ৩. ৫ সেকেন্ড পর অটোমেটিক বট বন্ধ হবে (যাতে অ্যানিমেশন দেখা যায়)
     setTimeout(() => {
         tg.close();
     }, 5000); 
 }).catch(() => {
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // বাম এবং ডান দিক থেকে জরি পড়বে
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}
function openSellForm(coinName, rate, min, targetID) {
    // ... আপনার আগের কোড ...
    
    // এই নিচের লাইনটি যোগ করুন যাতে আইডিটি ফর্মে দেখায়
    document.getElementById("copyTargetId").innerText = targetID;
    
       showPage(2);
 }

 // ৭. আইডি কপি করার ফাংশন (এটি যেন নিচে থাকে)
 function copyID() {
    const idText = document.getElementById("copyTargetId").innerText;
    navigator.clipboard.writeText(idText).then(() => {
        tg.showAlert("✅ ID Copied: " + idText);
    });
 }
