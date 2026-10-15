# Google Search Console setup for Geeta Hospital

## Goal

Create a verified, indexable domain property for https://geetahospitalstanuku.com/ and submit the canonical sitemap.

## Owner checklist

1. Open Google Search Console at https://search.google.com/search-console
2. Add a new property using the Domain method
3. Enter the root domain: geetahospitalstanuku.com
4. Verify ownership using the DNS TXT-record method recommended by Google
5. Keep the existing DNS records untouched and add only the verification TXT record required by Search Console
6. Wait for the domain property to verify successfully
7. Submit the sitemap URL: https://geetahospitalstanuku.com/sitemap.xml
8. Review the URL inspection tool for the homepage and any key public pages
9. Check indexing status after the domain and sitemap are verified
10. Monitor impressions, clicks, and index coverage over time

## Important notes

- This repository does not have access to the owner’s Google account or Cloudflare DNS controls.
- The canonical site should remain https://geetahospitalstanuku.com/
- The alternate host https://www.geetahospitalstanuku.com/ should be redirected or otherwise managed to avoid duplicate-indexing risk
- Validation of Search Console status is an owner-side action after deployment

## Recommended follow-up

After the site is live on Cloudflare Pages, the owner should confirm that:

- The root domain serves the site successfully
- The sitemap is accessible and returns XML
- No `noindex` directives are being emitted
- The homepage is indexed correctly and there are no obvious crawl errors
