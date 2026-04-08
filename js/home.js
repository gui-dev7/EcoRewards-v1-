function showToast(msg) {
                const container = document.getElementById("toast-container");
                const toast = document.createElement("div");
                toast.className = "toast";
                toast.innerHTML = `<i class="ph-fill ph-info"></i> <span>${msg}</span>`;
                container.appendChild(toast);
                setTimeout(() => {
                    toast.style.animation = "slideOut 0.3s forwards";
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            document.addEventListener("DOMContentLoaded", () => {
                // Lógica da Navbar com Sombra ao fazer Scroll
                const navbar = document.getElementById("navbar");
                window.addEventListener("scroll", () => {
                    if (window.scrollY > 20) {
                        navbar.classList.add("scrolled");
                    } else {
                        navbar.classList.remove("scrolled");
                    }
                });

                // Lógica do Dark Mode (Partilhada com o resto do ecossistema)
                const themeToggleBtn = document.getElementById("themeToggle");
                const themeIcon = themeToggleBtn.querySelector("i");
                const body = document.body;

                // Verificar tema salvo no localStorage
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

                // Intersection Observer para Animações (Fade In Up)
                const observerOptions = {
                    root: null,
                    rootMargin: "0px",
                    threshold: 0.15,
                };

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            observer.unobserve(entry.target); // Animar apenas uma vez
                        }
                    });
                }, observerOptions);

                document.querySelectorAll(".fade-in-up").forEach((element) => {
                    observer.observe(element);
                });
            });
