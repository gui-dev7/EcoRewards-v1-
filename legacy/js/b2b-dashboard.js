function showToast(message, type = "success") {
                const container = document.getElementById("toast-container");
                const toast = document.createElement("div");

                toast.className = `toast ${type}`;
                let icon = "ph-check-circle";
                if (type === "error") icon = "ph-warning-circle";
                if (type === "info") icon = "ph-info";

                toast.innerHTML = `<i class="ph-fill ${icon}"></i> <span style="flex:1;">${message}</span>`;

                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.animation = "slideIn 0.3s forwards reverse"; // Slide out
                    toast.style.opacity = "0";
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            // Animar Barras
            function animateBars(viewId) {
                const view = document.getElementById(viewId);
                if (!view) return;

                view.querySelectorAll(".anim-h").forEach((bar) => {
                    const h = bar.getAttribute("data-h");
                    bar.style.height = "0%";
                    setTimeout(() => {
                        bar.style.height = h;
                    }, 50);
                });
                view.querySelectorAll(".anim-w").forEach((bar) => {
                    const w = bar.getAttribute("data-w");
                    bar.style.width = "0%";
                    setTimeout(() => {
                        bar.style.width = w;
                    }, 50);
                });
            }

            document.addEventListener("DOMContentLoaded", () => {
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
                                animateBars(`view-${target}`);
                            }
                        });

                        if (window.innerWidth <= 768) {
                            document.getElementById("sidebar").classList.remove("active");
                        }
                    });
                });

                animateBars("view-dashboard");

                // Tema Noturno
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

                // Carregar o nome do Perfil
                const savedName = localStorage.getItem("ecorewards-name-b2b");
                if (savedName) {
                    document.getElementById("dashboard-user-name").innerText = savedName;
                    const initials = savedName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase();
                    document.getElementById("avatar-b2b").innerText = initials;
                }
            });
