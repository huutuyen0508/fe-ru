export const RESIDENT_PARKING_SESSION_KEY = 'smartpark-resident-parking-session'

export type ResidentParkingSession = {
  slotId: string
  floorId: 'B1' | 'B2'
  expiresAt: number
  vehiclePlate: string
}

export function getResidentParkingSession(): ResidentParkingSession | null {
  if (typeof window === 'undefined') return null
  try {
    const value = JSON.parse(window.localStorage.getItem(RESIDENT_PARKING_SESSION_KEY) || 'null') as Partial<ResidentParkingSession> | null
    if (!value?.slotId || (value.floorId !== 'B1' && value.floorId !== 'B2') || !value.expiresAt || value.expiresAt <= Date.now()) {
      if (value) clearResidentParkingSession()
      return null
    }
    return { ...value, vehiclePlate: value.vehiclePlate || '8ABC123' } as ResidentParkingSession
  } catch {
    clearResidentParkingSession()
    return null
  }
}

export function saveResidentParkingSession(session: ResidentParkingSession) {
  window.localStorage.setItem(RESIDENT_PARKING_SESSION_KEY, JSON.stringify(session))
}

export function clearResidentParkingSession() {
  window.localStorage.removeItem(RESIDENT_PARKING_SESSION_KEY)
}

export function getAssignedSpace(session: ResidentParkingSession | null) {
  return session ? `${session.slotId} · ${session.floorId} Floor` : null
}
