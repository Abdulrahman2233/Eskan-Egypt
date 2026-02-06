# 🔧 دليل تقني متقدم

## 📚 المراجع المتعلقة

### Django REST Framework
- QuerySet Filtering: https://www.django-rest-framework.org/api-guide/filtering/
- Serializers: https://www.django-rest-framework.org/api-guide/serializers/
- Permissions: https://www.django-rest-framework.org/api-guide/permissions/

### React Best Practices
- State Management: https://react.dev/learn/managing-state
- useEffect Hook: https://react.dev/reference/react/useEffect
- Hooks Rules: https://react.dev/reference/rules/rules-of-hooks

---

## 🏗️ معمارية النظام

### Layer Architecture
```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  (React Components - UI)                │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Application Layer               │
│  (State Management - Hooks)             │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         API Layer                       │
│  (HTTP Requests - Fetch/Axios)          │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Backend Layer                   │
│  (Django Rest Framework)                │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Database Layer                  │
│  (PostgreSQL/SQLite)                    │
└─────────────────────────────────────────┘
```

---

## 🔌 API Contract

### Request/Response Pattern

#### GET /api/listings/properties/pending/
```
REQUEST:
  Method: GET
  URL: /api/listings/properties/pending/
  Headers:
    Authorization: Bearer {token}
    Content-Type: application/json
  Query Params:
    filter: today|this_week|this_month|all
    search: string
    ordering: -submitted_at

RESPONSE (200 OK):
  {
    "count": 28,
    "results": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "فيلا",
        "price": 500000,
        "rooms": 4,
        "bathrooms": 2,
        "size": 250,
        "floor": 1,
        "furnished": true,
        "type": "villa",
        "usage_type": "families",
        "usage_type_ar": "عائلات",
        "description": "وصف العقار",
        "area": {
          "id": 1,
          "name": "الدقي"
        },
        "images": [
          {
            "id": 1,
            "image_url": "https://..."
          }
        ],
        "owner": {
          "id": "user-uuid",
          "user": {
            "first_name": "أحمد",
            "last_name": "محمد",
            "email": "ahmed@example.com"
          }
        },
        "status": "pending",
        "submitted_at": "2026-01-19T10:30:00Z",
        "approval_notes": ""
      }
    ]
  }

ERROR (403 Forbidden):
  {
    "detail": "لا تملك صلاحية للوصول لهذا المورد"
  }
```

---

## 💾 Database Schema

### Property Model
```sql
CREATE TABLE listings_property (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  name_en VARCHAR(200),
  area_id INT FOREIGN KEY REFERENCES listings_area(id),
  address VARCHAR(300),
  price DECIMAL(12, 2),
  rooms INT DEFAULT 1,
  bathrooms INT DEFAULT 1,
  size INT,
  floor INT,
  furnished BOOLEAN DEFAULT FALSE,
  type VARCHAR(50),
  usage_type VARCHAR(20),
  description TEXT,
  description_en TEXT,
  contact VARCHAR(50),
  featured BOOLEAN DEFAULT FALSE,
  
  -- Approval Fields
  status VARCHAR(20) DEFAULT 'draft',
  owner_id UUID FOREIGN KEY REFERENCES users_userprofile(id),
  submitted_at TIMESTAMP,
  approved_by_id UUID FOREIGN KEY REFERENCES users_userprofile(id),
  approval_notes TEXT,
  
  created_at TIMESTAMP AUTO_NOW_ADD,
  updated_at TIMESTAMP AUTO_NOW
);
```

### Status Lifecycle
```
draft
  ↓ (submit)
pending
  ├─ (approve) ↓ approved
  └─ (reject)  ↓ rejected
             (resubmit) ↓ pending
```

---

## 🔄 State Management Pattern

### PropertyApprovals Component State
```typescript
// Main Data State
const [properties, setProperties] = useState<Property[]>([]);
const [loading, setLoading] = useState(false);

// UI State
const [previewOpen, setPreviewOpen] = useState(false);
const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

// Form State
const [searchTerm, setSearchTerm] = useState("");
const [filterType, setFilterType] = useState("all");
const [rejectNotes, setRejectNotes] = useState("");

// Selection State
const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
const [processingId, setProcessingId] = useState<string | null>(null);
```

