# ⚒️ PracticeForge AI
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Engine-Cloudflare%20Agents-orange)](https://workers.cloudflare.com/)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa)](https://github.com/sponsors)
**PracticeForge AI** is a specialized pedagogical tool designed to transform simple topic inputs into highly structured, actionable practice guides. It leverages advanced AI orchestration to forge curriculum-aligned guides following a proven 8-section mastery template.
## 🌟 Features
- **8-Section Pedagogical Template**: Every guide includes Objectives, Overview, Guided Examples, Exercises, Reflection, Pitfalls, Glossary, and Resources.
- **Document Context Integration**: Upload PDF, DOCX, or TXT files to ground the AI's generation in your specific source material.
- **BYOK (Bring Your Own Key)**: Support for OpenRouter API keys for faster streaming and higher model flexibility.
- **Illustrative Design System**: A whimsical, sketchbook-inspired UI featuring hand-drawn elements and playful animations.
- **High-Fidelity Exports**: One-click downloads for styled HTML and Markdown for offline practice.
## 🚀 Quickstart
### Local Development
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/practiceforge.git
   cd practiceforge
   ```
2. **Install dependencies:**
   ```bash
   bun install
   ```
3. **Configure Environment:**
   Update `wrangler.jsonc` with your Cloudflare API keys or set them in the dashboard.
4. **Run Development Server:**
   ```bash
   bun run dev
   ```
### Deployment
Deploy to Cloudflare Workers and Pages in seconds:
```bash
bun run deploy
```
## ⚙️ Configuration
### OpenRouter Setup (Optional)
To use your own high-performance models:
1. Obtain an API key from [OpenRouter](https://openrouter.ai/).
2. Click the ⚙️ icon in the Forge Specs sidebar.
3. Paste your key. It is stored locally in your browser's `localStorage` and never sent to our servers.
## 📦 Exporting Guides
PracticeForge supports two main export types:
- **Markdown (.md)**: Perfect for Obsidian, Notion, or GitHub.
- **HTML (.html)**: A standalone, styled document that retains the "Illustrative" aesthetic for offline viewing.
## 🔥 Stoke the Fire (Support)
PracticeForge is an open-source project dedicated to making structured learning accessible to everyone. If it has helped you, please consider supporting the development:
- **GitHub Sponsors**: [Sponsor the Engine](https://github.com/sponsors)
- **Ko-fi**: [Buy the Blacksmith a Coffee](https://ko-fi.com)
## ⚖️ License
Distributed under the **MIT License**. See `LICENSE` for more information.
---
*Forged with curiosity and Cloudflare Agents.*