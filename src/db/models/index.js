// Control place to wire up every Sequelize association.
// Import all database models

// ---------------------------- User domain ------------------------------------
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
  });

  // A status can have many users
  UserStatus.hasMany(User, {
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'users',
  });

  // A user belongs to one status
  User.belongsTo(UserStatus, {
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
  });

  // A user can have many phones
  User.hasMany(Phone, {
    foreignKey: 'user',
    sourceKey: 'id',
    as: 'phones',
  });

  // A phone belongs to one user
  Phone.belongsTo(User, {
    foreignKey: 'user',
    targetKey: 'id',
    as: 'userData',
  });

  // --------------------- Room domain associations ----------------------------

  // A room type can have many rooms
  RoomType.hasMany(Room, {
    foreignKey: 'type',
    sourceKey: 'id',
    as: 'rooms',
  });

  // A room belongs to one room type
  Room.belongsTo(RoomType, {
    foreignKey: 'type',
    targetKey: 'id',
    as: 'typeData',
  });

  // A room status can have many rooms
  RoomStatus.hasMany(Room, {
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'rooms',
  });

  // A room belongs to one room status
  Room.belongsTo(RoomStatus, {
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
  });

  // --------------------- Booking domain associations -------------------------

  // A guest user can have many bookings
  User.hasMany(Booking, {
    foreignKey: 'guest',
    sourceKey: 'id',
    as: 'guestBookings',
  });

  // A booking belongs to one guest user
  Booking.belongsTo(User, {
    foreignKey: 'guest',
    targetKey: 'id',
    as: 'gestData',
  });

  // A user (staff/admin) can have created many bookings
  User.hasMany(Booking, {
    foreignKey: 'createdBy',
    sourceKey: 'id',
    as: 'createdBookings',
  });

  // A booking belongs to one creator user
  Booking.belongsTo(User, {
    foreignKey: 'createdBy',
    targetKey: 'id',
    as: 'createdByData',
  });

  // A room can have many bookings over time
  Room.hasMany(Booking, {
    foreignKey: 'room',
    sourceKey: 'id',
    as: 'bookings',
  });

  // A booking belongs to one room
  Booking.belongsTo(Room, {
    foreignKey: 'room',
    targetKey: 'id',
    as: 'roomData',
  });

  // A booking status can have many bookings
  BookingStatus.hasMany(Booking, {
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'bookings',
  });

  // A booking belongs to one booking status
  Booking.belongsTo(BookingStatus, {
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
  });

  // A booking can have many status history records
  Booking.hasMany(BookingStatusHistory, {
    foreignKey: 'booking',
    sourceKey: 'id',
    as: 'statusHistory',
  });

  // A status history record belongs to one booking
  BookingStatusHistory.belongsTo(Booking, {
    foreignKey: 'booking',
    sourceKey: 'id',
    as: 'statusHistory',
  });

  // A booking status can be the 'from' status of many history records
  BookingStatus.hasMany(BookingStatusHistory, {
    foreignKey: 'fromStatus',
    sourceKey: 'id',
    as: 'fromStatusHistory',
  });

  // A status history record belongs to one 'from' status
  BookingStatusHistory.belongsTo(BookingStatus, {
    foreignKey: 'fromStatus',
    targetKey: 'id',
    as: 'fromStatusData',
  });

  // A booking status can be the 'to' status of many history records
  BookingStatus.hasMany(BookingStatusHistory, {
    foreignKey: 'toStatus',
    sourceKey: 'id',
    as: 'toStatusHistory',
  });

  // A status history record belongs to one 'to' status
  BookingStatusHistory.belongsTo(BookingStatus, {
    foreignKey: 'toStatus',
    targetKey: 'id',
    as: 'toStatusData',
  });

  // A user can have changed many booking statues
  User.hasMany(BookingStatusHistory, {
    foreignKey: 'changedBy',
    sourceKey: 'id',
    as: 'bookingStatusChanges',
  });

  // A status history record belongs to one user (changer)
  BookingStatusHistory.belongsTo(User, {
    foreignKey: 'changedBy',
    targetKey: 'id',
    as: 'changedByData',
  });

  // --------------------- payment domain associations -------------------------

  // A booking has one payment (per business rule)
  Booking.hasOne(Payment, {
    foreignKey: 'booking',
    sourceKey: 'id',
    as: 'payment',
  });

  // A payment belongs to one booking
  Payment.belongsTo(Booking, {
    foreignKey: 'booking',
    targetKey: 'id',
    as: 'bookingData',
  });

  // A payment method can have many payments
  PaymentMethod.hasMany(Payment, {
    foreignKey: 'method',
    sourceKey: 'id',
    as: 'payments',
  });

  // A payment belongs to one payment method
  Payment.belongsTo(PaymentMethod, {
    foreignKey: 'method',
    targetKey: 'id',
    as: 'methodData',
  });

  // A payment status can have many payments
  PaymentStatus.hasMany(Payment, {
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'payments',
  });

  // A payment belongs to one payment status
  Payment.belongsTo(PaymentStatus, {
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
  });

  // A user (staff/admin) can have processed many payments
  User.hasMany(Payment, {
    foreignKey: 'processedBy',
    sourceKey: 'id',
    as: 'processedPayments',
  });

  // A payment belongs to one user (processor)
  Payment.belongsTo(User, {
    foreignKey: 'processedBy',
    targetKey: 'id',
    as: 'processedByData'
  });

  // --------------------- payment domain associations -------------------------

  // A guest user can have many conversations
  User.hasMany(Conversation, {
    foreignKey: 'guest',
    sourceKey: 'id',
    as: 'guestConversations',
  });

  // A conversation belongs to one guest user
  Conversation.belongsTo(User, {
    foreignKey: 'guest',
    targetKey: 'id',
    as: 'guestData',
  });

  // A staff user can have many conversations
  User.hasMany(Conversation, {
    foreignKey: 'staff',
    sourceKey: 'id',
    as: 'staffConversations',
  });

  // A conversation belongs to one staff user
  Conversation.belongsTo(User, {
    foreignKey: 'staff',
    targetKey: 'id',
    as: 'staffData',
  });

  // A conversation status can have many conversations
  ConversationStatus.hasMany(Conversation, {
    foreignKey: 'status',
    sourceKey: 'id',
    as: 'conversations',
  });

  // A conversation belongs to one conversation status
  Conversation.belongsTo(ConversationStatus, {
    foreignKey: 'status',
    targetKey: 'id',
    as: 'statusData',
  });

  // A conversation can have many messages
  Conversation.hasMany(Message, {
    foreignKey: 'conversation',
    sourceKey: 'id',
    as: 'messages',
  });

  // A message belongs to one conversation
  Message.belongsTo(Conversation, {
    foreignKey: 'conversation',
    targetKey: 'id',
    as: 'conversationData',
  });

  // A user can have sent many messages
  User.hasMany(Message, {
    foreignKey: 'sender',
    sourceKey: 'id',
    as: 'sentMessage',
  });

  // A message belongs to one sender user
  Message.belongsTo(User, {
    foreignKey: 'sender',
    targetKey: 'id',
    as: 'senderData',
  });
}
