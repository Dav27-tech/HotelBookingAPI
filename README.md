# Hotel Booking API: Code Challenge

**Assigned:** Monday, October 19, 2026
**Due:** Monday, October 26, 2026

---

## 1. Project context

The **Hotel Booking API** is a RESTful backend (Node.js, Express.js, PostgreSQL, Sequelize)
for managing hotel reservations. It has three roles:

| Role            | Responsibility                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `Administrator` | Manages the whole system: users, catalogs, room types, rooms, bookings, payments, statistics.       |
| `Staff`         | Day-to-day operations: rooms, bookings, check-in/check-out, payments, support chat.                 |
| `Guest`         | Customer: searches rooms, creates and cancels own bookings, views own payments, chats with support. |

Read `docs/project-introduction.md` and the diagrams before you start:

- Project introduction: `docs/project-introduction.png`
- Relational model: `docs/relational-model.png`
- Classes diagram: `docs/classes-diagram.png`

A backend API is more than a collection of CRUD endpoints. It must enforce
business rules, protect data integrity, and restrict access by role.

---

## 2. The challenge

Each student is assigned **one entity** from the classes diagram. Analyze its
class (attributes and methods) and its table in the relational model. Then build
the full vertical slice for it, following the architecture the project already uses.

### What you must deliver

1. **Service class** in `src/services/<entity>Services.js`
   - Built with the Sequelize model that already exists in `src/db/models/`.
   - One method per operation in the class diagram (`create`, `update`, `delete`, `list`, `search`, plus any extra method listed).
   - Business rules and data-integrity checks live here (see section 5).
   - Errors are thrown as `Boom` errors. Wrap unexpected errors with `Boom.boomify`.
   - Use transactions when more than one write must succeed or fail together.

2. **Controllers** in `src/controllers/<entity>/`
   - One file per operation, for example `createOne.js`, `updateOne.js`, `deleteOne.js`, `listOne.js`, `listAll.js`.
   - A barrel file `index.js` that re-exports every controller.
   - Controllers only translate HTTP to service calls. They contain no business logic.
   - Send errors to `next(err)`. Echo the rotated token with `authentication: res.locals.newUserToken`.

3. **Sub-router** in `src/routes/<entity>Router.js`
   - All endpoints for your service.
   - Middleware order on every protected route:
     `checkAPIkey` → `authAppVerifyToken` → `checkRole([...])` → controller.
   - You must decide which roles can access each endpoint (Administrator, Staff, Guest). Justify each choice in your PR (see section 6).

4. **Register the router** in `src/routes/index.js`, for example `router.use('/user-roles', userRoleRouter);`.

5. **Postman tests**
   - Add a folder for your entity to `hotel-booking-api.postman_collection.json`.
   - Cover success and error cases: valid input, missing token, expired token, wrong role (403), not found (404), duplicate (409), invalid body (400).

6. **Pull request** (see section 6).

### Architecture to follow

```text
HTTP Request
     |
     v
Route  ->  checkAPIkey  ->  authAppVerifyToken  ->  checkRole  ->  (validation)
     |
     v
Controller  ->  Service  ->  Sequelize Model  ->  PostgreSQL
     |
     v
HTTP Response (JSON)
```

Use the existing **User** slice as your reference. It is the most complete example:

- `src/services/userServices.js`
- `src/controllers/user/*`
- `src/routes/userRouter.js`

### Conventions

- Style: 2-space indentation, single quotes, semicolons (`.editorconfig` and `.eslintrc.json`).
- ES modules (`import` / `export`).
- JSDoc on every service method and controller, like the User slice.
- Consistent response shape: `{ success, message, ...data, authentication }`.
- Status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
- Never return sensitive data, and never commit `.env`.
- Optional but encouraged: add a Joi schema in `src/schema/` and a RegEx in `src/utils/RegEx/` for request validation.
- Reject invalid input before it reaches the database.

---

## 3. Assignments

| Student  | Entity             | Service class               | Table / Model                                |
| -------- | ------------------ | --------------------------- | -------------------------------------------- |
| Panom    | UserRole           | `UserRoleService`           | `user_role` / `UserRole`                     |
| David    | UserStatus         | `UserStatusService`         | `user_status` / `UserStatus`                 |
| Nhial    | BookingStatus      | `BookingStatusService`      | `booking_status` / `BookingStatus`           |
| Moses    | RoomType           | `RoomTypeService`           | `room_type` / `RoomType`                     |
| Alexa    | PaymentMethod      | `PaymentMethodService`      | `payment_method` / `PaymentMethod`           |
| Lucky    | PaymentStatus      | `PaymentStatusService`      | `payment_status` / `PaymentStatus`           |
| Jonathan | ConversationStatus | `ConversationStatusService` | `conversation_status` / `ConversationStatus` |
| Seth     | Conversation       | `ConversationService`       | `conversation` / `Conversation`              |
| Dolphin  | Message            | `MessageService`            | `message` / `Message`                        |

