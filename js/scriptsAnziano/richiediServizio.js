var idServizioScelto = -1;
var note = '';
var data = 0;
var ora = 0;
var promise;
var utenti = [];
var idOfferenti = [];
var x = 0; //Contatore elementi di utenti



document.addEventListener('input', function (event) {
    //Se è stato scelto uno dei servizi
    if(event.target.id.includes("rb")){
        //Ottenere l'id del servizio
		var matches = event.target.id.match(/(\d+)/);
        indexInput = matches[0];
        idServizioScelto = indexInput-1;
    } else if(event.target.id.includes("cb")){
        var checked = document.getElementById(event.target.id).checked;
        var nomeUtente = document.getElementById(event.target.id).labels['0'].innerHTML;
        var idOfferente = document.getElementById(event.target.id).labels['0'].id;

        //Se il checkbox viene deselezionato elimino il nome dall'array
        if(!checked){
            for(i=0; i<utenti.length; i++){
                if(utenti[i] == nomeUtente){
                    utenti[i] = '';
                }

                if(idOfferenti[i] == idOfferente){
                    idOfferenti[i] = '';
                }
            }
        } else {
            utenti[x] = nomeUtente;
            idOfferenti[x] = idOfferente;
            x++;
        }

        //Elimino gli elementi vuoti dagli array
        var filtered = utenti.filter(function (el) {
            return el != '';
          });

        utenti = filtered;

        filtered = idOfferenti.filter(function (el) {
            return el != '';
          });

        idOfferenti = filtered;
    }

}, false);

function getDateTime(){
    data = document.getElementById('date').value;
    ora = document.getElementById('time').value+':00';
}

function displayServizi(){

    for(i=0; i<listaServizi.length; i++){
        var radio = document.createElement('INPUT');
        radio.type = 'radio';
        radio.name = 'rb';
        var num = i+1; //l'array parte da 0 ma gli id da 1
        radio.id = 'rb'+num;

        var nomeServizio = document.createElement('LABEL');
        nomeServizio.setAttribute('for', radio.id);
        nomeServizio.innerHTML = listaServizi[i];

        document.getElementById('servizi').appendChild(radio);
        document.getElementById('servizi').appendChild(nomeServizio);
    }
}


