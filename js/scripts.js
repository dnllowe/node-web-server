'use strict';

// Initialize Javascript event listeners
function init(){
    var body = document.getElementById('body');
    loadPhp();
}

function loadPhp() {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if(http.readyState === 4 && http.status === 200) {
            document.getElementById('ajaxRequest').innerHTML = 
                http.responseText;
        }
    }
    
    http.open('GET', 'test.js');
    http.send();
} 
