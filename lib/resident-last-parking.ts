export const RESIDENT_LAST_PARKING_KEY = 'smartpark-resident-last-parking'
export type ResidentLastParking = { slotId: string; floorId: 'B1' | 'B2'; vehiclePlate: string; confirmedAt: number }

export function getResidentLastParking(): ResidentLastParking | null {
  if (typeof window === 'undefined') return null
  try {
    const value = JSON.parse(localStorage.getItem(RESIDENT_LAST_PARKING_KEY) || 'null')
    return value?.slotId && (value.floorId === 'B1' || value.floorId === 'B2') && value.vehiclePlate ? value : null
  } catch { return null }
}

export function saveResidentLastParking(value: ResidentLastParking) {
  localStorage.setItem(RESIDENT_LAST_PARKING_KEY, JSON.stringify(value))
}
