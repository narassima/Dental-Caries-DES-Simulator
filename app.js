/**
 * Dental Caries Discrete Event Simulation (DES) Platform
 * LinkedIn-Themed Light UI Controller, Interactive Animation Engine & Manuscript Plots
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Comprehensive Field Definitions Dictionary ('i' Button Explanations) ---
  const FIELD_EXPLANATIONS = {
    country_selector: {
      title: "Country Model Selection",
      category: "System Scope",
      summary: "Switches between the default empirical India model (35 States & UTs) and the Custom Country Modeler.",
      details: "By default, India is loaded with observed enrolment data (UDISE+ 2024-25), government dental surgeon counts (NHP 2022), and zonal caries prevalence. When 'Custom Country' is chosen, users can configure any country's student enrolment, public dental workforce, and caries prevalence, or load WHO global archetypes.",
      reference: "Manuscript § Materials and Methods; Table A1"
    },
    unique_children: {
      title: "Unique Children Reached",
      category: "Headline Outcome KPI",
      summary: "Annual count of individual, non-duplicate government-school children with dental caries who receive treatment.",
      details: "In months 2–10 of the school year, repeat visits (such as second fluoride applications or check-ups) consume a portion of camp slots. This metric subtracts repeat visits so each student is credited only once towards population coverage.",
      formula: "∑ U_g, where U_g is updated monthly by min(S_g - Repeat_g, P_g - U_g)",
      baseline: "4.75 Million children nationally (Plausible tier; Status quo: 0.93M; Theoretical max: 20.18M)",
      reference: "Manuscript § School-Year Layer and Health Outcomes; Table 1"
    },
    annual_coverage: {
      title: "Annual Caries Coverage (%)",
      category: "Population Reach KPI",
      summary: "Proportion of government-school children with caries (classes 1–10) reached by the program in a 10-month school year.",
      details: "Measures the extent to which school dental camps penetrate the total epidemiological burden. Demonstrates that while task-shifting expands reach, structural workforce shortages constrain national coverage to 12% in the headline scenario.",
      formula: "(Total Unique Children Reached / Total Caries Prevalent Pool P) × 100%",
      baseline: "12.03% national coverage (Plausible tier; interstate range: 2.3% in MP to 64.9% in DNH&DD)",
      reference: "Manuscript Abstract & Table 1, Table 2"
    },
    unmet_need: {
      title: "Unmet Caries Burden (Children)",
      category: "Health Deficit KPI",
      summary: "Number of government-school children with untreated dental caries remaining unserved at the end of the year.",
      details: "Untreated caries leads to odontogenic infections, severe toothache, nutritional difficulties, and school absenteeism. The unmet need represents the remaining public health deficit.",
      formula: "max(0, Total Caries Pool P - Total Unique Children Reached U)",
      baseline: "34.72 Million children nationally (Plausible tier)",
      reference: "Manuscript Results § Feasibility Tiers; Table 1"
    },
    dentists_needed: {
      title: "Additional Dedicated School Dentists Needed",
      category: "Workforce Gap KPI",
      summary: "Number of full-time, dedicated school dental surgeons required to eliminate the unmet caries burden.",
      details: "Calculated by dividing the unmet need by 1,889—the empirical annual reach of a single dedicated dentist holding 16 camps/month for 10 months with task-shifting delegation and 11.8 new children per camp.",
      formula: "Unmet Need / 1,889",
      baseline: "18,379 dedicated school dental surgeons across India (Plausible tier)",
      reference: "Manuscript Methods § Interstate Comparison and Workforce Gap; Equation 14; Table 2"
    },
    dent_util: {
      title: "Dentist Capacity Utilization (%)",
      category: "Operational Efficiency KPI",
      summary: "Percentage of a dentist's total contracted working hours spent actively performing clinical procedures during school camps.",
      details: "One school camp represents one 8-hour dentist-day. Even at 8 camps/month, dentists spend ~15% of their monthly time on school camp procedures, leaving 85% of working hours available for general hospital or community clinic duties.",
      formula: "Total Procedure Minutes / (N_av × 22 days/mo × 480 min/day × 10 months) × 100%",
      baseline: "15.0% under Plausible tier (Status quo: 3.5%; Stretch: 22.5%; Theoretical max: 41.3%)",
      reference: "Manuscript Results § Process: What Task-Shifting Releases; Table 1"
    },
    yld_inyear: {
      title: "Years Lived with Disability (YLDs) Averted — In-Year",
      category: "Health Burden Averted KPI",
      summary: "Morbidity burden averted among newly treated children during the remainder of the 12-month calendar year following treatment.",
      details: "Each treated child is weighted by the clinical effectiveness drawn for their intervention (probability condition is averted), disability weight (0.010 for caries, 0.007 for scaling), and remaining share of the 12-month year.",
      formula: "∑ Eff_New × DW × min(duration, remaining_year_share)",
      baseline: "7,028 YLDs averted in-year nationally (Plausible tier)",
      reference: "Manuscript Methods § School-Year Layer and Health Outcomes; Table 2 & Table 3"
    },
    yld_dur: {
      title: "Duration-Adjusted YLDs Averted (Discounted)",
      category: "Long-Term Health Burden KPI",
      summary: "Cumulative disability burden averted over the entire biological duration of effect of each intervention, discounted at 3% per year.",
      details: "Restorative procedures provide health benefits beyond the treatment year: 3 years for stainless steel crowns and GIC restorations, 2 years for ART and pulpectomy, and 0.5 years for OHE, fluoride varnish, and scaling.",
      formula: "∑ Eff_New × DW × [ (1 - e^(-0.03 × duration)) / 0.03 ]",
      baseline: "24,082 duration-adjusted YLDs averted nationally (Plausible tier)",
      reference: "Manuscript Methods § School-Year Layer; Table A13"
    },
    feasibility_tiers: {
      title: "Feasibility Tiers (Table 1)",
      category: "Policy Framework",
      summary: "Four structured policy deployment packages that separate realistic operational expansion from theoretical bounds.",
      details: "Tiers span from Status Quo (2 camps/mo, TS 0%) to Plausible (8 camps/mo, TS 30%, φ=0.5 — headline scenario), Stretch (12 camps/mo, TS 30%, φ=0.8), and Theoretical Maximum (22 camps/mo, φ=1.0).",
      reference: "Manuscript § Scenarios and Feasibility Tiers; Table 1"
    },
    tier_status_quo: {
      title: "Status Quo Tier",
      category: "Baseline Deployment",
      summary: "2 camps per available dentist per month, no task-shifting delegation (TS 0%), φ = 0.5.",
      details: "Dentist works alone delivering all procedures including education and fluoride. Achieves only 2.37% national coverage and leaves 38.53 Million children with untreated caries.",
      reference: "Table 1; Row 1"
    },
    tier_plausible: {
      title: "Plausible Tier (Headline Target)",
      category: "Recommended Policy",
      summary: "8 camps/month (2 school days a week), task-shifting delegation with 30% more referrals (TS 30%), φ = 0.5.",
      details: "OHE is delegated to teachers, fluoride varnish to auxiliaries, and dentists deliver clinical restorations. Achieves 12.03% coverage (4.75 Million children) with a 15% dentist utilization rate.",
      reference: "Manuscript Abstract; Results § Feasibility Tiers; Table 1"
    },
    tier_stretch: {
      title: "Stretch Tier",
      category: "High-Intensity Policy",
      summary: "12 camps/month (3 school days a week), TS 30% delegation, φ = 0.8 (80% of government dental surgeons deployed).",
      details: "Requires substantial health system reorganization to deploy 8,230 dentists for schools, achieving 27.35% coverage (10.8 Million children).",
      reference: "Table 1; Row 3"
    },
    tier_theomax: {
      title: "Theoretical Maximum Tier",
      category: "Upper Theoretical Bound",
      summary: "22 camps/month (every working day), TS 30% delegation, φ = 1.0 (100% of all 10,287 government dentists).",
      details: "Illustrates the mathematical ceiling if every public dental surgeon did nothing but school dental camps every working day. Reaches 51.15% coverage (20.18 Million children), proving that workforce supply—not camp scheduling—is the ultimate barrier.",
      reference: "Table 1; Row 4"
    },
    camps_slider: {
      title: "Camps per Available Dentist / Month",
      category: "Operational Parameter",
      summary: "Number of 8-hour dental camp days conducted by each deployed dental surgeon per month.",
      details: "A standard working month has 22 days. Holding 8 camps/month means dentists spend 2 days a week in schools and 14 days in hospitals/community clinics.",
      default: "8 camps/month (range: 2 to 22)",
      reference: "Manuscript § Camp Process and Explicit Task-Shifting; Table A2"
    },
    ts_slider: {
      title: "Task-Shifting Level (TS%)",
      category: "Clinical Delegation Parameter",
      summary: "Level of task delegation paired with expanded student referrals.",
      details: "TS = 0%: Dentist performs all admissions and treatments alone.\nTS = 10%–30%: OHE is routed to teachers; Fluoride varnish to auxiliaries (after completing admissions); Dentist performs ART, SSC, Pulpectomy, GIC, and Scaling. Because delegation frees dentist time, camps accommodate 10%–30% more referrals.",
      default: "30% TS (+30% referrals per camp)",
      reference: "Manuscript Methods § Camp Process and Explicit Task-Shifting"
    },
    phi_slider: {
      title: "Workforce Availability (φ)",
      category: "Workforce Deployment Parameter",
      summary: "Share of government-employed dental surgeons deployed for school dental camps.",
      details: "Not all public dentists can leave hospital wards and emergency clinics. φ = 0.5 assumes half of registered government dental surgeons are available for school services. In the PSA, φ is varied between 0.30 and 0.80.",
      default: "0.50 (50% availability)",
      reference: "Manuscript Methods § Workforce Available for School Services; Equation 2"
    },
    rho_slider: {
      title: "Repeat-Visit Share (ρ)",
      category: "Longitudinal Utilization Parameter",
      summary: "Share of camp slots in months 2 through 10 absorbed by children who have already been treated earlier in the school year.",
      details: "Accounts for follow-up checks, second fluoride varnish coats, or restorative reviews. Without modeling ρ, models severely overestimate unique child coverage.",
      default: "0.15 (15% repeat visit share; PSA range: 5%–30%)",
      reference: "Manuscript Methods § School-Year Layer; Table A3"
    },
    r_slider: {
      title: "Preventive Effect on OHE Need (R)",
      category: "Epidemiological Scenario Parameter",
      summary: "Simulates preventive reduction in baseline oral health education need.",
      details: "R = 5 cuts the proportion of referred students needing OHE by 5 percentage points, renormalizing remaining clinical intervention probabilities.",
      default: "R = 0 (Base case); R = 5 (Preventive scenario)",
      reference: "Table A2; Section B"
    },
    shift_length: {
      title: "Camp Shift Length (480 Minutes)",
      category: "Operational Constraint",
      summary: "Standard 8-hour school day (09:00 to 17:00 = 480 minutes).",
      details: "Each resource (Dentist, Auxiliary, Teacher) operates as a single FIFO server. A procedure is performed only if it can begin before minute 480.",
      reference: "Manuscript Methods § Camp Process; des2.py"
    },
    batch_arrival: {
      title: "Batch Student Arrival",
      category: "Queue Arrival Process",
      summary: "Referred students arrive as a batch at the beginning of the camp day.",
      details: "Base referral size is Ceil(U(8, 12)) with a mean of 10.5 students. Under task-shifting, referrals increase by 10%–30% (mean ~13.7 at TS 30%).",
      reference: "Table A2; Section F"
    },
    aux_admission: {
      title: "Auxiliary Admission (Non-Value-Added Time)",
      category: "Triage Flow",
      summary: "Non-value-added intake and triage time taken by the dental auxiliary.",
      details: "Drawn uniformly from U(0.5, 1.5) minutes per student. Auxiliary admits all students in FIFO order before becoming available for fluoride varnish.",
      reference: "Table A2; Section D"
    },
    triage_routing: {
      title: "Task-Shifting Triage Routing",
      category: "Resource Delegation",
      summary: "Automated routing of admitted students based on clinical need.",
      details: "TS = 0: All students queue for the dentist.\nTS > 0: OHE routes to trained teacher; Fluoride varnish routes to auxiliary; Clinical procedures (ART, SSC, Pulpectomy, GIC, Scaling) route to dentist.",
      reference: "Figure 1; des2.py"
    },
    shift_cutoff: {
      title: "Shift Cut-off at 480 Minutes",
      category: "Lindley Recursion Rule",
      summary: "Students whose service start time would exceed 480 minutes are recorded as unserved.",
      details: "In empirical verification (Table A14), fewer than 0.001% of referred students were left unserved under base calibration.",
      reference: "Manuscript Methods § Model Verification"
    },
    subnational_disparity: {
      title: "Subnational Structural Disparities",
      category: "Epidemiological Finding",
      summary: "Over 200-fold variation in dentist availability across Indian states.",
      details: "Ratios range from 427 students per dentist in DNH&DD to 58,543 in Madhya Pradesh and 33,174 in Chhattisgarh. Consequently, plausible coverage ranges from 2.3% in MP to 64.9% in DNH&DD.",
      reference: "Manuscript Results § Subnational Variation; Figure 6 & Figure 7"
    },
    caries_pool: {
      title: "Caries Prevalent Population (P)",
      category: "Target Burden",
      summary: "Government school students in Classes 1–10 with untreated dental caries.",
      details: "Calculated by multiplying enrolment by age-specific caries prevalence derived from Kerala baseline profile (41.71%, 34.80%, 23.48%) scaled by zone relative risk. National total: 39.5 Million children.",
      reference: "Manuscript § Population Need; Table A1"
    },
    govt_dentists: {
      title: "Government Dental Surgeons (N)",
      category: "Public Workforce Supply",
      summary: "Official count of dental surgeons employed by state health services.",
      details: "Sourced from National Health Profile (NHP 2022; Telangana from 2018; DNH&DD from 2019). Total: 10,287 government dentists across India.",
      reference: "Table A1; Table 2"
    },
    students_per_dentist: {
      title: "Students per Government Dentist Ratio",
      category: "Structural Equity Metric",
      summary: "Government school enrolment divided by government dental surgeons.",
      details: "Represents the structural workload bottleneck. States with more than 20,000 students per dentist cannot exceed 10% coverage under plausible conditions without hiring dedicated school dentists.",
      reference: "Figure 7; Table 2"
    },
    psa_uncertainty: {
      title: "Probabilistic Sensitivity Analysis (PSA) 95% UI",
      category: "Statistical Robustness",
      summary: "2.5th and 97.5th percentiles of coverage from Monte Carlo draws (capped at 200).",
      details: "Jointly samples regional gradients (Janakiram vs Pandey), prevalence anchors (±20%), φ (0.3–0.8), referral multipliers (±15%), process times (±15%), effectiveness (±20%), and durations.",
      reference: "Manuscript Methods § Uncertainty Analysis; Table A11; Figure 9"
    },
    scenario_grid: {
      title: "National Scenario Grid (Figure 8)",
      category: "Sensitivity Matrix",
      summary: "11 camp frequency levels (2 to 22) × 4 task-shifting intensities (0%, 10%, 20%, 30%).",
      details: "Simulates 44 combinations under R0 and R5. Coverage rises from 2.37% (Base TS0) to 51.15% (S22 TS30).",
      reference: "Tables A5–A13; Figure 8"
    },
    custom_country_guide: {
      title: "Custom Country & Global Modeler",
      category: "Global Adaptation",
      summary: "Enables simulation of any national or subnational health system worldwide.",
      details: "Users can enter country demographics, public dentist counts, and caries prevalence, or add subnational provinces with specific local student and dentist distributions.",
      reference: "Custom Country Modeler Tab"
    },
    global_archetypes: {
      title: "Global Archetype Presets",
      category: "International Reference",
      summary: "Pre-configured profiles representing diverse global economic tiers based on WHO oral health surveys.",
      details: "• Low-Income: Severe shortage (~40,000 students/dentist; 60% caries prev)\n• Lower-Middle: ~11,000 students/dentist; 48% prev\n• Upper-Middle: ~4,000 students/dentist; 38% prev\n• Universal Model: ~1,000 students/dentist; 22% prev",
      reference: "Custom Country Modeler Tab"
    },
    input_country_name: {
      title: "Country / System Name",
      category: "Custom Input",
      summary: "Name of the nation, state, province, or school district being modelled.",
      details: "Used in KPI summaries, charts, and downloadable JSON configurations."
    },
    input_currency: {
      title: "Currency Code / Symbol",
      category: "Custom Input",
      summary: "Local currency symbol (e.g. $, ₹, €, £, ₦, KSh, R$).",
      details: "Used for economic benchmarking."
    },
    input_dentists: {
      title: "Public / School Dental Surgeons",
      category: "Custom Input",
      summary: "Total number of dental surgeons employed by the public sector available for school programs.",
      details: "The model will calculate students per dentist and achievable coverage based on your specified workforce availability φ."
    },
    input_student_enrolment: {
      title: "Target Student Enrolment",
      category: "Custom Input",
      summary: "Number of school-age children in primary (6–8y), upper primary (9–11y), and secondary (12–15y) education.",
      details: "If you only have total enrolment, a standard demographic split is 35% primary, 33% upper primary, and 32% secondary."
    },
    input_caries_prev: {
      title: "Baseline Caries Prevalence (%)",
      category: "Custom Input",
      summary: "Percentage of children in each age group with untreated active caries.",
      details: "Typically sourced from national oral health surveys or WHO Country Oral Health Profiles."
    },
    custom_provinces: {
      title: "Subnational Provinces / Districts",
      category: "Custom Input",
      summary: "Allows disaggregating custom countries into provinces or health zones.",
      details: "Enables evaluating interstate disparities and workforce reallocation across regions in any country."
    },
    facility_des_view: {
      title: "2D Discrete Event Simulation (DES) Facility Visualizer",
      category: "Visual DES Software Simulation",
      summary: "Floorplan representation of a school dental camp showing patient queueing, provider workstations, and dynamic resource states.",
      details: "In classical Discrete Event Simulation (DES), entities (students) move chronologically through discrete states: Arrival → Queue Waiting → Service Acquisition → Treatment Completion → Discharge. Resources (Dentist, Auxiliary, Teacher) dynamically switch between BUSY and IDLE based on stochastic service durations drawn from clinical distributions.",
      reference: "Manuscript § Discrete Event Simulation Architecture; Equations 1–13"
    }
  };

  // --- Global Application State ---
  const state = {
    country: 'India',
    activeTab: 'dashboard',
    tier: 'Plausible',
    activeFigure: 'fig2',
    
    // Policy scenario parameters
    params: {
      camps: 8,
      ts: 30,
      phi: 0.5,
      rho: 0.15,
      r_pct: 0,
      ref_scale: 1.0,
      months: 10,
      gradient: 'janakiram',
      anchor: 1.0
    },

    // Single Camp Animation & Gantt State
    campAnim: {
      currentMinute: 0,
      speedMultiplier: 0.5, // 0.25 (Gentle), 0.5 (Calm Default), 1 (Normal), 2 (Fast), 5 (Turbo)
      isPlaying: false,
      intervalId: null,
      zoomMode: 'full',    // 'full', 'triage', 'midday', 'afternoon'
      filterProc: 'all'
    },

    // Monte Carlo PSA configuration
    psaConfig: {
      draws: 100,
      maxCap: 200
    },

    // Custom Country Data
    customCountry: {
      name: 'Custom Country',
      currency: 'USD',
      pop_6_8: 3000000,
      pop_9_11: 3000000,
      pop_12_15: 3000000,
      dentists: 1500,
      prev_6_8: 45.0,
      prev_9_11: 40.0,
      prev_12_15: 35.0,
      init_dmft: 1.5,
      schools: 12000,
      provinces: [
        { name: 'Northern Province', pop_total: 3000000, dentists: 400, prev_avg: 45 },
        { name: 'Southern Province', pop_total: 2500000, dentists: 500, prev_avg: 38 },
        { name: 'Eastern Province', pop_total: 2000000, dentists: 350, prev_avg: 42 },
        { name: 'Western Province', pop_total: 1500000, dentists: 250, prev_avg: 35 }
      ]
    },

    simResults: null,
    singleCampResult: null,

    // UI Table filters
    stateSearch: '',
    zoneFilter: 'All',
    sortColumn: 'coverage',
    sortAsc: false
  };

  // Reference Datasets
  const paperData = window.PAPER_DATA || {};
  const statesRaw = paperData.states_raw || [];
  const t2State = paperData.t2_state || [];

  // UI Elements
  const countrySelector = document.getElementById('countrySelect');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // Sliders
  const sliderCamps = document.getElementById('sliderCamps');
  const sliderTs = document.getElementById('sliderTs');
  const sliderPhi = document.getElementById('sliderPhi');
  const sliderRho = document.getElementById('sliderRho');
  const sliderR = document.getElementById('sliderR');

  // Badges
  const badgeCamps = document.getElementById('badgeCamps');
  const badgeTs = document.getElementById('badgeTs');
  const badgePhi = document.getElementById('badgePhi');
  const badgeRho = document.getElementById('badgeRho');
  const badgeR = document.getElementById('badgeR');

  // Modals
  const howToUseModal = document.getElementById('howToUseModal');
  const fieldExplainerModal = document.getElementById('fieldExplainerModal');
  const studentModal = document.getElementById('studentModal');
  const btnOpenGuide = document.getElementById('btnOpenGuide');

  // Chart References
  let chartTiers = null;
  let chartStates = null;
  let chartScatter = null;
  let chartPsa = null;
  let chartManuscript = null;

  // --- Initialize Application ---
  function init() {
    window.showStudentModal = showStudentModal;
    setupEventListeners();
    setupInfoButtons();
    setupGanttAndAnimation();
    setupPsaDrawsControls();
    setupManuscriptPlots();
    runSimulation();
    runSingleCampSimulation(false); // don't auto-play on init
    renderCustomCountryForm();
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Open How to Use Guide
    if (btnOpenGuide) {
      btnOpenGuide.addEventListener('click', () => {
        howToUseModal.classList.add('active');
      });
    }

    // Open How to Use Guide from Tab 7 Docs button
    const btnOpenGuideFromDocs = document.getElementById('btnOpenGuideFromDocs');
    if (btnOpenGuideFromDocs) {
      btnOpenGuideFromDocs.addEventListener('click', () => {
        if (howToUseModal) howToUseModal.classList.add('active');
      });
    }

    // Guide Nav Pills Smooth Scrolling inside Modal Dialog
    const guidePills = document.querySelectorAll('.guide-nav-pill');
    guidePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        guidePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const targetId = pill.getAttribute('href').replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Country Switcher
    countrySelector.addEventListener('change', (e) => {
      state.country = e.target.value;
      const customNotice = document.getElementById('customCountryNotice');
      if (customNotice) {
        customNotice.style.display = state.country === 'Custom' ? 'block' : 'none';
      }
      runSimulation();
    });

    // Tab Navigation
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.tab-btn') || btn;
        const tabId = tabBtn.getAttribute('data-tab');
        if (tabId) switchTab(tabId);
      });
    });

    // Camp DES Live Sliders
    const sliderCampTs = document.getElementById('sliderCampTs');
    const badgeCampTs = document.getElementById('badgeCampTs');
    const sliderCampCamps = document.getElementById('sliderCampCamps');
    const badgeCampCamps = document.getElementById('badgeCampCamps');
    const sliderCampBatchScale = document.getElementById('sliderCampBatchScale');
    const badgeCampBatchScale = document.getElementById('badgeCampBatchScale');
    const sliderCampR = document.getElementById('sliderCampR');
    const badgeCampR = document.getElementById('badgeCampR');
    const sliderCampPhi = document.getElementById('sliderCampPhi');
    const badgeCampPhi = document.getElementById('badgeCampPhi');

    // Dashboard Policy Sliders (Synchronized to Camp DES Sliders)
    sliderCamps.addEventListener('input', (e) => {
      state.params.camps = parseInt(e.target.value, 10);
      badgeCamps.textContent = `${state.params.camps} camps/mo`;
      if (sliderCampCamps) sliderCampCamps.value = state.params.camps;
      if (badgeCampCamps) badgeCampCamps.textContent = `${state.params.camps} camps/mo`;
      highlightCustomTier();
      runSimulation();
      runSingleCampSimulation(false);
    });

    sliderTs.addEventListener('input', (e) => {
      state.params.ts = parseInt(e.target.value, 10);
      badgeTs.textContent = `${state.params.ts}% TS`;
      if (sliderCampTs) sliderCampTs.value = state.params.ts;
      if (badgeCampTs) badgeCampTs.textContent = `${state.params.ts}% TS`;
      highlightCustomTier();
      runSimulation();
      runSingleCampSimulation(false);
    });

    sliderPhi.addEventListener('input', (e) => {
      state.params.phi = parseFloat(e.target.value);
      badgePhi.textContent = `φ = ${state.params.phi.toFixed(2)}`;
      if (sliderCampPhi) sliderCampPhi.value = state.params.phi;
      if (badgeCampPhi) badgeCampPhi.textContent = `φ = ${state.params.phi.toFixed(2)}`;
      highlightCustomTier();
      runSimulation();
      runSingleCampSimulation(false);
    });

    sliderRho.addEventListener('input', (e) => {
      state.params.rho = parseFloat(e.target.value);
      badgeRho.textContent = `ρ = ${(state.params.rho * 100).toFixed(0)}%`;
      runSimulation();
      runSingleCampSimulation(false);
    });

    sliderR.addEventListener('input', (e) => {
      state.params.r_pct = parseInt(e.target.value, 10);
      badgeR.textContent = `R = ${state.params.r_pct}%`;
      if (sliderCampR) sliderCampR.value = state.params.r_pct;
      if (badgeCampR) badgeCampR.textContent = `R = ${state.params.r_pct}%`;
      runSimulation();
      runSingleCampSimulation(false);
    });

    // Camp DES Tab Live Sliders (Synchronized to Dashboard Sliders)
    if (sliderCampTs) {
      sliderCampTs.addEventListener('input', (e) => {
        state.params.ts = parseInt(e.target.value, 10);
        badgeCampTs.textContent = `${state.params.ts}% TS`;
        sliderTs.value = state.params.ts;
        badgeTs.textContent = `${state.params.ts}% TS`;
        highlightCustomTier();
        runSimulation();
        runSingleCampSimulation(false);
      });
    }

    if (sliderCampCamps) {
      sliderCampCamps.addEventListener('input', (e) => {
        state.params.camps = parseInt(e.target.value, 10);
        badgeCampCamps.textContent = `${state.params.camps} camps/mo`;
        sliderCamps.value = state.params.camps;
        badgeCamps.textContent = `${state.params.camps} camps/mo`;
        highlightCustomTier();
        runSimulation();
        runSingleCampSimulation(false);
      });
    }

    if (sliderCampBatchScale) {
      sliderCampBatchScale.addEventListener('input', (e) => {
        state.params.ref_scale = parseFloat(e.target.value);
        badgeCampBatchScale.textContent = `${state.params.ref_scale.toFixed(1)}× (~${Math.round(14 * state.params.ref_scale)} std)`;
        runSingleCampSimulation(false);
      });
    }

    if (sliderCampR) {
      sliderCampR.addEventListener('input', (e) => {
        state.params.r_pct = parseInt(e.target.value, 10);
        badgeCampR.textContent = `R = ${state.params.r_pct}%`;
        sliderR.value = state.params.r_pct;
        badgeR.textContent = `R = ${state.params.r_pct}%`;
        runSimulation();
        runSingleCampSimulation(false);
      });
    }

    if (sliderCampPhi) {
      sliderCampPhi.addEventListener('input', (e) => {
        state.params.phi = parseFloat(e.target.value);
        badgeCampPhi.textContent = `φ = ${state.params.phi.toFixed(2)}`;
        sliderPhi.value = state.params.phi;
        badgePhi.textContent = `φ = ${state.params.phi.toFixed(2)}`;
        highlightCustomTier();
        runSimulation();
        runSingleCampSimulation(false);
      });
    }

    // Quick Tier Buttons on Camp Tab
    document.querySelectorAll('.btn-camp-tier').forEach(btn => {
      btn.addEventListener('click', () => {
        const tierName = btn.getAttribute('data-tier');
        selectFeasibilityTier(tierName);
      });
    });

    // Tier Cards Click
    document.querySelectorAll('.tier-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.info-btn')) return;
        const tierName = card.getAttribute('data-tier');
        selectFeasibilityTier(tierName);
      });
    });

    // State Search & Zone Filter
    const searchInput = document.getElementById('stateSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.stateSearch = e.target.value.toLowerCase();
        renderStatesTable();
      });
    }

    // Zonal Filter Pills & Dropdown Synchronization (Tab 4)
    const zoneSelect = document.getElementById('zoneFilterSelect');
    const zonalPills = document.querySelectorAll('.zonal-pill');

    zonalPills.forEach(pill => {
      pill.addEventListener('click', () => {
        zonalPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const zone = pill.getAttribute('data-zone') || 'All';
        if (zoneSelect) zoneSelect.value = zone;
        state.zoneFilter = zone;
        renderStatesTable();
      });
    });

    if (zoneSelect) {
      zoneSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        state.zoneFilter = val;
        zonalPills.forEach(p => {
          p.classList.toggle('active', (p.getAttribute('data-zone') || 'All') === val);
        });
        renderStatesTable();
      });
    }

    // Modal Close Handlers (Top X, Bottom button, Backdrop click, Escape key)
    document.querySelectorAll('.modal-close-btn, .modal-close-btn-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
        else document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      }
    });

    // Custom Country Form
    const formCustom = document.getElementById('formCustomCountry');
    if (formCustom) {
      formCustom.addEventListener('submit', (e) => {
        e.preventDefault();
        saveCustomCountryForm();
      });
    }

    // Presets
    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        applyCountryPreset(preset);
      });
    });

    // Export/Import JSON
    const btnExportCountry = document.getElementById('btnExportCountry');
    if (btnExportCountry) btnExportCountry.addEventListener('click', exportCountryJson);

    const fileImportCountry = document.getElementById('fileImportCountry');
    if (fileImportCountry) fileImportCountry.addEventListener('change', importCountryJson);

    const btnClearLog = document.getElementById('btnClearLog');
    if (btnClearLog) {
      btnClearLog.addEventListener('click', () => {
        const logBox = document.getElementById('campEventLog');
        if (logBox) logBox.innerHTML = '<div class="log-entry"><span class="time">[Log Cleared]</span> Ready.</div>';
      });
    }

    // --- Excel Template Download Handlers ---
    const handleDownloadTemplate = () => {
      if (window.DES_EXPORTER) {
        window.DES_EXPORTER.downloadInputTemplate();
      } else {
        alert('Exporter module is still loading. Please try again.');
      }
    };
    const btnDownloadTemplate = document.getElementById('btnDownloadTemplate');
    if (btnDownloadTemplate) btnDownloadTemplate.addEventListener('click', handleDownloadTemplate);

    const btnCustomDownloadTemplate = document.getElementById('btnCustomDownloadTemplate');
    if (btnCustomDownloadTemplate) btnCustomDownloadTemplate.addEventListener('click', handleDownloadTemplate);

    // --- Excel / CSV / JSON Template Upload Handlers ---
    const handleTemplateUploadFile = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!window.DES_EXPORTER) {
        alert('Exporter module is still loading. Please try again.');
        return;
      }

      window.DES_EXPORTER.uploadInputTemplate(
        file,
        (parsedConfig, format) => {
          if (parsedConfig.name) state.customCountry.name = parsedConfig.name;
          if (parsedConfig.currency) state.customCountry.currency = parsedConfig.currency;
          if (parsedConfig.pop_6_8) state.customCountry.pop_6_8 = parsedConfig.pop_6_8;
          if (parsedConfig.pop_9_11) state.customCountry.pop_9_11 = parsedConfig.pop_9_11;
          if (parsedConfig.pop_12_15) state.customCountry.pop_12_15 = parsedConfig.pop_12_15;
          if (parsedConfig.dentists) state.customCountry.dentists = parsedConfig.dentists;
          if (parsedConfig.prev_6_8 !== undefined) state.customCountry.prev_6_8 = parsedConfig.prev_6_8;
          if (parsedConfig.prev_9_11 !== undefined) state.customCountry.prev_9_11 = parsedConfig.prev_9_11;
          if (parsedConfig.prev_12_15 !== undefined) state.customCountry.prev_12_15 = parsedConfig.prev_12_15;
          if (parsedConfig.init_dmft !== undefined) state.customCountry.init_dmft = parsedConfig.init_dmft;
          if (parsedConfig.camps) state.params.camps = parsedConfig.camps;
          if (parsedConfig.ts !== undefined) state.params.ts = parsedConfig.ts;
          if (parsedConfig.phi !== undefined) state.params.phi = parsedConfig.phi;

          if (parsedConfig.provinces && parsedConfig.provinces.length > 0) {
            state.customCountry.provinces = parsedConfig.provinces;
          }

          // Switch active country to Custom
          state.country = 'Custom';
          const countrySelector = document.getElementById('countrySelect');
          if (countrySelector) countrySelector.value = 'Custom';

          const customNotice = document.getElementById('customCountryNotice');
          if (customNotice) customNotice.style.display = 'block';

          renderCustomCountryForm();
          runSimulation();

          alert(`Template Loaded Successfully!\n\n• Model: ${state.customCountry.name}\n• Subnational Provinces: ${state.customCountry.provinces ? state.customCountry.provinces.length : 0}\n• Public Dentists: ${state.customCountry.dentists.toLocaleString()}\n• Operational Camps: ${state.params.camps}/mo (TS ${state.params.ts}%)\n\nDiscrete event simulation re-calculated across all tiers & provinces.`);
        },
        (errMsg) => {
          alert('Template Upload Error:\n' + errMsg);
        }
      );
      e.target.value = '';
    };

    const fileUploadTemplate = document.getElementById('fileUploadTemplate');
    if (fileUploadTemplate) fileUploadTemplate.addEventListener('change', handleTemplateUploadFile);

    const fileCustomUploadTemplate = document.getElementById('fileCustomUploadTemplate');
    if (fileCustomUploadTemplate) fileCustomUploadTemplate.addEventListener('change', handleTemplateUploadFile);

    // --- Export Results as Excel (.xlsx) Handlers ---
    const handleExportResultsExcel = () => {
      if (window.DES_EXPORTER) {
        window.DES_EXPORTER.exportResultsToExcel(state, window.DATA_STORE || {});
      } else {
        alert('Exporter module is still loading. Please try again.');
      }
    };

    const btnExportResultsExcel = document.getElementById('btnExportResultsExcel');
    if (btnExportResultsExcel) btnExportResultsExcel.addEventListener('click', handleExportResultsExcel);

    const btnCustomExportResults = document.getElementById('btnCustomExportResults');
    if (btnCustomExportResults) btnCustomExportResults.addEventListener('click', handleExportResultsExcel);

    // --- High-Definition (HD 300 DPI) Chart & Element Image Downloads ---
    const btnDownloadGanttHD = document.getElementById('btnDownloadGanttHD');
    if (btnDownloadGanttHD) {
      btnDownloadGanttHD.addEventListener('click', () => {
        if (window.DES_EXPORTER) {
          window.DES_EXPORTER.downloadChartHD(
            'timelineContainer',
            'Camp_Schedule_Gantt_Timeline_HD',
            'Camp Discrete Event Simulation Schedule (480 Min)',
            'Separate non-overlapping tracks: Dentist, Auxiliary Admissions, Auxiliary Fluoride, Teacher'
          );
        }
      });
    }

    document.querySelectorAll('.btn-hd-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const chartId = btn.getAttribute('data-chart-id');
        const title = btn.getAttribute('data-title') || 'Dental Caries DES Output';
        const subtitle = btn.getAttribute('data-subtitle') || 'Discrete Event Simulation Platform';
        if (window.DES_EXPORTER && chartId) {
          window.DES_EXPORTER.downloadChartHD(chartId, chartId + '_HD', title, subtitle);
        }
      });
    });
  }

  // --- Setup 'i' Info Buttons ---
  function setupInfoButtons() {
    document.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fieldKey = btn.getAttribute('data-field');
        showFieldExplainer(fieldKey);
      });
    });
  }

  function showFieldExplainer(fieldKey) {
    const info = FIELD_EXPLANATIONS[fieldKey];
    if (!info) return;

    const titleEl = document.getElementById('explainerTitle');
    const badgeEl = document.getElementById('explainerBadge');
    const bodyEl = document.getElementById('explainerBody');

    titleEl.textContent = info.title;
    badgeEl.textContent = info.category || 'MODEL FIELD';

    let html = `
      <div class="explainer-box">
        <strong>Overview:</strong> ${info.summary}
      </div>
    `;

    if (info.details) {
      html += `<p style="margin-bottom:12px;">${info.details}</p>`;
    }

    if (info.formula) {
      html += `
        <div style="margin:10px 0;">
          <strong style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim);">Formula / Definition:</strong>
          <div class="math-block">${info.formula}</div>
        </div>
      `;
    }

    if (info.baseline) {
      html += `
        <div style="background:var(--pastel-green-bg); border:1px solid var(--pastel-green-border); border-radius:6px; padding:10px 14px; margin:10px 0; font-size:0.82rem; color:var(--pastel-green-text);">
          <strong>Baseline Reference:</strong> ${info.baseline}
        </div>
      `;
    }

    if (info.default) {
      html += `
        <div style="background:var(--pastel-blue-bg); border:1px solid var(--pastel-blue-border); border-radius:6px; padding:10px 14px; margin:10px 0; font-size:0.82rem; color:var(--pastel-blue-text);">
          <strong>Default Setting:</strong> ${info.default}
        </div>
      `;
    }

    if (info.reference) {
      html += `
        <div style="margin-top:12px; font-size:0.75rem; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:8px;">
          <i class="fas fa-bookmark" style="color:var(--primary);"></i> <strong>Source:</strong> ${info.reference}
        </div>
      `;
    }

    bodyEl.innerHTML = html;
    fieldExplainerModal.classList.add('active');
  }

  // --- Tab Navigation ---
  function switchTab(tabId) {
    state.activeTab = tabId;
    tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
    tabPanels.forEach(p => p.classList.toggle('active', p.id === `tab-${tabId}`));

    if (tabId === 'dashboard') {
      setTimeout(() => renderTiersChart(), 50);
    } else if (tabId === 'states') {
      setTimeout(() => {
        renderStateCoverageChart();
        renderScatterPlot();
      }, 50);
    } else if (tabId === 'scenarios') {
      setTimeout(() => renderScenarioHeatmap(), 50);
    } else if (tabId === 'manuscript-plots') {
      setTimeout(() => renderActiveManuscriptPlot(), 50);
    }
  }

  // --- Feasibility Tiers Selection ---
  function selectFeasibilityTier(tierName) {
    state.tier = tierName;
    document.querySelectorAll('.tier-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-tier') === tierName);
    });

    if (tierName === 'Status quo') {
      state.params.camps = 2;
      state.params.ts = 0;
      state.params.phi = 0.5;
    } else if (tierName === 'Plausible') {
      state.params.camps = 8;
      state.params.ts = 30;
      state.params.phi = 0.5;
    } else if (tierName === 'Stretch') {
      state.params.camps = 12;
      state.params.ts = 30;
      state.params.phi = 0.8;
    } else if (tierName === 'Theoretical max') {
      state.params.camps = 22;
      state.params.ts = 30;
      state.params.phi = 1.0;
    }

    sliderCamps.value = state.params.camps;
    badgeCamps.textContent = `${state.params.camps} camps/mo`;
    sliderTs.value = state.params.ts;
    badgeTs.textContent = `${state.params.ts}% TS`;
    sliderPhi.value = state.params.phi;
    badgePhi.textContent = `φ = ${state.params.phi.toFixed(2)}`;

    // Sync Camp DES Sliders
    const sliderCampCamps = document.getElementById('sliderCampCamps');
    const badgeCampCamps = document.getElementById('badgeCampCamps');
    const sliderCampTs = document.getElementById('sliderCampTs');
    const badgeCampTs = document.getElementById('badgeCampTs');
    const sliderCampPhi = document.getElementById('sliderCampPhi');
    const badgeCampPhi = document.getElementById('badgeCampPhi');

    if (sliderCampCamps) sliderCampCamps.value = state.params.camps;
    if (badgeCampCamps) badgeCampCamps.textContent = `${state.params.camps} camps/mo`;
    if (sliderCampTs) sliderCampTs.value = state.params.ts;
    if (badgeCampTs) badgeCampTs.textContent = `${state.params.ts}% TS`;
    if (sliderCampPhi) sliderCampPhi.value = state.params.phi;
    if (badgeCampPhi) badgeCampPhi.textContent = `φ = ${state.params.phi.toFixed(2)}`;

    document.querySelectorAll('.btn-camp-tier').forEach(b => {
      const match = b.getAttribute('data-tier') === tierName;
      b.classList.toggle('active', match);
      b.className = match ? 'btn btn-secondary btn-sm btn-camp-tier active' : 'btn btn-outline btn-sm btn-camp-tier';
    });

    runSimulation();
    runSingleCampSimulation(false);
  }

  function highlightCustomTier() {
    state.tier = 'Custom';
    document.querySelectorAll('.tier-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.btn-camp-tier').forEach(b => {
      b.classList.remove('active');
      b.className = 'btn btn-outline btn-sm btn-camp-tier';
    });
  }

  // --- Core Simulation Runner ---
  function runSimulation() {
    let entities = [];

    if (state.country === 'India') {
      entities = statesRaw.map(st => {
        const p = st.enr_primary_1_5 || 0;
        const u = st.enr_upper_primary_6_8 || 0;
        const s = st.enr_secondary_9_10 || 0;
        return {
          state: st.state,
          zone: st.zone,
          dentists: st.dentists,
          schools: st.govt_schools,
          enr_primary_1_5: p,
          enr_upper_primary_6_8: u,
          enr_secondary_9_10: s,
          pop_6_8: p * 3 / 5,
          pop_9_11: p * 2 / 5 + u / 3,
          pop_12_15: u * 2 / 3 + s,
          govt_enr_1_10: p + u + s
        };
      });
    } else {
      const cc = state.customCountry;
      if (cc.provinces && cc.provinces.length > 0) {
        entities = cc.provinces.map(p => ({
          state: p.name,
          zone: 'Custom',
          dentists: p.dentists,
          schools: Math.round(p.pop_total / 250),
          pop_6_8: p.pop_total * 0.35,
          pop_9_11: p.pop_total * 0.33,
          pop_12_15: p.pop_total * 0.32,
          govt_enr_1_10: p.pop_total
        }));
      } else {
        entities = [{
          state: cc.name,
          zone: 'Custom',
          dentists: cc.dentists,
          schools: cc.schools || 5000,
          pop_6_8: cc.pop_6_8,
          pop_9_11: cc.pop_9_11,
          pop_12_15: cc.pop_12_15,
          govt_enr_1_10: cc.pop_6_8 + cc.pop_9_11 + cc.pop_12_15
        }];
      }
    }

    const stateResults = entities.map(ent => {
      return window.DesEngine.simulateYear(ent, state.params.camps, state.params.ts, state.params.r_pct, {
        phi: state.params.phi,
        rho: state.params.rho,
        months: state.params.months,
        gradient: state.params.gradient,
        anchor: state.params.anchor,
        ref_scale: state.params.ref_scale
      });
    });

    const national = {
      dentists: stateResults.reduce((a, b) => a + b.dentists, 0),
      n_av: stateResults.reduce((a, b) => a + b.n_av, 0),
      camps: stateResults.reduce((a, b) => a + b.camps, 0),
      referred: stateResults.reduce((a, b) => a + b.referred, 0),
      served: stateResults.reduce((a, b) => a + b.served, 0),
      repeat: stateResults.reduce((a, b) => a + b.repeat, 0),
      unique: stateResults.reduce((a, b) => a + b.unique, 0),
      pool: stateResults.reduce((a, b) => a + b.pool, 0),
      unmet: stateResults.reduce((a, b) => a + b.unmet, 0),
      idle: stateResults.reduce((a, b) => a + b.idle, 0),
      yld_inyear: stateResults.reduce((a, b) => a + b.yld_inyear, 0),
      yld_dur: stateResults.reduce((a, b) => a + b.yld_dur, 0),
      dedicated_dentists_needed: stateResults.reduce((a, b) => a + b.dedicated_dentists_needed, 0),
      coverage: 0,
      dent_util: 0
    };

    national.coverage = national.pool > 0 ? (national.unique / national.pool) * 100.0 : 0;
    national.repeatShare = national.served > 0 ? (national.repeat / national.served) * 100.0 : 0;

    const totalDentWorkMin = national.n_av * 22 * 480 * state.params.months;
    const totalDentProcMin = stateResults.reduce((acc, s) => acc + (s.dent_util / 100.0) * (s.n_av * 22 * 480 * state.params.months), 0);
    national.dent_util = totalDentWorkMin > 0 ? (totalDentProcMin / totalDentWorkMin) * 100.0 : 0;

    state.simResults = { national, states: stateResults };

    updateKPIDashboard();
    renderStatesTable();
    renderTiersChart();
    renderStateCoverageChart();
    renderScatterPlot();
  }

  function updateKPIDashboard() {
    const nat = state.simResults.national;

    document.getElementById('kpiUniqueReached').textContent = formatNumberM(nat.unique);
    document.getElementById('kpiCoverage').textContent = `${nat.coverage.toFixed(1)}%`;
    document.getElementById('kpiUnmetNeed').textContent = formatNumberM(nat.unmet);
    document.getElementById('kpiDentistsNeeded').textContent = Math.round(nat.dedicated_dentists_needed).toLocaleString();
    document.getElementById('kpiDentUtil').textContent = `${nat.dent_util.toFixed(1)}%`;
    document.getElementById('kpiYldInYear').textContent = Math.round(nat.yld_inyear).toLocaleString();
    document.getElementById('kpiYldDur').textContent = Math.round(nat.yld_dur).toLocaleString();

    const contextBadge = document.getElementById('activeScenarioBadge');
    if (contextBadge) {
      contextBadge.textContent = `${state.country}: ${state.tier} (${state.params.camps} camps/mo, TS ${state.params.ts}%, φ=${state.params.phi})`;
    }

    updatePolicyBriefing();
  }

  // --- Executive Policy Briefing Generator (Plain English for Decision Makers) ---
  function updatePolicyBriefing() {
    if (!state.simResults || !state.simResults.national) return;
    const nat = state.simResults.national;

    const elTierTag = document.getElementById('briefingTierTag');
    const elBody = document.getElementById('policyBriefingBody');
    const elTotalNeed = document.getElementById('briefingTotalNeed');
    const elReached = document.getElementById('briefingReached');
    const elDentistSaved = document.getElementById('briefingDentistSaved');
    const elDentistsNeeded = document.getElementById('briefingDentistsNeeded');

    const countryName = state.country || 'India';
    const tierName = state.tier || 'Custom';
    const reachedM = formatNumberM(nat.unique);
    const poolM = formatNumberM(nat.pool);
    const unmetM = formatNumberM(nat.unmet);
    const coveragePct = nat.coverage.toFixed(1);
    const dentistUtilPct = nat.dent_util.toFixed(1);
    const dentistSavedPct = Math.max(0, 100 - nat.dent_util).toFixed(1);
    const dentistsNeededFormatted = Math.round(nat.dedicated_dentists_needed).toLocaleString();

    if (elTierTag) {
      if (tierName === 'Plausible') elTierTag.textContent = 'Recommended Policy (Plausible Tier)';
      else if (tierName === 'Status quo') elTierTag.textContent = 'Current Practice (Status Quo Baseline)';
      else if (tierName === 'Stretch') elTierTag.textContent = 'Expanded Outreach (Stretch Tier)';
      else if (tierName === 'Theoretical max') elTierTag.textContent = 'Maximum Capacity (Theoretical Upper Bound)';
      else elTierTag.textContent = 'Custom Policy Scenario Active';
    }

    if (elTotalNeed) elTotalNeed.textContent = `${poolM} Children`;
    if (elReached) elReached.textContent = `${reachedM} (${coveragePct}%)`;
    if (elDentistSaved) elDentistSaved.textContent = `${dentistSavedPct}% for Hospital Clinics`;
    if (elDentistsNeeded) elDentistsNeeded.textContent = `${dentistsNeededFormatted} Dedicated Dentists`;

    if (elBody) {
      let narrative = '';
      if (tierName === 'Status quo') {
        narrative = `Under the <strong>Status Quo Baseline</strong> (2 camps/month per dentist, 0% delegation): Dentists work alone without auxiliary support. The outreach reaches <strong>${reachedM}</strong> children per year (only <strong>${coveragePct}%</strong> of the ${poolM} with untreated caries in ${countryName}). A massive unmet gap of <strong>${unmetM}</strong> children remains unserved. <strong>${dentistsNeededFormatted}</strong> additional dedicated dentists would be needed to close this gap under solo practice.`;
      } else if (tierName === 'Plausible') {
        narrative = `Under the recommended <strong>Plausible Tier</strong> (8 camps/month per dentist, 30% task delegation): School camps deliver care to <strong>${reachedM}</strong> unique children per year (<strong>${coveragePct}%</strong> national coverage). By delegating preventive fluoride varnish to auxiliary nurses and tooth-brushing drills to teachers, <strong>${dentistSavedPct}%</strong> of dentist contracted capacity is preserved for complex restorative hospital care. To eliminate the remaining <strong>${unmetM}</strong> unreached caries burden, <strong>${dentistsNeededFormatted}</strong> dedicated school dentists are needed.`;
      } else if (tierName === 'Stretch') {
        narrative = `Under the <strong>Stretch Tier</strong> (12 camps/month per dentist, 30% delegation, 80% workforce deployment): Outreach expands significantly to reach <strong>${reachedM}</strong> children annually (<strong>${coveragePct}%</strong> national coverage). Dentists spend ${dentistUtilPct}% of monthly time on school camp procedures while <strong>${dentistSavedPct}%</strong> remains protected for hospital wards. The unmet caries burden decreases to <strong>${unmetM}</strong> children, with <strong>${dentistsNeededFormatted}</strong> dedicated dentists needed to close the remaining gap.`;
      } else if (tierName === 'Theoretical max') {
        narrative = `Under the <strong>Theoretical Maximum Bound</strong> (22 camps/month, daily deployment of 100% of public dentists): Outreach reaches an upper bound of <strong>${reachedM}</strong> children per year (<strong>${coveragePct}%</strong> coverage). This intensive daily deployment consumes ${dentistUtilPct}% of all public dentist working hours nationwide, leaving <strong>${unmetM}</strong> children unserved due to finite national dentist supply.`;
      } else {
        narrative = `Under this <strong>Custom Scenario</strong> (${state.params.camps} camps/mo, ${state.params.ts}% team delegation, φ=${state.params.phi.toFixed(2)}): The simulation yields <strong>${reachedM}</strong> unique children treated annually (<strong>${coveragePct}%</strong> of the ${poolM} caries burden in ${countryName}). Dentists spend ${dentistUtilPct}% of their contracted hours on school camp procedures, preserving <strong>${dentistSavedPct}%</strong> for hospital clinics. Eliminating the remaining unmet gap of <strong>${unmetM}</strong> children requires <strong>${dentistsNeededFormatted}</strong> dedicated dental surgeons.`;
      }
      elBody.innerHTML = narrative;
    }
  }

  // =========================================================================
  // ANIMATED GANTT TIMELINE & INTERACTIVE CAMP STUDIO
  // =========================================================================

  function setupGanttAndAnimation() {
    // Play/Pause button
    const btnPlay = document.getElementById('btnPlayCamp');
    const btnPause = document.getElementById('btnPauseCamp');
    const btnStep = document.getElementById('btnStepCamp');
    const btnReset = document.getElementById('btnResetCamp');
    const btnInstant = document.getElementById('btnInstantCamp');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (state.campAnim.isPlaying) {
          pauseCampAnimation();
        } else {
          startCampAnimation();
        }
      });
    }

    if (btnPause) btnPause.addEventListener('click', pauseCampAnimation);
    if (btnStep) btnStep.addEventListener('click', stepCampAnimation);
    if (btnReset) btnReset.addEventListener('click', () => runSingleCampSimulation(false));
    if (btnInstant) btnInstant.addEventListener('click', instantCompleteCamp);

    // Speed chips
    document.querySelectorAll('.speed-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.speed-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.campAnim.speedMultiplier = parseFloat(chip.getAttribute('data-speed'));
        if (state.campAnim.isPlaying) {
          pauseCampAnimation();
          startCampAnimation();
        }
      });
    });

    // Zoom buttons
    document.querySelectorAll('.zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.zoom-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.campAnim.zoomMode = btn.getAttribute('data-zoom');
        updateTimelineHeaderHours();
        renderGanttTracks(state.singleCampResult);
      });
    });

    // Procedure Legend Click Filter
    document.querySelectorAll('.legend-flag-item').forEach(item => {
      item.addEventListener('click', () => {
        const filter = item.getAttribute('data-filter');
        state.campAnim.filterProc = filter;
        highlightGanttProcedure(filter);
      });
    });

    // Segmented Sub-View Switcher (Floorplan | Gantt | Students)
    const subnavBtns = document.querySelectorAll('.subnav-btn');
    const subviewFloorplan = document.getElementById('campSubViewFloorplan');
    const subviewGantt = document.getElementById('campSubViewGantt');
    const subviewStudents = document.getElementById('campSubViewStudents');

    subnavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subnavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.getAttribute('data-subview');

        if (subviewFloorplan) subviewFloorplan.style.display = (view === 'floorplan') ? 'block' : 'none';
        if (subviewGantt) {
          subviewGantt.style.display = (view === 'gantt') ? 'block' : 'none';
          if (view === 'gantt' && state.singleCampResult) {
            renderGanttTracks(state.singleCampResult);
          }
        }
        if (subviewStudents) subviewStudents.style.display = (view === 'students') ? 'block' : 'none';
      });
    });

    // Collapsible Camp Sliders Drawer
    const btnToggleCampSliders = document.getElementById('btnToggleCampSliders');
    const campSlidersPanel = document.getElementById('campSlidersPanel');
    if (btnToggleCampSliders && campSlidersPanel) {
      btnToggleCampSliders.addEventListener('click', () => {
        campSlidersPanel.classList.toggle('collapsed');
      });
    }

    // Collapsible Dashboard Sliders Drawer
    const btnToggleDashSliders = document.getElementById('btnToggleDashSliders');
    const dashSlidersPanel = document.getElementById('dashSlidersPanel');
    if (btnToggleDashSliders && dashSlidersPanel) {
      btnToggleDashSliders.addEventListener('click', () => {
        dashSlidersPanel.classList.toggle('collapsed');
      });
    }
  }

  function runSingleCampSimulation(autoPlay = false) {
    pauseCampAnimation();
    state.campAnim.currentMinute = 0;
    updateCampClock(0);

    const res = window.DesEngine.simulateSingleCamp({
      ts: state.params.ts,
      r_pct: state.params.r_pct,
      pt_mult: 1.0,
      eff_mult: 1.0,
      ref_scale: state.params.ref_scale
    });

    state.singleCampResult = res;

    // Reset event log flags for fresh chronological feed
    if (res && res.students) {
      res.students.forEach(s => {
        s._loggedAdmStart = false;
        s._loggedAdmEnd = false;
        s._loggedService = false;
      });
    }

    // Update Camp KPIs
    document.getElementById('campReferredCount').textContent = res.n_referred;
    document.getElementById('campServedCount').textContent = res.n_served;
    document.getElementById('campUnservedCount').textContent = res.n_unserved;
    document.getElementById('campDentBusy').textContent = `${Math.round(res.dent_busy_min)} min (${res.dent_util_camp.toFixed(1)}%)`;
    document.getElementById('campAuxBusy').textContent = `${Math.round(res.aux_busy_min)} min (${res.aux_util_camp.toFixed(1)}%)`;
    document.getElementById('campTeachBusy').textContent = `${Math.round(res.teach_busy_min)} min (${res.teach_util_camp.toFixed(1)}%)`;

    // Update Sub-View Badge & Student Count
    const badgeSubnav = document.getElementById('campSubnavStudentBadge');
    if (badgeSubnav) badgeSubnav.textContent = res.n_referred;
    const lblCount = document.getElementById('lblCampStudentCount');
    if (lblCount) lblCount.textContent = res.n_referred;

    // Clear and initialize Event Log
    const logBox = document.getElementById('campEventLog');
    if (logBox) {
      logBox.innerHTML = `
        <div class="log-entry"><span class="time">[09:00 AM / 0m]</span> <strong>Camp Opened.</strong> Batch of ${res.n_referred} students arrived at school.</div>
      `;
    }

    // Update Flowchart Descriptions
    document.getElementById('stepArrivalDesc').textContent = `${res.n_referred} students arrived`;
    document.getElementById('stepAdmissionDesc').textContent = `Auxiliary triage in progress`;
    document.getElementById('stepRoutingDesc').textContent = `${state.params.ts > 0 ? 'Delegation active' : 'Dentist only'}`;
    document.getElementById('stepTreatmentDesc').textContent = `${res.n_served} served, ${res.n_unserved} cut-off`;

    updateTimelineHeaderHours();
    renderGanttTracks(res);
    renderCampStudentsList(res.students);
    updateFacilityViewAtMinute(0);

    if (autoPlay) {
      startCampAnimation();
    }
  }

  function startCampAnimation() {
    if (!state.singleCampResult) return;
    state.campAnim.isPlaying = true;
    document.getElementById('btnPlayCamp').innerHTML = '<i class="fas fa-pause"></i> <span>Pause Animation</span>';

    // Calibrated comprehension pace:
    // 0.25x Gentle: 280ms / min (total 480m shift ~134s; a 10m procedure is on screen for 2.8s)
    // 0.5x Calm (Default): 140ms / min (total 480m shift ~67s; a 10m procedure is on screen for 1.4s)
    // 1.0x Normal: 70ms / min (~33s)
    // 2.0x Fast: 35ms / min (~17s)
    // 5.0x Turbo: 14ms / min (~7s)
    const intervalMs = Math.max(14, Math.round(70 / state.campAnim.speedMultiplier));

    state.campAnim.intervalId = setInterval(() => {
      // Step simulation clock forward smoothly by 1 minute per tick
      state.campAnim.currentMinute += 1;
      if (state.campAnim.currentMinute > 480) {
        state.campAnim.currentMinute = 480;
        pauseCampAnimation();
        appendCampLogEntry(480, `<strong>Camp Shift Ended (05:00 PM).</strong> Total ${state.singleCampResult.n_served} students served.`);
      }
      updateCampClock(state.campAnim.currentMinute);
      updatePlayheadPosition(state.campAnim.currentMinute);
      checkActiveEventsAtMinute(state.campAnim.currentMinute);
      updateFacilityViewAtMinute(state.campAnim.currentMinute);
    }, intervalMs);
  }

  function pauseCampAnimation() {
    state.campAnim.isPlaying = false;
    clearInterval(state.campAnim.intervalId);
    const lbl = document.getElementById('btnPlayCamp');
    if (lbl) lbl.innerHTML = '<i class="fas fa-play"></i> <span>Resume Animation</span>';
  }

  function stepCampAnimation() {
    pauseCampAnimation();
    // Step forward by 5 minutes for clear, comprehensible single-stepping
    state.campAnim.currentMinute = Math.min(480, state.campAnim.currentMinute + 5);
    updateCampClock(state.campAnim.currentMinute);
    updatePlayheadPosition(state.campAnim.currentMinute);
    checkActiveEventsAtMinute(state.campAnim.currentMinute);
    updateFacilityViewAtMinute(state.campAnim.currentMinute);
  }

  function instantCompleteCamp() {
    pauseCampAnimation();
    state.campAnim.currentMinute = 480;
    updateCampClock(480);
    updatePlayheadPosition(480);
    updateFacilityViewAtMinute(480);
    appendCampLogEntry(480, `<strong>Instant Run Completed.</strong> All ${state.singleCampResult.n_served} procedures finalized.`);
    document.querySelectorAll('.timeline-block').forEach(b => b.style.opacity = '1');
  }

  function updateCampClock(minutes) {
    const startHour = 9; // 09:00 AM
    const totalMinutes = startHour * 60 + minutes;
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    const displayM = m < 10 ? `0${m}` : m;

    const clockEl = document.getElementById('campClock');
    if (clockEl) {
      clockEl.textContent = `${displayH}:${displayM} ${ampm} (${minutes.toFixed(0)} min)`;
    }
  }

  function updateTimelineHeaderHours() {
    const header = document.getElementById('timelineHeaderHours');
    if (!header) return;

    let marks = [];
    const zoom = state.campAnim.zoomMode;

    if (zoom === 'full') {
      marks = ['09:00 AM (0m)', '10:00 (60m)', '11:00 (120m)', '12:00 (180m)', '01:00 PM (240m)', '02:00 (300m)', '03:00 (360m)', '04:00 (420m)', '05:00 PM (480m)'];
    } else if (zoom === 'triage') {
      marks = ['09:00 (0m)', '09:10 (10m)', '09:20 (20m)', '09:30 (30m)', '09:40 (40m)', '09:50 (50m)', '10:00 AM (60m)'];
    } else if (zoom === 'midday') {
      marks = ['10:00 AM (60m)', '10:45 (105m)', '11:30 (150m)', '12:15 PM (195m)', '01:00 PM (240m)'];
    } else if (zoom === 'afternoon') {
      marks = ['01:00 PM (240m)', '02:00 (300m)', '03:00 (360m)', '04:00 (420m)', '05:00 PM (480m)'];
    }

    header.innerHTML = marks.map(m => `<span class="timeline-hour-mark">${m}</span>`).join('');
  }

  function renderGanttTracks(campRes) {
    if (!campRes) return;

    const trackDentist = document.getElementById('trackDentist');
    const trackAuxAdm = document.getElementById('trackAuxAdmission');
    const trackAuxFV = document.getElementById('trackAuxFV');
    const trackTeacher = document.getElementById('trackTeacher');

    trackDentist.innerHTML = '';
    trackAuxAdm.innerHTML = '';
    trackAuxFV.innerHTML = '';
    trackTeacher.innerHTML = '';

    // Zoom Bounds (in minutes)
    let minTime = 0.0;
    let maxTime = 480.0;
    const zoom = state.campAnim.zoomMode;

    if (zoom === 'triage') { minTime = 0.0; maxTime = 60.0; }
    else if (zoom === 'midday') { minTime = 60.0; maxTime = 240.0; }
    else if (zoom === 'afternoon') { minTime = 240.0; maxTime = 480.0; }

    const span = maxTime - minTime;

    // Helper to position block
    function createBlock(b, targetTrack) {
      if (b.end <= minTime || b.start >= maxTime) return; // outside current zoom

      const clampedStart = Math.max(minTime, b.start);
      const clampedEnd = Math.min(maxTime, b.end);
      const leftPct = ((clampedStart - minTime) / span) * 100.0;
      const widthPct = Math.max(0.8, ((clampedEnd - clampedStart) / span) * 100.0);

      const el = document.createElement('div');
      el.className = 'timeline-block';
      el.style.left = `${leftPct}%`;
      el.style.width = `${widthPct}%`;
      el.style.backgroundColor = b.color;
      el.setAttribute('data-proc', b.taskShort || b.task);
      el.setAttribute('data-student', b.studentId);
      el.setAttribute('data-start', b.start);

      el.textContent = widthPct > 5 ? `S#${b.studentId}: ${b.taskShort || b.task}` : `#${b.studentId}`;
      el.title = `Student #${b.studentId} | ${b.task}\nTimeline: ${b.start.toFixed(1)}m - ${b.end.toFixed(1)}m (${b.duration.toFixed(1)} min)\nClick to view clinical record`;

      el.addEventListener('click', () => showStudentModal(b.studentId));
      targetTrack.appendChild(el);
    }

    // 1. Dentist Track
    campRes.timelineBlocks
      .filter(b => b.server === 'dentist')
      .forEach(b => createBlock({ ...b, taskShort: b.task.split(' ')[0] }, trackDentist));

    // 2. Auxiliary Admission Track
    campRes.students
      .filter(s => s.admitted)
      .forEach(s => createBlock({
        studentId: s.id,
        server: 'auxiliary',
        task: 'Admission (NVA)',
        taskShort: `Adm`,
        color: '#64748b',
        start: s.admStart,
        end: s.admEnd,
        duration: s.admitTime
      }, trackAuxAdm));

    // 3. Auxiliary Fluoride Track
    campRes.timelineBlocks
      .filter(b => b.server === 'auxiliary' && b.task.includes('Fluoride'))
      .forEach(b => createBlock({ ...b, taskShort: 'FV' }, trackAuxFV));

    // 4. Teacher Track
    campRes.timelineBlocks
      .filter(b => b.server === 'teacher')
      .forEach(b => createBlock({ ...b, taskShort: 'OHE' }, trackTeacher));

    // Add Milestone Flags to Tracks
    addTimelineFlags(span, minTime, maxTime);
  }

  function addTimelineFlags(span, minTime, maxTime) {
    const dentistTrack = document.getElementById('trackDentist');
    if (!dentistTrack || !state.singleCampResult) return;

    // Find triage completion time
    const triageDone = Math.max(...state.singleCampResult.students.map(s => s.admEnd || 0));
    if (triageDone >= minTime && triageDone <= maxTime) {
      const leftPct = ((triageDone - minTime) / span) * 100.0;
      const flag = document.createElement('div');
      flag.className = 'timeline-flag';
      flag.style.left = `${leftPct}%`;
      flag.innerHTML = `<span class="timeline-flag-label">🚩 Triage Done (${triageDone.toFixed(0)}m)</span>`;
      dentistTrack.appendChild(flag);
    }
  }

  function highlightGanttProcedure(procType) {
    document.querySelectorAll('.timeline-block').forEach(b => {
      if (procType === 'all') {
        b.style.opacity = '1';
        b.classList.remove('highlight');
      } else {
        const text = b.textContent.toLowerCase();
        const pType = procType.toLowerCase();
        if (text.includes(pType) || b.getAttribute('data-proc').toLowerCase().includes(pType)) {
          b.style.opacity = '1';
          b.classList.add('highlight');
        } else {
          b.style.opacity = '0.25';
          b.classList.remove('highlight');
        }
      }
    });
  }

  function updatePlayheadPosition(minute) {
    let minTime = 0.0;
    let maxTime = 480.0;
    const zoom = state.campAnim.zoomMode;

    if (zoom === 'triage') { minTime = 0.0; maxTime = 60.0; }
    else if (zoom === 'midday') { minTime = 60.0; maxTime = 240.0; }
    else if (zoom === 'afternoon') { minTime = 240.0; maxTime = 480.0; }

    const span = maxTime - minTime;
    let pct = ((minute - minTime) / span) * 100.0;
    pct = Math.max(0, Math.min(100, pct));

    // Update or create playhead in all tracks
    ['trackDentist', 'trackAuxAdmission', 'trackAuxFV', 'trackTeacher'].forEach(id => {
      const track = document.getElementById(id);
      if (!track) return;
      let playhead = track.querySelector('.timeline-playhead');
      if (!playhead) {
        playhead = document.createElement('div');
        playhead.className = 'timeline-playhead';
        track.appendChild(playhead);
      }
      playhead.style.left = `${pct}%`;
    });
  }

  function checkActiveEventsAtMinute(minute) {
    if (!state.singleCampResult) return;

    // Check newly started admissions & services chronologically
    state.singleCampResult.students.forEach(s => {
      if (!s._loggedAdmStart && minute >= s.admStart) {
        s._loggedAdmStart = true;
        appendCampLogEntry(minute, `Auxiliary admitting Student #${s.id} (Age ${s.ageLabel}, diagnosed with ${s.ivName}).`);
      }
      if (!s._loggedAdmEnd && minute >= s.admEnd) {
        s._loggedAdmEnd = true;
        appendCampLogEntry(minute, `Student #${s.id} admission complete. Routed to <strong>${s.serverAssigned.toUpperCase()}</strong>.`);
      }
      if (!s._loggedService && s.served && minute >= s.startService) {
        s._loggedService = true;
        appendCampLogEntry(minute, `<span style="color:${s.color}">▶</span> <strong>${s.serverAssigned.toUpperCase()}</strong> started ${s.ivName} for Student #${s.id} (${s.procTime.toFixed(0)} min).`);
      }
    });
  }

  function getAgeClass(ageLabel) {
    if (ageLabel === '6-8') return 'age-primary';
    if (ageLabel === '9-11') return 'age-upper';
    return 'age-secondary';
  }

  function formatCampMinute(minute) {
    const startHour = 9;
    const totalMinutes = startHour * 60 + minute;
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    const displayM = m < 10 ? `0${m}` : m;
    return `${displayH}:${displayM} ${ampm}`;
  }

  function updateFacilityViewAtMinute(minute) {
    if (!state.singleCampResult || !state.singleCampResult.students) return;
    const students = state.singleCampResult.students;
    const totalReferred = students.length;

    // 1. Classification of Students at Current Timestamp
    // Reception: Arrived at 09:00 AM, awaiting triage
    const receptionWaiting = students.filter(s => minute < s.admStart);

    // Triage Desk: Active triage patient
    const triageActive = students.find(s => s.admStart <= minute && minute < s.admEnd);
    const triageAllDone = students.every(s => minute >= s.admEnd);

    // Dentist Operatory
    const dentistQueue = students.filter(s => s.serverAssigned === 'dentist' && s.admEnd <= minute && minute < s.startService);
    const dentistActive = students.find(s => s.serverAssigned === 'dentist' && s.startService <= minute && minute < s.endService && s.served);

    // Auxiliary Preventive Fluoride Bay
    const auxQueue = students.filter(s => s.serverAssigned === 'auxiliary' && s.admEnd <= minute && minute < s.startService);
    const auxActive = students.find(s => s.serverAssigned === 'auxiliary' && s.startService <= minute && minute < s.endService && s.served);

    // Teacher Oral Health Coaching Room
    const teacherQueue = students.filter(s => s.serverAssigned === 'teacher' && s.admEnd <= minute && minute < s.startService);
    const teacherActive = students.find(s => s.serverAssigned === 'teacher' && s.startService <= minute && minute < s.endService && s.served);

    // Discharged Students
    const dischargedStudents = students.filter(s => s.served && minute >= s.endService);

    // 2. Real-Time Operational Throughput Pills
    const statArrived = document.getElementById('statFacArrived');
    const statQueued = document.getElementById('statFacQueued');
    const statTreating = document.getElementById('statFacTreating');
    const statDone = document.getElementById('statFacDone');

    const totalQueued = receptionWaiting.length + dentistQueue.length + auxQueue.length + teacherQueue.length;
    let activeTreatingCount = 0;
    if (triageActive) activeTreatingCount++;
    if (dentistActive) activeTreatingCount++;
    if (auxActive) activeTreatingCount++;
    if (teacherActive) activeTreatingCount++;

    if (statArrived) statArrived.textContent = totalReferred;
    if (statQueued) statQueued.textContent = totalQueued;
    if (statTreating) statTreating.textContent = activeTreatingCount;
    if (statDone) statDone.textContent = dischargedStudents.length;

    // 3. Zone 1: Reception & Waiting Hall
    const badgeReceptionCount = document.getElementById('badgeReceptionCount');
    if (badgeReceptionCount) {
      badgeReceptionCount.textContent = `${receptionWaiting.length} Waiting`;
      badgeReceptionCount.className = receptionWaiting.length > 0 ? 'badge' : 'badge badge-green';
    }

    const queueReception = document.getElementById('queueReception');
    if (queueReception) {
      if (receptionWaiting.length === 0) {
        queueReception.innerHTML = '<div style="font-size:0.75rem; color:#94a3b8; font-style:italic; padding:6px 0;">All referred students triaged and routed to bays.</div>';
      } else {
        queueReception.innerHTML = receptionWaiting.map(s => `
          <span class="student-chip ${getAgeClass(s.ageLabel)}" title="Student #${s.id} (Age ${s.ageLabel}, ${s.ivName}) - Click to inspect" onclick="window.showStudentModal && window.showStudentModal(${s.id})">
            <i class="fas fa-child"></i> #${s.id} (${s.ageLabel})
          </span>
        `).join('');
      }
    }

    // Helper: Render Current Patient Box in Provider Workstation
    function renderActiveBox(containerEl, activeStudent, startTime, endTime, procLabel, idlePlaceholderText) {
      if (!containerEl) return;
      if (activeStudent) {
        const elapsed = Math.max(0, minute - startTime);
        const totalDur = Math.max(0.1, endTime - startTime);
        const pct = Math.min(100, Math.max(0, (elapsed / totalDur) * 100));
        const rem = Math.max(0, endTime - minute);

        containerEl.className = 'current-patient-box active-patient';
        containerEl.innerHTML = `
          <div class="patient-active-row">
            <div class="patient-tag" style="cursor:pointer;" onclick="window.showStudentModal && window.showStudentModal(${activeStudent.id})">
              <i class="fas fa-child" style="color:${activeStudent.color || '#0a66c2'};"></i>
              <span>Student #${activeStudent.id} (Age ${activeStudent.ageLabel})</span>
            </div>
            <span class="badge" style="background:${activeStudent.color ? activeStudent.color + '20' : 'var(--pastel-blue-bg)'}; color:${activeStudent.color || 'var(--primary)'}; font-size:0.68rem; font-weight:700;">
              ${procLabel}
            </span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); margin-top:2px;">
            <span>Progress: <strong>${Math.round(pct)}%</strong></span>
            <span><strong>${rem.toFixed(1)}m</strong> remaining</span>
          </div>
          <div class="proc-progress-wrap">
            <div class="proc-progress-bar" style="width:${pct}%; background:${activeStudent.color || 'var(--primary)'}"></div>
          </div>
        `;
      } else {
        containerEl.className = 'current-patient-box';
        containerEl.innerHTML = `<div class="patient-placeholder">${idlePlaceholderText}</div>`;
      }
    }

    // Helper: Render Mini Queue Strip outside a Workstation
    function renderMiniQueue(queueContainer, queuedList) {
      if (!queueContainer) return;
      if (queuedList.length === 0) {
        queueContainer.innerHTML = '<span style="font-size:0.7rem; color:#94a3b8; font-style:italic;">Empty</span>';
      } else {
        queueContainer.innerHTML = queuedList.map(s => `
          <span class="student-chip ${getAgeClass(s.ageLabel)}" title="Student #${s.id} (Age ${s.ageLabel}, ${s.ivName}) - Queued ${(minute - s.admEnd).toFixed(0)}m - Click to inspect" onclick="window.showStudentModal && window.showStudentModal(${s.id})">
            <i class="fas fa-user-clock"></i> #${s.id}
          </span>
        `).join('');
      }
    }

    // 4. Workstation A: Auxiliary Triage Desk
    const badgeAuxTriage = document.getElementById('badgeAuxTriageStatus');
    const patientAuxTriage = document.getElementById('patientAuxTriage');
    if (badgeAuxTriage) {
      if (triageActive) {
        badgeAuxTriage.className = 'resource-status-tag status-busy';
        badgeAuxTriage.textContent = 'BUSY (TRIAGE)';
      } else if (triageAllDone) {
        badgeAuxTriage.className = 'resource-status-tag status-idle';
        badgeAuxTriage.textContent = 'COMPLETE';
      } else {
        badgeAuxTriage.className = 'resource-status-tag status-idle';
        badgeAuxTriage.textContent = 'IDLE';
      }
    }
    renderActiveBox(
      patientAuxTriage,
      triageActive,
      triageActive ? triageActive.admStart : 0,
      triageActive ? triageActive.admEnd : 0,
      'Triage Intake',
      triageAllDone ? 'All 14 admissions completed' : 'Awaiting student arrival...'
    );

    // 5. Workstation B: Dentist Clinical Operatory Chair
    const badgeDentist = document.getElementById('badgeDentistStatus');
    const queueDentist = document.getElementById('queueDentist');
    const patientDentist = document.getElementById('patientDentist');
    if (badgeDentist) {
      if (dentistActive) {
        badgeDentist.className = 'resource-status-tag status-busy-clinical';
        badgeDentist.textContent = `BUSY (${dentistActive.ivName})`;
      } else {
        badgeDentist.className = 'resource-status-tag status-idle';
        badgeDentist.textContent = 'IDLE';
      }
    }
    renderMiniQueue(queueDentist, dentistQueue);
    renderActiveBox(
      patientDentist,
      dentistActive,
      dentistActive ? dentistActive.startService : 0,
      dentistActive ? dentistActive.endService : 0,
      dentistActive ? dentistActive.ivName : '',
      'Chair sanitized & idle'
    );

    // 6. Workstation C: Auxiliary Preventive Fluoride Bay
    const badgeAuxFv = document.getElementById('badgeAuxFvStatus');
    const queueAuxFv = document.getElementById('queueAuxFv');
    const patientAuxFv = document.getElementById('patientAuxFv');
    if (badgeAuxFv) {
      if (auxActive) {
        badgeAuxFv.className = 'resource-status-tag status-busy';
        badgeAuxFv.textContent = 'BUSY (FV)';
      } else {
        badgeAuxFv.className = 'resource-status-tag status-idle';
        badgeAuxFv.textContent = 'IDLE';
      }
    }
    renderMiniQueue(queueAuxFv, auxQueue);
    renderActiveBox(
      patientAuxFv,
      auxActive,
      auxActive ? auxActive.startService : 0,
      auxActive ? auxActive.endService : 0,
      '5% NaF Fluoride Varnish',
      'Bay ready for triaged cases'
    );

    // 7. Workstation D: Teacher Oral Health Coaching Room
    const badgeTeacher = document.getElementById('badgeTeacherStatus');
    const queueTeacher = document.getElementById('queueTeacher');
    const patientTeacher = document.getElementById('patientTeacher');
    if (badgeTeacher) {
      if (teacherActive) {
        badgeTeacher.className = 'resource-status-tag status-busy';
        badgeTeacher.textContent = 'BUSY (OHE)';
      } else {
        badgeTeacher.className = 'resource-status-tag status-idle';
        badgeTeacher.textContent = 'IDLE';
      }
    }
    renderMiniQueue(queueTeacher, teacherQueue);
    renderActiveBox(
      patientTeacher,
      teacherActive,
      teacherActive ? teacherActive.startService : 0,
      teacherActive ? teacherActive.endService : 0,
      'Oral Health Education',
      'Room ready for students'
    );

    // 8. Zone 4: Discharge Lounge
    const badgeDischargedCount = document.getElementById('badgeDischargedCount');
    const queueDischarge = document.getElementById('queueDischarge');
    if (badgeDischargedCount) {
      badgeDischargedCount.textContent = `${dischargedStudents.length} / ${totalReferred} Completed`;
    }
    if (queueDischarge) {
      if (dischargedStudents.length === 0) {
        queueDischarge.innerHTML = '<div style="font-size:0.75rem; color:#94a3b8; font-style:italic; padding:6px 0;">No students finished yet. Completed students will appear here.</div>';
      } else {
        queueDischarge.innerHTML = dischargedStudents.map(s => `
          <span class="student-chip chip-done" title="Student #${s.id} (${s.ivName}) completed at ${formatCampMinute(s.endService)} - Click to inspect" onclick="window.showStudentModal && window.showStudentModal(${s.id})">
            <i class="fas fa-check-circle"></i> #${s.id} (${s.ivName})
          </span>
        `).join('');
      }
    }

    // 9. Dynamic Clinical Bottleneck & Delegation Safety Alert
    updateClinicalBottleneckAlert(state.params.ts, dentistQueue.length);
  }

  // --- Clinical Workflow & Bottleneck Assessment (Tailored for Dentists & Clinicians) ---
  function updateClinicalBottleneckAlert(tsLevel, dentistQueueLen) {
    const alertBox = document.getElementById('campBottleneckAlert');
    const alertIcon = document.getElementById('campBottleneckIcon');
    const alertTitle = document.getElementById('campBottleneckTitle');
    const alertText = document.getElementById('campBottleneckText');
    const alertBadge = document.getElementById('campBottleneckBadge');
    if (!alertBox || !alertTitle || !alertText) return;

    if (tsLevel === 0) {
      alertBox.className = 'clinic-alert-box clinic-alert-warning';
      if (alertIcon) alertIcon.className = 'fas fa-exclamation-triangle';
      alertTitle.textContent = 'Clinical Operatory Bottleneck Alert (Dentist Solo Practice)';
      alertText.innerHTML = `Without task delegation (<strong>TS = 0%</strong>), the dental surgeon at Chair 3A must single-handedly deliver all student admissions, clinical screenings, fluoride varnishes, and surgical restorations. The operatory queue backs up (<strong>${dentistQueueLen || 0} students currently waiting</strong> outside Chair 3A) while the auxiliary station and teacher room sit idle. Severe clinical bottleneck and procedure fatigue risk.`;
      if (alertBadge) alertBadge.textContent = 'Dentist Solo Bottleneck';
    } else if (tsLevel > 0 && tsLevel < 30) {
      alertBox.className = 'clinic-alert-box clinic-alert-info';
      if (alertIcon) alertIcon.className = 'fas fa-info-circle';
      alertTitle.textContent = `Partial Task Delegation Active (${tsLevel}% TS)`;
      alertText.innerHTML = `Oral health education and tooth-brushing instructions are delegated to classroom teachers at Room 3C. However, dentists still deliver all fluoride applications alongside complex restorations at Chair 3A. ${dentistQueueLen > 0 ? `<strong>${dentistQueueLen} students</strong> currently waiting outside Chair 3A.` : ''}`;
      if (alertBadge) alertBadge.textContent = 'Partial Delegation';
    } else {
      alertBox.className = 'clinic-alert-box clinic-alert-success';
      if (alertIcon) alertIcon.className = 'fas fa-check-circle';
      alertTitle.textContent = 'Balanced Multidisciplinary Clinical Workflow (Safe Delegation Active)';
      alertText.innerHTML = `Fluoride varnish application is safely delegated to trained auxiliary nurses at Bay 3B, and oral hygiene coaching is managed by classroom teachers at Room 3C. Dentist Operatory Chair 3A is reserved strictly for restorations (ART, GIC, pulpectomy, extractions) and specialized diagnoses. Chair congestion is reduced by over 60%.`;
      if (alertBadge) alertBadge.textContent = 'Optimal Patient Flow';
    }
  }

  function appendCampLogEntry(minute, text) {
    const logBox = document.getElementById('campEventLog');
    if (!logBox) return;

    const startHour = 9;
    const totalMinutes = startHour * 60 + minute;
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    const displayM = m < 10 ? `0${m}` : m;
    const timeStr = `${displayH}:${displayM} ${ampm} (${minute.toFixed(0)}m)`;

    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `<span class="time">[${timeStr}]</span> ${text}`;
    logBox.appendChild(div);
    logBox.scrollTop = logBox.scrollHeight;
  }

  function renderCampStudentsList(students) {
    const listBody = document.getElementById('campStudentsTableBody');
    if (!listBody) return;
    listBody.innerHTML = '';

    students.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>#${s.id}</strong></td>
        <td>${s.ageLabel}</td>
        <td><span class="badge" style="background:${s.color}15; color:${s.color}; border-color:${s.color}40">${s.ivName}</span></td>
        <td>${s.admitTime.toFixed(1)} min</td>
        <td><strong>${s.serverAssigned.toUpperCase()}</strong></td>
        <td>${s.procTime.toFixed(1)} min</td>
        <td>${s.waitTime.toFixed(1)} min</td>
        <td>
          <span class="badge ${s.served ? 'badge-green' : 'badge-amber'}">
            ${s.served ? '<i class="fas fa-check-circle"></i> Served' : '<i class="fas fa-times-circle"></i> Unserved'}
          </span>
        </td>
      `;
      listBody.appendChild(tr);
    });
  }

  function showStudentModal(studentId) {
    window.showStudentModal = showStudentModal;
    if (!state.singleCampResult) return;
    const s = state.singleCampResult.students.find(item => item.id === studentId);
    if (!s) return;

    const detailsWrap = document.getElementById('studentModalDetails');
    detailsWrap.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <div style="width:42px; height:42px; border-radius:50%; background:${s.color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:700;">
          #${s.id}
        </div>
        <div>
          <h3 style="margin:0">${s.ivName}</h3>
          <span style="color:var(--text-muted); font-size:0.83rem">Age: ${s.ageLabel} | Assigned to: ${s.serverAssigned.toUpperCase()}</span>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.85rem;">
        <div class="card" style="padding:12px; margin-bottom:0;">
          <div style="color:var(--text-dim); font-size:0.73rem;">ADMISSION TIME</div>
          <div style="font-size:1.1rem; font-weight:700">${s.admitTime.toFixed(1)} minutes</div>
          <div style="color:var(--text-muted); font-size:0.75rem;">By Dental Auxiliary (NVA)</div>
        </div>
        <div class="card" style="padding:12px; margin-bottom:0;">
          <div style="color:var(--text-dim); font-size:0.73rem;">QUEUE WAIT TIME</div>
          <div style="font-size:1.1rem; font-weight:700">${s.waitTime.toFixed(1)} minutes</div>
          <div style="color:var(--text-muted); font-size:0.75rem;">Before service initiation</div>
        </div>
        <div class="card" style="padding:12px; margin-bottom:0;">
          <div style="color:var(--text-dim); font-size:0.73rem;">PROCEDURE TIME</div>
          <div style="font-size:1.1rem; font-weight:700">${s.procTime.toFixed(1)} minutes</div>
          <div style="color:var(--text-muted); font-size:0.75rem;">Timeline: ${s.startService.toFixed(1)}m - ${s.endService.toFixed(1)}m</div>
        </div>
        <div class="card" style="padding:12px; margin-bottom:0;">
          <div style="color:var(--text-dim); font-size:0.73rem;">CLINICAL EFFECTIVENESS</div>
          <div style="font-size:1.1rem; font-weight:700">${(s.eff * 100).toFixed(1)}%</div>
          <div style="color:var(--text-muted); font-size:0.75rem;">DMFT reduction prob.</div>
        </div>
      </div>
    `;

    studentModal.classList.add('active');
  }

  // =========================================================================
  // MONTE CARLO PSA CONTROLS (CAP AT 200 DRAWS)
  // =========================================================================

  function setupPsaDrawsControls() {
    const inputDraws = document.getElementById('inputPsaDraws');
    const sliderDraws = document.getElementById('sliderPsaDraws');
    const lblRunDraws = document.getElementById('lblRunDraws');

    function setDraws(val) {
      let num = parseInt(val, 10);
      if (isNaN(num)) num = 100;
      num = Math.max(10, Math.min(state.psaConfig.maxCap, num)); // Enforce cap 200

      state.psaConfig.draws = num;
      if (inputDraws) inputDraws.value = num;
      if (sliderDraws) sliderDraws.value = num;
      if (lblRunDraws) lblRunDraws.textContent = num;

      // Update chip highlights
      document.querySelectorAll('.btn-psa-chip').forEach(chip => {
        const cVal = parseInt(chip.getAttribute('data-draws'), 10);
        chip.classList.toggle('btn-primary', cVal === num);
        chip.classList.toggle('btn-outline', cVal !== num);
      });
    }

    if (inputDraws) {
      inputDraws.addEventListener('change', (e) => setDraws(e.target.value));
    }
    if (sliderDraws) {
      sliderDraws.addEventListener('input', (e) => setDraws(e.target.value));
    }

    document.querySelectorAll('.btn-psa-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        setDraws(chip.getAttribute('data-draws'));
      });
    });

    const btnRunPsa = document.getElementById('btnRunPsa');
    if (btnRunPsa) {
      btnRunPsa.addEventListener('click', runProbabilisticSensitivityAnalysis);
    }
  }

  function runProbabilisticSensitivityAnalysis() {
    const btn = document.getElementById('btnRunPsa');
    const drawsCount = state.psaConfig.draws;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Running ${drawsCount} Draws...`;

    setTimeout(() => {
      const entity = {
        state: state.country,
        dentists: state.simResults.national.dentists,
        pop_6_8: 39000000 * 0.35,
        pop_9_11: 39000000 * 0.33,
        pop_12_15: 39000000 * 0.32,
        govt_enr_1_10: 107900000
      };

      const psaResult = window.DesEngine.runPSA(entity, drawsCount);

      document.getElementById('psaMedianCov').textContent = `${psaResult.cov_median.toFixed(1)}%`;
      document.getElementById('psaUiInterval').textContent = `[${psaResult.cov_lo.toFixed(1)}% - ${psaResult.cov_hi.toFixed(1)}%]`;
      document.getElementById('psaProbBelow10').textContent = `${psaResult.p_below10.toFixed(1)}%`;
      document.getElementById('psaProbBelow25').textContent = `${psaResult.p_below25.toFixed(1)}%`;

      renderPsaHistogram(psaResult.draws);

      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-play"></i> Run Monte Carlo (${drawsCount} Draws)`;
    }, 80);
  }

  function renderPsaHistogram(draws) {
    const canvas = document.getElementById('chartPsaCanvas');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartPsa) chartPsa.destroy();

    const minCov = Math.floor(Math.min(...draws.map(d => d.coverage)));
    const maxCov = Math.ceil(Math.max(...draws.map(d => d.coverage)));
    const binCount = 12;
    const step = Math.max(0.5, (maxCov - minCov) / binCount);
    const bins = Array(binCount).fill(0);
    const binLabels = [];

    for (let i = 0; i < binCount; i++) {
      const bLo = minCov + i * step;
      const bHi = bLo + step;
      binLabels.push(`${bLo.toFixed(0)}-${bHi.toFixed(0)}%`);
    }

    draws.forEach(d => {
      const bIdx = Math.min(binCount - 1, Math.max(0, Math.floor((d.coverage - minCov) / step)));
      bins[bIdx]++;
    });

    chartPsa = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: binLabels,
        datasets: [{
          label: 'Frequency of Draws',
          data: bins,
          backgroundColor: '#0a66c2',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#64748b' }, title: { display: true, text: 'National Coverage Range (%)', color: '#64748b' }, grid: { display: false } },
          y: { ticks: { color: '#64748b' }, title: { display: true, text: 'Number of Draws', color: '#64748b' }, grid: { color: '#f1f5f9' } }
        }
      }
    });
  }

  // =========================================================================
  // MANUSCRIPT PLOTS GALLERY (FIGURES 1 THROUGH 9)
  // =========================================================================

  function setupManuscriptPlots() {
    document.querySelectorAll('.fig-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fig-nav-btn').forEach(b => {
          b.classList.remove('btn-primary', 'active');
          b.classList.add('btn-outline');
        });
        btn.classList.add('btn-primary', 'active');
        btn.classList.remove('btn-outline');

        state.activeFigure = btn.getAttribute('data-fig');
        renderActiveManuscriptPlot();
      });
    });

    // Delegate click on any figure HD download button
    const figDisplay = document.getElementById('figDisplayContainer');
    if (figDisplay) {
      figDisplay.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-download-fig-hd');
        if (btn && window.DES_EXPORTER) {
          const canvasId = btn.getAttribute('data-canvas');
          const title = btn.getAttribute('data-title') || 'Manuscript Figure';
          const figName = btn.getAttribute('data-fig') || 'Figure_HD';
          window.DES_EXPORTER.downloadChartHD(canvasId, figName, title, 'Discrete Event Simulation Platform');
        }
      });
    }
  }

  function renderActiveManuscriptPlot() {
    const container = document.getElementById('figDisplayContainer');
    if (!container) return;

    const figKey = state.activeFigure;

    if (figKey === 'fig1') {
      renderFigure1(container);
    } else if (figKey === 'fig2') {
      renderFigure2(container);
    } else if (figKey === 'fig3') {
      renderFigure3(container);
    } else if (figKey === 'fig4') {
      renderFigure4(container);
    } else if (figKey === 'fig5') {
      renderFigure5(container);
    } else if (figKey === 'fig6') {
      renderFigure6(container);
    } else if (figKey === 'fig7') {
      renderFigure7(container);
    } else if (figKey === 'fig8') {
      renderFigure8(container);
    } else if (figKey === 'fig9') {
      renderFigure9(container);
    }
  }

  function renderFigure1(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 1: Simulation Architecture & Lindley Recursion Flowchart</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            End-to-end discrete event simulation pipeline showing Lindley queue recursion, 4-tier task delegation, and multi-state calibration across 35 units.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="fig1Container" data-title="Figure 1: Simulation Architecture & Workflow Flowchart" data-fig="Figure1">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure1.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>

      <div id="fig1Container" style="padding:16px; background:#f8fafc; border:1px solid var(--border-color); border-radius:var(--radius-md); text-align:center;">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap:12px; margin-bottom:16px; text-align:left;">
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:12px;">
            <div style="font-weight:700; color:#0a66c2;"><i class="fas fa-users"></i> 1. Population Stratification</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">UDISE+ 2024-25 school enrolment (classes 1-10) stratified into 6-8y, 9-11y, 12-15y with Janakiram/Pandey zonal caries prevalence.</div>
          </div>
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:12px;">
            <div style="font-weight:700; color:#8b5cf6;"><i class="fas fa-clipboard-check"></i> 2. Auxiliary Admissions & Triage</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Morning FIFO queue where auxiliary nurses admit referred students in U(0.5, 1.5) min and route to treatment streams.</div>
          </div>
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:12px;">
            <div style="font-weight:700; color:#10b981;"><i class="fas fa-stream"></i> 3. Lindley Recursion Engine</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">W_q,i = max(0, W_q,i-1 + S_i-1 - A_i) calculates exact discrete waiting times across dentist, auxiliary, and teacher tracks.</div>
          </div>
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:12px;">
            <div style="font-weight:700; color:#f59e0b;"><i class="fas fa-chart-line"></i> 4. Annual & PSA Aggregation</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Monthly repeat visits rho, workforce participation phi, and 35-state disaggregation evaluated under Monte Carlo PSA.</div>
          </div>
        </div>

        <div style="background:#ffffff; padding:14px; border-radius:6px; border:1px solid #e2e8f0; display:inline-block; max-width:100%;">
          <div style="font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:10px;">Publication Architecture Diagram (Figure 1):</div>
          <img src="figures/Figure1.png" alt="Figure 1 publication" style="max-width:100%; height:auto; max-height:480px; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        </div>
      </div>
    `;
  }

  function renderFigure2(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 2: Resource Utilization Across Camp Days</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            Panel (a) Dentist procedure time share vs availability; Panel (b) Auxiliary and Teacher busy share of camp day (%) at 22 camps/month across task-shifting levels.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="canvasFig2" data-title="Figure 2: Resource Utilization Across Camp Days" data-fig="Figure2">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure2.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>
      <div style="height: 380px;">
        <canvas id="canvasFig2"></canvas>
      </div>
    `;

    setTimeout(() => {
      const cvs = document.getElementById('canvasFig2');
      if (!cvs || typeof Chart === 'undefined') return;
      if (chartManuscript) chartManuscript.destroy();

      chartManuscript = new Chart(cvs, {
        type: 'bar',
        data: {
          labels: ['TS 0% (Dentist Only)', 'TS 10%', 'TS 20%', 'TS 30% (Headline)'],
          datasets: [
            { label: 'Dentist Utilization (%) at S22', data: [31.5, 34.8, 38.2, 41.3], backgroundColor: '#0a66c2', borderRadius: 4 },
            { label: 'Auxiliary Busy Share (%)', data: [7.2, 11.5, 14.8, 18.2], backgroundColor: '#f59e0b', borderRadius: 4 },
            { label: 'Teacher Busy Share (%)', data: [0.0, 12.4, 24.8, 36.5], backgroundColor: '#10b981', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#64748b' } },
            y: { title: { display: true, text: 'Busy Share of Camp Day (%)', color: '#64748b' }, ticks: { color: '#64748b' } }
          }
        }
      });
    }, 50);
  }

  function renderFigure3(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 3: National Coverage Across Feasibility Tiers</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            Annual coverage (%) of unique children with caries reached across feasibility tiers and sensitivity variants.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="canvasFig3" data-title="Figure 3: National Coverage Across Feasibility Tiers" data-fig="Figure3">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure3.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>
      <div style="height: 380px;">
        <canvas id="canvasFig3"></canvas>
      </div>
    `;

    setTimeout(() => {
      const cvs = document.getElementById('canvasFig3');
      if (!cvs || typeof Chart === 'undefined') return;
      if (chartManuscript) chartManuscript.destroy();

      const labels = [
        'Status quo', 'Plausible (Headline)', 'Stretch', 'Theoretical max',
        'Plausible, no delegation', 'Plausible, phi=0.3', 'Plausible, phi=0.8', 'Plausible, full lists'
      ];
      const covs = [2.37, 12.03, 27.35, 51.15, 9.30, 7.27, 18.94, 23.02];

      chartManuscript = new Chart(cvs, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'National Coverage (%)',
            data: covs,
            backgroundColor: covs.map(v => v >= 50 ? '#8b5cf6' : (v >= 20 ? '#2563eb' : (v >= 10 ? '#0a66c2' : '#94a3b8'))),
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { title: { display: true, text: 'National Coverage (%)', color: '#64748b' }, ticks: { color: '#64748b' } },
            y: { ticks: { color: '#334155', font: { size: 10 } } }
          }
        }
      });
    }, 50);
  }

  function renderFigure4(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 4: Age-Specific Unique Children Reached across the Scenario Grid</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            Unique children reached (Millions) in classes 1–3 (6–8y), 4–6 (9–11y), and 7–10 (12–15y) across camp frequencies (Base to S22) and task-shifting levels.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="canvasFig4" data-title="Figure 4: Age-Specific Unique Children Reached" data-fig="Figure4">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure4.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>
      <div style="height: 380px;">
        <canvas id="canvasFig4"></canvas>
      </div>
    `;

    setTimeout(() => {
      const cvs = document.getElementById('canvasFig4');
      if (!cvs || typeof Chart === 'undefined') return;
      if (chartManuscript) chartManuscript.destroy();

      const camps = ['Base (S2)', 'S4', 'S6', 'S8', 'S10', 'S12', 'S16', 'S22'];

      chartManuscript = new Chart(cvs, {
        type: 'bar',
        data: {
          labels: camps,
          datasets: [
            { label: '6–8 years', data: [0.38, 0.75, 1.12, 1.50, 1.87, 2.24, 2.99, 4.11], backgroundColor: '#2a78d6', borderRadius: 4 },
            { label: '9–11 years', data: [0.32, 0.63, 0.95, 1.26, 1.58, 1.89, 2.52, 3.47], backgroundColor: '#eb6834', borderRadius: 4 },
            { label: '12–15 years', data: [0.24, 0.47, 0.71, 0.94, 1.18, 1.41, 1.89, 2.59], backgroundColor: '#1baf7a', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#64748b' } },
            y: { title: { display: true, text: 'Unique Children Reached (Millions)', color: '#64748b' }, ticks: { color: '#64748b' } }
          }
        }
      });
    }, 50);
  }

  function renderFigure5(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 5: Population-Level DMFT Reduction Across Scenarios</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            Effectiveness-weighted DMFT reduction relative to initial caries burden across age groups and scenario grid.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="canvasFig5" data-title="Figure 5: Population-Level DMFT Reduction Across Scenarios" data-fig="Figure5">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure5.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>
      <div style="height: 380px;">
        <canvas id="canvasFig5"></canvas>
      </div>
    `;

    setTimeout(() => {
      const cvs = document.getElementById('canvasFig5');
      if (!cvs || typeof Chart === 'undefined') return;
      if (chartManuscript) chartManuscript.destroy();

      const camps = ['Base (S2)', 'S4', 'S6', 'S8 (Plausible)', 'S10', 'S12', 'S16', 'S22'];

      chartManuscript = new Chart(cvs, {
        type: 'bar',
        data: {
          labels: camps,
          datasets: [
            { label: '6–8 years', data: [0.74, 1.47, 2.20, 2.93, 3.66, 4.38, 5.84, 8.01], backgroundColor: '#2a78d6', borderRadius: 4 },
            { label: '9–11 years', data: [0.65, 1.29, 1.93, 2.57, 3.21, 3.85, 5.12, 7.02], backgroundColor: '#eb6834', borderRadius: 4 },
            { label: '12–15 years', data: [0.59, 1.18, 1.76, 2.34, 2.92, 3.51, 4.67, 6.41], backgroundColor: '#1baf7a', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#64748b' } },
            y: { title: { display: true, text: 'DMFT Reduction Relative to Initial (%)', color: '#64748b' }, ticks: { color: '#64748b' } }
          }
        }
      });
    }, 50);
  }

  function renderFigure6(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 6: State-Level Annual Coverage Under Plausible Scenario</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            35 Indian states and UTs ranked by annual coverage (%) with 95% uncertainty intervals under the headline Plausible scenario.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="canvasFig6" data-title="Figure 6: State-Level Coverage Ranking with 95% UI" data-fig="Figure6">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure6.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>
      <div style="height: 520px;">
        <canvas id="canvasFig6"></canvas>
      </div>
    `;

    setTimeout(() => {
      const cvs = document.getElementById('canvasFig6');
      if (!cvs || typeof Chart === 'undefined') return;
      if (chartManuscript) chartManuscript.destroy();

      const sorted = [...t2State].sort((a, b) => (parseFloat(b['Plausible coverage (%)']) || 0) - (parseFloat(a['Plausible coverage (%)']) || 0));

      chartManuscript = new Chart(cvs, {
        type: 'bar',
        data: {
          labels: sorted.map(s => s.state),
          datasets: [{
            label: 'Plausible Coverage (%)',
            data: sorted.map(s => parseFloat(s['Plausible coverage (%)']) || 0),
            backgroundColor: sorted.map(s => {
              const val = parseFloat(s['Plausible coverage (%)']) || 0;
              return val >= 40 ? '#10b981' : (val >= 15 ? '#0a66c2' : (val >= 8 ? '#f59e0b' : '#ef4444'));
            }),
            borderRadius: 3
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { title: { display: true, text: 'Annual Coverage (%) [PSA 95% UI]', color: '#64748b' } },
            y: { ticks: { font: { size: 9 }, color: '#334155' } }
          }
        }
      });
    }, 50);
  }

  function renderFigure7(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 7: Structural Disparity in Workforce Allocation</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            Relationship between students per government dentist (log scale) and achievable annual coverage.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="canvasFig7" data-title="Figure 7: Students per Dentist vs Coverage (Workforce Disparity)" data-fig="Figure7">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure7.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>
      <div style="height: 420px;">
        <canvas id="canvasFig7"></canvas>
      </div>
    `;

    setTimeout(() => {
      const cvs = document.getElementById('canvasFig7');
      if (!cvs || typeof Chart === 'undefined') return;
      if (chartManuscript) chartManuscript.destroy();

      const points = t2State.map(t => ({
        x: parseFloat(t['Students per dentist']) || 1000,
        y: parseFloat(t['Plausible coverage (%)']) || 10,
        stateName: t.state
      }));

      chartManuscript = new Chart(cvs, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'States / UTs',
            data: points,
            backgroundColor: '#0a66c2',
            pointRadius: 6,
            pointHoverRadius: 9
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.raw.stateName}: ${ctx.raw.x.toFixed(0)} stud/dentist → ${ctx.raw.y.toFixed(1)}% cov`
              }
            }
          },
          scales: {
            x: { type: 'logarithmic', title: { display: true, text: 'Students per Government Dentist (Log Scale)', color: '#64748b' } },
            y: { title: { display: true, text: 'Plausible Coverage (%)', color: '#64748b' } }
          }
        }
      });
    }, 50);
  }

  const CALIBRATED_SCENARIO_GRID = [
    { camps: 2, label: '2 camps / mo (Status Quo)', ts0: 2.37, ts10: 2.65, ts20: 3.12, ts30: 3.65 },
    { camps: 4, label: '4 camps / mo', ts0: 4.75, ts10: 5.32, ts20: 6.24, ts30: 7.30 },
    { camps: 6, label: '6 camps / mo', ts0: 7.12, ts10: 7.98, ts20: 9.35, ts30: 10.95 },
    { camps: 8, label: '8 camps / mo (Plausible)', ts0: 9.50, ts10: 10.64, ts20: 12.47, ts30: 12.03 },
    { camps: 10, label: '10 camps / mo', ts0: 11.87, ts10: 13.30, ts20: 15.59, ts30: 18.25 },
    { camps: 12, label: '12 camps / mo (Stretch)', ts0: 14.25, ts10: 15.96, ts20: 18.71, ts30: 21.90 },
    { camps: 14, label: '14 camps / mo', ts0: 16.62, ts10: 18.62, ts20: 21.83, ts30: 25.55 },
    { camps: 16, label: '16 camps / mo', ts0: 19.00, ts10: 21.28, ts20: 24.95, ts30: 29.20 },
    { camps: 18, label: '18 camps / mo', ts0: 21.37, ts10: 23.94, ts20: 28.06, ts30: 32.85 },
    { camps: 20, label: '20 camps / mo', ts0: 23.75, ts10: 26.60, ts20: 31.18, ts30: 36.50 },
    { camps: 22, label: '22 camps / mo (Theoretical Max)', ts0: 26.12, ts10: 29.26, ts20: 34.30, ts30: 40.15 }
  ];

  function renderFigure8(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 8: National Scenario Grid Heatmaps</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            Continuous response surface of Coverage (%), In-year YLDs averted, and DMFT reduction (%) across Camps (2 to 22) × TS (0% to 30%).
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="fig8TableContainer" data-title="Figure 8: National Scenario Grid Heatmaps" data-fig="Figure8">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure8.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>
      <div id="fig8TableContainer" class="table-responsive" style="background:#ffffff; padding:8px; border-radius:6px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Camps / Month</th>
              <th style="text-align:center;">TS 0% (Dentist Only)</th>
              <th style="text-align:center;">TS 10%</th>
              <th style="text-align:center;">TS 20%</th>
              <th style="text-align:center;">TS 30% (Headline)</th>
            </tr>
          </thead>
          <tbody>
            ${CALIBRATED_SCENARIO_GRID.map(row => `
              <tr>
                <td><strong>${row.label}</strong></td>
                <td style="text-align:center;">${row.ts0.toFixed(2)}%</td>
                <td style="text-align:center;">${row.ts10.toFixed(2)}%</td>
                <td style="text-align:center;">${row.ts20.toFixed(2)}%</td>
                <td style="text-align:center; font-weight:700; color:#0a66c2;">${row.ts30.toFixed(2)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderFigure9(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:700;">Figure 9: Parameter Uncertainty & Tornado Influence</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            Spearman correlation of model inputs with national outcomes across 300 PSA draws.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-sm btn-outline btn-download-fig-hd" data-canvas="canvasFig9" data-title="Figure 9: Parameter Uncertainty & Tornado Influence (PSA)" data-fig="Figure9">
            <i class="fas fa-camera"></i> Download HD Image (300 DPI)
          </button>
          <a href="figures/Figure9.png" target="_blank" class="btn btn-sm btn-outline" title="Open high-resolution publication PNG">
            <i class="fas fa-external-link-alt"></i> Publication PNG
          </a>
        </div>
      </div>
      <div style="height: 380px;">
        <canvas id="canvasFig9"></canvas>
      </div>
    `;

    setTimeout(() => {
      const cvs = document.getElementById('canvasFig9');
      if (!cvs || typeof Chart === 'undefined') return;
      if (chartManuscript) chartManuscript.destroy();

      const items = paperData.psa_influence || [
        { label: 'Workforce availability φ', cov: 0.847, yld: 0.535 },
        { label: 'Disability weight', cov: -0.042, yld: 0.704 },
        { label: 'Clinical effectiveness', cov: 0.019, yld: 0.287 },
        { label: 'Referrals per camp', cov: 0.207, yld: 0.175 },
        { label: 'Prevalence anchor (level)', cov: -0.309, yld: 0.054 },
        { label: 'Repeat-visit share (ρ)', cov: -0.241, yld: -0.234 },
        { label: 'Process times', cov: 0.047, yld: 0.002 }
      ];

      chartManuscript = new Chart(cvs, {
        type: 'bar',
        data: {
          labels: items.map(i => i.label),
          datasets: [
            { label: 'Annual coverage', data: items.map(i => i.cov), backgroundColor: '#0a66c2', borderRadius: 4 },
            { label: 'YLDs averted (in-year)', data: items.map(i => i.yld), backgroundColor: '#f59e0b', borderRadius: 4 }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              min: -0.5,
              max: 1.0,
              title: { display: true, text: 'Spearman rank correlation across PSA draws', color: '#64748b' }
            },
            y: { ticks: { color: '#334155', font: { size: 10 } } }
          }
        }
      });
    }, 50);
  }

  function renderStatesTable() {
    const tbody = document.getElementById('statesTableBody');
    if (!tbody || !state.simResults) return;

    let rows = [...state.simResults.states];

    if (state.zoneFilter !== 'All') {
      rows = rows.filter(r => r.entity && statesRaw.find(s => s.state === r.entity && s.zone === state.zoneFilter));
    }

    if (state.stateSearch) {
      rows = rows.filter(r => r.entity.toLowerCase().includes(state.stateSearch));
    }

    rows.sort((a, b) => {
      let vA = a[state.sortColumn];
      let vB = b[state.sortColumn];
      if (typeof vA === 'string') {
        return state.sortAsc ? vA.localeCompare(vB) : vB.localeCompare(vA);
      }
      return state.sortAsc ? vA - vB : vB - vA;
    });

    tbody.innerHTML = '';

    rows.forEach(r => {
      const t2Rec = t2State.find(t => t.state === r.entity) || {};
      const zone = t2Rec.Zone || 'General';
      const studentsPerDentist = t2Rec['Students per dentist'] || (r.dentists > 0 ? (r.pool / r.dentists) : 0);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.entity}</strong></td>
        <td><span class="badge">${zone}</span></td>
        <td>${Math.round(r.pool).toLocaleString()}</td>
        <td>${r.dentists.toLocaleString()}</td>
        <td>${Math.round(studentsPerDentist).toLocaleString()}</td>
        <td><strong>${r.coverage.toFixed(1)}%</strong></td>
        <td>${t2Rec['PSA median (%)'] ? `${parseFloat(t2Rec['PSA median (%)']).toFixed(1)}% (${parseFloat(t2Rec['PSA 2.5%']).toFixed(1)}-${parseFloat(t2Rec['PSA 97.5%']).toFixed(1)})` : '-'}</td>
        <td>${Math.round(r.unmet).toLocaleString()}</td>
        <td><span class="badge badge-amber" style="font-weight:700;">+${Math.round(r.dedicated_dentists_needed).toLocaleString()}</span></td>
      `;

      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => {
        showStateDetailModal(r.entity);
      });

      tbody.appendChild(tr);
    });
  }

  function showStateDetailModal(stateName) {
    const res = state.simResults.states.find(s => s.entity === stateName);
    if (!res) return;
    const t2Rec = t2State.find(t => t.state === stateName) || {};

    const detailsWrap = document.getElementById('studentModalDetails');
    detailsWrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div>
          <h2 style="margin:0; font-size:1.25rem;">${res.entity}</h2>
          <span style="color:var(--text-muted); font-size:0.82rem">Zone: ${t2Rec.Zone || 'Custom'} | Government Dental Surgeons: ${res.dentists}</span>
        </div>
        <span class="badge badge-green" style="font-size:0.85rem; padding:5px 12px;">Coverage: ${res.coverage.toFixed(1)}%</span>
      </div>

      <div class="card" style="margin-bottom:12px; background:var(--bg-subtle); padding:14px;">
        <h4 style="margin-bottom:6px; font-size:0.88rem;">Epidemiological & Workforce Breakdown</h4>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; font-size:0.8rem;">
          <div><strong>6-8 years:</strong> ${Math.round(res.poolByAge[0]).toLocaleString()} pool</div>
          <div><strong>9-11 years:</strong> ${Math.round(res.poolByAge[1]).toLocaleString()} pool</div>
          <div><strong>12-15 years:</strong> ${Math.round(res.poolByAge[2]).toLocaleString()} pool</div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.84rem;">
        <div class="card" style="padding:14px; margin-bottom:0;">
          <div style="color:var(--text-dim); font-size:0.72rem;">UNIQUE REACHED</div>
          <div style="font-size:1.2rem; font-weight:700">${Math.round(res.unique).toLocaleString()} children</div>
          <div style="color:var(--text-muted); font-size:0.74rem;">Across ${Math.round(res.camps).toLocaleString()} camp days</div>
        </div>
        <div class="card" style="padding:14px; margin-bottom:0;">
          <div style="color:var(--text-dim); font-size:0.72rem;">UNMET CARIES BURDEN</div>
          <div style="font-size:1.2rem; font-weight:700; color:var(--pastel-coral-text)">${Math.round(res.unmet).toLocaleString()} children</div>
          <div style="color:var(--text-muted); font-size:0.74rem;">Remaining without care</div>
        </div>
        <div class="card" style="padding:14px; margin-bottom:0;">
          <div style="color:var(--text-dim); font-size:0.72rem;">YLDs AVERTED</div>
          <div style="font-size:1.2rem; font-weight:700; color:var(--pastel-green-text)">${res.yld_inyear.toFixed(1)} in-year</div>
          <div style="color:var(--text-muted); font-size:0.74rem;">${res.yld_dur.toFixed(1)} duration-adjusted</div>
        </div>
        <div class="card" style="padding:14px; margin-bottom:0;">
          <div style="color:var(--text-dim); font-size:0.72rem;">DEDICATED DENTISTS NEEDED</div>
          <div style="font-size:1.2rem; font-weight:700; color:var(--pastel-amber-text)">+${Math.round(res.dedicated_dentists_needed).toLocaleString()}</div>
          <div style="color:var(--text-muted); font-size:0.74rem;">To eliminate unmet need</div>
        </div>
      </div>
    `;

    studentModal.classList.add('active');
  }

  // --- Charts (LinkedIn Pastel Styling) ---
  function renderTiersChart() {
    const canvas = document.getElementById('chartTiersCanvas');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartTiers) chartTiers.destroy();

    const labels = ['Status quo', 'Plausible', 'Stretch', 'Theoretical max'];
    const covValues = [2.37, 12.03, 27.35, 51.15];
    const reachValues = [0.93, 4.75, 10.80, 20.18];

    chartTiers = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Coverage (%)',
            data: covValues,
            backgroundColor: '#0a66c2',
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: 'Unique Children (Millions)',
            data: reachValues,
            backgroundColor: '#cce4ff',
            borderColor: '#0a66c2',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#475569', font: { size: 11 } } }
        },
        scales: {
          x: { ticks: { color: '#64748b' }, grid: { display: false } },
          y: {
            title: { display: true, text: 'Coverage (%)', color: '#0a66c2', font: { size: 11, weight: 'bold' } },
            ticks: { color: '#64748b' },
            grid: { color: '#f1f5f9' }
          },
          y1: {
            position: 'right',
            title: { display: true, text: 'Unique Children (M)', color: '#475569', font: { size: 11 } },
            ticks: { color: '#64748b' },
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderStateCoverageChart() {
    const canvas = document.getElementById('chartStatesCanvas');
    if (!canvas || typeof Chart === 'undefined' || !state.simResults) return;

    if (chartStates) chartStates.destroy();

    const sorted = [...state.simResults.states].sort((a, b) => b.coverage - a.coverage);
    const labels = sorted.map(s => s.entity);
    const data = sorted.map(s => s.coverage);

    chartStates = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Annual Coverage (%)',
          data: data,
          backgroundColor: data.map(v => v > 40 ? '#10b981' : (v > 15 ? '#0a66c2' : '#f59e0b')),
          borderRadius: 3
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            title: { display: true, text: 'Annual Coverage (%)', color: '#64748b' },
            ticks: { color: '#64748b' },
            grid: { color: '#f1f5f9' }
          },
          y: {
            ticks: { color: '#334155', font: { size: 9.5 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  function renderScatterPlot() {
    const canvas = document.getElementById('chartScatterCanvas');
    if (!canvas || typeof Chart === 'undefined' || !state.simResults) return;

    if (chartScatter) chartScatter.destroy();

    const points = state.simResults.states.map(s => {
      const t2Rec = t2State.find(t => t.state === s.entity) || {};
      const ratio = t2Rec['Students per dentist'] || (s.dentists > 0 ? (s.pool / s.dentists) : 1000);
      return {
        x: ratio,
        y: s.coverage,
        stateName: s.entity
      };
    });

    chartScatter = new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'States / Territories',
          data: points,
          backgroundColor: '#0a66c2',
          pointRadius: 6,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.raw.stateName}: ${ctx.raw.x.toFixed(0)} students/dentist → ${ctx.raw.y.toFixed(1)}% coverage`
            }
          }
        },
        scales: {
          x: {
            type: 'logarithmic',
            title: { display: true, text: 'Students per Dentist (Log Scale)', color: '#64748b' },
            ticks: { color: '#64748b' },
            grid: { color: '#f1f5f9' }
          },
          y: {
            title: { display: true, text: 'Coverage (%)', color: '#64748b' },
            ticks: { color: '#64748b' },
            grid: { color: '#f1f5f9' }
          }
        }
      }
    });
  }

  function renderScenarioHeatmap() {
    const tableBody = document.getElementById('heatmapTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    CALIBRATED_SCENARIO_GRID.forEach(row => {
      const tr = document.createElement('tr');
      const val0 = row.ts0;
      const val10 = row.ts10;
      const val20 = row.ts20;
      const val30 = row.ts30;

      function cellColor(v) {
        const intensity = Math.min(1.0, v / 40.0);
        return `rgba(10, 102, 194, ${Math.max(0.06, intensity * 0.45)})`;
      }

      tr.innerHTML = `
        <td><strong>${row.label}</strong></td>
        <td style="background:${cellColor(val0)}; text-align:center;">${val0.toFixed(2)}%</td>
        <td style="background:${cellColor(val10)}; text-align:center;">${val10.toFixed(2)}%</td>
        <td style="background:${cellColor(val20)}; text-align:center;">${val20.toFixed(2)}%</td>
        <td style="background:${cellColor(val30)}; text-align:center; font-weight:700; color:#0a66c2;">${val30.toFixed(2)}%</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // --- Custom Country Form Logic ---
  function renderCustomCountryForm() {
    const cc = state.customCountry;
    document.getElementById('inputCountryName').value = cc.name;
    document.getElementById('inputCountryCurrency').value = cc.currency;
    document.getElementById('inputDentists').value = cc.dentists;
    document.getElementById('inputPop6_8').value = cc.pop_6_8;
    document.getElementById('inputPop9_11').value = cc.pop_9_11;
    document.getElementById('inputPop12_15').value = cc.pop_12_15;
    document.getElementById('inputPrev6_8').value = cc.prev_6_8;
    document.getElementById('inputPrev9_11').value = cc.prev_9_11;
    document.getElementById('inputPrev12_15').value = cc.prev_12_15;

    renderProvincesList();
  }

  function saveCustomCountryForm() {
    const cc = state.customCountry;
    cc.name = document.getElementById('inputCountryName').value || 'Custom Country';
    cc.currency = document.getElementById('inputCountryCurrency').value || 'USD';
    cc.dentists = parseInt(document.getElementById('inputDentists').value, 10) || 1000;
    cc.pop_6_8 = parseInt(document.getElementById('inputPop6_8').value, 10) || 2000000;
    cc.pop_9_11 = parseInt(document.getElementById('inputPop9_11').value, 10) || 2000000;
    cc.pop_12_15 = parseInt(document.getElementById('inputPop12_15').value, 10) || 2000000;
    cc.prev_6_8 = parseFloat(document.getElementById('inputPrev6_8').value) || 40.0;
    cc.prev_9_11 = parseFloat(document.getElementById('inputPrev9_11').value) || 35.0;
    cc.prev_12_15 = parseFloat(document.getElementById('inputPrev12_15').value) || 30.0;

    state.country = 'Custom';
    countrySelector.value = 'Custom';

    runSimulation();
    switchTab('dashboard');
    alert(`Configuration saved for ${cc.name}! Running simulation now.`);
  }

  function renderProvincesList() {
    const container = document.getElementById('provincesListWrap');
    if (!container) return;
    container.innerHTML = '';

    state.customCountry.provinces.forEach((p, idx) => {
      const item = document.createElement('div');
      item.className = 'card';
      item.style.padding = '12px';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.style.marginBottom = '8px';

      item.innerHTML = `
        <div>
          <strong>${p.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted)">
            Population: ${p.pop_total.toLocaleString()} | Dentists: ${p.dentists} | Ratio: ${Math.round(p.pop_total / p.dentists)} stud/dent
          </div>
        </div>
        <button type="button" class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem;" data-idx="${idx}">
          <i class="fas fa-trash"></i> Remove
        </button>
      `;

      item.querySelector('button').addEventListener('click', () => {
        state.customCountry.provinces.splice(idx, 1);
        renderProvincesList();
      });

      container.appendChild(item);
    });
  }

  function applyCountryPreset(preset) {
    const cc = state.customCountry;
    if (preset === 'low-income') {
      cc.name = 'Low-Income Country Archetype';
      cc.pop_6_8 = 4000000;
      cc.pop_9_11 = 3500000;
      cc.pop_12_15 = 2500000;
      cc.dentists = 250;
      cc.prev_6_8 = 65.0;
      cc.prev_9_11 = 60.0;
      cc.prev_12_15 = 55.0;
    } else if (preset === 'lower-middle') {
      cc.name = 'Lower-Middle Income Archetype';
      cc.pop_6_8 = 3000000;
      cc.pop_9_11 = 3000000;
      cc.pop_12_15 = 2800000;
      cc.dentists = 800;
      cc.prev_6_8 = 52.0;
      cc.prev_9_11 = 48.0;
      cc.prev_12_15 = 40.0;
    } else if (preset === 'upper-middle') {
      cc.name = 'Upper-Middle Income Archetype';
      cc.pop_6_8 = 2000000;
      cc.pop_9_11 = 2000000;
      cc.pop_12_15 = 2000000;
      cc.dentists = 1500;
      cc.prev_6_8 = 45.0;
      cc.prev_9_11 = 38.0;
      cc.prev_12_15 = 32.0;
    } else if (preset === 'high-income') {
      cc.name = 'Universal Screening Model';
      cc.pop_6_8 = 1500000;
      cc.pop_9_11 = 1500000;
      cc.pop_12_15 = 1500000;
      cc.dentists = 4500;
      cc.prev_6_8 = 25.0;
      cc.prev_9_11 = 20.0;
      cc.prev_12_15 = 18.0;
    }
    renderCustomCountryForm();
  }

  function exportCountryJson() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.customCountry, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${state.customCountry.name.toLowerCase().replace(/\s+/g, '_')}_config.json`);
    dlAnchor.click();
  }

  function importCountryJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        state.customCountry = { ...state.customCountry, ...imported };
        renderCustomCountryForm();
        alert(`Imported profile for ${imported.name || 'Custom Country'}!`);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  }

  function formatNumberM(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + ' M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + ' k';
    }
    return Math.round(num).toString();
  }

  // Expose global DES_APP instance
  window.DES_APP = {
    state,
    runSimulation,
    updateKPIDashboard,
    renderStatesTable,
    renderCustomCountryForm,
    runSingleCampSimulation,
    runProbabilisticSensitivityAnalysis
  };

  init();
});
