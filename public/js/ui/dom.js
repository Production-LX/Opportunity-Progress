export function updateJobBars(jobElement, stats) {
    const total = stats.total || 1;
    const barContainer = jobElement.querySelector(".barContainer");

    const barStyles = {
        reserved: "1px solid rgb(0, 0, 0)",
        prepared: "1px solid rgb(34, 117, 52)",
        mixed: "1px solid rgb(40, 40, 40)",
        bookedOut: "1px solid rgb(117, 34, 34)",
        partBookedIn: "1px solid rgb(77, 34, 117)",
        bookedIn: "1px solid rgb(34, 85, 117)",
    };

    Object.entries(barStyles).forEach(([key, borderStyle]) => {
        const bar = barContainer.querySelector(`.${key}`);
        if (bar) {
            const widthPercentage = (stats[key] / total) * 100;
            bar.style.width = `${widthPercentage}%`;
            bar.style.border = widthPercentage === 0 ? "0px" : borderStyle;
            bar.style.borderTop = "none";
            bar.style.borderBottom = "none";
        }
    });
}



export function renderJob(job, stats) {
    const container = document.getElementById("job-list");

    let jobElement = document.getElementById(job.id);
    if (!jobElement) {
        jobElement = document.createElement("div");
        jobElement.id = job.id;
        jobElement.className = "job";
        jobElement.innerHTML = `
            <h1>${job.name}</h1>
            <p>${job.client}</p>
            <div class="barContainer">
                <div class="bookedIn"></div>
                <div class="partBookedIn"></div>
                <div class="bookedOut"></div>
                <div class="mixed"></div>
                <div class="prepared"></div>
                <div class="reserved"></div>
            </div>
        `;
        container.appendChild(jobElement);
    }

    // Update the job's progress bars
    updateJobBars(jobElement, stats);
}