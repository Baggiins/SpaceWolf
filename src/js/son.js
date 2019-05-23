function Son() {
    this.musique = new Array();
    this.effet = new Array();
    this.uneMusiqueON = true;
};

Son.prototype.init = function() {
//==========MUSIQUE==========
    this.musique["Acceuil"] = new Howl({
        src: ['src/medias/sounds/musique/Menu.wav'],
        volume: 1.5,
        preload: true
    });
    this.musique["spaceWolfTheme"] = new Howl({
        src: ['src/medias/sounds/musique/airwolf_2.wav'],
        volume: 0.05,
        preload: true
    });
    this.musique["victoire"] = new Howl({
        src: ['src/medias/sounds/musique/victoire.wav'],
        volume: 1.0,
        preload: true
    });
    this.musique["GameOver"] = new Howl({
        src: ['src/medias/sounds/musique/GameOver.wav'],
        volume: 1.0,
        preload: true
    });
//==========EFFET==========
    this.effet["tir"] = new Howl({
        src: ['src/medias/sounds/effet/tir.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["explosionAstre"] = new Howl({
        src: ['src/medias/sounds/effet/ExplosionAstre.wav'],
        volume: 2.0,
        preload: true
    });
    this.effet["mort"] = new Howl({
        src: ['src/medias/sounds/effet/mort.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["vie"] = new Howl({
        src: ['src/medias/sounds/effet/vie.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["applause"] = new Howl({
        src: ['src/medias/sounds/effet/applauses.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["tricheur"] = new Howl({
        src: ['src/medias/sounds/effet/tricheur.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["avance"] = new Howl({
        src: ['src/medias/sounds/effet/avance.wav'],
        volume: 0.1,
        preload: true
    });
    this.effet["invincible"] = new Howl({
        src: ['src/medias/sounds/effet/Tricheur_invincible.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["arme"] = new Howl({
        src: ['src/medias/sounds/effet/arme.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["acc"] = new Howl({
        src: ['src/medias/sounds/effet/Acc.wav'],
        volume: 1.0,
        preload: true
    });
};

/**
 * Fonction de mute
 */
Son.prototype.couperMusique = function() {
    if (this.uneMusiqueON === true) {
        this.uneMusiqueON = false;
    } else {
        this.uneMusiqueON = true;
    }
    if (this.uneMusiqueON) {
        for (var m in this.musique) {
            this.musique[m].mute(false);
        }
    } else {
        for (var m in this.musique) {
            this.musique[m].mute(true);
        }
    }
};