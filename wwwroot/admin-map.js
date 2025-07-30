// Global variables for map management
let map;
let markers = [];
let dotNetHelper;

// Initialize the map
window.initializeMap = function (locations, dotNetRef) {
    dotNetHelper = dotNetRef;
    
    // Initialize the map centered on a default location (New York City)
    map = L.map('map').setView([40.7128, -74.0060], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers for each location
    addMarkers(locations);
    
    // Add search control
    const searchControl = L.Control.geocoder({
        defaultMarkGeocode: false
    }).on('markgeocode', function (e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
            bbox.getSouthEast(),
            bbox.getNorthEast(),
            bbox.getNorthWest(),
            bbox.getSouthWest()
        ]);
        map.fitBounds(poly.getBounds());
    }).addTo(map);
};

// Add markers to the map
function addMarkers(locations) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    locations.forEach(location => {
        // Create custom icon based on status
        const icon = createCustomIcon(location.Status);
        
        // Create marker
        const marker = L.marker([location.Latitude, location.Longitude], { icon: icon })
            .addTo(map)
            .bindPopup(createPopupContent(location));
        
        // Add click event
        marker.on('click', function() {
            dotNetHelper.invokeMethodAsync('OnLocationSelected', location.Id);
        });
        
        markers.push(marker);
    });
}

// Create custom icon based on status
function createCustomIcon(status) {
    const iconColors = {
        'completed': '#28a745',
        'pending': '#ffc107',
        'scheduled': '#17a2b8'
    };
    
    const color = iconColors[status] || '#6c757d';
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 20px; 
            height: 20px; 
            background-color: ${color}; 
            border: 2px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
        ">📍</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

// Create popup content
function createPopupContent(location) {
    return `
        <div class="map-popup">
            <h4>${location.Name}</h4>
            <p><strong>Status:</strong> <span class="status ${location.Status}">${location.Status}</span></p>
            <p><strong>Customer:</strong> ${location.CustomerName}</p>
            <p><strong>Service:</strong> ${location.ServiceType}</p>
            <p><strong>Value:</strong> $${location.Value}</p>
            <p><strong>Date:</strong> ${new Date(location.Date).toLocaleDateString()}</p>
        </div>
    `;
}

// Update map markers (called from Blazor)
window.updateMapMarkers = function (locations) {
    addMarkers(locations);
};

// Add new marker at clicked location
window.addNewMarker = function (lat, lng) {
    const marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-marker new',
            html: `<div style="
                width: 20px; 
                height: 20px; 
                background-color: #dc3545; 
                border: 2px solid white; 
                border-radius: 50%; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                font-weight: bold;
            ">➕</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);
    
    markers.push(marker);
    return { lat: lat, lng: lng };
};

// Get current map bounds
window.getMapBounds = function () {
    if (map) {
        const bounds = map.getBounds();
        return {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
        };
    }
    return null;
};

// Fit map to show all markers
window.fitMapToMarkers = function () {
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
};

// Clear all markers
window.clearMarkers = function () {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}; 