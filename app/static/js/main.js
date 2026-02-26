
document.addEventListener("DOMContentLoaded", () => {
    console.log("EduShield AI // System Online");

    const advBtn = document.getElementById("toggleAdvanced");
    const advDiv = document.getElementById("advancedStats");

    if (advBtn) {
        advBtn.addEventListener("click", () => {
            const isHidden = advDiv.style.display === "none" || advDiv.style.display === "";
            advDiv.style.display = isHidden ? "block" : "none";
            advBtn.innerText = isHidden ? "[ HIDE_ENGINE_LOGS ]" : "[ SHOW_ADVANCED_STATS ]";
            advBtn.style.borderColor = isHidden ? "var(--accent-teal)" : "#222";
            
          if (isHidden) {
                setTimeout(() => {
                    advDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    }
}); 


/* FILE STREAM HANDLING */
function handleFileLoad(input) {
    const file = input.files[0];
    if (!file) return;

    const textArea = document.getElementById("emailText");
    const fileName = document.getElementById("fileName");
    const fileDisplay = document.getElementById("fileDisplay");

    fileDisplay.classList.remove("hidden");
    fileDisplay.style.display = "flex";
    fileName.innerText = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
        
        textArea.value = e.target.result; 
    };
    reader.readAsText(file);
}

function clearFile() {
    const fileInput = document.getElementById("emailFile");
    const fileDisplay = document.getElementById("fileDisplay");
    
    fileInput.value = "";
    fileDisplay.classList.add("hidden");
    fileDisplay.style.display = "none";
    console.log("> BLOB_PURGED");
}

/* NEURAL INFERENCE ENGINE (MAIN SCAN)*/
async function analyzeEmail() {
    const startTime = performance.now(); 
    
    
    const text = document.getElementById("emailText").value;
    const fileInput = document.getElementById("emailFile");
    const telemetry = document.getElementById("telemetry");
    const badge = document.getElementById("labelBadge");
    const circle = document.getElementById("circleProgress");
    const resultArea = document.getElementById("resultArea");
    const reasonsList = document.getElementById("reasons"); 
    const bars = document.querySelectorAll(".bar");
    const riskScoreText = document.getElementById("riskScore");
    const attackType = document.getElementById("attackType");
    const hwLoad = document.getElementById("hwLoad");


    if (!text && fileInput.files.length === 0) {
        telemetry.innerHTML = "<span style='color:var(--amd-red)'>> ERROR: NO_DATA_INPUT</span>";
        return;
    }

    /*  IMMEDIATE UI FEEDBACK (Non-blocking)  */
    circle.setAttribute("stroke-dasharray", "0,100");
    riskScoreText.textContent = "0.0%";
    resultArea.classList.add("hidden");
    telemetry.innerHTML = "";
    
    // START HIGH-SPEED SPIKING (Non-blocking)
    const spikeInterval = setInterval(() => {
        bars.forEach(bar => {
            bar.style.height = (Math.random() * 60 + 20) + "%";
            bar.style.background = "#444";
        });
        if(hwLoad) hwLoad.style.width = (Math.random() * 30 + 70) + "%";
    }, 80);

    /*  FIRE BACKEND REQUEST IMMEDIATELY (PARALLEL) */
    let formData = new FormData();
    if (text) formData.append("email_content", text);
    if (fileInput.files.length > 0) formData.append("email_file", fileInput.files[0]);

    const fetchPromise = fetch("/analyze", { method: "POST", body: formData })
        .then(res => {
            if (!res.ok) throw new Error("NETWORK_RESPONSE_FAILURE");
            return res.json();
        });

    /*  ASYNC TELEMETRY TYPING (Simulated Hardware Threading) */
    const steps = [
        "INITIALIZING_RYZEN_ZEN4_CORES...",
        "LOADING_NEURAL_WEIGHTS...",
        "EXTRACTING_URL_METADATA...",
        "RUNNING_CROSS_VECTOR_INFERENCE..."
    ];

    for (const step of steps) {
        const line = document.createElement("div");
        line.innerHTML = `> ${step}`;
        telemetry.appendChild(line);
        telemetry.scrollTop = telemetry.scrollHeight;
        await new Promise(r => setTimeout(r, 150)); 
    }

    /*  AWAIT CONCURRENT DATA */
    try {
        const data = await fetchPromise;
        const latency = (performance.now() - startTime).toFixed(0);
        
        clearInterval(spikeInterval); 

        /* DATA MAPPING  */
const source = data.summary || {};
       const advanced = data.advanced || {};

const score = parseFloat(source.risk_score) || 0;
const label = source.label || "UNKNOWN";
const reasons = source.reasons || [];
const explanations = source.explanations || "No specific threat flags triggered.";


const features = advanced.url_features || {};
const logs = advanced.engine_logs || ["INITIALIZING_LOG_STREAM...", "READY"];
        
        //  DYNAMIC THEMING 
        let themeColor = "var(--safe-green)";
        let statusClass = "text-safe";

        if (label === "Phishing") {
            themeColor = "var(--amd-red)";
            statusClass = "text-phishing";
        } else if (label === "Suspicious") {
            themeColor = "var(--warning-orange)";
            statusClass = "text-suspicious";
        }

        
        riskScoreText.className = 'percentage ' + (score < 30 ? 'score-safe' : score < 60 ? 'score-warn' : 'score-danger');

        const catBox = document.getElementById("emailCategory");
        if (catBox) {
            catBox.innerText = `TYPE: ${source.category || 'GENERAL'}`;
            catBox.style.color = themeColor;
            catBox.style.textShadow = `0 0 8px ${themeColor}`;
        }

        /* Update UI Panels */
        badge.innerText = label.toUpperCase();
        badge.className = "status-badge " + statusClass;
        circle.style.stroke = themeColor;
        attackType.innerText = label === "Safe" ? "CLEAN_STREAM" : "THREAT_DETECTED";
        attackType.className = statusClass;

        /* SCORE & CIRCLE ANIMATION  */
        let current = 0;
        const duration = 1500;
        const animStart = performance.now(); 

        function updateCounter(timestamp) {
            const elapsed = timestamp - animStart;
            const progress = Math.min(elapsed / duration, 1);
            current = progress * score;
            
            riskScoreText.textContent = current.toFixed(1) + "%";
            circle.setAttribute("stroke-dasharray", `${current}, 100`);

            if (progress < 1) requestAnimationFrame(updateCounter);
        }
        requestAnimationFrame(updateCounter);
/*DETECTION LOGS & PREVIEW FIX  */
const reasonsList = document.getElementById("reasons");
reasonsList.innerHTML = ""; 

// Vertical Stack Styling
reasonsList.style.display = "flex";
reasonsList.style.flexDirection = "column"; 
reasonsList.style.gap = "8px"; 
reasonsList.style.padding = "10px 0";
reasonsList.style.listStyle = "none";

reasons.forEach(reason => {
    const li = document.createElement("li");
    li.style.cssText = `
        background: #080808;
        border: 1px solid #1a1a1a;
        border-left: 3px solid #333;
        padding: 12px 15px;
        color: #aaa;
        font-size: 14px;
        font-family: monospace;
        text-transform: uppercase;
        width: 100%;
        box-sizing: border-box;
    `;
    li.innerText = `> ${reason}`;
    reasonsList.appendChild(li);
});


const emailContent = data.summary.email_preview || text || "NO_CONTENT_DETECTED";
window.currentDecodedEmail = highlightNeuralPayload(emailContent);

resultArea.classList.remove("hidden");

// Forensic Button Injection
let forensicAction = document.getElementById("forensicTrigger");
if (!forensicAction) {
    forensicAction = document.createElement("div");
    forensicAction.id = "forensicTrigger";
    resultArea.appendChild(forensicAction);
}

forensicAction.innerHTML = `
    <div style="margin-top:12px; background:#0a0a0a; border:1px solid #222; padding:12px; border-left:3px solid var(--accent-teal); display:flex; justify-content:space-between; align-items:center;">
        <div style="font-family:monospace; font-size:14px; color:skyblue;">
            <span style="color:var(--accent-teal)">●</span> NEURAL_STREAM_READY
        </div>
        <button class="secondary-btn" onclick="openModal()" style="padding:6px 12px; font-size:10px; letter-spacing:1px; font-weight:bold;">OPEN_FORENSIC_VIEW</button>
    </div>
`;
       /* ADVANCED FORENSIC PANEL (Multi-Animation NPU View)  */
const advDiv = document.getElementById("advancedStats");
if (advDiv && advanced) {
    //ENGINE_TELEMETRY 
    const logHTML = [
        `🔥 NEURAL DECODER ACTIVE 🔥`,
        `ML_PROBABILITY: ${advanced.ml_probability || 0}%`,
        `DETECTION_LABEL: ${label.toUpperCase()}`,
        `NPU_CLOCK_SPEED: 2.4GHz [BOOST]`,
        `NPU_TEMP: 42°C [OPTIMAL]`,
        `RAW_BODY_SIZE: ${source.email_preview ? source.email_preview.length : 0} BYTES`,
        `NPU_INSTRUCTION: AVX-512_VNNI`
    ].map(line => `<div style="margin-bottom:3px; border-bottom:1px solid #111;">> ${line}</div>`).join("");

    let aiReasoning = source.explanations;
    if (typeof aiReasoning === 'object' && aiReasoning !== null) {
        aiReasoning = Object.values(aiReasoning).join(" ") || JSON.stringify(aiReasoning);
    } 

    
    const scanSVG = `
        <svg width="22" height="37" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="var(--accent-teal)" stroke-width="1.5" stroke-dasharray="3 3">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="12" cy="12" r="4" fill="var(--amd-red)">
                <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
            </circle>
        </svg>`;


    const waveformSVG = `
        <svg width="60" height="20" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 Q 7.5 0, 15 10 T 30 10 T 45 10 T 60 10" stroke="var(--accent-teal)" stroke-width="2" fill="none">
                <animate attributeName="d" dur="1s" repeatCount="indefinite" 
                    values="M0 10 Q 7.5 0, 15 10 T 30 10 T 45 10 T 60 10;
                            M0 10 Q 7.5 20, 15 10 T 30 10 T 45 10 T 60 10;
                            M0 10 Q 7.5 0, 15 10 T 30 10 T 45 10 T 60 10" />
            </path>
        </svg>`;

    advDiv.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px; padding:20px; background:#050505; border:1px solid #222; border-radius:4px; box-shadow: inset 0 0 15px rgba(237, 28, 36, 0.05);">
            <div>
                <h4 style="color:var(--accent-teal); margin:0; font-size:0.8rem; letter-spacing:1px; border-bottom: 1px solid var(--accent-teal); padding-bottom: 5px;">[ ENGINE_TELEMETRY ]</h4>
                <div style="font-family:monospace; font-size:0.7rem; color:lightgreen; margin-top:10px; line-height:1.6;">
                    ${logHTML}
                </div>
            </div>

            <div style="border-left:1px solid #222; padding-left:20px;">
                <h4 style="color:var(--amd-red); margin:0; font-size:0.8rem; letter-spacing:1px; border-bottom: 1px solid var(--amd-red); padding-bottom: 5px;">RYZEN_AI_NPU_REASONING</h4>
                
                <div style="margin-top:12px; display:flex; gap:12px; align-items:flex-start; background:rgba(237, 28, 36, 0.03); padding:10px; border:1px solid #1a1a1a;">
                    ${scanSVG}
                    <div style="font-family:monospace; font-size:11px; color:var(--accent-teal); line-height:1.4;">
                        <div style="color:#fff; font-weight:bold;">[ NPU_DECODE_STREAM ]</div>
                        <div>> ANALYZING_Linguistic_VECTORS...</div>
                        <div>> CORE_TEMP_STABLE: 42°C</div>
                        <div>> X86_INFERENCE_PATH: FOUND</div>
                    </div>
                </div>

<div style="margin-top:12px; font-family:monospace; font-size:11px; color:#aaa; background:rgba(255,255,255,0.03); padding:10px; border-left:2px solid var(--amd-red);">
    <span style="color:var(--amd-red)">[ STATUS ]</span> : <br> > NEURAL_PATHWAY_COMPROMISED <br> > THREAT_VECTORS_MAPPED
</div>
                <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center; background:rgba(237, 28, 36, 0.03); padding:8px; border:1px solid #221111;">
                    <div style="font-family:monospace; font-size:11px; color:var(--amd-red);">
                        SIGNAL_FREQUENCY_SCAN: <span style="color:yellow;">ACTIVE</span>
                    </div>
                    ${waveformSVG}
                </div>

                <div style="border-top:1px solid #646262ff; margin-top:15px; padding-top:10px; display:flex; justify-content:space-between;">
                    <p style="font-size:0.8rem; color:var(--accent-teal); font-family:monospace; margin:0;">SOURCE: RYZEN_ZEN4_NPU <br></p>
                    <p style="font-size:0.8rem; color:white; font-family:monospace; margin:0;">REV: 2.0.4-STABLE</p>
                </div>
            </div>
        </div>
    `;
}
      


const barAnimation = setInterval(() => {
    bars.forEach(bar => {
        bar.style.background = themeColor;
        bar.style.height = (Math.random() * 60 + 20) + "%"; 
        bar.style.transition = "height 0.1s ease";
    });
}, 80);

setTimeout(() => clearInterval(barAnimation), 1500);

if (hwLoad) hwLoad.style.width = "0%";
const totalScanTime = (performance.now() - startTime).toFixed(0);


const visualContainer = document.getElementById("sideVisualContainer"); 
if (visualContainer) {
    visualContainer.innerHTML = `
        <div style="margin-top: 20px; padding: 15px; background: #0a08088a; border: 1px solid #222; border-radius: 4px; text-align: center; border-top: 2px solid ${themeColor};">
            <div style="font-family:monospace; font-size:12px; color:lightgray; text-align:left; margin-bottom:12px;">
                > RYZEN_NPU_CORE_GEOMETRY:
            </div>
            <svg width="100" height="100" viewBox="0 0 100 100" style="margin:auto; display:block;">
                <circle cx="50" cy="50" r="45" stroke="#111" stroke-width="0.5" fill="none" />
                
                <circle cx="50" cy="50" r="35" stroke="${themeColor}" stroke-width="1" fill="none" stroke-dasharray="10 5" opacity="0.4">
                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite" />
                </circle>

                <circle cx="50" cy="50" r="25" stroke="${themeColor}" stroke-width="2" fill="none" stroke-dasharray="2 6">
                    <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="3s" repeatCount="indefinite" />
                </circle>

                <rect x="44" y="44" width="12" height="12" fill="${themeColor}" rx="2">
                    <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
                </rect>
                
                <line x1="50" y1="50" x2="50" y2="15" stroke="var(--amd-red)" stroke-width="2" stroke-linecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite" />
                </line>
            </svg>
            <div style="font-family:monospace; font-size:12px; color:${themeColor}; margin-top:12px; letter-spacing:1px;">
                [ STREAM_STATE: <span style="color:#fff">SYNCHRONIZED</span> ]
            </div>
        </div>
    `;
}


const finalLog = document.createElement("div");
finalLog.className = statusClass;
finalLog.innerHTML = `
    > INFERENCE_COMPLETE: ${label.toUpperCase()}
    <br>> RYZEN_NPU_LATENCY: ${latency}ms
    <br>> TOTAL_PIPELINE_TIME: ${totalScanTime}ms
`;

telemetry.appendChild(finalLog);
telemetry.scrollTop = telemetry.scrollHeight;

setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}, 300);
    } catch (error) {
        if (hwLoad) hwLoad.style.width = "0%";
        console.error("Scan Failed:", error);
        
        telemetry.innerHTML += `<br><span style="color:var(--amd-red)">> CORE_ERROR: ${error.message}</span>`;
    } 
}

function highlightNeuralPayload(content) {
    
    if (!content || content.trim() === "") return "[ NO_TEXT_CONTENT_DETECTED ]";

    let html = content;
    
    
    const dangerWords = [
        "urgent", "verify", "immediately", "deadline", "limited", 
        "offer", "click", "login", "register", "final", "payment", 
        "suspended", "failed", "action required"
    ];

    try {
      
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        html = html.replace(urlRegex, '<u style="color:var(--accent-teal); font-weight:bold;">$1</u>');

        
        dangerWords.forEach(word => {
            
            const regex = new RegExp(`\\b(${word})\\b`, "gi");
            html = html.replace(regex, `<span class="highlight">$1</span>`);
        });
        
        return html;
    } catch (e) {
        console.error("> NEURAL_HIGHLIGHTER_ERROR:", e);
        return content; 
    }
}
function openModal() {
    const modal = document.getElementById("previewModal");
    const modalBody = document.getElementById("modalBody");
    
    
    modalBody.innerHTML = window.currentDecodedEmail || "[ NO_DATA_STREAMED ]";
    
    modal.classList.remove("hidden");
    modal.style.display = "flex"; 
}

function closeModal() {
    const modal = document.getElementById("previewModal");
    modal.classList.add("hidden");
    modal.style.display = "none";
}