async function analyzeEmail() {
    let text = document.getElementById("emailText").value;
    let fileInput = document.getElementById("emailFile");
    let loading = document.getElementById("loading");
    let result = document.getElementById("result");

    loading.classList.remove("hidden");
    result.classList.add("hidden");

    let formData = new FormData();
    if (text) formData.append("email_content", text);
    if (fileInput.files.length > 0) formData.append("email_file", fileInput.files[0]);

    try {
        let response = await fetch("/analyze", { method: "POST", body: formData });
        let data = await response.json();
        console.log("Backend Data:", data);

        loading.classList.add("hidden");
        result.classList.remove("hidden");

        const score = parseFloat(data.risk_score) || 0;
        document.getElementById("riskScore").textContent = score.toFixed(2) + "%";

        const circle = document.getElementById("circleProgress");
        circle.setAttribute("stroke-dasharray", `${score}, 100`);

        let color = "#00ff9d";
        if (score > 40) color = "#ff9d00";
        if (score > 70) color = "#ff4b2b";
        circle.style.stroke = color;

        let badge = document.getElementById("labelBadge");
        badge.innerText = data.label;
        badge.style.backgroundColor = color;
        badge.style.color = (score > 40 && score < 70) ? "black" : "white";

        document.getElementById("attackType").innerText =
            data.label === "Phishing" ? "Credential Theft Detected" :
            data.label === "Suspicious" ? "Anomalous Pattern" : "No Threats Found";
        let categoryBox = document.getElementById("emailCategory");

        if (data.label === "Safe" && data.category) {
            categoryBox.innerHTML = `📩 ${data.category}`;
            categoryBox.style.display = "block";
        } else {
            categoryBox.style.display = "none";
        }
    
        let reasonsList = document.getElementById("reasons");
        reasonsList.innerHTML = "";
        if (data.reasons) {
            data.reasons.forEach(r => {
                let li = document.createElement("li");
                li.innerHTML = `<span style="color:${color}">•</span> ${r}`;
                reasonsList.appendChild(li);
            });
        }
    } catch (err) {
        loading.classList.add("hidden");
        alert("System offline. Check backend.");
    }
}