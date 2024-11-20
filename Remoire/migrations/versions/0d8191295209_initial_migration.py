"""Initial migration.

Revision ID: 0d8191295209
Revises: f98d5a0f3860
Create Date: 2024-11-20 10:07:21.321404

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0d8191295209'
down_revision = 'f98d5a0f3860'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('jacket', schema=None) as batch_op:
        batch_op.add_column(sa.Column('favorite', sa.Boolean(), server_default=sa.text('(false)'), nullable=False))

    with op.batch_alter_table('outfit', schema=None) as batch_op:
        batch_op.add_column(sa.Column('favorite', sa.Boolean(), server_default=sa.text('(false)'), nullable=False))

    with op.batch_alter_table('shirt', schema=None) as batch_op:
        batch_op.add_column(sa.Column('favorite', sa.Boolean(), server_default=sa.text('(false)'), nullable=False))

    with op.batch_alter_table('shoe', schema=None) as batch_op:
        batch_op.add_column(sa.Column('favorite', sa.Boolean(), server_default=sa.text('(false)'), nullable=False))

    with op.batch_alter_table('trouser', schema=None) as batch_op:
        batch_op.add_column(sa.Column('favorite', sa.Boolean(), server_default=sa.text('(false)'), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('trouser', schema=None) as batch_op:
        batch_op.drop_column('favorite')

    with op.batch_alter_table('shoe', schema=None) as batch_op:
        batch_op.drop_column('favorite')

    with op.batch_alter_table('shirt', schema=None) as batch_op:
        batch_op.drop_column('favorite')

    with op.batch_alter_table('outfit', schema=None) as batch_op:
        batch_op.drop_column('favorite')

    with op.batch_alter_table('jacket', schema=None) as batch_op:
        batch_op.drop_column('favorite')

    # ### end Alembic commands ###
