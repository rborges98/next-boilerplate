'use server'

import connectToDatabase from '@/server/db'
import { generateVerificationCode } from '@/shared/helpers'
import verificationCode from '../db/models/verificationCode'
import { redirect } from 'next/navigation'
import token from '@/services/jwt'
import cookies from '@/services/cookies'
import { encrypt } from '@/services/crypto'

type ActionResponse = { error?: any; message: string }

export const sendVerificationCode = async (
  email: string
): Promise<ActionResponse> => {
  try {
    await connectToDatabase()

    const code = generateVerificationCode()

    let user = await verificationCode.findOne({ email })

    if (!user) {
      user = new verificationCode({ email, verificationCode: code })
    } else {
      user.verificationCode = code
    }

    await sendEmail(email, code)

    await user.save()

    return JSON.parse(
      JSON.stringify({ message: 'E-mail enviado com sucesso!' })
    )
  } catch (error) {
    console.log(error)
    return JSON.parse(
      JSON.stringify({
        error: error,
        message: 'ocorreu um erro durante o envio do email'
      })
    )
  }
}

const sendEmail = async (email: string, emailContent: string) => {
  const response = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer mlsn.dec9c620d746aae66a807bbf66a9559c57acc86ebe8bddde0967ee073714e980`
    },
    body: JSON.stringify({
      from: {
        email: 'MS_zHhZXA@trial-o65qngkqvxjgwr12.mlsender.net',
        name: 'Your Name'
      },
      to: [
        {
          email: email,
          name: 'Recipient Name'
        }
      ],
      subject: 'seu codigo',
      text: emailContent
    })
  })

  if (!response.ok) {
    throw new Error(`Error sending email: ${response.statusText}`)
  }
}

export const verifyCode = async (
  email: string,
  code: string
): Promise<ActionResponse> => {
  try {
    await connectToDatabase()

    const user = await verificationCode.findOne({ email })

    const isCodeCheck = code === user.verificationCode

    return JSON.parse(
      JSON.stringify({
        error: !isCodeCheck,
        message: isCodeCheck ? 'Código verificado.' : 'Código incorreto.'
      })
    )
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        error: error,
        message:
          'Ocorreu um erro durante a verificaçâo do código. Tente novamente mais tarde.'
      })
    )
  }
}

export const signIn = async (email: string) => {
  try {
    const accessToken = await token.create('accessToken', email)
    const refreshToken = await token.create('refreshToken', email)

    const userEmail = await encrypt(email)

    const refreshTokenContent = JSON.stringify({
      token: refreshToken,
      user: userEmail
    })

    cookies.set('accessToken', accessToken as string, {
      maxAge: 15 * 60 // 15 minutos
    })

    cookies.set('refreshToken', refreshTokenContent, {
      maxAge: 7 * 24 * 60 * 60 // 7 dias
    })
  } catch (error) {
    console.log(error)
  }
}

export const logout = async () => {
  cookies.delete('accessToken')
  cookies.delete('refreshToken')
  redirect('/login')
}
