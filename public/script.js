function checkBalance() {
    const registerNumber = document.getElementById("registerNumber").value;
    const distance = parseFloat(document.getElementById("distance").value);
    const resultElement = document.getElementById("result");

    if (!registerNumber || isNaN(distance) || distance > 10) {
        resultElement.innerText = "❌ Invalid input. Max distance: 10 km.";
        resultElement.style.color = "red";
        return;
    }

    fetch("http://localhost:5000/checkBalance", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registerNumber, distance })
    })
    .then(response => response.json())
    .then(data => {
        resultElement.innerText = data.message;
        resultElement.style.color = "green";
    })
    .catch(error => {
        console.error("Error:", error);
        resultElement.innerText = "⚠️ Server error! Try again.";
        resultElement.style.color = "red";
    });
}
