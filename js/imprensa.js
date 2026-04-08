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