### State Flow
```
User Interaction
    ↓
Update State
    ↓
Trigger useEffect
    ↓
API Call
    ↓
Update State with Response
    ↓
Re-render Component
```

---

## 🎯 Performance Optimization

### 1. Query Optimization (Backend)
```python
# ❌ Bad - N+1 Query Problem
properties = Property.objects.filter(status='pending')
for prop in properties:
    print(prop.owner.user.email)  # N queries

# ✅ Good - Using select_related
properties = Property.objects.filter(status='pending').select_related(
    'area', 'owner', 'owner__user'
).prefetch_related('images', 'videos')
```

### 2. Frontend Optimization
```typescript
// ✅ Memoization
const PropertyRow = React.memo(({ property, onView, onApprove }) => {
  return (/* component */);
});

// ✅ useCallback for stable references
const handleApprove = useCallback(async (id: string) => {
  // ...
}, []);
```

### 3. Data Fetching
```typescript
// ✅ Conditional Fetching
useEffect(() => {
  loadPendingProperties();
}, [filterType]); // Only run when filter changes

// ✅ Debounce Search
const handleSearch = debounce((term: string) => {
  loadPendingProperties();
}, 500);
```

---

## 🔒 Security Best Practices

### 1. Backend Security
```python
# ✅ Permission Checking
@permission_classes([IsAdminUser])
def pending(self, request):
    # Only admins can access
    pass

# ✅ Validation
def validate_approval_notes(self, value):
    if len(value) < 10:
        raise ValidationError("Notes too short")
    return value

# ✅ Sanitization
approval_notes = sanitize_html(request.data.get('approval_notes', ''))
```

### 2. Frontend Security
```typescript
// ✅ Input Validation
if (!rejectNotes.trim()) {
  showError("Notes are required");
  return;
}

// ✅ Authorization Check
if (!user?.is_staff && !user?.is_superuser) {
  navigate('/');
  return;
}

// ✅ Token Management
const token = localStorage.getItem("access_token");
if (!token) {
  navigate('/auth');
}
```

### 3. API Security
```typescript
// ✅ Headers
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}

// ✅ CSRF Protection
// Django automatically handles CSRF if using cookies
```

---

## 📊 Error Handling Strategy

### Hierarchical Error Handling
```
┌─ Network Error
│  ├─ Connection Failed
│  ├─ Timeout
│  └─ 500 Server Error
│
├─ Authorization Error
│  ├─ 401 Unauthorized
│  └─ 403 Forbidden
│
├─ Validation Error
│  ├─ 400 Bad Request
│  └─ 422 Unprocessable Entity
│
└─ Business Logic Error
   ├─ Already Approved
   ├─ Invalid Status
   └─ Custom Errors
```

