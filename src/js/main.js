//==========INITIALISATION DES PROPRIETES==========
function Main(){
    /**
     * Appel du constructeur de THREE.Scene
     */
    THREE.Scene.call(this);
    /**
     * Tableau contenant les objets de la scene
     */
    this.tirTab = new Array();
    this.tirEnnemiTab = new Array();
    this.asteroidTab = new Array();
    this.petitAstreTab = new Array();
    this.jokerVie = new Array();
    this.jokerArme = new Array();
    this.jokerAcc = new Array();
    /**
     * Au départ je pensé géré plusieurs ennemi qui tire en même temps, mais c'était trop compliqué
     * par rapport a l'effacement des tirs au bout d'une certaine distance, j'ai tout de même gardé
     * un tableau d'ennemi
     */
    this.ennemiTab = new Array();
    /**
     * Bool utilisé pour le déplacement/tir des vaisseau ennemi
     */
    this.vaisseauRotate = false;
    this.vaisseauTir = false;
    /**
     * Différente valeur incrémenté selon certain évènement en jeu
     */
    this.EnnemiTotal;
    this.lvlActuel;
    this.grosTot;
    this.petitTot;
    this.nbVie;
    this.jokerSuivant;
    this.vitesseEnnemi;
    this.rotateEnnemi;
    /**
     * Différents objet de gestion
     */
    this.interface = new Interface(this);
    this.son = new Son();
    /**
     * Boolean utile au bon déroulement du jeu
     */
    this.accnonvis = false;
    this.departMenu = true;
    this.invincible = false;
    this.avancementSon = false;
    this.ArmeUp = false;
    this.attenteTir = false;
    this.accArme = false;
    this.periodeDebut = false; 
    /**
     * Liste des états possible en jeu
     */
    this.etatspossibles = {
        DEMARRAGE: 1,
        ACCEUIL: 2,
        INGAME: 3,
        GAMEOVER: 4,
        ENDGAME: 5
    };
    this.etat = this.etatspossibles.ACCEUIL;
    /**
     * Variable de Three.js
     */
    this.camera;
    this.obj;
    this.pivot;
    /**
     * bolean pour la caméra
     */
    this.vueFps;
    this.vueCentre;
    /**
     * Limite du plateau
     */
    this.limite = new THREE.Group();
};
/**
 * Surcharge de la classe Main
 * Ma "classe" Main hérite de THREE.Scene
 */
Main.prototype = Object.create(THREE.Scene.prototype);
Main.prototype.constructor = Main;
//==========INITIALISATION==========
Main.prototype.init = function(){
    /**
     * Initialisation de début de game
     */
    this.pivot =  new THREE.Group();
    this.EnnemiTotal = 0;
    this.lvlActuel = 1;
    this.grosTot = 0;
    this.petitTot = 0;
    this.nbVie = 2;
    this.jokerSuivant = 0;
    this.vueFps = false;
    this.vueCentre = false;
    this.vitesseEnnemi = 0.3;
    this.rotateEnnemi = 0;
    this.periodeDebut = true;
    /**
     * Audio
     */
    this.son.init();
    this.son.musique["Acceuil"].loop(true);
    this.son.musique["Acceuil"].play();
    /**
     * Skybox
     * La skybox est un cube
     */
    var geometry = new THREE.CubeGeometry(1000,1000,1000);
    var cubeMaterials = 
    [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/skybox/sky2/front.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/skybox/sky2/back.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/skybox/sky2/top.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/skybox/sky2/bottom.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/skybox/sky2/right.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/skybox/sky2/left.jpg"),side: THREE.DoubleSide}),
    ];
    var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterials);
    var cube = new THREE.Mesh(geometry,cubeMaterials);
    this.add(cube);
    this.add(this.limite);
    var _this = this;
    for (var j = 0;j<4;j++){
        if(j==0){
            var geometry = new THREE.CylinderGeometry( 0.75, 0.75, 80, 4 );
            var material = new THREE.MeshBasicMaterial( {color: 0xf40505} );
            var cylinder = new THREE.Mesh( geometry, material );
            _this.limite.add(cylinder);
            cylinder.position.x = 85.2;
        }
        if(j==1){
            var geometry = new THREE.CylinderGeometry( 0.75, 0.75, 80, 4 );
            var material = new THREE.MeshBasicMaterial( {color: 0xf40505} );
            var cylinder = new THREE.Mesh( geometry, material );
            _this.limite.add(cylinder);
            cylinder.position.x = -85.2;
        }
        if(j==2){
            var geometry = new THREE.CylinderGeometry( 0.75, 0.75, 170, 4 );
            var material = new THREE.MeshBasicMaterial( {color: 0xf40505} );
            var cylinder = new THREE.Mesh( geometry, material );
            _this.limite.add(cylinder);
            cylinder.position.y = 40.2;
            cylinder.rotateZ(45.555);
        }
        if(j==3){
            var geometry = new THREE.CylinderGeometry( 0.75, 0.75, 170, 4 );
            var material = new THREE.MeshBasicMaterial( {color: 0xf40505} );
            var cylinder = new THREE.Mesh( geometry, material );
            _this.limite.add(cylinder);
            cylinder.position.y = -40.2;
            cylinder.rotateZ(45.555);
        }
    }
    /**
     * Load de l'objet X-Wing, réalisé via blender et exporté au format Collada (.dae)
     */
    var loadingManager = new THREE.LoadingManager( function() {
        /**
         * J'utilise un pivot et une box3 pour recentré mon objet, sans ça, le point central
         * de l'objet se situe sur son aile droite et non au niveau du cockpit.
         * C'est un probleme par rapport aux rotation de l'objet et au départ des tirs.
         */
        _this.add( _this.pivot );
        _this.pivot.add( _this.obj );
        var box = new THREE.Box3().setFromObject( _this.obj );
        box.center( _this.obj.position ); // re-sets la position de mon objet.
        _this.obj.position.multiplyScalar( - 1 );
    } );
    var loader = new THREE.ColladaLoader( loadingManager );
    loader.load( 'src/medias/models/X-WING.dae', function ( collada ) {
        _this.obj = collada.scene;
    } );
    /**
     * LVL
     * Creation des asteroid en fonction du niveau actuel.
     */
    /**
     * Interface
     */
    this.interface.init();
    /**
     * Clavier
     */
    this.clavier();
    /**
     * Camera
     */
    this.creationCamera();
    /**
     * Lumière
     */
    var light = new THREE.DirectionalLight( 0xFFFFFF, 0.8 );
    light.position.set( 0, 0, 50 );
    this.add(light);
};
//==========ANIMATION==========
/**
 * Différente animations du jeu selon l'état de celui-ci
 */
