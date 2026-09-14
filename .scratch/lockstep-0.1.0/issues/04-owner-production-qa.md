# 04: Owner production visitor QA

**Parent:** `.scratch/lockstep-0.1.0/spec.md`

**What to build:** The owner confirms Coolify production matches the 12 Sep Playground preview as a visitor, without writing a Principal into production Identity.

**Blocked by:** 03 Release PR and tag v0.1.0

**Status:** ready-for-human

- [ ] `GET /` — heading “This is a Playground, not a Product”; English Playground home, not a Product
- [ ] `GET /docs` 200 — heading “Playground proof”; copy “This is Playground proof, not the Product.” Docs nav and surroundings present
- [ ] `GET /hr/docs` 200 — Croatian fixture copy; `GET /hr` redirects to `/hr/docs`
- [ ] `GET /login` stays English and unprefixed
- [ ] Anonymous `/protected` redirects to `/login`
- [ ] Sitemap lists home and English/Croatian docs; does not advertise `/login`, `/register`, `/protected`
- [ ] Do not register, log in, or log out on production
