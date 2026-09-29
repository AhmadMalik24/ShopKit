// src/api/controllers/uploadController.js
import * as uploadService from '../services/uploadService.js';

export async function presignUpload(req, res) {
  try {
    const { filename, contentType, purpose } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'filename and contentType are required',
      });
    }

    const result = await uploadService.createSignedUploadUrl({
      tenantId: req.user.tenant_id,
      filename,
      contentType,
      purpose,
    });

    return res.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}

export async function deleteUpload(req, res) {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'path is required',
      });
    }

    // Ensure the path belongs to this tenant (security)
    if (!path.startsWith(`${req.user.tenant_id}/`)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Not authorized to delete this file',
      });
    }

    const result = await uploadService.deleteFile(path);
    return res.json({ success: true, data: result, error: null });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}