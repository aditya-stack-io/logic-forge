// ==========================================
// 1. TAB NAVIGATION CONTROLLER
// ==========================================
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ==========================================
// 2. MODULE 01: LOGIC GATE & ADDER SIMULATOR
// ==========================================
const GATE_SPECS = {
  AND: {
    ic: "IC: 74LS08 (Quad 2-Input AND)",
    eq: "Y = A · B",
    desc: "Outputs HIGH (1) only when both inputs A and B are HIGH (1).",
    inputs: 2,
    eval: (a, b) => [a & b]
  },
  OR: {
    ic: "IC: 74LS32 (Quad 2-Input OR)",
    eq: "Y = A + B",
    desc: "Outputs HIGH (1) when at least one input is HIGH (1).",
    inputs: 2,
    eval: (a, b) => [a | b]
  },
  NOT: {
    ic: "IC: 74LS04 (Hex Inverter)",
    eq: "Y = A'",
    desc: "Inverts the input signal: outputs HIGH (1) when Input A is LOW (0).",
    inputs: 1,
    eval: (a) => [a ^ 1]
  },
  NAND: {
    ic: "IC: 74LS00 (Universal Gate)",
    eq: "Y = (A · B)'",
    desc: "Universal gate: outputs LOW (0) only when all inputs are HIGH (1).",
    inputs: 2,
    eval: (a, b) => [(a & b) ^ 1]
  },
  NOR: {
    ic: "IC: 74LS02 (Universal Gate)",
    eq: "Y = (A + B)'",
    desc: "Universal gate: outputs HIGH (1) only when all inputs are LOW (0).",
    inputs: 2,
    eval: (a, b) => [(a | b) ^ 1]
  },
  XOR: {
    ic: "IC: 74LS86 (Quad 2-Input XOR)",
    eq: "Y = A ⊕ B",
    desc: "Parity detector: outputs HIGH (1) when inputs A and B are different.",
    inputs: 2,
    eval: (a, b) => [a ^ b]
  },
  XNOR: {
    ic: "IC: 74LS266 (Equivalence Gate)",
    eq: "Y = (A ⊕ B)'",
    desc: "Bit comparator: outputs HIGH (1) when inputs A and B are identical.",
    inputs: 2,
    eval: (a, b) => [(a ^ b) ^ 1]
  },
  HALF_ADDER: {
    ic: "COMBINATIONAL: 74LS86 + 74LS08",
    eq: "SUM = A ⊕ B  |  CARRY = A · B",
    desc: "Adds two 1-bit binary numbers and produces SUM and CARRY outputs.",
    inputs: 2,
    dualOutput: true,
    eval: (a, b) => [a ^ b, a & b]
  },
  FULL_ADDER: {
    ic: "IC: 74LS83 / Dual Half-Adder",
    eq: "SUM = A ⊕ B ⊕ Cin  |  Cout = AB + Cin(A ⊕ B)",
    desc: "Adds three 1-bit binary numbers (A, B, Carry-In) producing SUM and Carry-Out.",
    inputs: 3,
    dualOutput: true,
    eval: (a, b, c) => [a ^ b ^ c, (a & b) | (c & (a ^ b))]
  }
};

let currentGate = "AND";
let bitState = { a: 0, b: 0, c: 0 };

function renderGateSVG(gate, a, b, c, out1, out2) {
  const colorA = a ? "#00ff9d" : "#495668";
  const colorB = b ? "#00ff9d" : "#495668";
  const colorC = c ? "#00ff9d" : "#495668";
  const colorOut1 = out1 ? "#00ff9d" : "#495668";
  const colorOut2 = out2 ? "#00d2ff" : "#495668";
  const spec = GATE_SPECS[gate];

  return `
    <svg width="420" height="180" viewBox="0 0 420 180">
      <line x1="30" y1="55" x2="145" y2="55" stroke="${colorA}" stroke-width="4" />
      <text x="15" y="60" fill="${colorA}" font-family="monospace" font-size="14" font-weight="bold">A=${a}</text>

      ${spec.inputs >= 2 ? `
        <line x1="30" y1="100" x2="145" y2="100" stroke="${colorB}" stroke-width="4" />
        <text x="15" y="105" fill="${colorB}" font-family="monospace" font-size="14" font-weight="bold">B=${b}</text>
      ` : ""}

      ${spec.inputs === 3 ? `
        <line x1="30" y1="145" x2="145" y2="145" stroke="${colorC}" stroke-width="4" />
        <text x="8" y="150" fill="${colorC}" font-family="monospace" font-size="14" font-weight="bold">Cin=${c}</text>
      ` : ""}

      <rect x="145" y="30" width="130" height="125" rx="10" fill="#10161f" stroke="#00ff9d" stroke-width="2" />
      <text x="210" y="95" fill="#f0f4f8" font-family="monospace" font-size="15" font-weight="bold" text-anchor="middle">${gate.replace("_", " ")}</text>

      <line x1="275" y1="${spec.dualOutput ? 70 : 92}" x2="365" y2="${spec.dualOutput ? 70 : 92}" stroke="${colorOut1}" stroke-width="4" />
      <circle cx="375" cy="${spec.dualOutput ? 70 : 92}" r="9" fill="${colorOut1}" />

      ${spec.dualOutput ? `
        <line x1="275" y1="120" x2="365" y2="120" stroke="${colorOut2}" stroke-width="4" />
        <circle cx="375" cy="120" r="9" fill="${colorOut2}" />
      ` : ""}
    </svg>
  `;
}

