// src/api/controllers/orderController.js
import * as orderService from '../services/orderService.js';

export async function createOrder(req, res) {
  try {
    const result = await orderService.createOrder(req.tenant.id, req.body);
    return res.status(201).json({ success: true, data: result, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}

export async function listOrders(req, res) {
  try {
    const orders = await orderService.listOrders(req.user.tenant_id);
    return res.json({ success: true, data: orders, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: error.message });
  }
}

export async function getOrder(req, res) {
  try {
    const order = await orderService.getOrderById(
      req.user.tenant_id,
      req.params.id
    );
    return res.json({ success: true, data: order, error: null });
  } catch (error) {
    return res.status(404).json({ success: false, data: null, error: error.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const order = await orderService.updateOrderStatus(
      req.user.tenant_id,
      req.params.id,
      req.body.status
    );
    return res.json({ success: true, data: order, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}