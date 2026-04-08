document.addEventListener("DOMContentLoaded", () => {
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

                // Intersection Observer para as Animações de Scroll (Fade In Up)
                const observerOptions = {
                    root: null,
                    rootMargin: "0px",
                    threshold: 0.15,
                };

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                document.querySelectorAll(".fade-in-up").forEach((element) => {
                    observer.observe(element);
                });
            });
