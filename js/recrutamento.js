// Lógica de Toast
            function showToast(msg) {
                const container = document.getElementById("toast-container");
                const toast = document.createElement("div");
                toast.className = "toast";
                toast.innerHTML = `<i class="ph-fill ph-check-circle"></i> <span style="font-weight: 500;">${msg}</span>`;
                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.animation = "slideOut 0.3s forwards";
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            document.addEventListener("DOMContentLoaded", () => {
                // Lógica do Upload de Ficheiro Simulado
                const fileInput = document.getElementById("cv-upload");
                const fileDisplay = document.getElementById("file-name-display");

                fileInput.addEventListener("change", function () {
                    if (this.files && this.files.length > 0) {
                        fileDisplay.innerHTML = `
                        <i class="ph-fill ph-file-pdf" style="font-size: 2rem; color: var(--brand-primary);"></i>
                        <span style="font-weight: 600; color: var(--brand-primary);">${this.files[0].name}</span>
                        <span style="font-size: 0.75rem;">Ficheiro anexado com sucesso</span>
                    `;
                    }
                });

                // Lógica do Formulário
                document.getElementById("recruitment-form").addEventListener("submit", (e) => {
                    e.preventDefault();
                    showToast("A sua candidatura foi enviada com sucesso! Boa sorte.");
                    setTimeout(() => {
                        window.location.href = "carreiras.html";
                    }, 3000);
                });

                // Lógica do Tema (Dark Mode)
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
