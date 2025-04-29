exports.calculateMidpoint = (locations) => {
    const avg = locations.reduce((sum, loc) => {
      sum.lat += loc.lat;
      sum.lng += loc.lng;
      return sum;
    }, { lat: 0, lng: 0 });
    
    return {
      lat: avg.lat / locations.length,
      lng: avg.lng / locations.length
    };
  };
  
  exports.calculateDistance = (loc1, loc2) => {
    const R = 6371e3;
    const φ1 = loc1.lat * Math.PI/180;
    const φ2 = loc2.lat * Math.PI/180;
    const Δφ = (loc2.lat-loc1.lat) * Math.PI/180;
    const Δλ = (loc2.lng-loc1.lng) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    return R * c;
  };