const socket = io(); // by using this the connection request goes to the backened and we have to manage it in the backend.
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0, // this tells to not to caching.
    }
  );
}

const map = L.map("map").setView([0,0],14); // there are latitude and longitude and the view level.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:"openstreetmap"
}).addTo(map)

const markers = {};
socket.on("receive-location",(data)=>{
    const {id, longitude, latitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected",()=>{
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
