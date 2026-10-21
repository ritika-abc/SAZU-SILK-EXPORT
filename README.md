# SAZU SILK EXPORT website
Static site. Open `index.html` (or serve the folder: `python3 -m http.server`).

## Replace before launch
- **Images** (`assets/images/`, JPG/WebP, compress to <300 KB): hero-silk, hero-agro, hero-ship, intro, about-1, about-2, card-silk, card-agro, card-export, card-supply, p-silk, p-agro, p-supply, p-ship, vid-poster, og. Missing files fall back to colour gradients. Sources: Unsplash/Pexels or your own; check each licence and list it below.
- **Video**: `assets/videos/ocean.mp4` (muted, short loop, under 8 MB). The poster shows if it fails.
- **Company details**: address, phone, email in the Contact section and footer (`info@example.com`, `[Registered address]`); canonical URL in `<head>`.
- **Form endpoint**: set `data-endpoint` on `<form id="f">` to a Formspree/Getform/your API URL. Until then nothing is sent and visitors are told to email.
- **Stats**: no numbers are shown. Add `data-count="N"` to a `.num` element only for verified figures.
- Social links, privacy and terms pages: add only when they exist.

## Attribution
List each image/video: title, author, source URL, licence.