---

## 4. Class diagram summary

### Catalog entities

Applies to: UserRole, UserStatus, BookingStatus, PaymentMethod, PaymentStatus, ConversationStatus.

| Attribute | Type                        |
| --------- | --------------------------- |
| `id`      | Int                         |
| `name`    | String (VARCHAR 30, unique) |

| Method             | Returns        |
| ------------------ | -------------- |
| `create(name)`     | `Object{}`     |
| `update(id, name)` | `Object{}`     |
| `delete(id)`       | `Object{}`     |
| `list()`           | `List<Entity>` |
| `search(id)`       | `Entity`       |

### RoomType (Moses)

| Attribute       | Type / constraint            |
| --------------- | ---------------------------- |
| `id`            | Int                          |
| `name`          | String (VARCHAR 50, unique)  |
| `description`   | String (TEXT)                |
| `pricePerNight` | Float (between 10 and 10000) |
| `maxOccupancy`  | Int (between 1 and 10)       |
| `amenities`     | `Object{}` (JSONB)           |

Methods: `create(name, description, pricePerNight, maxOccupancy, amenities)`, `update(id, ...)`, `delete(id)`, `list()`, `search(id)`.

### Conversation (Seth)

| Attribute | Type                                |
| --------- | ----------------------------------- |
| `id`      | Int                                 |
| `guest`   | Int (FK → `user.id`)                |
| `staff`   | Int (FK → `user.id`)                |
| `status`  | Int (FK → `conversation_status.id`) |

Methods: `create(guest, staff, status)`, `update(id, guest, staff, status)`, `delete(id)`, `list()`, `search(id)`, **`findAvailableStaff()`** → `List<User>`.

### Message (Dolphin)

| Attribute      | Type                         |
| -------------- | ---------------------------- |
| `id`           | Int                          |
| `conversation` | Int (FK → `conversation.id`) |
| `sender`       | Int (FK → `user.id`)         |
| `body`         | String (TEXT)                |

Methods: `create(conversation, sender, body)`, `update(id, conversation, sender, body)`, `delete(id)`, `list()`, `search(id)`, **`findByConversation(conversation)`** → `List<Message>`.

---

## 5. Business rules and access guidance by entity

Treat this as a starting point. Analyze it, challenge it, and document your final decision in the PR.

### 5.1 Catalogs: UserRole, UserStatus, BookingStatus, PaymentMethod, PaymentStatus, ConversationStatus

- **Integrity**
  - `name` is required, trimmed, max 30 chars, and unique. Return `409` on duplicates (check case-insensitively).
  - `update` and `delete` return `404` if the `id` does not exist.
  - Foreign keys use `ON DELETE RESTRICT`. Before deleting, check that no row references the record. Return `409` with a clear message instead of leaking a raw database error.
  - Think about system-critical values. `UserRole` rows (Administrator, Staff, Guest) and `UserStatus` rows (Active, ...) are used by the code logic (`checkRole`, login checks). Decide whether they should be protected from rename or delete, and explain why.
- **Access (proposal)**
  - `create`, `update`, `delete`: **Administrator** only.
  - `list`, `search`: Administrator and Staff. Decide for each catalog whether Guests need read access, for example to display statuses, and justify it.
- **Notes**
  - UserRole: roles are embedded in the JWT as `role: name`. Renaming a role would break `checkRole`.
  - BookingStatus: it feeds the booking lifecycle (PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT, plus CANCELLED).
  - PaymentStatus: it feeds payment transitions (PENDING, PAID, FAILED, REFUNDED).

### 5.2 RoomType (Moses)

- **Integrity**
  - `pricePerNight` must be between 10 and 10000. `maxOccupancy` must be between 1 and 10 (database CHECK constraints exist, so validate before hitting them).
  - `amenities` must be a valid JSON array of strings.
  - `name` is unique.
  - Block delete while rooms use the type (`409`).
