## GitHub Actions

PRs into `develop` need a check named `ci`. If GitHub shows **Expected — Waiting for status to be reported** and Actions has no run for the PR head, do not ask the owner to change git author. Run:

```bash
gh workflow run CI --ref "$(git branch --show-current)"
```

Then wait for that run. Do not merge until `ci` is green on the current head SHA.

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical roles map 1:1 to `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
