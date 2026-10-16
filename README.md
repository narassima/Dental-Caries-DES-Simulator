# Dental Caries Discrete Event Simulation (DES) Platform

**Optimising School-Based Dental Caries Prevention Through Task-Shifting: A State-Level Discrete Event Simulation Across India & Global Modeler**

Based on the research paper (*Great Lakes Institute of Management & Collaborators*).

---

## 🎨 LinkedIn-Inspired Light Theme with Soft Pastel Shades

The platform features a clean, publication-grade user interface modeled after LinkedIn's web design system:
- **Canvas & Surfaces**: LinkedIn signature warm light-grey canvas (`#f3f2ef`), pure white cards (`#ffffff`), and subtle borders (`#e0e0e0`).
- **Soft Pastel Semantic Palettes**:
  - 🔵 **Pastel Blue**: Baseline settings, primary metrics (`#e7f3ff` / text `#0a66c2`)
  - 🟢 **Pastel Green**: Coverage, treated patients, positive clinical outcomes (`#e6f4ea` / text `#137333`)
  - 🟡 **Pastel Amber**: Auxiliary busy time, unserved queues, workforce gap additions (`#fef7e0` / text `#b06000`)
  - 🔴 **Pastel Coral / Red**: Unmet caries burden, shift cut-offs (`#fce8e6` / text `#c5221f`)
  - 🟣 **Pastel Purple**: High-intensity stretch tiers, stainless steel restorations (`#f3e8fd` / text `#7627bb`)
- **Interactive 'i' (Info/Explainer) Buttons**: Circular info buttons placed next to every KPI, parameter slider, feasibility tier, and table column. Clicking any button opens a structured explainer modal displaying the operational definition, mathematical formula, baseline benchmark, and paper reference.
- **Detailed 'How to Use' Guide**: Prominent guide button in the top navbar opening a step-by-step walkthrough covering the DES engine, feasibility tiers, live Gantt timeline, state ranking analysis, and custom country modeling.

---

## 🚀 Live Demo & GitHub Pages Deployment

This application is built as a **100% client-side web application** (HTML5, CSS3, ES6 JavaScript) with zero backend requirements.

### Hosting on GitHub Pages in 30 Seconds:
1. Push this repository to your GitHub account (e.g., `https://github.com/<your-username>/dental-caries-des`).
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
4. Your application will be live instantly at `https://<your-username>.github.io/dental-caries-des/`!

