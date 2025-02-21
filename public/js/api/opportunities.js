import { API_HEADERS, API_BASE_URL } from "./config.js";

export async function fetchOpportunities() {
    try {
        const response = await fetch(`${API_BASE_URL}/opportunities?per_page=10&view_id=1000005`, {
            headers: API_HEADERS,
        });

        if (!response.ok) throw new Error(`Failed to fetch opportunities: ${response.status}`);

        const { opportunities = [] } = await response.json();
        return opportunities.slice(0, 10).map(opportunity => ({
            id: opportunity.id,
            name: opportunity.subject,
            client: opportunity.member?.name || "Unknown",
        }));
    } catch (error) {
        console.error("Error fetching opportunities:", error);
        return [];
    }
}
