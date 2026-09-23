// src/api/controllers/productController.js
import * as productService from '../services/productService.js';

export async function listProducts(req, res) {
  try {
    const products = await productService.listProducts(req.user.tenant_id);
    return res.json({ success: true, data: products, error: null });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, error: error.message });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await productService.getProductById(
      req.user.tenant_id,
      req.params.id
    );
    return res.json({ success: true, data: product, error: null });
  } catch (error) {
    return res.status(404).json({ success: false, data: null, error: error.message });
  }
}

export async function createProduct(req, res) {
  try {
    const product = await productService.createProduct(req.user.tenant_id, req.body);
    return res.status(201).json({ success: true, data: product, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await productService.updateProduct(
      req.user.tenant_id,
      req.params.id,
      req.body
    );
    return res.json({ success: true, data: product, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const result = await productService.deleteProduct(
      req.user.tenant_id,
      req.params.id
    );
    return res.json({ success: true, data: result, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}

export async function reorderProducts(req, res) {
  try {
    const products = await productService.reorderProducts(
      req.user.tenant_id,
      req.body.products
    );
    return res.json({ success: true, data: products, error: null });
  } catch (error) {
    return res.status(400).json({ success: false, data: null, error: error.message });
  }
}