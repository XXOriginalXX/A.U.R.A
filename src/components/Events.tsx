import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, ExternalLink, Loader2 } from "lucide-react";
import axios from "axios";
import Papa from "papaparse";

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  registrationLink?: string;
  type: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const csvUrl = "https://raw.githubusercontent.com/XXOriginalXX/Events-A.U.R.A/main/Events.csv";
        const response = await axios.get(csvUrl);

        Papa.parse<Event>(response.data, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => {
            return header.trim().toLowerCase();
          },
          transform: (value) => {
            return value.trim();
          },
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("CSV Parsing Errors:", results.errors);
              setError("Failed to parse some events data.");
            }
            
            const validEvents = results.data
              .filter(event => 
                event.id && 
                event.title && 
                event.date && 
                event.venue && 
                event.type
              )
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setEvents(validEvents);
            setError(null);
          },
          error: (error) => {
            console.error("CSV Parsing Error:", error.message);
            setError("Failed to parse events data.");
          },
        });
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-8">College Events</h2>

      {events.length === 0 ? (
        <div className="text-center text-gray-400 mt-12">
          <p>No upcoming events at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors relative ${
                event.registrationLink ? 'hover:shadow-lg hover:shadow-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${event.type.toLowerCase() === "academic" ? "bg-blue-900 text-blue-200" :
                        event.type.toLowerCase() === "cultural" ? "bg-purple-900 text-purple-200" :
                        event.type.toLowerCase() === "technical" ? "bg-green-900 text-green-200" :
                        "bg-gray-800 text-gray-200"}
                    `}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1).toLowerCase()}
                    </span>
                    {event.registrationLink && (
                      <span className="text-xs text-blue-400 animate-pulse">Registration Open</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-400 mb-4">{event.description}</p>

                  <div className="grid gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(event.registrationLink, '_blank');
                      }}
                      className="mt-6 inline-flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors group"
                    >
                      <span>Register for Event</span>
                      <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;