Main.prototype.animate = function(){
    if (this.etat == this.etatspossibles.DEMARRAGE){
        this.interface.afficheLvl(this.lvlActuel);
        this.periodeDebut = true;
    }
    if (this.etat == this.etatspossibles.INGAME){
        /**
         * Actualisation de la caméra celont le mode choisi
         */
        /*if (this.vueFps){
            this.cameraFPS();
        }*/
        if (this.vueCentre){
            this.cameraCentre();
        }
        /**
         * Déplacement des différents objet
         */
        this.deplacementTirEnnemi();
        this.deplacementTir();
        this.deplacementAstre();
        this.deplacementJokerVie();
        this.deplacementJokerArme();
        this.deplacementjokerAcc();
        this.deplacementVaisseauEnnemi();
        if (this.EnnemiTotal == 0){
            for(var i = 0;this.tirTab.length;i++){
                this.remove(tirTab[i]);
            }
            this.tirTab = [];
            this.removejoker();
            this.lvlActuel += 1;
            this.interface.afficheJoker();
            if (this.lvlActuel != 11){
                this.son.effet["applause"].play();
            }
            this.etat = this.etatspossibles.DEMARRAGE;
        }
        if (this.lvlActuel == 11){
            this.son.musique["spaceWolfTheme"].fade(0.8, 0.0, 1000);
            this.son.musique["victoire"].play();
            this.etat = this.etatspossibles.ENDGAME;
        }
    }
    if (this.etat == this.etatspossibles.GAMEOVER){
        this.interface.afficheGameOver();
    }
    if (this.etat == this.etatspossibles.ENDGAME){
        this.interface.afficheFin();
    }
    kd.tick();
};
//==========GESTION CLAVIER==========
/**
 * Différente commande une fois en jeu
 */
