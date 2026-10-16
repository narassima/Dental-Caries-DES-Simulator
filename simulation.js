/**
 * Dental Caries Discrete Event Simulation (DES) Engine
 * Based on: "Optimising school-based dental caries prevention through task-shifting:
 * a state-level discrete event simulation across India"
 *
 * Implements:
 * 1. Lindley recursion FIFO queueing with explicit dentist, auxiliary, and teacher resources
 * 2. 10-month school-year layer with caries pool depletion, repeat visits (rho), and health outcomes
 * 3. Exact epidemiological and clinical parameters from Annexure A / Table A1-A14
 * 4. Multi-country and custom province simulation capability
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DesEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // --- Constants & Reference Parameters (Annexure A, Table A1 & A2) ---
  const AGES = ["6 to 8", "9 to 11", "12 to 15"];
  
  const INTERVENTIONS = [
    "Oral health education",        // 0: OHE
    "Fluoride varnish",             // 1: FV
    "ART",                          // 2: ART
    "Stainless steel crowns",       // 3: SSC
    "Pulpectomy",                   // 4: Pulpectomy
    "GIC/composite restoration",    // 5: GIC
    "Scaling/mouthwash"             // 6: Scaling
  ];

  const INTERVENTION_COLORS = [
    "#3b82f6", // OHE: Blue
    "#10b981", // FV: Emerald
    "#f59e0b", // ART: Amber
    "#8b5cf6", // SSC: Purple
    "#ef4444", // Pulpectomy: Red
    "#ec4899", // GIC: Pink
    "#06b6d4"  // Scaling: Cyan
  ];

  // Table A2: % of students receiving each intervention, by age group (R0)
  const MIX_BASE = [
    // 6-8    9-11   12-15
    [0.4416, 0.4571, 0.3797], // OHE
    [0.1299, 0.1143, 0.0759], // FV
    [0.1818, 0.1857, 0.1646], // ART
    [0.0519, 0.0429, 0.0380], // SSC
    [0.0649, 0.0000, 0.0000], // Pulpectomy
    [0.1299, 0.2000, 0.2025], // GIC/composite
    [0.0000, 0.0000, 0.1392]  // Scaling/mouthwash
  ];

  // Table A2: DMFT reduction effectiveness ranges [lo, hi]
  const EFF_LO = [
    [0.15, 0.10, 0.10], // OHE
    [0.37, 0.37, 0.37], // FV
    [0.30, 0.30, 0.30], // ART
    [0.20, 0.20, 0.20], // SSC
    [0.60, 0.60, 0.60], // Pulpectomy
    [0.30, 0.30, 0.30], // GIC
    [0.10, 0.10, 0.10]  // Scaling
  ];

  const EFF_HI = [
    [0.20, 0.15, 0.12], // OHE
    [0.47, 0.47, 0.47], // FV
    [0.50, 0.50, 0.50], // ART
    [0.50, 0.50, 0.50], // SSC
    [0.70, 0.70, 0.70], // Pulpectomy
    [0.50, 0.50, 0.50], // GIC
    [0.15, 0.15, 0.15]  // Scaling
  ];

  // Table A2: Process time (minutes), Uniform(lo, hi)
  const PT_LO = [10, 5, 15, 40, 40, 30, 10];
  const PT_HI = [15, 10, 20, 60, 90, 45, 15];

  const ADMIT_LO = 0.5;
  const ADMIT_HI = 1.5;
  const CAMP_N_LO = 8;
  const CAMP_N_HI = 12;
  const SHIFT_MIN = 480; // 8-hour shift = 480 min
  const DAYS_PER_MONTH = 22;
  const MONTHS_PER_YEAR = 10;
  const DISC_RATE = 0.03;

  // Disability weights (Salomon et al. 2015; untreated caries = 0.010, scaling = 0.007)
  const DW = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.007];

  // Duration of effect (years) per intervention
  const DUR_BASE = [0.5, 0.5, 2.0, 3.0, 2.0, 3.0, 0.5];
  const DUR_LO   = [0.25, 0.5, 1.0, 2.0, 1.0, 2.0, 0.25];
  const DUR_HI   = [1.0, 1.0, 3.0, 5.0, 3.0, 5.0, 1.0];

  // Kerala baseline epidemiology (Table A1)
  const KERALA_PREV = [0.4171, 0.3480, 0.2348]; // 6-8, 9-11, 12-15
  const INIT_DMFT   = [0.99, 1.84, 1.37];

  // Janakiram et al. 2018 zone prevalence at ages 5, 12, 15
  const JANAKIRAM = {
    "North": [52, 61, 76],
    "South": [47, 44, 49],
    "East":  [49.5, 50, 57],
    "West":  [49.5, 41, 56]
  };
  const POOLED_MEAN = [49.5, 49.0, 59.5];

  // Pandey et al. 2021 pooled prevalence
  const PANDEY = {
    "West": 72, "North": 57, "Central": 56, "South": 51, "East": 36, "Overall": 54.16
  };

  const ZONE_TO_REGION = {
    "Northern": "North", "Southern": "South", "Eastern": "East",
    "Western": "West", "Central": null, "North-Eastern": null
  };

  const PANDEY_ZONE = {
    "Northern": "North", "Southern": "South", "Eastern": "East",
    "Western": "West", "Central": "Central", "North-Eastern": "Overall"
  };

  // Dedicated school dentist benchmark reach
  const DEDICATED_DENTIST_ANNUAL_REACH = 1889; // reach at 16 camp days/month for 10 months with delegation

  // --- Utility Functions ---
  function uniform(min, max, rng = Math.random) {
    return min + (max - min) * rng();
  }

  function discreteChoice(probs, rng = Math.random) {
    const r = rng();
    let cum = 0;
    for (let i = 0; i < probs.length; i++) {
      cum += probs[i];
      if (r <= cum || i === probs.length - 1) return i;
    }
    return probs.length - 1;
  }

  function pvDiscount(duration, rate = DISC_RATE) {
    return (1 - Math.exp(-rate * duration)) / rate;
  }

  function mixFor(r_pct = 0, baseMix = MIX_BASE) {
    // If r_pct > 0, cuts OHE (row 0) by r percentage points, then renormalizes
    const m = baseMix.map(row => [...row]);
    if (r_pct > 0) {
      const cut = r_pct / 100.0;
      for (let g = 0; g < 3; g++) {
        m[0][g] = Math.max(0, m[0][g] - cut);
        let colSum = 0;
        for (let i = 0; i < 7; i++) colSum += m[i][g];
        if (colSum > 0) {
          for (let i = 0; i < 7; i++) m[i][g] /= colSum;
        }
      }
    }
    return m;
  }

  function relativeRisk(zone, gradient = "janakiram") {
    if (gradient === "pandey") {
      const pZone = PANDEY_ZONE[zone] || "Overall";
      const ratio = (PANDEY[pZone] || 54.16) / PANDEY["South"];
      return [ratio, ratio, ratio];
    }
    // Janakiram default
    const south = JANAKIRAM["South"];
    if (zone === "Central") {
      const ratio = PANDEY["Central"] / PANDEY["South"];
      return south.map(s => (s * ratio) / s);
    }
    const reg = ZONE_TO_REGION[zone];
    const prev = reg ? JANAKIRAM[reg] : POOLED_MEAN;
    return prev.map((val, idx) => val / south[idx]);
  }

  function calculatePrevalence(zone, gradient = "janakiram", anchor = 1.0, refPrev = KERALA_PREV) {
    const rr = relativeRisk(zone, gradient);
    return refPrev.map((p, i) => Math.min(0.95, p * anchor * rr[i]));
  }

  function calculateStatePools(stateRow, gradient = "janakiram", anchor = 1.0, refPrev = KERALA_PREV) {
    // On-time grade to age mapping:
    // classes 1-3 ~ 6-8 y (3/5 of primary 1-5)
    // classes 4-6 ~ 9-11 y (2/5 of primary + 1/3 of upper primary 6-8)
    // classes 7-10 ~ 12-15 y (2/3 of upper primary + all secondary 9-10)
    let p1 = stateRow.pop_6_8;
    let p2 = stateRow.pop_9_11;
    let p3 = stateRow.pop_12_15;

    if (p1 === undefined || isNaN(p1)) {
      const p = stateRow.enr_primary_1_5 || 0;
      const u = stateRow.enr_upper_primary_6_8 || 0;
      const s = stateRow.enr_secondary_9_10 || 0;
      p1 = p * 3 / 5;
      p2 = p * 2 / 5 + u / 3;
      p3 = u * 2 / 3 + s;
    }

    const pop = [p1, p2, p3];
    const prev = calculatePrevalence(stateRow.zone || "Southern", gradient, anchor, refPrev);
    const pools = pop.map((n, i) => n * prev[i]);
    return { pop, prev, pools, totalPool: pools.reduce((a, b) => a + b, 0) };
  }

  // --- Camp-Level DES Simulator (Lindley Recursion with 3 Resources) ---
  /**
   * Simulates a single 480-minute camp day with fine-grained event tracking.
   * Perfect for interactive timeline/Gantt visualizations and discrete queue inspection!
   */
  function simulateSingleCamp(options = {}) {
    const {
      ts = 30,                 // Task-shifting % (0, 10, 20, 30)
      r_pct = 0,               // Preventive OHE reduction % (0 or 5)
      age_share = [0.35, 0.35, 0.30],
      pt_mult = 1.0,
      eff_mult = 1.0,
      ref_scale = 1.0,
      rng = Math.random
    } = options;

    const delegate = ts > 0;
    const ref_mult = 1 + ts / 100.0;
    const base_n = Math.ceil(uniform(CAMP_N_LO, CAMP_N_HI, rng)) * ref_scale;
    const lam = base_n * ref_mult;
    const n_students = Math.floor(lam) + (rng() < (lam - Math.floor(lam)) ? 1 : 0);

    const mix = mixFor(r_pct);
    const students = [];

    // Phase 1: Batch Arrival & Characteristics Generation
    for (let j = 0; j < n_students; j++) {
      const ageIdx = discreteChoice(age_share, rng);
      
      // Determine intervention from cumulative mix for this age
      const mixCol = mix.map(row => row[ageIdx]);
      const ivIdx = discreteChoice(mixCol, rng);

      const admitTime = uniform(ADMIT_LO, ADMIT_HI, rng);
      const procTime = uniform(PT_LO[ivIdx], PT_HI[ivIdx], rng) * pt_mult;
      const eff = Math.min(1.0, Math.max(0.0, uniform(EFF_LO[ivIdx][ageIdx], EFF_HI[ivIdx][ageIdx], rng) * eff_mult));

      students.push({
        id: j + 1,
        ageIdx,
        ageLabel: AGES[ageIdx],
        ivIdx,
        ivName: INTERVENTIONS[ivIdx],
        color: INTERVENTION_COLORS[ivIdx],
        admitTime,
        procTime,
        eff,
        dw: DW[ivIdx],
        dur: DUR_BASE[ivIdx],
        // Flow state
        arrival: 0.0,
        admStart: 0.0,
        admEnd: 0.0,
        admitted: false,
        serverAssigned: 'none',
        startService: 0.0,
        endService: 0.0,
        served: false,
        waitTime: 0.0,
        unservedReason: null
      });
    }

    // Phase 2: Auxiliary Admission Queue (FIFO)
    let auxTime = 0.0;
    for (let s of students) {
      s.admStart = auxTime;
      if (s.admStart < SHIFT_MIN) {
        s.admitted = true;
        s.admEnd = s.admStart + s.admitTime;
        auxTime = s.admEnd;
      } else {
        s.admitted = false;
        s.unservedReason = "Shift ended during admission";
      }
    }
    const allAdmissionsDone = auxTime;

    // Phase 3: Routing to Queues
    // TS = 0: All procedures go to Dentist
    // TS > 0: OHE -> Teacher; FV -> Auxiliary (after all admissions); Clinical -> Dentist
    const dentistQueue = [];
    const teacherQueue = [];
    const auxQueue = [];

    for (let s of students) {
      if (!s.admitted) continue;

      if (!delegate) {
        s.serverAssigned = 'dentist';
        s.readyTime = s.admEnd;
        dentistQueue.push(s);
      } else {
        if (s.ivIdx === 0) { // OHE
          s.serverAssigned = 'teacher';
          s.readyTime = s.admEnd;
          teacherQueue.push(s);
        } else if (s.ivIdx === 1) { // Fluoride Varnish
          s.serverAssigned = 'auxiliary';
          s.readyTime = Math.max(s.admEnd, allAdmissionsDone);
          auxQueue.push(s);
        } else { // Clinical: ART, SSC, Pulpectomy, GIC, Scaling
          s.serverAssigned = 'dentist';
          s.readyTime = s.admEnd;
          dentistQueue.push(s);
        }
      }
    }

    // Helper: Run FIFO single server
    function processServerQueue(queue, initialFreeTime, serverName) {
      let free = initialFreeTime;
      const timelineBlocks = [];

      for (let s of queue) {
        const start = Math.max(s.readyTime, free);
        if (start < SHIFT_MIN) {
          s.served = true;
          s.startService = start;
          s.endService = start + s.procTime;
          s.waitTime = start - s.admEnd;
          free = s.endService;

          timelineBlocks.push({
            studentId: s.id,
            server: serverName,
            task: s.ivName,
            color: s.color,
            start: s.startService,
            end: s.endService,
            duration: s.procTime
          });
        } else {
          s.served = false;
          s.unservedReason = `Shift cut-off on ${serverName} server`;
        }
      }
      return { free, timelineBlocks };
    }

    // Dentist
    const dentRes = processServerQueue(dentistQueue, 0.0, 'dentist');
    // Teacher
    const teachRes = processServerQueue(teacherQueue, 0.0, 'teacher');
    // Auxiliary (starts FV after completing all admissions)
    const auxRes = processServerQueue(auxQueue, allAdmissionsDone, 'auxiliary');

    // Build Auxiliary admission blocks for timeline
    const admissionBlocks = students
      .filter(s => s.admitted)
      .map(s => ({
        studentId: s.id,
        server: 'auxiliary',
        task: 'Admission (NVA)',
        color: '#94a3b8',
        start: s.admStart,
        end: s.admEnd,
        duration: s.admitTime
      }));

    const allTimelineBlocks = [
      ...admissionBlocks,
      ...auxRes.timelineBlocks,
      ...teachRes.timelineBlocks,
      ...dentRes.timelineBlocks
    ];

    // Compute camp summary metrics
    const servedCount = students.filter(s => s.served).length;
    const unservedCount = students.length - servedCount;
    const dentMin = dentRes.timelineBlocks.reduce((acc, b) => acc + b.duration, 0);
    const teachMin = teachRes.timelineBlocks.reduce((acc, b) => acc + b.duration, 0);
    const auxMin = admissionBlocks.reduce((acc, b) => acc + b.duration, 0) + 
                   auxRes.timelineBlocks.reduce((acc, b) => acc + b.duration, 0);

    return {
      n_referred: students.length,
      n_admitted: students.filter(s => s.admitted).length,
      n_served: servedCount,
      n_unserved: unservedCount,
      dent_busy_min: dentMin,
      teach_busy_min: teachMin,
      aux_busy_min: auxMin,
      dent_util_camp: (dentMin / SHIFT_MIN) * 100.0,
      aux_util_camp: (auxMin / SHIFT_MIN) * 100.0,
      teach_util_camp: (teachMin / SHIFT_MIN) * 100.0,
      students,
      timelineBlocks: allTimelineBlocks,
      dentistQueue,
      auxQueue,
      teacherQueue
    };
  }

  // --- Monthly Vectorized/Fast DES Simulator ---
  /**
   * Simulates all camps held in one month across available dentists.
   */
  function simulateMonth(params) {
    const {
      n_dentists = 10,
      camps_per_dentist = 8,
      ref_mult = 1.3,
      delegate = true,
      r_pct = 0,
      age_share = [0.35, 0.35, 0.30],
      pt_mult = 1.0,
      eff_mult = 1.0,
      ref_scale = 1.0,
      rng = Math.random
    } = params;

    const n_camps = Math.round(n_dentists * camps_per_dentist);
    const servedMatrix = Array.from({ length: 3 }, () => Array(7).fill(0));
    const effMatrix = Array.from({ length: 3 }, () => Array(7).fill(0));

    if (n_camps <= 0) {
      return {
        camps: 0, referred: 0, servedTotal: 0, unserved: 0,
        served: servedMatrix, eff: effMatrix,
        dent_min: 0, aux_min: 0, teach_min: 0
      };
    }

    let totalReferred = 0;
    let totalServed = 0;
    let totalUnserved = 0;
    let totalDentMin = 0;
    let totalAuxMin = 0;
    let totalTeachMin = 0;

    const mix = mixFor(r_pct);

    for (let c = 0; c < n_camps; c++) {
      const base_n = Math.ceil(uniform(CAMP_N_LO, CAMP_N_HI, rng)) * ref_scale;
      const lam = base_n * ref_mult;
      const n_stud = Math.floor(lam) + (rng() < (lam - Math.floor(lam)) ? 1 : 0);
      totalReferred += n_stud;

      // Admissions
      let auxFree = 0.0;
      let auxAdmTime = 0.0;
      const admittedList = [];

      for (let j = 0; j < n_stud; j++) {
        const ageIdx = discreteChoice(age_share, rng);
        const mixCol = mix.map(row => row[ageIdx]);
        const ivIdx = discreteChoice(mixCol, rng);

        const adm = uniform(ADMIT_LO, ADMIT_HI, rng);
        const pt = uniform(PT_LO[ivIdx], PT_HI[ivIdx], rng) * pt_mult;
        const e = Math.min(1.0, Math.max(0.0, uniform(EFF_LO[ivIdx][ageIdx], EFF_HI[ivIdx][ageIdx], rng) * eff_mult));

        if (auxFree < SHIFT_MIN) {
          const admEnd = auxFree + adm;
          auxFree = admEnd;
          auxAdmTime += adm;
          admittedList.push({ ageIdx, ivIdx, admEnd, pt, e });
        } else {
          totalUnserved++;
        }
      }

      const allAdmEnd = auxFree;

      // Servers
      let dentFree = 0.0;
      let teachFree = 0.0;
      let auxServiceFree = allAdmEnd;

      for (let s of admittedList) {
        if (!delegate) {
          // Dentist handles all
          const start = Math.max(s.admEnd, dentFree);
          if (start < SHIFT_MIN) {
            dentFree = start + s.pt;
            totalDentMin += s.pt;
            totalServed++;
            servedMatrix[s.ageIdx][s.ivIdx]++;
            effMatrix[s.ageIdx][s.ivIdx] += s.e;
          } else {
            totalUnserved++;
          }
        } else {
          // Delegation routing
          if (s.ivIdx === 0) { // OHE -> Teacher
            const start = Math.max(s.admEnd, teachFree);
            if (start < SHIFT_MIN) {
              teachFree = start + s.pt;
              totalTeachMin += s.pt;
              totalServed++;
              servedMatrix[s.ageIdx][s.ivIdx]++;
              effMatrix[s.ageIdx][s.ivIdx] += s.e;
            } else {
              totalUnserved++;
            }
          } else if (s.ivIdx === 1) { // FV -> Auxiliary
            const ready = Math.max(s.admEnd, allAdmEnd);
            const start = Math.max(ready, auxServiceFree);
            if (start < SHIFT_MIN) {
              auxServiceFree = start + s.pt;
              totalAuxMin += s.pt;
              totalServed++;
              servedMatrix[s.ageIdx][s.ivIdx]++;
              effMatrix[s.ageIdx][s.ivIdx] += s.e;
            } else {
              totalUnserved++;
            }
          } else { // Clinical -> Dentist
            const start = Math.max(s.admEnd, dentFree);
            if (start < SHIFT_MIN) {
              dentFree = start + s.pt;
              totalDentMin += s.pt;
              totalServed++;
              servedMatrix[s.ageIdx][s.ivIdx]++;
              effMatrix[s.ageIdx][s.ivIdx] += s.e;
            } else {
              totalUnserved++;
            }
          }
        }
      }
      totalAuxMin += auxAdmTime;
    }

    return {
      camps: n_camps,
      referred: totalReferred,
      servedTotal: totalServed,
      unserved: totalUnserved,
      served: servedMatrix,
      eff: effMatrix,
      dent_min: totalDentMin,
      aux_min: totalAuxMin,
      teach_min: totalTeachMin
    };
  }

  // --- 10-Month School-Year Simulation Layer (annual.py) ---
  /**
   * Simulates full school-year with unique children, repeat visits, caries pool depletion,
   * in-year and duration-adjusted YLDs, DMFT reduction, and workforce gap.
   */
  function simulateYear(entity, camps, ts, r_pct = 0, options = {}) {
    const {
      phi = 0.5,
      rho = 0.15,
      months = MONTHS_PER_YEAR,
      gradient = "janakiram",
      anchor = 1.0,
      pt_mult = 1.0,
      eff_mult = 1.0,
      ref_scale = 1.0,
      dw_mult = 1.0,
      dur = DUR_BASE,
      dent_mult = 1.0,
      rng = Math.random
    } = options;

    const poolsInfo = calculateStatePools(entity, gradient, anchor);
    const P = poolsInfo.pools;
    const P_total = poolsInfo.totalPool;
    const share = P_total > 0 ? P.map(p => p / P_total) : [0.33, 0.33, 0.34];

    const dentists = (entity.dentists || 0) * dent_mult;
    const n_av = dentists * phi;
    const delegate = ts > 0;
    const ref_mult = 1 + ts / 100.0;

    const dw = DW.map(w => w * dw_mult);
    const pv = dur.map(d => pvDiscount(d, DISC_RATE));

    let U = [0, 0, 0]; // cumulative unique children reached
    let totalServed = 0;
    let totalRepeat = 0;
    let totalIdle = 0;
    let totalReferred = 0;
    let totalUnserved = 0;
    let totalCamps = 0;

    let totalDentMin = 0;
    let totalAuxMin = 0;
    let totalTeachMin = 0;

    let yldInYear = 0;
    let yldDur = 0;
    let yldConv = 0;
    let dmftRedSum = 0;

    for (let t = 1; t <= months; t++) {
      const monthRes = simulateMonth({
        n_dentists: n_av,
        camps_per_dentist: camps,
        ref_mult,
        delegate,
        r_pct,
        age_share: share,
        pt_mult,
        eff_mult,
        ref_scale,
        rng
      });

      totalCamps += monthRes.camps;
      totalReferred += monthRes.referred;
      totalUnserved += monthRes.unserved;
      totalDentMin += monthRes.dent_min;
      totalAuxMin += monthRes.aux_min;
      totalTeachMin += monthRes.teach_min;

      // Repeat visits & Pool Depletion per age group
      const newThisMonth = [0, 0, 0];
      const S_age = [0, 0, 0];

      for (let g = 0; g < 3; g++) {
        S_age[g] = monthRes.served[g].reduce((a, b) => a + b, 0);
        const rep = (t > 1) ? Math.min(rho * S_age[g], U[g]) : 0;
        const nw = Math.min(S_age[g] - rep, Math.max(0, P[g] - U[g]));
        const idle = Math.max(0, S_age[g] - rep - nw);

        newThisMonth[g] = nw;
        U[g] += nw;
        totalServed += S_age[g];
        totalRepeat += rep;
        totalIdle += idle;

        const f_new = S_age[g] > 0 ? (nw / S_age[g]) : 0;
        const remYear = (12 - t + 0.5) / 12.0;

        for (let iv = 0; iv < 7; iv++) {
          const effNew = monthRes.eff[g][iv] * f_new;
          const servedCount = monthRes.served[g][iv];

          yldInYear += effNew * dw[iv] * Math.min(dur[iv], remYear);
          yldDur += effNew * dw[iv] * pv[iv];
          yldConv += servedCount * dw[iv];
          dmftRedSum += effNew;
        }
      }
    }

    const uniqueReachedTotal = U.reduce((a, b) => a + b, 0);
    const coveragePct = P_total > 0 ? (uniqueReachedTotal / P_total) * 100.0 : 0.0;
    const unmetNeed = Math.max(0, P_total - uniqueReachedTotal);

    // Initial DMFT Burden = sum(P[g] * INIT_DMFT[g])
    const initialDmftBurden = P.reduce((acc, p, g) => acc + p * INIT_DMFT[g], 0);
    const dmftRedPct = initialDmftBurden > 0 ? (dmftRedSum / initialDmftBurden) * 100.0 : 0.0;

    // Workforce gaps
    const dedicatedDentistsNeeded = unmetNeed / DEDICATED_DENTIST_ANNUAL_REACH;

    // Utilizations
    const totalDentWorkMinutes = Math.max(1e-9, n_av * DAYS_PER_MONTH * SHIFT_MIN * months);
    const totalCampShiftMinutes = Math.max(1e-9, totalCamps * SHIFT_MIN);

    const dentUtilPct = (totalDentMin / totalDentWorkMinutes) * 100.0;
    const auxUtilPct = (totalAuxMin / totalCampShiftMinutes) * 100.0;
    const teachUtilPct = (totalTeachMin / totalCampShiftMinutes) * 100.0;

    return {
      entity: entity.state || entity.name || "Custom Region",
      dentists,
      n_av,
      camps: totalCamps,
      referred: totalReferred,
      served: totalServed,
      repeat: totalRepeat,
      repeatShare: totalServed > 0 ? (totalRepeat / totalServed) * 100.0 : 0.0,
      unique: uniqueReachedTotal,
      uniqueByAge: U,
      pool: P_total,
      poolByAge: P,
      idle: totalIdle,
      unserved: totalUnserved,
      coverage: coveragePct,
      unmet: unmetNeed,
      yld_inyear: yldInYear,
      yld_dur: yldDur,
      yld_conv_month: yldConv / months,
      dmft_red_pct: dmftRedPct,
      dedicated_dentists_needed: dedicatedDentistsNeeded,
      dent_util: dentUtilPct,
      aux_util: auxUtilPct,
      teach_util: teachUtilPct,
      children_per_avail_dentist: n_av > 0 ? uniqueReachedTotal / n_av : 0,
      yld_per100_dentists: n_av > 0 ? (yldInYear / n_av) * 100.0 : 0,
      yld_per100k_pool: P_total > 0 ? (yldInYear / P_total) * 100000.0 : 0
    };
  }

  // --- Probabilistic Sensitivity Analysis (PSA) Engine ---
  /**
   * Monte Carlo PSA joint sampler right in the browser.
   * Produces empirical 95% uncertainty intervals and correlation rankings.
   */
  function runPSA(entity, numDraws = 100, customRanges = {}) {
    const draws = [];

    for (let d = 0; d < numDraws; d++) {
      // Sample shared parameters jointly
      const gradient = Math.random() < 0.5 ? "janakiram" : "pandey";
      const anchor = uniform(0.8, 1.2);
      const phi = uniform(0.3, 0.8);
      const ref_scale = uniform(0.85, 1.15);
      const pt_mult = uniform(0.85, 1.15);
      const eff_mult = uniform(0.8, 1.2);
      const rho = uniform(0.05, 0.30);
      const dw_mult = uniform(0.5, 1.5);
      const dent_mult = uniform(0.9, 1.1);

      // Durations drawn independently per intervention
      const dur = DUR_BASE.map((base, i) => uniform(DUR_LO[i], DUR_HI[i]));

      const res = simulateYear(entity, 8, 30, 0, {
        phi,
        rho,
        gradient,
        anchor,
        pt_mult,
        eff_mult,
        ref_scale,
        dw_mult,
        dur,
        dent_mult
      });

      draws.push({
        draw: d + 1,
        coverage: res.coverage,
        unique: res.unique,
        unmet: res.unmet,
        yld_inyear: res.yld_inyear,
        yld_dur: res.yld_dur,
        dent_util: res.dent_util,
        // sampled inputs
        phi,
        anchor,
        ref_scale,
        eff_mult,
        pt_mult,
        rho,
        dent_mult
      });
    }

    draws.sort((a, b) => a.coverage - b.coverage);
    const p2_5_idx = Math.max(0, Math.floor(0.025 * numDraws));
    const p50_idx = Math.floor(0.50 * numDraws);
    const p97_5_idx = Math.min(numDraws - 1, Math.floor(0.975 * numDraws));

    const pBelow10 = (draws.filter(d => d.coverage < 10).length / numDraws) * 100.0;
    const pBelow25 = (draws.filter(d => d.coverage < 25).length / numDraws) * 100.0;

    return {
      numDraws,
      draws,
      cov_median: draws[p50_idx].coverage,
      cov_lo: draws[p2_5_idx].coverage,
      cov_hi: draws[p97_5_idx].coverage,
      unique_median: draws[p50_idx].unique,
      p_below10: pBelow10,
      p_below25: pBelow25
    };
  }

  // --- Export Public API ---
  return {
    AGES,
    INTERVENTIONS,
    INTERVENTION_COLORS,
    MIX_BASE,
    EFF_LO,
    EFF_HI,
    PT_LO,
    PT_HI,
    DW,
    DUR_BASE,
    KERALA_PREV,
    INIT_DMFT,
    JANAKIRAM,
    PANDEY,
    ZONE_TO_REGION,
    PANDEY_ZONE,
    DEDICATED_DENTIST_ANNUAL_REACH,
    
    // Core functions
    mixFor,
    relativeRisk,
    calculatePrevalence,
    calculateStatePools,
    simulateSingleCamp,
    simulateMonth,
    simulateYear,
    runPSA
  };
}));
