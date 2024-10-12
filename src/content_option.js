const logotext = "JOHN";
const meta = {
    title: "John Doe",
    description: "I’m John Doe data scientist _ Full stack devloper,currently working in Berlin",
};

const introdata = {
    title: "I’m Martin Ng",
    animated: {
        first: "I love coding",
        second: "I code cool websites",
        third: "I develop mobile apps",
    },
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at nisl euismod urna bibendum",
    your_img_url: "https://images.unsplash.com/photo-1514790193030-c89d266d5a9d",
};

const dataabout = {
    title: "abit about my self",
    aboutme: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis dolor id ligula semper elementum feugiat pretium nulla. Nunc non commodo dolor. Nunc mollis dignissim facilisis. Morbi ut magna ultricies.",
};
const worktimeline = [{
        jobtitle: "Designer of week",
        where: "YAdfi",
        date: "2020",
    },
    {
        jobtitle: "Designer of week",
        where: "Jamalya",
        date: "2019",
    },
    {
        jobtitle: "Designer of week",
        where: "ALquds",
        date: "2019",
    },
];

const skills = [{
        name: "Python",
        value: 90,
    },
    {
        name: "Djano",
        value: 85,
    },
    {
        name: "Javascript",
        value: 80,
    },
    {
        name: "React",
        value: 60,
    },
    {
        name: "Jquery",
        value: 85,
    },
];

const services = [{
        title: "UI & UX Design",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at nisl euismod urna bibendum sollicitudin.",
    },
    {
        title: "Mobile Apps",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at nisl euismod urna bibendum sollicitudin.",
    },
    {
        title: "Wordpress Design",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at nisl euismod urna bibendum sollicitudin.",
    },
];

const schedule = [
    {
        date: "19/03/2024",
        time: "13:00",
        shipName: "Aye Aye",
        shipID: "10130"

    },
    {
        date: "21/03/2024",
        time: "19:00",
        shipName: "Meow",
        shipID: "10131"

    },
    {
        date: "03/09/2024",
        time: "16:30",
        shipName: "Mermaid",
        shipID: "10110"

    },
    {
        date: "09/10/2024",
        time: "17:00",
        shipName: "Spongebob",
        shipID: "10139"

    }
];

const dataportfolio = [
    {
        portName: "Port of Singapore",
        berths: [
            {
                name: "Berth 1", 
                Ships_affected: [
                    { nameShip: "Aye aye" },
                    { nameShip: "Meow" },
                    { nameShip: "mermaid" }
                ],
                ogTime: [
                    { timestamp: "October 15, 2024 at 4:28:18 PM" },
                    { timestamp: "October 15, 2024 at 4:28:18 PM" },
                    { timestamp: "October 15, 2024 at 4:28:18 PM" }
                ],
                newTime: [
                    { timestamp: "October 30, 2024 at 6:26:59 PM" },
                    { timestamp: "October 30, 2024 at 6:26:59 PM" },
                    { timestamp: "October 30, 2024 at 6:26:59 PM" }
                ],
                preBerth: [
                    {arrival: "berth 1"},
                    {arrival: "berth 1"},
                    {arrival: "berth 1"}
                ],
                postBerth: [
                    {destination: "berth 2"},
                    {destination: "berth 1"},
                    {destination: "berth 2"}
                ]
            },
            {
                name: "Berth 2", 
                
                Ships_affected: [
                    { nameShip: "Aye aye" },
                    { nameShip: "Meow" },
                    { nameShip: "mermaid" }
                ],
                ogTime: [
                    { timestamp: "14:00" },
                    { timestamp: "13:00" },
                    { timestamp: "16:00" }
                ],
                newTime: [
                    { timestamp: "16:00" },
                    { timestamp: "18:00" },
                    { timestamp: "22:00" }
                ],
                preBerth: [
                    {arrival: "berth 1"},
                    {arrival: "berth 1"},
                    {arrival: "berth 1"}
                ],
                postBerth: [
                    {destination: "berth 2"},
                    {destination: "berth 1"},
                    {destination: "berth 2"}
                ]
            }
        ]
    },
    {
        portName: "Port of Tanjung Pelepas",
        berths: [
            {
                name: "Berth 2", 
                
                Ships_affected: [
                    { nameShip: "Aye aye" },
                    { nameShip: "Meow" },
                    { nameShip: "mermaid" }
                ],
                ogTime: [
                    { timestamp: "14:00" },
                    { timestamp: "13:00" },
                    { timestamp: "16:00" }
                ],
                newTime: [
                    { timestamp: "16:00" },
                    { timestamp: "18:00" },
                    { timestamp: "22:00" }
                ],
                preBerth: [
                    {arrival: "berth 1"},
                    {arrival: "berth 1"},
                    {arrival: "berth 1"}
                ],
                postBerth: [
                    {destination: "berth 2"},
                    {destination: "berth 1"},
                    {destination: "berth 2"}
                ]
            },
            {
                name: "Berth 2", 
                
                Ships_affected: [
                    { nameShip: "Aye aye" },
                    { nameShip: "Meow" },
                    { nameShip: "mermaid" }
                ],
                ogTime: [
                    { timestamp: "14:00" },
                    { timestamp: "13:00" },
                    { timestamp: "16:00" }
                ],
                newTime: [
                    { timestamp: "16:00" },
                    { timestamp: "18:00" },
                    { timestamp: "22:00" }
                ],
                preBerth: [
                    {arrival: "berth 1"},
                    {arrival: "berth 1"},
                    {arrival: "berth 1"}
                ],
                postBerth: [
                    {destination: "berth 2"},
                    {destination: "berth 1"},
                    {destination: "berth 2"}
                ]
            }
        ]
    }
];


const contactConfig = {
    YOUR_EMAIL: "name@domain.com",
    YOUR_FONE: "(555)123-4567",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula eu nunc et sollicitudin. Cras pulvinar, nisi at imperdiet pharetra. ",
    // creat an emailjs.com account 
    // check out this tutorial https://www.emailjs.com/docs/examples/reactjs/
    YOUR_SERVICE_ID: "service_id",
    YOUR_TEMPLATE_ID: "template_id",
    YOUR_USER_ID: "user_id",
};

const socialprofils = {
    github: "https://github.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
};
export {
    meta,
    dataabout,
    dataportfolio,
    worktimeline,
    skills,
    services,
    introdata,
    contactConfig,
    socialprofils,
    logotext,
    schedule
};