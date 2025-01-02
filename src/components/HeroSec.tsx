import Image from 'next/image'
import React from 'react'
import CardSec from './Card'

export default function HeroSec() {
  return (
    <div className='mt-10'>
      <div className='mx-4 md:mx-10 space-y-4'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold '>Supercharge your wardrobe</h1>
        <p className='text-sm text-gray-600 '>Discover the latest trends. Shop the hottest styles. Elevate your look.</p>
      </div>
      <div className='flex gap-x-4 justify-center flex-wrap mb-5'>
        <Image
          src="/images/Rectangle_1-removebg-preview.png"
          alt='image 1'
          height={1000}
          width={1000}
          className='w-[22rem] lg:w-[28rem]'
        />
        <Image
          src="/images/Rectangle_2-removebg-preview.png"
          alt='image 2'
          height={1000}
          width={1000}
          className='w-[22rem] lg:w-[28rem] hidden md:block'
        />
      </div>
      <CardSec />
    </div>
  )
}
