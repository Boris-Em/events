interface VenuePreferences {
    [venueId: string]: boolean;
  }
  
const saveBlockedVenues = (preferences: VenuePreferences) => {
  localStorage.setItem('venuePreferences', JSON.stringify(preferences));
};
  
const loadBlockedVenues = (): VenuePreferences => {
  const storedPreferences = localStorage.getItem('venuePreferences');
  return storedPreferences ? JSON.parse(storedPreferences) : {};
};

export { loadBlockedVenues, saveBlockedVenues };