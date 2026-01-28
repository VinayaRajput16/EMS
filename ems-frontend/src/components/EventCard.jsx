import React from 'react';
import Badge from './Badge';

/**
 * EventCard Component - Specialized card for event listings
 * 
 * @param {string} title - Event title
 * @param {string} description - Event description
 * @param {string} date - Event date
 * @param {string} time - Event time
 * @param {string} location - Event location
 * @param {string} status - Event status ('upcoming' | 'ongoing' | 'completed' | 'cancelled')
 * @param {string} image - Event image URL
 * @param {number} attendees - Number of attendees
 * @param {string} category - Event category
 * @param {function} onClick - Click handler
 */
const EventCard = ({ 
  title,
  description,
  date,
  time,
  location,
  status = 'upcoming',
  image,
  attendees,
  category,
  onClick,
  className = '',
  ...props 
}) => {
  const statusConfig = {
    upcoming: { variant: 'primary', label: 'Upcoming' },
    ongoing: { variant: 'success', label: 'Live Now', dot: true },
    completed: { variant: 'neutral', label: 'Completed' },
    cancelled: { variant: 'error', label: 'Cancelled' }
  };
  
  return (
    <div 
      className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <Badge 
              variant={statusConfig[status].variant} 
              dot={statusConfig[status].dot}
              size="md"
            >
              {statusConfig[status].label}
            </Badge>
          </div>
          {category && (
            <div className="absolute top-3 left-3">
              <Badge variant="neutral" size="sm">
                {category}
              </Badge>
            </div>
          )}
        </div>
      )}
      
      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="space-y-2.5">
          {/* Date & Time */}
          {date && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{date}</span>
              {time && <span className="text-slate-400">•</span>}
              {time && <span>{time}</span>}
            </div>
          )}
          
          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{location}</span>
            </div>
          )}
          
          {/* Attendees */}
          {attendees !== undefined && (
            <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium">{attendees} attendees</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
