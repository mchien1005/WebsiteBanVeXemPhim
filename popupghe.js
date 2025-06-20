
    // Seat data - 0: available, 1: selected, 2: occupied, 3: vip
    const seatData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // A row
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // B row
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // C row
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0], // D row (some occupied)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // E row
        [0, 0, 0, 2, 2, 2, 0, 0, 0, 0], // F row (some occupied)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // G row
    ];

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    let selectedSeats = [];
    let timeLeft = 300; // 5 minutes in seconds

    function initializeSeats() {
        const seatsGrid = document.getElementById('seatsGrid');
        seatsGrid.innerHTML = '';

        seatData.forEach((row, rowIndex) => {
            row.forEach((seatStatus, seatIndex) => {
                const seat = document.createElement('div');
                const seatImg = document.createElement('img');
                seatImg.className = 'seat-img';
                const seatNumber = seatIndex + 1;
                const seatId = `${rows[rowIndex]}${seatNumber}`;

                seat.className = 'seat';
                seat.dataset.seatId = seatId;
                seat.dataset.row = rowIndex;
                seat.dataset.seat = seatIndex;

                switch (seatStatus) {
                    case 0: // Ghế trống
                        seat.classList.add('available');
                        seatImg.src = 'icons/ghe.svg';
                        break;
                    case 1: // Ghế đang chọn
                        seat.classList.add('selected');
                        seatImg.src = 'icons/ghedachon.svg';
                        selectedSeats.push(seatId);
                        break;
                    case 2: // Ghế đã bán
                        seat.classList.add('occupied');
                        seatImg.src = 'icons/ghedaban.svg';
                        break;
                    case 3: // Ghế đang được giữ (VIP hoặc đang giữ)
                        seat.classList.add('vip');
                        seatImg.src = 'icons/ghedanggiu.svg';
                        break;
                }

                // Add seat number overlay
                const seatLabel = document.createElement('span');
                seatLabel.textContent = seatId;
                seatLabel.style.position = 'absolute';
                seatLabel.style.fontSize = '9px';
                seatLabel.style.fontWeight = 'bold';
                seatLabel.style.color = 'black';  // <-- màu chữ đen
                seatLabel.style.top = '30%';
                seatLabel.style.left = '50%';
                seatLabel.style.transform = 'translate(-50%, -50%)';
                seatLabel.style.zIndex = '10';


                // Add click event
                seat.addEventListener('click', handleSeatClick);

                seat.appendChild(seatImg);
                seat.appendChild(seatLabel);
                seatsGrid.appendChild(seat);
            });
        });

        updateSelectedSeatsDisplay();
    }

    function handleSeatClick(event) {
        const seat = event.currentTarget;
        const seatId = seat.dataset.seatId;
        const row = parseInt(seat.dataset.row);
        const seatIndex = parseInt(seat.dataset.seat);
        const seatImg = seat.querySelector('.seat-img'); // 💥 Quan trọng: lấy lại thẻ <img>

        const seatImages = {
            available: 'icons/ghe.svg',
            selected: 'icons/ghechon.svg',
            occupied: 'icons/ghedaban.svg',
            vip: 'icons/ghedanggiu.svg'
        };

        // Không cho chọn ghế đã bán
        if (seat.classList.contains('occupied')) {
            document.getElementById('seatOccupiedPopup').style.display = "flex";
            return;
        }

        // Toggle seat selection
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            if (seat.classList.contains('vip')) {
                seat.classList.add('vip');
                seatImg.src = seatImages.vip; // Quay về ảnh ghế VIP
                seatData[row][seatIndex] = 3;
            } else {
                seat.classList.add('available');
                seatImg.src = seatImages.available; // Quay về ảnh ghế thường
                seatData[row][seatIndex] = 0;
            }
            selectedSeats = selectedSeats.filter(s => s !== seatId);
        } else {
            seat.classList.remove('available', 'vip');
            seat.classList.add('selected');
            seatImg.src = seatImages.selected; // Chọn ảnh ghế đang chọn
            seatData[row][seatIndex] = 1;
            selectedSeats.push(seatId);
        }

        updateSelectedSeatsDisplay();
    }

    function updateSelectedSeatsDisplay() {
        const selectedSeatsElement = document.getElementById('selectedSeats');
        selectedSeatsElement.textContent = selectedSeats.length > 0 ? selectedSeats.join(', ') : '-';
    }

    function startTimer() {
        const timerElement = document.getElementById('timer');

        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                showTimeoutPopup();
                return;
            }

            timeLeft--;
            timeoutId = setTimeout(updateTimer, 1000);
        };

        updateTimer();
    }

    // Event listeners
    // document.querySelector('.close-btn').addEventListener('click', () => {
    //     alert('Đóng popup');
    // });

    // document.querySelector('.back-arrow').addEventListener('click', () => {
    //     alert('Quay lại');
    // });

    document.getElementById('bookButton').addEventListener('click', () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ghế!');
            return;
        }
        // alert(`Xác nhận đặt ghế: ${selectedSeats.join(', ')}`);
        processBooking();
    });

    // Initialize the app
    // initializeSeats();
    // startTimer();
    function showTimeoutPopup() {
        document.getElementById("timeoutPopup").style.display = "flex";
      }
      
      function closePopup(id) {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      }
      
      // Khi người dùng nhấn "Xác nhận"
      function handleTimeoutConfirm() {
        closePopup("timeoutPopup");
        document.getElementById("popup-container").innerHTML = ""; // Đóng popup ghế
        timeLeft = 300;
        clearTimeout(timeoutId);
      }
      
      document.getElementById("bookButton").addEventListener("click", () => {
        if (selectedSeats.length === 0) {
        //   alert("Vui lòng chọn ghế!");
          return;
        }
      
        // Ẩn popup chọn ghế
        document.getElementById("popup-container").innerHTML = "";
      
        // Gọi popup thanh toán
        showPaymentPopup();
      });
      
// Hiển thị thông báo lỗi hệ thống
function showSystemErrorPopup() {
    document.getElementById("systemErrorPopup").style.display = "flex";
  }
  
  // Xử lý khi có lỗi hệ thống
  function handleSystemError() {
    showSystemErrorPopup();
    // Có thể thêm các hành động khác khi xảy ra lỗi như log lỗi
  }
  
  // Hàm mô phỏng đặt vé với khả năng xảy ra lỗi
  function processBooking() {
    // Hiển thị loading nếu cần
    
    try {
      // Mô phỏng xử lý đặt vé với 20% khả năng lỗi
      if (Math.random() < 0.2) {
        // Mô phỏng lỗi hệ thống
        throw new Error("Simulated system error");
      }
      
      // Nếu không có lỗi, tiến hành đặt vé thành công
      document.getElementById("popup-container").innerHTML = "";
      showPaymentPopup();
    } catch (error) {
      console.error("Lỗi khi đặt vé:", error);
      handleSystemError();
    }
  }