- **Business rule:** `pricePerNight` is the source of truth for booking price calculation (`nights × price_per_night`). Think about the impact of changing a price on existing bookings.
- **Access (proposal)**
  - `create`, `update`, `delete`: **Administrator** only (the project spec says admins manage room types).
  - `list`, `search`: Administrator and Staff. Guests need to see types and prices to search and filter rooms. Decide whether to expose them to Guests and which fields.

### 5.3 Conversation (Seth)

- **Integrity**
  - Validate that `guest` is a user with role Guest, that `staff` is a user with role Staff, and that `status` exists.
  - Never trust a client-sent `guest` id. A Guest creates a conversation for **themselves** (take the id from `req.user`).
  - `findAvailableStaff()` returns Staff users who are Active, ordered by fewest open conversations (use `countBy` or `GROUP BY`).
  - Use a **transaction** when you create a conversation and assign staff.
  - Prevent invalid status changes. Open → Assigned → Closed. A Closed conversation cannot be reopened or receive messages.
- **Access (proposal)**
  - Guest: create own, list or search own only.
  - Staff: list or search conversations assigned to them, update status, close.
  - Administrator: full access, including delete.
  - `findAvailableStaff` is internal. Decide whether it needs an endpoint at all.
- **Heads-up:** see the "Known issues" section before you start.

### 5.4 Message (Dolphin)

- **Integrity**
  - `body` is required, trimmed, and has a sensible max length.
  - The `sender` comes from the token, not the request body.
  - The sender must be a participant (the guest or staff) of that conversation. Reject otherwise (`403`).
  - Do not allow messages in a `Closed` conversation (`409`).
  - `update(id, conversation, sender, body)` exists in the diagram. Decide what is actually editable. Moving a message to another conversation or changing its sender is a data-integrity problem, so restrict updates to `body` and to the original sender.
- **Access (proposal)**
  - Guest and Staff: create, list, or search only in their **own** conversations.
  - `findByConversation`: participants of that conversation and Administrator.
  - `delete`: Administrator only (or the sender within a short window, if you justify it).
- **Real time:** WebSockets come in a later module. This assignment is the REST layer only.

---

## 6. Workflow and delivery

### Git workflow (mandatory)

1. **Fork** the main repository to your own GitHub account.
2. Clone your fork and create a branch named `<your-name>/<service-name>`:

```bash
   git checkout -b panom/user-role
   git checkout -b moses/room-type
   git checkout -b seth/conversation
```

3. Work only on your own branch. Commit small and often, with meaningful messages.
4. When everything works and is verified in Postman, open a **Pull Request** from your branch into the main repository.

### Local setup

```bash
cp ./env/.envexample ./.env     # or: npm run env-var
docker compose up -d            # PostgreSQL + pgAdmin
npm install
npm run migrations:run
npm run seed:run
npm run dev
```

### Pull request checklist

Your PR description must include:

- [ ] Student name and assigned entity
- [ ] Files created or changed
- [ ] **Roles table:** each endpoint with its allowed roles and a one-line justification
- [ ] Business rules implemented and how they are enforced
- [ ] Screenshots or exported Postman results (success and error cases)
- [ ] Updated Postman collection included in the PR
- [ ] Any doubts, assumptions, or decisions you made
- [ ] No `.env`, secrets, or `node_modules` committed

### PR title format

```text
[Challenge] <Student name> - <Entity> service
```

### Evaluation criteria

| Criteria                                                                         | Weight |
| -------------------------------------------------------------------------------- | ------ |
| Follows the project architecture (service → controller → router, barrel exports) | 25%    |
| Business rules and data integrity                                                | 25%    |
| Role-based access, justified                                                     | 20%    |
| Error handling and status codes                                                  | 10%    |
| Postman evidence                                                                 | 10%    |
| Code quality, JSDoc, and Git hygiene                                             | 10%    |

### Deadline

The Pull Request must be opened by **Monday, October 26, 2026**.

---

## 7. Known issues in the base project

The base repository has a few small bugs. Report them or fix them in a separate
commit if they block you:

- `src/db/models/index.js` imports `'./conversation.js '` with a trailing space.
- The `Conversation` model has `timestamps: true` but the table has no `updated_at` column.
- `conversation.staff` is `NOT NULL`, but a new conversation has no staff yet.
- `Booking.belongsTo(User, { as: 'gestData' })` is a typo for `guestData`.
- `20261002142512-create-message.cjs` declares `onDelete` twice per foreign key.
- `20261002140040-create-payment.cjs` calls `createTable` in `down`, where it should call `dropTable`.

---

Good luck, and ask questions early. Reviewing your code is easier when the PR
is clean and well documented.
