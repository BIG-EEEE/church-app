# Church app plan

The navigation and layout are fixed: glass top pills (logo, give), a floating glass dock
(Home, Explore, More), a gooey More popover, and a round Search / Back to top button.
Everything below is built to fit that shell.

## What church apps are expected to have

Sources agree on the same core set: sermon archive (audio/video), events with RSVP, giving,
prayer requests, small groups, push notifications, volunteer sign-up, and a member directory
with strict privacy controls.

- Pushpay on sermons and engagement: https://pushpay.com/blog/a-mobile-app-that-moves-your-church-from-sunday-to-every-day/
- Ministry Brands feature list: https://www.ministrybrands.com/church-management-software/church-app-features
- Adalo on directory privacy (full details to leaders only, consent for photos): https://adalo.com/products/church-app-builder
- Tithe.ly app comparison: https://get.tithe.ly/blog/best-church-apps
- Common mistakes churches make: https://www.reachrightstudios.com/blog/mistakes-churches-make-mobile-apps/

## Navigation guidance that applies to our dock

Three to five bottom destinations, thumb reach, a "More" overflow for the rest.
Our dock already matches this.
- https://uxplanet.org/bottom-tab-bar-navigation-design-best-practices-48d46a3b0c36
- https://smashingmagazine.com/2016/11/the-golden-rules-of-mobile-navigation-design

## Giving in Ghana (the shape of the Give flow)

Mobile money is the main channel, via USSD, app, WhatsApp and payment links. Churches register MoMo
numbers under the church name. Paystack supports cards, bank transfer, USSD and mobile money in Ghana.
Fee figures in the sources are secondhand, so confirm them with the provider before showing any.
- https://www.graphic.com.gh/news/general-news/offertory-tithe-go-digital-as-churches-introduce-e-payments.html
- https://www2.cbn.com/news/world/digital-tithing-revolutionizes-church-giving-west-africa

## Proposed map onto the shell

| Place | Content |
| --- | --- |
| Top-left pill | Church logo, goes Home |
| Top-right pill | Give: amount, fund (tithe, offering, pledge, project), MoMo or card |
| Home | Next service and live link, latest sermon, this week's events, one announcement |
| Explore | Sermons, events, small groups, ministries |
| More | About, Prayer, Volunteer, Directory (members only), Contact |
| Search | Sermons, events, groups, Bible-linked sermon search |

## Build order

1. Church data model and admin (services, sermons, events, groups, announcements)
2. Home and Explore with real content, sermon player
3. Give flow with Paystack mobile money and card, receipts
4. Events RSVP and small groups
5. Prayer requests with private and public options and a staff follow-up queue
6. Member sign-in and directory with role-based visibility
7. Push notifications, installable PWA
8. Light and dark theme, accessibility pass, real-phone testing

## Decisions needed

- Which church: name, logo, colours, denomination and real content
- Admin: who edits content, and is a CMS needed or a simple admin screen enough
- Payments: which provider account and which funds
- Members: open sign-up or invite-only
