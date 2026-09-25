// src/api/constants/orderStatusFlow.js

export const ORDER_STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export const FINAL_STATUSES = ['delivered', 'cancelled'];

export function getAllowedNextStatuses(currentStatus) {
  return ORDER_STATUS_FLOW[currentStatus] || [];
}

export function isValidTransition(fromStatus, toStatus) {
  return getAllowedNextStatuses(fromStatus).includes(toStatus);
}

export function isFinalStatus(status) {
  return FINAL_STATUSES.includes(status);
}