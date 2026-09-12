# Earth Cone — Project & Chat Memory

## Purpose

This repository is being prepared as a website asset library for Earth Cone. The current work focused on making the supplied WhatsApp media easy to use in a website by organizing it into descriptive, URL-friendly paths.

## Work completed

All original `WhatsApp Image ...` and `WhatsApp Video ...` filenames were replaced with lowercase, hyphenated, descriptive names. Assets were moved from the root of `src/images/` into service/project categories. No image or video content was edited, compressed, or deleted.

### Asset inventory

| Folder | JPEG images | MP4 videos | Primary subject |
| --- | ---: | ---: | --- |
| `src/images/branding/` | 2 | 0 | Earth Cone business-card branding |
| `src/images/construction-exteriors/` | 11 | 5 | Villas, facades, foundations, paving, decking |
| `src/images/electrical/` | 3 | 0 | Electrical conduit and ceiling installation |
| `src/images/interiors/` | 13 | 20 | Finished interiors, flooring, TV walls, stairs, doors, vanities |
| `src/images/kitchens/` | 41 | 0 | Custom kitchen projects |
| `src/images/water-systems/` | 28 | 0 | Rooftop tanks, piping, manifolds, water pumps |
| **Total** | **98** | **25** | **123 media files** |

## Naming convention

Every asset uses a semantic lowercase filename plus a two-digit sequence number:

```text
<subject>-<detail>-<number>.<extension>
```

Examples:

```text
src/images/kitchens/custom-kitchen-01.jpeg
src/images/water-systems/rooftop-water-tank-01.jpeg
src/images/construction-exteriors/villa-facade-01.jpeg
src/images/interiors/herringbone-flooring-01.mp4
src/images/interiors/bathroom-vanity-installation-01.mp4
```

Use these paths directly in website components. The number distinguishes related shots; it does not imply a rank or preferred display order.

## Content grouping notes

- `branding`: brand collateral only; appropriate for About, Contact, and brand-story sections.
- `construction-exteriors`: exterior construction progress and completed villa façades; appropriate for portfolio or construction-services sections.
- `electrical`: installation-process images; appropriate for electrical-services sections.
- `interiors`: interior finish work and video showcases. The videos cover herringbone flooring, TV walls, doors, bathroom vanities, staircase details, and flooring finishes.
- `kitchens`: completed custom kitchens; suitable for a kitchen gallery or service page.
- `water-systems`: rooftop water tanks, plumbing manifolds, piping, and pumps; suitable for plumbing or water-system services.

## Maintenance rules

1. Add future media to the closest existing category folder.
2. Keep names lowercase, hyphenated, and descriptive; avoid spaces, timestamps, and vendor-app names.
3. Continue a related asset sequence rather than renumbering existing files.
4. Preserve the current extensions unless intentional media optimization is performed separately.
5. If website code starts referencing an asset path, treat that path as stable and avoid renaming it without updating the reference.

## Verification performed

- Confirmed that all 98 JPEGs were moved out of the `src/images/` root and successfully opened after renaming.
- Confirmed that all 25 MP4 files were moved out of the `src/images/` root and retained valid MP4 media signatures.

