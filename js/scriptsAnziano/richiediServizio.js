var idServizioScelto = -1;
var note = '';
var data = 0;
var ora = 0;
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
    ora = document.getElementById('time').value;
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
    const url= ip + '/queryAnziano/listaUtenti.php';
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var vars = "id="+idServizioScelto;

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(http.responseText);

            for(i=0; i<result.length; i++){
                var checkbox = document.createElement('INPUT');
                checkbox.type = 'checkbox';
                checkbox.name = 'cb';
                var num = i+1;
                checkbox.id = 'cb'+num;

                var nome = document.createElement('LABEL');
                nome.setAttribute('for', checkbox.id);
                nome.id = result[i]['idOfferente'];
                nome.innerHTML = result[i]['nomeOfferente'] + ' ' + result[i]['cognomeOfferente'];

                var linkProfilo = document.createElement('A');
                linkProfilo.innerHTML = 'Visualizza profilo';
                linkProfilo.setAttribute("href", "#");
                linkProfilo.setAttribute("onclick", "localStorage.setItem('idUtente', '"+result[i]['idOfferente']+"'); window.location.href='profiloOfferente.html';");

                document.getElementById('listaUtenti').appendChild(checkbox);
                document.getElementById('listaUtenti').appendChild(nome);
                document.getElementById('listaUtenti').appendChild(linkProfilo);
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
    note = document.getElementById('messaggio').value;
}


function inviaRichiestaPreventivo(){
    for(i=0; i<idOfferenti.length; i++){
        const url= ip + '/queryAnziano/inviaPreventivo.php';
        var http = new XMLHttpRequest();
        http.open("POST", url, true);
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var vars = 'idAnziano=' + localStorage['idUtente'] + '&idOfferente=' + idOfferenti[i] + '&idServizio=' + idServizioScelto + '&data=' + data + '&ora=' + ora + '&note=' + note; //idAnziano, idOfferente, idServizio, note, data, ora, stato

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
}

function inviaRichiestaPrenotazione(){
    if( document.getElementById('messaggio').value != ''){
        console.log('note inserite');
        //display messaggio errore, le note non possono essere inserite
    } else {
        for(i=0; i<idOfferenti.length; i++){
            const url= ip + '/queryAnziano/inviaPrenotazione.php';
            var http = new XMLHttpRequest();
            http.open("POST", url, true);
            http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var vars = 'idAnziano=' + localStorage['idUtente'] + '&idOfferente=' + idOfferenti[i] + '&idServizio=' + idServizioScelto + '&data=' + data + '&ora=' + ora; //idAnziano, idOfferente, idServizio, data, ora, stato
    
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
    }
}