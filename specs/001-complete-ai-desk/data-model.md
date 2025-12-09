# Data Model: Complete AI News Aggregator Platform

**Date**: 2025-01-27  
**Feature**: Complete AI News Aggregator Platform  
**Phase**: 1 - Design & Contracts

## Entities

### NewsArticle

**Purpose**: Represents an AI-related news item fetched from external sources

**Fields**:
- `id` (UUID): Unique identifier for the article
- `title` (string, required): Article headline/title
- `url` (string, required): Original source URL
- `source` (string, required): Source name/publication
- `published_at` (datetime, required): Publication timestamp
- `summary` (string, optional): Short summary/description from RSS feed
- `content` (string, optional): Full article content (generated on-demand, 800+ words)
- `tags` (list[string], optional): Article tags/keywords (max 5)
- `thumbnail` (string, optional): Image URL for article thumbnail
- `category` (string, required): Classification - one of: "AI-Related News", "Inventions", "Technologies", "Breakthroughs"
- `created_at` (datetime, required): When article was added to system
- `updated_at` (datetime, required): Last update timestamp

**Validation Rules**:
- `title` must not be empty
- `url` must be valid URL format
- `published_at` must be valid datetime
- `category` must be one of the 4 allowed values
- `tags` limited to 5 items maximum
- `content` minimum 800 words when generated

**Storage**: In-memory `OrderedDict` keyed by `id` (string representation of UUID)

**Relationships**: None (standalone entity)

**State Transitions**: 
- Created: When fetched from RSS feed
- Updated: When article content is generated
- Archived: When removed from memory (after 1000+ items)

---

### UserAccount

**Purpose**: Represents an authenticated user account

**Fields**:
- `id` (UUID): Unique identifier for the user
- `email` (string, required): User email address (unique)
- `hashed_password` (string, required): Bcrypt-hashed password
- `is_active` (boolean, required): Account active status (default: true)
- `is_verified` (boolean, required): Email verification status (default: false)
- `created_at` (datetime, required): Account creation timestamp
- `updated_at` (datetime, required): Last update timestamp

**Validation Rules**:
- `email` must be valid email format
- `email` must be unique (no duplicates)
- `hashed_password` must be bcrypt hash (not plain text)
- `email` must not be empty

**Storage**: In-memory `Dict` keyed by `id` (string representation of UUID)

**Relationships**: None (standalone entity)

**State Transitions**:
- Created: When user registers
- Activated: When `is_active` set to true
- Deactivated: When `is_active` set to false
- Verified: When `is_verified` set to true (future feature)

---

### AuthenticationToken

**Purpose**: Represents a JWT token for user authentication

**Fields** (in JWT payload):
- `sub` (string, required): User ID (UUID as string)
- `exp` (integer, required): Expiration timestamp (Unix epoch)
- `iat` (integer, optional): Issued at timestamp

**Validation Rules**:
- Token must be valid JWT format
- `exp` must be in the future when validated
- `sub` must correspond to existing user ID
- Token signature must be valid

**Storage**: HttpOnly cookie (not in-memory storage)

**Relationships**: References `UserAccount.id` via `sub` claim

**State Transitions**:
- Issued: When user logs in successfully
- Validated: When middleware checks token
- Expired: When `exp` timestamp passed
- Revoked: When user logs out (cookie cleared)

---

### ArticleContent

**Purpose**: Represents the AI-generated comprehensive article content

**Fields**:
- `article_id` (UUID, required): Reference to NewsArticle.id
- `full_text` (string, required): Complete article text (minimum 800 words)
- `headings` (list[string], optional): Extracted headings for navigation
- `youtube_queries` (list[string], optional): YouTube search queries (3-5 items)
- `youtube_videos` (list[Video], optional): Fetched YouTube video data
- `generated_at` (datetime, required): When article was generated
- `word_count` (integer, required): Actual word count (for validation)

**Validation Rules**:
- `full_text` must be at least 800 words
- `word_count` must match actual word count of `full_text`
- `youtube_queries` limited to 5 items maximum

