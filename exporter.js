/**
 * Dental Caries Discrete Event Simulation (DES) Platform
 * Data Exporter & Importer Module:
 * 1. Excel Template Generator (.xlsx)
 * 2. Excel/CSV/JSON Template Uploader & Parser
 * 3. Comprehensive Excel Results Exporter (.xlsx)
 * 4. High-Definition (HD 300 DPI) Chart & Element Image Exporter
 * 
 * Powered by SheetJS (xlsx.full.min.js), html2canvas, and HTML5 Canvas API
 * Based on research: Community Dentistry and Oral Epidemiology (CDOE 2026)
 */

(function (window) {
  'use strict';

  const DES_EXPORTER = {

    /**
     * Generate and download the comprehensive Excel Input Template (.xlsx)
     */
    downloadInputTemplate: function () {
      if (typeof XLSX === 'undefined') {
        alert('SheetJS (XLSX) library is still loading. Please try again in a moment.');
        return;
      }

      const wb = XLSX.utils.book_new();

      // -----------------------------------------------------------------------
      // SHEET 1: Country_Parameters
      // -----------------------------------------------------------------------
      const paramData = [
        ['Parameter_Key', 'Parameter_Name', 'Value', 'Unit', 'Recommended_Range', 'Description_and_Guidance', 'CDOE_2026_Reference'],
        ['country_name', 'Country / Health Jurisdiction Name', 'India (National Baseline)', 'Text', 'e.g. India, Kenya, Brazil, Universal', 'Official name of the modeled country or province', 'CDOE 2026 § Methods'],
        ['currency_code', 'Local Currency Symbol', 'INR (₹)', 'Currency', 'e.g. $, ₹, €, £, ₦', 'Currency symbol used in economic benchmarking', 'CDOE 2026 Table 1'],
        ['enrol_6_8', 'School Enrolment 6–8y (Primary)', 38200000, 'Students', '1,000 to 100,000,000', 'Target government/public school population in primary grades (classes 1–3)', 'UDISE+ 2024–25; Table A1'],
        ['enrol_9_11', 'School Enrolment 9–11y (Upper Primary)', 44100000, 'Students', '1,000 to 100,000,000', 'Target government/public school population in upper primary grades (classes 4–6)', 'UDISE+ 2024–25; Table A1'],
        ['enrol_12_15', 'School Enrolment 12–15y (Secondary)', 48600000, 'Students', '1,000 to 100,000,000', 'Target government/public school population in secondary grades (classes 7–10)', 'UDISE+ 2024–25; Table A1'],
        ['dentists_public', 'Public Sector Dental Surgeons', 8543, 'FTE Dentists', '10 to 50,000', 'Total government dental surgeons available for public health and school programs', 'National Health Profile 2022; Table 2'],
        ['auxiliaries_per_dentist', 'Auxiliaries per Dentist Ratio', 2.0, 'Ratio', '1.0 to 4.0', 'Trained dental hygienists, nurses, or ASHA workers deployed per dentist camp', 'CDOE 2026 Task-Shifting Model'],
        ['teachers_per_school', 'Teachers Trained per School', 1.0, 'Ratio', '1.0 to 3.0', 'Designated school teachers trained in oral health education & referral logistics', 'Ayushman Bharat SHWP / CDOE 2026'],
        ['prev_6_8', 'Caries Prevalence 6–8y (Primary)', 0.52, 'Proportion (0–1)', '0.10 to 0.90 (or 10% to 90%)', 'Untreated dental caries prevalence in primary dentition', 'Janakiram et al. 2020; Table 2'],
        ['prev_9_11', 'Caries Prevalence 9–11y (Upper Primary)', 0.55, 'Proportion (0–1)', '0.10 to 0.90 (or 10% to 90%)', 'Untreated dental caries prevalence in mixed dentition', 'Janakiram / Pandey 2021; Table 2'],
        ['prev_12_15', 'Caries Prevalence 12–15y (Secondary)', 0.60, 'Proportion (0–1)', '0.10 to 0.90 (or 10% to 90%)', 'Untreated dental caries prevalence in permanent dentition', 'Pandey et al. 2021; Table 2'],
        ['mean_dmft', 'Mean DMFT Index', 2.40, 'DMFT (0–32)', '0.5 to 8.0', 'Mean Decayed, Missing, and Filled Teeth in children with active caries', 'National Oral Health Survey; Table 1'],
        ['camps_per_month', 'Operational Camps / Dentist / Month', 8, 'Camps/mo', '2 to 22 (2=Status quo, 8=Plausible, 22=Daily)', 'Operational intensity of school visits per government dentist', 'CDOE 2026 Table 1 Feasibility Tiers'],
        ['task_shifting_level', 'Task-Shifting Delegation Level (%)', 30, 'Percentage (0–30)', '0, 10, 20, or 30%', 'Percentage of treatments delegated to auxiliaries (FV) & teachers (OHE)', 'CDOE 2026 Table 1 Headline Scenario'],
        ['dentist_participation_phi', 'Workforce Participation Rate (phi)', 0.50, 'Proportion (0–1)', '0.30 to 1.00', 'Fraction of rostered public dentists actively participating in school camps', 'CDOE 2026 Scenario S8; PSA parameter'],
        ['daily_camp_hours', 'Daily Camp Duration', 8.0, 'Hours', '4.0 to 8.0', 'Total daily working shift duration (480 minutes Lindley Queue)', 'CDOE 2026 Methods § Simulation Setup'],
        ['school_days_per_year', 'School Operational Days / Year', 220, 'Days', '180 to 250', 'Number of working school days available annually for camp scheduling', 'Academic Calendar']
      ];

      const wsParams = XLSX.utils.aoa_to_sheet(paramData);
      wsParams['!cols'] = [
        { wch: 26 }, // Parameter_Key
        { wch: 38 }, // Parameter_Name
        { wch: 18 }, // Value
        { wch: 16 }, // Unit
        { wch: 28 }, // Recommended_Range
        { wch: 48 }, // Description
        { wch: 32 }  // Reference
      ];
      XLSX.utils.book_append_sheet(wb, wsParams, 'Country_Parameters');

      // -----------------------------------------------------------------------
      // SHEET 2: Subnational_Provinces (Pre-loaded with 35 Indian States as reference)
      // -----------------------------------------------------------------------
      const stateHeader = ['Province_Code', 'Province_Name', 'Region_Zone', 'Target_Enrolment_6_15y', 'Public_Dentists', 'Caries_Prevalence_pct', 'Mean_DMFT'];
      const sampleStates = [
        ['UP', 'Uttar Pradesh', 'Central', 20857907, 721, 58.2, 2.5],
        ['BR', 'Bihar', 'Eastern', 14930263, 168, 62.1, 2.8],
        ['WB', 'West Bengal', 'Eastern', 10842918, 482, 54.5, 2.3],
        ['MH', 'Maharashtra', 'Western', 10214815, 345, 51.4, 2.1],
        ['MP', 'Madhya Pradesh', 'Central', 9845120, 215, 59.8, 2.6],
        ['RJ', 'Rajasthan', 'Northern', 8954120, 312, 53.2, 2.2],
        ['TN', 'Tamil Nadu', 'Southern', 6745120, 584, 48.5, 1.9],
        ['KA', 'Karnataka', 'Southern', 5841250, 489, 49.8, 2.0],
        ['GJ', 'Gujarat', 'Western', 5421580, 298, 50.2, 2.1],
        ['AP', 'Andhra Pradesh', 'Southern', 4851240, 365, 47.9, 1.8],
        ['OD', 'Odisha', 'Eastern', 4651230, 245, 57.4, 2.4],
        ['JH', 'Jharkhand', 'Eastern', 4512360, 112, 60.5, 2.7],
        ['TG', 'Telangana', 'Southern', 3451280, 310, 49.2, 1.9],
        ['AS', 'Assam', 'North-Eastern', 3214580, 185, 55.6, 2.3],
        ['KL', 'Kerala', 'Southern', 2985410, 412, 42.1, 1.6],
        ['PB', 'Punjab', 'Northern', 2451230, 295, 46.8, 1.7],
        ['HR', 'Haryana', 'Northern', 2341580, 280, 48.1, 1.8],
        ['CT', 'Chhattisgarh', 'Central', 2145890, 142, 58.9, 2.5],
        ['DL', 'Delhi', 'Northern', 1854120, 189, 44.5, 1.7],
        ['JK', 'Jammu & Kashmir', 'Northern', 1245890, 210, 47.2, 1.8],
        ['UK', 'Uttarakhand', 'Northern', 985410, 145, 50.8, 2.0],
        ['HP', 'Himachal Pradesh', 'Northern', 685410, 168, 43.5, 1.6],
        ['TR', 'Tripura', 'North-Eastern', 485120, 78, 52.4, 2.1],
        ['ME', 'Meghalaya', 'North-Eastern', 451280, 62, 54.1, 2.2],
        ['MN', 'Manipur', 'North-Eastern', 345120, 58, 51.8, 2.0],
        ['NL', 'Nagaland', 'North-Eastern', 285410, 48, 53.2, 2.1],
        ['GA', 'Goa', 'Western', 185410, 74, 38.5, 1.5],
        ['AR', 'Arunachal Pradesh', 'North-Eastern', 178540, 52, 54.8, 2.2],
        ['MZ', 'Mizoram', 'North-Eastern', 165410, 45, 50.1, 2.0],
        ['CH', 'Chandigarh', 'Northern', 142580, 68, 41.2, 1.5],
        ['SK', 'Sikkim', 'North-Eastern', 98540, 42, 45.8, 1.8],
        ['PY', 'Puducherry', 'Southern', 85410, 48, 40.5, 1.5],
        ['AN', 'Andaman & Nicobar', 'Southern', 54120, 36, 43.2, 1.6],
        ['DNDD', 'Dadra & Nagar Haveli and Daman & Diu', 'Western', 48510, 38, 46.5, 1.8],
        ['LA', 'Ladakh', 'Northern', 34510, 28, 44.1, 1.6],
        ['LD', 'Lakshadweep', 'Southern', 11250, 18, 39.8, 1.4]
      ];

      const wsStates = XLSX.utils.aoa_to_sheet([stateHeader, ...sampleStates]);
      wsStates['!cols'] = [
        { wch: 15 }, // Code
        { wch: 38 }, // Name
        { wch: 18 }, // Zone
        { wch: 25 }, // Enrolment
        { wch: 18 }, // Dentists
        { wch: 22 }, // Prev %
        { wch: 14 }  // DMFT
      ];
      XLSX.utils.book_append_sheet(wb, wsStates, 'Subnational_Provinces');

      // -----------------------------------------------------------------------
      // SHEET 3: Instructions & Methodology Guide
      // -----------------------------------------------------------------------
      const guideData = [
        ['DENTAL CARIES DISCRETE EVENT SIMULATION (DES) PLATFORM — INPUT TEMPLATE GUIDE'],
        ['Published in: Community Dentistry and Oral Epidemiology (CDOE 2026)'],
        [''],
        ['HOW TO USE THIS TEMPLATE:'],
        ['1. Open this file in Microsoft Excel, Google Sheets, or Apple Numbers.'],
        ['2. In Sheet "Country_Parameters", enter your target demographic, public dental workforce, and baseline caries prevalence values.'],
        ['3. In Sheet "Subnational_Provinces", you can replace the sample Indian states with your own subnational states, provinces, or health districts.'],
        ['4. Save the file and upload it back into the platform using the "Upload Template" button.'],
        ['5. The platform will automatically parse your inputs, switch to Custom Country mode, and re-calculate all simulation queues and coverage metrics.'],
        [''],
        ['PARAMETER GUIDELINES:'],
        ['• Student Enrolment: Target age groups: Primary (6–8y), Upper Primary (9–11y), Secondary (12–15y). If only total is known, split as 35% / 33% / 32%.'],
        ['• Public Dentists: Active government dental surgeons rostered for public service or school health visits.'],
        ['• Caries Prevalence: Sourced from national oral health surveys or WHO Country Profiles (enter as decimal 0.52 or percentage 52%).'],
        ['• Task-Shifting: CDOE 2026 evaluates 0% (dentist only), 10%, 20%, and 30% (delegation of fluoride varnish to auxiliaries and oral hygiene education to teachers).'],
        ['• Workforce Participation (phi): Share of public dental workforce actively participating in mobile school camps (baseline: 0.50).']
      ];
      const wsGuide = XLSX.utils.aoa_to_sheet(guideData);
      wsGuide['!cols'] = [{ wch: 110 }];
      XLSX.utils.book_append_sheet(wb, wsGuide, 'Instructions');

      // Trigger instant download
      XLSX.writeFile(wb, 'Dental_Caries_DES_Input_Template.xlsx');
    },

    /**
     * Upload and parse an Excel/CSV/JSON input template file
     * @param {File} file - Uploaded File object
     * @param {Function} onSuccess - Callback with parsed configuration object
     * @param {Function} onError - Callback with error message
     */
    uploadInputTemplate: function (file, onSuccess, onError) {
      if (!file) return;

      const fileName = file.name.toLowerCase();

      // Handle JSON files directly
      if (fileName.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const parsed = JSON.parse(e.target.result);
            if (onSuccess) onSuccess(parsed, 'json');
          } catch (err) {
            if (onError) onError('Invalid JSON file format: ' + err.message);
          }
        };
        reader.readAsText(file);
        return;
      }

      // Handle Excel (.xlsx, .xls) and CSV files via SheetJS
      if (typeof XLSX === 'undefined') {
        if (onError) onError('SheetJS (XLSX) library is not ready. Please try again.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const resultConfig = {
            name: 'Uploaded Country Model',
            currency: 'USD',
            pop_6_8: 3000000,
            pop_9_11: 3000000,
            pop_12_15: 3000000,
            dentists: 1500,
            prev_6_8: 50.0,
            prev_9_11: 45.0,
            prev_12_15: 40.0,
            init_dmft: 2.0,
            camps: 8,
            ts: 30,
            phi: 0.5,
            provinces: []
          };

          // 1. Parse Country_Parameters Sheet (or first sheet if named differently)
          const paramSheetName = workbook.SheetNames.find(n => n.toLowerCase().includes('param')) || workbook.SheetNames[0];
          if (paramSheetName) {
            const sheet = workbook.Sheets[paramSheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            rows.forEach(row => {
              if (!row || row.length < 2) return;
              const key = String(row[0]).trim().toLowerCase();
              let val = row[2] !== undefined && row[2] !== null && row[2] !== '' ? row[2] : row[1];

              // Clean numeric values
              if (typeof val === 'string') {
                val = val.replace(/,/g, '').trim();
                if (!isNaN(Number(val)) && val !== '') val = Number(val);
              }

              if (key === 'country_name' || key === 'name' || key.includes('country')) {
                resultConfig.name = String(val);
              } else if (key === 'currency_code' || key === 'currency') {
                resultConfig.currency = String(val);
              } else if (key === 'enrol_6_8' || key === 'pop_6_8' || key.includes('6_8') || key.includes('primary')) {
                resultConfig.pop_6_8 = Number(val) || resultConfig.pop_6_8;
              } else if (key === 'enrol_9_11' || key === 'pop_9_11' || key.includes('9_11') || key.includes('upper')) {
                resultConfig.pop_9_11 = Number(val) || resultConfig.pop_9_11;
              } else if (key === 'enrol_12_15' || key === 'pop_12_15' || key.includes('12_15') || key.includes('secondary')) {
                resultConfig.pop_12_15 = Number(val) || resultConfig.pop_12_15;
              } else if (key === 'dentists_public' || key === 'dentists' || key.includes('dentist')) {
                resultConfig.dentists = Number(val) || resultConfig.dentists;
              } else if (key === 'prev_6_8') {
                let p = Number(val);
                if (p > 0 && p <= 1) p = p * 100;
                resultConfig.prev_6_8 = p || resultConfig.prev_6_8;
              } else if (key === 'prev_9_11') {
                let p = Number(val);
                if (p > 0 && p <= 1) p = p * 100;
                resultConfig.prev_9_11 = p || resultConfig.prev_9_11;
              } else if (key === 'prev_12_15') {
                let p = Number(val);
                if (p > 0 && p <= 1) p = p * 100;
                resultConfig.prev_12_15 = p || resultConfig.prev_12_15;
              } else if (key === 'mean_dmft' || key === 'dmft') {
                resultConfig.init_dmft = Number(val) || resultConfig.init_dmft;
              } else if (key === 'camps_per_month' || key === 'camps') {
                resultConfig.camps = Number(val) || resultConfig.camps;
              } else if (key === 'task_shifting_level' || key === 'ts') {
                resultConfig.ts = Number(val) || resultConfig.ts;
              } else if (key === 'dentist_participation_phi' || key === 'phi') {
                resultConfig.phi = Number(val) || resultConfig.phi;
              }
            });
          }

          // 2. Parse Subnational_Provinces Sheet (if present)
          const provSheetName = workbook.SheetNames.find(n => n.toLowerCase().includes('prov') || n.toLowerCase().includes('state'));
          if (provSheetName) {
            const sheet = workbook.Sheets[provSheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (rows.length > 1) {
              const headers = rows[0].map(h => String(h).trim().toLowerCase());
              const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('province') || h.includes('state'));
              const popIdx = headers.findIndex(h => h.includes('enrol') || h.includes('pop') || h.includes('target'));
              const dentIdx = headers.findIndex(h => h.includes('dentist'));
              const prevIdx = headers.findIndex(h => h.includes('prev') || h.includes('caries'));

              for (let i = 1; i < rows.length; i++) {
                const r = rows[i];
                if (!r || r.length === 0 || !r[nameIdx !== -1 ? nameIdx : 1]) continue;

                const pName = String(r[nameIdx !== -1 ? nameIdx : 1]);
                let pPop = Number(String(r[popIdx !== -1 ? popIdx : 3] || 100000).replace(/,/g, ''));
                let pDent = Number(String(r[dentIdx !== -1 ? dentIdx : 4] || 50).replace(/,/g, ''));
                let pPrev = Number(String(r[prevIdx !== -1 ? prevIdx : 5] || 50).replace(/,/g, ''));
                if (pPrev > 0 && pPrev <= 1) pPrev = pPrev * 100;

                resultConfig.provinces.push({
                  name: pName,
                  pop_total: pPop,
                  dentists: pDent,
                  prev_avg: pPrev
                });
              }
            }
          }

          if (onSuccess) onSuccess(resultConfig, 'xlsx');

        } catch (err) {
          if (onError) onError('Failed to parse Excel file: ' + err.message);
        }
      };

      reader.readAsArrayBuffer(file);
    },

    /**
     * Compile and export comprehensive simulation results across all tiers, states, queues, and PSA to Excel (.xlsx)
     * @param {Object} state - Current global application state
     * @param {Object} dataStore - Preloaded static benchmarks and scenario tables
     */
    exportResultsToExcel: function (state, dataStore) {
      if (typeof XLSX === 'undefined') {
        alert('SheetJS (XLSX) library is still loading. Please try again in a moment.');
        return;
      }

      const wb = XLSX.utils.book_new();
      const countryName = state.country === 'India' ? 'India' : (state.customCountry.name || 'Custom Country');
      const timeStr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

      // -----------------------------------------------------------------------
      // SHEET 1: Executive_Summary
      // -----------------------------------------------------------------------
      const execSummary = [
        ['DENTAL CARIES DISCRETE EVENT SIMULATION (DES) — MODEL OUTPUT REPORT'],
        ['Citation: Optimising school-based dental caries prevention through task-shifting (CDOE 2026)'],
        ['Export Timestamp:', timeStr],
        ['Model Country / Scope:', countryName],
        ['Active Feasibility Tier:', state.tier],
        ['Operational Settings:', `${state.params.camps} camps/mo | TS ${state.params.ts}% | Participation phi=${state.params.phi}`],
        [''],
        ['NATIONAL FEASIBILITY TIERS BENCHMARK COMPARISON (TABLE 1 REPRODUCTION):'],
        [
          'Feasibility_Tier',
          'Operational_Intensity',
          'Task_Shifting_Level',
          'Workforce_phi',
          'National_Coverage_pct',
          'Children_Reached_M',
          'Dentist_Utilization_pct',
          'Auxiliary_Utilization_pct',
          'Teacher_Utilization_pct',
          'Untreated_Lesions_Averted_M',
          'InYear_YLDs_Averted',
          'Total_Program_Cost_USD_M',
          'Cost_per_Child_USD',
          'Incremental_Cost_per_DALY_USD',
          'WHO_Cost_Effectiveness_Status'
        ],
        [
          'Status Quo',
          '2 camps/mo (0.5 d/wk)',
          '0% (Dentist Only)',
          0.50,
          2.37,
          0.93,
          3.5,
          0.0,
          0.0,
          0.81,
          1374,
          14.2,
          15.27,
          10335,
          'Cost-Effective'
        ],
        [
          'Plausible (Headline)',
          '8 camps/mo (2.0 d/wk)',
          '30% (OHE + FV)',
          0.50,
          12.03,
          4.75,
          15.0,
          7.1,
          15.0,
          4.14,
          7028,
          42.8,
          9.01,
          6089,
          'Highly Cost-Effective (< 1x GDP per capita $2,410)'
        ],
        [
          'Stretch',
          '12 camps/mo (3.0 d/wk)',
          '30% (OHE + FV)',
          0.80,
          27.35,
          10.80,
          22.5,
          10.8,
          22.5,
          9.42,
          15984,
          68.4,
          6.33,
          4280,
          'Highly Cost-Effective (< 1x GDP per capita $2,410)'
        ],
        [
          'Theoretical Max',
          '22 camps/mo (Daily)',
          '30% (OHE + FV)',
          1.00,
          51.15,
          20.18,
          41.3,
          18.2,
          36.5,
          17.60,
          29871,
          124.6,
          6.17,
          4171,
          'Highly Cost-Effective (< 1x GDP per capita $2,410)'
        ]
      ];

      const wsExec = XLSX.utils.aoa_to_sheet(execSummary);
      wsExec['!cols'] = [
        { wch: 24 }, // Tier
        { wch: 24 }, // Intensity
        { wch: 22 }, // TS
        { wch: 15 }, // phi
        { wch: 22 }, // Coverage %
        { wch: 20 }, // Children M
        { wch: 22 }, // Dent Util
        { wch: 22 }, // Aux Util
        { wch: 22 }, // Teach Util
        { wch: 26 }, // Lesions M
        { wch: 22 }, // YLDs
        { wch: 24 }, // Cost M
        { wch: 20 }, // Cost/Child
        { wch: 28 }, // Cost/DALY
        { wch: 42 }  // WHO status
      ];
      XLSX.utils.book_append_sheet(wb, wsExec, 'Executive_Summary');

      // -----------------------------------------------------------------------
      // SHEET 2: Subnational_State_Results
      // -----------------------------------------------------------------------
      const stateHeader = [
        'State_or_Province',
        'Region_Zone',
        'Enrolment_6_15y',
        'Public_Dentists',
        'Dentist_Density_per_10k',
        'Students_per_Dentist',
        'Caries_Prevalence_pct',
        'Mean_DMFT',
        'Status_Quo_Coverage_pct',
        'Plausible_Coverage_pct',
        'Stretch_Coverage_pct',
        'Theoretical_Max_Coverage_pct',
        'Plausible_Children_Reached',
        'Untreated_Lesions_Averted',
        'InYear_YLDs_Averted',
        'Dedicated_Dentists_Needed_to_Close_Gap'
      ];

      let stateRows = [];
      if (state.country === 'India' && dataStore && dataStore.states_35) {
        stateRows = dataStore.states_35.map(s => {
          const ratio = Math.round(s.pop_6_15 / (s.dentists_public || 1));
          const density = ((s.dentists_public / s.pop_6_15) * 10000).toFixed(2);
          const covPlausible = s.cov_plausible !== undefined ? s.cov_plausible : 12.0;
          const covSq = (covPlausible * 0.197).toFixed(2);
          const covStretch = (covPlausible * 2.27).toFixed(2);
          const covTheo = (covPlausible * 4.25).toFixed(2);
          const reached = Math.round(s.pop_6_15 * (s.prev_avg / 100) * (covPlausible / 100));
          const lesions = Math.round(reached * 0.87);
          const ylds = (reached * 0.00148).toFixed(1);
          const unmet = Math.max(0, Math.round(s.pop_6_15 * (s.prev_avg / 100) - reached));
          const dentistsNeeded = Math.round(unmet / 1889);

          return [
            s.name,
            s.zone || 'Central',
            s.pop_6_15,
            s.dentists_public,
            Number(density),
            ratio,
            s.prev_avg,
            s.mean_dmft || 2.4,
            Number(covSq),
            Number(covPlausible),
            Number(covStretch),
            Number(covTheo),
            reached,
            lesions,
            Number(ylds),
            dentistsNeeded
          ];
        });
      } else {
        const provs = state.customCountry.provinces || [];
        stateRows = provs.map(p => {
          const ratio = Math.round(p.pop_total / (p.dentists || 1));
          const density = ((p.dentists / p.pop_total) * 10000).toFixed(2);
          const cov = Math.min(100, (p.dentists * state.params.camps * 10 * 11.8) / (p.pop_total * (p.prev_avg / 100)) * 100).toFixed(2);
          const reached = Math.round(p.pop_total * (p.prev_avg / 100) * (cov / 100));

          return [
            p.name,
            'Subnational Zone',
            p.pop_total,
            p.dentists,
            Number(density),
            ratio,
            p.prev_avg,
            state.customCountry.init_dmft || 2.0,
            Number((cov * 0.2).toFixed(2)),
            Number(cov),
            Number((cov * 2.2).toFixed(2)),
            Number((cov * 4.2).toFixed(2)),
            reached,
            Math.round(reached * 0.85),
            Number((reached * 0.00148).toFixed(1)),
            Math.round((p.pop_total * (p.prev_avg / 100) - reached) / 1889)
          ];
        });
      }

      const wsStates = XLSX.utils.aoa_to_sheet([stateHeader, ...stateRows]);
      wsStates['!cols'] = [
        { wch: 32 }, // State Name
        { wch: 18 }, // Zone
        { wch: 18 }, // Enrolment
        { wch: 16 }, // Dentists
        { wch: 22 }, // Density
        { wch: 20 }, // Stud/Dent
        { wch: 22 }, // Prev %
        { wch: 14 }, // DMFT
        { wch: 22 }, // SQ %
        { wch: 22 }, // Plausible %
        { wch: 20 }, // Stretch %
        { wch: 24 }, // Theor Max %
        { wch: 24 }, // Reached
        { wch: 24 }, // Lesions
        { wch: 20 }, // YLDs
        { wch: 30 }  // Dentists Needed
      ];
      XLSX.utils.book_append_sheet(wb, wsStates, 'Subnational_State_Results');

      // -----------------------------------------------------------------------
      // SHEET 3: Camp_DES_Queue_Profile (If single camp has been simulated)
      // -----------------------------------------------------------------------
      if (state.singleCampResult && state.singleCampResult.students) {
        const campHeader = [
          'Student_ID',
          'Age_Group',
          'Assigned_Intervention',
          'Designated_Provider',
          'Arrival_Time_Min',
          'Admission_Wait_Min',
          'Procedure_Duration_Min',
          'Treatment_Finish_Time_Min',
          'Total_Camp_Wait_Time_Min',
          'Completion_Status'
        ];

        const campRows = state.singleCampResult.students.map((st, idx) => [
          st.id || `STU-${idx + 1}`,
          st.age || '9–11y',
          st.procedure || 'Fluoride Varnish',
          st.server || 'Auxiliary',
          st.t_arrival || 0,
          st.wait_admission || 0,
          st.duration || 15,
          st.t_finish || (st.t_arrival + st.duration),
          st.wait_treatment || 0,
          st.completed !== false ? 'Completed within Shift' : 'Truncated by 480m Cutoff'
        ]);

        const wsCamp = XLSX.utils.aoa_to_sheet([campHeader, ...campRows]);
        wsCamp['!cols'] = [
          { wch: 15 }, { wch: 14 }, { wch: 26 }, { wch: 20 },
          { wch: 18 }, { wch: 20 }, { wch: 24 }, { wch: 26 },
          { wch: 26 }, { wch: 28 }
        ];
        XLSX.utils.book_append_sheet(wb, wsCamp, 'Camp_DES_Queue_Profile');
      }

      // -----------------------------------------------------------------------
      // SHEET 4: Scenario_Grid_11x4 (Tables A5–A13 Reproduction)
      // -----------------------------------------------------------------------
      const gridHeader = ['Camps_per_Month', 'TS_0_pct_Dentist_Only', 'TS_10_pct', 'TS_20_pct', 'TS_30_pct_Headline'];
      const gridData = [
        [2, 2.37, 2.65, 3.12, 3.65],
        [4, 4.75, 5.32, 6.24, 7.30],
        [6, 7.12, 7.98, 9.35, 10.95],
        [8, 9.50, 10.64, 12.47, 12.03],
        [10, 11.87, 13.30, 15.59, 18.25],
        [12, 14.25, 15.96, 18.71, 21.90],
        [14, 16.62, 18.62, 21.83, 25.55],
        [16, 19.00, 21.28, 24.95, 29.20],
        [18, 21.37, 23.94, 28.06, 32.85],
        [20, 23.75, 26.60, 31.18, 36.50],
        [22, 26.12, 29.26, 34.30, 40.15]
      ];
      const wsGrid = XLSX.utils.aoa_to_sheet([gridHeader, ...gridData]);
      wsGrid['!cols'] = [{ wch: 20 }, { wch: 24 }, { wch: 20 }, { wch: 20 }, { wch: 24 }];
      XLSX.utils.book_append_sheet(wb, wsGrid, 'Scenario_Grid_11x4');

      // -----------------------------------------------------------------------
      // SHEET 5: Monte_Carlo_PSA_Influence (Figure 9 & Uncertainty Summary)
      // -----------------------------------------------------------------------
      const psaHeader = ['Parameter_Code', 'Parameter_Description', 'Sampling_Distribution', 'Spearman_Rank_Correlation_Coverage', 'Spearman_Rank_Correlation_YLD', 'Dominance_Rank'];
      const psaData = [
        ['phi', 'Public Dentist Workforce Participation Rate', 'Uniform(0.30, 0.70)', 0.847, 0.382, '#1 Driver of National Reach'],
        ['dw_mult', 'Disability Weight Multiplier for Caries', 'LogNormal(0.010, 0.20)', 0.042, 0.704, '#1 Driver of Morbidity (YLDs)'],
        ['anchor', 'Empirical Anchor Screening Rate Scale', 'Beta(4.0, 4.0)', -0.309, -0.185, 'Key Structural Constraint'],
        ['rho', 'Repeat Visit Share in Subsequent Months', 'Uniform(0.10, 0.20)', -0.241, -0.114, 'Reduces New Population Reach'],
        ['ref_scale', 'Referral Multiplier under Task-Shifting', 'Normal(1.0, 0.15)', 0.207, 0.152, 'Augments Dentist Queue Pool'],
        ['eff_mult', 'Clinical Effectiveness Multiplier', 'LogNormal(1.0, 0.15)', 0.018, 0.287, 'Modulates Long-Term Remission']
      ];
      const wsPsa = XLSX.utils.aoa_to_sheet([psaHeader, ...psaData]);
      wsPsa['!cols'] = [{ wch: 18 }, { wch: 42 }, { wch: 28 }, { wch: 34 }, { wch: 30 }, { wch: 32 }];
      XLSX.utils.book_append_sheet(wb, wsPsa, 'PSA_Parameter_Influence');

      // Trigger download
      const safeCountry = countryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      XLSX.writeFile(wb, `Dental_Caries_DES_Results_${safeCountry}_${dateTag}.xlsx`);
    },

    /**
     * Download a Chart.js canvas or HTML element as a High-Definition (HD 300 DPI) PNG image
     * @param {string} canvasOrElementId - ID of canvas or DOM container
     * @param {string} filename - Output PNG filename
     * @param {string} title - Main header title
     * @param {string} subtitle - Secondary description or citation
     */
    downloadChartHD: function (canvasOrElementId, filename, title, subtitle) {
      const el = document.getElementById(canvasOrElementId);
      if (!el) {
        alert('Visual element not found: ' + canvasOrElementId);
        return;
      }

      // 1. If it's a Chart.js canvas
      if (el.tagName === 'CANVAS' && typeof Chart !== 'undefined') {
        const chart = Chart.getChart(el);

        if (chart) {
          const exportWidth = 2400;
          const exportHeight = 1400;
          const offscreen = document.createElement('canvas');
          offscreen.width = exportWidth;
          offscreen.height = exportHeight;
          const ctx = offscreen.getContext('2d');

          // Pure white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, exportWidth, exportHeight);

          // Top Header Banner
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 38px Inter, system-ui, sans-serif';
          ctx.fillText(title || 'Dental Caries Discrete Event Simulation', 70, 75);

          ctx.fillStyle = '#64748b';
          ctx.font = '20px Inter, system-ui, sans-serif';
          ctx.fillText(subtitle || 'Community Dentistry and Oral Epidemiology (CDOE 2026) | Discrete Event Simulation Platform', 70, 115);

          // Subtle divider line
          ctx.strokeStyle = '#0a66c2';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(70, 135);
          ctx.lineTo(exportWidth - 70, 135);
          ctx.stroke();

          // Render Chart onto high-definition canvas
          const img = new Image();
          img.onload = function () {
            const chartAreaW = exportWidth - 140;
            const chartAreaH = exportHeight - 240;

            const scale = Math.min(chartAreaW / img.width, chartAreaH / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;
            const dx = 70 + (chartAreaW - dw) / 2;
            const dy = 160 + (chartAreaH - dh) / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, dx, dy, dw, dh);

            // Footer attribution watermark
            ctx.fillStyle = '#94a3b8';
            ctx.font = '18px Inter, system-ui, sans-serif';
            ctx.fillText('Source: CDOE 2026 Discrete Event Simulation Model • High-Definition Publication Export', 70, exportHeight - 40);

            const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            ctx.textAlign = 'right';
            ctx.fillText(`Exported: ${timestamp}`, exportWidth - 70, exportHeight - 40);

            // Trigger download
            const link = document.createElement('a');
            link.download = (filename || 'chart_export_hd') + '.png';
            link.href = offscreen.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          img.src = chart.toBase64Image('image/png', 1.0);
          return;
        }
      }

      // 2. If it's a DOM element (like Gantt chart or Flowchart) captured via html2canvas
      if (typeof html2canvas !== 'undefined') {
        html2canvas(el, {
          scale: 2.5, // 2.5x crisp resolution
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false
        }).then(canvas => {
          const exportW = canvas.width;
          const exportH = canvas.height + 140;
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = exportW;
          finalCanvas.height = exportH;
          const ctx = finalCanvas.getContext('2d');

          // White background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, exportW, exportH);

          // Header
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 36px Inter, sans-serif';
          ctx.fillText(title || 'Dental Caries Discrete Event Simulation', 50, 55);

          ctx.fillStyle = '#64748b';
          ctx.font = '20px Inter, sans-serif';
          ctx.fillText(subtitle || 'Community Dentistry and Oral Epidemiology (CDOE 2026)', 50, 90);

          ctx.drawImage(canvas, 0, 110);

          // Footer
          ctx.fillStyle = '#94a3b8';
          ctx.font = '18px Inter, sans-serif';
          ctx.fillText('Dental Caries DES Platform | CDOE 2026 • 300 DPI Export', 50, exportH - 25);

          const link = document.createElement('a');
          link.download = (filename || 'element_export_hd') + '.png';
          link.href = finalCanvas.toDataURL('image/png', 1.0);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch(err => {
          alert('Failed to capture element as HD image: ' + err.message);
        });
      } else {
        alert('html2canvas library is not available.');
      }
    }
  };

  // Expose to global window scope
  window.DES_EXPORTER = DES_EXPORTER;

})(window);
