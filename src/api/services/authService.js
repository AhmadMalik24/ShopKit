// src/api/services/authService.js
import bcrypt from 'bcryptjs';
import models from '../../database/models/index.js';

const { User, Tenant } = models;

async function registerService({ name, email, password, store_name, whatsapp_number }) {
  // 1. Check if email already exists
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  // 2. Generate a unique slug from store name
  const baseSlug = store_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = baseSlug;
  let counter = 1;
  while (await Tenant.findOne({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // 3. Create the tenant (store)
  const tenant = await Tenant.create({
    name: store_name,
    slug,
    subscription_status: 'trial',
    subscription_plan: 'starter',
  });

  // 4. Hash the password
  const password_hash = await bcrypt.hash(password, 10);

  // 5. Create the user (store owner)
  const user = await User.create({
    tenant_id: tenant.id,
    email,
    password_hash,
    name,
    role: 'store_owner',
    whatsapp_number: whatsapp_number || null,
  });

  // 6. Update tenant with owner_id
  await tenant.update({ owner_id: user.id });

  // 7. Return user + tenant (no password)
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenant_id: tenant.id,
    },
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },
  };
}

async function loginService({ email, password }) {
  // 1. Find the user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Compare the password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // 3. Update last login timestamp
  await user.update({ last_login_at: new Date() });

  // 4. Return user info (no password)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenant_id: user.tenant_id,
  };
}

export { registerService, loginService };
    