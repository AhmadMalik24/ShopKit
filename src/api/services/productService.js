// src/api/services/productService.js
import models from '../../database/models/index.js';

const { Product } = models;

export async function listProducts(tenantId) {
  return await Product.findAll({
    where: { tenant_id: tenantId },
    order: [['display_order', 'ASC'], ['created_at', 'DESC']],
  });
}

export async function getProductById(tenantId, productId) {
  const product = await Product.findOne({
    where: { id: productId, tenant_id: tenantId },
  });
  if (!product) throw new Error('Product not found');
  return product;
}

export async function createProduct(tenantId, data) {
  let displayOrder = data.display_order;
  if (displayOrder === undefined || displayOrder === null) {
    const count = await Product.count({ where: { tenant_id: tenantId } });
    displayOrder = count;
  }

  return await Product.create({
    tenant_id: tenantId,
    name: data.name,
    description: data.description || null,
    price: data.price,
    image_urls: data.image_urls || [],
    category: data.category || null,
    is_available: data.is_available !== undefined ? data.is_available : true,
    display_order: displayOrder,
  });
}

export async function updateProduct(tenantId, productId, data) {
  const product = await Product.findOne({
    where: { id: productId, tenant_id: tenantId },
  });
  if (!product) throw new Error('Product not found');

  const updates = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.price !== undefined) updates.price = data.price;
  if (data.image_urls !== undefined) updates.image_urls = data.image_urls;
  if (data.category !== undefined) updates.category = data.category;
  if (data.is_available !== undefined) updates.is_available = data.is_available;
  if (data.display_order !== undefined) updates.display_order = data.display_order;

  await product.update(updates);
  return product;
}

export async function deleteProduct(tenantId, productId) {
  const product = await Product.findOne({
    where: { id: productId, tenant_id: tenantId },
  });
  if (!product) throw new Error('Product not found');

  await product.destroy();
  return { success: true };
}

export async function reorderProducts(tenantId, productsOrder) {
  const ids = productsOrder.map((p) => p.id);
  const owned = await Product.findAll({
    where: { id: ids, tenant_id: tenantId },
    attributes: ['id'],
  });

  if (owned.length !== ids.length) {
    throw new Error('One or more products do not belong to this tenant');
  }

  const transaction = await Product.sequelize.transaction();
  try {
    for (const item of productsOrder) {
      await Product.update(
        { display_order: item.display_order },
        { where: { id: item.id, tenant_id: tenantId }, transaction }
      );
    }
    await transaction.commit();
    return await listProducts(tenantId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}