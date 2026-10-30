# Dental Caries Discrete Event Simulation Platform

Interactive companion to the study *Workforce capacity, task-shifting and school dental caries prevention coverage across India: A state-level discrete-event simulation*.

The app runs entirely in the browser. It has no backend. Chart.js, Font Awesome and Google Fonts load from public CDNs, so an internet connection is needed for charts and icons.

## Running the app

- Double-click `index.html` to open it in a modern browser, or
- Run `python -m http.server 8080` in this folder and open `http://localhost:8080/`.

`calculator.html` is a simplified view of the same model.

## What the app does

1. **Dashboard and feasibility tiers.** National results for the Status Quo, Plausible, Stretch and Theoretical Max tiers, with sliders for camps per month, task-shifting, dentist availability (φ), repeat visits (ρ) and OHE need reduction (R).
2. **Camp simulator.** A single 480-minute camp day with a Gantt timeline for the dentist, auxiliary and teacher, and a batch runner for many camp days.
3. **State explorer.** Enrolment, government dental surgeons, students per dentist, coverage, unmet need and dedicated workforce for 35 states and union territories.
4. **Scenario grid and PSA.** The national scenario grid and an in-browser probabilistic sensitivity analysis.
5. **Custom country modeller.** Enter any country's enrolment, workforce and caries prevalence, or start from an illustrative income-group preset. Profiles can be saved and reloaded as JSON.
6. **Methods and figures.** Model equations and the manuscript figures.

## Results at the Plausible tier (India)

| Measure | Value |
|---|---|
| Unique children reached per school year | 4.75 million |
| Coverage of government-school children with caries | 12.03% |
| Unmet need | 34.72 million children |
| Dedicated school dentists needed | 18,379 |
| Dentist utilisation (procedure minutes, all working days) | 14.5% |
| YLDs averted in the school year | 7,110 |
| YLDs averted over the duration of effect (3% discount) | 22,222 |

The app reruns the simulation in the browser with random draws, so live values vary slightly around these figures. The reference results come from the Python model in `model_code`.

## Files

```text
dental-caries-des-app/
├── index.html           Main application
├── calculator.html      Simplified calculator view
├── styles.css           Styles for the main application
├── calculator.css       Styles for the calculator
├── app.js               User interface controller and charts
├── calculator.js        Calculator controller
├── simulation.js        Simulation engine (camp day, school year, PSA)
├── data.js              Baseline data for 35 states and benchmark results
├── exporter.js          Excel template, results export and image download
├── xlsx.full.min.js     SheetJS library for Excel files
├── html2canvas.min.js   html2canvas library for image downloads
└── figures/             Manuscript figures (Figure1-4 and FigureS1-S5)
```

## Data import and export

- **Input template:** download an Excel template for a custom country, fill it in and upload it (`.xlsx`, `.xls`, `.csv` or `.json`).
- **Results export:** download a multi-sheet Excel file with tier, state, camp-level and scenario results.
- **Images:** each chart has a download button for a high-resolution PNG.

## Citation

If you use this tool, please cite the study named above.
