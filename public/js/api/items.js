import { API_BASE_URL, API_HEADERS } from "../api/config.js";

export async function fetchOpportunityItems(jobID) {
    try {
        const response = await fetch(`${API_BASE_URL}/opportunities/${jobID}/opportunity_items`, { headers: API_HEADERS });

        if (!response.ok) throw new Error(`Failed to fetch items for job ${jobID}: ${response.status}`);

        const data = await response.json();

        console.log(`📦 Items for Job ${jobID}:`, data.opportunity_items); // Debug log

        return data.opportunity_items.filter(item => item.opportunity_item_type_name === "Principal");
    } catch (error) {
        console.error(`❌ Error fetching items for job ${jobID}:`, error);
        return [];
    }
}
