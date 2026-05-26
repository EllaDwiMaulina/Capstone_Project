const OPENCAGE_ENDPOINT = 'https://api.opencagedata.com/geocode/v1/json';

const fallbackJakartaCoordinates = {
  latitude: -6.175392,
  longitude: 106.827153,
  formatted: 'Jakarta, Indonesia',
};

export async function geocodeAddress(address) {
  if (!address?.trim() || !process.env.OPENCAGE_API_KEY) {
    return null;
  }

  const url = new URL(OPENCAGE_ENDPOINT);
  url.searchParams.set('q', address);
  url.searchParams.set('key', process.env.OPENCAGE_API_KEY);
  url.searchParams.set('language', 'id');
  url.searchParams.set('countrycode', 'id');
  url.searchParams.set('limit', '1');
  url.searchParams.set('no_annotations', '1');

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.status?.message || 'Gagal mengambil data geocoding OpenCage.');
    error.statusCode = response.status;
    throw error;
  }

  const bestResult = result.results?.[0];

  if (!bestResult?.geometry) {
    return null;
  }

  return {
    latitude: bestResult.geometry.lat,
    longitude: bestResult.geometry.lng,
    formatted: bestResult.formatted,
    confidence: bestResult.confidence,
  };
}

export async function geocodeAddressOrFallback(address) {
  const geocoded = await geocodeAddress(address);

  if (geocoded) {
    return geocoded;
  }

  if (address?.toLowerCase().includes('jakarta')) {
    return fallbackJakartaCoordinates;
  }

  return null;
}
