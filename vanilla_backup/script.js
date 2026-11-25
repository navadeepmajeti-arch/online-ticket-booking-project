/* ================= DATA ================= */
let selectedSeats = [];
let currentEvent = "";
let currentPrice = 0;

const seatNames = [
    "A1","A2","A3","A4","A5","A6",
    "B1","B2","B3","B4","B5","B6",
    "C1","C2","C3","C4","C5","C6"
];

/* ================= PAGE FUNCTIONS ================= */
function scrollToEvents() {
    document.getElementById("events").scrollIntoView({ behavior: "smooth" });
}

function updateEventCount() {
    let cards = document.querySelectorAll(".event-card");
    let visible = 0;
    cards.forEach(function(card) {
        if (card.style.display !== "none") visible++;
    });
    document.getElementById("eventCount").innerText = visible + " Events";
}

function filterEvents(category) {
    let cards = document.querySelectorAll(".event-card");
    cards.forEach(function(card) {
        if (category === "all" || card.classList.contains(category)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
    updateEventCount();
}

function searchEvents() {
    let text = document.getElementById("searchInput").value.toLowerCase();
    let cards = document.querySelectorAll(".event-card");

    cards.forEach(function(card) {
        let info = card.innerText.toLowerCase();
        card.style.display = info.includes(text) ? "block" : "none";
    });
    updateEventCount();
}

/* ================= LOGIN & SIGNUP ================= */
/* Local Storage is used only for this college project demo. */
function getUsers() {
    return JSON.parse(localStorage.getItem("tixhubUsers")) || [];
}

function signupUser() {
    let name = document.getElementById("signupName").value.trim();
    let email = document.getElementById("signupEmail").value.trim().toLowerCase();
    let password = document.getElementById("signupPassword").value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill all fields.");
        return;
    }

    if (!email.includes("@")) {
        alert("Please enter a valid email.");
        return;
    }

    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    let users = getUsers();

    if (users.some(function(user) { return user.email === email; })) {
        alert("Email is already registered.");
        return;
    }

    users.push({ name: name, email: email, password: password, role: "user" });
    localStorage.setItem("tixhubUsers", JSON.stringify(users));

    alert("Signup successful! Please login.");
    closeSignup();
    showLogin();
}

function loginUser() {
    let email = document.getElementById("loginEmail").value.trim().toLowerCase();
    let password = document.getElementById("loginPassword").value;

    /* Demo admin account */
    if (email === "admin@tixhub.com" && password === "admin123") {
        localStorage.setItem("tixhubCurrentUser", JSON.stringify({
            name: "Admin", email: email, role: "admin"
        }));
        alert("Admin login successful.");
        closeLogin();
        updateLoginUI();
        return;
    }

    let users = getUsers();
    let user = users.find(function(item) {
        return item.email === email && item.password === password;
    });

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    localStorage.setItem("tixhubCurrentUser", JSON.stringify(user));
    alert("Login successful! Welcome " + user.name);
    closeLogin();
    updateLoginUI();
}

function updateLoginUI() {
    let current = JSON.parse(localStorage.getItem("tixhubCurrentUser"));
    let userName = document.getElementById("userName");
    let adminBtn = document.getElementById("adminBtn");
    let logoutBtn = document.getElementById("logoutBtn");

    if (current) {
        userName.innerText = "Hi, " + current.name;
        document.querySelector(".login-btn").style.display = "none";
        document.querySelector(".signup-btn").style.display = "none";
        logoutBtn.style.display = "inline-block";
        adminBtn.style.display = current.role === "admin" ? "inline-block" : "none";
    } else {
        userName.innerText = "";
        document.querySelector(".login-btn").style.display = "inline-block";
        document.querySelector(".signup-btn").style.display = "inline-block";
        logoutBtn.style.display = "none";
        adminBtn.style.display = "none";
    }
}

function logoutUser() {
    localStorage.removeItem("tixhubCurrentUser");
    alert("You have been logged out.");
    updateLoginUI();
}

/* ================= BOOKING ================= */
function openBooking(eventName, price) {
    let current = JSON.parse(localStorage.getItem("tixhubCurrentUser"));

    if (!current) {
        alert("Please login or signup before booking.");
        showLogin();
        return;
    }

    currentEvent = eventName;
    currentPrice = price;
    selectedSeats = [];

    document.getElementById("bookingTitle").innerText = "Book Tickets - " + eventName;
    document.getElementById("bookingPrice").innerText = "Ticket Price: ₹" + price;

    createSeats();
    document.getElementById("bookingModal").style.display = "flex";
}

function createSeats() {
    let container = document.getElementById("seatContainer");
    container.innerHTML = "";

    let booked = JSON.parse(localStorage.getItem("tixhubBookedSeats")) || {};
    let eventBooked = booked[currentEvent] || [];

    seatNames.forEach(function(name) {
        let button = document.createElement("button");
        button.className = "seat";
        button.innerText = name;

        if (eventBooked.includes(name)) {
            button.classList.add("booked");
        } else {
            button.onclick = function() {
                selectSeat(button);
            };
        }

        container.appendChild(button);
    });

    document.getElementById("selectedSeats").innerText = "None";
}

function selectSeat(seat) {
    let seatNumber = seat.innerText;

    if (seat.classList.contains("booked")) return;

    if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
        selectedSeats = selectedSeats.filter(function(item) {
            return item !== seatNumber;
        });
    } else {
        if (selectedSeats.length >= 5) {
            alert("You can select maximum 5 seats.");
            return;
        }
        seat.classList.add("selected");
        selectedSeats.push(seatNumber);
    }

    document.getElementById("selectedSeats").innerText =
        selectedSeats.length === 0 ? "None" : selectedSeats.join(", ");
}

function makePayment() {
    if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    let bookings = JSON.parse(localStorage.getItem("tixhubBookings")) || [];
    let bookedSeats = JSON.parse(localStorage.getItem("tixhubBookedSeats")) || {};

    if (!bookedSeats[currentEvent]) bookedSeats[currentEvent] = [];
    bookedSeats[currentEvent] = bookedSeats[currentEvent].concat(selectedSeats);
    localStorage.setItem("tixhubBookedSeats", JSON.stringify(bookedSeats));

    let bookingId = "TH" + Math.floor(100000 + Math.random() * 900000);
    let total = currentPrice * selectedSeats.length;

    let booking = {
        id: bookingId,
        event: currentEvent,
        seats: selectedSeats,
        total: total,
        email: JSON.parse(localStorage.getItem("tixhubCurrentUser")).email,
        date: new Date().toLocaleString()
    };

    bookings.push(booking);
    localStorage.setItem("tixhubBookings", JSON.stringify(bookings));

    document.getElementById("ticketEvent").innerText = currentEvent;
    document.getElementById("ticketSeats").innerText = selectedSeats.join(", ");
    document.getElementById("ticketId").innerText = bookingId;
    document.getElementById("ticketTotal").innerText = "₹" + total;

    closeBooking();
    document.getElementById("ticketModal").style.display = "flex";
}

function showLogin() {
    document.getElementById("loginModal").style.display = "flex";
}
function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}
function showSignup() {
    document.getElementById("signupModal").style.display = "flex";
}
function closeSignup() {
    document.getElementById("signupModal").style.display = "none";
}
function switchToSignup() {
    closeLogin();
    showSignup();
}
function switchToLogin() {
    closeSignup();
    showLogin();
}
function closeBooking() {
    document.getElementById("bookingModal").style.display = "none";
}
function closeTicket() {
    document.getElementById("ticketModal").style.display = "none";
}

