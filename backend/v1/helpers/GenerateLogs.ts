import getWeekDay from "./GetWeekDay"

export function generateDailyLogs(startDate: Date, endDate: Date) {
  const logs: { date: string; status: string; }[] = [];
    const date = new Date(startDate); // Clone startDate to avoid mutating it
    const currentDate = new Date(Date.UTC(date!.getFullYear(), date!.getMonth(), date!.getDate())) // Normalize to midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Normalize today's date to midnight UTC

    console.log("Start Date (UTC):", startDate.toISOString());
    console.log("End Date (UTC):", endDate.toISOString());
    console.log("Current Date (UTC):", currentDate.toISOString());
    console.log("Today's Date (UTC):", today.toISOString());

    // Loop until currentDate is less than or equal to endDate
    while (currentDate <= endDate) {
        // Increment the date by 1 day before pushing
        const logDate = new Date(currentDate); 
        logDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC

        const status = logDate < today ? "missed" : "task-pending"; // Determine status
        logs.push({ date: logDate.toISOString(), status });

        console.log(`Logged date: ${logDate.toISOString()} with status: ${status}`);

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setUTCHours(0, 0, 0, 0); // Normalize time after incrementing
    }

    console.log("Generated Daily Logs:", logs);
    return logs;
}

export function generateWeeklyLogs(startDate: Date, endDate: Date, frequency: string[]) {
    const logs: { date: string; status: string }[] = [];
    let currentDate = startDate // Clone startDate to avoid mutating it
    currentDate.setHours(0, 0, 0, 0); // Normalize to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

    console.log("Frequency:", frequency);
    console.log("Start Date:", startDate.toISOString());
    console.log("End Date:", endDate.toISOString());
    console.log("Today's Date:", today.toISOString());

    // Iterate through weeks
    while (currentDate <= endDate) {
        console.log("Processing week starting from:", currentDate.toISOString());

        // Iterate through each day of the week
        for (let i = 0; i < 7; i++) {
            const weekDay = getWeekDay(currentDate).toLowerCase(); // Get weekday (e.g., "wednesday")

            console.log("Current Date:", currentDate.toISOString(), "| Weekday:", weekDay);

            // Check if the day is within the frequency
            if (frequency.includes(weekDay) && currentDate >= startDate && currentDate <= endDate) {
                const status = currentDate < today ? "missed" : "task-pending"; // Set status based on today's date
                
                const utcDate = new Date(
                    Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
                  );
          
                  console.log("UTC date:", utcDate)

                logs.push({
                    date: utcDate.toISOString(),
                    status,
                });
                console.log(`Logged date: ${currentDate.toISOString()} with status: ${status}`);
            }

            // Move to the next day and normalize time
            currentDate.setDate(currentDate.getDate() + 1);
            currentDate.setHours(0, 0, 0, 0); // Reset time after incrementing
        }

        console.log("End of current week.");
    }

    console.log("Weekly logs for the specified range:", logs);
    return logs;
}

export function generateMonthlyLogs(
    startMonth: Date,
    endMonth: Date,
    frequency: string[]
  ): { date: string; status: string }[] {
    const logs: { date: string; status: string }[] = [];
  
    // Normalize `today` to UTC midnight for consistency
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Normalize to UTC midnight
  
    // Extract month and year from the start and end dates
    let currentMonth = startMonth.getMonth();
    let currentYear = startMonth.getFullYear();

    console.log("Frequency:", frequency);
    console.log("Start Date:", startMonth.toISOString());
    console.log("End Date:", endMonth.toISOString());
    console.log("Today's Date:", today.toISOString());
  
    const endMonthIndex = endMonth.getMonth();
    const endYear = endMonth.getFullYear();
  
    // Iterate over the months in the range
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonthIndex)) {
      const lastDayOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0)); // UTC last day
  
      // Iterate over the days of the current month
      for (let day = 1; day <= lastDayOfMonth.getUTCDate(); day++) {
        const currentDate = new Date(Date.UTC(currentYear, currentMonth, day)); // Create UTC date
  
        const dayOfMonth = day.toString(); // Get day of the month as string
  
        // Check if the day is in the frequency array
        if (frequency.includes(dayOfMonth)) {
          const status = currentDate < today ? "missed" : "pending"; // Compare as UTC
          logs.push({
            date: currentDate.toISOString(), // Format date as YYYY-MM-DD
            status,
          });
        }
      }
  
      // Move to the next month
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  
    return logs;
  }
  

  export function generateCustomDateLogs(selectedDates: string[]) {
    const logs: { date: string; status: string }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparisons
    console.log("Today's Date:", today.toISOString());

    selectedDates.forEach((input) => {
        console.log("Input Date: ", input)
        const date = new Date(input); // Convert to Date object
        if (isNaN(date.getTime())) {
            console.error("Invalid date encountered:", input);
            return; // Skip invalid dates
        }

        console.log("Processing selected date:", date);


        const status = date < today ? "missed" : "task-pending"; // Determine status
        logs.push({ date: date.toISOString(), status });

        console.log(`Logged date: ${date} with status: ${status}`);
    });

    console.log("Generated Custom Logs:", logs);
    return logs;
}


  

  
  

  
  
  
   
  