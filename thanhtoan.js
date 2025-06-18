function initializeThanhToanUI() {
    const paymentMethod = document.getElementById('paymentMethod');
    const paymentContent = document.getElementById('paymentContent');
    const qrContent = document.getElementById('qrContent');
    const bankList = document.getElementById('bankList');
    const formThanhToan = document.getElementById('formThanhToan');
    const theQuocTeForm = document.getElementById('theQuocTeForm');
    const txtTenNganHang = document.getElementById('txtTenNganHang');
    const searchContainer = document.querySelector('.search-input-container');
    const searchInput = searchContainer?.querySelector('input');

    const qrTopLeftTitle = document.getElementById('qrTopLeftTitle');
    const qrInstruction = document.getElementById('qrInstruction');
    const qrImage = document.getElementById('qrImage');
    const qrAppInstruction = document.getElementById('qrAppInstruction');
    const qrLogoImage = document.getElementById('qrLogoImage');

    if (!paymentMethod) return;

    paymentMethod.addEventListener('change', function () {
        const method = this.value;

        paymentContent.classList.add('d-none');
        qrContent.classList.add('d-none');
        bankList.classList.add('d-none');
        formThanhToan.classList.add('d-none');
        searchContainer.classList.add('d-none');
        theQuocTeForm.classList.add('d-none');

        if (method === 'atm') {
            paymentContent.classList.remove('d-none');
            bankList.classList.remove('d-none');
            searchContainer.classList.remove('d-none');
        } else if (method === 'qr' || method === 'momo') {
            qrContent.classList.remove('d-none');

            if (method === 'qr') {
                qrTopLeftTitle.textContent = 'Thanh toán qua mã QR';
                qrInstruction.textContent = 'Quét mã để thanh toán - Rạp phim CABA';
                qrImage.src = 'images/anhqr.png';
                qrAppInstruction.innerHTML = 'Sử dụng ứng dụng hỗ trợ <b>QR Code</b> để quét mã.';
                qrLogoImage.src = 'images/QRCODE.png';
            } else {
                qrTopLeftTitle.textContent = 'Thanh toán qua MOMO';
                qrInstruction.textContent = 'Quét mã để thanh toán - Rạp phim CABA';
                qrImage.src = 'images/qrmomo.webp';
                qrAppInstruction.innerHTML = 'Sử dụng App <b>MoMo</b> hoặc <br />ứng dụng Camera hỗ trợ QR code để quét mã.';
                qrLogoImage.src = 'images/MOMO.png';
            }
        } else if (method === 'visa') {
            theQuocTeForm.classList.remove('d-none');
        }
    });

    const bankButtons = document.querySelectorAll('#bankList .btn-bank');
    bankButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bankName = button.querySelector('img').alt;
            txtTenNganHang.value = bankName;

            bankList.classList.add('d-none');
            searchContainer.classList.add('d-none');
            formThanhToan.classList.remove('d-none');
            formThanhToan.scrollIntoView({ behavior: 'smooth' });
        });
    });

    searchInput?.addEventListener('input', () => {
        const keyword = searchInput.value.toLowerCase();
        const banks = document.querySelectorAll('#bankList .col');
        banks.forEach(col => {
            const altText = col.querySelector('img').alt.toLowerCase();
            col.style.display = altText.includes(keyword) ? 'block' : 'none';
        });
    });

    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', () => {
            paymentContent.classList.add('d-none');
            bankList.classList.add('d-none');
            searchContainer.classList.add('d-none');
            formThanhToan.classList.add('d-none');
            theQuocTeForm.classList.add('d-none');
            qrContent.classList.add('d-none');

            paymentMethod.value = 'atm';
            paymentContent.classList.remove('d-none');
            bankList.classList.remove('d-none');
            searchContainer.classList.remove('d-none');
        });
    });

    setupValidation();
    startCountdown();
}

function openPopup(popupId) {
    document.getElementById(popupId).style.display = "flex";
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
}

function openConfirmPopup() {
    document.getElementById("confirmPopup").style.display = "flex";
}

function closeConfirmPopup() {
    document.getElementById("confirmPopup").style.display = "none";
}

function handleConfirm() {
    closeConfirmPopup();
    document.querySelector('#successPopup .confirm-body p').textContent = "Thanh toán vé thành công!";
    openPopup('successPopup');
}

function showSuccessPopup() {
    openPopup("successPopup");
}

function startCountdown() {
    let minutes = 5;
    let seconds = 0;
    const countdownEl = document.getElementById("countdown");

    const timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                openPopup('failPopup');
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        const formatted =
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds);
        countdownEl.innerText = formatted;
    }, 1000);
}

function setupValidation() {
    const btnTiepTuc = document.getElementById("btnTiepTuc");
    if (btnTiepTuc) {
        btnTiepTuc.addEventListener("click", function (e) {
            e.preventDefault();
            if (validateATMForm()) openConfirmPopup();
        });
    }

    const formATM = document.getElementById("atmForm");
    if (formATM) {
        formATM.querySelectorAll(".form-control").forEach(input => {
            input.addEventListener("input", validateATMForm);
        });
    }

    const btnTiepTucQT = document.getElementById("btnTiepTucQT");
    if (btnTiepTucQT) {
        btnTiepTucQT.addEventListener("click", function (e) {
            e.preventDefault();
            if (validateQTForm()) openConfirmPopup();
        });
    }

    const formQT = document.getElementById("formTheQuocTe");
    if (formQT) {
        formQT.querySelectorAll(".form-control").forEach(input => {
            input.addEventListener("input", validateQTForm);
        });
    }
}

