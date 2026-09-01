// Lógica de Toast
            function showToast(msg, type = "success") {
                const container = document.getElementById("toast-container");
                const toast = document.createElement("div");
                toast.className = type === "error" ? "toast error" : "toast";

                const icon = type === "error" ? "ph-warning-circle" : "ph-check-circle";

                toast.innerHTML = `<i class="ph-fill ${icon}"></i> <span style="font-weight: 500;">${msg}</span>`;
                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.animation = "slideOut 0.3s forwards";
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            // Lógica do Feedback
            document.getElementById("feedbackForm").addEventListener("submit", (e) => {
                e.preventDefault();
                showToast("A sua mensagem foi enviada! Muito obrigado pela opinião.");
                e.target.reset();
            });

            // Lógica do Dark Mode
            const themeToggleBtn = document.getElementById("themeToggle");
            const themeIcon = themeToggleBtn.querySelector("i");
            const body = document.body;

            if (localStorage.getItem("ecorewards-theme") === "dark") {
                body.classList.add("dark-mode");
                themeIcon.classList.replace("ph-moon", "ph-sun");
            }

            themeToggleBtn.addEventListener("click", () => {
                body.classList.toggle("dark-mode");
                if (body.classList.contains("dark-mode")) {
                    themeIcon.classList.replace("ph-moon", "ph-sun");
                    localStorage.setItem("ecorewards-theme", "dark");
                } else {
                    themeIcon.classList.replace("ph-sun", "ph-moon");
                    localStorage.setItem("ecorewards-theme", "light");
                }
            });

            // --- Lógica do Jogo ---
            const player = document.getElementById("player");
            const obstacle = document.getElementById("obstacle");
            const scoreElement = document.getElementById("score");
            const overlay = document.getElementById("startOverlay");
            const gameContainer = document.getElementById("gameContainer");

            let isJumping = false;
            let isGameOver = true;
            let score = 0;
            let collisionInterval;
            let scoreInterval;

            function jump() {
                if (isGameOver || isJumping) return;

                isJumping = true;
                player.classList.add("jump-anim");

                setTimeout(() => {
                    player.classList.remove("jump-anim");
                    isJumping = false;
                }, 500); // Duração da animação CSS
            }

            function startGame(e) {
                if (e) e.stopPropagation(); // Evita que o click no botão também faça saltar de imediato

                overlay.style.display = "none";
                obstacle.style.display = "block";

                // Pequeno reset para a animação do obstáculo
                obstacle.classList.remove("move-anim");
                void obstacle.offsetWidth; // trigger reflow
                obstacle.classList.add("move-anim");

                isGameOver = false;
                score = 0;
                scoreElement.innerText = score;

                // Intervalo para pontuação
                scoreInterval = setInterval(() => {
                    if (!isGameOver) {
                        score += 10;
                        scoreElement.innerText = score;
                    }
                }, 500);

                // Intervalo de verificação de colisão
                collisionInterval = setInterval(checkCollision, 20);
            }

            function checkCollision() {
                // Usa getBoundingClientRect para obter posições reais no ecrã
                const pRect = player.getBoundingClientRect();
                const oRect = obstacle.getBoundingClientRect();

                // Lógica de colisão básica (ajustada com margem de tolerância)
                if (pRect.right > oRect.left + 15 && pRect.left < oRect.right - 15 && pRect.bottom > oRect.top + 10) {
                    gameOver();
                }
            }

            function gameOver() {
                isGameOver = true;
                clearInterval(collisionInterval);
                clearInterval(scoreInterval);

                // Pausa animações
                obstacle.style.left = obstacle.getBoundingClientRect().left + "px";
                obstacle.classList.remove("move-anim");
                player.classList.remove("jump-anim");

                showToast("Ops, bateu no lixo! Pontuação final: " + score, "error");

                // Reinicia interface
                setTimeout(() => {
                    obstacle.style.left = "";
                    overlay.style.display = "flex";
                    overlay.querySelector("h3").innerText = "Game Over!";
                    overlay.querySelector(".btn-play").innerText = "Tentar Novamente";
                }, 1000);
            }

            // Controlos (Espaço ou Clique no container)
            document.addEventListener("keydown", (e) => {
                if (e.code === "Space") {
                    e.preventDefault();
                    if (isGameOver) startGame();
                    else jump();
                }
            });

            gameContainer.addEventListener("mousedown", () => {
                if (!isGameOver) jump();
            });
            gameContainer.addEventListener("touchstart", () => {
                if (!isGameOver) jump();
            });
