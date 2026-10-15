# Geeta Hospital online presence audit

## Scope and method

This review used the live website and repository content available in the current workspace. External search results and third-party directory profiles were not independently verified beyond the public links embedded in the site and publicly accessible map data.

## Sources reviewed

1. Geeta Hospitals live website: https://geetahospitalstanuku.com/
2. Alternate hostname: https://www.geetahospitalstanuku.com/
3. Robots file: https://geetahospitalstanuku.com/robots.txt
4. Google Maps listing used by the site: https://www.google.com/maps/place/Geeta+Hospitals/@16.7572875,81.6771406,840m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3a37b70016182313:0x7fc7fde69b1ce9fd!8m2!3d16.7572875!4d81.6771406!16s%2Fg%2F11z5pn7nlj
5. Project source: `artifacts/geeta-hospitals/src/App.tsx`

## Verified facts

- Hospital name: Geeta Hospitals
- Short-form brand used in the site: Geeta Hospital
- Location: Tanuku, West Godavari, Andhra Pradesh, India
- Street address published on the site: D.No. 22-7-2/1, Vinnakota Vari Street, Tanuku, West Godavari, Andhra Pradesh 534211
- Phone number published on the site: 08819-224246
- Core service emphasis in the live site: women’s care and eye care
- Identified service areas in the source content: obstetrics, gynaecology, fertility, ultrasound scanning, laparoscopic surgery, cataract care, retinal care, laser procedures, uveitis management, and neuro-ophthalmology
- Emergency availability described in the website copy: 24 hours a day, 7 days a week
- Operating hours described in the website copy: Monday to Saturday, 9:00 AM to 2:00 PM and 5:00 PM to 8:00 PM; clinic closed on Sunday

## Conflicts and unknowns

- The site does not publish an official email address or a verified social profile URL in the repository.
- The website states a Google Maps presence and phone number, but the current repository does not include a verified Google Business Profile record or proof of profile ownership.
- No independent government healthcare registry or official hospital verification source was reviewed in this repo-only audit.
- The site uses both the bare domain and the www host, and both currently return the same homepage without a canonical tag. This is not a contradiction about the hospital itself, but it creates duplicate-host ambiguity for search engines.

## Recommended owner actions

- Confirm the exact legal name and public-facing brand used on all external listings.
- Verify the address and phone number in Google Business Profile and any clinic directory listings.
- Check whether the site should redirect www to the non-www domain or vice versa at the Cloudflare layer.
- Confirm whether the hospital has an official email address, social media profile, and any accreditation claims that should be included in future metadata.
- Review any directory or map listing that differs from the site’s address or phone number.

## Conclusion

The repository and live website provide a consistent core identity for Geeta Hospitals in Tanuku, but the public digital footprint still needs owner-side verification to be fully complete for local SEO and trust-building.
