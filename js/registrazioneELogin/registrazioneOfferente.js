var zone = [];
var nZone = 1;
var fasce = [];

function clearSelect(id){
	var element = document.getElementById(id);
	for(i = element.options.length - 1; i != 0; i--){
		element.remove(i);
	}
}

document.addEventListener('input', function (event) {
	if (event.target.classList.contains("regione")){
		//Prendere il numero contenuto nell'id della select
		var indexZona = event.target.id.slice(-1);
		//Resettare la select
		clearSelect("provincia" + indexZona);
    //Riempire la select delle province in base alla regione
    for(i = 0; i != jsonComuni["regioni"][event.target.value - 1]["province"].length; i++){
      var temp = document.createElement("option");
      temp.text = jsonComuni["regioni"][event.target.value - 1]["province"][i]["nome"];
      temp.value = i;
      document.getElementById("provincia" + indexZona).add(temp)
    }
  }else if(event.target.classList.contains("provincia")){
		var indexZona = event.target.id.slice(-1);
		//Resettare la select
		clearSelect("città" + indexZona);
    //Riempire la select dei comuni in base alla provincia
		var t = document.getElementById("regione" + indexZona);
		var idRegione = t.options[t.selectedIndex].value - 1;
		var idProvincia = event.target.value;
		for(i = 0; i != jsonComuni["regioni"][idRegione]["province"][idProvincia]["comuni"].length; i++){
      var temp = document.createElement("option");
      temp.text = jsonComuni["regioni"][idRegione]["province"][idProvincia]["comuni"][i]["nome"];
      temp.value = i;
      document.getElementById("città" + indexZona).add(temp)
    }
	}
}, false);



function showZone(){
  document.getElementById("dati").style.display = "none";
  document.getElementById("zone").style.display = "block";

  //Riempire le select con regioni, province e comuni
  for(i = 0; i != jsonComuni["regioni"].length; i++){
    var temp = document.createElement("option");
    temp.text = jsonComuni["regioni"][i]["nome"];
    temp.value = i + 1;
    document.getElementById("regione1").add(temp)
  }
}

function addZona(){
  nZone ++;

  //Aggiungere delle "select" per una nuova zona
  var fileInput = document.getElementById('zona1');
  var temp = document.createElement('div');
  temp.id = "zona" + nZone;
  temp.innerHTML = `
    <div class="mb-3">
      <select id="regione` + nZone + `" class="form-select regione" aria-label="Regione">
        <option selected>Regione</option>
      </select>
      <select id="provincia` + nZone + `" class="form-select provincia" aria-label="Provincia">
        <option selected>Provincia</option>
      </select>
      <select id="città` + nZone + `" class="form-select città" aria-label="Città">
        <option selected>Città</option>
      </select>
    </div>
  `;
  fileInput.parentNode.appendChild(temp);

  //Riempire le select con regioni, province e comuni
  for(i = 0; i != jsonComuni["regioni"].length; i++){
    var temp = document.createElement("option");
    temp.text = jsonComuni["regioni"][i]["nome"];
    temp.value = i + 1;
    document.getElementById("regione" + nZone).add(temp)
  }
}

function showServizi(){
  document.getElementById("zone").style.display = "none";
  document.getElementById("servizi").style.display = "block";
}

function showFasce(){
  document.getElementById("servizi").style.display = "none";
  document.getElementById("fasce").style.display = "block";
}

function register(){
  document.getElementById('error').innerHTML = "";
  var nome = document.getElementById('nome').value;
  var cognome = document.getElementById('cognome').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var telefono = document.getElementById('telefono').value;

	//Ottieni dati delle zone
	var zone = [];
	for(i = 1; i != nZone + 1; i++){
		var regione = document.getElementById("regione" + i);
		var provincia = document.getElementById("provincia" + i);
		var città = document.getElementById("città" + i);
		var temp = {Regione: regione.options[regione.selectedIndex].text,
		Provincia: provincia.options[provincia.selectedIndex].text,
		Città: città.options[città.selectedIndex].text};
		zone.push(temp)
	}
	console.log(zone);

  const url= ip + '/registrazioneLogin/registrazioneAnziano.php';
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var vars = "nome=" + nome + "&cognome=" + cognome + "&email=" + email + "&password=" + password + "&telefono=" + telefono + "&indirizzo=" + indirizzo + "&città=" + città;
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(http.responseText == "existing"){
        document.getElementById('error').innerHTML = "Utente già esistente";
      }else if(http.responseText == "queryError"){
        document.getElementById('error').innerHTML = "Errore interno";
      }
      else if(http.responseText == "ok"){
        window.location.href = "index.html";
      }
    }
  };
  http.send(vars);
}
