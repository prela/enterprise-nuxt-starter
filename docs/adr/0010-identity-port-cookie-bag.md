# Identity port is cookie-bag-bound; Session is not a token

ADR-0002 puts Identity behind a port; ADR-0006 makes the first adapter’s Session an httpOnly cookie. The port therefore takes a cookie bag (request cookies in, Set-Cookie out), not a session token on register/authenticate/endSession/currentPrincipal/mayAccessRoute. Both adapters substitute on that contract, including starting a Session on register. Vendor cookie names stay inside the Better Auth adapter. Host HTTP and the in-memory fake are the two test seams; there is no third Identity-request interface.

A token on the port next to a cookie is two Sessions; making `extends` plus HTTP the Public Layer interface would reopen ADR-0002; a deep H3-shaped request module would be a third seam.
