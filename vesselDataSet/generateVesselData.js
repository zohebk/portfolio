const { faker } = require('@faker-js/faker');
const { psaPortsCoordinates } = require('./ports');

// Helper function to generate random routes through a series of ports
function generateRoute(ports, steps = 24) {
    const route = [];
    
    // Loop through each port to create route segments
    for (let i = 0; i < ports.length - 1; i++) {
        const start = ports[i];
        const end = ports[i + 1];
        
        const latStep = (end.latitude - start.latitude) / steps;
        const lonStep = (end.longitude - start.longitude) / steps;

        for (let j = 0; j <= steps; j++) {
            route.push({
                latitude: start.latitude + latStep * j,
                longitude: start.longitude + lonStep * j
            });
        }
    }
    
    return route;
}

// Function to generate a random number of unique ports
function getRandomPorts(num) {
    const uniquePorts = new Set();
    while (uniquePorts.size < num) {
        const randomPort = psaPortsCoordinates[Math.floor(Math.random() * psaPortsCoordinates.length)];
        uniquePorts.add(randomPort);
    }
    return Array.from(uniquePorts);
}

// Generate 100 vessels data
const vesselData = Array.from({ length: 100 }, () => {
    const portStopsCount = Math.floor(Math.random() * 5) + 2; // Randomize the number of ports (2 to 6)
    const portStops = getRandomPorts(portStopsCount); // Get random ports
    
    return {
        portStops,
        routes: generateRoute(portStops),
        info: {
            MMSI: Math.floor(Math.random() * (999999999 - 200000000 + 1)) + 200000000,
            ShipName: faker.company.name()
        }
    };
});

console.log(vesselData);
console.log(vesselData[1].routes[1]);
console.log(vesselData[1].portStops[1]);