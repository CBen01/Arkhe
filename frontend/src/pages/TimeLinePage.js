import React from "react";
import TimeMap from "./TimeMap";

const events = [
    {
        id: 1,
        date: "2025-07-10",
        title: "Character Event Wish: Furina",
        type: "Character Banner",
        color: "blue",
        icon: "💧"
    },
    {
        id: 2,
        date: "2025-07-15",
        title: "Main Story Quest - Fontaine Finale",
        type: "Story Event",
        color: "purple",
        icon: "📜"
    },
    {
        id: 3,
        date: "2025-07-18",
        title: "Weapon Banner: Splendor of Tranquil Waters",
        type: "Weapon Banner",
        color: "orange",
        icon: "🗡️"
    },
];


function TimelinePage() {
    return (
        <div>
            <TimeMap events={events} />
        </div>
    );
}

export default TimelinePage;
