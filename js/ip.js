var ip = "http://www.gograndpa.altervista.org";

function onLoad(){
  document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
  document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
  return false;
}
