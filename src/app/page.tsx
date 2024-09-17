'use client'

import { logout } from '@/server/actions/auth'

const Page = () => {
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="text-white">so os cria entra aqui</div>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Page
