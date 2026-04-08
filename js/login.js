// --- Sistema de Notificações Bonitas (Toasts) ---
            function showToast(message, type = "success") {
                const container = document.getElementById("toast-container");
                const toast = document.createElement("div");
                toast.className = `toast ${type}`;

                let icon = "ph-check-circle";
                if (type === "error") icon = "ph-warning-circle";
                if (type === "info") icon = "ph-info";

                toast.innerHTML = `
                <i class="ph-fill ${icon}"></i>
                <div style="font-size: 0.875rem; font-weight: 500;">${message}</div>
            `;

                container.appendChild(toast);

                setTimeout(() => {
                    toast.style.animation = "slideOut 0.3s ease forwards";
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            // --- Interceptar Validação Nativa do Navegador ---
            let invalidTimeout;
            document.addEventListener(
                "invalid",
                (e) => {
                    e.preventDefault();

                    clearTimeout(invalidTimeout);
                    invalidTimeout = setTimeout(() => {
                        showToast("Por favor, preencha todos os campos obrigatórios corretamente.", "error");
                        const form = e.target.form;
                        if (form) {
                            const firstInvalid = form.querySelector(":invalid");
                            if (firstInvalid) firstInvalid.focus();
                        }
                    }, 10);
                },
                true,
            );

            document.addEventListener("DOMContentLoaded", () => {
                const mainHeader = document.getElementById("main-header");
                const mainTabs = document.getElementById("main-tabs");

                const viewLogin = document.getElementById("view-login-cidadao");
                const viewRegister = document.getElementById("view-register-cidadao");
                const viewForgot = document.getElementById("view-forgot-cidadao");

                // --- Lógica das Abas Principais ---
                const tabBtns = document.querySelectorAll(".tab-btn");
                const tabContents = document.querySelectorAll(".tab-content");

                // Função para mudar de aba
                function activateTab(targetId) {
                    tabBtns.forEach((b) => b.classList.remove("active"));
                    tabContents.forEach((c) => c.classList.remove("active"));

                    const btn = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
                    if (btn) btn.classList.add("active");

                    const content = document.getElementById(`tab-${targetId}`);
                    if (content) content.classList.add("active");

                    if (targetId === "cidadao") voltarParaLogin();
                }

                tabBtns.forEach((btn) => {
                    btn.addEventListener("click", () => {
                        activateTab(btn.getAttribute("data-tab"));
                    });
                });

                // Verificar se há uma aba especificada no URL (ex: index.html?tab=empresa)
                const urlParams = new URLSearchParams(window.location.search);
                const tabFromUrl = urlParams.get("tab");
                if (tabFromUrl && ["cidadao", "empresa", "governo"].includes(tabFromUrl)) {
                    activateTab(tabFromUrl);
                }

                // --- Lógica de Sub-views (Cidadão) ---
                function ocultarElementosPrincipais() {
                    mainHeader.style.display = "none";
                    mainTabs.style.display = "none";
                    viewLogin.style.display = "none";
                }

                function voltarParaLogin() {
                    mainHeader.style.display = "block";
                    mainTabs.style.display = "flex";
                    viewRegister.style.display = "none";
                    viewForgot.style.display = "none";
                    viewLogin.style.display = "block";

                    viewLogin.style.animation = "none";
                    viewLogin.offsetHeight;
                    viewLogin.style.animation = "fadeIn 0.3s ease-in-out";
                }

                document.getElementById("link-registrar").addEventListener("click", () => {
                    ocultarElementosPrincipais();
                    viewRegister.style.display = "block";
                    viewRegister.style.animation = "fadeIn 0.3s ease-in-out";
                });

                document.getElementById("link-esqueci").addEventListener("click", () => {
                    ocultarElementosPrincipais();
                    viewForgot.style.display = "block";
                    viewForgot.style.animation = "fadeIn 0.3s ease-in-out";
                });

                document.querySelectorAll(".link-voltar-login").forEach((link) => {
                    link.addEventListener("click", voltarParaLogin);
                });

                // =====================================================================
                // REDIRECIONAMENTOS DE LOGIN (A MÁGICA ACONTECE AQUI)
                // =====================================================================

                // 1. Submit Login Cidadão -> b2c-dashboard.html
                document.getElementById("form-login-b2c").addEventListener("submit", (e) => {
                    e.preventDefault();
                    showToast("A iniciar sessão de forma segura...", "info");
                    setTimeout(() => {
                        window.location.href = "b2c-dashboard.html";
                    }, 1200);
                });

                // 2. Submit Registo Cidadão
                document.getElementById("form-register-b2c").addEventListener("submit", (e) => {
                    e.preventDefault();
                    showToast("Conta criada com sucesso! A preparar o seu painel...", "success");
                    setTimeout(() => {
                        window.location.href = "b2c-dashboard.html";
                    }, 1500);
                });

                // 3. Submit Recuperar Senha
                document.getElementById("form-forgot-b2c").addEventListener("submit", (e) => {
                    e.preventDefault();
                    showToast("O link de recuperação foi enviado para o seu e-mail.", "success");
                    setTimeout(() => {
                        voltarParaLogin();
                    }, 2000);
                });

                // 4. Submit Login Empresa -> b2b-dashboard.html
                const formB2b = document.getElementById("form-login-b2b");
                if (formB2b) {
                    formB2b.addEventListener("submit", (e) => {
                        e.preventDefault();
                        showToast("A conectar ao Portal ESG corporativo...", "info");
                        setTimeout(() => {
                            window.location.href = "b2b-dashboard.html";
                        }, 1200);
                    });
                }

                // 5. Submit Login Governo -> b2g-dashboard.html
                const formB2g = document.getElementById("form-login-b2g");
                if (formB2g) {
                    formB2g.addEventListener("submit", (e) => {
                        e.preventDefault();
                        showToast("Autenticando credenciais no Portal Governamental...", "info");
                        setTimeout(() => {
                            window.location.href = "b2g-dashboard.html";
                        }, 1500);
                    });
                }

                // --- Lógica do Dark Mode ---
                const themeToggleBtn = document.getElementById("themeToggle");
                const themeIcon = themeToggleBtn.querySelector("i");
                const body = document.body;

                const savedTheme = localStorage.getItem("ecorewards-theme");
                if (savedTheme === "dark") {
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
