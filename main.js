window.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('renderCanvas');
  
  // Inicializa o Engine do Babylon.js (obtém o contexto WebGL no Canvas)
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // 1. Câmera Orbital
    const camera = new BABYLON.ArcRotateCamera(
      "camera", 
      0, 
      Math.PI / 3, 
      6, 
      new BABYLON.Vector3(0, 2.9, 0), 
      scene
    );

    // 2. Luz Hemisférica (ambiente)
    const hemiLight = new BABYLON.HemisphericLight(
      "hemiLight", 
      new BABYLON.Vector3(0, 1, 0), 
      scene
    );
    hemiLight.intensity = 1.0;

    // 3. Luz Direcional (sombra/destaques) - Corrigida e limpa
    const dirLight = new BABYLON.DirectionalLight(
      "dirLight", 
      new BABYLON.Vector3(-1, -2, -1), 
      scene
    );
    dirLight.position = new BABYLON.Vector3(5, 10, 5);
    dirLight.intensity = 0.5;

    // 4. Carregamento dos Arquivos glTF/GLB
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

    //dicionário das posições da câmera, altere isso Vitão
    const posicoesCamera = [
      { 
        target: new BABYLON.Vector3(0, 2.9, 0), 
        alpha: 0, //ângulo horizontal
        beta: Math.PI / 3, //ângulo vertical
        radius: 6 //distancia do Zoom
      },//base
      { 
        target: new BABYLON.Vector3(-1, 2.2, 0),
        alpha: 0, //ângulo horizontal
        beta: 0.05, //ângulo vertical
        radius: 5 //distancia do Zoom
      },//visao de cima
      { 
        target: new BABYLON.Vector3(0, 0, 0), 
        alpha: 0,                             
        beta: Math.PI - 0.15,                 
        radius: 8
      },//visão de baixo para cima
      { 
        target: new BABYLON.Vector3(4, 2.5, -0.5),
        alpha: 0,
        beta: Math.PI / 2,
        radius: 5
      },//visão de fora para dentro
      { 
        target: new BABYLON.Vector3(0, 2.5, 0),
        alpha: Math.PI /3,
        beta: Math.PI /2,
        radius: 3
      },//visão da parede esquerda -> direita
      { 
        target: new BABYLON.Vector3(0, 2.5, 0),
        alpha: -Math.PI /3,
        beta: Math.PI /2,
        radius: 3
      },//visão da parede direita -> esquerda
      { 
        target: new BABYLON.Vector3(-0.8, 2.5, 0),
        alpha: Math.PI + 0.4,
        beta: Math.PI /2,
        radius: 3
      },//visão do canto
      { 
        target: new BABYLON.Vector3(-0.5, 2.5, 0),
        alpha: Math.PI,
        beta: Math.PI /2,
        radius: 3
      },//visão de tras
    ];

    //indice do vetor de posições da camera
    let indiceAtual = 0; 

    //função auxiliar para alterar a câmera
    const aplicarPosicaoCamera = () => {
      const config = posicoesCamera[indiceAtual];
      camera.target = config.target;
      camera.alpha = config.alpha;
      camera.beta = config.beta;
      camera.radius = config.radius;
    };

    window.addEventListener("keydown", (event) => {
      
      if(event.key === "w" || event.key === "W") {
        dirLight.setEnabled(!dirLight.isEnabled());
      }
      else if(event.key === "s" || event.key === "S") {
        hemiLight.setEnabled(!hemiLight.isEnabled());
      }
      else if (event.key === "ArrowRight") {
        // Avança o índice ciclicamente (Vai de 0 até o último, depois volta para 0)
        indiceAtual = (indiceAtual + 1) % posicoesCamera.length;
        aplicarPosicaoCamera();
      } 
      else if (event.key === "ArrowLeft") {
        // Volta o índice ciclicamente (Vai de 0 para o último, e decresce normalmente)
        indiceAtual = (indiceAtual - 1 + posicoesCamera.length) % posicoesCamera.length;
        aplicarPosicaoCamera();
      }
      
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

  // Monitoramento de teclas pressionadas
  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        console.log("Você apertou a seta para CIMA!");
        break;
      case "ArrowDown":
        console.log("Você apertou a seta para BAIXO!");
        break;
      case "ArrowLeft":
        console.log("Você apertou a seta para a ESQUERDA!");
        break;
      case "ArrowRight":
        console.log("Você apertou a seta para a DIREITA!");
        break;
    }
  });
});