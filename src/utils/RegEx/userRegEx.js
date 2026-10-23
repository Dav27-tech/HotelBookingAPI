// ─────────────────────────────────────────────────────────────────────────────
// USER REGEX — Entity: User | Table: user
// ─────────────────────────────────────────────────────────────────────────────
//
// Maps each validated field of the `user` model to a RegEx that enforces
// the SAME constraints declared at the database level (STRING(50),
// STRING(100), unique, isEmail validate, FK integers), so a malformed
// value is rejected by the validatorHandler(schema, 'body') middleware
// BEFORE it reaches Sequelize.
//
// Column → model → regex mapping (see src/db/models/user.js):
//   first_name       VARCHAR(50)  NOT NULL   → userFirstName
//   middle_name      VARCHAR(50)  NULL       → userMiddleName
//   first_lastname   VARCHAR(50)  NOT NULL   → userFirstLastName
//   second_lastname  VARCHAR(50)  NULL       → userSecondLastName
//   email            VARCHAR(100) NOT NULL   → userEmail
//   password         VARCHAR(100) NOT NULL   → userPassword (pre-hash)
//   role             INTEGER      NOT NULL   → userRoleId
//   status           INTEGER      NOT NULL   → userStatusId
//   last_login       DATE         NOT NULL   → Joi.date() (schema layer)
//   id               INTEGER      PK         → userId
//
// Child table:
//   phone.number     VARCHAR(20)  NOT NULL   → userPhoneNumber
// ─────────────────────────────────────────────────────────────────────────────

// ── Names ───────────────────────────────────────────────────────────────────

// firstName ('first_name', VARCHAR(50), NOT NULL).
// Letters (incl. accented, via \p{L}) and single spaces between words.
// 1–50 chars: the lower bound is 1 (not 3 as in the Certificates API)
// because hotel guests are international and 2-letter given names exist
// in many cultures (e.g. 'Bo', 'Li', 'Jo').
export const userFirstName = /^[\p{L} ]{1,50}$/u;

// middleName ('middle_name', VARCHAR(50), NULL).
// Same shape as firstName but optional. Allows the empty string so the
// frontend can send `""` to mean "no middle name" without the schema
// having to strip it separately.
export const userMiddleName = /^[\p{L} ]{0,50}$/u;

// firstLastName ('first_lastname', VARCHAR(50), NOT NULL).
export const userFirstLastName = /^[\p{L} ]{1,50}$/u;

// secondLastName ('second_lastname', VARCHAR(50), NULL).
export const userSecondLastName = /^[\p{L} ]{0,50}$/u;

// ── Email ───────────────────────────────────────────────────────────────────

// email ('email', VARCHAR(100), NOT NULL, UNIQUE, isEmail validate).
// local-part@domain.tld shape. Total length ≤ 100 is enforced at the
// Joi level (`.max(100)`) — not here — so the RegEx only guards the
// obvious shape:
//   • at least one character before '@'
//   • at least one dot in the domain
//   • TLD of at least 2 letters
//   • no whitespace
// The model's `validate: { isEmail: true }` runs in addition to this.
export const userEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ── Password (plain-text input, pre-hash) ──────────────────────────────────

// password ('password', VARCHAR(100) — but this column stores the
// BCRYPT HASH, ~60 chars, not the plain text).
// This RegEx validates the PLAIN-TEXT value the user submits, before
// it is hashed by hashPassword().
// 8–80 chars, at least one letter and at least one digit. Matches the
// Certificates API policy for consistency across both projects.
export const userPassword = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,80}$/;

// ── Foreign keys ────────────────────────────────────────────────────────────

// role ('role', INTEGER FK → user_role.id).
// Exposed as a digit-string (same RegEx-based approach used across the
// app), 1–10 digits.
export const userRoleId = /^\d{1,10}$/;

// status ('status', INTEGER FK → user_status.id).
export const userStatusId = /^\d{1,10}$/;

// ── Primary key ─────────────────────────────────────────────────────────────

// id ('id', INTEGER PK).
export const userId = /^\d{1,10}$/;

// ── Child: phone number ─────────────────────────────
