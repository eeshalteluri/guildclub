function getWeekDay(date: Date) {
    const dateField = new Date(date)
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const dayIndex = dateField.getDay()
    return weekdays[dayIndex]
}

export default getWeekDay