### Error Recovery
```typescript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    // Handle specific error codes
    if (response.status === 401) {
      redirectToLogin();
    } else if (response.status === 403) {
      showPermissionError();
    } else {
      showGenericError();
    }
    return;
  }
  
  const data = await response.json();
  // Success
} catch (error) {
  // Network or parsing error
  showNetworkError();
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Frontend)
```typescript
describe('PropertyApprovals', () => {
  test('filters properties by date', async () => {
    render(<PropertyApprovals />);
    
    const filterSelect = screen.getByDisplayValue('جميع العقارات');
    fireEvent.change(filterSelect, { target: { value: 'today' } });
    
    await waitFor(() => {
      expect(mockAPI).toHaveBeenCalledWith(
        expect.stringContaining('filter=today')
      );
    });
  });

  test('disables approve button during submission', async () => {
    // ...
  });
});
```

### Integration Tests (Backend)
```python
class PropertyApprovalsTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(...)
        self.property = Property.objects.create(status='pending')
    
    def test_approve_property(self):
        response = self.client.post(
            f'/api/listings/properties/{self.property.id}/approve/',
            {'approval_notes': 'Approved'},
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        self.assertEqual(response.status_code, 200)
        self.property.refresh_from_db()
        self.assertEqual(self.property.status, 'approved')
```

---

## 🚀 Deployment Considerations

### Environment Variables
```bash
# Backend (.env)
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgres://...
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Frontend (.env)
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### CORS Configuration
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

### Production Checklist
```
Backend:
  ☐ DEBUG = False
  ☐ ALLOWED_HOSTS configured
  ☐ HTTPS enabled
  ☐ Database backed up
  ☐ Logs configured
  ☐ Error tracking (Sentry)
  
Frontend:
  ☐ Build optimized
  ☐ Minified assets
  ☐ Service Worker configured
  ☐ Analytics added
  ☐ Error reporting
```

---

## 📈 Monitoring & Analytics

### Metrics to Track
```
Backend Metrics:
  - API Response Time
  - Error Rate
  - Database Query Time
  - Cache Hit Rate

Frontend Metrics:
  - Page Load Time
  - Interaction Latency
  - Error Count
  - User Behavior
```

### Logging Pattern
```python
import logging

logger = logging.getLogger(__name__)

# In view
@action(detail=False, methods=['get'])
def pending(self, request):
    logger.info(f"User {request.user.id} accessed pending properties")
    
    try:
        # ... logic
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        # ...
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run tests
        run: |
          python -m pytest backend/
          npm run test frontend/
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        run: |
          # Deploy to production
```

---

## 📚 Documentation Standards

### API Documentation
```python
def pending(self, request):
    """
    Retrieve pending properties with advanced filtering.
    
    Query Parameters:
      filter (str): today|this_week|this_month|all
      search (str): Search term
      ordering (str): Field to order by
    
    Returns:
      {count: int, results: [Property]}
    
    Raises:
      PermissionDenied: If user is not admin
    """
```

### Component Documentation
```typescript
/**
 * PropertyApprovals Component
 * 
 * Manages the approval workflow for pending properties.
 * 
 * Features:
 * - Advanced filtering and search
 * - Property preview and details
 * - Approval/rejection with notes
 * - Real-time statistics
 * 
 * @component
 */
```

---

## 🎯 Future Enhancements

### Planned Features
1. **Real-time Updates**
   - WebSocket connections
   - Live property notifications
   - Concurrent approval handling

2. **Advanced Filtering**
   - Multi-criteria search
   - Saved filters
   - Filter templates

3. **Batch Operations**
   - Bulk approve/reject
   - Scheduled approvals
   - Template responses

4. **Analytics Dashboard**
   - Approval statistics
   - Performance metrics
   - Trend analysis

5. **Integrations**
   - Email notifications
   - SMS alerts
   - Slack integration

---

## 📞 Troubleshooting Guide

### Common Issues

#### 1. Properties Not Loading
```
Checklist:
  ☐ User is authenticated
  ☐ User has is_staff=true
  ☐ API endpoint is responding
  ☐ Database has pending properties
  ☐ Check network tab for errors
```

#### 2. Approval Button Not Working
```
Checklist:
  ☐ Token is valid
  ☐ API endpoint is correct
  ☐ Payload is correct
  ☐ User has permission
  ☐ Check console for errors
```

#### 3. Images Not Displaying
```
Checklist:
  ☐ Images uploaded to server
  ☐ MEDIA_URL configured
  ☐ Image URLs in database correct
  ☐ CORS headers set
  ☐ File permissions correct
```

---

## 🎓 Learning Resources

### Recommended Reading
- Django Models: https://docs.djangoproject.com/en/stable/topics/db/models/
- DRF Views: https://www.django-rest-framework.org/api-guide/views/
- React Patterns: https://react.dev/reference/react
- TypeScript: https://www.typescriptlang.org/docs/

### Video Tutorials
- Django REST Framework Course
- React Advanced Patterns
- Full Stack Development

---

## 💡 Best Practices Summary

### Do's ✅
- Use select_related for ForeignKey
- Use prefetch_related for reverse relations
- Validate input on both sides
- Use pagination for large datasets
- Implement proper error handling
- Log important events
- Test before deployment

### Don'ts ❌
- Don't expose sensitive data in errors
- Don't make N+1 queries
- Don't trust frontend validation alone
- Don't hardcode configuration
- Don't skip permission checks
- Don't commit secrets to git
- Don't deploy without testing

---

## 🔗 Related Components

```
PropertyApprovals
├── PropertyCard (reusable)
├── PreviewModal
├── RejectDialog
└── FilterBar

DashboardLayout
├── Sidebar
├── Navigation
└── UserMenu

API Layer
├── listings/views.py
├── users/serializers.py
└── property/models.py
```
