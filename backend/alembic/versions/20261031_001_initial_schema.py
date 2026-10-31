"""Initial Brightloop Subscription Management Schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-31 09:00:00.000000+00:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('user_type', sa.String(length=50), server_default='customer', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('is_verified', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('google_id', sa.String(length=255), nullable=True),
        sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_google_id'), 'users', ['google_id'], unique=False)
    op.create_index(op.f('ix_users_user_type'), 'users', ['user_type'], unique=False)

    # 2. roles
    op.create_table(
        'roles',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_roles_name'), 'roles', ['name'], unique=True)

    # 3. user_roles
    op.create_table(
        'user_roles',
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.Column('assigned_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('user_id', 'role_id')
    )

    # 4. email_verification_tokens
    op.create_table(
        'email_verification_tokens',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('token', sa.String(length=255), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_used', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_email_verification_tokens_token'), 'email_verification_tokens', ['token'], unique=True)
    op.create_index(op.f('ix_email_verification_tokens_user_id'), 'email_verification_tokens', ['user_id'], unique=False)

    # 5. password_reset_tokens
    op.create_table(
        'password_reset_tokens',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('token', sa.String(length=255), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_used', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_password_reset_tokens_token'), 'password_reset_tokens', ['token'], unique=True)
    op.create_index(op.f('ix_password_reset_tokens_user_id'), 'password_reset_tokens', ['user_id'], unique=False)

    # 6. organization_members
    op.create_table(
        'organization_members',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('department', sa.String(length=100), server_default='Operations', nullable=False),
        sa.Column('job_title', sa.String(length=150), server_default='Staff Member', nullable=False),
        sa.Column('is_lead', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('permissions', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_organization_members_user_id'), 'organization_members', ['user_id'], unique=True)

    # 7. products
    op.create_table(
        'products',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('code', sa.String(length=100), nullable=False),
        sa.Column('type', sa.String(length=100), server_default='Service / SaaS', nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_products_code'), 'products', ['code'], unique=True)
    op.create_index(op.f('ix_products_name'), 'products', ['name'], unique=False)

    # 8. product_variants
    op.create_table(
        'product_variants',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('product_id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('sku', sa.String(length=100), nullable=False),
        sa.Column('sales_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('cost_price', sa.Numeric(precision=12, scale=2), server_default='0.00', nullable=False),
        sa.Column('attributes', sa.JSON(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_product_variants_product_id'), 'product_variants', ['product_id'], unique=False)
    op.create_index(op.f('ix_product_variants_sku'), 'product_variants', ['sku'], unique=True)

    # 9. plans
    op.create_table(
        'plans',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('code', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('billing_frequency', sa.String(length=50), server_default='Monthly', nullable=False),
        sa.Column('price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('minimum_quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('availability_period', sa.String(length=100), server_default='Always Available', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('features', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_plans_code'), 'plans', ['code'], unique=True)

    # 10. plan_products
    op.create_table(
        'plan_products',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('plan_id', sa.String(length=36), nullable=False),
        sa.Column('product_id', sa.String(length=36), nullable=False),
        sa.Column('variant_id', sa.String(length=36), nullable=True),
        sa.Column('is_included', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('sort_order', sa.Integer(), server_default='0', nullable=False),
        sa.ForeignKeyConstraint(['plan_id'], ['plans.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['variant_id'], ['product_variants.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_plan_products_plan_id'), 'plan_products', ['plan_id'], unique=False)
    op.create_index(op.f('ix_plan_products_product_id'), 'plan_products', ['product_id'], unique=False)

    # 11. quotation_templates
    op.create_table(
        'quotation_templates',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('terms_and_conditions', sa.Text(), nullable=True),
        sa.Column('default_validity_days', sa.Integer(), server_default='30', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # 12. quotations
    op.create_table(
        'quotations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('quotation_number', sa.String(length=100), nullable=False),
        sa.Column('customer_id', sa.String(length=36), nullable=False),
        sa.Column('template_id', sa.String(length=36), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='Draft', nullable=False),
        sa.Column('total_amount', sa.Numeric(precision=12, scale=2), server_default='0.00', nullable=False),
        sa.Column('validity_date', sa.Date(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['template_id'], ['quotation_templates.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quotations_customer_id'), 'quotations', ['customer_id'], unique=False)
    op.create_index(op.f('ix_quotations_quotation_number'), 'quotations', ['quotation_number'], unique=True)
    op.create_index(op.f('ix_quotations_status'), 'quotations', ['status'], unique=False)

    # 13. quotation_items
    op.create_table(
        'quotation_items',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('quotation_id', sa.String(length=36), nullable=False),
        sa.Column('product_id', sa.String(length=36), nullable=True),
        sa.Column('variant_id', sa.String(length=36), nullable=True),
        sa.Column('description', sa.String(length=255), nullable=False),
        sa.Column('quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('unit_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('total_amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['quotation_id'], ['quotations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['variant_id'], ['product_variants.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quotation_items_quotation_id'), 'quotation_items', ['quotation_id'], unique=False)

    # 14. subscriptions
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('subscription_code', sa.String(length=100), nullable=False),
        sa.Column('customer_id', sa.String(length=36), nullable=False),
        sa.Column('plan_id', sa.String(length=36), nullable=False),
        sa.Column('quotation_id', sa.String(length=36), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('expiry_date', sa.Date(), nullable=True),
        sa.Column('next_billing_date', sa.Date(), nullable=True),
        sa.Column('billing_cycle', sa.String(length=50), server_default='Monthly', nullable=False),
        sa.Column('status', sa.String(length=50), server_default='Active', nullable=False),
        sa.Column('auto_renew', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('recurring_amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['plan_id'], ['plans.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['quotation_id'], ['quotations.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subscriptions_customer_id'), 'subscriptions', ['customer_id'], unique=False)
    op.create_index(op.f('ix_subscriptions_next_billing_date'), 'subscriptions', ['next_billing_date'], unique=False)
    op.create_index(op.f('ix_subscriptions_plan_id'), 'subscriptions', ['plan_id'], unique=False)
    op.create_index(op.f('ix_subscriptions_status'), 'subscriptions', ['status'], unique=False)
    op.create_index(op.f('ix_subscriptions_subscription_code'), 'subscriptions', ['subscription_code'], unique=True)

    # 15. subscription_items
    op.create_table(
        'subscription_items',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('subscription_id', sa.String(length=36), nullable=False),
        sa.Column('product_id', sa.String(length=36), nullable=False),
        sa.Column('variant_id', sa.String(length=36), nullable=True),
        sa.Column('quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('unit_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('total_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['subscription_id'], ['subscriptions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['variant_id'], ['product_variants.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subscription_items_subscription_id'), 'subscription_items', ['subscription_id'], unique=False)

    # 16. invoices
    op.create_table(
        'invoices',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('invoice_number', sa.String(length=100), nullable=False),
        sa.Column('subscription_id', sa.String(length=36), nullable=True),
        sa.Column('customer_id', sa.String(length=36), nullable=False),
        sa.Column('invoice_date', sa.Date(), nullable=False),
        sa.Column('due_date', sa.Date(), nullable=False),
        sa.Column('subtotal', sa.Numeric(precision=12, scale=2), server_default='0.00', nullable=False),
        sa.Column('tax_amount', sa.Numeric(precision=12, scale=2), server_default='0.00', nullable=False),
        sa.Column('discount_amount', sa.Numeric(precision=12, scale=2), server_default='0.00', nullable=False),
        sa.Column('total_amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('amount_paid', sa.Numeric(precision=12, scale=2), server_default='0.00', nullable=False),
        sa.Column('status', sa.String(length=50), server_default='Pending', nullable=False),
        sa.Column('payment_method', sa.String(length=100), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['subscription_id'], ['subscriptions.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_invoices_customer_id'), 'invoices', ['customer_id'], unique=False)
    op.create_index(op.f('ix_invoices_invoice_number'), 'invoices', ['invoice_number'], unique=True)
    op.create_index(op.f('ix_invoices_status'), 'invoices', ['status'], unique=False)
    op.create_index(op.f('ix_invoices_subscription_id'), 'invoices', ['subscription_id'], unique=False)

    # 17. invoice_items
    op.create_table(
        'invoice_items',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('invoice_id', sa.String(length=36), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=False),
        sa.Column('quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('unit_price', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.ForeignKeyConstraint(['invoice_id'], ['invoices.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_invoice_items_invoice_id'), 'invoice_items', ['invoice_id'], unique=False)

    # 18. tax_rules
    op.create_table(
        'tax_rules',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('tax_type', sa.String(length=50), server_default='Percentage', nullable=False),
        sa.Column('rate', sa.Numeric(precision=6, scale=4), nullable=False),
        sa.Column('country', sa.String(length=100), server_default='US', nullable=False),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # 19. discounts
    op.create_table(
        'discounts',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('discount_type', sa.String(length=50), server_default='Percentage', nullable=False),
        sa.Column('value', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('usage_limit', sa.Integer(), server_default='100', nullable=False),
        sa.Column('used_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_discounts_code'), 'discounts', ['code'], unique=True)

    # 20. discount_usage
    op.create_table(
        'discount_usage',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('discount_id', sa.String(length=36), nullable=False),
        sa.Column('customer_id', sa.String(length=36), nullable=False),
        sa.Column('invoice_id', sa.String(length=36), nullable=True),
        sa.Column('amount_discounted', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('used_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['discount_id'], ['discounts.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['invoice_id'], ['invoices.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_discount_usage_customer_id'), 'discount_usage', ['customer_id'], unique=False)
    op.create_index(op.f('ix_discount_usage_discount_id'), 'discount_usage', ['discount_id'], unique=False)
    op.create_index(op.f('ix_discount_usage_invoice_id'), 'discount_usage', ['invoice_id'], unique=False)

    # 21. payments
    op.create_table(
        'payments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('payment_reference', sa.String(length=100), nullable=False),
        sa.Column('customer_id', sa.String(length=36), nullable=False),
        sa.Column('invoice_id', sa.String(length=36), nullable=True),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('payment_method', sa.String(length=50), server_default='credit_card', nullable=False),
        sa.Column('payment_date', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('status', sa.String(length=50), server_default='completed', nullable=False),
        sa.Column('gateway_transaction_id', sa.String(length=255), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['invoice_id'], ['invoices.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payments_customer_id'), 'payments', ['customer_id'], unique=False)
    op.create_index(op.f('ix_payments_gateway_transaction_id'), 'payments', ['gateway_transaction_id'], unique=False)
    op.create_index(op.f('ix_payments_payment_reference'), 'payments', ['payment_reference'], unique=True)
    op.create_index(op.f('ix_payments_status'), 'payments', ['status'], unique=False)

    # 22. payment_allocations
    op.create_table(
        'payment_allocations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('payment_id', sa.String(length=36), nullable=False),
        sa.Column('invoice_id', sa.String(length=36), nullable=False),
        sa.Column('amount_allocated', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('allocated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['invoice_id'], ['invoices.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['payment_id'], ['payments.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payment_allocations_invoice_id'), 'payment_allocations', ['invoice_id'], unique=False)
    op.create_index(op.f('ix_payment_allocations_payment_id'), 'payment_allocations', ['payment_id'], unique=False)


def downgrade() -> None:
    # Drop in reverse order of foreign keys
    op.drop_table('payment_allocations')
    op.drop_table('payments')
    op.drop_table('discount_usage')
    op.drop_table('discounts')
    op.drop_table('tax_rules')
    op.drop_table('invoice_items')
    op.drop_table('invoices')
    op.drop_table('subscription_items')
    op.drop_table('subscriptions')
    op.drop_table('quotation_items')
    op.drop_table('quotations')
    op.drop_table('quotation_templates')
    op.drop_table('plan_products')
    op.drop_table('plans')
    op.drop_table('product_variants')
    op.drop_table('products')
    op.drop_table('organization_members')
    op.drop_table('password_reset_tokens')
    op.drop_table('email_verification_tokens')
    op.drop_table('user_roles')
    op.drop_table('roles')
    op.drop_table('users')