**Storage**: Generated on-demand, not stored (always regenerated)

**Relationships**: References `NewsArticle.id` via `article_id`

**State Transitions**:
- Generating: When AI agent is processing
- Generated: When article meets word count requirement
- Failed: When generation fails or word count insufficient

---

### Video

**Purpose**: Represents a YouTube video related to an article

**Fields**:
- `id` (UUID): Unique identifier
- `youtube_id` (string, optional): YouTube video ID
- `title` (string, required): Video title
- `url` (string, required): YouTube video URL
- `published_at` (datetime, optional): Video publication date

**Validation Rules**:
- `url` must be valid YouTube URL format
- `title` must not be empty

**Storage**: Included in ArticleContent, not stored separately

**Relationships**: Belongs to ArticleContent

---

### Category

**Purpose**: Represents a news classification category

**Values**:
- "AI-Related News" (default)
- "Inventions"
- "Technologies"
- "Breakthroughs"

**Validation Rules**:
- Must be one of the 4 allowed values
- Default to "AI-Related News" if classification uncertain

**Storage**: String field in NewsArticle, not separate entity

---

### TimePeriodFilter

**Purpose**: Represents a time range filter for news articles

**Values**:
- "20s" (last 20 seconds)
- "30m" (last 30 minutes)
- "6h" (last 6 hours)
- "1d" (last 1 day)
- "4d" (last 4 days)
- "older" (older than 4 days)

**Validation Rules**:
- Must be one of the 6 allowed values
- Used for filtering, not stored

**Storage**: Query parameter, not stored

---

## Data Flow

### News Article Lifecycle

1. **Fetch**: RSS feed parsed → NewsArticle created (metadata only)
2. **Store**: Added to in-memory storage with category classification
3. **Display**: Retrieved for homepage cards (metadata only)
4. **Generate**: User clicks card → ArticleContent generated on-demand
5. **Archive**: Old articles removed when storage exceeds 1000 items

### User Authentication Lifecycle

1. **Register**: User provides email/password → UserAccount created → JWT issued
2. **Login**: User provides credentials → UserAccount validated → JWT issued
3. **Access**: Protected route → JWT validated → UserAccount retrieved
4. **Logout**: JWT cookie cleared → Session ended

### Article Generation Lifecycle

1. **Request**: User navigates to `/article/[id]`
2. **Trigger**: AI agent automatically executes
3. **Research**: Agent searches sources, gathers information
4. **Generate**: Agent creates 800+ word article
5. **Validate**: Word count checked (retry if <800 words)
6. **Return**: ArticleContent returned to frontend
7. **Display**: Article rendered with formatting

---

## Storage Schema

### In-Memory Storage Structure

```python
# News articles
news_storage: OrderedDict[str, Dict] = {
    "uuid-string": {
        "id": "uuid-string",
        "title": "...",
        "url": "...",
        "source": "...",
        "published_at": datetime(...),
        "summary": "...",
        "tags": ["tag1", "tag2"],
        "thumbnail": "...",
        "category": "AI-Related News",
        "created_at": datetime(...),
        "updated_at": datetime(...)
    }
}

# User accounts
users_storage: Dict[str, Dict] = {
    "uuid-string": {
        "id": "uuid-string",
        "email": "user@example.com",
        "hashed_password": "$2b$12$...",
        "is_active": True,
        "is_verified": False,
        "created_at": datetime(...),
        "updated_at": datetime(...)
    }
}
```

### Optional JSON File Structure (for persistence)

```json
{
  "users": [
    {
      "id": "uuid-string",
      "email": "user@example.com",
      "hashed_password": "$2b$12$...",
      "is_active": true,
      "is_verified": false,
      "created_at": "2025-01-27T10:00:00Z",
      "updated_at": "2025-01-27T10:00:00Z"
    }
  ]
}
```

---

## Validation Summary

- All entities have required fields clearly defined
- Validation rules ensure data integrity
- Relationships are explicit (via IDs)
- Storage mechanisms align with zero-database requirement
- State transitions are documented for lifecycle management

