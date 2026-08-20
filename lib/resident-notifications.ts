export const RESIDENT_NOTIFICATIONS_KEY = 'smartpark-resident-notifications'
export const RESIDENT_NOTIFICATIONS_EVENT = 'smartpark-notifications-updated'

export type ResidentNotificationType = 'parking_reserved' | 'parking_expired' | 'vehicle_registered' | 'guest_pass_created'
export type ResidentNotification = { id: string; type: ResidentNotificationType; title: string; message: string; createdAt: number; read: boolean }

export function getResidentNotifications(): ResidentNotification[] {
  if (typeof window === 'undefined') return []
  try {
    const value = JSON.parse(localStorage.getItem(RESIDENT_NOTIFICATIONS_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch { return [] }
}

export function addResidentNotification(notification: Omit<ResidentNotification, 'id' | 'createdAt' | 'read'> & { id?: string; createdAt?: number }) {
  if (typeof window === 'undefined') return null
  const current = getResidentNotifications()
  const next = { ...notification, id: notification.id || `${notification.type}-${notification.createdAt || Date.now()}`, createdAt: notification.createdAt || Date.now(), read: false }
  if (current.some((item) => item.id === next.id)) return current.find((item) => item.id === next.id) || null
  localStorage.setItem(RESIDENT_NOTIFICATIONS_KEY, JSON.stringify([next, ...current].slice(0, 50)))
  window.dispatchEvent(new CustomEvent(RESIDENT_NOTIFICATIONS_EVENT, { detail: next }))
  return next
}

export function markResidentNotificationRead(id: string) {
  const next = getResidentNotifications().map((item) => item.id === id ? { ...item, read: true } : item)
  localStorage.setItem(RESIDENT_NOTIFICATIONS_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(RESIDENT_NOTIFICATIONS_EVENT))
}

export function markAllResidentNotificationsRead() {
  const next = getResidentNotifications().map((item) => ({ ...item, read: true }))
  localStorage.setItem(RESIDENT_NOTIFICATIONS_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(RESIDENT_NOTIFICATIONS_EVENT))
}

export function removeResidentNotification(id: string) {
  localStorage.setItem(RESIDENT_NOTIFICATIONS_KEY, JSON.stringify(getResidentNotifications().filter((item) => item.id !== id)))
  window.dispatchEvent(new Event(RESIDENT_NOTIFICATIONS_EVENT))
}

export function formatNotificationAge(createdAt: number) {
  const minutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000))
  return minutes < 1 ? 'Vừa xong' : `${minutes} phút trước`
}