### Running Locally:
- **Option 1 (Direct Open):** Simply double-click [`index.html`](file:///c:/Users/narassima.s/dental-caries-des-app/index.html) in your file manager to open it in any modern browser (Chrome, Edge, Firefox, Safari).
- **Option 2 (Local Static Server):** Run `python -m http.server 8080` in this directory and open `http://localhost:8080/`.

---

## 🌟 Key Application Features

### 1. Executive Dashboard & Feasibility Tiers (Table 1)
- **National Headline KPIs (Plausible Tier)**:
  - Unique children reached: **4.75 Million**
  - Annual caries coverage: **12.03%** national (ranging from 2.3% in MP to 64.9% in DNH&DD)
  - Unmet caries burden: **34.72 Million** children
  - Dedicated school dentists needed: **18,379** (at 1,889 children/dentist/year reach)
  - Dentist shift procedure utilization: **15.0%**
  - Disability-adjusted life years averted: **7,028 in-year** / **24,082 duration-adjusted**
- **Feasibility Tiers Explorer**: One-click switching between **Status Quo**, **Plausible (Headline)**, **Stretch**, and **Theoretical Max**, with progress bars and trade-off comparison charts.
- **Interactive What-If Sliders**: Live tuning of Camps/month (2 to 22), Task-Shifting level (0% to 30%), Dentist availability $\phi$ (0.1 to 1.0), Repeat attendance $\rho$ (5% to 30%), and Preventive OHE reduction $R$ (0% vs 5%).

### 2. Camp-Level Discrete Event Simulator & Gantt Timeline (Tab 2)
- Replicates the exact **Lindley recursion** single-server FIFO queueing logic from `des2.py`:
  - 8-hour school day (480 minutes).
  - Batch arrivals: $\text{Ceil}(U(8, 12)) \times (1 + \text{TS}\%)$.
  - Auxiliary triage & admission ($U(0.5, 1.5)$ min non-value-added time).
  - Task-shifting routing: Oral Health Education (OHE) $\to$ Trained Teacher; Fluoride Varnish (FV) $\to$ Auxiliary; Clinical procedures (ART, Stainless Steel Crowns, Pulpectomy, GIC/Composite, Scaling) $\to$ Dentist.
  - Shift cut-off at $T = 480\text{ min}$ (students served only if service begins before shift end).
- **Visual Gantt Timeline (0 to 480 min)**: Color-coded procedure tracks for Dentist, Auxiliary, and Teacher. Click on any student block to view their full clinical card, wait time, and DMFT reduction probability.
- **Batch Monte Carlo Runner**: Run 250+ camp days in one click to inspect empirical utilization and throughput distributions.

### 3. Subnational States Explorer — 35 States & UTs (Tab 3)
- Comprehensive disaggregation matching **Table 2**:
  - Enrolment (Classes 1–10 from UDISE+ 2024–25).
  - Government dental surgeons (NHP 2022).
  - Students-per-dentist ratios (highlighting the **200-fold interstate disparity** between MP at 58,543 vs DNH&DD at 427).
  - Simulated coverage under all tiers, 95% uncertainty intervals from PSA, unmet need, and dedicated dentist workforce gaps.
- **Interactive Visualizations**:
  - State Coverage Ranking with 95% Uncertainty Intervals (**Figure 6**).
  - Scatter plot of Students-per-Dentist vs Achievable Coverage (**Figure 7**).
- **State Deep-Dive Drawer**: Click any state (e.g. Kerala, Uttar Pradesh, Bihar) to inspect its age-specific caries pools, local workforce, and policy gaps.

### 4. Scenario Grid & Real-Time PSA Monte Carlo (Tab 4)
- **National Scenario Grid Heatmap**: Complete matrix of 11 camp frequency levels $\times$ 4 task-shifting intensities (**Figure 8** / Tables A5–A13).
- **In-Browser Monte Carlo Probabilistic Sensitivity Analysis (PSA)**:
  - Runs 150 to 300 draws directly in JavaScript.
  - Jointly samples regional gradients (Janakiram vs Pandey), prevalence anchors, availability $\phi$, referral volumes, process times, effectiveness multipliers, repeat rates $\rho$, and disability weights.
  - Generates empirical distribution histograms, median coverage, and 95% uncertainty intervals.

### 5. Custom Country Modeler & Global Triage Configurator (Tab 5)
- Model **any country or health jurisdiction in the world**:
  - Configure target school-age demographics (6–8y, 9–11y, 12–15y).
  - Specify public dental surgeon workforce.
  - Set baseline age-specific caries prevalence and mean DMFT.
  - Add subnational provinces or districts with individual population and dentist counts.
- **Preloaded Global Archetype Presets**:
  - Low-Income Country (Severe dentist shortage: ~40,000 students/dentist).
  - Lower-Middle Income Country (~11,000 students/dentist).
  - Upper-Middle Income Country (~4,000 students/dentist).
  - Universal Screening Model (~1,000 students/dentist).
- **One-Click JSON Export & Import**: Save, share, and reload custom country profiles.

### 6. Methodology, Formulas & Manuscript Figures Gallery (Tab 6)
- Complete mathematical definitions:
  - Lindley recursion queueing equations.
  - 10-month school-year pool depletion model.
  - Duration-adjusted Years Lived with Disability (YLDs) averted discounted at 3%.
  - Population DMFT reduction percentage.
  - Dedicated workforce gap formulation.
- **Embedded High-Resolution Figures**: High-definition renderings of **Figure 1 through Figure 9** from the manuscript with detailed scientific figure legends.

---

## 📁 Repository Structure

```text
dental-caries-des-app/
├── index.html           # Standalone application with LinkedIn theme & explainer modals
├── styles.css           # LinkedIn-style light design system (#f3f2ef canvas, pastel badges, cards)
├── app.js               # Application UI controller, Chart.js integrations, 'i' button dictionary
├── simulation.js        # Core Discrete Event Simulation engine (Lindley recursion, annual layer, PSA)
├── data.js              # Preloaded baseline data (India 35 states, Table 1 & Table 2 benchmarks)
├── paper_data.json      # Structured JSON export of paper tables (T1, T2, A5-A13)
├── exporter.js          # Excel template generator, template uploader, multi-sheet results exporter, and HD 300 DPI image downloader
├── xlsx.full.min.js     # Bundled SheetJS library for 100% offline Excel file generation & parsing
├── html2canvas.min.js   # Bundled html2canvas library for high-resolution DOM element rendering
├── figures/             # High-resolution publication figures from the manuscript
│   ├── Figure1.png      # Student pathway flowchart
│   ├── Figure2.png      # Resource utilization across camp days
│   ├── Figure3.png      # Coverage across feasibility tiers
│   ├── Figure4.png      # Age-specific unique children reached
│   ├── Figure5.png      # Population-level DMFT reduction
│   ├── Figure6.png      # State annual coverage ranking & 95% UI
│   ├── Figure7.png      # Students per dentist vs coverage disparity
│   ├── Figure8.png      # Scenario grid heatmaps
│   └── Figure9.png      # PSA parameter uncertainty tornado chart
└── README.md            # Documentation and deployment guide
```

---

## 📊 Data Import, Excel Export & HD Image Downloads

1. **Excel Input Template Download (`.xlsx`)**:
   - Generates a pre-formatted, 3-sheet template (`Country_Parameters`, `Subnational_Provinces`, `Instructions`) with recommended parameter ranges, demographics, and public workforce definitions.
2. **Template Upload & Automatic Model Ingestion**:
   - Accepts `.xlsx`, `.xls`, `.csv`, and `.json`.
   - Parses custom demographics, public dentists, and subnational provinces, instantly updates the model, re-calculates Lindley queues, and refreshes national coverage and feasibility tiers.
3. **Comprehensive Multi-Sheet Results Export (`.xlsx`)**:
   - **Executive Summary**: Feasibility tiers (Status Quo, Plausible, Stretch, Theoretical Max) with ICER, costs, and WHO GDP benchmark status.
   - **Subnational State Results**: Complete 35-state / custom province disaggregation with coverage %, students/dentist, unmet caries burden, and dedicated dentists needed.
   - **Camp DES Queue Profile**: Discrete event trace of student arrivals, wait times, service durations, and completion timestamps.
   - **Scenario Grid & PSA**: 11×4 sensitivity matrix and Monte Carlo parameter Spearman rank correlation rankings.
4. **High-Definition (HD 300 DPI) Chart Images**:
   - Every Chart.js graph and the 4-track Gantt timeline include a **"Download HD Image"** button.
   - Generates 2400×1400 px crisp publication-quality PNGs with solid white background, institutional title banners, and publication citation watermarks.

---

## 🔬 Citation

If you use this model or simulation tool in academic work or policy analysis, please cite:

> **"Optimising school-based dental caries prevention through task-shifting: a state-level discrete event simulation across India"**  
> Great Lakes Institute of Management & Collaborating Dental Public Health Institutions.