Main.prototype.clavier = function(){
    var _this = this;
    /**
     * La touche ENTER permet de passé les différents écran du jeu
     */
    kd.ENTER.press(function(){
        /**
         * Bien vérifié que l'on se trouve à l'acceuil
         */
        if (_this.etat == _this.etatspossibles.ACCEUIL){
            /**
             * Masque l'ecran d'acceuil, déplace la camera, puis affiche démarre
             */
            _this.camera.position.z = 55;
            _this.son.musique["Acceuil"].fade(0.8, 0.0, 1000);
            _this.son.musique["spaceWolfTheme"].fade(0.0, 0.8, 1000);
            _this.son.musique["spaceWolfTheme"].loop(true);
            _this.son.musique["spaceWolfTheme"].play();
            _this.interface.cacheAcceuil();
            _this.interface.afficheHUD();
            _this.interface.afficheJoker();
            _this.interface.afficheVie(_this.nbVie);
            _this.etat = _this.etatspossibles.DEMARRAGE;
            return;
        }
        if (_this.etat == _this.etatspossibles.DEMARRAGE){
            /**
             * Période d'invincibilité, ça évite de se faire tuer instantanément
             */
            _this.InvincibleRepop();
            _this.Clignotement();
            /**
             * Masque l'ecran du niveau
             */
            _this.interface.cacheLvl();
            _this.gestionLvl(_this.lvlActuel);
            _this.etat = _this.etatspossibles.INGAME;
            return;
        }
        if (_this.etat == _this.etatspossibles.GAMEOVER || _this.etat == _this.etatspossibles.ENDGAME){
            /**
             * Reset du jeu
             */
            if (_this.etat == _this.etatspossibles.ENDGAME){
                _this.remove(_this.pivot);
            }
            _this.interface.cacheLvl();
            for (var p=0;p < _this.grosTot;p++){
                _this.remove(_this.asteroidTab[p]);
            }
            for (var j=0;j < _this.petitTot;j++){
                _this.remove(_this.petitAstreTab[j]);
            }
            for (var k=0;k < _this.ennemiTab.length;k++){
                _this.remove(_this.ennemiTab[k]);
            }
            for (var e=0;e<_this.tirEnnemiTab.length;e++){
                _this.remove(_this.tirEnnemiTab[e]);
            }
            _this.tirEnnemiTab = [];
            _this.ennemiTab = [];
            _this.asteroidTab = [];
            _this.petitAstreTab = [];
            _this.etat = _this.etatspossibles.ACCEUIL;
            _this.son.musique["victoire"].stop();
            _this.son.musique["GameOver"].stop();
            _this.init();
            return;
        }
    });
    /**
     * FullScreen
     */
    kd.F.press(function() {
        if(_this.etat === _this.etatspossibles.INGAME){
            /**
             * redimensionne correctement le fullscreen.
             */
            THREEx.WindowResize.bind(renderer, this.camera);
            if (THREEx.FullScreen.activated()) {
                THREEx.FullScreen.cancel();
            } else {
                THREEx.FullScreen.request();
            }
        }
    });
    /**
     * Affiche les aides du jeu
     */
    kd.H.press(function(){
        if (document.getElementById("aide").style.visibility === "visible") {
            document.getElementById("aide").style.visibility = "hidden";
            if (_this.accnonvis){
                _this.interface.afficheAcceuil();
                _this.accnonvis = false;
            }
        } else if (document.getElementById("aide").style.visibility === "hidden") {
            document.getElementById("aide").style.visibility = "visible";
            if (document.getElementById("centre").style.visibility === "visible"){
                _this.interface.cacheAcceuil();
                _this.accnonvis = true;
            }
        } else {
        }
    });
    /**
     * Capture d'écran
     */
    kd.P.press(function() {
        var dataUrl = renderer.domElement.toDataURL("img/jpeg");
        var iframe = "<iframe width='100%' height='100%' src='" + dataUrl + "'></iframe>";
        var nouvelOnglet = window.open();
        nouvelOnglet.document.write(iframe);
        nouvelOnglet.document.close();
    });
    /**
     * Mon clavier ne prend pas en compte l'appuis simultané de LEFT, UP et SPACE.
     * Donc la touche pour aller à gauche est régler sur DOWN pour les tests, décomentez
     * la fonction suivante et commentez la fonction kd.DOWN.down pour régler
     * la touche gauche sur left... (normalement déjà fait pour vous)
     */
    /**
     * Rotation gauche
     */
    kd.LEFT.down(function(){
        if(_this.etat === _this.etatspossibles.INGAME){
            _this.pivot.rotateZ(0.05);
        }
    });
    /*
    kd.DOWN.down(function(){
        if(_this.etat === _this.etatspossibles.INGAME){
            _this.pivot.rotateZ(0.05);
        }
    });
    */
    /**
     * Rotation droite
     */
    kd.RIGHT.down(function(){
        if(_this.etat === _this.etatspossibles.INGAME){
            _this.pivot.rotateZ(-0.05);
        }
    });
    /**
     * Déplacement selon l'orientation du vaisseau
     */
    kd.UP.down(function(){
        if(_this.etat === _this.etatspossibles.INGAME){
            if (_this.avancementSon == false){
                _this.son.effet["avance"].play();
                _this.avancementSon == true;
            }
            _this.pivot.translateX(0.5);
            _this.repositionnement(_this.pivot);
        }
    });
    /**
     * arrêt de l'effet d'avancement si on relache la touche
     */
    kd.UP.up(function () {
        _this.avancementSon == false;
        _this.son.effet["avance"].stop();
      });
    /**
     * Boutton de tir
     */
    kd.SPACE.press(function(){
        if(_this.etat === _this.etatspossibles.INGAME){
            if(_this.attenteTir == false){
                _this.son.effet["tir"].stop();
                _this.son.effet["tir"].play();
                if(_this.ArmeUp == false){
                    var geometry = new THREE.SphereGeometry( 0.5, 3.2, 3.2 );
                    var material = new THREE.MeshBasicMaterial( {color: 0x000000, wireframe : false} );
                    var tir = new THREE.Mesh( geometry, material );
                    tir.position.x = _this.pivot.position.x;
                    tir.position.y = _this.pivot.position.y;
                    tir.rotation.z = _this.pivot.rotation.z;
                    _this.add(tir);
                    _this.tirTab.push(tir);
                }
                if (_this.ArmeUp == true){
                    for(var i = 0;i<3;i++){
                        var geometry = new THREE.SphereGeometry( 0.5, 3.2, 3.2 );
                        var material = new THREE.MeshBasicMaterial( {color: 0x000000, wireframe : false} );
                        var tir = new THREE.Mesh( geometry, material );
                        tir.position.x = _this.pivot.position.x;
                        tir.position.y = _this.pivot.position.y;
                        if (i==0){
                            tir.rotation.z = _this.pivot.rotation.z;
                        }
                        if (i==1){
                            tir.rotation.z = _this.pivot.rotation.z - 0.25;
                        }
                        if (i==2){
                            tir.rotation.z = _this.pivot.rotation.z + 0.25;
                        }
                        _this.add(tir);
                        _this.tirTab.push(tir);
                    }
                }
                if (_this.accArme == false){
                    _this.attenteTir = true;
                    setTimeout (function (){
                        _this.attenteTir = false
                    },(650));
                }
                if (_this.accArme == true){
                    _this.attenteTir = true;
                    setTimeout (function(){
                        _this.attenteTir = false
                    },(200));
                }
            }
        }
    });
    /**
     * Boutton de triche permettant la destruction des ennemis
     */
    kd.K.press(function(){
        _this.son.effet["tricheur"].play();
        for (var p=0;p < _this.grosTot;p++){
            _this.remove(_this.asteroidTab[p]);
        }
        for (var j=0;j < _this.petitTot;j++){
            _this.remove(_this.petitAstreTab[j]);
        }
        for (var k=0;k < _this.ennemiTab.length;k++){
            _this.remove(_this.ennemiTab[k]);
        }
        for (var i=0;i<_this.tirEnnemiTab.length;i++){
            _this.remove(_this.tirEnnemiTab[i]);
        }
        _this.grosTot = 0;
        _this.petitTot = 0;
        _this.EnnemiTotal = 0;
        _this.tirEnnemiTab = [];
        _this.ennemiTab = [];
        _this.asteroidTab = [];
        _this.petitAstreTab = [];
    });
    /**
     * Boutton de triche permettant l'invincibilité
     */
    kd.I.press(function(){
        _this.son.effet["invincible"].play();
        _this.invincible = true;
    });
    /**
     * Boutton pour couper/remettre la musique
     */
    kd.M.press(function(){
        _this.son.couperMusique();
    });
    /**
     * Boutton de triche pour les testé les différents joker
     */
    kd.J.press(function(){
        _this.son.effet["tricheur"].play();
        if (_this.jokerSuivant == 0){
            _this.son.effet["vie"].play();
            _this.nbVie = _this.nbVie + 1;
            _this.interface.afficheVie(_this.nbVie);
            _this.jokerSuivant = _this.jokerSuivant + 1;
            return;
        }
        if (_this.jokerSuivant == 1){
            _this.son.effet["arme"].play();
            _this.ArmeUp = true;
            _this.interface.afficheJoker();
            _this.jokerSuivant = _this.jokerSuivant + 1;
            return;
        }
        if (_this.jokerSuivant == 2){
            _this.son.effet["acc"].play();
            _this.accArme = true;
            _this.interface.afficheJoker();
            _this.jokerSuivant = 0;
            return;
        }
    })
    /**
     * Camera de base
     * Mon clavier n'ayant pas pavé numérique, j'ai choisi d'autre touche pour le changement de
     * caméra, plutot que 0,1,2 etc.
     */
    kd.L.press(function(){
        _this.camera.position.x = 0;
        _this.camera.position.y = 0;
        _this.camera.position.z = 55;
        _this.vueCentre = false;
        _this.vueFps = false;
    });
    /**
     * Camera FPS
     */
    /*
    kd.U.press(function(){
        _this.cameraFPS(0);
        _this.vueCentre = false;
        _this.vueFps = true;
    });
    */
    /**
     * Camera Centré
     */
    kd.Y.press(function(){
        _this.cameraCentre();
        _this.vueCentre = true;
        _this.vueFps = false;
    });
    
};
//==========GESTION CAMERA==========
/**
 * Creation de la caméra initiale
 */
