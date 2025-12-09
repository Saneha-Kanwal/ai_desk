# Changelog

## Version 1.0.0 - Initial Release

### Features

- ✅ Full-stack AI news aggregator with Next.js frontend and FastAPI backend
- ✅ OpenAI Agents integration for AI-generated summaries and explanations
- ✅ RSS feed ingestion from multiple AI news sources
- ✅ YouTube video recommendations (with optional API integration)
- ✅ Search and pagination functionality
- ✅ Multi-language translation support
- ✅ Responsive, modern UI with Tailwind CSS
- ✅ Docker Compose setup for easy development
- ✅ Database migrations with Alembic
- ✅ Background task scheduling for automatic news ingestion
- ✅ Admin endpoints for seeding sample data
- ✅ Comprehensive test suite (pytest + Playwright)
- ✅ Production-ready configuration

### Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy
- **Database**: PostgreSQL
- **AI**: OpenAI API (GPT-4 / GPT-3.5)
- **Optional**: YouTube Data API v3

### Known Limitations

- RSS feed parsing may fail for non-standard feed formats
- OpenAI API costs depend on usage (use `AGENT_MODE=cheap` for development)
- YouTube integration requires API key for direct video links
- Initial ingestion may take time depending on feed availability

### Future Enhancements

- [ ] User authentication and personalized feeds
- [ ] Bookmarking and favorites
- [ ] Email newsletter subscriptions
- [ ] Advanced filtering and categorization
- [ ] Real-time notifications for breaking news
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Multi-source aggregation with priority scoring