function displayListaUtenti(){
    //localStorage.setItem('id', 25);
    const url= ip + '/queryAnziano/listaUtenti.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "idServizio="+idServizioScelto + "&idAnziano=" + localStorage['id'];
    var valutazione;

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText);
            var currentId = 0;
            var j = 1;

            if(!result){
                document.getElementById("selezionaUtente").innerHTML += `
                <div class="modal fade" tabindex="-1" id="messaggioErrore" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modalTitle"></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                document.getElementById('modalTitle').innerHTML = "Non ci sono utenti disponibili in quella data e ora nella tua zona.";
                var myModal = new bootstrap.Modal(document.getElementById('messaggioErrore'), {
                    keyboard: false
                    });
                    myModal.toggle();
            } else {
                for(i=0; i<result.length; i++){
                    if( ora >= result[i]['oraInizio'] && ora <= result[i]['oraFine']){
                        if(result[i]['idOfferente'] != currentId){
                            currentId = result[i]['idOfferente'];
                            if(!isNaN(result[j])){
                                valutazione = result[j];
                            } else {
                                valutazione = 0;
                            }
                            j++;

                            var checkbox = document.createElement('INPUT');
                            checkbox.type = 'checkbox';
                            checkbox.name = 'cb';
                            var num = i+1;
                            checkbox.id = 'cb'+num;

                            var nome = document.createElement('LABEL');
                            nome.setAttribute('for', checkbox.id);
                            nome.id = result[i]['idOfferente'];
                            nome.innerHTML = result[i]['nomeOfferente'] + ' ' + result[i]['cognomeOfferente'];

                            var prezzo = document.createElement('p');
                            prezzo.className = 'prezzo';
                            prezzo.innerHTML = 'Costo orario ' + result[i]['pagaOraria'] + '  euro.';

                            var recensione = document.createElement('p');
                            recensione.className = 'valutazione';
                            stelle = Math.floor(valutazione);
                            stars = '';
                            
                            for(var k=1; k<=stelle; k++){
                                stars = stars.concat('<img class="stella" src="img/stella-piena.png">');
                            }
                            if(stelle<5){
                                for(var k=stelle; k<5; k++){
                                    
                                    stars = stars.concat('<img class="stella" src="img/stella-vuota.png">');
                                }
                            }
                            recensione.innerHTML = stars;

                            var linkProfilo = document.createElement('A');
                            linkProfilo.innerHTML = 'Visualizza profilo';
                            linkProfilo.className = 'profilo';
                            linkProfilo.setAttribute("href", "#");
                            linkProfilo.setAttribute("onclick", "localStorage.setItem('idUtente', '"+result[i]['idOfferente']+"'); localStorage.setItem('statoPrenotazione', 'listaUtenti'); window.location.href='profiloOfferente.html';");
                            
                            document.getElementById('listaUtenti').appendChild(checkbox);
                            document.getElementById('listaUtenti').appendChild(nome);
                            document.getElementById(result[i]['idOfferente']).appendChild(prezzo);
                            document.getElementById(result[i]['idOfferente']).appendChild(recensione);
                            document.getElementById('listaUtenti').appendChild(linkProfilo);
                        }
                    }
                }
             }
          }
    };

    http.send(vars);
}

function displayRiepilogoRichiesta(){
    document.getElementById('nomeServizio').innerHTML = listaServizi[idServizioScelto];
    document.getElementById('dataRichiesta').innerHTML = data;
    document.getElementById('oraRichiesta').innerHTML = ora;

    for(i=0; i<utenti.length; i++){
        document.getElementById('utentiSelezionati').innerHTML += utenti[i] + '<br><br>';
    }
}

function getNote(){
    note = document.getElementById('memo').value;
}


function inviaRichiestaPreventivo(){
    for(i=0; i<idOfferenti.length; i++){
        const url= ip + '/queryAnziano/inviaPreventivo.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var vars = 'idAnziano=' + localStorage['id'] + '&idOfferente=' + idOfferenti[i] + '&idServizio=' + idServizioScelto + '&data=' + data + '&ora=' + ora + '&note=' + note; //idAnziano, idOfferente, idServizio, note, data, ora, stato

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var result = http.responseText;

                if(result == 'existing'){
                    console.log('esiste già');
                    //display messaggio errore
                } else if(result == 'queryError'){
                    console.log('errore server');
                    //display messaggio errore
                } else if(result == 'ok'){
                    console.log('ok');
                    //display messaggio invio avvenuto
                }
            }
        };

        http.send(vars);
    }

    setTimeout(function(){window.location.href = 'homeanziano.html';}, 200);
}

function inviaRichiestaPrenotazione(){
    if( document.getElementById('memo').value != '' && document.getElementById('memo').value != null){
        console.log(document.getElementById('memo').value);
        document.getElementById("riepilogo").innerHTML += `
        <div class="modal fade" tabindex="-1" id="messaggioErrore" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitle"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.getElementById('modalTitle').innerHTML = "Non puoi inserire note per richiedere una prenotazione";
        var myModal = new bootstrap.Modal(document.getElementById('messaggioErrore'), {
            keyboard: false
            });
            myModal.toggle();
    } else {
        for(i=0; i<idOfferenti.length; i++){
            const url= ip + '/queryAnziano/inviaPrenotazione.php';
            var http = new XMLHttpRequest();
            http.open("POST", url, true);
            http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var vars = 'idAnziano=' + localStorage['id'] + '&idOfferente=' + idOfferenti[i] + '&idServizio=' + idServizioScelto + '&data=' + data + '&ora=' + ora; //idAnziano, idOfferente, idServizio, data, ora, stato

            http.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var result = http.responseText;

                    if(result == 'existing'){
                        console.log('esiste già');
                        //display messaggio errore

                        document.getElementById("riepilogo").innerHTML += `
                        <div class="modal fade" tabindex="-1" id="messaggioErrore" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="modalTitle"></h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                        document.getElementById('modalTitle').innerHTML = "La prenotazione esiste già";
                        var myModal = new bootstrap.Modal(document.getElementById('messaggioErrore'), {
                            keyboard: false
                            });
                            myModal.toggle();
                    } else if(result == 'queryError'){
                        console.log('errore server');
                        //display messaggio errore

                        document.getElementById("riepilogo").innerHTML += `
                        <div class="modal fade" tabindex="-1" id="messaggioErrore" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="modalTitle"></h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                        document.getElementById('modalTitle').innerHTML = "Errore del server";
                        var myModal = new bootstrap.Modal(document.getElementById('messaggioErrore'), {
                            keyboard: false
                            });
                            myModal.toggle();
                    } else if(result == 'ok'){
                        console.log('ok');
                    }

                }
            };

            http.send(vars);
        }

        setTimeout(function(){window.location.href = 'homeanziano.html';}, 200);
    }
}

function resetBackButton(div){
    switch (div){
        case 'dataOra':
            document.getElementById("back").setAttribute( "onclick", "window.location.href='homeanziano.html'" );
            break;
        case 'selezionaUtente':
            document.getElementById("back").setAttribute( "onclick", "hideDiv('dataOra', 'firstPage'); resetBackButton('dataOra')" );
            break;
        case 'riepilogo':
            document.getElementById("back").setAttribute( "onclick", "hideDiv('selezionaUtente', 'dataOra'); resetBackButton('selezionaUtente')" );
            break;
    }
}

function confermaServ(){
    if(idServizioScelto != -1){
        hideDiv('firstPage', 'dataOra');
        document.getElementById("back").setAttribute("onclick", "hideDiv('dataOra', 'firstPage'); resetBackButton('dataOra');");
    }
  }

function confermaDataOra(){
    getDateTime();
    if(data != 0 && ora !=0){
        document.getElementById("listaUtenti").innerHTML = '';
        hideDiv('dataOra', 'selezionaUtente');
        displayListaUtenti();
        document.getElementById("back").setAttribute("onclick", "hideDiv('selezionaUtente', 'dataOra'); resetBackButton('selezionaUtente');");
    }
}

function confermaUtenti(){
    document.getElementById("utentiSelezionati").innerHTML = '';
    hideDiv('selezionaUtente', 'riepilogo');
    displayRiepilogoRichiesta();
    document.getElementById("back").setAttribute("onclick", "hideDiv('riepilogo', 'selezionaUtente'); resetBackButton('riepilogo');");
}
