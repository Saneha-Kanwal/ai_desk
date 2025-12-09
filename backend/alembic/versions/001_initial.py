"""Initial migration

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_verified', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    
    # Create news table
    op.create_table(
        'news',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('source', sa.String(200), nullable=False),
        sa.Column('published_at', sa.DateTime(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('tags', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
    )
    
    # Create videos table
    op.create_table(
        'videos',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('news_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('youtube_id', sa.String(100), nullable=True),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('url', sa.Text(), nullable=False),
        sa.Column('published_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['news_id'], ['news.id'], ondelete='CASCADE'),
    )
    
    # Create indexes
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_news_published_at', 'news', ['published_at'])
    op.create_index('idx_news_source', 'news', ['source'])
    op.create_index('idx_news_tags', 'news', ['tags'], postgresql_using='gin')
    op.create_index('idx_videos_news_id', 'videos', ['news_id'])
    op.create_index('idx_videos_youtube_id', 'videos', ['youtube_id'])


def downgrade() -> None:
    op.drop_index('idx_videos_youtube_id', table_name='videos')
    op.drop_index('idx_videos_news_id', table_name='videos')
    op.drop_index('idx_news_tags', table_name='news')
    op.drop_index('idx_news_source', table_name='news')
    op.drop_index('idx_news_published_at', table_name='news')
    op.drop_index('idx_users_email', table_name='users')
    op.drop_table('videos')
    op.drop_table('news')
    op.drop_table('users')

