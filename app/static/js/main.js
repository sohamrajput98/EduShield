async function analyzeEmail() {
    const text = document.getElementById("emailText").value;
    const fileInput = document.getElementById("emailFile");
    const telemetry = document.getElementById("telemetry");
    const badge = document.getElementById("labelBadge");
    const circle = document.getElementById("circleProgress");
    const resultArea = document.getElementById("resultArea");
    const reasonsList = document.getElementById("reasons");
    const bars = document.querySelectorAll(".bar");

    telemetry.innerHTML += "<br>> ALLOCATING_AMD_THREADS...";
    
    let formData = new FormData();
    if (text) formData.append("email_content", text);
    if (fileInput.files.length > 0) formData.append("email_file", fileInput.files[0]);

    try {
        const response = await fetch("/analyze", { method: "POST", body: formData });
        const data = await response.json(); 

        // 1. DATA PARSING
        const score = data.risk_score; // e.g., 47.4
        const label = data.label;      // e.g., "Suspicious"
        const reasons = data.reasons;  // e.g., ["High ML..."]

        // 2. STYLE MAPPING
        let statusClass = "text-safe";
        let borderClass = "border-safe";
        let barColor = "var(--safe-green)";

        if (label === "Phishing") {
            statusClass = "text-phishing";
            borderClass = "border-phishing";
            barColor = "var(--amd-red)";
        } else if (label === "Suspicious") {
            statusClass = "text-suspicious";
            borderClass = "border-suspicious";
            barColor = "var(--warning-orange)";
        }

        // 3. APPLY UI UPDATES
        resultArea.classList.remove("hidden");
        badge.innerText = label.toUpperCase();
        badge.className = "status-badge " + statusClass;
        
        circle.style.stroke = barColor;
        document.getElementById("attackType").innerText = label === "Safe" ? "CLEAN_STREAM" : "THREAT_DETECTED";
        document.getElementById("attackType").className = "class-text " + statusClass;

        // Animate Bars
        bars.forEach(bar => {
            bar.style.background = barColor;
            bar.style.height = Math.random() * 80 + 20 + "%";
        });

        // Score Counter
        let current = 0;
        let itvl = setInterval(() => {
            current += score / 20;
            if (current >= score) {
                current = score;
                clearInterval(itvl);
            }
            document.getElementById("riskScore").textContent = current.toFixed(1) + "%";
            circle.setAttribute("stroke-dasharray", `${current}, 100`);
        }, 30);

        // Populate Reasons
        reasonsList.innerHTML = "";
        reasons.forEach(r => {
            const li = document.createElement("li");
            li.style.cssText = `font-size: 0.8rem; padding: 10px; border-left: 2px solid ${barColor}; background: #000; margin-bottom: 5px;`;
            li.innerHTML = `> ${r}`;
            reasonsList.appendChild(li);
        });

        telemetry.innerHTML += `<br>> INFERENCE_COMPLETE: ${label}`;

    } catch (e) {
        telemetry.innerHTML += "<br>> CORE_ERROR: OFFLINE";
    }
}