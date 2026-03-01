# ArtHamper Order Collaboration Chat - Implementation Guide

## Overview

The Order Collaboration Chat is a real-time private messaging system that enables seamless communication between clients and their assigned artists for each custom hamper order.

## System Architecture

### 1. **Database Schema** (Prisma)

```prisma
model Chat {
  id            String    @id @default(uuid())
  order         Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId       String    @unique @index
  clientId      String
  clientName    String
  artistIds     String    @default("[]")        // JSON array of artist IDs
  participants  String    @default("[]")        // JSON array of participant names
  messages      Message[]
  lastMessage   String?
  lastMessageAt DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Message {
  id         String   @id @default(uuid())
  chat       Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  chatId     String   @index
  senderId   String   @index
  senderName String
  senderRole String   @default("artist")        // "artist" or "client"
  text       String?
  imageUrl   String?
  seenBy     String   @default("[]")            // JSON array of user IDs who saw message
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### 2. **Real-Time Communication**

**Technology:** Socket.io + Next.js Custom Server

**Server Setup:** `server.js`
- Initializes HTTP server with Next.js
- Configures Socket.io with authentication middleware
- Implements room-based communication per order
- Emits real-time events (typing, online status, messages)

**Client Setup:** `pages/order-chat-new.js`
- Establishes Socket.io connection with authentication
- Listens for real-time events
- Emits messages and typing indicators
- Auto-scrolls to latest message

### 3. **Backend API Routes**

#### GET `/api/chat/[orderId]`
Retrieves chat and messages for an order.

**Request Headers:**
```javascript
{
  'x-user-id': 'client-id-or-artist-id'
}
```

**Query Parameters:**
```javascript
{
  limit: 20,      // Messages per page (default: 20)
  offset: 0       // Pagination offset (default: 0)
}
```

**Response:**
```javascript
{
  chat: {
    id: "chat-uuid",
    orderId: "order-uuid",
    clientId: "client-id",
    clientName: "Client Name",
    artistIds: '["artist-id-1", "artist-id-2", "artist-id-3"]',
    participants: '["Client Name", "Artist 1", "Artist 2", "Artist 3"]',
    lastMessage: "Looking forward to this!",
    lastMessageAt: "2026-03-02T10:30:00Z",
    createdAt: "2026-03-01T15:20:00Z"
  },
  messages: [
    {
      id: "msg-uuid",
      chatId: "chat-uuid",
      senderId: "client-id",
      senderName: "Client Name",
      senderRole: "client",
      text: "Hi, I'd like to discuss the design...",
      imageUrl: null,
      seenBy: '["client-id", "artist-id-1"]',
      createdAt: "2026-03-01T16:00:00Z"
    }
    // ... more messages
  ],
  total: 45  // Total message count
}
```

#### POST `/api/chat/[orderId]`
Send a new message to the chat.

**Request Body:**
```javascript
{
  text: "Message content",     // Optional if imageUrl provided
  imageUrl: "https://...",     // Optional if text provided
  senderName: "User Name",     // Required
  senderRole: "artist"         // "artist" or "client"
}
```

**Response:** Returns created Message object

### 4. **Access Control**

**File:** `lib/chat.js`

**Verification Function:** `verifyChatAccess(userId, orderId)`
- Checks if user is the order client
- Checks if user is one of the assigned artists
- Returns 403 error if unauthorized
- Returns order data if authorized

**Usage in API Routes:**
```javascript
const verified = await verifyChatAccess(userId, orderId)
if (!verified.authorized) {
  return res.status(403).json({ error: 'Not authorized' })
}
```

### 5. **Socket.io Events**

#### Client → Server Events

**`message:send`**
```javascript
{
  chatId: "chat-uuid",
  text: "Message content",
  messageId: "msg-uuid"  // Generated client-side for optimistic updates
}
```

**`typing:start`** - User started typing
**`typing:stop`** - User stopped typing

**`message:seen`**
```javascript
{
  messageId: "msg-uuid"
}
```

#### Server → Client Events

**`message:new`**
```javascript
{
  id: "msg-uuid",
  senderId: "user-id",
  senderName: "Name",
  senderRole: "artist",
  text: "Message",
  imageUrl: null,
  createdAt: "2026-03-02T10:00:00Z"
}
```

**`typing:indicator`**
```javascript
{
  userId: "user-id",
  userName: "Name",
  isTyping: true  // false when user stops typing
}
```

**`user:online`**
```javascript
{
  userId: "user-id",
  userName: "Name",
  userRole: "artist",
  timestamp: "2026-03-02T10:00:00Z"
}
```

**`user:offline`**
```javascript
{
  userId: "user-id",
  userName: "Name",
  timestamp: "2026-03-02T10:00:00Z"
}
```

**`message:seen`**
```javascript
{
  messageId: "msg-uuid",
  seenBy: ["user-id-1", "user-id-2"]
}
```

## Frontend Components

### Chat Page: `pages/order-chat-new.js`

**Features:**
- Real-time message display
- Message input with emoji support
- Image sharing capability
- Typing indicators
- Online/offline status
- Message read status (double checkmark ✓✓)
- Auto-scroll to latest message
- Responsive mobile-friendly design

**Key Hooks:**
```javascript
const [chat, setChat] = useState(null)
const [messages, setMessages] = useState([])
const [messageText, setMessageText] = useState('')
const [typingUsers, setTypingUsers] = useState([])
const [onlineUsers, setOnlineUsers] = useState([])
```

**Socket Connection:**
```javascript
const socket = io(undefined, {
  auth: {
    userId: 'client',
    userName: data.chat.clientName,
    userRole: 'client',
    orderId
  }
})
```

### Integration Points

**1. Hamper Orders Page** (`pages/hamper-orders.js`)
- "Open Chat" button on each order card
- Link: `/order-chat-new?orderId=${order.id}`

**2. Artist Assigned Orders Page** (to be created)
- Same chat integration
- Authenticated as artist user

## UI/UX Design System

### Color Palette
- **Client Messages:** Gradient purple (primary color)
- **Artist Messages:** Light gray background
- **Online Indicator:** Green dot with pulse animation
- **Background:** Soft cream (#FDF6F0)

### Typography
- **Headings:** Playfair Display
- **Body:** Poppins
- **Message Sender Name:** Bold, 12px
- **Message Text:** Regular, 14px
- **Timestamps:** Light gray, 12px

### Components

**Message Bubbles**
- Border radius: 16px
- Padding: 12px, 16px
- Max width: 70% on desktop
- Smooth fade-in animation
- Hover: lift effect (-2px transform)

**Typing Indicator**
- Three animated dots
- Each dot bounces with staggered delay
- Animation duration: 1.4s

**Input Area**
- Textarea with rounded corners (12px)
- Gradient button on right
- Icon indicator (✈️ for send)
- Focus state: Purple border + glow

## Security Considerations

### 1. **Authentication**
- JWT tokens in headers (production implementation)
- User ID verification in Socket.io middleware
- Room-based isolation per order

### 2. **Message Validation**
- Text length limits (max 5000 chars)
- Image file type validation (JPG, PNG, GIF, WebP)
- Image size limits (max 5MB)
- XSS prevention via React's default escaping

### 3. **Access Control**
- All routes verify user authorization
- Socket.io rooms isolated by orderId
- Cannot join unauthorized rooms
- Cannot send messages to unauthorized chats

### 4. **Data Privacy**
- Messages stored in database with timestamps
- User IDs and roles logged for audit trail
- "Seen by" tracking for privacy awareness
- Delete cascade on order deletion for cleanup

## Performance Optimizations

### 1. **Message Loading**
- Initial load: Last 20 messages
- Lazy loading on scroll
- Pagination with offset/limit

### 2. **Real-Time Updates**
- Socket.io rooms (not full broadcast)
- Minimal payload per event
- No full chat history transmission

### 3. **Client-Side**
- Optimistic message updates (show immediately)
- Debounced typing indicators (2s timeout)
- Efficient re-renders with React keys
- Custom scrollbar styling

## Future Enhancements

### Phase 2
- [ ] Image upload with preview
- [ ] File sharing (PDFs, documents)
- [ ] Voice/video call integration
- [ ] Message search and filtering
- [ ] Notification system
- [ ] Message reactions/emojis
- [ ] Pin important messages
- [ ] Message edit/delete functionality
- [ ] Drafts auto-save

### Phase 3
- [ ] Message encryption
- [ ] User presence tracking
- [ ] Typing speed analytics
- [ ] Chat export/archive
- [ ] Translation API integration
- [ ] Bot integration for suggestions
- [ ] Integration with order status updates
- [ ] Email notifications

## Troubleshooting

### Socket doesn't connect
**Solution:** Check that `server.js` is running and Socket.io is initialized

### Messages not appearing
**Solution:** Verify that both client and server are using same auth tokens

### Chat data not loading
**Solution:** Check API response in browser DevTools Network tab

### Styling issues
**Solution:** Clear browser cache and hard-refresh (Ctrl+Shift+R)

## Database Migration

Run the migration that created the Chat and updated Message tables:

```bash
npx prisma migrate dev --name add_chat_system
```

This creates:
- `Chat` table with indexes on orderId
- Updated `Message` table with chat relationship
- Proper cascading deletes

## File Structure

```
pages/
  └─ order-chat-new.js         # Main chat component
  api/
    └─ chat/
      └─ [orderId].js           # Chat API endpoint

