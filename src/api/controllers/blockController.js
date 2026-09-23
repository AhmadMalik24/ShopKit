// src/api/controllers/blockController.js
import * as blockService from '../services/blockService.js';

export async function listBlocks(req, res) {
  try {
    const blocks = await blockService.listBlocks(req.user.tenant_id);
    return res.json({ success: true, data: blocks, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: error.message });
  }
}

export async function getBlock(req, res) {
  try {
    const block = await blockService.getBlockById(req.user.tenant_id, req.params.id);
    return res.json({ success: true, data: block, error: null });
  } catch (error) {
    return res.status(404).json({ success: false, data: null, error: error.message });
  }
}

export async function createBlock(req, res) {
  try {
    const block = await blockService.createBlock(req.user.tenant_id, req.body);
    return res.status(201).json({ success: true, data: block, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}

export async function updateBlock(req, res) {
  try {
    const block = await blockService.updateBlock(
      req.user.tenant_id,
      req.params.id,
      req.body
    );
    return res.json({ success: true, data: block, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}

export async function deleteBlock(req, res) {
  try {
    const result = await blockService.deleteBlock(req.user.tenant_id, req.params.id);
    return res.json({ success: true, data: result, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}

export async function reorderBlocks(req, res) {
  try {
    const blocks = await blockService.reorderBlocks(
      req.user.tenant_id,
      req.body.blocks
    );
    return res.json({ success: true, data: blocks, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}