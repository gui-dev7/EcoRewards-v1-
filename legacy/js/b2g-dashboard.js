function showToast(message, type = "success") {
                const container = document.getElementById("toast-container");
                const toast = document.createElement("div");

                toast.className = `toast ${type}`;
                let icon = "ph-check-circle";
                if (type === "error") icon = "ph-warning-circle";
                if (type === "info") icon = "ph-info";
                if (type === "warning") icon = "ph-warning";

                toast.innerHTML = `<i class="ph-fill ${icon}"></i> <span style="flex:1;">${message}</span>`;

                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.animation = "slideIn 0.3s forwards reverse"; // Slide out hack
                    toast.style.opacity = "0";
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            // Enviar mensagem no Chat Simulado
            function sendChatMessage() {
                const input = document.getElementById("chat-input");
                const msg = input.value.trim();
                if (msg === "") return;

                const chatBox = document.getElementById("chat-box");

                const newMsg = document.createElement("div");
                newMsg.className = "message sent";
                newMsg.innerHTML = `
                <div class="msg-avatar" style="background: var(--brand-primary); color: white;">VO</div>
                <div>
                    <div class="msg-info"><span>Você</span><span>Agora</span></div>
                    <div class="msg-bubble">${msg}</div>
                </div>
            `;

                chatBox.appendChild(newMsg);
                input.value = "";
                chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
                showToast("Mensagem enviada com sucesso no canal #Geral", "success");
            }

            // Permitir enter no chat
            document.getElementById("chat-input")?.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    sendChatMessage();
                }
            });

            // Animar Barras (Ao abrir aba)
            function animateBars(viewId) {
                const view = document.getElementById(viewId);
                if (!view) return;

                // Altura (Gráficos verticais)
                view.querySelectorAll(".anim-h").forEach((bar) => {
                    const h = bar.getAttribute("data-h");
                    bar.style.height = "0%";
                    setTimeout(() => {
                        bar.style.height = h;
                    }, 50);
                });
                // Largura (Barras horizontais)
                view.querySelectorAll(".anim-w").forEach((bar) => {
                    const w = bar.getAttribute("data-w");
                    bar.style.width = "0%";
                    setTimeout(() => {
                        bar.style.width = w;
                    }, 50);
                });
            }

            document.addEventListener("DOMContentLoaded", () => {
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
                            if (v.id === `view-${target}`) {
                                v.classList.add("active");
                                animateBars(`view-${target}`); // Reanimar gráficos ao abrir
                            }
                        });

                        // Fechar menu mobile se estiver aberto
                        if (window.innerWidth <= 768) {
                            document.getElementById("sidebar").classList.remove("active");
                        }
                    });
                });

                // Animar primeira view no load
                animateBars("view-dashboard");

                // 2. Lógica do Tema Noturno
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

                // 3. Carregar o nome guardado no Perfil
                const savedName = localStorage.getItem("ecorewards-name-b2g");
                if (savedName) {
                    document.getElementById("dashboard-user-name").innerText = savedName;
                    const initials = savedName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase();
                    document.getElementById("avatar-b2g").innerText = initials;
                }
            });
