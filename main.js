
window.addEventListener("DOMContentLoaded", function () {

    const playButton = document.getElementById("playButton");
    const menu = document.getElementById("menu");
    const loading = document.getElementById("loading");
    const game = document.getElementById("game");
    const canvas = document.getElementById("renderCanvas");

    const pauseButton = document.getElementById("pauseButton");
    const pauseMenu = document.getElementById("pauseMenu");
    const continueButton = document.getElementById("continueButton");
    const exitButton = document.getElementById("exitButton");

    let engine = null;
    let scene = null;
    let renderLoop = null;
    let isPaused = false;

    let keydownHandler = null;
    let resizeHandler = null;


    // INICIAR JOGO
    playButton.addEventListener("click", async function () {

        playButton.disabled = true;

        menu.classList.add("hidden");
        loading.classList.remove("hidden");

        try {

            engine = new BABYLON.Engine(canvas, true, { stencil: true });

            scene = await createScene();

            game.classList.remove("hidden");
            loading.classList.add("hidden");

            engine.resize();

            isPaused = false;

            pauseMenu.classList.add("hidden");

            // Loop de renderização
            renderLoop = function () {
                scene.render();
            };

            engine.runRenderLoop(renderLoop);

            // Redimensionamento da tela
            resizeHandler = function () {
                if (engine) {
                    engine.resize();
                }
            };

            window.addEventListener("resize", resizeHandler);

        } catch (error) {

            console.error("Erro ao carregar o jogo:", error);

            loading.classList.add("hidden");
            menu.classList.remove("hidden");

            playButton.disabled = false;

            if (scene) {
                scene.dispose();
                scene = null;
            }

            if (engine) {
                engine.dispose();
                engine = null;
            }

            alert("Não foi possível carregar o cenário.");

        }

    });


    // PAUSAR JOGO
    function pauseGame() {

        if (!engine || !scene || isPaused) {
            return;
        }

        isPaused = true;

        // Interrompe a renderização
        engine.stopRenderLoop(renderLoop);

        // Mostra o menu de pausa
        pauseMenu.classList.remove("hidden");

    }


    // CONTINUAR JOGO
    function resumeGame() {

        if (!engine || !scene || !isPaused) {
            return;
        }

        isPaused = false;

        // Esconde o menu de pausa
        pauseMenu.classList.add("hidden");

        // Retoma a renderização
        engine.runRenderLoop(renderLoop);

    }


    // SAIR PARA O MENU PRINCIPAL
    function exitGame() {

        if (!engine) {
            return;
        }

        // Interrompe o jogo
        engine.stopRenderLoop(renderLoop);

        isPaused = false;

        // Remove os eventos do teclado
        if (keydownHandler) {
            window.removeEventListener("keydown", keydownHandler);
            keydownHandler = null;
        }

        if (resizeHandler) {
            window.removeEventListener("resize", resizeHandler);
            resizeHandler = null;
        }

        // Descarta a cena e seus modelos
        if (scene) {
            scene.dispose();
            scene = null;
        }

        // Descarta a engine
        engine.dispose();
        engine = null;

        renderLoop = null;

        // Esconde o jogo
        game.classList.add("hidden");
        pauseMenu.classList.add("hidden");

        // Volta ao menu principal
        menu.classList.remove("hidden");

        // Libera o botão Jogar novamente
        playButton.disabled = false;

    }


    // EVENTOS DOS BOTÕES
    pauseButton.addEventListener("click", pauseGame);

    continueButton.addEventListener("click", resumeGame);

    exitButton.addEventListener("click", exitGame);

    // CRIAÇÃO DA CENA
    async function createScene() {

        const scene = new BABYLON.Scene(engine);

        // CÂMERA
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            0,
            Math.PI / 3,
            6,
            new BABYLON.Vector3(0, 2.9, 0),
            scene
        );

        //camera.attachControl(canvas, true);


        // ILUMINAÇÃO
        const hemiLight = new BABYLON.HemisphericLight(
            "hemiLight",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        hemiLight.intensity = 1.0;

        const dirLight = new BABYLON.DirectionalLight(
            "dirLight",
            new BABYLON.Vector3(-1, -2, -1),
            scene
        );

        dirLight.position = new BABYLON.Vector3(5, 10, 5);
        dirLight.intensity = 0.5;


        // CARREGAMENTO DOS MODELOS
        const modelos = await Promise.all([

            BABYLON.SceneLoader.ImportMeshAsync(
                "", "./assets/", "Cama.glb", scene
            ),

            BABYLON.SceneLoader.ImportMeshAsync(
                "", "./assets/", "Poster.glb", scene
            ),

            BABYLON.SceneLoader.ImportMeshAsync(
                "", "./assets/", "PrisaoCaixa.glb", scene
            ),

            BABYLON.SceneLoader.ImportMeshAsync(
                "", "./assets/", "stickman.glb", scene
            )

        ]);

        console.log("Todos os modelos foram carregados!");


        // CONFIGURAÇÃO DOS MODELOS
        const cama = modelos[0].meshes[0];
        cama.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

        const poster = modelos[1].meshes[0];
        poster.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

        const prisao = modelos[2].meshes[0];
        prisao.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

        const stickman = modelos[3].meshes[0];

        stickman.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
        stickman.position = new BABYLON.Vector3(0, 2.9, 0);
        stickman.rotation = new BABYLON.Vector3(0, 0, 0);

        // IDENTIFICAÇÃO DOS OBJETOS
        cama.name = "cama";
        poster.name = "poster";
        prisao.name = "prisao";
        stickman.name = "stickman";


        // POSIÇÕES DA CÂMERA
        const posicoesCamera = [

            {
                target: new BABYLON.Vector3(0, 2.9, 0),
                alpha: 0,
                beta: Math.PI / 3,
                radius: 6
            },

            {
                target: new BABYLON.Vector3(-1, 2.2, 0),
                alpha: 0,
                beta: 0.05,
                radius: 5
            },

            {
                target: new BABYLON.Vector3(0, 0, 0),
                alpha: 0,
                beta: Math.PI - 0.15,
                radius: 8
            },

            {
                target: new BABYLON.Vector3(4, 2.5, -0.5),
                alpha: 0,
                beta: Math.PI / 2,
                radius: 5
            },

            {
                target: new BABYLON.Vector3(0, 2.5, 0),
                alpha: Math.PI / 3,
                beta: Math.PI / 2,
                radius: 3
            },

            {
                target: new BABYLON.Vector3(0, 2.5, 0),
                alpha: -Math.PI / 3,
                beta: Math.PI / 2,
                radius: 3
            },

            {
                target: new BABYLON.Vector3(-0.8, 2.5, 0),
                alpha: Math.PI + 0.4,
                beta: Math.PI / 2,
                radius: 3
            },

            {
                target: new BABYLON.Vector3(-0.5, 2.5, 0),
                alpha: Math.PI,
                beta: Math.PI / 2,
                radius: 3
            }

        ];


        let indiceAtual = 0;

        function aplicarPosicaoCamera() {

            const config = posicoesCamera[indiceAtual];

            camera.target = config.target;
            camera.alpha = config.alpha;
            camera.beta = config.beta;
            camera.radius = config.radius;

        }


        // CONTROLES DO TECLADO
        keydownHandler = function (event) {

            // ESC: PAUSAR OU CONTINUAR
            if (event.key === "Escape") {

                event.preventDefault();

                if (event.repeat) return;

                if (isPaused) {
                    resumeGame();
                } else {
                    pauseGame();
                }

                return;
            }

            // Impede outros controles enquanto pausado
            if (isPaused) return;


            if (event.key === "w" || event.key === "W") {

                dirLight.setEnabled(!dirLight.isEnabled());

            }

            else if (event.key === "s" || event.key === "S") {

                hemiLight.setEnabled(!hemiLight.isEnabled());

            }

            else if (event.key === "ArrowRight") {

                indiceAtual = (indiceAtual + 1) % posicoesCamera.length;

                aplicarPosicaoCamera();

            }

            else if (event.key === "ArrowLeft") {

                indiceAtual = (indiceAtual - 1 + posicoesCamera.length) % posicoesCamera.length;

                aplicarPosicaoCamera();

            }

        };

        window.addEventListener("keydown", keydownHandler);

        
        // FUNÇÃO PARA INTERAGIR COM OS OBJETOS
        function configurarInteracoes(scene, objetosInterativos) {

            // SEÇÃO DE HOVER DO OBJETO
            const highlightLayer = new BABYLON.HighlightLayer("highlightLayer", scene);

            let objetoSelecionado = null;

            function removerDestaque() {
                if (objetoSelecionado) {
                    const meshes = objetoSelecionado.getChildMeshes();

                    meshes.forEach(mesh => {
                        highlightLayer.removeMesh(mesh);
                    });

                    if (objetoSelecionado instanceof BABYLON.AbstractMesh) {
                        highlightLayer.removeMesh(objetoSelecionado);
                    }

                    objetoSelecionado = null;
                }
            }

            function detectarMouse(event) {

                if (isPaused) return;

                const rect = canvas.getBoundingClientRect();

                const x = (event.clientX - rect.left) * (engine.getRenderWidth() / rect.width);
                const y = (event.clientY - rect.top) * (engine.getRenderHeight() / rect.height);

                const pickInfo = scene.pick(x, y);

                if (pickInfo.hit && pickInfo.pickedMesh) {

                    const mesh = pickInfo.pickedMesh;

                    const objetoEncontrado = objetosInterativos.find(obj =>
                        mesh === obj || mesh.isDescendantOf(obj)
                    );

                    if (objetoEncontrado !== objetoSelecionado) {

                        removerDestaque();

                        if (objetoEncontrado) {

                            objetoSelecionado = objetoEncontrado;

                            const meshes = objetoEncontrado.getChildMeshes();

                            if (objetoEncontrado instanceof BABYLON.AbstractMesh) {
                                meshes.push(objetoEncontrado);
                            }

                            meshes.forEach(mesh => {
                                if (mesh.getTotalVertices() > 0) {
                                    highlightLayer.addMesh(
                                        mesh,
                                        BABYLON.Color3.White()
                                    );
                                }
                            });
                        }

                    }

                } else {
                    removerDestaque();
                }
            }

            canvas.addEventListener("pointermove", detectarMouse);

            canvas.addEventListener("pointerleave", removerDestaque);

            scene.onDisposeObservable.add(() => {
                canvas.removeEventListener("pointermove", detectarMouse);
                canvas.removeEventListener("pointerleave", removerDestaque);
                removerDestaque();
            });

            //SEÇÃO DO CLIQUE DO OBJETO
            scene.onPointerObservable.add(function (pointerInfo) {
              if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {

                  const objetoClicado = pointerInfo.pickInfo;

                  // Verifica se algum objeto foi atingido
                  if (!objetoClicado.hit || !objetoClicado.pickedMesh) {
                      return;
                  }

                  const mesh = objetoClicado.pickedMesh;

                  // Procura o objeto na lista de objetos interativos
                  const objetoInterativo = objetosInterativos.find(objeto =>
                      mesh === objeto || mesh.isDescendantOf(objeto)
                  );

                  if (objetoInterativo) {

                      //AQUI É ONDE FICA A MODIFICAÇÃO PARA CHAMAR AS CUTSCENES
                      console.log("Objeto clicado:", objetoInterativo.name);

                  }

              }

          });
        }

        // OBJETOS QUE PODEM INTERAGIR COM O JOGADOR
        configurarInteracoes(scene, [
            stickman,
            cama,
            poster
        ]);

        return scene;

    }

});
