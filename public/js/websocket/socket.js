import { renderJob } from "../ui/dom.js";
import { fetchOpportunityItems } from "../api/items.js";
import { calculateJobStats } from "../utils/jobUtils.js";

const SOCKET_URL = "http://localhost:8003"; // Change for production

export function setupWebSocket(cachedOpportunities) {
    const socket = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
    });

    socket.on("opportunities_update", async (newOpportunities) => {
        console.log("🔄 Live update received:", newOpportunities);

        for (const job of newOpportunities) {
            const cachedJob = cachedOpportunities.find(cached => cached.id === job.id);

            if (!cachedJob || JSON.stringify(cachedJob) !== JSON.stringify(job)) {
                // Fetch latest stats
                const items = await fetchOpportunityItems(job.id);
                const stats = calculateJobStats(items);

                // Render updated job with correct stats
                renderJob(job, stats);
            }
        }

        cachedOpportunities.length = 0;
        cachedOpportunities.push(...newOpportunities);
    });

    socket.on("connect", () => console.log("✅ Connected to WebSocket"));
    socket.on("disconnect", () => console.warn("❌ WebSocket disconnected"));
}
