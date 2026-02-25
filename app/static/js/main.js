async function analyzeEmail(){
    let text = document.getElementById("emailText").value;
    let fileInput = document.getElementById("emailFile");
    let loading = document.getElementById("loading");
    let result = document.getElementById("result");

    loading.classList.remove("hidden");
    result.classList.add("hidden");

    let formData = new FormData();
    if(text) formData.append("email_content", text);
    if(fileInput.files.length > 0) formData.append("email_file", fileInput.files[0]);

    try {
        let response = await fetch("/analyze", { method: "POST", body: formData });
        let data = await response.json();

        loading.classList.add("hidden");
        result.classList.remove("hidden");

        // UI UPDATE 1: Risk Score & Gauge
        const score = data.risk_score || 0;
        document.getElementById("riskScore").innerText = score + "%";
        const circle = document.getElementById("circleProgress");
        circle.setAttribute("stroke-dasharray", `${score}, 100`);

        // UI UPDATE 2: Color Logic
        let color = "#00ff9d"; // Safe
        if(score > 40) color = "#ff9d00"; // Suspicious
        if(score > 70) color = "#ff4b2b"; // Phishing
        circle.style.stroke = color;

        // UI UPDATE 3: Badge & Classification
        let badge = document.getElementById("labelBadge");
        badge.innerText = data.label;
        badge.style.backgroundColor = color;
        badge.style.color = (score > 40 && score < 70) ? "black" : "white";

        document.getElementById("attackType").innerText = 
            data.label === "Phishing" ? "Credential Theft Detected" : 
            data.label === "Suspicious" ? "Anomalous Pattern" : "No Threats Found";

        // UI UPDATE 4: Reasons List
        let reasonsList = document.getElementById("reasons");
        reasonsList.innerHTML = "";
        if(data.reasons){
            data.reasons.forEach(r => {
                let li = document.createElement("li");
                li.innerHTML = `<span style="color:${color}">•</span> ${r}`;
                reasonsList.appendChild(li);
            });
        }
    } catch(err) {
        loading.classList.add("hidden");
        alert("System offline. Check backend.");
    }
}