function updateSimulator() {
  const spec = GATE_SPECS[currentGate];
  document.getElementById("ic-badge").textContent = spec.ic;
  document.getElementById("gate-eq").textContent = spec.eq;
  document.getElementById("gate-desc").textContent = spec.desc;

  document.getElementById("ctrl-b").classList.toggle("hidden", spec.inputs < 2);
  document.getElementById("ctrl-c").classList.toggle("hidden", spec.inputs < 3);

  const [out1, out2 = 0] = spec.eval(bitState.a, bitState.b, bitState.c);

  const led1 = document.getElementById("led-out1");
  led1.textContent = out1;
  led1.classList.toggle("high", out1 === 1);

  document.getElementById("out1-label").textContent = spec.dualOutput ? "SUM (S)" : "OUTPUT (Y)";
  const out2Box = document.getElementById("out2-box");
  out2Box.classList.toggle("hidden", !spec.dualOutput);

  if (spec.dualOutput) {
    const led2 = document.getElementById("led-out2");
    led2.textContent = out2;
    led2.classList.toggle("high", out2 === 1);
  }

  document.getElementById("bus-status").textContent =
    out1 || out2 ? "STATE: HIGH (+5V TTL)" : "STATE: LOW (0V GND)";

  document.getElementById("svg-stage").innerHTML = renderGateSVG(
    currentGate,
    bitState.a,
    bitState.b,
    bitState.c,
    out1,
    out2
  );
}

document.querySelectorAll("#gate-buttons .chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#gate-buttons .chip").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentGate = btn.dataset.gate;
    updateSimulator();
  });
});

["a", "b", "c"].forEach((key) => {
  const btn = document.getElementById(`btn-${key}`);
  btn.addEventListener("click", () => {
    bitState[key] = bitState[key] ^ 1;
    btn.dataset.bit = bitState[key];
    btn.textContent = bitState[key];
    updateSimulator();
  });
});

// ==========================================
// 3. MODULE 02: TRUTH TABLE ENGINE
// ==========================================
let lastTruthTableData = { headers: [], rows: [] };

function evaluateBooleanExpr(rawExpr) {
  const clean = rawExpr.toUpperCase().replace(/\s+/g, "");
  if (!/^[ABCD&|^!~+*()01]+$/.test(clean)) {
    throw new Error("Invalid characters detected. Allowed variables: A, B, C, D and operators: &, |, ^, !, (, )");
  }

  const vars = ["A", "B", "C", "D"].filter((v) => clean.includes(v));
  const activeVars = vars.length > 0 ? vars : ["A", "B"];
  const n = activeVars.length;
  const totalRows = 1 << n;

  const jsExpr = clean
    .replace(/~/g, "!")
    .replace(/\*/g, "&")
    .replace(/\+/g, "|")
    .replace(/!/g, "1^");

  const rows = [];
  const minterms = [];
  const maxterms = [];

  for (let i = 0; i < totalRows; i++) {
    const scope = { A: 0, B: 0, C: 0, D: 0 };
    const rowBits = [];
    for (let bit = 0; bit < n; bit++) {
      const val = (i >> (n - 1 - bit)) & 1;
      scope[activeVars[bit]] = val;
      rowBits.push(val);
    }

    let result;
    try {
      const fn = new Function("A", "B", "C", "D", `return (${jsExpr}) ? 1 : 0;`);
      result = fn(scope.A, scope.B, scope.C, scope.D);
    } catch {
      throw new Error("Syntax error in Boolean expression. Check parentheses and operators.");
    }

    rows.push({ index: i, bits: rowBits, out: result });
    if (result === 1) minterms.push(i);
    else maxterms.push(i);
  }

  return { activeVars, rows, minterms, maxterms };
}