lib/
  ├─ chat.js                    # Chat utilities & access control
  └─ socket.js                  # Socket.io initialization (for reference)

styles/
  └─ globals.css               # Chat styling included

prisma/
  ├─ schema.prisma             # Updated with Chat & Message models
  └─ migrations/
    └─ 20260301191547_add_chat_system/  # Migration files

server.js                       # Custom Node.js server with Socket.io
package.json                    # Updated with socket.io dependency
```

## API Examples

### Check if chat exists for order
```javascript
fetch('/api/chat/order-123')
  .then(res => res.json())
  .then(data => console.log(data.chat))
```

### Send a message
```javascript
fetch('/api/chat/order-123', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': 'user-456'
  },
  body: JSON.stringify({
    text: 'Hello everyone!',
    senderName: 'John',
    senderRole: 'client'
  })
})
```

### Load more messages (pagination)
```javascript
fetch('/api/chat/order-123?limit=20&offset=20')
  .then(res => res.json())
  .then(data => console.log(`Loaded ${data.messages.length} messages`))
```

## Notes

- Timestamps use ISO 8601 format (UTC)
- User authentication should be enhanced for production
- Message persistence requires Prisma ORM setup
- Socket.io version: 4.7.2
- Next.js: Latest version with Turbopack
- Database: SQLite (via Prisma)
