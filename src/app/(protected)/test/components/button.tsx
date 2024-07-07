"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const ButtonPage = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const handleSubmit = async () => {
        // TODO: Handle form submission
        console.log('Form submitted!')
        console.log('session', session)
        if(!session) return router.push('/sign-up')
    }

    return (
        <Button onClick={handleSubmit}>Click me</Button>
    )
}

export default ButtonPage
