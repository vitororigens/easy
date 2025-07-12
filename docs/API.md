# API Documentation - Easy App

## Overview

O Easy App utiliza Firebase como backend principal, fornecendo uma API robusta para controle financeiro pessoal com sistema de compartilhamento.

## Authentication

### Firebase Auth

O app utiliza Firebase Authentication para gerenciar usuários.

#### Endpoints

- **Sign Up**: `createUserWithEmailAndPassword(email, password)`
- **Sign In**: `signInWithEmailAndPassword(email, password)`
- **Sign Out**: `signOut()`
- **Password Reset**: `sendPasswordResetEmail(email)`

#### User Profile

```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  userName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Firestore Collections

### Users Collection

**Path**: `/User/{uid}`

```typescript
interface UserDocument {
  uid: string;
  userName: string;
  email: string;
  displayName: string;
  playerId?: string; // OneSignal ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Sharing Collection

**Path**: `/Sharing/{sharingId}`

```typescript
interface SharingDocument {
  id: string;
  invitedBy: string; // User ID
  target: string; // User ID
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Revenue Collection

**Path**: `/Revenue/{revenueId}`

```typescript
interface RevenueDocument {
  id: string;
  name: string;
  category: string;
  valueTransaction: string;
  date: string;
  time: string;
  description: string;
  uid: string;
  month: number;
  year: number;
  type: 'input';
  status: boolean;
  repeat: boolean;
  repeatType: 'finite' | 'infinite';
  repeatCount: number;
  shareWith: string[]; // User IDs
  shareInfo: ShareInfo[];
  createdAt: string;
}
```

### Expense Collection

**Path**: `/Expense/{expenseId}`

```typescript
interface ExpenseDocument {
  id: string;
  name: string;
  category: string;
  valueTransaction: string;
  date: string;
  time: string;
  description: string;
  uid: string;
  month: number;
  year: number;
  type: 'output';
  status: boolean;
  repeat: boolean;
  repeatType: 'finite' | 'infinite';
  repeatCount: number;
  shareWith: string[]; // User IDs
  shareInfo: ShareInfo[];
  createdAt: string;
}
```

### Markets Collection

**Path**: `/Markets/{marketId}`

```typescript
interface MarketDocument {
  id: string;
  name: string;
  category: string;
  measurement: string;
  price: number;
  quantity: number;
  observation: string;
  uid: string;
  shareWith: string[]; // User IDs
  shareInfo: ShareInfo[];
  createdAt: Timestamp;
}
```

### Tasks Collection

**Path**: `/Tasks/{taskId}`

```typescript
interface TaskDocument {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  uid: string;
  shareWith: string[]; // User IDs
  shareInfo: ShareInfo[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Notes Collection

**Path**: `/Notes/{noteId}`

```typescript
interface NoteDocument {
  id: string;
  name: string;
  description: string;
  author: string;
  type: string;
  uid: string;
  shareWith: string[]; // User IDs
  shareInfo: ShareInfo[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Events Collection

**Path**: `/Events/{eventId}`

```typescript
interface EventDocument {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  userId: string;
  sharedWith: string[]; // User IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Subscriptions Collection

**Path**: `/Subscriptions/{subscriptionId}`

```typescript
interface SubscriptionDocument {
  id: string;
  userId: string;
  name: string;
  value: number;
  dueDay: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Notifications Collection

**Path**: `/Notifications/{notificationId}`

```typescript
interface NotificationDocument {
  id: string;
  type: string;
  status: 'pending' | 'sent' | 'failed';
  sender: string; // User ID
  receiver: string; // User ID
  title: string;
  description: string;
  source: {
    id: string;
    type: string;
  };
  createdAt: Timestamp;
}
```

## Shared Types

### ShareInfo

```typescript
interface ShareInfo {
  uid: string;
  userName: string;
  acceptedAt: Timestamp | null;
}
```

## API Services

### User Service

```typescript
// Buscar usuário por username
findUserByUsername(username: string, excludeUid?: string): Promise<IUser[]>

// Buscar usuário por ID
findUserById(uid: string): Promise<IUser | null>

// Adicionar aos favoritos
addToFavorites(userId: string, favoriteUserId: string): Promise<void>

// Remover dos favoritos
removeFromFavorites(userId: string, favoriteUserId: string): Promise<void>

// Obter favoritos
getFavorites(userId: string): Promise<IUser[]>
```

### Sharing Service

```typescript
// Criar compartilhamento
createSharing(sharing: Omit<ISharing, "id">): Promise<DocumentReference>

// Atualizar compartilhamento
updateSharing(id: string, sharing: Partial<ISharing>): Promise<void>

// Buscar compartilhamento por ID
findSharingById(id: string): Promise<ISharing | null>

// Obter compartilhamentos
getSharing({ uid, profile, status }: IGetSharing): Promise<ISharing[]>

// Aceitar compartilhamento
acceptSharing(id: string): Promise<void>

// Rejeitar compartilhamento
rejectSharing(id: string): Promise<void>

// Deletar compartilhamento
deleteSharing(id: string): Promise<void>
```

### Financial Service

```typescript
// Criar receita
createRevenue(revenue: Omit<IRevenue, "id">): Promise<string>

// Atualizar receita
updateRevenue(id: string, revenue: Partial<IRevenue>): Promise<void>

// Deletar receita
deleteRevenue(id: string): Promise<void>

// Criar despesa
createExpense(expense: Omit<IExpense, "id">): Promise<string>

// Atualizar despesa
updateExpense(id: string, expense: Partial<IExpense>): Promise<void>

// Deletar despesa
deleteExpense(id: string): Promise<void>
```

### Market Service

```typescript
// Criar item de mercado
createMarket(market: Omit<IMarket, "id">): Promise<string>

// Atualizar item de mercado
updateMarket(id: string, market: Partial<IMarket>): Promise<void>

// Deletar item de mercado
deleteMarket(id: string): Promise<void>

// Buscar item por ID
findMarketById(id: string): Promise<IMarket | null>
```

### Task Service

```typescript
// Criar tarefa
createTask(task: Omit<ITask, "id">): Promise<string>

// Atualizar tarefa
updateTask(id: string, task: Partial<ITask>): Promise<void>

// Deletar tarefa
deleteTask(id: string): Promise<void>

// Alternar status da tarefa
toggleTaskCompletion(id: string): Promise<void>
```

### Note Service

```typescript
// Criar nota
createNote(note: Omit<INote, "id">): Promise<string>

// Atualizar nota
updateNote(note: INote): Promise<void>

// Deletar nota
deleteNote(id: string): Promise<void>

// Buscar nota por ID
findNoteById(id: string): Promise<INote | null>
```

### Event Service

```typescript
// Criar evento
createEvent(event: Omit<ICalendarEvent, "id">): Promise<string>

// Atualizar evento
updateEvent(id: string, event: Partial<ICalendarEvent>): Promise<void>

// Deletar evento
deleteEvent(id: string): Promise<void>

// Buscar eventos do usuário
getUserEvents(userId: string): Promise<ICalendarEvent[]>
```

### Subscription Service

```typescript
// Criar assinatura
createSubscription(subscription: Omit<Subscription, "id">): Promise<string>

// Atualizar assinatura
updateSubscription(id: string, subscription: Partial<Subscription>): Promise<void>

// Deletar assinatura
deleteSubscription(id: string): Promise<void>

// Obter assinaturas do usuário
getSubscriptions(userId: string): Promise<Subscription[]>
```

### Notification Service

```typescript
// Criar notificação
createNotification(notification: Omit<INotification, "id">): Promise<string>

// Enviar notificação push
sendPushNotification({ title, message, uid }: PushNotificationData): Promise<void>

// Marcar notificação como lida
markNotificationAsRead(id: string): Promise<void>

// Obter notificações do usuário
getUserNotifications(userId: string): Promise<INotification[]>
```

## Error Handling

### Error Types

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Códigos de erro comuns
const ErrorCodes = {
  PERMISSION_DENIED: 'permission-denied',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  INVALID_ARGUMENT: 'invalid-argument',
  UNAVAILABLE: 'unavailable',
  UNAUTHENTICATED: 'unauthenticated',
} as const;
```

### Error Handling Pattern

```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (error.code === 'permission-denied') {
    // Handle permission error
  } else if (error.code === 'not-found') {
    // Handle not found error
  } else {
    // Handle generic error
  }
  throw error;
}
```

## Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /User/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sharing rules
    match /Sharing/{sharingId} {
      allow read, write: if request.auth != null && 
        (resource.data.invitedBy == request.auth.uid || 
         resource.data.target == request.auth.uid);
    }
    
    // Financial data rules
    match /Revenue/{revenueId} {
      allow read, write: if request.auth != null && 
        (resource.data.uid == request.auth.uid ||
         request.auth.uid in resource.data.shareWith);
    }
    
    match /Expense/{expenseId} {
      allow read, write: if request.auth != null && 
        (resource.data.uid == request.auth.uid ||
         request.auth.uid in resource.data.shareWith);
    }
    
    // Market items rules
    match /Markets/{marketId} {
      allow read, write: if request.auth != null && 
        (resource.data.uid == request.auth.uid ||
         request.auth.uid in resource.data.shareWith);
    }
    
    // Tasks rules
    match /Tasks/{taskId} {
      allow read, write: if request.auth != null && 
        (resource.data.uid == request.auth.uid ||
         request.auth.uid in resource.data.shareWith);
    }
    
    // Notes rules
    match /Notes/{noteId} {
      allow read, write: if request.auth != null && 
        (resource.data.uid == request.auth.uid ||
         request.auth.uid in resource.data.shareWith);
    }
    
    // Events rules
    match /Events/{eventId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid ||
         request.auth.uid in resource.data.sharedWith);
    }
    
    // Subscriptions rules
    match /Subscriptions/{subscriptionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Notifications rules
    match /Notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        (resource.data.sender == request.auth.uid ||
         resource.data.receiver == request.auth.uid);
    }
  }
}
```

## Rate Limiting

O app implementa rate limiting para proteger contra spam e abuso:

- **Sharing Invites**: 5 tentativas por minuto
- **User Search**: 10 tentativas por minuto
- **Login Attempts**: 3 tentativas por 5 minutos
- **Item Creation**: 20 tentativas por minuto
- **Notifications**: 10 tentativas por minuto
- **File Uploads**: 5 tentativas por minuto

## Performance

### Indexes

Para otimizar consultas, os seguintes índices são necessários:

```javascript
// Revenue indexes
revenue_uid_month_idx: uid (Ascending), month (Ascending)
revenue_uid_shareWith_idx: uid (Ascending), shareWith (Array)

// Expense indexes
expense_uid_month_idx: uid (Ascending), month (Ascending)
expense_uid_shareWith_idx: uid (Ascending), shareWith (Array)

// Sharing indexes
sharing_invitedBy_status_idx: invitedBy (Ascending), status (Ascending)
sharing_target_status_idx: target (Ascending), status (Ascending)

// Tasks indexes
task_uid_status_idx: uid (Ascending), status (Ascending)
task_uid_shareWith_idx: uid (Ascending), shareWith (Array)

// Markets indexes
market_uid_category_idx: uid (Ascending), category (Ascending)
market_uid_shareWith_idx: uid (Ascending), shareWith (Array)
```

### Caching

O app utiliza cache em memória para:

- **User Data**: 10 minutos TTL
- **Sharing Data**: 2 minutos TTL
- **Market Data**: 5 minutos TTL

## Monitoring

### Analytics Events

O app rastreia os seguintes eventos:

- `user_sign_up`, `user_sign_in`, `user_sign_out`
- `sharing_invite_sent`, `sharing_invite_accepted`, `sharing_invite_rejected`
- `expense_added`, `expense_updated`, `expense_deleted`
- `revenue_added`, `revenue_updated`, `revenue_deleted`
- `market_item_added`, `market_item_updated`, `market_item_deleted`
- `task_created`, `task_updated`, `task_completed`
- `note_created`, `note_updated`, `note_deleted`
- `event_created`, `event_updated`, `event_deleted`
- `notification_received`, `notification_opened`

### Error Tracking

Erros são rastreados com:

- Mensagem de erro
- Stack trace
- Contexto da operação
- Timestamp
- User ID (quando disponível)

## Versioning

A API segue versionamento semântico (SemVer):

- **Major**: Mudanças incompatíveis
- **Minor**: Novas funcionalidades compatíveis
- **Patch**: Correções de bugs compatíveis

Versão atual: `1.0.0` 