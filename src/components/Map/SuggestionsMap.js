import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Place,
  Directions,
  Star,
  Restaurant,
  LocalCafe,
  LocalBar,
  Park,
  ShoppingCart
} from '@mui/icons-material';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

// Place type configuration
const PLACE_TYPES = {
  restaurant: { icon: <Restaurant />, label: 'Restaurant', color: 'error' },
  cafe: { icon: <LocalCafe />, label: 'Cafe', color: 'warning' },
  bar: { icon: <LocalBar />, label: 'Bar', color: 'secondary' },
  park: { icon: <Park />, label: 'Park', color: 'success' },
  shopping: { icon: <ShoppingCart />, label: 'Shopping', color: 'info' }
};

// Default search radius in meters
const DEFAULT_RADIUS = 2000;

const containerStyle = {
  width: '100%',
  height: '400px'
};

function SuggestionsMap({ midpoint, locations, participants = [], onSelect, initialCenter }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [suggestions, setSuggestions] = useState(locations || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('restaurant');
  const [center, setCenter] = useState(midpoint || initialCenter);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Calculate central point when participants or midpoint changes
  useEffect(() => {
    if (midpoint) {
      setCenter(midpoint);
    } else if (participants.length > 0) {
      const avgLat = participants.reduce((sum, p) => sum + p.location.lat, 0) / participants.length;
      const avgLng = participants.reduce((sum, p) => sum + p.location.lng, 0) / participants.length;
      setCenter({ lat: avgLat, lng: avgLng });
    }
  }, [participants, midpoint]);

  // Get place type icon
  const getPlaceIcon = (type) => {
    return PLACE_TYPES[type]?.icon || <Place />;
  };

  // Find nearby places
  const findSuggestions = async () => {
    if (!center || !window.google || !window.google.maps) {
      setError('Maps not loaded');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: new window.google.maps.LatLng(center.lat, center.lng),
        radius: DEFAULT_RADIUS,
        type: selectedType,
        openNow: true,
        rankBy: window.google.maps.places.RankBy.PROMINENCE
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const processed = results
            .filter(place => place.business_status === 'OPERATIONAL')
            .slice(0, 10)
            .map(place => ({
              placeId: place.place_id,
              name: place.name,
              address: place.vicinity,
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              },
              rating: place.rating,
              priceLevel: place.price_level,
              type: selectedType
            }));
          
          setSuggestions(processed);
        } else {
          setError('Could not load places. Please try again.');
        }
        setLoading(false);
      });
    } catch (err) {
      setError('Error searching for places');
      setLoading(false);
    }
  };

  // Load suggestions when center or type changes
  useEffect(() => {
    if (center && !locations) { // Only search if no predefined locations
      findSuggestions();
    }
  }, [center, selectedType]);

  // Memoized participant markers
  const participantMarkers = useMemo(() => (
    participants.map((participant, index) => ({
      position: participant.location,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: `hsl(${(index * 360) / participants.length}, 70%, 50%)`,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
      },
      label: {
        text: participant.name.charAt(0),
        color: '#fff',
        fontSize: '12px'
      }
    }))
  ), [participants]);

  // Memoized suggestion markers
  const suggestionMarkers = useMemo(() => (
    suggestions.map(suggestion => ({
      position: suggestion.coordinates,
      icon: {
        url: `https://maps.google.com/mapfiles/ms/icons/${PLACE_TYPES[suggestion.type]?.color || 'red'}-dot.png`
      }
    }))
  ), [suggestions]);

  const handleSelectSuggestion = (suggestion) => {
    setSelectedPlace(suggestion);
    if (onSelect) {
      onSelect({
        ...suggestion,
        typeLabel: PLACE_TYPES[suggestion.type]?.label || 'Location'
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
      {/* Map Section */}
      <Box sx={{ flex: 1, minHeight: isMobile ? '300px' : '500px' }}>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={['places']}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false
            }}
          >
            {/* Participant markers */}
            {participantMarkers.map((marker, i) => (
              <Marker key={`participant-${i}`} {...marker} />
            ))}

            {/* Central point marker */}
            {center && (participants.length > 1 || midpoint) && (
              <Marker
                position={center}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#3f51b5',
                  fillOpacity: 0.8,
                  strokeWeight: 2,
                  strokeColor: '#ffffff'
                }}
              />
            )}

            {/* Suggestion markers */}
            {suggestionMarkers.map((marker, i) => (
              <Marker 
                key={`suggestion-${i}`} 
                {...marker}
                onClick={() => handleSelectSuggestion(suggestions[i])}
              />
            ))}

            {/* InfoWindow for selected place */}
            {selectedPlace && (
              <InfoWindow
                position={selectedPlace.coordinates}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <Typography variant="subtitle1">{selectedPlace.name}</Typography>
                  <Typography variant="body2">{selectedPlace.address}</Typography>
                  {selectedPlace.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star fontSize="small" sx={{ color: 'warning.main', mr: 0.5 }} />
                      <Typography variant="body2">
                        {selectedPlace.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </Box>

      {/* Suggestions List */}
      {!locations && ( // Only show list if not using predefined locations
        <Paper sx={{ 
          width: isMobile ? '100%' : '350px', 
          p: 2,
          overflow: 'auto',
          maxHeight: isMobile ? '300px' : '500px'
        }}>
          <Typography variant="h6" gutterBottom>
            Meeting Point Suggestions
          </Typography>

          {/* Place type filters */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {Object.entries(PLACE_TYPES).map(([type, config]) => (
              <Chip
                key={type}
                icon={config.icon}
                label={config.label}
                onClick={() => setSelectedType(type)}
                color={selectedType === type ? 'primary' : 'default'}
                variant={selectedType === type ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : suggestions.length === 0 ? (
            <Typography>No suggestions found in this area</Typography>
          ) : (
            <List dense>
              {suggestions.map((suggestion) => (
                <React.Fragment key={suggestion.placeId}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${PLACE_TYPES[suggestion.type]?.color || 'primary'}.main` }}>
                        {getPlaceIcon(suggestion.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={suggestion.name}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            display="block"
                          >
                            {suggestion.address}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            {suggestion.rating && (
                              <>
                                <Star fontSize="small" sx={{ color: 'warning.main', mr: 0.5 }} />
                                <Typography variant="caption" sx={{ mr: 1 }}>
                                  {suggestion.rating.toFixed(1)}
                                </Typography>
                              </>
                            )}
                            {suggestion.priceLevel && (
                              <Typography variant="caption">
                                {'$'.repeat(suggestion.priceLevel)}
                              </Typography>
                            )}
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default SuggestionsMap;