# Lawyer cabinet — promo demo (English)

A clickable copy of the consultant's personal cabinet from the live stand
`testing123.consultant.net.ua` (a snapshot of a logged-in session), translated into English.
The design, layout and client-side logic are untouched — these are the site's own pages with
local styles, fonts, scripts and images, not a redrawing.

## How to open

```bash
cd cabinet-promo-en
python3 -m http.server 8811
# → http://localhost:8811
```

The start page `index.html` lists every section. The cabinet itself begins with
`applications-relevant.html` («Buy a lead»).

> The demo has been tested on a local web server, and that is how it should be shown.
> Opening a file directly by double-click (`file://`) is restricted differently by each
> browser, and some scripts may fail to load.

## Pages (25)

| Section | Files |
|---|---|
| **Leads** | `applications-relevant` (Buy a lead) · `leads` (Direct) · `applications-my` (My leads) |
| **Services** | `services-in-progress` · `services-selection` · `services-offer` · `services-archive` · `services-unconfirmed` |
| **Documents** | `documents` · `documents-add` · `documents-rejected` |
| **Consultations** | `consultant-articles` · `-propose-article` · `-propose-case` · `-propose-video` · `-rejected` |
| **Money** | `balance` · `balance-pay` (Top up) · `balance-withdraw` (Withdraw) · `subscription-packages` (Subscription) |
| **Rating and advertising** | `rating` · `rating-ad-calculator` (Advertise profile) |
| **Other** | `contacts` · `contacts-info` · `referrals` |

Utility pages: `index.html` (demo map), `demo-stub.html` (stub for addresses outside the snapshot).

## Leads on the page

The cards come from a fresh snapshot of the live `/cabinet/applications/relevant` page
(August 2026): 10 real client enquiries (enlistment centre, medical board, deferral,
reserved-occupation status, sole trader registration) and 6 cards of the new **«Lead»**
type — with a Lead Score, source/category/region chips and a «Buy for N ₴» button right
in the card. The avatars of consultants who already answered are stored locally.
Along with the cards, `assets/cabinet/css/glassupply.css` was updated to the live version —
the older copy had no styles for the new cards.

## Buying a lead — the full flow

The cabinet's main scenario is reproduced in full (`demo/leads.js`, `demo/leads.css`).
The «Buy for N ₴» button on a lead card (and «Respond» on an enquiry) opens the purchase window:

1. **A 90-second reservation** — a countdown and a draining bar, explaining that while the
   reservation holds no other specialist can buy this lead.
2. **The maths** — lead price, PREMIUM subscription discount −20%, amount due,
   balance after payment and the potential income from the order.
3. **Confirmation** — the money is charged, the lead travels to «My leads»
   (the card leaves the list captioned «Moving to "My leads"»), and the «Buy a lead»
   counter and the sidebar balance update across every page.
4. **In «My leads»** the lead sits as a card with the client's contacts open
   (name, phone, email) and a «Paid» chip.

**When there is not enough money the reservation is not lost.** The window shows how much is
missing and offers a «Top up balance» button while the countdown keeps running. For as long as the
reservation is alive, a bar sits at the bottom of every cabinet page — «Lead … reserved for 1:07 more»
with a «Back to the lead» button — and returning reopens the same purchase window with the time that
is left. The reservation survives the trip to the top-up page and a page reload (it lives in
`localStorage`); it is released in three ways only — the timer runs out, the lead is bought, or the
lawyer presses «Cancel» or the × on the bar.

When the countdown reaches zero the reservation is released, the pay button locks and «Reserve again»
appears. The «Not interested» button hides a lead from the list.

State (balance, purchased and hidden leads) lives in `localStorage` under the key
`promo_leads_v1`. To reset it use the «Reset demo state» button on `index.html`
or call `demoLeadsReset()` in the console.

Lead cards are listed **first**, above the client enquiries. The price of a lead is taken
**from the button text**, exactly as on the live site, and no discount is applied on top. For enquiries («Respond») the price and discount come from `CONFIG`.

**Prices and the discount are configurable** in `CONFIG` at the top of `demo/leads.js`:
by default a question lead costs 70.00 UAH and a service lead 250.00 UAH (both figures come
from the cabinet's own texts), the subscription discount is 20% and the reservation is 90 seconds.
Currency stays UAH — this is the same cabinet, only the interface language changed.

## Balance top-up

**The demo balance starts at zero.** On the «Top up balance» page the «Top up by card» card opens
a window where everything is calculated live: type an amount and you immediately see «Amount due»,
«Tax (23%)» in red and «Will be credited to your balance». The «Top up» button stays disabled until
an amount is entered; pressing it credits the amount **after tax** to the balance, closes the window,
and the new balance shows up at once both in the sidebar and in the «Balance» block on the balance page.

This closes the end-to-end demo scenario: balance 0 → buying a 1 200 ₴ lead shows «Not enough funds»
and how much is missing → top up → the lead can be bought.
The tax rate is `TAX_PCT` in `CONFIG` (`demo/leads.js`), the starting balance is `START_BALANCE`.

## What else works

The whole client side of the live cabinet: navigation through the menu and tabs, search,
filters, accordions (the advertising calculator), expanding cards, checkboxes and toggles,
forms with validation, text editors, calendars, the cookie banner.

## What is missing and why

The demo is static — there is no server. The remaining actions that go to the backend are
switched off: replying to a request (that window is filled by the server), saving forms,
payment, withdrawals, logging out of the cabinet.

On such a click the demo shows a hint instead of a request. This is handled by the
`demo/demo.js` layer: it silences `fetch` / `XHR` / `WebSocket` calls to server addresses,
intercepts POST forms, and stops empty server-side modals from opening
(otherwise the screen would simply go dark).

Page data is the real state of that account at the moment of the snapshot:
«Direct» and «My leads» are empty because it had no leads back then.

## Structure

```
*.html            25 cabinet pages + index + demo-stub
demo/             demo.js + demo.css (demo-mode layer)
                  leads.js + leads.css (lead purchase flow)
assets/cabinet/   cabinet css, js, fonts, icons (webpack chunks live here too)
site/             styles, fonts and images of the public part of the site
storage/          avatars and media from profiles
fonts/ images/    fonts and favicon
vendor-cdn/       socket.io, livekit
```

External links (footer, legal documents, social media) point to the live
`consultant.net.ua`; everything else runs locally and needs no internet.

## Translation

All 561 unique interface strings plus every `data-*` label (transaction table headers, editor
tooltips) are translated into English, and the logo is swapped for the English `logo_en.svg`.
`<html lang>` is set to `en`, so the Vue part of the cabinet loads its English i18n chunks by itself.

The only text left in Ukrainian is what is baked into external widgets — the controls of the
embedded Google map in the footer, whose language comes from Google, not from this page.
Amounts are in US dollars: the hryvnia figures from the snapshot were converted at a flat demo rate
of 40 UAH per dollar (600 → $15.00, 1 000 → $25.00), and the lead prices were set by hand to the
$30–40 range. The Ukrainian original keeps hryvnia.

The Ukrainian original of this demo lives in `../cabinet-promo`.
