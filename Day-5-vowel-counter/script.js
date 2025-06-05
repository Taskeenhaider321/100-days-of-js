document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const textInput = document.getElementById("text-input")
    const fileInput = document.getElementById("file-input")
    const fileName = document.getElementById("file-name")
    const fileContentPreview = document.getElementById("file-content-preview")
    const caseSensitiveToggle = document.getElementById("case-sensitive")
    const countYToggle = document.getElementById("count-y")
    const totalVowelsElement = document.getElementById("total-vowels")
    const totalCharsElement = document.getElementById("total-chars")
    const vowelPercentageElement = document.getElementById("vowel-percentage")
    const historyList = document.getElementById("history-list")
    const clearHistoryBtn = document.getElementById("clear-history")
    const tabBtns = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
    const yBar = document.getElementById("y-bar")

    // Vowel counts and elements
    const vowels = ["a", "e", "i", "o", "u", "y"]
    const vowelCounts = { a: 0, e: 0, i: 0, o: 0, u: 0, y: 0 }

    // Load history from localStorage
    let analysisHistory = JSON.parse(localStorage.getItem("vowelCounterHistory")) || []

    // Initialize the app
    init()

    function init() {
        // Set up event listeners
        textInput.addEventListener("input", analyzeText)
        fileInput.addEventListener("change", handleFileUpload)
        caseSensitiveToggle.addEventListener("change", analyzeCurrentContent)
        countYToggle.addEventListener("change", () => {
            yBar.style.display = countYToggle.checked ? "grid" : "none"
            analyzeCurrentContent()
        })
        clearHistoryBtn.addEventListener("click", clearHistory)

        // Tab switching
        tabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                tabBtns.forEach((b) => b.classList.remove("active"))
                tabContents.forEach((c) => c.classList.remove("active"))

                btn.classList.add("active")
                document.getElementById(`${btn.dataset.tab}-tab`).classList.add("active")

                analyzeCurrentContent()
            })
        })

        // Initial Y toggle state
        yBar.style.display = countYToggle.checked ? "grid" : "none"

        // Render history
        renderHistory()
    }

    function analyzeCurrentContent() {
        const activeTab = document.querySelector(".tab-btn.active").dataset.tab

        if (activeTab === "text") {
            analyzeText()
        } else if (activeTab === "file" && fileContentPreview.textContent) {
            analyzeText({ target: { value: fileContentPreview.textContent } })
        }
    }

    function analyzeText(event) {
        let text = ""

        if (event) {
            text = event.target.value
        } else {
            text = textInput.value
        }

        // Reset counts
        resetCounts()

        if (!text) {
            updateUI()
            return
        }

        const caseSensitive = caseSensitiveToggle.checked
        const countY = countYToggle.checked

        // Process text for counting
        if (!caseSensitive) {
            text = text.toLowerCase()
        }

        // Count total characters (excluding whitespace)
        const totalChars = text.replace(/\s/g, "").length

        // Count vowels
        for (const char of text) {
            if (!/\s/.test(char)) {
                // Skip whitespace
                if (vowels.includes(char.toLowerCase())) {
                    if (char.toLowerCase() === "y" && !countY) continue

                    if (caseSensitive) {
                        vowelCounts[char.toLowerCase()]++
                    } else {
                        vowelCounts[char]++
                    }
                }
            }
        }

        // Calculate total vowels
        const totalVowels = Object.values(vowelCounts).reduce((sum, count) => sum + count, 0)

        // Calculate vowel percentage
        const vowelPercentage = totalChars > 0 ? ((totalVowels / totalChars) * 100).toFixed(1) : 0

        // Update UI
        updateUI(totalVowels, totalChars, vowelPercentage)

        // Add to history if there's content to analyze
        if (text.trim().length > 0) {
            addToHistory(text, totalVowels, totalChars, vowelPercentage, { ...vowelCounts })
        }
    }

    function handleFileUpload(event) {
        const file = event.target.files[0]

        if (file) {
            fileName.textContent = file.name

            const reader = new FileReader()

            reader.onload = (e) => {
                const content = e.target.result
                fileContentPreview.textContent = content
                fileContentPreview.style.display = "block"

                // Analyze the file content
                analyzeText({ target: { value: content } })
            }

            reader.onerror = () => {
                fileName.textContent = "Error reading file"
                fileContentPreview.style.display = "none"
            }

            reader.readAsText(file)
        } else {
            fileName.textContent = "No file selected"
            fileContentPreview.style.display = "none"
        }
    }

    function resetCounts() {
        for (const vowel of vowels) {
            vowelCounts[vowel] = 0
        }
    }

    function updateUI(totalVowels = 0, totalChars = 0, vowelPercentage = 0) {
        // Update total stats
        totalVowelsElement.textContent = totalVowels
        totalCharsElement.textContent = totalChars
        vowelPercentageElement.textContent = `${vowelPercentage}%`

        // Add animation
        totalVowelsElement.classList.add("animate-pulse")
        setTimeout(() => totalVowelsElement.classList.remove("animate-pulse"), 500)

        // Update vowel breakdown
        for (const vowel of vowels) {
            const countElement = document.getElementById(`count-${vowel}`)
            const barElement = document.getElementById(`bar-${vowel}`)

            if (countElement && barElement) {
                countElement.textContent = vowelCounts[vowel]

                // Calculate bar width percentage (max of the current vowels)
                const maxCount = Math.max(...Object.values(vowelCounts))
                const widthPercentage = maxCount > 0 ? (vowelCounts[vowel] / maxCount) * 100 : 0

                barElement.style.width = `${widthPercentage}%`
            }
        }
    }

    function addToHistory(text, totalVowels, totalChars, vowelPercentage, vowelCounts) {
        // Create history item
        const historyItem = {
            id: Date.now(),
            text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
            fullText: text,
            totalVowels,
            totalChars,
            vowelPercentage,
            vowelCounts,
            timestamp: new Date().toLocaleString(),
        }

        // Add to beginning of array (most recent first)
        analysisHistory.unshift(historyItem)

        // Limit history to 10 items
        if (analysisHistory.length > 10) {
            analysisHistory.pop()
        }

        // Save to localStorage
        saveHistory()

        // Update UI
        renderHistory()
    }

    function renderHistory() {
        historyList.innerHTML = ""

        if (analysisHistory.length === 0) {
            const emptyMessage = document.createElement("div")
            emptyMessage.className = "history-item"
            emptyMessage.textContent = "No analysis history yet"
            historyList.appendChild(emptyMessage)
            return
        }

        analysisHistory.forEach((item) => {
            const historyItem = document.createElement("div")
            historyItem.className = "history-item"
            historyItem.dataset.id = item.id

            const historyText = document.createElement("div")
            historyText.className = "history-text"
            historyText.textContent = item.text

            const historyStats = document.createElement("div")
            historyStats.className = "history-stats"

            const vowelStat = document.createElement("div")
            vowelStat.className = "history-stat"
            vowelStat.innerHTML = `<strong>Vowels:</strong> ${item.totalVowels}`

            const percentStat = document.createElement("div")
            percentStat.className = "history-stat"
            percentStat.innerHTML = `<strong>Percentage:</strong> ${item.vowelPercentage}%`

            const timeStat = document.createElement("div")
            timeStat.className = "history-stat"
            timeStat.innerHTML = `<strong>Time:</strong> ${item.timestamp.split(",")[0]}`

            historyStats.appendChild(vowelStat)
            historyStats.appendChild(percentStat)
            historyStats.appendChild(timeStat)

            historyItem.appendChild(historyText)
            historyItem.appendChild(historyStats)

            // Add click event to load this history item
            historyItem.addEventListener("click", () => {
                loadHistoryItem(item)
            })

            historyList.appendChild(historyItem)
        })
    }

    function loadHistoryItem(item) {
        // Switch to text tab
        tabBtns.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))

        document.querySelector('[data-tab="text"]').classList.add("active")
        document.getElementById("text-tab").classList.add("active")

        // Set the text
        textInput.value = item.fullText

        // Analyze the text
        analyzeText()

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function saveHistory() {
        localStorage.setItem("vowelCounterHistory", JSON.stringify(analysisHistory))
    }

    function clearHistory() {
        analysisHistory = []
        saveHistory()
        renderHistory()
    }
})
