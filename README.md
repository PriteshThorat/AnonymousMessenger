<div align="center">

# Anonymous Messenger

Send and receive anonymous messages with optional AI‑generated prompts, secure email verification, and granular control over message acceptance. Built with Next.js 16 App Router, TypeScript, MongoDB (Mongoose), NextAuth (credentials), Zod validation, Tailwind CSS, and Resend for transactional email.

</div>

## Table of Contents

1. Overview
2. Features
3. Tech Stack
4. Architecture & Flow
5. Directory Structure
6. Data Model
7. Validation Schemas
8. Authentication & Session
9. Message Lifecycle
10. Email Verification Flow
11. AI Prompt Generation
12. API Reference
13. Roadmap / Ideas
14. License

---

## 1. Overview

Anonymous Messenger allows users to create a verified account, share a public profile link, and receive anonymous messages. Users can toggle whether they accept new messages and manage their inbox (including deletion). The platform offers suggested open‑ended questions powered by Google's Gemini model to encourage engagement.

## 2. Features

- Secure credential-based authentication with email verification (OTP code).
- Anonymous message sending with acceptance toggle.
- AI‑generated suggested questions (Gemini).
- Real-time friendly validation via Zod on both client & server.
- Robust aggregation pipeline for ordered message retrieval.
- Email templates built with `@react-email/components`.
- Server-side session handling using NextAuth JWT strategy.
- Modular API route handlers in App Router.
- Tailwind CSS + component abstractions (Radix UI + custom UI).

## 3. Tech Stack

| Layer      | Technologies                                              |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js 16 (App Router)                                   |
| Language   | TypeScript                                                |
| Styling    | Tailwind CSS, Radix UI primitives, custom components      |
| Auth       | NextAuth (Credentials Provider, JWT strategy)             |
| DB / ORM   | MongoDB + Mongoose                                        |
| Validation | Zod                                                       |
| Email      | Resend + React Email                                      |
| AI         | Google Generative AI (Gemini) via `@google/generative-ai` |
| Misc       | bcryptjs, axios, lucide-react icons                       |

## 4. Architecture & Flow

High-level layers:

1. Client: Next.js pages/components (App Router) render auth forms, dashboard, public user page, and message operations.
2. API Routes: All business logic for signup, verification, message CRUD (limited to create/delete), AI suggestions, and status toggling lives under `app/api/*`.
3. Auth: NextAuth Credentials provider checks username/email + password and enforces verification. JWT callback enriches token with user metadata.
4. Persistence: Mongoose models + `dbConnect` provide a cached connection layer.
5. Email: Verification codes sent via Resend using a React Email template.
6. AI: Suggestion endpoint prompts Gemini for 3 open-ended questions separated by `||`.

## 5. Directory Structure

Condensed view of notable paths:

```
app/
	api/               # Route handlers (REST-like)
	(app)/dashboard    # Authenticated dashboard UI
	(auth)/sign-in     # Sign-in page
	(auth)/sign-up     # Registration page
	(auth)/verify/[username] # Email verification page
	u/[username]       # Public profile page for receiving messages
components/          # Reusable UI components (cards, navbar, etc.)
emails/              # React email templates
lib/                 # Utility functions (e.g., utils.ts)
src/lib/dbConnect.ts # Mongo connection helper
src/models/user.model.ts # Mongoose schemas/models
src/schemas/         # Zod validation schemas
src/context/AuthProvider.tsx # Session provider wrapper
src/helpers/sendVerificationEmail.ts # Email dispatch logic
public/              # Static assets
```

## 6. Data Model

`User` document (simplified):

```ts
interface User {
  username: string;
  email: string;
  password: string; // bcrypt hashed
  verifyCode: string; // 6-digit OTP
  verifyCodeExpiry: Date; // 1h validity
  isVerified: boolean; // must be true for login
  isAcceptingMessages: boolean; // toggle for new messages
  message: { _id: ObjectId; content: string; createdAt: Date }[];
}
```

