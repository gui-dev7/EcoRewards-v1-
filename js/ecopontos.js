// Variável para rastrear o filtro atual
            let activeFilterValue = "all";

            // 1. Função para alterar o filtro visualmente e atualizar lista
            function setFilter(button) {
                // Remover active de todos
                document.querySelectorAll(".m-filter").forEach((btn) => btn.classList.remove("active"));
                // Adicionar active ao clicado
                button.classList.add("active");

                activeFilterValue = button.getAttribute("data-filter");
                applyFilters();
            }

            // 2. Lógica Mestra de Filtragem (Pesquisa + Botões de Material)
            function applyFilters() {
                const searchTerm = document.getElementById("searchInput").value.toLowerCase();
                const cards = document.querySelectorAll(".location-card");
                const pins = document.querySelectorAll(".map-pin");
                let hasResults = false;

                cards.forEach((card, index) => {
                    const types = card.getAttribute("data-types");
                    const text = card.innerText.toLowerCase();
                    const pinId = card.id.replace("card-", "pin-");
                    const pin = document.getElementById(pinId);

                    // Verifica se passa na pesquisa de texto E no filtro de material
                    const matchesSearch = text.includes(searchTerm);
                    const matchesFilter = activeFilterValue === "all" || types.includes(activeFilterValue);

                    if (matchesSearch && matchesFilter) {
                        card.style.display = "flex";
                        if (pin) pin.style.display = "flex";
                        hasResults = true;
                    } else {
                        card.style.display = "none";
                        if (pin) pin.style.display = "none";

                        // Se o item escondido era o ativo, desativá-lo
                        card.classList.remove("active");
                        if (pin) pin.classList.remove("active");
                    }
                });

                // Mostrar/Esconder mensagem de "Nenhum resultado"
                document.getElementById("no-results-msg").style.display = hasResults ? "none" : "flex";
            }

            // 3. Função para simular interação Mapa <-> Lista
            function activateLocation(id) {
                // Reset de estilos em todos
                document.querySelectorAll(".location-card").forEach((el) => el.classList.remove("active"));
                document.querySelectorAll(".map-pin").forEach((el) => el.classList.remove("active"));

                // Ativa o card selecionado
                const card = document.getElementById(`card-${id}`);
                if (card && card.style.display !== "none") {
                    card.classList.add("active");
                    // Faz scroll suave na lista até ao cartão selecionado
                    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }

                // Ativa o Pin correspondente
                const pin = document.getElementById(`pin-${id}`);
                if (pin && pin.style.display !== "none") {
                    pin.classList.add("active");
                }
            }

            // 4. Inicialização de Tema e Eventos ao Carregar
            document.addEventListener("DOMContentLoaded", () => {
                // Ativar o primeiro local por defeito ao iniciar
                activateLocation(1);

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
            });
