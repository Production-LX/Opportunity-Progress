const STATUS_MAPPING = {
    "allocated": "reserved",
    "reserved": "reserved",
    "mixed": "mixed",
    "confirmed": "prepared",
    "prepared": "prepared",
    "booked out": "bookedOut",  // Ensure correct case
    "part checked in": "partBookedIn",
    "checked in": "bookedIn"
};

export function calculateJobStats(items) {
    console.log("📊 Raw Items Before Processing:", items);

    return items.reduce(
        (stats, item) => {
            const quantity = parseInt(item.quantity, 10) || 0;
            const apiStatus = item.status_name.toLowerCase(); // Convert to lowercase
            const mappedStatus = STATUS_MAPPING[apiStatus];

            console.log(`🔹 API Returned: '${item.status_name}' → Normalized: '${apiStatus}' → Mapped to: '${mappedStatus}' - Quantity: ${quantity}`);

            if (mappedStatus) {
                stats[mappedStatus] += quantity;
            } else {
                console.warn(`⚠️ Unrecognized status '${item.status_name}', skipping item`, item);
            }

            stats.total += quantity;
            return stats;
        },
        { reserved: 0, prepared: 0, mixed: 0, bookedOut: 0, partBookedIn: 0, bookedIn: 0, total: 0 }
    );
}
