# Better Auth is Identity’s first adapter

Identity’s port is owned by the Starter (ADR-0002). The first adapter is Better Auth, self-hosted, on Drizzle + PostgreSQL, with email/password and an httpOnly session cookie — credentials stay in our database and OAuth can be added later as further adapters. Clerk, Auth0, and Supabase Auth would make a vendor the core. nuxt-auth-utils is a thinner session helper, not a port. Hand-rolled JWT/session code is a product we refuse to own.