function renderTruthTable() {
  const input = document.getElementById("expr-input").value;
  const errBox = document.getElementById("expr-error");
  try {
    const { activeVars, rows, minterms, maxterms } = evaluateBooleanExpr(input);
    errBox.classList.add("hidden");

    document.getElementById("sop-minterms").textContent =
      minterms.length ? `∑m(${minterms.join(", ")})` : "0 (Always LOW)";
    document.getElementById("pos-maxterms").textContent =
      maxterms.length ? `∏M(${maxterms.join(", ")})` : "1 (Always HIGH)";

    lastTruthTableData = { headers: ["m", ...activeVars, "OUT"], rows };

    const thead = `<thead><tr><th>#</th>${activeVars.map((v) => `<th>${v}</th>`).join("")}<th>OUT (F)</th></tr></thead>`;
    const tbody = rows
      .map(
        (r) =>
          `<tr class="${r.out ? "row-high" : ""}">
            <td>m${r.index}</td>
            ${r.bits.map((b) => `<td>${b}</td>`).join("")}
            <td>${r.out}</td>
          </tr>`
      )
      .join("");

    document.getElementById("tt-output").innerHTML = thead + `<tbody>${tbody}</tbody>`;
  } catch (err) {
    errBox.textContent = err.message;
    errBox.classList.remove("hidden");
  }
}

document.getElementById("eval-btn").addEventListener("click", renderTruthTable);
document.querySelectorAll(".preset-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.getElementById("expr-input").value = chip.dataset.expr;
    renderTruthTable();
  });
});

document.getElementById("copy-md-btn").addEventListener("click", () => {
  const { headers, rows } = lastTruthTableData;
  if (!rows.length) return;
  const headerLine = `| ${headers.join(" | ")} |`;
  const sepLine = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyLines = rows.map((r) => `| m${r.index} | ${r.bits.join(" | ")} | **${r.out}** |`);
  const md = [headerLine, sepLine, ...bodyLines].join("\n");
  navigator.clipboard.writeText(md);
  const toast = document.getElementById("copy-toast");
  toast.textContent = "Copied Markdown Table!";
  setTimeout(() => (toast.textContent = ""), 2200);
});

