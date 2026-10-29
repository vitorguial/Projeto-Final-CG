window.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('renderCanvas');
  
  // Inicializa o Engine do Babylon.js (obtéms o contexto WebGL no Canvas)
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // 1. Câmera Orbital (permite girar com o mouse/touch)
    const camera = new BABYLON.ArcRotateCamera(
      "camera", 
      Math.PI / 4, 
      Math.PI / 3, 
      10, 
      new BABYLON.Vector3(0, 1, 0), 
      scene
    );
    camera.attachControl(canvas, true);

    // 2. Luz Hemisférica (ambiente)
    const hemiLight = new BABYLON.HemisphericLight(
      "hemiLight", 
      new BABYLON.Vector3(0, 1, 0), 
      scene
    );
    hemiLight.intensity = 0.8;

    // 3. Luz Direcional (sombra/destaques)
    const dirLight = new BABYLON.DirectionalLight(
      "dirLight", 
      new BABYLON.Vector3(-1, -2, -1), 
      scene
    );
    dirLight.position = new BABYLON.Vector3(5, 10, 5);
    dirLight.intensity = 0.5;

    // 4. Carregamento dos Arquivos glTF/GLB
    // Substitua os caminhos abaixo ("./modelo1.glb") pelos nomes dos seus arquivos
    BABYLON.SceneLoader.ImportMesh("", "./assets/", "Cama.glb", scene, function (meshes) {
      console.log("Modelo 1 carregado com sucesso!");
      const cama = meshes[0];
      cama.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "Poster.glb", scene, function (meshes) {
      console.log("Modelo 2 carregado com sucesso!");
      const poster = meshes[0];
      poster.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "PrisaoCaixa.glb", scene, function (meshes) {
      console.log("Modelo 3 carregado com sucesso!");
      const prisao = meshes[0];
      prisao.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
    });

    BABYLON.SceneLoader.ImportMesh("", "./assets/", "stickman.glb", scene, function (meshes) {
      console.log("Modelo 4 carregado com sucesso!");
      const stickman = meshes[0];

      stickman.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3); 
      stickman.position = new BABYLON.Vector3(0, 2.9, 0);
      stickman.rotation = new BABYLON.Vector3(0, 0, 0);
    });

    return scene;
  };

  const scene = createScene();

  // Loop de Renderização do WebGL
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Redimensionamento automático do canvas quando a janela muda de tamanho
  window.addEventListener('resize', function () {
    engine.resize();
  });
});