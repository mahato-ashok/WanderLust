// Add your MapTiler API key to the config
      // (Go to https://cloud.maptiler.com/account/keys/ to get one for free!)
    //   console.log(token);
    //   maptilersdk.config.apiKey = iMkE9GjHRWeCpZnnMuUy;
    // const map = new maptilersdk.Map({
    //   container: 'map',
    //   style: maptilersdk.MapStyle.STREETS,
    // });

   // map.js (ES module)

const styleURL = `https://api.maptiler.com/maps/streets/style.json?key=${token}`;
console.log(listing);

 const map = new maplibregl.Map({
  container: "map",
  style: styleURL,
  center:listing.geometry.coordinates,
  zoom: 8
});

map.on("load", () => {
  const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.location}</h4>
      <p>Exact location will be provided after booking</p>`);

  new maplibregl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)   // [lng, lat]
    .setPopup(popup)          // attach popup
    .addTo(map);
});