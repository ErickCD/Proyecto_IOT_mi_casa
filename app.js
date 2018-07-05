// Initialize Firebase
var config = {
    apiKey: "AIzaSyBSXPThieVyjdOF4PcQk_MPu95x6b3uGP0",
    authDomain: "micasa-9ded7.firebaseapp.com",
    databaseURL: "https://micasa-9ded7.firebaseio.com",
    projectId: "micasa-9ded7",
    storageBucket: "micasa-9ded7.appspot.com",
    messagingSenderId: "838513820096"
};

//Inicialización de firebase con las configuraciones anteriores
firebase.initializeApp(config);


//Variables en la página
var rele1 = document.getElementById("toggle1");
var rele2 = document.getElementById("toggle2");

var temperatura = document.getElementById("temperatura");
var iluminacion = document.getElementById("iluminacion");
var presencia = document.getElementById("presencia");
var movimiento = document.getElementById("movimiento");

var btnSalir = document.getElementById("btnSalir");

var correo = document.getElementById("inputEmail");
var password = document.getElementById("inputPassword");
var btnInicio = document.getElementById("btnInicio");

var divControles = document.getElementById("controles");
var divInicio = document.getElementById("divInicio");


var slider1 = new Slider('#ex1', {
    formatter: function (value) {
        return 'Current value: ' + value;
    }
});
var slider2 = new Slider('#ex2', {
    formatter: function (value) {
        return 'Current value: ' + value;
    }
});
var slider3 = new Slider('#ex3', {
    formatter: function (value) {
        return 'Current value: ' + value;
    }
});


//Constante de autentificación de firebase
const auth = firebase.auth();


btnInicio.addEventListener("click", function () {
    var password_t = password.value;
    var correo_t = correo.value;

    auth.signInWithEmailAndPassword(correo_t, password_t).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorMessage);
        // ...
    });

});

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in. ocultar divInicio y mostrar controles
        /*
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        */
        //Ocultar divInicio si la sesion inicio

        $("#divInicio").addClass("collapse");
        $("#controles").removeClass("collapse");

        var fb_rele1 = firebase.database().ref().child("rele1");
        var fb_rele2 = firebase.database().ref().child("rele2");

        var fb_temperatura = firebase.database().ref().child("temperatura");
        var fb_movimiento = firebase.database().ref().child("movimiento");
        var fb_presencia = firebase.database().ref().child("presencia");
        var fb_iluminacion = firebase.database().ref().child("iluminacion");

        var fb_red = firebase.database().ref().child("red");
        var fb_green = firebase.database().ref().child("green");
        var fb_blue = firebase.database().ref().child("blue");



        //Variables para los relevadores
        var t1 = 0, t2 = 0;

        //listener de relevador 1
        fb_rele1.on("value", function (snapshot) {
            //Para hacer función de apagado y encendido del toggle button
            if (snapshot.val() == 1){
                $("#toggle1").removeClass("btn-default").addClass("btn-success");
                t1 = 1;
            } else {
                $("#toggle1").removeClass("btn-success").addClass("btn-default");
                t1 = 0;
            }
        });
        //Listener del relevador 2
        fb_rele2.on("value", function (snapshot) {
            //Para hacer función de apagado y encendido del toggle button
            if (snapshot.val() == 1){
                $("#toggle2").removeClass("btn-default").addClass("btn-success");
                t2 = 1;
            } else {
                $("#toggle2").removeClass("btn-success").addClass("btn-default");
                t2 = 0;
            }
        });




        fb_red.on("value", function (snapshot) {
            slider1.setValue(snapshot.val());
        });
        fb_green.on("value", function (snapshot) {
            slider2.setValue(snapshot.val());
        });
        fb_blue.on("value", function (snapshot) {
            slider3.setValue(snapshot.val());
        });



        //Para las tarjetas***********************************************************************
        //Para iluminacion
        fb_iluminacion.on("value", function (snapshot) {
            iluminacion.innerHTML = snapshot.val() + "% de iluminación";
        });
        //Para temperatura
        fb_temperatura.on("value", function (snapshot) {
            temperatura.innerHTML = snapshot.val() + "°C";
        });
        //Para presencia
        fb_presencia.on("value", function (snapshot) {
            if (snapshot.val() == 1){
                presencia.innerHTML = "Hay presencia";
                $("#cardPresencia").addClass("bg-success").addClass("text-white");
            } else {
                presencia.innerHTML = "No hay presencia";
                $("#cardPresencia").removeClass("bg-success").removeClass("text-white");
            }
        });
        //Para movimiento
        fb_movimiento.on("value", function (snapshot) {
            if (snapshot.val() == 1){
                movimiento.innerHTML = "Hay movimiento";
                $("#cardMovimiento").addClass("bg-success").addClass("text-white");
            } else {
                movimiento.innerHTML = "No hay movimiento";
                $("#cardMovimiento").removeClass("bg-success").removeClass("text-white");
            }
        });


        //Envia el valor del relevador 1 a la base de datos
        rele1.addEventListener("click", function () {
            if(t1 == 1){
                fb_rele1.set(0);
            } else {
                fb_rele1.set(1);
            }
        });
        //Envia el valor del relevador 2 a la base de datos
        rele2.addEventListener("click", function () {
            if(t2 == 1){
                fb_rele2.set(0);
            } else {
                fb_rele2.set(1);
            }
        });

        
        //
        slider1.on("slideStop", function () {
            fb_red.set(slider1.getValue());
        });
        slider2.on("slideStop", function () {
            fb_green.set(slider2.getValue());
        });
        slider3.on("slideStop", function () {
            fb_blue.set(slider3.getValue());
        });

    } else {
        // User is signed out.
        // ... Ocultar controles y lanzar divInicio

        $("#controles").addClass("collapse");
        $("#divInicio").removeClass("collapse");
    }
});


btnSalir.addEventListener("click", function () {
   auth.signOut();
});