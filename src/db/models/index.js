// Control place to wire up every Sequelize association.
// Import all database models

// ---------------------------- User domain ------------------------------------
<<<<<<< HEAD
import { User } from "./user.js";
import { Role } from "./userRole.js";
import { UserStatus } from "./userStatus.js";
import { Phone } from "./phone.js";

// ---------------------------- Room domain ------------------------------------
import { Room } from "./room.js";
import { RoomStatus } from "./roomStatus.js";
import { RoomType } from "./roomType.js";

// -------------------------- Booking domain -----------------------------------
import { Booking } from "./booking.js";
import { BookingStatus } from "./bookingStatus.js";
import { BookingStatusHistory } from "./bookingStatusHistory.js";

// -------------------------- Payment domain -----------------------------------
import { Payment } from "./payment.js";
import { PaymentMethod } from "./paymentMethod.js";
import { PaymentStatus } from "./paymentStatus.js";

// ----------------------- Conversation domain ---------------------------------
import { Conversation } from "./conversation.js ";
import { ConversationStatus } from "./conversationStatus.js";
import { Message } from "./message.js";

// Function to manage all models associations
export function setAssociations() {
  // --------------------- User domain associations ----------------------------

  // A role can have many users
  Role.hasMany(User, {
    foreignKey: "role",
    sourceKey: "id",
    as: "users",
  });

  // A user belongs to one role
  User.belongsTo(Role, {
    foreignKey: "role",
    targetKey: "id",
    as: "roleData",
=======
import { User } from './user.js';
import { UserRole } from './userRole.js';
import { UserStatus } from './userStatus.js';
import { Phone } from './phone.js';

// ---------------------------- Room domain ------------------------------------
import { Room } from './room.js';
import { RoomStatus } from './roomStatus.js';
import { RoomType } from './roomType.js';

// -------------------------- Booking domain -----------------------------------
import { Booking } from './booking.js';
import { BookingStatus } from './bookingStatus.js';
import { BookingStatusHistory } from './bookingStatusHistory.js';

// -------------------------- Payment domain -----------------------------------
import { Payment } from './payment.js';
import { PaymentMethod } from './paymentMethod.js';
import { PaymentStatus } from './paymentStatus.js';

// ----------------------- Conversation domain ---------------------------------
import { Conversation } from './conversation.js ';
import { ConversationStatus } from './conversationStatus.js';
import { Message } from './message.js';

// Function to manage all models associations
export function setAssociations() {

  // --------------------- User domain associations ----------------------------

  // A role can have many users
  UserRole.hasMany(User, {
    foreignKey: 'role',
    sourceKey: 'id',
    as: 'users',
  });

  // A user belongs to one role
  User.belongsTo(UserRole, {
    foreignKey: 'role',
    targetKey: 'id',
    as: 'roleData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A status can have many users
  UserStatus.hasMany(User, {
<<<<<<< HEAD
    foreignKey: "status",
    sourceKey: "id",
    as: "users",
=======
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'users',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A user belongs to one status
  User.belongsTo(UserStatus, {
<<<<<<< HEAD
    foreignKey: "status",
    targetKey: "id",
    as: "statusData",
=======
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A user can have many phones
  User.hasMany(Phone, {
<<<<<<< HEAD
    foreignKey: "user",
    sourceKey: "id",
    as: "phones",
=======
    foreignKey: 'user',
    sourceKey: 'id',
    as: 'phones',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A phone belongs to one user
  Phone.belongsTo(User, {
<<<<<<< HEAD
    foreignKey: "user",
    targetKey: "id",
    as: "userData",
=======
    foreignKey: 'user',
    targetKey: 'id',
    as: 'userData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // --------------------- Room domain associations ----------------------------

  // A room type can have many rooms
  RoomType.hasMany(Room, {
<<<<<<< HEAD
    foreignKey: "type",
    sourceKey: "id",
    as: "rooms",
=======
    foreignKey: 'type',
    sourceKey: 'id',
    as: 'rooms',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A room belongs to one room type
  Room.belongsTo(RoomType, {
<<<<<<< HEAD
    foreignKey: "type",
    targetKey: "id",
    as: "typeData",
=======
    foreignKey: 'type',
    targetKey: 'id',
    as: 'typeData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A room status can have many rooms
  RoomStatus.hasMany(Room, {
<<<<<<< HEAD
    foreignKey: "status",
    sourceKey: "id",
    as: "rooms",
=======
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'rooms',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A room belongs to one room status
  Room.belongsTo(RoomStatus, {
<<<<<<< HEAD
    foreignKey: "status",
    targetKey: "id",
    as: "statusData",
=======
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // --------------------- Booking domain associations -------------------------

  // A guest user can have many bookings
  User.hasMany(Booking, {
<<<<<<< HEAD
    foreignKey: "guest",
    sourceKey: "id",
    as: "guestBookings",
=======
    foreignKey: 'guest',
    sourceKey: 'id',
    as: 'guestBookings',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A booking belongs to one guest user
  Booking.belongsTo(User, {
<<<<<<< HEAD
    foreignKey: "guest",
    targetKey: "id",
    as: "gestData",
=======
    foreignKey: 'guest',
    targetKey: 'id',
    as: 'gestData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A user (staff/admin) can have created many bookings
  User.hasMany(Booking, {
<<<<<<< HEAD
    foreignKey: "createdBy",
    sourceKey: "id",
    as: "createdBookings",
=======
    foreignKey: 'createdBy',
    sourceKey: 'id',
    as: 'createdBookings',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A booking belongs to one creator user
  Booking.belongsTo(User, {
<<<<<<< HEAD
    foreignKey: "createdBy",
    targetKey: "id",
    as: "createdByData",
=======
    foreignKey: 'createdBy',
    targetKey: 'id',
    as: 'createdByData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A room can have many bookings over time
  Room.hasMany(Booking, {
<<<<<<< HEAD
    foreignKey: "room",
    sourceKey: "id",
    as: "bookings",
=======
    foreignKey: 'room',
    sourceKey: 'id',
    as: 'bookings',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A booking belongs to one room
  Booking.belongsTo(Room, {
<<<<<<< HEAD
    foreignKey: "room",
    targetKey: "id",
    as: "roomData",
=======
    foreignKey: 'room',
    targetKey: 'id',
    as: 'roomData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A booking status can have many bookings
  BookingStatus.hasMany(Booking, {
<<<<<<< HEAD
    foreignKey: "status",
    sourceKey: "id",
    as: "bookings",
=======
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'bookings',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A booking belongs to one booking status
  Booking.belongsTo(BookingStatus, {
<<<<<<< HEAD
    foreignKey: "status",
    targetKey: "id",
    as: "statusData",
=======
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A booking can have many status history records
  Booking.hasMany(BookingStatusHistory, {
<<<<<<< HEAD
    foreignKey: "booking",
    sourceKey: "id",
    as: "statusHistory",
=======
    foreignKey: 'booking',
    sourceKey: 'id',
    as: 'statusHistory',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A status history record belongs to one booking
  BookingStatusHistory.belongsTo(Booking, {
<<<<<<< HEAD
    foreignKey: "booking",
    sourceKey: "id",
    as: "statusHistory",
=======
    foreignKey: 'booking',
    sourceKey: 'id',
    as: 'statusHistory',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A booking status can be the 'from' status of many history records
  BookingStatus.hasMany(BookingStatusHistory, {
<<<<<<< HEAD
    foreignKey: "fromStatus",
    sourceKey: "id",
    as: "fromStatusHistory",
=======
    foreignKey: 'fromStatus',
    sourceKey: 'id',
    as: 'fromStatusHistory',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A status history record belongs to one 'from' status
  BookingStatusHistory.belongsTo(BookingStatus, {
<<<<<<< HEAD
    foreignKey: "fromStatus",
    targetKey: "id",
    as: "fromStatusData",
=======
    foreignKey: 'fromStatus',
    targetKey: 'id',
    as: 'fromStatusData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A booking status can be the 'to' status of many history records
  BookingStatus.hasMany(BookingStatusHistory, {
<<<<<<< HEAD
    foreignKey: "toStatus",
    sourceKey: "id",
    as: "toStatusHistory",
=======
    foreignKey: 'toStatus',
    sourceKey: 'id',
    as: 'toStatusHistory',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A status history record belongs to one 'to' status
  BookingStatusHistory.belongsTo(BookingStatus, {
<<<<<<< HEAD
    foreignKey: "toStatus",
    targetKey: "id",
    as: "toStatusData",
=======
    foreignKey: 'toStatus',
    targetKey: 'id',
    as: 'toStatusData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A user can have changed many booking statues
  User.hasMany(BookingStatusHistory, {
<<<<<<< HEAD
    foreignKey: "changedBy",
    sourceKey: "id",
    as: "bookingStatusChanges",
=======
    foreignKey: 'changedBy',
    sourceKey: 'id',
    as: 'bookingStatusChanges',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A status history record belongs to one user (changer)
  BookingStatusHistory.belongsTo(User, {
<<<<<<< HEAD
    foreignKey: "changedBy",
    targetKey: "id",
    as: "changedByData",
=======
    foreignKey: 'changedBy',
    targetKey: 'id',
    as: 'changedByData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // --------------------- payment domain associations -------------------------

  // A booking has one payment (per business rule)
  Booking.hasOne(Payment, {
<<<<<<< HEAD
    foreignKey: "booking",
    sourceKey: "id",
    as: "payment",
=======
    foreignKey: 'booking',
    sourceKey: 'id',
    as: 'payment',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A payment belongs to one booking
  Payment.belongsTo(Booking, {
<<<<<<< HEAD
    foreignKey: "booking",
    targetKey: "id",
    as: "bookingData",
=======
    foreignKey: 'booking',
    targetKey: 'id',
    as: 'bookingData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A payment method can have many payments
  PaymentMethod.hasMany(Payment, {
<<<<<<< HEAD
    foreignKey: "method",
    sourceKey: "id",
    as: "payments",
=======
    foreignKey: 'method',
    sourceKey: 'id',
    as: 'payments',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A payment belongs to one payment method
  Payment.belongsTo(PaymentMethod, {
<<<<<<< HEAD
    foreignKey: "method",
    targetKey: "id",
    as: "methodData",
=======
    foreignKey: 'method',
    targetKey: 'id',
    as: 'methodData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A payment status can have many payments
  PaymentStatus.hasMany(Payment, {
<<<<<<< HEAD
    foreignKey: "status",
    sourceKey: "id",
    as: "payments",
=======
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'payments',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A payment belongs to one payment status
  Payment.belongsTo(PaymentStatus, {
<<<<<<< HEAD
    foreignKey: "status",
    targetKey: "id",
    as: "statusData",
=======
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A user (staff/admin) can have processed many payments
  User.hasMany(Payment, {
<<<<<<< HEAD
    foreignKey: "processedBy",
    sourceKey: "id",
    as: "processedPayments",
=======
    foreignKey: 'processedBy',
    sourceKey: 'id',
    as: 'processedPayments',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A payment belongs to one user (processor)
  Payment.belongsTo(User, {
<<<<<<< HEAD
    foreignKey: "processedBy",
    targetKey: "id",
    as: "processedByData",
=======
    foreignKey: 'processedBy',
    targetKey: 'id',
    as: 'processedByData'
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // --------------------- payment domain associations -------------------------

  // A guest user can have many conversations
  User.hasMany(Conversation, {
<<<<<<< HEAD
    foreignKey: "guest",
    sourceKey: "id",
    as: "guestConversations",
=======
    foreignKey: 'guest',
    sourceKey: 'id',
    as: 'guestConversations',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A conversation belongs to one guest user
  Conversation.belongsTo(User, {
<<<<<<< HEAD
    foreignKey: "guest",
    targetKey: "id",
    as: "guestData",
=======
    foreignKey: 'guest',
    targetKey: 'id',
    as: 'guestData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A staff user can have many conversations
  User.hasMany(Conversation, {
<<<<<<< HEAD
    foreignKey: "staff",
    sourceKey: "id",
    as: "staffConversations",
=======
    foreignKey: 'staff',
    sourceKey: 'id',
    as: 'staffConversations',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A conversation belongs to one staff user
  Conversation.belongsTo(User, {
<<<<<<< HEAD
    foreignKey: "staff",
    targetKey: "id",
    as: "staffData",
=======
    foreignKey: 'staff',
    targetKey: 'id',
    as: 'staffData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A conversation status can have many conversations
  ConversationStatus.hasMany(Conversation, {
<<<<<<< HEAD
    foreignKey: "status",
    sourceKey: "id",
    as: "conversations",
=======
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'conversations',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A conversation belongs to one conversation status
  Conversation.belongsTo(ConversationStatus, {
<<<<<<< HEAD
    foreignKey: "status",
    targetKey: "id",
    as: "statusData",
=======
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A conversation can have many messages
  Conversation.hasMany(Message, {
<<<<<<< HEAD
    foreignKey: "conversation",
    sourceKey: "id",
    as: "messages",
=======
    foreignKey: 'conversation',
    sourceKey: 'id',
    as: 'messages',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A message belongs to one conversation
  Message.belongsTo(Conversation, {
<<<<<<< HEAD
    foreignKey: "conversation",
    targetKey: "id",
    as: "conversationData",
=======
    foreignKey: 'conversation',
    targetKey: 'id',
    as: 'conversationData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A user can have sent many messages
  User.hasMany(Message, {
<<<<<<< HEAD
    foreignKey: "sender",
    sourceKey: "id",
    as: "sentMessage",
=======
    foreignKey: 'sender',
    sourceKey: 'id',
    as: 'sentMessage',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });

  // A message belongs to one sender user
  Message.belongsTo(User, {
<<<<<<< HEAD
    foreignKey: "sender",
    targetKey: "id",
    as: "senderData",
=======
    foreignKey: 'sender',
    targetKey: 'id',
    as: 'senderData',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
  });
}