document.getElementById("export-csv-btn").addEventListener("click", () => {
  const { headers, rows } = lastTruthTableData;
  if (!rows.length) return;
  const csv = [
    headers.join(","),
    ...rows.map((r) => [r.index, ...r.bits, r.out].join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "truth-table.csv";
  a.click();
});

// ==========================================
// 4. MODULE 03: INTERACTIVE K-MAP SOLVER
// ==========================================
let kVars = 4;
let kCells = new Array(16).fill(0);

const GRAY_2 = [0, 1];
const GRAY_4 = [0, 1, 3, 2];
const LABEL_2 = ["0", "1"];
const LABEL_4 = ["00", "01", "11", "10"];

function getKMapConfig(vars) {
  if (vars === 2) {
    return {
      axis: "A \\ B",
      rowLabels: LABEL_2,
      colLabels: LABEL_2,
      rowGray: GRAY_2,
      colGray: GRAY_2,
      colShift: 1
    };
  }
  if (vars === 3) {
    return {
      axis: "A \\ BC (GRAY CODE)",
      rowLabels: LABEL_2,
      colLabels: LABEL_4,
      rowGray: GRAY_2,
      colGray: GRAY_4,
      colShift: 2
    };
  }
  return {
    axis: "AB \\ CD (GRAY CODE)",
    rowLabels: LABEL_4,
    colLabels: LABEL_4,
    rowGray: GRAY_4,
    colGray: GRAY_4,
    colShift: 2
  };
}

function solveKMap(numVars, cells) {
  const total = 1 << numVars;
  const minterms = [];
  const dontCares = [];

  for (let i = 0; i < total; i++) {
    if (cells[i] === 1) minterms.push(i);
    else if (cells[i] === "X") dontCares.push(i);
  }

  if (minterms.length === 0) {
    return { expr: "F = 0", minterms, dontCares, literals: 0 };
  }
  if (minterms.length + dontCares.length === total) {
    return { expr: "F = 1", minterms, dontCares, literals: 0 };
  }

  const varNames = ["A", "B", "C", "D"].slice(0, numVars);
  const validImplicants = [];

  const maxTernary = Math.pow(3, numVars);
  for (let t = 0; t < maxTernary; t++) {
    const pattern = [];
    let temp = t;
    for (let v = 0; v < numVars; v++) {
      pattern.push(temp % 3);
      temp = Math.floor(temp / 3);
    }

    const covered = [];
    let valid = true;
    for (let m = 0; m < total; m++) {
      let match = true;
      for (let v = 0; v < numVars; v++) {
        const bit = (m >> (numVars - 1 - v)) & 1;
        if (pattern[v] !== 2 && pattern[v] !== bit) {
          match = false;
          break;
        }
      }
      if (match) {
        if (cells[m] === 0) {
          valid = false;
          break;
        }
        covered.push(m);
      }
    }

    if (valid && covered.some((c) => cells[c] === 1)) {
      const literals = pattern.filter((p) => p !== 2).length;
      validImplicants.push({ pattern, covered, literals });
    }
  }

  const primeImplicants = validImplicants.filter(
    (impA, idxA) =>
      !validImplicants.some(
        (impB, idxB) =>
          idxA !== idxB &&
          impB.covered.length > impA.covered.length &&
          impA.covered.every((m) => impB.covered.includes(m))
      )
  );

  const uncovered = new Set(minterms);
  const selected = [];

  for (const m of minterms) {
    const covering = primeImplicants.filter((p) => p.covered.includes(m));
    if (covering.length === 1 && !selected.includes(covering[0])) {
      selected.push(covering[0]);
      covering[0].covered.forEach((c) => uncovered.delete(c));
    }
  }

  while (uncovered.size > 0) {
    let best = null;
    let bestScore = -1;
    for (const p of primeImplicants) {
      const newlyCovered = p.covered.filter((c) => uncovered.has(c)).length;
      if (newlyCovered > 0) {
        const score = newlyCovered * 10 - p.literals;
        if (score > bestScore) {
          bestScore = score;
          best = p;
        }
      }
    }
    if (!best) break;
    selected.push(best);
    best.covered.forEach((c) => uncovered.delete(c));
  }

  let totalLiterals = 0;
  const terms = selected.map((imp) => {
    let termStr = "";
    imp.pattern.forEach((val, idx) => {
      if (val === 1) {
        termStr += varNames[idx];
        totalLiterals++;
      } else if (val === 0) {
        termStr += varNames[idx] + "'";
        totalLiterals++;
      }
    });
    return termStr || "1";
  });

  return {
    expr: `F = ${terms.join(" + ")}`,
    minterms,
    dontCares,
    literals: totalLiterals
  };
}

function renderKMap() {
  const cfg = getKMapConfig(kVars);
  document.getElementById("kmap-axis-label").textContent = cfg.axis;

  let html = `<table class="kmap-table"><thead><tr><th></th>`;
  cfg.colLabels.forEach((col) => {
    html += `<th>${col}</th>`;
  });
  html += `</tr></thead><tbody>`;

  cfg.rowGray.forEach((rVal, rIdx) => {
    html += `<tr><th>${cfg.rowLabels[rIdx]}</th>`;
    cfg.colGray.forEach((cVal) => {
      const cellIndex = (rVal << cfg.colShift) | cVal;
      const val = kCells[cellIndex];
      html += `
        <td class="kmap-cell" data-idx="${cellIndex}" data-val="${val}">
          ${val}
          <span class="cell-index">m${cellIndex}</span>
        </td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table>`;

  const container = document.getElementById("kmap-grid-container");
  container.innerHTML = html;

  container.querySelectorAll(".kmap-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      const idx = Number(cell.dataset.idx);
      const current = kCells[idx];
      kCells[idx] = current === 0 ? 1 : current === 1 ? "X" : 0;
      renderKMap();
    });
  });

  const solved = solveKMap(kVars, kCells);
  document.getElementById("kmap-sop-expr").textContent = solved.expr;
  document.getElementById("kmap-minterms").textContent = `∑m(${solved.minterms.join(", ")})`;
  document.getElementById("kmap-dontcares").textContent = `∑d(${solved.dontCares.join(", ")})`;
  document.getElementById("kmap-literals").textContent = `${solved.literals} literals`;
}

document.querySelectorAll("[data-kvars]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-kvars]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    kVars = Number(btn.dataset.kvars);
    kCells = new Array(1 << kVars).fill(0);
    renderKMap();
  });
});

document.getElementById("kmap-reset").addEventListener("click", () => {
  kCells = new Array(1 << kVars).fill(0);
  renderKMap();
});

document.getElementById("kmap-fill1").addEventListener("click", () => {
  kCells = new Array(1 << kVars).fill(1);
  renderKMap();
});

document.getElementById("kmap-random").addEventListener("click", () => {
  const pool = [0, 0, 1, 1, "X"];
  kCells = Array.from({ length: 1 << kVars }, () => pool[Math.floor(Math.random() * pool.length)]);
  renderKMap();
});

updateSimulator();
renderTruthTable();
renderKMap();
