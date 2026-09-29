// src/api/services/uploadService.js
import crypto from 'crypto';
import supabase, { BUCKET } from '../../integrations/supabase.js';


/**
 * Generate a presigned upload URL for direct-to-Supabase uploads.
 * The frontend PUTs the file to this URL; nothing passes through our backend.
 */
export async function createSignedUploadUrl({
    tenantId,
    filename,
    contentType,
    purpose = 'general',
}) {
    // Sanitize inputs
    const ext = filename.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
    const random = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const safePurpose = purpose.replace(/[^a-z0-9-]/gi, '') || 'general';

    // Path structure: tenant/purpose/timestamp-random.ext
    const path = `${tenantId}/${safePurpose}/${timestamp}-${random}.${ext}`;

    // Ask Supabase for a signed upload URL
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUploadUrl(path, {
            upsert: false,
        });

    if (error) {
        throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    // Build the public URL — what the frontend saves to the product/block record
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return {
        uploadUrl: data.signedUrl,
        token: data.token,
        path,
        publicUrl: publicData.publicUrl,
        expiresIn: 3600,
    };
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(path) {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(`Failed to delete file: ${error.message}`);
    return { success: true };
}