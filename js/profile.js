function showToast(msg) {
                const container = document.getElementById("toast-container");
                const toast = document.createElement("div");
                toast.className = "toast";
                toast.innerHTML = `<i class="ph-fill ph-check-circle"></i> <span>${msg}</span>`;
                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.animation = "slideOut 0.3s forwards";
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            function saveProfile(persona) {
                const input = document.getElementById(`input-name-${persona}`);
                const display = document.getElementById(`display-name-${persona}`);
                if (input && input.value) {
                    localStorage.setItem(`ecorewards-name-${persona}`, input.value);
                    display.innerText = input.value;
                    showToast("Perfil atualizado com sucesso!");
                }
            }

            function loadProfiles() {
                ["b2c", "b2b", "b2g"].forEach((persona) => {
                    const savedName = localStorage.getItem(`ecorewards-name-${persona}`);
                    if (savedName) {
                        const input = document.getElementById(`input-name-${persona}`);
                        const display = document.getElementById(`display-name-${persona}`);
                        if (input) input.value = savedName;
                        if (display) display.innerText = savedName;
                    }
                });
            }

            document.addEventListener("DOMContentLoaded", () => {
                const root = document.documentElement;
                const topTabs = document.querySelectorAll(".proto-tab"); // Abas de Perfil (Cidadão, Empresa, Gov)
                const sideNavs = document.querySelectorAll(".s-nav-item[data-target]"); // Abas Laterais (Info, Segurança, Notificações)
                const sections = document.querySelectorAll(".content-section"); // Secções Principais
                const personaViews = document.querySelectorAll(".profile-view"); // Sub-views de Informação Pessoal
                const backBtn = document.getElementById("dynamic-back-btn");

                let currentPersona = "b2c";

                // Carregar dados salvos ao iniciar
                loadProfiles();

                // 1. Lógica do Menu Lateral (Alternar entre Pessoal, Segurança e Notificações)
                sideNavs.forEach((nav) => {
                    nav.addEventListener("click", () => {
                        // Atualizar active nos botões laterais
                        sideNavs.forEach((n) => n.classList.remove("active"));
                        nav.classList.add("active");

                        // Esconder todas as secções
                        sections.forEach((sec) => sec.classList.remove("active"));

                        // Mostrar a secção alvo
                        const targetId = nav.getAttribute("data-target");
                        document.getElementById(targetId).classList.add("active");
                    });
                });

                // 2. Lógica das Abas Superiores do Protótipo (Mudar Persona e Cor)
                topTabs.forEach((tab) => {
                    tab.addEventListener("click", () => {
                        topTabs.forEach((t) => t.classList.remove("active"));
                        tab.classList.add("active");

                        // Mudar Tema Global (CSS Variables)
                        root.style.setProperty("--brand-primary", tab.getAttribute("data-color"));
                        root.style.setProperty("--brand-hover", tab.getAttribute("data-hover"));
                        root.style.setProperty("--brand-light", tab.getAttribute("data-light"));

                        // Atualizar Link do Botão de Voltar
                        backBtn.href = tab.getAttribute("data-url");

                        // Atualizar a View Pessoal correspondente à Persona
                        currentPersona = tab.getAttribute("data-profile");
                        personaViews.forEach((v) => {
                            v.classList.remove("active");
                            if (v.id === `view-${currentPersona}`) v.classList.add("active");
                        });
                    });
                });

                // 3. Lógica dos Interruptores (Toggle Switches)
                document.querySelectorAll(".toggle-switch").forEach((toggle) => {
                    toggle.addEventListener("click", () => {
                        // Se não estiver bloqueado (ex: alertas de segurança)
                        if (toggle.style.pointerEvents !== "none") {
                            toggle.classList.toggle("active");

                            // Lógica extra para o 2FA para mostrar um toast
                            if (toggle.id === "toggle-2fa") {
                                const status = toggle.classList.contains("active") ? "ativada" : "desativada";
                                showToast(`Autenticação de Dois Fatores ${status}.`);
                            }
                        }
                    });
                });

                // 4. Lógica do Modo Escuro
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

                // 5. Ler parâmetro da URL para selecionar a aba correta automaticamente
                const urlParams = new URLSearchParams(window.location.search);
                const urlPersona = urlParams.get("persona");
                if (urlPersona && ["b2c", "b2b", "b2g"].includes(urlPersona)) {
                    const tabToSelect = document.querySelector(`.proto-tab[data-profile="${urlPersona}"]`);
                    if (tabToSelect) {
                        tabToSelect.click();
                    }
                }
            });
