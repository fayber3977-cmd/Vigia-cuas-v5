const $ = id => document.getElementById(id);
const video = $("video");
let stream = null;
let currentLocation = null;
let events = JSON.parse(localStorage.getItem("vigiaEvents") || "[]");

function setStatus(title, detail) {
  $("systemStatus").textContent = title;
  $("statusDetail").textContent = detail;
}
function renderHistory() {
  $("eventCount").textContent = events.length;
  $("exportData").disabled = events.length === 0;
  $("clearData").disabled = events.length === 0;
  const area = $("history");
  if (!events.length) {
    area.className = "history-empty";
    area.textContent = "Todavía no hay observaciones guardadas.";
    return;
  }
  area.className = "";
  area.innerHTML = "";
  events.slice().reverse().forEach(item => {
    const article = document.createElement("article");
    article.className = "event";
    const title = document.createElement("strong");
    title.textContent = item.category;
    const time = document.createElement("small");
    time.textContent = item.date + (item.coords ? " · GPS " + item.coords : " · Sin GPS");
    const note = document.createElement("p");
    note.textContent = item.notes || "Sin notas adicionales.";
    article.append(title, time, note);
    if (item.photo) {
      const img = document.createElement("img");
      img.src = item.photo;
      img.alt = "Fotografía de evidencia";
      article.append(img);
    }
    area.append(article);
  });
}
function persist() {
  try {
    localStorage.setItem("vigiaEvents", JSON.stringify(events));
    renderHistory();
  } catch (e) {
    alert("No hay espacio suficiente para guardar más evidencias. Exporta el historial y borra registros antiguos.");
  }
}
$("startCamera").addEventListener("click", async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    alert("La cámara requiere una conexión segura HTTPS. Publica la aplicación en un sitio HTTPS y vuelve a abrirla.");
    return;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
    video.srcObject = stream;
    video.style.display = "block";
    $("cameraPlaceholder").style.display = "none";
    $("takePhoto").disabled = false;
    $("startCamera").textContent = "Cámara activa";
    setStatus("Observación activa", "Cámara trasera encendida en este dispositivo.");
  } catch (e) {
    alert("No se pudo abrir la cámara. Revisa los permisos del navegador.");
  }
});
$("takePhoto").addEventListener("click", () => {
  if (!video.videoWidth) return;
  const canvas = $("photoCanvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0);
  const photo = canvas.toDataURL("image/jpeg",0.72);
  addEvent("Fotografía de observación", "Captura manual desde cámara.", photo);
});
$("getLocation").addEventListener("click", () => {
  if (!navigator.geolocation) {
    $("gpsStatus").textContent = "GPS no disponible en este navegador";
    return;
  }
  $("gpsStatus").textContent = "Buscando ubicación…";
  navigator.geolocation.getCurrentPosition(pos => {
    currentLocation = {lat:pos.coords.latitude, lon:pos.coords.longitude};
    const coords = `${currentLocation.lat.toFixed(6)}, ${currentLocation.lon.toFixed(6)}`;
    $("gpsStatus").textContent = "Ubicación obtenida";
    $("coordinates").textContent = coords + ` · Precisión aprox. ${Math.round(pos.coords.accuracy)} m`;
    $("mapLink").hidden = false;
    $("openMap").href = `https://www.openstreetmap.org/?mlat=${currentLocation.lat}&mlon=${currentLocation.lon}#map=16/${currentLocation.lat}/${currentLocation.lon}`;
  }, err => {
    $("gpsStatus").textContent = "No se pudo obtener la ubicación";
    $("coordinates").textContent = "Comprueba el permiso de ubicación y activa la ubicación del teléfono.";
  }, {enableHighAccuracy:true,timeout:15000,maximumAge:30000});
});
function addEvent(category, notes, photo=null) {
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    category, notes, photo,
    date: new Date().toLocaleString(),
    coords: currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lon.toFixed(6)}` : null
  };
  events.push(item);
  persist();
}
$("saveObservation").addEventListener("click", () => {
  addEvent($("category").value, $("notes").value.trim());
  $("notes").value = "";
  alert("Observación guardada en este dispositivo.");
});
$("exportData").addEventListener("click", () => {
  const clean = events.map(({photo,...rest}) => rest);
  const blob = new Blob([JSON.stringify(clean,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "vigia_historial.json"; a.click();
  URL.revokeObjectURL(url);
});
$("clearData").addEventListener("click", () => {
  if (confirm("¿Borrar todas las observaciones y fotografías guardadas en esta aplicación?")) {
    events=[]; persist();
  }
});
function tick(){ $("clock").textContent = new Date().toLocaleTimeString(); }
tick(); setInterval(tick,1000); renderHistory();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(()=>{});
}
