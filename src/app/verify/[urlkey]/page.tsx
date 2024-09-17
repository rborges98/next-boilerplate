'use client'

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/input-otp'
import { signIn, verifyCode } from '@/server/actions/auth'
import { cn } from '@/shared/helpers'
import { decrypt } from '@/services/crypto'
import { redirect, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const router = useRouter()
  const { urlkey } = useParams()

  const [code, setCode] = useState('')
  const [message, setMessage] = useState({ error: false, content: '' })

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault()

      const email = await decrypt(urlkey as string)

      const verify = await verifyCode(email, code)

      setMessage({ error: verify.error, content: verify.message })

      if (verify.error) return

      await signIn(email)

      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col items-center gap-4"
    >
      <h1>Código</h1>
      <InputOTP maxLength={6} onChange={(value) => setCode(value)}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

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
