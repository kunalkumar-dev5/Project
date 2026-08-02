import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const MyAppointments = () => {

  const { backendUrl, token } = useContext(AppContext)

  const [appointments, setAppointments] = React.useState([])
  const months = [' ', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return ''

    const dateParts = String(slotDate).split('_')
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts
      const normalizedYear = Number(year)
      const actualYear = normalizedYear < 100 ? 2000 + normalizedYear : normalizedYear < 1000 ? 1900 + normalizedYear : normalizedYear
      return `${day} ${months[Number(month)] || month} ${actualYear}`
    }

    const fallbackParts = String(slotDate).split('-')
    if (fallbackParts.length === 3) {
      const [day, month, year] = fallbackParts
      const normalizedYear = Number(year)
      const actualYear = normalizedYear < 100 ? 2000 + normalizedYear : normalizedYear < 1000 ? 1900 + normalizedYear : normalizedYear
      return `${day} ${months[Number(month)] || month} ${actualYear}`
    }

    return slotDate
  }

  const slotTimeFormat = (slotTime) => {
    if (!slotTime) return ''
    return String(slotTime).toLowerCase()
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments((data.appointments || []).reverse())
      } else {
        toast.error(data.message || 'Failed to load appointments')
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pd-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((item, index) => {
          const doctorAddress = item?.docData?.address || {}
          const addressLine1 = doctorAddress.line1 ?? doctorAddress.address1 ?? ''
          const addressLine2 = doctorAddress.line2 ?? doctorAddress.address2 ?? ''

          return (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{addressLine1}</p>
                <p className='text-xs'>{addressLine2}</p>
                <p className='text-xs mt-1'><span className=' text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {slotTimeFormat(item.slotTime)}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
                <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default MyAppointments
