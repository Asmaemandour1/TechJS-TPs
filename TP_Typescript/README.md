# Book Reading Tracker

Simple Book Reading tracker (Express + MongoDB + Tailwind static frontend) implementing the TP requirements.

Run locally:

1. Install dependencies

   npm install

2. Configure MongoDB connection via environment variable MONGODB_URI (defaults to mongodb://127.0.0.1:27017/booktracker)

3. Start server

   npm run start

Open http://localhost:3000 in your browser.

Notes:

- The Book model includes title, author, numberOfPages, pagesRead, status, price, format, suggestedBy and finished.
- finished is set automatically when pagesRead >= numberOfPages.
- The frontend is in `public/` and uses Tailwind CDN.
