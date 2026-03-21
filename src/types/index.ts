export interface User {
  id: string;
  username: string;
  email?: string;
  phoneNumber?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxAttendees: number;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  userId: string;
  username: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketCount: number;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
  cancelledAt?: string;
}
