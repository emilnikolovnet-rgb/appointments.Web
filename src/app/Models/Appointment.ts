interface Appointment {
    id: number,
    firstName: string,
    lastName: string,
    scheduledDate: Date,
    additionalInfo: string | null,
    lastUpdatedDate: Date
}