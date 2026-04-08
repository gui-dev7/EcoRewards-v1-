// Variável Global de Pontos do Utilizador
            let userPoints = 4250;

            function showToast(message, type = "success") {
                const container = document.getElementById("toast-container");
                const toast = document.createElement("div");

                let icon = "ph-check-circle";
                let color = "var(--brand-primary)";
                if (type === "error") {
                    icon = "ph-warning-circle";
                    color = "#ef4444";
                }
                if (type === "info") {
                    icon = "ph-info";
                    color = "#3b82f6";
                }

                toast.className = "toast";
                toast.style.borderLeftColor = color;
                toast.innerHTML = `<i class="ph-fill ${icon}" style="color: ${color}; font-size: 1.25rem;"></i> <span style="flex:1;">${message}</span>`;

                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.opacity = "0";
                    toast.style.transform = "translateX(100%)";
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            function updatePointsDisplay() {
                const display = document.getElementById("sidebar-balance");
                const rankPts = document.getElementById("rank-my-points");

                display.innerHTML = `<i class="ph-fill ph-coin"></i> ${userPoints.toLocaleString("pt-PT")}`;
                if (rankPts) rankPts.innerHTML = `${userPoints.toLocaleString("pt-PT")} <i class="ph-fill ph-coin" style="font-size: 0.9rem;"></i>`;
            }

            // Simulação do Scanner
            function simulateScan() {
                showToast("A processar imagem com Inteligência Artificial...", "info");
                setTimeout(() => {
                    const pointsEarned = Math.floor(Math.random() * 50) + 10;
                    userPoints += pointsEarned;
                    updatePointsDisplay();
                    showToast(`Sucesso! Embalagens validadas. Ganhou +${pointsEarned} EcoPontos.`, "success");
                }, 2000);
            }

            // Lógica de Resgate de Prémios
            function redeemReward(name, cost) {
                if (userPoints >= cost) {
                    userPoints -= cost;
                    updatePointsDisplay();
                    showToast(`Resgatou "${name}" com sucesso! O cupão foi enviado por e-mail.`, "success");
                } else {
                    showToast(`Pontos insuficientes para resgatar "${name}". Faltam ${cost - userPoints} pts.`, "error");
                }
            }

            document.addEventListener("DOMContentLoaded", () => {
                updatePointsDisplay();

                // 1. Lógica do Menu de Navegação (Sidebar)
                const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
                const views = document.querySelectorAll(".view-content");

                navItems.forEach((item) => {
                    item.addEventListener("click", () => {
                        navItems.forEach((n) => n.classList.remove("active"));
                        item.classList.add("active");

                        const target = item.getAttribute("data-target");
                        views.forEach((v) => {
                            v.classList.remove("active");
                            if (v.id === `view-${target}`) v.classList.add("active");
                        });

                        // Fechar menu mobile se estiver aberto
                        if (window.innerWidth <= 768) {
                            document.getElementById("sidebar").classList.remove("active");
                        }
                    });
                });

                // 2. Lógica dos Filtros do Catálogo de Recompensas
                const filterBtns = document.querySelectorAll(".filter-btn");
                const rewardCards = document.querySelectorAll(".reward-card");

                filterBtns.forEach((btn) => {
                    btn.addEventListener("click", () => {
                        filterBtns.forEach((b) => b.classList.remove("active"));
                        btn.classList.add("active");

                        const filterValue = btn.getAttribute("data-filter");

                        rewardCards.forEach((card) => {
                            if (filterValue === "all") {
                                card.style.display = "flex";
                            } else {
                                if (card.classList.contains(`item-${filterValue}`)) {
                                    card.style.display = "flex";
                                } else {
                                    card.style.display = "none";
                                }
                            }
                        });
                    });
                });

                // 3. Lógica do Tema Noturno
                const themeToggleBtn = document.getElementById("themeToggle");
                const themeIcon = themeToggleBtn.querySelector("i");

                if (localStorage.getItem("ecorewards-theme") === "dark") {
                    document.body.classList.add("dark-mode");
                    themeIcon.classList.replace("ph-moon", "ph-sun");
                }

                themeToggleBtn.addEventListener("click", () => {
                    document.body.classList.toggle("dark-mode");
                    const isDark = document.body.classList.contains("dark-mode");
                    themeIcon.classList.replace(isDark ? "ph-moon" : "ph-sun", isDark ? "ph-sun" : "ph-moon");
                    localStorage.setItem("ecorewards-theme", isDark ? "dark" : "light");
                });

                // 4. Carregar o nome guardado no Perfil
                const savedName = localStorage.getItem("ecorewards-name-b2c");
                if (savedName) {
                    document.getElementById("dashboard-user-name").innerText = savedName;
                    document.getElementById("header-user-name").innerText = savedName.split(" ")[0];
                    document.getElementById("avatar-b2c").innerText = savedName.charAt(0).toUpperCase();

                    // Atualizar o nome no Ranking também
                    const myRankName = document.getElementById("rank-my-name");
                    const myRankAvatar = document.getElementById("rank-my-avatar");
                    if (myRankName) myRankName.innerText = savedName;
                    if (myRankAvatar) myRankAvatar.innerText = savedName.charAt(0).toUpperCase();
                }
            });