// ================= FORM THANH TOÁN ATM =================
function validateATMForm() {
    let valid = true;

    const soThe = document.getElementById("txtSoThe").value.trim();
    const errSoThe = document.getElementById("errSoThe");
    const checkSoThe = document.getElementById("checkSoThe");
    if (!/^\d{12,19}$/.test(soThe)) {
        errSoThe.textContent = "Rỗng hoặc sai định dạng số thẻ (không phải số, độ dài không hợp lệ)";
        checkSoThe.style.display = "none";
        valid = false;
    } else {
        errSoThe.textContent = "";
        checkSoThe.style.display = "inline";
    }

    const ph = document.getElementById("txtPhatHanh").value.trim();
    const errPh = document.getElementById("errPhatHanh");
    const checkPh = document.getElementById("checkPhatHanh");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(ph)) {
        errPh.textContent = "Tháng/Năm phát hành sai định dạng (không đúng MM/YY)";
        checkPh.style.display = "none";
        valid = false;
    } else {
        errPh.textContent = "";
        checkPh.style.display = "inline";
    }

    const pin = document.getElementById("txtPin").value.trim();
    const errPin = document.getElementById("errPin");
    const checkPin = document.getElementById("checkPin");
    if (!/^\d{3,6}$/.test(pin)) {
        errPin.textContent = "Mã PIN rỗng, không phải số hoặc sai độ dài";
        checkPin.style.display = "none";
        valid = false;
    } else {
        errPin.textContent = "";
        checkPin.style.display = "inline";
    }

    const hh = document.getElementById("txtHetHan").value.trim();
    const errHH = document.getElementById("errHetHan");
    const checkHH = document.getElementById("checkHetHan");
    let isExpired = true;
    if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(hh)) {
        const [mm, yy] = hh.split("/").map(Number);
        const expiry = new Date(2000 + yy, mm);
        const now = new Date();
        isExpired = expiry <= now;
    }
    if (isExpired) {
        errHH.textContent = "Ngày hết hạn sai định dạng hoặc đã hết hạn";
        checkHH.style.display = "none";
        valid = false;
    } else {
        errHH.textContent = "";
        checkHH.style.display = "inline";
    }

    const ten = document.getElementById("txtTenChuThe").value.trim();
    const errTen = document.getElementById("errTenChuThe");
    const checkTen = document.getElementById("checkTenChuThe");
    if (!/^[A-Z\s]+$/.test(ten)) {
        errTen.textContent = "Tên chủ thẻ phải viết IN HOA, không dấu, không chứa số hoặc ký tự đặc biệt";
        checkTen.style.display = "none";
        valid = false;
    } else {
        errTen.textContent = "";
        checkTen.style.display = "inline";
    }

    return valid;
}

// ================= FORM THANH TOÁN THẺ QUỐC TẾ =================
function validateQTForm() {
    let valid = true;

    const soThe = document.getElementById("txtSoTheQT").value.trim();
    const errSoThe = document.getElementById("errSoTheQT");
    const checkSoThe = document.getElementById("checkSoTheQT");
    if (!/^\d{12,19}$/.test(soThe)) {
        errSoThe.textContent = "Rỗng hoặc sai định dạng số thẻ (không phải số, độ dài không hợp lệ)";
        checkSoThe.style.display = "none";
        valid = false;
    } else {
        errSoThe.textContent = "";
        checkSoThe.style.display = "inline";
    }
    
    const hh = document.getElementById("txtHetHanQT").value.trim();
    const errHH = document.getElementById("errHetHanQT");
    const checkHH = document.getElementById("checkHetHanQT");
    let isExpired = true;
    if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(hh)) {
        const [mm, yy] = hh.split("/").map(Number);
        const expiry = new Date(2000 + yy, mm); // mm là tháng kế tiếp
        const now = new Date();
        isExpired = expiry <= now;
    }
    if (isExpired) {
        errHH.textContent = "Ngày hết hạn sai định dạng hoặc đã hết hạn";
        checkHH.style.display = "none";
        valid = false;
    } else {
        errHH.textContent = "";
        checkHH.style.display = "inline";
    }
    
    const pin = document.getElementById("txtPinQT").value.trim();
    const errPin = document.getElementById("errPinQT");
    const checkPin = document.getElementById("checkPinQT");
    if (!/^\d{3,6}$/.test(pin)) {
        errPin.textContent = "Mã PIN rỗng, không phải số hoặc sai độ dài";
        checkPin.style.display = "none";
        valid = false;
    } else {
        errPin.textContent = "";
        checkPin.style.display = "inline";
    }
    
    const ten = document.getElementById("txtTenChuTheQT").value.trim();
    const errTen = document.getElementById("errTenChuTheQT");
    const checkTen = document.getElementById("checkTenChuTheQT");
    if (!/^[A-Z\s]+$/.test(ten)) {
        errTen.textContent = "Tên chủ thẻ phải viết IN HOA, không dấu, không chứa số hoặc ký tự đặc biệt";
        checkTen.style.display = "none";
        valid = false;
    } else {
        errTen.textContent = "";
        checkTen.style.display = "inline";
    }
    
    return valid;
}

// Đảm bảo DOM đã load xong
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem popup thanh toán có được load không
    if (document.getElementById('payment-popup')) {
        initializeThanhToanUI();
    }
});