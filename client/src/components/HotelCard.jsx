import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const HotelCard = ({room,index}) => {

    const { currency } = useAppContext();

    return (
        <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0, 0)} key={room._id} className='relative w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow'>
            <img src={room.images[0]} alt="hotel-img" draggable="false" className='w-full h-48 object-cover' />
            {index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>}
            <div className='p-3'>
                <div className='flex items-center justify-between mb-1'>
                    <p className='font-playfair text-lg font-medium text-gray-800 truncate'>{room.hotel.name}</p>
                    <div className='flex items-center gap-1 text-sm flex-shrink-0 ml-2'>
                        <img src={assets.starIconFilled} alt="star-icon" className='w-4 h-4' /> 4.5
                    </div>
                </div>
                <div className='flex items-center gap-1 text-xs text-gray-500 mb-3'>
                    <img src={assets.locationIcon} alt="location-icon" className='w-3 h-3' />
                    <span className='truncate'>{room.hotel.address}</span>
                </div>
                <div className='flex items-center justify-between'>
                    <p><span className='text-lg font-semibold text-gray-800'>{currency}{room.pricePerNight}</span><span className='text-sm text-gray-500'>/night</span></p>
                    <button className='px-3 py-1.5 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'>Book Now</button>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard