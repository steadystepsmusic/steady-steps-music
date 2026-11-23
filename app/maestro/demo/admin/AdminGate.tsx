'use client'

import { useEffect } from 'react'
import AdminApp from './AdminApp'
import { useIsAdmin } from '../useIsAdmin'

export default function AdminGate() {
  const admin = useIsAdmin()
  useEffect(() => { if (admin === false) window.location.replace('/maestro') }, [admin])
  return admin ? <AdminApp /> : <div className="min-h-screen bg-slate-50" />
}
