import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Title from './Title';
import { testimonials } from '../assets/assets';
import StarRating from './StarRating';

const Testimonial = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const testimonialQuotes = [
        "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that Stay Villa provides. Their curated selection of hotels is unmatched.",
        "Stay Villa made our vacation unforgettable! The booking process was seamless, and the property exceeded all our expectations. Highly recommend for luxury travelers.",
        "Exceptional service from start to finish. Stay Villa's team went above and beyond to ensure our stay was perfect. We'll definitely be booking with them again!"
    ];

    const starRatings = [5, 4, 4.5];

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20'>
            <Title title="What Our Guests Say" subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world." />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12'>
                {testimonials.map((testimonial, index) => (
                    <motion.div 
                        key={testimonial.id} 
                        className='p-6 rounded-xl shadow cursor-pointer overflow-hidden relative'
                        onHoverStart={() => setHoveredCard(testimonial.id)}
                        onHoverEnd={() => setHoveredCard(null)}
                        animate={{
                            backgroundColor: hoveredCard === testimonial.id ? '#000000' : '#ffffff'
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <div className='flex items-center gap-3'>
                            <img className='w-12 h-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <motion.p 
                                    className='font-playfair text-xl'
                                    animate={{
                                        color: hoveredCard === testimonial.id ? '#ffffff' : '#000000'
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {testimonial.name}
                                </motion.p>
                                <motion.p 
                                    animate={{
                                        color: hoveredCard === testimonial.id ? '#d1d5db' : '#6b7280'
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {testimonial.location}
                                </motion.p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 mt-4'>
                           <StarRating rating={starRatings[index % starRatings.length]} />
                        </div>
                        <motion.p 
                            className='max-w-90 mt-4'
                            animate={{
                                color: hoveredCard === testimonial.id ? '#ffffff' : '#6b7280'
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            {testimonialQuotes[index % testimonialQuotes.length]}
                        </motion.p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Testimonial;