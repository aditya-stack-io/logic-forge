# ⚡ LogicForge — Terminal Digital Logic & K-Map Workbench

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-00ff9d?style=for-the-badge)

**LogicForge** is a lightweight, zero-dependency Digital Electronics & Boolean Algebra workbench designed with a high-contrast monochrome terminal UI and glassmorphic panels.

🔗 **Live Demo:** [https://aditya-stack-io.github.io/logic-forge/](https://aditya-stack-io.github.io/logic-forge/)

---

## 🚀 Key Modules

1. **Interactive Gate & Adder Hardware Simulator (`01 // GATE_SIMULATOR`)**
   - Real-time bit toggling for `AND`, `OR`, `NOT`, `NAND`, `NOR`, `XOR`, `XNOR`, `Half Adder`, and `Full Adder`.
   - Dynamic SVG bus visualization with 74xx TTL IC chip references (`74LS08`, `74LS86`, `74LS83`, etc.).

2. **Boolean Expression & Truth Table Engine (`02 // TRUTH_TABLE_ENGINE`)**
   - Evaluates custom up-to-4-variable Boolean expressions (`A, B, C, D`).
   - Automatically extracts Canonical **Sum of Minterms (∑m)** and **Product of Maxterms (∏M)**.
   - One-click **Copy Markdown Table** and **Export `.CSV`** for lab reports and study notes.

3. **Quine-McCluskey K-Map Solver (`03 // K-MAP_SOLVER`)**
   - Supports 2-, 3-, and 4-variable Gray-code Karnaugh Maps with `0`, `1`, and `X` (Don't Care) states.
   - Computes the exact minimized Sum of Products (SOP) expression and counts active literals in real time.

---

## 🛠️ Local Setup

No build tools or package managers required.

```bash
git clone https://github.com/aditya-stack-io/logic-forge.git
cd logic-forge
start index.html
```

---

## 👤 Author

**Aditya Kumar**
- GitHub: [@aditya-stack-io](https://github.com/aditya-stack-io)
- Instagram: [@iam.aadi11.11](https://www.instagram.com/iam.aadi11.11)
