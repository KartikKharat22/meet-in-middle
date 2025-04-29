const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance in meters
  };
  
  const toRad = value => value * Math.PI / 180;
  
  const calculateMidpoint = coordinates => {
    if (coordinates.length === 0) return null;
    
    let x = 0, y = 0, z = 0;
    
    coordinates.forEach(coord => {
      const latRad = toRad(coord.lat);
      const lngRad = toRad(coord.lng);
      
      x += Math.cos(latRad) * Math.cos(lngRad);
      y += Math.cos(latRad) * Math.sin(lngRad);
      z += Math.sin(latRad);
    });
    
    x /= coordinates.length;
    y /= coordinates.length;
    z /= coordinates.length;
    
    const lng = Math.atan2(y, x);
    const hyp = Math.sqrt(x * x + y * y);
    const lat = Math.atan2(z, hyp);
    
    return {
      lat: lat * 180 / Math.PI,
      lng: lng * 180 / Math.PI
    };
  };
  
  module.exports = {
    calculateDistance,
    calculateMidpoint
  };