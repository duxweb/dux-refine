import { useTranslate } from '@refinedev/core'


interface EmptyWidgetProps {
  title?: string
  desc?: string
  type?: 'default' | 'simple'
}

export const EmptyWidget = ({title, desc, type = 'default'}: EmptyWidgetProps) => {
  const translate = useTranslate()
  return (
    <>
      {type == 'default' && <div className='flex gap-3 items-center'>
        <div className='flex-none'>
          <svg  className='w-12 h-12' viewBox="0 0 1489 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  width="200" height="200">
            <path d="M0 874.620304c0 82.486101 333.420718 149.379696 744.716694 149.379696s744.716694-66.908141 744.716695-149.379696-333.420718-149.379696-744.716695-149.379697S0 792.119657 0 874.620304z m0 0" className='fill-gray-5 dark:fill-gray-6'></path>
            <path d="M225.145893 316.082783h177.452025a38.559452 38.559452 0 0 1 34.632235 21.643329l58.457351 125.569125a38.573998 38.573998 0 0 0 34.632236 21.643329h430.888425a38.573998 38.573998 0 0 0 34.632235-21.643329l58.457351-125.569125a38.544907 38.544907 0 0 1 34.632236-21.643329h175.357509c21.643329 0 36.799477 17.308845 36.799477 41.133961v515.236318c0 21.643329-17.308845 41.133961-36.799477 41.133961H225.145893c-21.643329 0-36.799477-17.32339-36.799477-41.133961V355.049502c-2.167242-21.657874 15.156148-38.966719 36.799477-38.966719z m0 0" className='fill-gray-5 dark:fill-gray-6' opacity=".47" p-id="5549"></path>
            <path d="M1264.287496 928.728626H225.145893c-30.312297 0-56.29011-25.977813-56.29011-58.442806V355.049502c0-32.479539 25.977813-58.457351 56.29011-58.457351h177.452025a54.690132 54.690132 0 0 1 49.788383 32.479538l58.457352 125.569126c4.363574 6.487181 10.821664 10.821664 17.308845 10.821664h433.055667c6.487181 0 12.988906-4.363574 17.308845-10.821664l58.457351-125.569126a54.690132 54.690132 0 0 1 49.788384-32.479538h177.524751c30.312297 0 56.29011 25.977813 56.290109 58.457351v515.236318c0 32.464993-23.825116 58.442806-56.290109 58.442806z m-1039.141603-595.336998c-10.821664 0-19.490632 8.727149-19.490632 21.657874v515.236318c0 12.988906 8.727149 21.643329 19.490632 21.643329h1039.141603c10.821664 0 19.490632-8.654423 19.490632-21.643329V355.049502c0-12.988906-8.727149-21.657874-19.490632-21.657874H1086.762745c-6.487181 0-12.988906 4.363574-17.308845 10.821664l-58.457352 125.569126a54.690132 54.690132 0 0 1-49.788383 32.479539H528.225224a54.690132 54.690132 0 0 1-49.788384-32.479539l-58.457351-123.401884c-4.363574-6.487181-10.821664-10.821664-17.308845-10.821664h-177.452025z m0 0" className='fill-gray-5 dark:fill-gray-6'></path>
            <path d="M1281.610886 344.256928L1039.141603 45.468445c-4.363574-4.363574-8.727149-8.727149-15.156148-8.727149H465.447934a19.708811 19.708811 0 0 0-15.156148 6.487181l-242.469283 301.028451-28.145055-23.854206 242.469283-298.744848C432.982941 8.668968 448.124544 0 465.447934 0h558.537521c17.32339 0 34.632235 8.727149 43.301203 21.657874l242.469283 298.744848z m0 0" className='fill-gray-5 dark:fill-gray-6'></path>
          </svg>
        </div>
        <div className='flex-1'>
          <div className='text-primary'>{title || translate('empty.title')}</div>
          <div className='text-placeholder'>{desc || translate('empty.desc')}</div>
        </div>
      </div>}
      {type == 'simple' && <div className='flex flex-col gap-2 items-center'>
        <div>
          <svg  className='w-12 h-12' viewBox="0 0 1489 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  width="200" height="200">
            <path d="M0 874.620304c0 82.486101 333.420718 149.379696 744.716694 149.379696s744.716694-66.908141 744.716695-149.379696-333.420718-149.379696-744.716695-149.379697S0 792.119657 0 874.620304z m0 0" className='fill-gray-5 dark:fill-gray-6'></path>
            <path d="M225.145893 316.082783h177.452025a38.559452 38.559452 0 0 1 34.632235 21.643329l58.457351 125.569125a38.573998 38.573998 0 0 0 34.632236 21.643329h430.888425a38.573998 38.573998 0 0 0 34.632235-21.643329l58.457351-125.569125a38.544907 38.544907 0 0 1 34.632236-21.643329h175.357509c21.643329 0 36.799477 17.308845 36.799477 41.133961v515.236318c0 21.643329-17.308845 41.133961-36.799477 41.133961H225.145893c-21.643329 0-36.799477-17.32339-36.799477-41.133961V355.049502c-2.167242-21.657874 15.156148-38.966719 36.799477-38.966719z m0 0" className='fill-gray-5 dark:fill-gray-6' opacity=".47" p-id="5549"></path>
            <path d="M1264.287496 928.728626H225.145893c-30.312297 0-56.29011-25.977813-56.29011-58.442806V355.049502c0-32.479539 25.977813-58.457351 56.29011-58.457351h177.452025a54.690132 54.690132 0 0 1 49.788383 32.479538l58.457352 125.569126c4.363574 6.487181 10.821664 10.821664 17.308845 10.821664h433.055667c6.487181 0 12.988906-4.363574 17.308845-10.821664l58.457351-125.569126a54.690132 54.690132 0 0 1 49.788384-32.479538h177.524751c30.312297 0 56.29011 25.977813 56.290109 58.457351v515.236318c0 32.464993-23.825116 58.442806-56.290109 58.442806z m-1039.141603-595.336998c-10.821664 0-19.490632 8.727149-19.490632 21.657874v515.236318c0 12.988906 8.727149 21.643329 19.490632 21.643329h1039.141603c10.821664 0 19.490632-8.654423 19.490632-21.643329V355.049502c0-12.988906-8.727149-21.657874-19.490632-21.657874H1086.762745c-6.487181 0-12.988906 4.363574-17.308845 10.821664l-58.457352 125.569126a54.690132 54.690132 0 0 1-49.788383 32.479539H528.225224a54.690132 54.690132 0 0 1-49.788384-32.479539l-58.457351-123.401884c-4.363574-6.487181-10.821664-10.821664-17.308845-10.821664h-177.452025z m0 0" className='fill-gray-5 dark:fill-gray-6'></path>
            <path d="M1281.610886 344.256928L1039.141603 45.468445c-4.363574-4.363574-8.727149-8.727149-15.156148-8.727149H465.447934a19.708811 19.708811 0 0 0-15.156148 6.487181l-242.469283 301.028451-28.145055-23.854206 242.469283-298.744848C432.982941 8.668968 448.124544 0 465.447934 0h558.537521c17.32339 0 34.632235 8.727149 43.301203 21.657874l242.469283 298.744848z m0 0" className='fill-gray-5 dark:fill-gray-6'></path>
          </svg>
        </div>
        <div className='flex flex-col items-center'>
          <div className='text-placeholder'>{title !== undefined ? title : translate('empty.title')}</div>
        </div>
      </div>}
    </>
  )
}