Main.prototype.creationCamera = function(){
    var _this = this;
    _this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    _this.camera.position.z = 5000;//la caméra est initialement placé en dehors de la skybox
};
/**
 * Caméra FPS
 * Je n'ai pas réussi à implémenté cette caméra...
 */
/*
Main.prototype.cameraFPS = function(){
    this.camera.position.x = this.pivot.position.x * Math.cos( this.pivot.rotation.z) - 10;
    this.camera.position.y = this.pivot.position.y;
    this.camera.position.z = this.pivot.position.z;
    this.camera.lookAt(this.pivot.position.x,this.pivot.position.y,this.pivot.position.z);
    this.pivot.add(camera);
};
/*
/**
 * Caméra centré
 */
Main.prototype.cameraCentre = function(){
    this.camera.position.x = this.pivot.position.x;
    this.camera.position.y = this.pivot.position.y;
    this.camera.position.z = this.pivot.position.z + 25;
    this.camera.lookAt(this.pivot.position.x,this.pivot.position.y,this.pivot.position.z);
}
//==========GESTION DES ENNEMIS===========
/**
 * Création des gros astréroids
 */
Main.prototype.creationAsteroid = function(){
    _this = this;
    var chemin = 'src/medias/models/Asteroid.dae';
    var asteroid;
    var loadingManager = new THREE.LoadingManager(function(){
        _this.add(asteroid);
        _this.asteroidTab.push(asteroid);
    });
    var loader = new THREE.ColladaLoader(loadingManager);
        loader.load( chemin, function (collada){
        asteroid = collada.scene;
        asteroid.position.x = Math.floor(Math.random() * (85 + 85 + 1)) - 85;
        asteroid.position.y = Math.floor(Math.random() * (40 + 40 + 1)) - 40;
        asteroid.rotation.z = Math.random() * (Math.PI*2);
        asteroid.scale.set(0.1,0.1,0.1);
    });
};
/**
 * Création des petits astéroids
 */
Main.prototype.creationPetitAsteroid = function(astreCentre){
    _this = this;
    var chemin = 'src/medias/models/Asteroid.dae';
    var asteroid;
    var loadingManager = new THREE.LoadingManager(function(){
        _this.add(asteroid);
        _this.petitAstreTab.push(asteroid);
    });
    var loader = new THREE.ColladaLoader( loadingManager );
        loader.load( chemin, function ( collada ){
        asteroid = collada.scene;
        asteroid.position.x = astreCentre.x;
        asteroid.position.y = astreCentre.y;
        asteroid.rotation.z = Math.random() * (Math.PI*2);
        asteroid.scale.set(0.05,0.05,0.05);
    });
};
/**
 * Création de vaisseau ennemi
 */
Main.prototype.creationEnnemiVaisseau = function(){
    _this = this;
    var chemin = 'src/medias/models/Mechant.dae';
    var ennemi;
    var loadingManager = new THREE.LoadingManager(function(){
        _this.add(ennemi);
        _this.ennemiTab.push(ennemi);
        _this.vaisseauRotate=false;
        _this.vaisseauTir=false;
    });
    var loader = new THREE.ColladaLoader( loadingManager );
        loader.load( chemin, function ( collada ){
        ennemi = collada.scene;
        ennemi.position.x = Math.floor(Math.random() * (85 + 85 + 1)) - 85;
        ennemi.position.y = Math.floor(Math.random() * (40 + 40 + 1)) - 40;
        ennemi.scale.set(0.01,0.01,0.01);
    });
};
/**
 * Tir ennemi
 */
