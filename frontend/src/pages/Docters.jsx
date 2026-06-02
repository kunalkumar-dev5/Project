import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const specialityList = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Gastroenterologist',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const Docters = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const [filterDoc, setFilterDoc] = useState([])

  const { doctors } = useContext(AppContext)

  useEffect(() => {
    if (!doctors || doctors.length === 0) {
      setFilterDoc([])
      return
    }

    if (!speciality) {
      setFilterDoc(doctors)
      return
    }

    const normalizedSpeciality = speciality.replace(/-/g, ' ').toLowerCase()
    const filtered = doctors.filter((doc) =>
      doc.speciality.toLowerCase().includes(normalizedSpeciality)
    )
    setFilterDoc(filtered)
  }, [doctors, speciality])

  return (
    <div className='py-8'>
      <p className='text-gray-600'>Browse through the doctors speciality.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          {specialityList.map((item) => {
            const slug = slugify(item)
            const isActive = speciality === slug
            return (
              <p
                key={item}
                onClick={() =>
                  isActive ? navigate('/doctors') : navigate(`/doctors/${slug}`)
                }
                className={`w-[94vw] sm:w-auto border border-gray-300 rounded-xl bg-white px-3 py-1.5 pr-16 transition-all cursor-pointer ${isActive ? 'bg-indigo-100 text-black' : ''}`}
              >
                {item}
              </p>
            )
          })}
        </div>

        <div className='w-full grid grid-cols-auto gap-6 '>
          {filterDoc.length === 0 ? (
            <p className='text-gray-600'>No doctors found for this speciality.</p>
          ) : (
            filterDoc.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className='group overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer'
              >
                <img
                  className='h-64 w-full object-cover bg-blue-50'
                  src={item.image}
                  alt={item.name}
                />
                <div className='p-5'>
                  <div className='mb-3 flex items-center gap-2 text-sm text-green-500'>
                    <span className='h-2 w-2 rounded-full bg-green-500' />
                    <span>Available</span>
                  </div>
                  <h2 className='text-lg font-semibold text-gray-900'>{item.name}</h2>
                  <p className='text-sm text-gray-600'>{item.speciality}</p>
                  <p className='mt-2 text-sm text-gray-500'>
                    {item.degree} • {item.experience}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Docters
