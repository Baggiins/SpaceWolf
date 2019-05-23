var renderer;
if (Detector.webgl) {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true // to allow screenshot
    });
} else {
    renderer = new THREE.CanvasRenderer();
}
renderer = new THREE.WebGLRenderer();
renderer.setSize (window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var SceneMain = new Main();
//faire la scene
var render = function()
{
    renderer.render(SceneMain, SceneMain.camera);
};
//démarré game loop 
var GameLoop = function()
{
    window.requestAnimationFrame(GameLoop);
    render();
    SceneMain.animate();
};
if (!SceneMain.init()){
    GameLoop();
}