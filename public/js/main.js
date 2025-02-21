import { fetchOpportunities } from "./api/opportunities.js";
import { fetchOpportunityItems } from "./api/items.js";
import { calculateJobStats } from "./utils/jobUtils.js";
import { renderJob, updateJobBars } from "./ui/dom.js"; // Add updateJobBars import


let cachedOpportunities = [];

async function updateJobList() {
    cachedOpportunities = await fetchOpportunities();

    for (const job of cachedOpportunities) {
        const items = await fetchOpportunityItems(job.id);
        const stats = calculateJobStats(items);

        console.log(`📌 Final Stats for Job ${job.id}:`, stats); // Debug log

        renderJob(job, stats);
    }
}

(async function initialize() {
    await updateJobList();
})();
