function Interface(main){
    this.main = main;
};
Interface.prototype.init = function(main){
    document.getElementById("aide").style.visibility = "hidden";
    document.getElementById("hud").style.visibility = "hidden";
    this.afficheAcceuil();
};
Interface.prototype.afficheGameOver = function(){
    var gameOver = "Game Over";
    var instruction = "Press ENTER to reset..."
    document.getElementById("LVL").innerHTML = "";
    document.getElementById("fin").innerHTML = "";
    document.getElementById("instructionGO").innerHTML = instruction;
    document.getElementById("GameOver").innerHTML = gameOver;
    document.getElementById("levelCentre").style.background = 'transparent';
    document.getElementById("niveau").style.visibility = "visible";
    document.getElementById("levelCentre").style.visibility = "visible";
};
Interface.prototype.afficheLvl = function(lvl){
    document.getElementById("LVL").innerHTML = "lvl " + lvl;
    document.getElementById("GameOver").innerHTML = "";
    document.getElementById("instructionGO").innerHTML = "";
    document.getElementById("fin").innerHTML = "";
    document.getElementById("levelCentre").style.background = 'transparent';
    document.getElementById("niveau").style.visibility = "visible";
    document.getElementById("levelCentre").style.visibility = "visible";
    //document.getElementById("instruction").style.visibility = "visible";
};
Interface.prototype.afficheFin = function(){
    var messageDeFin = "GG, vous avez fini le jeu !";
    var instruction = "Press ENTER to reset..."
    document.getElementById("fin").innerHTML = messageDeFin;
    document.getElementById("GameOver").innerHTML = "";
    document.getElementById("instructionGO").innerHTML = instruction;
    document.getElementById("LVL").innerHTML = "";
    document.getElementById("levelCentre").style.background = 'transparent';
    document.getElementById("niveau").style.visibility = "visible";
    document.getElementById("levelCentre").style.visibility = "visible";
};
Interface.prototype.cacheLvl = function(){
    document.getElementById("niveau").style.visibility = "hidden";
    document.getElementById("levelCentre").style.visibility = "hidden";
    //document.getElementById("instruction").style.visibility = "hidden";
};
Interface.prototype.cacheAcceuil = function(){
    document.getElementById("acceuil").style.visibility = "hidden";
    document.getElementById("centre").style.visibility = "hidden";
};
Interface.prototype.afficheAcceuil = function(){
    var title = "SPACEWOLF";
    var instruction = "Press ENTER to play";
    document.getElementById("titre").innerHTML = title;
    document.getElementById("instruction").innerHTML = instruction;
    document.getElementById("centre").style.background = 'transparent';
    document.getElementById("acceuil").style.visibility = "visible";
    document.getElementById("centre").style.visibility = "visible";
};
Interface.prototype.afficheVie = function(nbVie){
    document.getElementById("vie").innerHTML = "";
    document.getElementById("vie").innerHTML = "VIE : " + (nbVie+1);
};
Interface.prototype.afficheHUD = function(){
    document.getElementById("hud").style.visibility = "visible";
};
Interface.prototype.cacheHUD = function(){
    document.getElementById("hud").style.visibility = "hidden";
};
Interface.prototype.afficheJoker = function(){
    document.getElementById("arme").innerHTML = "";
    document.getElementById("acc").innerHTML = "";
    if (this.main.accArme == true && this.main.ArmeUp == true){
        document.getElementById("arme").innerHTML = "JOKER ARME : ACTIF";
        document.getElementById("acc").innerHTML = "JOKER CADENCE : ACTIF";
    }
    if (this.main.accArme == true && this.main.ArmeUp == false){
        document.getElementById("arme").innerHTML = "JOKER ARME : NON ACTIF";
        document.getElementById("acc").innerHTML = "JOKER CADENCE : ACTIF";
    }
    if (this.main.accArme == false && this.main.ArmeUp == true){
        document.getElementById("arme").innerHTML = "JOKER ARME : ACTIF";
        document.getElementById("acc").innerHTML = "JOKER CADENCE : NON ACTIF";
    }
    if (this.main.accArme == false && this.main.ArmeUp == false){
        document.getElementById("arme").innerHTML = "JOKER ARME : NON ACTIF";
        document.getElementById("acc").innerHTML = "JOKER CADENCE : NON ACTIF";
    }
}