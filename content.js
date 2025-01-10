// Function to get the event elements
function getEvents() {
    return document.querySelectorAll('[data-eventchip]');
}

// Function to show a popup notification at the top right corner of the page
function showPopup(message, offset) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = `${10 + offset}px`;
    popup.style.right = '10px';
    popup.style.padding = '10px';
    popup.style.backgroundColor = 'lightblue';
    popup.style.color = 'black';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1000';
    document.body.appendChild(popup);

    // Fade out after 5 seconds
    setTimeout(() => {
        popup.style.transition = 'opacity 1s';
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }, 5000);
}

// Function to parse time strings and calculate event duration
function calculateEventDuration(timeString) {
    if (!timeString || !timeString.includes(' – ')) {
        console.warn(`Input: ${timeString} -> Output: `);
        return ' ';
    }
    let [start, end] = timeString.split(' – ');
    const parseTime = (time, defaultPeriod) => {
        const [hour, minutePart] = time.split(':');
        const minute = minutePart ? parseInt(minutePart.slice(0, -2)) : 0;
        const period = time.slice(-2) || defaultPeriod;
        let hourInt = parseInt(hour);
        if (period === 'pm' && hourInt !== 12) hourInt += 12;
        if (period === 'am' && hourInt === 12) hourInt = 0;
        return hourInt * 60 + minute;
    };
    const endPeriod = end.slice(-2);
    if (!start.includes('am') && !start.includes('pm')) {
        start += endPeriod;
    }
    const startMinutes = parseTime(start, endPeriod);
    const endMinutes = parseTime(end, endPeriod);
    const duration = endMinutes > startMinutes ? endMinutes - startMinutes : (24 * 60 - startMinutes) + endMinutes;

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    let durationText = '';
    if (hours > 0) {
        durationText += `${hours}h `;
    }
    if (minutes > 0) {
        durationText += `${minutes}m`;
    }
    const result = ` (${durationText.trim()})`;
    console.log(`Input: ${timeString} -> Output:${result}`);
    return result;
}

// Function to add duration text to the event elements
function addDurationText() {
    const events = getEvents();
    const oneHourOrMoreSelector = '.gVNoLb';
    const underOneHourSelector = '.EWOIrf';
    const underOneHourDurationSelector = '.XuJrye';

    events.forEach(event => {
        let timeFrameElement = '';
        let timeText = '';
        let durationText = '';

        // Handle events with one hour or more duration
        timeFrameElement = event.querySelector(oneHourOrMoreSelector);
        if (timeFrameElement) {
            timeText = timeFrameElement.textContent.split(' (')[0];
            durationText = calculateEventDuration(timeText);
            if (!timeFrameElement.textContent.includes(durationText)) {
                timeFrameElement.textContent = timeText + durationText;
            }
        }

        // Handle events with under one hour duration
        timeFrameElement = event.querySelector(underOneHourSelector);
        if (timeFrameElement) {
            timeFrameElement2 = event.querySelector(underOneHourDurationSelector);
            timeText = timeFrameElement2.textContent.split(',')[0];
            timeText = timeText.replace('to', '–');
            durationText = calculateEventDuration(timeText);
            if (!timeFrameElement.textContent.includes(durationText)) {
                timeFrameElement.textContent = timeText + durationText;
            }

        }
    });
}

// Function to observe changes in the DOM and re-apply duration text
function observeDOMChanges() {
    const observer = new MutationObserver(() => {
        addDurationText();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Run the functions when the content script is loaded
window.addEventListener('load', () => {
    const events = getEvents();
    showPopup('Google Calendar Duration Extension is loaded!', 0);
    showPopup(`Found ${events.length} events on this page.`, 50);
    addDurationText();
    observeDOMChanges();
});