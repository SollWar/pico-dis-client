'use client'

import { useUserDataStore } from '@/app/store/useUserDataStore'

const ProfilePage = () => {
  const { user } = useUserDataStore()

  return (
    <div>
      <h1>Привет, {user?.login}</h1>
    </div>
  )
}

export default ProfilePage
