'use client'

import { sendVerificationCode } from '@/server/actions/auth'
import { cn } from '@/shared/helpers'
import { encrypt } from '@/services/crypto'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Input from '@/components/input'

export default function Page() {
  const route = useRouter()

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState({ error: false, content: '' })

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault()

      const sendEmail = await sendVerificationCode(email)

      setMessage({
        error: Boolean(sendEmail?.error),
        content: sendEmail?.message
      })

      if (sendEmail?.error) return

      const encryptedEmail = await encrypt(email)

      const verifyUrl = '/verify/' + encryptedEmail
      route.push(verifyUrl)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col items-center gap-4"
    >
      <h1>Login</h1>
      <Input
        placeholder="email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit" className="float-right">
        enviar
      </button>

      <span
        className={cn(
          'text-xs text-green-500',
          message.error && 'text-red-700'
        )}
      >
        {message.content}
      </span>
    </form>
  )
}
