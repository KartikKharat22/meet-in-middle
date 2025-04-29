// src/components/Map/LocationPicker.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  MyLocation,
  Place,
  Clear,
  Search
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';

// Map configuration constants
const MAP_CONFIG = {
  containerStyle: {
    width: '100%',
    height: '400px'
  },
  defaultCenter: {
    lat: 0,
    lng: 0
  },
  defaultZoom: 2,
  selectedZoom: 15
};

// Libraries to load for Google Maps
const LIBRARIES = ['places'];

function LocationPicker({ 
  onLocationSelect, 
  initialLocation = null,
  interactive = true,
  showSearch = true
}) {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize with current location if no initial location provided
  useEffect(() => {
    if (!initialLocation && interactive) {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setLoading(false);
          
          // Only set as selected if no initial location
          if (!initialLocation) {
            handleLocationSelect(location);
          }
        },
        (err) => {
          setError('Could not get your current location. Please enable location services.');
          setLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    
    if (map) {
      map.panTo(location);
      map.setZoom(MAP_CONFIG.selectedZoom);
    }
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
          placeId: place.place_id
        };
        handleLocationSelect(location);
        setSearchQuery(place.formatted_address);
      }
    }
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    if (onLocationSelect) {
      onLocationSelect(null);
    }
  };

  const handleMapClick = (event) => {
    if (interactive) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      handleLocationSelect(location);
      
      // Reverse geocode to get address
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setSearchQuery(results[0].formatted_address);
          }
        });
      }
    }
  };

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={MAP_CONFIG.containerStyle}
      center={currentLocation || MAP_CONFIG.defaultCenter}
      zoom={selectedLocation ? MAP_CONFIG.selectedZoom : MAP_CONFIG.defaultZoom}
      onLoad={(map) => setMap(map)}
      onUnmount={() => setMap(null)}
      onClick={handleMapClick}
      options={{
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        clickableIcons: interactive
      }}
    >
      {selectedLocation && (
        <Marker 
          position={selectedLocation}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }}
        />
      )}
      {currentLocation && interactive && (
        <Marker 
          position={currentLocation}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          }}
        />
      )}
    </GoogleMap>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {showSearch && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={LIBRARIES}
          >
            <Autocomplete
              onLoad={(autocomplete) => setAutocomplete(autocomplete)}
              onPlaceChanged={handlePlaceChanged}
              fields={['geometry.location', 'formatted_address', 'place_id']}
            >
              <TextField
                fullWidth
                label="Search for a location"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputRef={searchRef}
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                  endAdornment: searchQuery && (
                    <IconButton onClick={clearSelection} size="small">
                      <Clear />
                    </IconButton>
                  )
                }}
              />
            </Autocomplete>
          </LoadScript>
          
          {interactive && (
            <Tooltip title="Use my current location">
              <IconButton 
                onClick={getCurrentLocation} 
                sx={{ ml: 1 }}
                disabled={loading}
              >
                <MyLocation />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: MAP_CONFIG.containerStyle.height
        }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper elevation={0} sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          {interactive && (
            <Button 
              variant="outlined" 
              onClick={getCurrentLocation}
              sx={{ mt: 1 }}
            >
              Retry
            </Button>
          )}
        </Paper>
      ) : (
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={LIBRARIES}
        >
          {renderMap()}
        </LoadScript>
      )}

      {selectedLocation && (
        <Paper elevation={0} sx={{ p: 2, mt: 2, display: 'flex', alignItems: 'center' }}>
          <Place color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
          </Typography>
          {interactive && (
            <Button 
              size="small" 
              onClick={clearSelection}
              startIcon={<Clear />}
            >
              Clear
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default LocationPicker;