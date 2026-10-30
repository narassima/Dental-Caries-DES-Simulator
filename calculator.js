/**
 * Dental Health & Workforce Calculator
 * Dedicated engine for national health impact and workforce calculations.
 * Powered by Discrete Event Simulation (DES) Engine (simulation.js) & SheetJS Exporter (exporter.js)
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const calcState = {
    country: 'India',
    countryName: 'India (National Baseline & 35 States)',
    currency: 'INR (₹)',
    tier: 'Plausible',
    params: {
      camps: 8,
      ts: 30,
      months: 10,
      shift_hours: 8.0,
      dentists: 10287,
      phi: 0.50,
      aux_ratio: 2.0,
      teacher_ratio: 1.0,
      enrolment: 107869006,
      pop_6_8: 34230216,
      pop_9_11: 34244196,
      pop_12_15: 39394594,
      dmft: 1.4,
      r_pct: 0,
      prev_6_8: 41.71,
      prev_9_11: 34.8,
      prev_12_15: 23.48,
      students_per_camp: 14,
      ref_scale: 1.0,
      rho: 0.15,
      admit_time: 1.0
    },
    customCountry: {
      name: 'Custom Country Model',
      currency: 'USD ($)',
      pop_6_8: 34230216,
      pop_9_11: 34244196,
      pop_12_15: 39394594,
      dentists: 10287,
      prev_6_8: 41.71,
      prev_9_11: 34.8,
      prev_12_15: 23.48,
      init_dmft: 1.4,
      provinces: []
    },
    uploadedData: null,
    baseResult: null,
    currentResult: null
  };

  // =========================================================================
  // DOM ELEMENT REFERENCES
  // =========================================================================

  // Top Bar & Active Badges
  const elCountrySelect = document.getElementById('countrySelect');
  const elLblActiveCountry = document.getElementById('lblActiveCountry');
  const elBadgeActiveTier = document.getElementById('badgeActiveTier');
  const elLblCountryTag = document.getElementById('lblCountryTag');

  // Card 1: Geographic & System Profile Inputs
  const elInputCountryName = document.getElementById('inputCountryName');
  const elInputCountryCurrency = document.getElementById('inputCountryCurrency');
  const btnOpenUploadModalDirect = document.getElementById('btnOpenUploadModalDirect');
  const btnDownloadTemplateLeft = document.getElementById('btnDownloadTemplateLeft');

  // Card 2: Outreach Policy & Scheduling Inputs
  const elInputCamps = document.getElementById('inputCampsPerMonth');
  const badgeCampsVal = document.getElementById('badgeCampsVal');
  const elInputTs = document.getElementById('inputTs');
  const badgeDelegationVal = document.getElementById('badgeDelegationVal');
  const elInputMonths = document.getElementById('inputMonths');
  const badgeMonthsVal = document.getElementById('badgeMonthsVal');
  const elInputShiftHours = document.getElementById('inputShiftHours');
  const badgeShiftVal = document.getElementById('badgeShiftVal');

  // Card 3: Healthcare Workforce Supply Inputs
  const elInputDentists = document.getElementById('inputDentists');
  const badgeDentistsVal = document.getElementById('badgeDentistsVal');
  const elInputPhi = document.getElementById('inputPhi');
  const badgePhiVal = document.getElementById('badgePhiVal');
  const elInputAuxRatio = document.getElementById('inputAuxRatio');
  const badgeAuxVal = document.getElementById('badgeAuxVal');
  const elInputTeacherRatio = document.getElementById('inputTeacherRatio');
  const badgeTeacherVal = document.getElementById('badgeTeacherVal');

  // Card 4: Student Enrolment Cohort Inputs
  const elInputTotalEnrolment = document.getElementById('inputTotalEnrolment');
  const badgeTotalEnr = document.getElementById('badgeTotalEnr');
  const elInputPop6_8 = document.getElementById('inputPop6_8');
  const elInputPop9_11 = document.getElementById('inputPop9_11');
  const elInputPop12_15 = document.getElementById('inputPop12_15');

  // Card 5: Epidemiology & Baseline Disease Burden Inputs
  const elInputMeanDmft = document.getElementById('inputMeanDmft');
  const badgeDmftVal = document.getElementById('badgeDmftVal');
  const elInputRBenefit = document.getElementById('inputRBenefit');
  const badgeRVal = document.getElementById('badgeRVal');
  const elInputPrev6_8 = document.getElementById('inputPrev6_8');
  const elInputPrev9_11 = document.getElementById('inputPrev9_11');
  const elInputPrev12_15 = document.getElementById('inputPrev12_15');

  // Card 6: Camp Screening Dynamics & Flow Inputs
  const elInputStudentsPerCamp = document.getElementById('inputStudentsPerCamp');
  const badgeStudentsVal = document.getElementById('badgeStudentsVal');
  const elInputRho = document.getElementById('inputRho');
  const badgeRhoVal = document.getElementById('badgeRhoVal');
  const elInputAdmitTime = document.getElementById('inputAdmitTime');
  const badgeAdmitVal = document.getElementById('badgeAdmitVal');

  // Primary Action Buttons
  const elBtnRecalculate = document.getElementById('btnRecalculate');
  const elBtnResetDefaults = document.getElementById('btnResetDefaults');

  // Modals & Navigation
  const modalCountry = document.getElementById('countryTemplateModal');
  const modalGuide = document.getElementById('howToGuideModal');
  const btnCloseCountryModal = document.getElementById('btnCloseCountryModal');
  const btnCloseCountryModalFooter = document.getElementById('btnCloseCountryModalFooter');
  const btnCloseGuideModal = document.getElementById('btnCloseGuideModal');
  const btnCloseGuideModalFooter = document.getElementById('btnCloseGuideModalFooter');
  const btnOpenGuideNav = document.getElementById('btnOpenGuideNav');
  const btnDownloadTemplateNav = document.getElementById('btnDownloadTemplateNav');
  const btnModalDownloadTemplate = document.getElementById('btnModalDownloadTemplate');
  const btnUploadModalNav = document.getElementById('btnUploadModalNav');
  const btnTriggerUploadPopup = document.getElementById('btnTriggerUploadPopup');
  const dropzoneCountry = document.getElementById('dropzoneCountry');
  const modalFileUpload = document.getElementById('modalFileUpload');
  const uploadPreviewBanner = document.getElementById('uploadPreviewBanner');
  const uploadPreviewDetails = document.getElementById('uploadPreviewDetails');
  const btnApplyUploadedData = document.getElementById('btnApplyUploadedData');
  const btnExportResultsNav = document.getElementById('btnExportResultsNav');
  const btnDownloadTableExcel = document.getElementById('btnDownloadTableExcel');

  // =========================================================================
  // UTILITIES & FORMATTERS
  // =========================================================================

  function formatM(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + ' M';
    if (num >= 1000) return (num / 1000).toFixed(1) + ' k';
    return Math.round(num).toLocaleString();
  }

  // =========================================================================
  // TWO-WAY DOM <-> STATE SYNCHRONIZATION
  // =========================================================================

  function syncDOMFromState() {
    if (elInputCountryName) elInputCountryName.value = calcState.countryName;
    if (elInputCountryCurrency) elInputCountryCurrency.value = calcState.currency;

    if (elInputCamps) elInputCamps.value = calcState.params.camps;
    if (elInputTs) elInputTs.value = calcState.params.ts;
    if (elInputMonths) elInputMonths.value = calcState.params.months;
    if (elInputShiftHours) elInputShiftHours.value = calcState.params.shift_hours;

    if (elInputDentists) elInputDentists.value = calcState.params.dentists;
    if (elInputPhi) elInputPhi.value = Math.round(calcState.params.phi * 100);
    if (elInputAuxRatio) elInputAuxRatio.value = calcState.params.aux_ratio;
    if (elInputTeacherRatio) elInputTeacherRatio.value = calcState.params.teacher_ratio;

    if (elInputTotalEnrolment) elInputTotalEnrolment.value = calcState.params.enrolment;
    if (elInputPop6_8) elInputPop6_8.value = calcState.params.pop_6_8;
    if (elInputPop9_11) elInputPop9_11.value = calcState.params.pop_9_11;
    if (elInputPop12_15) elInputPop12_15.value = calcState.params.pop_12_15;

    if (elInputMeanDmft) elInputMeanDmft.value = calcState.params.dmft;
    if (elInputRBenefit) elInputRBenefit.value = calcState.params.r_pct;
    if (elInputPrev6_8) elInputPrev6_8.value = calcState.params.prev_6_8;
    if (elInputPrev9_11) elInputPrev9_11.value = calcState.params.prev_9_11;
    if (elInputPrev12_15) elInputPrev12_15.value = calcState.params.prev_12_15;

    if (elInputStudentsPerCamp) elInputStudentsPerCamp.value = calcState.params.students_per_camp;
    if (elInputRho) elInputRho.value = Math.round(calcState.params.rho * 100);
    if (elInputAdmitTime) elInputAdmitTime.value = calcState.params.admit_time;

    updateBadgesFromState();
  }

  function readInputsFromDOM() {
    if (elInputCountryName) calcState.countryName = elInputCountryName.value.trim() || 'Custom Jurisdiction';
    if (elInputCountryCurrency) calcState.currency = elInputCountryCurrency.value.trim() || 'USD ($)';

    if (elInputCamps) {
      let c = parseInt(elInputCamps.value, 10);
      calcState.params.camps = isNaN(c) ? 8 : Math.max(1, Math.min(22, c));
    }

    if (elInputTs) {
      let t = parseInt(elInputTs.value, 10);
      calcState.params.ts = isNaN(t) ? 30 : Math.max(0, Math.min(30, t));
    }

    if (elInputMonths) {
      let m = parseInt(elInputMonths.value, 10);
      calcState.params.months = isNaN(m) ? 10 : Math.max(1, Math.min(12, m));
    }

    if (elInputShiftHours) {
      let s = parseFloat(elInputShiftHours.value);
      calcState.params.shift_hours = isNaN(s) ? 8.0 : Math.max(2, Math.min(16, s));
    }

    if (elInputDentists) {
      let d = parseInt(elInputDentists.value, 10);
      calcState.params.dentists = isNaN(d) ? 10287 : Math.max(1, d);
    }

    if (elInputPhi) {
      let p = parseFloat(elInputPhi.value);
      calcState.params.phi = isNaN(p) ? 0.50 : Math.max(0.01, Math.min(1.0, p / 100.0));
    }

    if (elInputAuxRatio) {
      let a = parseFloat(elInputAuxRatio.value);
      calcState.params.aux_ratio = isNaN(a) ? 2.0 : Math.max(0, a);
    }

    if (elInputTeacherRatio) {
      let tr = parseFloat(elInputTeacherRatio.value);
      calcState.params.teacher_ratio = isNaN(tr) ? 1.0 : Math.max(0, tr);
    }

    const p6 = elInputPop6_8 ? (parseInt(elInputPop6_8.value, 10) || 34230216) : 34230216;
    const p9 = elInputPop9_11 ? (parseInt(elInputPop9_11.value, 10) || 34244196) : 34244196;
    const p12 = elInputPop12_15 ? (parseInt(elInputPop12_15.value, 10) || 39394594) : 39394594;
    calcState.params.pop_6_8 = p6;
    calcState.params.pop_9_11 = p9;
    calcState.params.pop_12_15 = p12;
    calcState.params.enrolment = elInputTotalEnrolment ? (parseInt(elInputTotalEnrolment.value, 10) || (p6 + p9 + p12)) : (p6 + p9 + p12);

    if (elInputMeanDmft) {
      let dmft = parseFloat(elInputMeanDmft.value);
      calcState.params.dmft = isNaN(dmft) ? 1.4 : Math.max(0.1, dmft);
    }

    if (elInputRBenefit) {
      let r = parseInt(elInputRBenefit.value, 10);
      calcState.params.r_pct = isNaN(r) ? 0 : Math.max(0, Math.min(10, r));
    }

    if (elInputPrev6_8) {
      let pr6 = parseFloat(elInputPrev6_8.value);
      calcState.params.prev_6_8 = isNaN(pr6) ? 52.0 : Math.max(0.1, Math.min(100.0, pr6));
    }

    if (elInputPrev9_11) {
      let pr9 = parseFloat(elInputPrev9_11.value);
      calcState.params.prev_9_11 = isNaN(pr9) ? 55.0 : Math.max(0.1, Math.min(100.0, pr9));
    }

    if (elInputPrev12_15) {
      let pr12 = parseFloat(elInputPrev12_15.value);
      calcState.params.prev_12_15 = isNaN(pr12) ? 60.0 : Math.max(0.1, Math.min(100.0, pr12));
    }

    if (elInputStudentsPerCamp) {
      let studs = parseInt(elInputStudentsPerCamp.value, 10);
      calcState.params.students_per_camp = isNaN(studs) ? 14 : Math.max(2, Math.min(60, studs));
      calcState.params.ref_scale = calcState.params.students_per_camp / 14.0;
    }

    if (elInputRho) {
      let rho = parseFloat(elInputRho.value);
      calcState.params.rho = isNaN(rho) ? 0.15 : Math.max(0, Math.min(0.50, rho / 100.0));
    }

    if (elInputAdmitTime) {
      let adm = parseFloat(elInputAdmitTime.value);
      calcState.params.admit_time = isNaN(adm) ? 1.0 : Math.max(0.1, adm);
    }

    updateBadgesFromState();
  }

  function updateBadgesFromState() {
    if (badgeCampsVal) badgeCampsVal.textContent = `${calcState.params.camps} camps/mo`;
    if (badgeDelegationVal) badgeDelegationVal.textContent = `${calcState.params.ts}% TS`;
    if (badgeMonthsVal) badgeMonthsVal.textContent = `${calcState.params.months} mos/yr`;
    if (badgeShiftVal) badgeShiftVal.textContent = `${calcState.params.shift_hours.toFixed(1)} hrs/day`;

    if (badgeDentistsVal) badgeDentistsVal.textContent = calcState.params.dentists.toLocaleString();
    if (badgePhiVal) badgePhiVal.textContent = `${Math.round(calcState.params.phi * 100)}%`;
    if (badgeAuxVal) badgeAuxVal.textContent = `${calcState.params.aux_ratio.toFixed(1)}`;
    if (badgeTeacherVal) badgeTeacherVal.textContent = `${calcState.params.teacher_ratio.toFixed(1)}`;

    if (badgeTotalEnr) badgeTotalEnr.textContent = formatM(calcState.params.enrolment);
    if (badgeDmftVal) badgeDmftVal.textContent = calcState.params.dmft.toFixed(1);
    if (badgeRVal) badgeRVal.textContent = `${calcState.params.r_pct}%`;

    if (badgeStudentsVal) badgeStudentsVal.textContent = `${calcState.params.students_per_camp} students`;
    if (badgeRhoVal) badgeRhoVal.textContent = `${Math.round(calcState.params.rho * 100)}%`;
    if (badgeAdmitVal) badgeAdmitVal.textContent = `${calcState.params.admit_time.toFixed(1)} min`;
  }

  // =========================================================================
  // SIMULATION MODEL INTEGRATION
  // =========================================================================

  function getEntities() {
    const isIndia = calcState.country === 'India';
    if (isIndia && window.PAPER_DATA && window.PAPER_DATA.states_raw) {
      const baseDentists = 10287;
      const baseEnrolment = 107869006;
      const dentScale = calcState.params.dentists / baseDentists;
      const enrScale = calcState.params.enrolment / baseEnrolment;

      return window.PAPER_DATA.states_raw.map(st => {
        const p = (st.enr_primary_1_5 || 0) * enrScale;
        const u = (st.enr_upper_primary_6_8 || 0) * enrScale;
        const s = (st.enr_secondary_9_10 || 0) * enrScale;
        return {
          state: st.state,
          zone: st.zone,
          dentists: Math.max(0, Math.round((st.dentists || 0) * dentScale)),
          schools: Math.round((st.govt_schools || 0) * enrScale),
          enr_primary_1_5: p,
          enr_upper_primary_6_8: u,
          enr_secondary_9_10: s,
          pop_6_8: p * 3 / 5,
          pop_9_11: p * 2 / 5 + u / 3,
          pop_12_15: u * 2 / 3 + s,
          govt_enr_1_10: p + u + s
        };
      });
    }

    // Custom or Archetype Entities
    const cc = calcState.customCountry;
    if (cc.provinces && cc.provinces.length > 0) {
      const totalCustomPop = calcState.params.enrolment;
      return cc.provinces.map(p => ({
        state: p.name,
        zone: 'Custom',
        dentists: p.dentists,
        schools: Math.round(p.pop_total / 250),
        pop_6_8: p.pop_total * (calcState.params.pop_6_8 / totalCustomPop),
        pop_9_11: p.pop_total * (calcState.params.pop_9_11 / totalCustomPop),
        pop_12_15: p.pop_total * (calcState.params.pop_12_15 / totalCustomPop),
        govt_enr_1_10: p.pop_total
      }));
    }

    // Single unified national entity
    return [{
      state: calcState.countryName,
      zone: 'Custom',
      dentists: calcState.params.dentists,
      schools: Math.round(calcState.params.enrolment / 250),
      pop_6_8: calcState.params.pop_6_8,
      pop_9_11: calcState.params.pop_9_11,
      pop_12_15: calcState.params.pop_12_15,
      govt_enr_1_10: calcState.params.enrolment
    }];
  }

  function runModelSimulation(camps, ts, phi) {
    if (!window.DesEngine) {
      console.error('DES Engine not loaded');
      return null;
    }

    const entities = getEntities();
    const refPrev = [
      calcState.params.prev_6_8 / 100.0,
      calcState.params.prev_9_11 / 100.0,
      calcState.params.prev_12_15 / 100.0
    ];

    const stateResults = entities.map(ent => {
      return window.DesEngine.simulateYear(ent, camps, ts, calcState.params.r_pct, {
        phi: phi,
        rho: calcState.params.rho,
        months: calcState.params.months,
        gradient: (calcState.country === 'India' ? 'janakiram' : 'none'),
        anchor: 1.0,
        ref_scale: calcState.params.ref_scale,
        refPrev: refPrev
      });
    });

    const nat = {
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

    nat.coverage = nat.pool > 0 ? (nat.unique / nat.pool) * 100.0 : 0;
    const totalDentWorkMin = nat.n_av * 22 * 480 * calcState.params.months;
    const totalDentProcMin = stateResults.reduce((acc, s) => acc + (s.dent_util / 100.0) * (s.n_av * 22 * 480 * calcState.params.months), 0);
    nat.dent_util = totalDentWorkMin > 0 ? (totalDentProcMin / totalDentWorkMin) * 100.0 : 0;

    return nat;
  }

  function calculateAndRender() {
    // 1. Calculate Status Quo Baseline (camps=2, ts=0, phi=0.5)
    calcState.baseResult = runModelSimulation(2, 0, 0.50);

    // 2. Calculate Current Selected Scenario
    calcState.currentResult = runModelSimulation(
      calcState.params.camps,
      calcState.params.ts,
      calcState.params.phi
    );

    const base = calcState.baseResult;
    const curr = calcState.currentResult;
    if (!base || !curr) return;

    // Update Headline KPI Badges
    const elKpiReached = document.getElementById('kpiReached');
    if (elKpiReached) elKpiReached.textContent = formatM(curr.unique);

    const elKpiCoverage = document.getElementById('kpiCoverage');
    if (elKpiCoverage) elKpiCoverage.textContent = `${curr.coverage.toFixed(2)}%`;

    const dentSavedPct = Math.max(0, 100 - curr.dent_util);
    const elKpiDentistSaved = document.getElementById('kpiDentistSaved');
    if (elKpiDentistSaved) elKpiDentistSaved.textContent = `${dentSavedPct.toFixed(1)}%`;

    const elKpiDentistsNeeded = document.getElementById('kpiDentistsNeeded');
    if (elKpiDentistsNeeded) elKpiDentistsNeeded.textContent = Math.round(curr.dedicated_dentists_needed).toLocaleString();

    const elKpiYldInYear = document.getElementById('kpiYldInYear');
    if (elKpiYldInYear) elKpiYldInYear.textContent = Math.round(curr.yld_inyear).toLocaleString();

    // Update Comparison Table
    const elCompCamps = document.getElementById('compCamps');
    if (elCompCamps) elCompCamps.textContent = `${calcState.params.camps} camps / month`;

    const diffCamps = calcState.params.camps - 2;
    const elCompCampsDiff = document.getElementById('compCampsDiff');
    if (elCompCampsDiff) elCompCampsDiff.textContent = diffCamps >= 0 ? `+${diffCamps} camps / mo` : `${diffCamps} camps / mo`;

    const elCompDelegation = document.getElementById('compDelegation');
    if (elCompDelegation) elCompDelegation.textContent = `${calcState.params.ts}% Team Delegation`;

    const elCompBaseReached = document.getElementById('compBaseReached');
    if (elCompBaseReached) elCompBaseReached.textContent = formatM(base.unique);

    const elCompSelReached = document.getElementById('compSelReached');
    if (elCompSelReached) elCompSelReached.textContent = formatM(curr.unique);

    const diffReached = curr.unique - base.unique;
    const elCompGainReached = document.getElementById('compGainReached');
    if (elCompGainReached) elCompGainReached.textContent = (diffReached >= 0 ? '+' : '') + formatM(diffReached) + ' Children';

    const elCompBaseCoverage = document.getElementById('compBaseCoverage');
    if (elCompBaseCoverage) elCompBaseCoverage.textContent = `${base.coverage.toFixed(2)}%`;

    const elCompSelCoverage = document.getElementById('compSelCoverage');
    if (elCompSelCoverage) elCompSelCoverage.textContent = `${curr.coverage.toFixed(2)}%`;

    const diffCov = curr.coverage - base.coverage;
    const ratioCov = base.coverage > 0 ? (curr.coverage / base.coverage).toFixed(1) : '1.0';
    const elCompGainCoverage = document.getElementById('compGainCoverage');
    if (elCompGainCoverage) elCompGainCoverage.textContent = `+${diffCov.toFixed(2)} pp (${ratioCov}× Reach)`;

    const elCompBaseSaved = document.getElementById('compBaseSaved');
    if (elCompBaseSaved) elCompBaseSaved.textContent = `${(100 - base.dent_util).toFixed(1)}%`;

    const elCompSelSaved = document.getElementById('compSelSaved');
    if (elCompSelSaved) elCompSelSaved.textContent = `${dentSavedPct.toFixed(1)}%`;

    const elCompBaseDentNeeded = document.getElementById('compBaseDentNeeded');
    if (elCompBaseDentNeeded) elCompBaseDentNeeded.textContent = `${Math.round(base.dedicated_dentists_needed).toLocaleString()} Dentists`;

    const elCompSelDentNeeded = document.getElementById('compSelDentNeeded');
    if (elCompSelDentNeeded) elCompSelDentNeeded.textContent = `${Math.round(curr.dedicated_dentists_needed).toLocaleString()} Dentists`;

    const diffDentNeeded = curr.dedicated_dentists_needed - base.dedicated_dentists_needed;
    const elCompDentSaved = document.getElementById('compDentSaved');
    if (elCompDentSaved) elCompDentSaved.textContent = `${diffDentNeeded <= 0 ? '' : '+'}${Math.round(diffDentNeeded).toLocaleString()} Dentists Needed`;

    const elCompBaseYld = document.getElementById('compBaseYld');
    if (elCompBaseYld) elCompBaseYld.textContent = `${Math.round(base.yld_inyear).toLocaleString()} YLDs`;

    const elCompSelYld = document.getElementById('compSelYld');
    if (elCompSelYld) elCompSelYld.textContent = `${Math.round(curr.yld_inyear).toLocaleString()} YLDs`;

    const diffYld = curr.yld_inyear - base.yld_inyear;
    const elCompGainYld = document.getElementById('compGainYld');
    if (elCompGainYld) elCompGainYld.textContent = `+${Math.round(diffYld).toLocaleString()} YLDs Averted`;

    // Clinical Procedures Distribution
    const dentProcs = Math.round(curr.served * (calcState.params.ts === 0 ? 1.0 : 0.463));
    const auxProcs = Math.round(curr.served * (calcState.params.ts === 0 ? 0.0 : 0.108));
    const teacherProcs = Math.round(curr.served * (calcState.params.ts === 0 ? 0.0 : 0.429));

    const elProcDentistCount = document.getElementById('procDentistCount');
    if (elProcDentistCount) elProcDentistCount.textContent = formatM(dentProcs);

    const elProcAuxCount = document.getElementById('procAuxCount');
    if (elProcAuxCount) elProcAuxCount.textContent = formatM(auxProcs);

    const elProcTeacherCount = document.getElementById('procTeacherCount');
    if (elProcTeacherCount) elProcTeacherCount.textContent = formatM(teacherProcs);

    // Executive Policy Narrative
    updatePolicyBriefing(curr, base);

    // Update Active Banner Badges
    if (elLblActiveCountry) elLblActiveCountry.textContent = calcState.countryName;
    if (elBadgeActiveTier) {
      elBadgeActiveTier.textContent = `${calcState.tier} (${calcState.params.camps} camps/mo, TS ${calcState.params.ts}%, φ=${calcState.params.phi.toFixed(2)})`;
    }
  }

  function updatePolicyBriefing(curr, base) {
    const el = document.getElementById('calcBriefingText');
    if (!el) return;

    const country = calcState.countryName;
    const tier = calcState.tier;
    const reachedStr = formatM(curr.unique);
    const poolStr = formatM(curr.pool);
    const covStr = `${curr.coverage.toFixed(1)}%`;
    const dentistsNeeded = Math.round(curr.dedicated_dentists_needed).toLocaleString();
    const dentSaved = Math.max(0, 100 - curr.dent_util).toFixed(1);

    let text = '';
    if (tier === 'Status quo') {
      text = `Under current baseline practice (<strong>Status Quo Baseline</strong>: 2 camps/month per dentist, solo practice without task delegation), school dental outreach in <strong>${country}</strong> treats <strong>${reachedStr}</strong> children annually, achieving only <strong>${covStr}</strong> coverage of the ${poolStr} children with active tooth decay. A massive workforce gap remains: achieving full population coverage would mathematically demand over <strong>${dentistsNeeded}</strong> dedicated full-time dental surgeons.`;
    } else if (tier === 'Plausible') {
      text = `Under the recommended <strong>Plausible Target</strong> (${calcState.params.camps} camps/month, ${calcState.params.ts}% team delegation to auxiliaries & teachers), annual reach in <strong>${country}</strong> expands to <strong>${reachedStr}</strong> children (<strong>${covStr}</strong> national coverage). With oral health education delegated to teachers and fluoride varnish to dental auxiliaries, camp procedures take <strong>${curr.dent_util.toFixed(1)}%</strong> of available dentists' working time, and reaching the remaining children would need <strong>${dentistsNeeded}</strong> dedicated dental surgeons.`;
    } else if (tier === 'Stretch') {
      text = `Under <strong>Stretch Outreach</strong> (${calcState.params.camps} camps/month, ${calcState.params.ts}% team delegation, ${Math.round(calcState.params.phi * 100)}% public dentist participation), annual coverage in <strong>${country}</strong> increases to <strong>${covStr}</strong>, delivering treatment to <strong>${reachedStr}</strong> children. Camp procedures take <strong>${curr.dent_util.toFixed(1)}%</strong> of available dentists' working time.`;
    } else {
      text = `Under the <strong>Theoretical Maximum Bound</strong> (${calcState.params.camps} camps/month daily school visits, ${Math.round(calcState.params.phi * 100)}% public dentist participation), annual outreach treats <strong>${reachedStr}</strong> children (<strong>${covStr}</strong> coverage). This scenario demonstrates the mathematical ceiling of the existing public dental workforce supply in <strong>${country}</strong>, confirming that workforce availability—rather than scheduling—is the ultimate constraint.`;
    }

    el.innerHTML = text;
  }

  // =========================================================================
  // DEBOUNCED INPUT BINDINGS (SNAPPY & LIVE)
  // =========================================================================

  let debounceTimer = null;
  function triggerRecalcDebounced() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      readInputsFromDOM();
      calculateAndRender();
    }, 150);
  }

  function triggerRecalcImmediate() {
    clearTimeout(debounceTimer);
    readInputsFromDOM();
    calculateAndRender();
  }

  // Attach live calculation to every input field
  const allInputElements = [
    elInputCountryName, elInputCountryCurrency,
    elInputCamps, elInputTs, elInputMonths, elInputShiftHours,
    elInputDentists, elInputPhi, elInputAuxRatio, elInputTeacherRatio,
    elInputMeanDmft, elInputRBenefit,
    elInputPrev6_8, elInputPrev9_11, elInputPrev12_15,
    elInputStudentsPerCamp, elInputRho, elInputAdmitTime
  ];

  allInputElements.forEach(inp => {
    if (inp) {
      inp.addEventListener('input', triggerRecalcDebounced);
      inp.addEventListener('change', triggerRecalcImmediate);
    }
  });

  // Two-way synchronization: Total Enrolment <-> Age Cohorts
  if (elInputTotalEnrolment) {
    elInputTotalEnrolment.addEventListener('input', function () {
      const total = parseInt(elInputTotalEnrolment.value, 10);
      if (!isNaN(total) && total > 0) {
        // Proportions based on baseline 34.2M : 34.2M : 39.4M (Total: 107.9M)
        const p6 = Math.round(total * (34.23 / 107.87));
        const p9 = Math.round(total * (34.24 / 107.87));
        const p12 = total - p6 - p9;

        if (elInputPop6_8) elInputPop6_8.value = p6;
        if (elInputPop9_11) elInputPop9_11.value = p9;
        if (elInputPop12_15) elInputPop12_15.value = p12;

        if (badgeTotalEnr) badgeTotalEnr.textContent = formatM(total);
      }
      triggerRecalcDebounced();
    });

    elInputTotalEnrolment.addEventListener('change', triggerRecalcImmediate);
  }

  [elInputPop6_8, elInputPop9_11, elInputPop12_15].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', function () {
        const p6 = parseInt(elInputPop6_8 ? elInputPop6_8.value : 0, 10) || 0;
        const p9 = parseInt(elInputPop9_11 ? elInputPop9_11.value : 0, 10) || 0;
        const p12 = parseInt(elInputPop12_15 ? elInputPop12_15.value : 0, 10) || 0;
        const total = p6 + p9 + p12;

        if (elInputTotalEnrolment) elInputTotalEnrolment.value = total;
        if (badgeTotalEnr) badgeTotalEnr.textContent = formatM(total);

        triggerRecalcDebounced();
      });

      inp.addEventListener('change', triggerRecalcImmediate);
    }
  });

  // Recalculate button click
  if (elBtnRecalculate) {
    elBtnRecalculate.addEventListener('click', triggerRecalcImmediate);
  }

  // =========================================================================
  // SCENARIO PRESETS & ARCHETYPES
  // =========================================================================

  // Quick Policy Scenario Tier Chips
  document.querySelectorAll('.calc-tier-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.calc-tier-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tier = btn.getAttribute('data-tier');
      calcState.tier = tier;

      if (tier === 'Status quo') {
        calcState.params.camps = 2;
        calcState.params.ts = 0;
        calcState.params.phi = 0.50;
      } else if (tier === 'Plausible') {
        calcState.params.camps = 8;
        calcState.params.ts = 30;
        calcState.params.phi = 0.50;
      } else if (tier === 'Stretch') {
        calcState.params.camps = 12;
        calcState.params.ts = 30;
        calcState.params.phi = 0.80;
      } else if (tier === 'Theoretical max') {
        calcState.params.camps = 22;
        calcState.params.ts = 30;
        calcState.params.phi = 1.00;
      }

      syncDOMFromState();
      calculateAndRender();
    });
  });

  // Reset to Plausible Target Baseline Defaults
  if (elBtnResetDefaults) {
    elBtnResetDefaults.addEventListener('click', function () {
      calcState.country = 'India';
      calcState.countryName = 'India (National Baseline & 35 States)';
      calcState.currency = 'INR (₹)';
      calcState.tier = 'Plausible';

      calcState.params = {
        camps: 8,
        ts: 30,
        months: 10,
        shift_hours: 8.0,
        dentists: 10287,
        phi: 0.50,
        aux_ratio: 2.0,
        teacher_ratio: 1.0,
        enrolment: 107869006,
        pop_6_8: 34230216,
        pop_9_11: 34244196,
        pop_12_15: 39394594,
        dmft: 1.4,
        r_pct: 0,
        prev_6_8: 41.71,
        prev_9_11: 34.8,
        prev_12_15: 23.48,
        students_per_camp: 14,
        ref_scale: 1.0,
        rho: 0.15,
        admit_time: 1.0
      };

      if (elCountrySelect) elCountrySelect.value = 'India';
      if (elLblCountryTag) elLblCountryTag.textContent = 'Preloaded';

      document.querySelectorAll('.calc-tier-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tier') === 'Plausible');
      });

      syncDOMFromState();
      calculateAndRender();
    });
  }

  // Country Dropdown Change: Prompt template modal if changing from India!
  if (elCountrySelect) {
    elCountrySelect.addEventListener('change', function (e) {
      const val = e.target.value;

      if (val === 'India') {
        calcState.country = 'India';
        calcState.countryName = 'India (National Baseline & 35 States)';
        calcState.currency = 'INR (₹)';
        calcState.params.dentists = 10287;
        calcState.params.enrolment = 107869006;
        calcState.params.pop_6_8 = 34230216;
        calcState.params.pop_9_11 = 34244196;
        calcState.params.pop_12_15 = 39394594;
        calcState.params.prev_6_8 = 41.71;
        calcState.params.prev_9_11 = 34.8;
        calcState.params.prev_12_15 = 23.48;
        calcState.params.dmft = 1.4;

        if (elLblCountryTag) elLblCountryTag.textContent = 'Preloaded';
        syncDOMFromState();
        calculateAndRender();
        return;
      }

      // If Custom or any Archetype: Open modal immediately as requested by user!
      openCountryModal();

      if (val === 'low-income') applyArchetype('low-income');
      else if (val === 'lower-middle') applyArchetype('lower-middle');
      else if (val === 'upper-middle') applyArchetype('upper-middle');
      else if (val === 'high-income') applyArchetype('high-income');
    });
  }

  function applyArchetype(preset) {
    calcState.country = 'Custom';
    if (elCountrySelect) elCountrySelect.value = preset;
    if (elLblCountryTag) elLblCountryTag.textContent = 'WHO Archetype';

    if (preset === 'low-income') {
      calcState.countryName = 'Low-Income Country Profile (WHO)';
      calcState.currency = 'USD ($)';
      calcState.params.dentists = 250;
      calcState.params.enrolment = 10000000;
      calcState.params.pop_6_8 = 3500000;
      calcState.params.pop_9_11 = 3300000;
      calcState.params.pop_12_15 = 3200000;
      calcState.params.prev_6_8 = 65.0;
      calcState.params.prev_9_11 = 68.0;
      calcState.params.prev_12_15 = 72.0;
      calcState.params.dmft = 3.2;
    } else if (preset === 'lower-middle') {
      calcState.countryName = 'Lower-Middle Income Profile (WHO)';
      calcState.currency = 'USD ($)';
      calcState.params.dentists = 800;
      calcState.params.enrolment = 8800000;
      calcState.params.pop_6_8 = 3080000;
      calcState.params.pop_9_11 = 2900000;
      calcState.params.pop_12_15 = 2820000;
      calcState.params.prev_6_8 = 52.0;
      calcState.params.prev_9_11 = 55.0;
      calcState.params.prev_12_15 = 60.0;
      calcState.params.dmft = 2.5;
    } else if (preset === 'upper-middle') {
      calcState.countryName = 'Upper-Middle Income Profile (WHO)';
      calcState.currency = 'USD ($)';
      calcState.params.dentists = 1500;
      calcState.params.enrolment = 6000000;
      calcState.params.pop_6_8 = 2100000;
      calcState.params.pop_9_11 = 1980000;
      calcState.params.pop_12_15 = 1920000;
      calcState.params.prev_6_8 = 45.0;
      calcState.params.prev_9_11 = 48.0;
      calcState.params.prev_12_15 = 52.0;
      calcState.params.dmft = 1.9;
    } else if (preset === 'high-income') {
      calcState.countryName = 'Universal School Health Model (High-Income)';
      calcState.currency = 'EUR (€)';
      calcState.params.dentists = 4500;
      calcState.params.enrolment = 4500000;
      calcState.params.pop_6_8 = 1575000;
      calcState.params.pop_9_11 = 1485000;
      calcState.params.pop_12_15 = 1440000;
      calcState.params.prev_6_8 = 25.0;
      calcState.params.prev_9_11 = 28.0;
      calcState.params.prev_12_15 = 32.0;
      calcState.params.dmft = 1.2;
    }

    syncDOMFromState();
    calculateAndRender();
  }

  // Quick Archetype Buttons in Modal
  document.querySelectorAll('.btn-quick-archetype').forEach(btn => {
    btn.addEventListener('click', function () {
      const preset = btn.getAttribute('data-preset');
      applyArchetype(preset);
      closeCountryModal();
    });
  });

  // =========================================================================
  // MODAL INTERACTION HANDLERS & EXCEL TEMPLATE ENGINE
  // =========================================================================

  function openCountryModal() {
    if (modalCountry) modalCountry.classList.add('active');
  }

  function closeCountryModal() {
    if (modalCountry) modalCountry.classList.remove('active');
  }

  function openGuideModal() {
    if (modalGuide) modalGuide.classList.add('active');
  }

  function closeGuideModal() {
    if (modalGuide) modalGuide.classList.remove('active');
  }

  if (btnCloseCountryModal) btnCloseCountryModal.addEventListener('click', closeCountryModal);
  if (btnCloseCountryModalFooter) btnCloseCountryModalFooter.addEventListener('click', closeCountryModal);
  if (btnTriggerUploadPopup) btnTriggerUploadPopup.addEventListener('click', openCountryModal);
  if (btnOpenUploadModalDirect) btnOpenUploadModalDirect.addEventListener('click', openCountryModal);
  if (btnUploadModalNav) btnUploadModalNav.addEventListener('click', openCountryModal);

  if (btnOpenGuideNav) btnOpenGuideNav.addEventListener('click', openGuideModal);
  const btnHelpCountry = document.getElementById('btnHelpCountry');
  if (btnHelpCountry) btnHelpCountry.addEventListener('click', openGuideModal);
  const btnHelpTiers = document.getElementById('btnHelpTiers');
  if (btnHelpTiers) btnHelpTiers.addEventListener('click', openGuideModal);
  if (btnCloseGuideModal) btnCloseGuideModal.addEventListener('click', closeGuideModal);
  if (btnCloseGuideModalFooter) btnCloseGuideModalFooter.addEventListener('click', closeGuideModal);

  // Close modals on background click or Escape key
  [modalCountry, modalGuide].forEach(m => {
    if (!m) return;
    m.addEventListener('click', function (e) {
      if (e.target === m) m.classList.remove('active');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modalCountry) modalCountry.classList.remove('active');
      if (modalGuide) modalGuide.classList.remove('active');
    }
  });

  // Download Excel Template Handlers
  const handleDownloadTemplate = function () {
    if (window.DES_EXPORTER) {
      window.DES_EXPORTER.downloadInputTemplate();
    } else {
      alert('Exporter module is loading. Please try again.');
    }
  };

  if (btnDownloadTemplateNav) btnDownloadTemplateNav.addEventListener('click', handleDownloadTemplate);
  if (btnModalDownloadTemplate) btnModalDownloadTemplate.addEventListener('click', handleDownloadTemplate);
  if (btnDownloadTemplateLeft) btnDownloadTemplateLeft.addEventListener('click', handleDownloadTemplate);

  // File Upload Handlers (Drag & Drop + Input)
  if (dropzoneCountry && modalFileUpload) {
    dropzoneCountry.addEventListener('click', () => modalFileUpload.click());

    dropzoneCountry.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzoneCountry.classList.add('dragover');
    });

    dropzoneCountry.addEventListener('dragleave', () => {
      dropzoneCountry.classList.remove('dragover');
    });

    dropzoneCountry.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzoneCountry.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processUploadedFile(e.dataTransfer.files[0]);
      }
    });

    modalFileUpload.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processUploadedFile(e.target.files[0]);
      }
    });
  }

  function processUploadedFile(file) {
    if (!window.DES_EXPORTER) {
      alert('Exporter module is loading. Please try again.');
      return;
    }

    window.DES_EXPORTER.uploadInputTemplate(
      file,
      function (parsedConfig, format) {
        calcState.uploadedData = parsedConfig;

        // Populate Preview Banner
        if (uploadPreviewBanner) uploadPreviewBanner.style.display = 'block';
        const name = parsedConfig.name || file.name.replace(/\.[^/.]+$/, '');
        const dent = parsedConfig.dentists ? parsedConfig.dentists.toLocaleString() : 'N/A';
        const stud = (parsedConfig.pop_6_8 + parsedConfig.pop_9_11 + parsedConfig.pop_12_15);
        const provCount = parsedConfig.provinces ? parsedConfig.provinces.length : 0;

        if (uploadPreviewDetails) {
          uploadPreviewDetails.innerHTML = `
            <strong>${name}</strong> | Dentists: <strong>${dent}</strong> | Target Students: <strong>${formatM(stud || 9000000)}</strong> | Subnational Provinces: <strong>${provCount}</strong>
          `;
        }
      },
      function (errMsg) {
        alert('File parsing error:\n' + errMsg);
      }
    );
  }

  if (btnApplyUploadedData) {
    btnApplyUploadedData.addEventListener('click', function () {
      const p = calcState.uploadedData;
      if (!p) return;

      calcState.country = 'Custom';
      calcState.countryName = p.name || 'Custom Country Model';
      if (p.currency) calcState.currency = p.currency;
      calcState.customCountry = { ...calcState.customCountry, ...p };

      if (p.camps) calcState.params.camps = p.camps;
      if (p.ts !== undefined) calcState.params.ts = p.ts;
      if (p.phi !== undefined) calcState.params.phi = p.phi;
      if (p.dentists) calcState.params.dentists = p.dentists;
      if (p.pop_6_8) calcState.params.pop_6_8 = p.pop_6_8;
      if (p.pop_9_11) calcState.params.pop_9_11 = p.pop_9_11;
      if (p.pop_12_15) calcState.params.pop_12_15 = p.pop_12_15;
      calcState.params.enrolment = (calcState.params.pop_6_8 + calcState.params.pop_9_11 + calcState.params.pop_12_15);

      if (p.prev_6_8) calcState.params.prev_6_8 = p.prev_6_8;
      if (p.prev_9_11) calcState.params.prev_9_11 = p.prev_9_11;
      if (p.prev_12_15) calcState.params.prev_12_15 = p.prev_12_15;
      if (p.init_dmft) calcState.params.dmft = p.init_dmft;

      if (elCountrySelect) elCountrySelect.value = 'Custom';
      if (elLblCountryTag) elLblCountryTag.textContent = 'Custom File';

      syncDOMFromState();
      closeCountryModal();
      calculateAndRender();
      alert(`Applied configuration for "${calcState.countryName}"! All input fields updated.`);
    });
  }

  // Export Results Excel
  const handleExportResults = function () {
    if (window.DES_EXPORTER) {
      window.DES_EXPORTER.exportResultsToExcel(
        {
          country: calcState.countryName,
          tier: calcState.tier,
          params: calcState.params,
          simResults: { national: calcState.currentResult, states: [] }
        },
        window.DATA_STORE || {}
      );
    } else {
      alert('Exporter module is loading. Please try again.');
    }
  };

  if (btnExportResultsNav) btnExportResultsNav.addEventListener('click', handleExportResults);
  if (btnDownloadTableExcel) btnDownloadTableExcel.addEventListener('click', handleExportResults);

  // Initial Sync and Calculation Run
  syncDOMFromState();
  calculateAndRender();
});
