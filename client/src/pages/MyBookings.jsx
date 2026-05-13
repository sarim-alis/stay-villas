import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {

    const { axios, getToken, user } = useAppContext();
    const [bookings, setBookings] = useState([]);

    // Dummy bookings data for testing
    const dummyBookings = [
        {
            _id: '1',
            room: {
                roomType: 'Luxury Room',
                images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800']
            },
            hotel: {
                name: 'Grand Palace Hotel',
                address: '123 Champs-Élysées, Paris, France'
            },
            checkInDate: '2024-06-15',
            checkOutDate: '2024-06-18',
            guests: 2,
            totalPrice: 3600,
            isPaid: true
        },
        {
            _id: '2',
            room: {
                roomType: 'Double Bed',
                images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800']
            },
            hotel: {
                name: 'Ocean View Resort',
                address: '456 Beach Road, Malé, Maldives'
            },
            checkInDate: '2024-07-20',
            checkOutDate: '2024-07-25',
            guests: 3,
            totalPrice: 4000,
            isPaid: false
        },
        {
            _id: '3',
            room: {
                roomType: 'Family Suite',
                images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800']
            },
            hotel: {
                name: 'Mountain Lodge',
                address: '789 Alpine Street, Zurich, Switzerland'
            },
            checkInDate: '2024-08-10',
            checkOutDate: '2024-08-15',
            guests: 4,
            totalPrice: 7500,
            isPaid: true
        }
    ];


    const fetchUserBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setBookings(data.bookings)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handlePayment = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                window.location.href = data.url
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user]);

    // Use dummy bookings if no bookings available from API
    const displayBookings = bookings.length > 0 ? bookings : dummyBookings;

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks.' align='left' />
            <div className="max-w-6xl mt-8 w-full text-gray-800">
                <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
                    <div className="w-1/3">Hotels</div>
                    <div className="w-1/3">Date & Timings</div>
                    <div className="w-1/3">Payment</div>
                </div>

                {displayBookings.map((booking) => (
                    <div key={booking._id} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t">
                        <div className="flex flex-col md:flex-row">
                            <img className="min-md:w-44 rounded shadow object-cover" src={booking.room.images[0]} alt="hotel-img" />
                            <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                                <p className="font-playfair text-2xl">
                                    {booking.hotel.name}
                                    <span className="font-inter text-sm"> ({booking.room.roomType})</span>
                                </p>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <img src={assets.locationIcon} alt="location-icon" />
                                    <span>{booking.hotel.address}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <img src={assets.guestsIcon} alt="guests-icon" />
                                    <span>Guests: {booking.guests}</span>
                                </div>
                                <p className="text-base">Total: ${booking.totalPrice}</p>
                            </div>
                        </div>

                        <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                            <div>
                                <p>Check-In:</p>
                                <p className="text-gray-500 text-sm">{new Date(booking.checkInDate).toDateString()}</p>
                            </div>
                            <div>
                                <p>Check-Out:</p>
                                <p className="text-gray-500 text-sm">{new Date(booking.checkOutDate).toDateString()}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-center pt-3">
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                                <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                                    {booking.isPaid ? "Paid" : "Unpaid"}
                                </p>
                            </div>
                            {!booking.isPaid && (
                                <button onClick={()=> handlePayment(booking._id)} className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
                                    Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyBookings