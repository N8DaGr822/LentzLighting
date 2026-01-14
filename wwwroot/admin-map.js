// Global variables for map management
let map;
let markers = [];
let dotNetHelper;
let routingControl;
let markerClusterGroup;

// Initialize the map
window.initializeMap = function (locations, dotNetRef) {
    dotNetHelper = dotNetRef;
    
    // Initialize the map centered on a default location (New York City)
    map = L.map('map').setView([40.7128, -74.0060], 11);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Initialize marker cluster group
    markerClusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 50,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            let className = 'marker-cluster';
            let size = 'small';
            
            if (count > 10) {
                size = 'large';
            } else if (count > 5) {
                size = 'medium';
            }
            
            return L.divIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster-${size}`,
                iconSize: L.point(40, 40)
            });
        }
    });
    
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
    
    // Add layer control
    const baseMaps = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
    };
    
    L.control.layers(baseMaps).addTo(map);
    
    // Fit map to show all markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
};

// Add markers to the map
function addMarkers(locations) {
    // Clear existing markers
    markers.forEach(marker => {
        if (markerClusterGroup.hasLayer(marker)) {
            markerClusterGroup.removeLayer(marker);
        }
    });
    markers = [];
    
    locations.forEach(location => {
        // Create custom icon based on status
        const icon = createCustomIcon(location.Status, location.ServiceType);
        
        // Create marker
        const marker = L.marker([location.Latitude, location.Longitude], { icon: icon })
            .bindPopup(createPopupContent(location));
        
        // Add click event
        marker.on('click', function() {
            dotNetHelper.invokeMethodAsync('OnLocationSelected', location.Id);
        });
        
        // Add to cluster group
        markerClusterGroup.addLayer(marker);
        markers.push(marker);
    });
    
    // Add cluster group to map
    map.addLayer(markerClusterGroup);
}

// Create custom icon based on status and service type
function createCustomIcon(status, serviceType) {
    const iconColors = {
        'completed': '#28a745',
        'pending': '#ffc107',
        'scheduled': '#17a2b8'
    };
    
    const serviceIcons = {
        'Premium Package': '🏠',
        'Residential': '🏡',
        'Custom Design': '🏰',
        'Basic Package': '🏘️',
        'Commercial': '🏢',
        'Service Areas': '🗺️'
    };
    
    const color = iconColors[status] || '#6c757d';
    const icon = serviceIcons[serviceType] || '📍';
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 24px; 
            height: 24px; 
            background-color: ${color}; 
            border: 2px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
        ">${icon}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
}

// Create popup content
function createPopupContent(location) {
    const statusClass = location.Status === 'completed' ? 'status-completed' : 
                       location.Status === 'pending' ? 'status-pending' : 'status-scheduled';
    
    return `
        <div class="map-popup">
            <h4>${location.Name}</h4>
            <p><strong>Status:</strong> <span class="status ${statusClass}">${location.Status}</span></p>
            <p><strong>Customer:</strong> ${location.CustomerName}</p>
            <p><strong>Service:</strong> ${location.ServiceType}</p>
            <p><strong>Value:</strong> $${location.Value.toLocaleString()}</p>
            <p><strong>Date:</strong> ${new Date(location.Date).toLocaleDateString()}</p>
            <div class="popup-actions">
                <button onclick="showRoute(${location.Latitude}, ${location.Longitude})" class="btn-route">🗺️ Route</button>
                <button onclick="showDetails(${location.Id})" class="btn-details">📋 Details</button>
            </div>
        </div>
    `;
}

// Show route to location
window.showRoute = function(lat, lng) {
    // Get current location (or use a default starting point)
    const startLat = 40.7128;
    const startLng = -74.0060;
    
    // Create routing control
    if (routingControl) {
        map.removeControl(routingControl);
    }
    
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(startLat, startLng),
            L.latLng(lat, lng)
        ],
        routeWhileDragging: true,
        showAlternatives: true,
        fitSelectedRoutes: true,
        lineOptions: {
            styles: [
                {color: '#007bff', opacity: 0.8, weight: 6}
            ]
        }
    }).addTo(map);
    
    // Fit map to show the route
    routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        console.log(`Route distance: ${(summary.totalDistance / 1000).toFixed(2)} km`);
        console.log(`Route time: ${(summary.totalTime / 60).toFixed(0)} min`);
    });
};

// Show location details
window.showDetails = function(locationId) {
    dotNetHelper.invokeMethodAsync('OnLocationSelected', locationId);
};

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
                width: 24px; 
                height: 24px; 
                background-color: #dc3545; 
                border: 2px solid white; 
                border-radius: 50%; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
            ">➕</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
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
    markers.forEach(marker => {
        if (markerClusterGroup.hasLayer(marker)) {
            markerClusterGroup.removeLayer(marker);
        }
    });
    markers = [];
};

// Clear routing
window.clearRouting = function () {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
};

// Get markers in current view
window.getMarkersInView = function () {
    const bounds = map.getBounds();
    return markers.filter(marker => {
        const pos = marker.getLatLng();
        return bounds.contains(pos);
    });
}; 