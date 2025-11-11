"""add student profiles table

Revision ID: 2025_11_09_001
Revises: 2025_09_16_000001
Create Date: 2025-11-09 23:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '2025_11_09_001'
down_revision = '2025_09_16_000001'
branch_labels = None
depends_on = None


def upgrade():
    # Create student_profiles table
    op.create_table(
        'student_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('avatar_url', sa.Text(), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('location', sa.String(255), nullable=True),
        sa.Column('department', sa.String(255), nullable=False),
        sa.Column('current_year', sa.String(20), nullable=False),
        sa.Column('enrollment_year', sa.String(4), nullable=False),
        sa.Column('expected_graduation_year', sa.String(4), nullable=False),
        sa.Column('interests', postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column('skills', postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column('projects', postgresql.JSONB(), nullable=True),
        sa.Column('social_links', postgresql.JSONB(), nullable=False, server_default='{}'),
        sa.Column('looking_for_mentorship', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('mentorship_interests', postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=False), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=False), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('user_id')
    )
    
    # Create index on user_id for faster lookups
    op.create_index('ix_student_profiles_user_id', 'student_profiles', ['user_id'])


def downgrade():
    op.drop_index('ix_student_profiles_user_id', table_name='student_profiles')
    op.drop_table('student_profiles')
