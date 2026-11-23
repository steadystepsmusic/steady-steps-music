'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../live/data'

// The admin demo is Nik's design sandbox, not for prospective teachers (Nik, 2026-11-23:
// "i may want to be able to iterate on it, but not the public view"). It opens for a
// signed-in admin in Maestro, or anyone on the local dev server.
export function useIsAdmin(): boolean | null {
  const [admin, setAdmin] = useState<boolean | null>(process.env.NODE_ENV === 'development' ? true : null)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return
    if (!supabase) { setAdmin(false); return }
    let live = true
    supabase.auth.getSession().then(async ({ data }) => {
      const email = data.session?.user.email
      if (!email) { if (live) setAdmin(false); return }
      const { data: t } = await supabase!.from('teachers').select('is_admin').ilike('email', email).maybeSingle()
      if (live) setAdmin(Boolean(t?.is_admin))
    })
    return () => { live = false }
  }, [])
  return admin
}