Notes:

- Messages embedded within the user document (subdocument array).
- Retrieval uses aggregation to unwind and sort by `message.createdAt` descending.

## 7. Validation Schemas (Zod)

- `signUpSchema`: username (2–20 chars, regex restricted), email, password (>=6).
- `signInSchema`: identifier (email or username) + password.
- `verifySchema`: 6‑digit code exact length.
- `messageSchema`: content 10–300 chars.
- `acceptMessageSchema`: boolean toggle.

## 8. Authentication & Session

- Credentials login checks either email or username.
- Rejects unverified accounts.
- JWT callback attaches `_id`, `isVerified`, `isAcceptingMessages`, `username` to token and session.
- Session strategy: JWT (no DB session storage).

## 9. Message Lifecycle

1. Visitor accesses `/u/{username}`.
2. Inputs anonymous content (validated 10–300 chars).
3. `send-message` endpoint ensures user exists and `isAcceptingMessages === true`.
4. Message appended to embedded array; user saves.
5. Authenticated owner queries `get-message` to retrieve sorted messages.
6. Owner can delete a message via `delete-message/{messageId}`.
7. Owner toggles status via `accept-messages` POST.

## 10. Email Verification Flow

1. User submits signup -> server checks uniqueness (verified usernames).
2. Generates 6‑digit code, stores hashed password, sets expiry (+1h).
3. Sends email via Resend with React Email template.
4. User enters code on `/verify/{username}` hitting `verify-code` endpoint.
5. If code matches and not expired, `isVerified` flips true, enabling login.

## 11. AI Prompt Generation

Endpoint `suggest-messages` uses Gemini model `gemini-2.5-flash-lite` to return a single string containing three questions separated by `||`. Client splits into individual suggestions.

## 12. API Reference

| Endpoint                            | Method   | Auth | Description                             | Key Responses                             |
| ----------------------------------- | -------- | ---- | --------------------------------------- | ----------------------------------------- |
| `/api/sign-up`                      | POST     | No   | Register user & send verification email | 201 success / 400 conflicts               |
| `/api/verify-code`                  | POST     | No   | Verify OTP for username                 | 200 verified / 400 invalid/expired        |
| `/api/auth/[...nextauth]`           | GET/POST | Yes  | NextAuth handler                        | 200 session or 401 errors                 |
| `/api/is-username-unique?username=` | GET      | No   | Validate username availability          | 200 unique / 400 taken                    |
| `/api/send-message`                 | POST     | No   | Send anonymous message to user          | 200 stored / 401 not found / 403 disabled |
| `/api/get-message`                  | GET      | Yes  | Retrieve authenticated user messages    | 200 list / 404 none / 401 unauth          |
| `/api/delete-message/{messageId}`   | DELETE   | Yes  | Remove a single message                 | 200 deleted / 401 not found/unauth        |
| `/api/accept-messages`              | POST     | Yes  | Toggle acceptance state                 | 200 updated / 401 unauth                  |
| `/api/accept-messages`              | GET      | Yes  | Fetch acceptance state                  | 200 state / 401 unauth                    |
| `/api/suggest-messages`             | GET      | No   | Get AI suggested prompts                | 200 prompts                               |

General error envelope:

```json
{ "success": false, "message": "<reason>" }
```

## 13. Roadmap / Ideas

- Rate limiting (IP, per-user).
- Spam / toxicity filtering (AI moderation).
- Pagination & message search.
- Export messages (CSV/JSON).
- Resend webhooks for delivery analytics.
- Optional replies (non-anonymous).
- Dark/light adaptive email templates.

## 14. License

This project is licensed under the MIT License.

- See the full text in `LICENSE` at the repo root.
- Copyright (c) 2025 Pritesh Thorat.

---

## Support

Issues & feature requests: open a GitHub Issue. For security concerns, please email the maintainer privately instead of opening a public issue.