Main.prototype.TirEnnemi = function (mechant){
    for(var i = 0; i< 3; i++){
        this.son.effet["tir"].stop();
        this.son.effet["tir"].play();
        var geometry = new THREE.SphereGeometry( 0.5, 3.2, 3.2 );
        var material = new THREE.MeshBasicMaterial( {color: 0xf10101, wireframe : false} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.x = mechant.position.x;
        sphere.position.y = mechant.position.y;
        if (i==0){
            sphere.rotation.z = mechant.rotation.z ;
        }
        if (i==1){
            sphere.rotation.z = mechant.rotation.z - 0.25;
        }
        if (i==2){
            sphere.rotation.z = mechant.rotation.z + 0.25;
        }
        this.add(sphere);
        this.tirEnnemiTab.push(sphere);
    }
};
//==========GESTION DES JOKERS==========
/**
 * Creation du joker vie
 */
Main.prototype.creationVie = function(centre){
    var geometry = new THREE.SphereGeometry(1.5, 9.6, 9.6);
    var material = new THREE.MeshBasicMaterial( {color: 0x08e812, wireframe : false} );
    var vie = new THREE.Mesh( geometry, material );
    vie.position.x = centre.x;
    vie.position.y = centre.y;
    vie.rotation.z = Math.random() * (Math.PI*2);
    this.add(vie);
    this.jokerVie.push(vie);
};
/**
 * Création du joker Arme
 */
Main.prototype.creationArme = function(centre){
    var geometry = new THREE.SphereGeometry(1.5, 9.6, 9.6);
    var material = new THREE.MeshBasicMaterial( {color: 0xf71b05, wireframe : false} );
    var arme = new THREE.Mesh( geometry, material );
    arme.position.x = centre.x;
    arme.position.y = centre.y;
    arme.rotation.z = Math.random() * (Math.PI*2);
    this.add(arme);
    this.jokerArme.push(arme);
}
/**
 * Création du joker AccelerationArme
 */
Main.prototype.creationAcc = function(centre){
    var geometry = new THREE.SphereGeometry(1.5, 9.6, 9.6);
    var material = new THREE.MeshBasicMaterial( {color: 0x052df4, wireframe : false} );
    var acc = new THREE.Mesh( geometry, material );
    acc.position.x = centre.x;
    acc.position.y = centre.y;
    acc.rotation.z = Math.random() * (Math.PI*2);
    this.add(acc);
    this.jokerAcc.push(acc);
}
/**
 * Supression joker
 */
Main.prototype.removejoker = function(){
    for(var i = 0;i<this.jokerVie.length;i++){
        this.remove(this.jokerVie[i]);
    }
    for(var j = 0;j<this.jokerArme.length;j++){
        this.remove(this.jokerArme[j]);
    }
    for(var k = 0;k<this.jokerAcc.length;k++){
        this.remove(this.jokerAcc[k]);
    }
    /**
     * On perd la capacité de l'arme de niveau en niveau
     */
    this.accArme = false;
    this.ArmeUp = false;
    this.jokerAcc=[];
    this.jokerArme=[];
    this.jokerVie=[];
};
//==========GESTION NIVEAU==========
/**
 * Création des niveau en fonction du niveau actuel
 */
Main.prototype.gestionLvl = function(lvl){
    if (lvl == 1){
        this.creationAsteroid();
        this.EnnemiTotal +=1;
        this.grosTot += 1 ; 
    }
    if (lvl == 2){
        for (var i = 0;i<lvl;i++){
            this.creationAsteroid();
            this.EnnemiTotal +=1;
            this.grosTot += 1 ;
        }
    }
    if (lvl == 3){
        for (var j = 0;j<lvl;j++){
            this.creationAsteroid();
            this.EnnemiTotal +=1;
            this.grosTot += 1 ;
        }
    }
    if (lvl == 4){
        this.creationEnnemiVaisseau();
        this.EnnemiTotal +=1;
    }
    if (lvl == 5){
        this.vitesseEnnemi = 0.5;
        for (var i = 0;i<2;i++){
            this.creationAsteroid();
            this.EnnemiTotal +=1;
            this.grosTot += 1 ;
        }
    }
    if (lvl == 6){
        for (var i = 0;i<4;i++){
            this.creationAsteroid();
            this.EnnemiTotal +=1;
            this.grosTot += 1 ;
        }
        this.creationEnnemiVaisseau();
        this.EnnemiTotal +=1;
    }
    if (lvl == 7){
        for (var i = 0;i<4;i++){
            this.creationAsteroid();
            this.EnnemiTotal +=1;
            this.grosTot += 1 ;
        }
        this.creationEnnemiVaisseau();
        this.EnnemiTotal +=1;
    }
    if (lvl == 8){
        this.vitesseEnnemi = 0.7;
        for (var i = 0;i<2;i++){
            this.creationAsteroid();
            this.EnnemiTotal +=1;
            this.grosTot += 1 ;
        }
    }
    if (lvl == 9){
        for (var i = 0;i<3;i++){
            this.creationAsteroid();
            this.EnnemiTotal +=1;
            this.grosTot += 1 ;
        }        
    }
    if (lvl == 10){
        for (var i = 0;i<4;i++){
            this.creationAsteroid();
            this.EnnemiTotal +=1;
            this.grosTot += 1 ;
        }
        this.creationEnnemiVaisseau();
        this.EnnemiTotal +=1;
    }
};
//==========GESTION DES DEPLACEMENT==========
/**
 * je gère la collision des missile dans ces fonctions
 */
Main.prototype.deplacementTir = function(){
    _this = this;
    var vieOuPasVie;
    var armeOuPasArme;
    var accOuPasAcc;
    for (var i = 0 ; i < _this.tirTab.length ; i++){
        _this.tirTab[i].translateX(2);
        _this.distanceTirToShip(_this.tirTab[i], i);
        var tirCentre = _this.getCenterPoint(_this.tirTab[i]);
        for (var p=0;p<_this.asteroidTab.length;p++){
            var astreCentre = _this.getCenterPoint(_this.asteroidTab[p]);
            if (tirCentre.distanceTo(astreCentre)<11){
                vieOuPasVie = _this.getRandom(0, 12);
                armeOuPasArme = _this.getRandom(0, 12);
                accOuPasAcc = _this.getRandom(0, 12);
                if (vieOuPasVie > 3 && vieOuPasVie < 4){
                    _this.creationVie(astreCentre);
                }
                if (armeOuPasArme > 3 && armeOuPasArme < 4){
                    if (_this.ArmeUp == false){
                        _this.creationArme(astreCentre);
                    }
                }
                if (accOuPasAcc > 3 && accOuPasAcc < 4){
                    if (_this.accArme == false){
                        _this.creationAcc(astreCentre);
                    }
                }
                _this.son.effet["explosionAstre"].play();
                for (var k=0;k<3;k++){
                    _this.creationPetitAsteroid(astreCentre);
                    _this.petitTot += 1;
                    _this.EnnemiTotal += 1;
                }
                _this.remove(_this.tirTab[i]);
                _this.tirTab.splice(i, 1);
                _this.remove(_this.asteroidTab[p]);
                _this.asteroidTab.splice(p, 1);
                _this.EnnemiTotal = _this.EnnemiTotal - 1;
            }
        }
        for (var j=0;j<_this.petitAstreTab.length;j++){
            var astreCentre = _this.getCenterPoint(_this.petitAstreTab[j]);
            if (tirCentre.distanceTo(astreCentre)<5.5){
                vieOuPasVie = _this.getRandom(0, 12);
                armeOuPasArme = _this.getRandom(0, 12);
                accOuPasAcc = _this.getRandom(0, 12);
                if (vieOuPasVie > 3 && vieOuPasVie < 4){
                    _this.creationVie(astreCentre);
                }
                if (armeOuPasArme > 3 && armeOuPasArme < 4){
                    if (_this.ArmeUp == false){
                        _this.creationArme(astreCentre);
                    }
                }
                if (accOuPasAcc > 3 && accOuPasAcc < 4){
                    if (_this.accArme == false){
                        _this.creationAcc(astreCentre);
                    }
                }
                _this.son.effet["explosionAstre"].play();
                _this.remove(_this.petitAstreTab[j]);
                _this.petitAstreTab.splice(j, 1);
                _this.EnnemiTotal = _this.EnnemiTotal - 1;
                _this.remove(_this.tirTab[i]);
                _this.tirTab.splice(i, 1);
            }
        }
        for (var k=0;k<_this.ennemiTab.length;k++){
            var astreCentre = _this.getCenterPoint(_this.ennemiTab[k]);
            if (tirCentre.distanceTo(astreCentre)<5.5){
                vieOuPasVie = _this.getRandom(0, 12);
                armeOuPasArme = _this.getRandom(0, 12);
                accOuPasAcc = _this.getRandom(0, 12);
                if (vieOuPasVie > 3 && vieOuPasVie < 4){
                    _this.creationVie(astreCentre);
                }
                if (armeOuPasArme > 3 && armeOuPasArme < 4){
                    if (_this.ArmeUp == false){
                        _this.creationArme(astreCentre);
                    }
                }
                if (accOuPasAcc > 3 && accOuPasAcc < 4){
                    if (_this.accArme == false){
                        _this.creationAcc(astreCentre);
                    }
                }
                _this.son.effet["explosionAstre"].play();
                for (var e =0;e<_this.tirEnnemiTab.length;e++){
                    _this.remove(_this.tirEnnemiTab[e]);
                    _this.tirEnnemiTab.splice(e,1);
                }
                _this.remove(_this.ennemiTab[k]);
                _this.ennemiTab.splice(k, 1);
                _this.EnnemiTotal = _this.EnnemiTotal - 1;
                _this.remove(_this.tirTab[i]);
                _this.tirTab.splice(i, 1);
            }
        }
    }
}
/**
 * Deplacement + gestion collision des tirs ennemis
 */
Main.prototype.deplacementTirEnnemi = function(){
    _this = this;
    for (var i=0;i<_this.tirEnnemiTab.length;i++){
        var tirCentreEn = _this.getCenterPoint(_this.tirEnnemiTab[i]);
        _this.tirEnnemiTab[i].translateX(1.5);
        _this.distanceTirToEnnemiShip(_this.tirEnnemiTab[i], i);
        for (var p=0;p<_this.asteroidTab.length;p++){
            var astreCentreEn = _this.getCenterPoint(_this.asteroidTab[p]);
            if (tirCentreEn.distanceTo(astreCentreEn)<11){
                _this.remove(_this.tirEnnemiTab[i]);
                _this.tirEnnemiTab.splice(i, 1);
            }
        }
        for (var j=0;j<_this.petitAstreTab.length;j++){
            var astreCentreEn = _this.getCenterPoint(_this.petitAstreTab[j]);
            if (tirCentreEn.distanceTo(astreCentreEn)<5.5){
                _this.remove(_this.tirEnnemiTab[i]);
                _this.tirEnnemiTab.splice(i, 1);
            }
        }
        if (tirCentreEn.distanceTo(_this.pivot.position)<1){
            if (this.nbVie == 0){
                this.mort();
            }else{
                this.pasmort();
            }
        }
    }
};
/**
 * la gestion des collision des astres avec le vaisseau est réaliser dans cette fonction
 */
Main.prototype.deplacementAstre = function(){
    for (var i=0;i<this.asteroidTab.length;i++){
        /**
         * Simulation d'une rotation des astres
         */
        if (i%2 == 0){
            this.asteroidTab[i].rotateZ(this.getRandom(-0.02,-0.001));
        }
        else{
            this.asteroidTab[i].rotateZ(this.getRandom(0.001,0.02));
        }
        this.asteroidTab[i].translateX(this.vitesseEnnemi);
        this.repositionnement(this.asteroidTab[i]);
        this.rencontre(this.asteroidTab[i]);
        var astreCentre = this.getCenterPoint(this.asteroidTab[i]);
        var centreShip = this.getCenterPoint(this.pivot);
        if (centreShip.distanceTo(astreCentre)<9){
            if (this.nbVie == 0){
                this.mort();
            }else{
                this.pasmort();
            }
        }
    }
    for (var j=0;j<this.petitAstreTab.length;j++){
        if (j%2 == 0){
            this.petitAstreTab[j].rotateZ(this.getRandom(-0.02,-0.001));
        }
        else{
            this.petitAstreTab[j].rotateZ(this.getRandom(0.001,0.02));
        }
        this.petitAstreTab[j].translateX(this.vitesseEnnemi + 0.1);
        this.repositionnement(this.petitAstreTab[j]);
        this.rencontre(this.petitAstreTab[j]);
        var astreCentre = this.getCenterPoint(this.petitAstreTab[j]);
        var centreShip = this.getCenterPoint(this.pivot)
        if (centreShip.distanceTo(astreCentre)<4.5){
            if (this.nbVie == 0){
                this.mort();
            }else{
                this.pasmort();
            }
        }
    }
};
/**
 * Mouvement des astres par rapports aux autres
 */
Main.prototype.rencontre = function(astre){
    for (var i=0;i<this.asteroidTab.length;i++){
        if (astre != this.asteroidTab[i]){
            var astreCentre = this.getCenterPoint(this.asteroidTab[i]);
            var centreAstre = this.getCenterPoint(astre);
            if (centreAstre.distanceTo(astreCentre)<9){
                this.asteroidTab[i].rotateZ(-5);
                astre.rotateZ(5);
            }
        }
    }
    for (var j=0;j<this.petitAstreTab.length;j++){
        if(astre != this.petitAstreTab[j]){
            var astreCentre = this.getCenterPoint(this.petitAstreTab[j]);
            var centreAstre = this.getCenterPoint(astre)
            if (centreAstre.distanceTo(astreCentre)<4){
                this.petitAstreTab[j].rotateZ(5);
                astre.rotateZ(-5);
            }
        }
    }
}
/**
 * Déplacement de la vie
 */
Main.prototype.deplacementJokerVie = function(){
    for (var j=0;j<this.jokerVie.length;j++){
        this.jokerVie[j].translateX(0.3);
        this.repositionnement(this.jokerVie[j]);
        var jokerCentre = this.getCenterPoint(this.jokerVie[j]);
        var centreShip = this.getCenterPoint(this.pivot)
        if (centreShip.distanceTo(jokerCentre)<5){
            this.remove(this.jokerVie[j]);
            this.jokerVie.splice(j, 1);
            this.son.effet["vie"].play();
            this.nbVie = this.nbVie + 1;
            this.interface.afficheVie(this.nbVie);
        }
    }
}
/**
 * Déplacement de l'arme
 */
Main.prototype.deplacementJokerArme = function(){
    for (var j=0;j<this.jokerArme.length;j++){
        this.jokerArme[j].translateX(0.3);
        this.repositionnement(this.jokerArme[j]);
        var jokerCentre = this.getCenterPoint(this.jokerArme[j]);
        var centreShip = this.getCenterPoint(this.pivot)
        if (centreShip.distanceTo(jokerCentre)<5){
            this.remove(this.jokerArme[j]);
            this.jokerArme.splice(j, 1);
            this.son.effet["arme"].play();
            this.ArmeUp = true;
            this.interface.afficheJoker();
        }
    } 
}
/**
 * Déplacement Acceleration Arme
 */
Main.prototype.deplacementjokerAcc = function(){
    for (var j=0;j<this.jokerAcc.length;j++){
        this.jokerAcc[j].translateX(0.3);
        this.repositionnement(this.jokerAcc[j]);
        var jokerCentre = this.getCenterPoint(this.jokerAcc[j]);
        var centreShip = this.getCenterPoint(this.pivot)
        if (centreShip.distanceTo(jokerCentre)<5){
            this.remove(this.jokerAcc[j]);
            this.jokerAcc.splice(j, 1);
            this.son.effet["acc"].play();
            this.accArme = true;
            this.interface.afficheJoker();
        }
    }
}
/**
 * Déplacement du vaisseau ennemi
 */
Main.prototype.deplacementVaisseauEnnemi = function(){
    _this = this;
    for (var i=0;i<_this.ennemiTab.length;i++){
        _this.ennemiTab[i].translateX(this.vitesseEnnemi);
        _this.repositionnement(_this.ennemiTab[i]);
        var ennemiCentre = _this.getCenterPoint(_this.ennemiTab[i]);
        var centreShip = _this.getCenterPoint(_this.pivot);
        if (this.rotateEnnemi == 0){
            _this.ennemiTab[i].rotateZ(this.getRandom(0.005,0.025));
        }
        if (this.rotateEnnemi == 1){
            _this.ennemiTab[i].rotateZ(this.getRandom(-0.025,-0.005));
        }
        if (_this.vaisseauRotate == false){
            if (_this.rotateEnnemi == 0){
                _this.rotateEnnemi = 1;
            }
            else if (_this.rotateEnnemi == 1){
                _this.rotateEnnemi = 0;
            }
            _this.vaisseauRotate = true;
            setTimeout (function (){
                _this.vaisseauRotate = false;
            },(2000));
        }
        if (_this.vaisseauTir == false){
            _this.TirEnnemi(_this.ennemiTab[i]);
            _this.vaisseauTir = true;
            setTimeout (function (){
                _this.vaisseauTir = false;
            },(1500));
        }
        if (centreShip.distanceTo(ennemiCentre)<10){
            if (_this.nbVie == 0){
                _this.mort();
            }else{
                _this.pasmort();
            }
        }
    }
}
/**
 * Si un objet dépasse du cadre, on le repositionne à l'interieur de l'autre coté.
 * Espace de jeu : 40 x 85
 */
Main.prototype.repositionnement = function(Object){
    if (Object.position.x > 85){
        Object.position.x = -85;
    }
    if (Object.position.x < -85){
        Object.position.x = 85;
    }
    if (Object.position.y > 40){
        Object.position.y = -40;
    }
    if (Object.position.y < -40){
        Object.position.y = 40;
    }
}
//==========GESTION VIE/MORT DU HERO==========
/**
 * Notre brave pilote est décéde...
 */
Main.prototype.mort = function(){
    if (this.periodeDebut == false){
        if (this.invincible == false){
            this.son.effet["mort"].play();
            this.remove(this.pivot);
            this.son.musique["spaceWolfTheme"].fade(0.8, 0.0, 1000);
            this.son.musique["GameOver"].play();
            this.etat = this.etatspossibles.GAMEOVER;
        }else{
            console.log("la triche vous à sauvé ;)");
            this.pasmort;
        }
    }
}
/**
 * Fonction permettant l'arrêt de l'incibilité lié au repop et au debut de niveau
 */
Main.prototype.InvincibleRepop = function(){
    _this = this;
    if(_this.periodeDebut == true){
        console.log("invincible");
        setTimeout (function(){
            _this.periodeDebut = false;
            console.log("plus invincible");
        },(3000));
    }
};
/**
 * Clignotement lié à la période d'invincibilité du vaisseau
 */
Main.prototype.Clignotement = function(){
    _this = this;
    for(var i=0; i<26; i++){
        if (i%2 == 0){
            setTimeout(function (){
                _this.pivot.visible = false;
            }, 115*i);
        }else{
            setTimeout(function (){
                _this.pivot.visible = true;
            }, 115*i);
        }
    }
}
/**
 * Il lui reste encore de la vie !
 */
Main.prototype.pasmort = function(){
    if (this.periodeDebut == false){
        this.son.effet["mort"].play();
        this.pivot.position.x = 0;
        this.pivot.position.y = 0;
        if (this.invincible == false){
            this.nbVie = this.nbVie - 1;
        }
        this.periodeDebut = true;
        this.InvincibleRepop();
        this.Clignotement();
        this.interface.afficheVie(_this.nbVie);
    }
}
//==========GESTION DES POSITIONNEMENT==========
/**
 * Fonction qui renvoi le centre d'un objet passé en parametre
 */
Main.prototype.getCenterPoint = function(myObject3D) {
    /**
     * j'ai commenter le premier essai pour avoir le centre exact de chaque objet,
     * mais le jeu ramait beaucoup trop
     */
    /*
    var box = new THREE.Box3().setFromObject(myObject3D);
    box.translate(myObject3D.position);
    var objectCenter = new THREE.Vector3();
    box.getCenter(objectCenter);
    return objectCenter;
    */
   var objectCenter = new THREE.Vector3();
   objectCenter = myObject3D.position;
   return objectCenter;
};
/**
 * Calcule la distance d'un tir par rapport a la position du vaisseau
 */
Main.prototype.distanceTirToShip = function(tir, posTab){
    _this = this;
    if (tir.position.distanceTo(_this.pivot.position)>43){
        _this.remove(tir);
        _this.tirTab.splice(posTab, 1);
    }
};
Main.prototype.distanceTirToEnnemiShip = function(tir, posTab){
    _this = this;
    if (tir.position.distanceTo(_this.ennemiTab[0].position)>35){
        _this.remove(tir);
        _this.tirEnnemiTab.splice(posTab, 1);
    }
};
//==========GESTION MATH==========
/**
 * Fonction qui retourne un nombre aleatoire compris entre min et max
 */
Main.prototype.getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
};
//==========GESTION DES COLLISIONS==========
/**
 * ici, j'avais tenté de géré les collision avec un fonction, j'ai abandonnée car il y avait dees bug,
 * dans certain cas, la collision n'était pas géré
 */
/*
Main.prototype.collisionTir = function(tir){
    var tirCentre = _this.getCenterPoint(tir);
    _this = this;
    for (var i=0;i<this.asteroidTab.length;i++){
        var astreCentre = _this.getCenterPoint(_this.asteroidTab[i]);
        if (tirCentre.distanceTo(astreCentre)<13){
            for (var k=0;k<3;k++){
                _this.creationPetitAsteroid(astreCentre);
            }
            _this.remove(_this.asteroidTab[i]);
            _this.asteroidTab.splice(i, 1);
            return true;
        }else{
            return false;
        }
    }
};
Main.prototype.collisionTirPetitAstre = function(tir){
    var tirCentre = _this.getCenterPoint(tir);
    _this = this;
    for (var j=0;j<this.petitAstreTab.length;j++){
        var astreCentre = _this.getCenterPoint(_this.petitAstreTab[j]);
        if (tirCentre.distanceTo(astreCentre)<7){
            _this.remove(_this.petitAstreTab[j]);
            _this.petitAstreTab.splice(j, 1);
            return true;
        }else{
            return false;
        }
    }
};
*/