'use client'

import { useUserStore } from '@/app/store/useStore'

const ProfilePage = () => {
  const { user } = useUserStore()

  return (
    <div>
      <h1>Привет, {user?.login}</h1>
    </div>
  )
}

export default ProfilePage
