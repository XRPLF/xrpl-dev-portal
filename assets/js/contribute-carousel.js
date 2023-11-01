const events = [
    {
        name: "Q3 2023 Ripple XRP Meetup",
        description: "Join your fellow Ripple XRP Enthusiasts for a 90-minute discussion. Topics: XRP, Flare, XRPL, Ripple (Company), General Crypto QA.",
        type: "meetup",
        link: "https://www.meetup.com/ripple-xrp-community/events/292740612",
        location: "Online",
        date: "July 13, 2023",
        image: "Virtual-Event.png",
        end_date: "July 13, 2023"
    },
    {
        name: "XRPL Toronto Meetup",
        description: "Prepare for an evening of XRPL Toronto Meetup – a celebration of discovery and connection. Join enthusiasts, innovators, and developers for inspiring talks, conversations, and learning. All are welcome, from seasoned developers to curious newcomers.",
        type: "meetup",
        link: "https://www.meetup.com/xrpl-toronto-community-meetup/events/294766059",
        location: "Downtown Toronto",
        date: "August 14, 2023",
        image: "event-meetup-toronto@2x.jpg",
        end_date: "August 14, 2023"
    },
    {
        name: "XRPL London Meetup (Accelerator Edition)",
        description: "Join us for a Happy Hour hosted by the XRPL Accelerator Team! Connect with fellow start-ups in the blockchain space and gain insights into cutting-edge projects and founders.",
        type: "meetup",
        link: "https://lu.ma/xrplacceleratorhappyhour",
        location: "Central London",
        date: "September 04, 2023",
        image: "event-meetup-london.png",
        end_date: "September 04, 2023"
    },
    {
        name: "XRPL Accelerator Demo Day",
        description: "​​Join us for our very first XRPL Accelerator Demo Day in London. Witness pitches from nine portfolio startups, engage in Q&A sessions, and network with founders and investors.",
        type: "conference",
        link: "https://lu.ma/xrplaccelerator",
        location: "Central London and Online",
        date: "September 05, 2023",
        image: "Conference.png",
        end_date: "September 05, 2023"
    },
    {
        name: "XRPL Hackathon - Apex 2023",
        description: "Join the XRPL Hackathon - APEX 2023, a week before the XRP Ledger's annual developer conference. Explore the Future of Finance and Web3 tracks, collaborate, learn, and compete for 10K USD in prizes.",
        type: "hackathon",
        link: "https://lu.ma/4h3bqfw1",
        location: "Delft, Netherlands ",
        date: "August 30, 2023 - August 31, 2023",
        image: "Hackathons.png",
        end_date: "August 31, 2023"
    },
]


let currentIndex = 1;

function updateCarousel() {
    console.log({events,currentIndex})
    if(!!events[currentIndex - 1]) {
        document.getElementById('prev-btn').style = 'opacity:1;'
        document.getElementById('left-image').style = 'visibility:visible;'
        document.getElementById('left-image').src = `assets/img/events/${events[currentIndex - 1].image}`;
    } else {
        document.getElementById('prev-btn').style = 'opacity:0.5;'
        document.getElementById('left-image').style = 'visibility:hidden;'
    }
    document.getElementById('center-image').src = `assets/img/events/${events[currentIndex].image}`;
    if(!!events[currentIndex + 1] ) {
        document.getElementById('next-btn').style = 'opacity:1;'
        document.getElementById('right-image').style = 'visibility:visible;'
        document.getElementById('right-image').src = `assets/img/events/${events[currentIndex + 1].image}`;
    } else {
        document.getElementById('next-btn').style = 'opacity:0.5;'
        document.getElementById('right-image').style = 'visibility:hidden;'
    }
    document.getElementById('event-name').textContent = events[currentIndex].name;
    document.getElementById('event-location').textContent = events[currentIndex].location;
    document.getElementById('event-date').textContent = events[currentIndex].date;
}

document.getElementById('prev-btn').addEventListener('click', function() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

document.getElementById('next-btn').addEventListener('click', function() {
    if (currentIndex < events.length - 1) {
        currentIndex++;
        updateCarousel();
    }
});

// Initial setup
updateCarousel();
