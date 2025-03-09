import * as z from "zod";

const taskSchema = z.object({
    taskName: z.string().min(1, "Task name is required"),
    description: z.string().optional(),
    frequencyType: z.enum(["daily", "weekly", "monthly", "custom"], {
      errorMap: () => ({ message: "Please select a frequency" }),
    }),
    taskType: z.enum(["AT", "NT"]),
    from:  z.date(),  // Allows either string or Date for 'from'
    end: z.date().nullable().optional(),   // End date is optional and can be null
    accountabilityPartner: z
      .object({
        name: z.string(),
        username: z.string(),
      })
      .optional(),
    frequency: z.array(z.union([z.string(), z.date()])).optional(), // Frequency can be an array of strings or Dates
  })
  .refine(
      (data) => data.taskType === "NT" || (data.taskType === "AT" && data.accountabilityPartner?.username),
      {
        message: "Accountability partner is required for 'Accountable' tasks",
        path: ["accountabilityPartner"],
      }
    )
    .refine(
      (data) =>
        data.frequencyType === "daily" || (data.frequency && data.frequency.length > 0),
      {
        message: "Frequency cannot be empty for the selected frequency type",
        path: ["frequency"],
      }
    )
    .refine((data) => {
      if (data.end && data.from) {
        return data.end >= data.from;
      }
      return true; // If the end date is not provided, skip this check
    }, {
      message: "End date must be greater than the start date",
      path: ["end"],
    })

  export default taskSchema