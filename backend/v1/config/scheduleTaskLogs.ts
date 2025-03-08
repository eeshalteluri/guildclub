import { MONGODB_URI } from "../config";
import Agenda, { Job } from "agenda";
import TaskLog from "../models/Tasklog";

const agenda = new Agenda({
    db: { address: MONGODB_URI!, collection: "agendaJobs" }
});

// ✅ Define the job **before** scheduling it
agenda.define("testLogs", async (job: Job) => {
    const { taskName, taskId } = job.attrs.data;
    console.log(`Agenda job triggered for task: ${taskName}`);
});

agenda.define("taskLog", async (job: Job) => {
    const { taskName, taskId } = job.attrs.data;
    console.log(`Agenda job triggered for task: ${taskName}`)

    try{
        const taskLog = await TaskLog.findOneAndUpdate({ taskId }, { $push: { logs: { date: new Date(), status: "task-pending" } } }, { new: true });
        console.log("Task log updated:", taskLog);
    } catch (error) {
        console.error("Error adding new task log:", error);
    }
})

const startAgenda = async () => {
    await agenda.start();
    console.log("✅ Agenda started...");
};

startAgenda().catch(error => console.error('❌ Failed to start agenda:', error));

export default agenda;
