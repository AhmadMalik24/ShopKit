// src/api/services/orderService.js
import models, { sequelize } from '../../database/models/index.js';

const { Order, OrderItem, Product, Tenant } = models;

/**
 * Generate a unique order number like "SK-94021"
 */
async function generateOrderNumber(tenantId) {
    const count = await Order.count({ where: { tenant_id: tenantId } });
    const baseNumber = 94000 + count + 1;
    return `SK-${baseNumber}`;
}

/**
 * Public — customer places an order from the storefront.
 * Tenant is resolved by the middleware (from domain or slug).
 */
export async function createOrder(tenantId, data) {
    // 1. Validate products belong to this tenant and are available
    const productIds = data.items.map((i) => i.product_id);
    const products = await Product.findAll({
        where: { id: productIds, tenant_id: tenantId },
    });

    if (products.length !== productIds.length) {
        throw new Error('One or more products are invalid');
    }

    // 2. Calculate totals
    let subtotal = 0;
    const itemsPayload = [];

    for (const item of data.items) {
        const product = products.find((p) => p.id === item.product_id);
        if (!product.is_available) {
            throw new Error(`Product "${product.name}" is not available`);
        }

        const lineTotal = Number(product.price) * item.quantity;
        subtotal += lineTotal;

        itemsPayload.push({
            tenant_id: tenantId,
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            quantity: item.quantity,
            subtotal: lineTotal,
        });
    }

    // 3. Transaction: create order + items
    const transaction = await sequelize.transaction();
    try {
        const orderNumber = await generateOrderNumber(tenantId);

        const order = await Order.create(
            {
                tenant_id: tenantId,
                order_number: orderNumber,
                customer_name: data.customer_name,
                customer_phone: data.customer_phone,
                delivery_address: data.delivery_address || null,
                delivery_type: data.delivery_type || 'local_delivery',
                status: 'pending',
                subtotal,
                delivery_fee: 0,
                total_amount: subtotal,
                payment_method: data.payment_method || 'cod',
                payment_status: 'pending',
                notes: data.notes || null,
            },
            { transaction }
        );

        // Attach order_id to items and create them
        const itemsWithOrderId = itemsPayload.map((item) => ({
            ...item,
            order_id: order.id,
        }));

        const createdItems = await OrderItem.bulkCreate(itemsWithOrderId, { transaction });
        await transaction.commit();

        return {
            order: {
                id: order.id,
                order_number: order.order_number,
                total_amount: order.total_amount,
                status: order.status,
            },
            items: createdItems,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}



/**
 * Store owner — list all orders for their tenant
 */
export async function listOrders(tenantId) {
    return await Order.findAll({
        where: { tenant_id: tenantId },
        order: [['created_at', 'DESC']],
        include: [
            {
                model: OrderItem,
                as: 'items',
            },
        ],
    });
}

/**
 * Store owner — get one order with items
 */
export async function getOrderById(tenantId, orderId) {
    const order = await Order.findOne({
        where: { id: orderId, tenant_id: tenantId },
        include: [
            {
                model: OrderItem,
                as: 'items',
            },
        ],
    });
    if (!order) throw new Error('Order not found');
    return order;
}

/**
 * Store owner — update order status
 */
export async function updateOrderStatus(tenantId, orderId, status) {
    const order = await Order.findOne({
        where: { id: orderId, tenant_id: tenantId },
    });
    if (!order) throw new Error('Order not found');

    await order.update({ status });

    // If marked delivered, mark payment as paid
    if (status === 'delivered' && order.payment_method === 'cod') {
        await order.update({ payment_status: 'paid' });
    }

    return order;
}