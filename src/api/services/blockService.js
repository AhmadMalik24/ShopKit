// src/api/services/blockService.js
import models from '../../database/models/index.js';

const { Block } = models;

/**
 * List all blocks for a tenant (ordered by position)
 */
export async function listBlocks(tenantId) {
  return await Block.findAll({
    where: { tenant_id: tenantId },
    order: [['position', 'ASC']],
  });
}

/**
 * Get a single block scoped to the tenant
 */
export async function getBlockById(tenantId, blockId) {
  const block = await Block.findOne({
    where: { id: blockId, tenant_id: tenantId },
  });
  if (!block) throw new Error('Block not found');
  return block;
}

/**
 * Create a new block for a tenant
 */
export async function createBlock(tenantId, data) {
  // If no position is provided, append at the end
  let position = data.position;
  if (position === undefined || position === null) {
    const count = await Block.count({ where: { tenant_id: tenantId } });
    position = count;
  }

  return await Block.create({
    tenant_id: tenantId,
    type: data.type,
    position,
    config: data.config || {},
    styles: data.styles || {},
    animation: data.animation || { type: 'fadeIn', duration: 600, delay: 0 },
    is_visible: data.is_visible !== undefined ? data.is_visible : true,
  });
}

/**
 * Update an existing block
 */
export async function updateBlock(tenantId, blockId, data) {
  const block = await Block.findOne({
    where: { id: blockId, tenant_id: tenantId },
  });
  if (!block) throw new Error('Block not found');

  const updates = {};
  if (data.config !== undefined) updates.config = data.config;
  if (data.styles !== undefined) updates.styles = data.styles;
  if (data.animation !== undefined) updates.animation = data.animation;
  if (data.position !== undefined) updates.position = data.position;
  if (data.is_visible !== undefined) updates.is_visible = data.is_visible;

  await block.update(updates);
  return block;
}

/**
 * Delete a block
 */
export async function deleteBlock(tenantId, blockId) {
  const block = await Block.findOne({
    where: { id: blockId, tenant_id: tenantId },
  });
  if (!block) throw new Error('Block not found');

  await block.destroy();
  return { success: true };
}

/**
 * Reorder blocks by setting new positions
 */
export async function reorderBlocks(tenantId, blocksOrder) {
  // Validate that every block belongs to this tenant
  const ids = blocksOrder.map((b) => b.id);
  const owned = await Block.findAll({
    where: { id: ids, tenant_id: tenantId },
    attributes: ['id'],
  });

  if (owned.length !== ids.length) {
    throw new Error('One or more blocks do not belong to this tenant');
  }

  // Update positions inside a transaction
  const transaction = await Block.sequelize.transaction();
  try {
    for (const item of blocksOrder) {
      await Block.update(
        { position: item.position },
        { where: { id: item.id, tenant_id: tenantId }, transaction }
      );
    }
    await transaction.commit();

    // Return the refreshed list
    return await listBlocks(tenantId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}