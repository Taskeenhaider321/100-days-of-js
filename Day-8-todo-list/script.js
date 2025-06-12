document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const editor = document.getElementById("editor")
  const preview = document.getElementById("preview")
  const saveBtn = document.getElementById("save-btn")
  const copyHtmlBtn = document.getElementById("copy-html-btn")
  const downloadMdBtn = document.getElementById("download-md-btn")
  const downloadHtmlBtn = document.getElementById("download-html-btn")
  const toast = document.getElementById("toast")
  const tabs = document.querySelectorAll(".tab")
  const panels = document.querySelectorAll(".panel")
  const toolbarButtons = document.querySelectorAll(".toolbar button")

  // Import marked and highlight.js
  const marked = window.marked
  const hljs = window.hljs

  // Default markdown content
  const defaultMarkdown = `# Welcome to Markdown Editor

This is a **bold text** and this is an *italic text*.

## Lists

- Item 1
- Item 2
- Item 3

## Code

\`\`\`js
console.log('Hello World');
\`\`\`

## Links

[Visit Example](https://example.com)

## Images

![Placeholder Image](https://via.placeholder.com/400x200)

## Tables

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`

  // Initialize marked.js options
  marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    },
  })

  // Load saved content or default
  editor.value = localStorage.getItem("savedMarkdown") || defaultMarkdown

  // Initial render
  renderMarkdown()

  // Event listeners
  editor.addEventListener("input", renderMarkdown)
  saveBtn.addEventListener("click", saveMarkdown)
  copyHtmlBtn.addEventListener("click", copyHtml)
  downloadMdBtn.addEventListener("click", downloadMarkdown)
  downloadHtmlBtn.addEventListener("click", downloadHtml)

  // Tab switching for mobile
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-tab")

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Update active panel
      panels.forEach((panel) => {
        panel.classList.remove("active")
        if (panel.classList.contains(tabName + "-panel")) {
          panel.classList.add("active")
        }
      })
    })
  })

  // Toolbar buttons
  toolbarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action")
      applyFormatting(action)
    })
  })

  // Functions
  function renderMarkdown() {
    const markdownText = editor.value
    const html = marked.parse(markdownText)
    preview.innerHTML = html

    // Apply syntax highlighting to code blocks
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block)
    })
  }

  function saveMarkdown() {
    localStorage.setItem("savedMarkdown", editor.value)
    showToast("Markdown saved to local storage")
  }

  function copyHtml() {
    const html = preview.innerHTML
    navigator.clipboard
      .writeText(html)
      .then(() => showToast("HTML copied to clipboard"))
      .catch((err) => showToast("Failed to copy HTML: " + err))
  }

  function downloadMarkdown() {
    download("document.md", editor.value)
  }

  function downloadHtml() {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    pre {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      overflow: auto;
    }
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    img {
      max-width: 100%;
    }
  </style>
</head>
<body>
  ${preview.innerHTML}
</body>
</html>`

    download("document.html", html)
  }

  function download(filename, text) {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
    element.setAttribute("download", filename)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  function showToast(message) {
    toast.textContent = message
    toast.classList.add("show")
    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }

  function applyFormatting(action) {
    const start = editor.selectionStart
    const end = editor.selectionEnd
    const selectedText = editor.value.substring(start, end)
    let replacement = ""

    switch (action) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`
        break
      case "italic":
        replacement = `*${selectedText || "italic text"}*`
        break
      case "heading1":
        replacement = `# ${selectedText || "Heading 1"}`
        break
      case "heading2":
        replacement = `## ${selectedText || "Heading 2"}`
        break
      case "unordered-list":
        replacement = `- ${selectedText || "List item"}`
        break
      case "ordered-list":
        replacement = `1. ${selectedText || "List item"}`
        break
      case "link":
        replacement = `[${selectedText || "Link text"}](url)`
        break
      case "image":
        replacement = `![${selectedText || "Alt text"}](image-url)`
        break
      case "code":
        replacement = `\`\`\`\n${selectedText || "code"}\n\`\`\``
        break
      case "table":
        replacement = `| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n| Cell   | Cell   |`
        break
      case "quote":
        replacement = `> ${selectedText || "Blockquote"}`
        break
      case "hr":
        replacement = `\n---\n`
        break
    }

    // Insert the formatted text
    editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end)

    // Update the preview
    renderMarkdown()

    // Set cursor position
    editor.focus()
    const newCursorPos = start + replacement.length
    editor.setSelectionRange(newCursorPos, newCursorPos)
  }

  // Check for mobile view and set appropriate view
  function checkMobileView() {
    if (window.innerWidth <= 768) {
      // On mobile, default to editor view
      tabs[0].classList.add("active")
      tabs[1].classList.remove("active")
      panels[0].classList.add("active")
      panels[1].classList.remove("active")
    } else {
      // On desktop, show both panels
      panels.forEach((panel) => panel.classList.add("active"))
    }
  }

  // Initial check for mobile view
  checkMobileView()

  // Listen for window resize
  window.addEventListener("resize", checkMobileView)
})
