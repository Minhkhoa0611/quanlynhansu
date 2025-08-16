
(function() {
    const today = new Date();
    const expire = new Date("2025-09-01T23:59:59");

    if (today <= expire) {
        const bar = document.createElement("div");
        bar.style.position = "fixed";
        bar.style.top = "0";
        bar.style.left = "0";
        bar.style.width = "100%";
        bar.style.height = "40px";
        bar.style.background = "#ffcc00";
        bar.style.color = "#000";
        bar.style.fontWeight = "bold";
        bar.style.fontSize = "15px";
        bar.style.zIndex = "9999";
        bar.style.overflow = "hidden";
        bar.style.display = "flex";
        bar.style.alignItems = "center";
        bar.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

        const text = document.createElement("div");
        text.innerText = "📢 TỪ 01/09/2025: TIMES PRO HRM SẼ NÂNG CẤP LÊN PHIÊN BẢN v2.2.3 – GIAO DIỆN BẢNG LƯƠNG MỚI, TÍNH & BÁO CÁO LƯƠNG CHUẨN HƠN.";
        text.style.whiteSpace = "nowrap";
        text.style.position = "relative";
        text.style.left = "100%";

        bar.appendChild(text);
        document.body.prepend(bar);

        document.body.style.marginTop = "45px";

        let pos = bar.offsetWidth;
        function animate() {
            pos--;
            if (pos < -text.offsetWidth) {
                pos = bar.offsetWidth;
            }
            text.style.left = pos + "px";
            requestAnimationFrame(animate);
        }
        animate();
    }
})();

