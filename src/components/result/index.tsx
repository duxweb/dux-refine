import React, { FC } from 'react'
import clsx from 'clsx'
import './style.css'

const IconSuccess: FC = () => {
  return (
    <svg className='h-14 w-14' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        className='stroke-success-8 fill-success'
        d='M24 4L29.2533 7.83204L35.7557 7.81966L37.7533 14.0077L43.0211 17.8197L41 24L43.0211 30.1803L37.7533 33.9923L35.7557 40.1803L29.2533 40.168L24 44L18.7467 40.168L12.2443 40.1803L10.2467 33.9923L4.97887 30.1803L7 24L4.97887 17.8197L10.2467 14.0077L12.2443 7.81966L18.7467 7.83204L24 4Z'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17 24L22 29L32 19'
        className='stroke-white'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const IconInfo: FC = () => {
  return (
    <svg className='h-14 w-14' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z'
        className='stroke-brand-8 fill-brand'
        strokeWidth='4'
        strokeLinejoin='round'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M24 11C25.3807 11 26.5 12.1193 26.5 13.5C26.5 14.8807 25.3807 16 24 16C22.6193 16 21.5 14.8807 21.5 13.5C21.5 12.1193 22.6193 11 24 11Z'
        fill='#FFF'
      />
      <path
        d='M24.5 34V20H23.5H22.5'
        className='stroke-white'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M21 34H28'
        className='stroke-white'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const IconWarn: FC = () => {
  return (
    <svg className='h-14 w-14' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M24 5L2 43H46L24 5Z'
        className='stroke-warning-8 fill-warning'
        strokeWidth='4'
        strokeLinejoin='round'
      />
      <path d='M24 35V36' stroke='#FFF' strokeWidth='4' strokeLinecap='round' />
      <path d='M24 19.0005L24.0083 29' stroke='#FFF' strokeWidth='4' strokeLinecap='round' />
    </svg>
  )
}

const IconDanger: FC = () => {
  return (
    <svg className='h-14 w-14' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z'
        className='stroke-error-8 fill-error'
        strokeWidth='4'
        strokeLinejoin='round'
      />
      <path
        d='M29.6567 18.3432L18.343 29.6569'
        className='stroke-white'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M18.3433 18.3432L29.657 29.6569'
        className='stroke-white'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

interface ResultProps {
  title: React.ReactNode
  desc: React.ReactNode
  footer?: React.ReactNode
  type?: 'info' | 'success' | 'warn' | 'error' | 'text' | 'custom'
  show?: React.ReactNode
}

const Result: FC<ResultProps> = ({ title, desc, footer, type = 'info', show = 404 }) => {
  return (
    <div className='app-result'>
      <div className='app-result-inner'>
        <div className={clsx(['mb-4'])}>
          {type === 'info' && <IconInfo />}
          {type === 'success' && <IconSuccess />}
          {type === 'warn' && <IconWarn />}
          {type === 'error' && <IconDanger />}
          {type === 'text' && <div className='app-result-text'>{show}</div>}
          {type === 'custom' && show}
        </div>
        <div className='app-result-title'>{title}</div>
        <div className='app-result-desc'>{desc}</div>
        <div className='app-result-footer'>{footer}</div>
      </div>
    </div>
  )
}

export default Result
