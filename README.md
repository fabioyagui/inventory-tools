# Inventory Tools

Two single-file browser tools for monthly stockroom counting, ServiceNow CMDB reconciliation and IT asset disposal. No backend, no build step: data lives in the browser (localStorage) and moves between the two tools as CSV files.

| File | Runs on | Purpose |
|---|---|---|
| `scanner.html` | iPhone / iPad (must be served over HTTPS for camera access) | Count boxes by scanning device labels; disposal boxes capture the full label (serial, asset tag, part number, warranty). Exports one CSV per box. |
| `inventory-manager.html` | Desktop Chrome or Edge (works from `file://`) | Monthly counts, box registry and QR labels, reconciliation against ServiceNow exports, Disposal report, restock, headcount flow, cost center chargeback, backup. |

## Using the scanner on a phone

The scanner is published with GitHub Pages (HTTPS, required by iOS for the camera):

`https://fabioyagui.github.io/inventory-tools/`

Open it in Safari, allow the camera, then use Share > Add to Home Screen so it opens like an app. Counts are stored on the phone only; nothing is sent to GitHub.

The Manager is meant to be downloaded and opened locally in Chrome or Edge (its Data folder feature needs a desktop browser).

## Versions

- Inventory Manager **v1.14.1**
- Label Scanner **v1.2.0**

Each file carries its own changelog in the comment at the top of the source.

## Typical flow

1. Print box and location QR labels from the Manager (Boxes tab).
2. On the phone, scan the box QR, count the devices, close the box and share the CSV.
3. In the Manager, import the CSV (Import tab), or put it in the connected Data folder and use Auto-load.
4. Load the ServiceNow `alm_hardware` export and run the reconciliation (Reconcile tab).

### Disposal

- On the scanner, tick **Disposal box** when starting a box. Pick the label brand on the camera (HP / Lenovo / Apple). Each device is saved as one record with serial, asset tag, part number and warranty.
- In the Manager, the **Disposal** tab lists those devices, joins model, CMDB warranty and ServiceNow status, flags anything that needs attention, and exports Excel / CSV. A printable handover sheet is optional.

## Data folder (optional, Chrome / Edge)

```
Data/
  PhysicalCount/YYYY-MM/   scanner CSVs
  ServiceNow/YYYY-MM/      alm_hardware export
  Disposal/YYYY-MM/        disposal export from ServiceNow (scanner CSVs of disposal boxes also accepted)
  Tasks/YYYY-MM/           weekly task exports (cost center)
  Hardware/YYYY-MM/        stockroom snapshot (cost center)
  Value/values.xlsx        price list per model (cost center)
```

## Notes

- All data stays in the browser that created it. Export a JSON backup regularly (Backup tab).
- Label patterns for Lenovo and Apple are a first version; HP patterns are validated on real labels.