/* ================= ADMIN MODULE ================= */
function showAdmin() {
    let current = JSON.parse(localStorage.getItem("tixhubCurrentUser"));

    if (!current || current.role !== "admin") {
        alert("Only admin can access this module.");
        return;
    }

    let users = getUsers();
    let bookings = JSON.parse(localStorage.getItem("tixhubBookings")) || [];
    let sales = bookings.reduce(function(total, booking) {
        return total + booking.total;
    }, 0);

    document.getElementById("totalUsers").innerText = users.length;
    document.getElementById("totalBookings").innerText = bookings.length;
    document.getElementById("totalSales").innerText = "₹" + sales;

    let promotion = localStorage.getItem("tixhubPromotion");
    document.getElementById("promotionText").innerText =
        promotion ? "Current promotion: " + promotion : "No promotion added.";

    document.getElementById("adminModal").style.display = "flex";
}

function savePromotion() {
    let promo = document.getElementById("promoInput").value.trim();

    if (promo === "") {
        alert("Enter a promotion first.");
        return;
    }

    localStorage.setItem("tixhubPromotion", promo);
    document.getElementById("promotionText").innerText =
        "Current promotion: " + promo;
    alert("Promotion saved.");
}

function closeAdmin() {
    document.getElementById("adminModal").style.display = "none";
}

/* ================= MODAL OUTSIDE CLICK ================= */
window.onclick = function(event) {
    let modals = [
        "bookingModal", "ticketModal", "loginModal",
        "signupModal", "adminModal"
    ];

    modals.forEach(function(id) {
        let modal = document.getElementById(id);
        if (event.target === modal) modal.style.display = "none";
    });
};

/* ================= STARTUP ================= */
updateEventCount();
updateLoginUI();
