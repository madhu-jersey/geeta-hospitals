# Geeta Hospitals · Tanuku

Single-page public website for Geeta Hospitals. The app is presentation-only; there is no backend integration.

## Assets

- Logo: `public/assets/logo.png` (used unchanged in the header, hero emblem and footer)
- Hero photo: `public/assets/hero-building.jpg`
- Gallery photos: `public/assets/gallery/building.jpg`, `reception.jpg`, `consultation.jpg`, `waiting.jpg`, `laboratory.jpg`
- Doctor portraits: `public/assets/doctors/bhuvanasri.jpg`, `meghana-reddy.jpg`, `aditya-reddy.jpg`, `srinivasa-reddy.jpg`
- NABH badge: `public/assets/nabh-badge.png` or `public/assets/nabh-badge.svg`

Unavailable photos remain as illustrated placeholders; no imagery is synthesized. The NABH badge is omitted until its official asset is supplied.

## Editing

- Image paths, alt text and gallery captions: `src/data/images.ts`
- Reviews/videos visibility flags: `src/data/content.ts` (`showReviews` and `showVideos`, both false)
- Service, doctor and contact page copy: `src/App.tsx`
- Palette, responsive styles and motion: `src/index.css`
- Search/social metadata: `index.html`

## Current placeholders

- Hero building, gallery, and doctor portrait image slots await supplied files.
- NABH accreditation badge and any accreditation number/validity are not supplied.
- Doctor introductions are represented with the requested “Short introduction to be provided” placeholder only where applicable; profile captions remain explicitly marked as drafts pending approval.
- Reviews and videos are hidden until their source data is supplied.
