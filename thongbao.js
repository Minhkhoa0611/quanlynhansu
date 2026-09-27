(function () {

    // ================================
    // WORKFORCE 365 HRM
    // CLOUD UPDATE NOTIFICATION
    // ================================

    // Tạo CSS
    const style = document.createElement("style");

    style.textContent = `
        .workforce-update-overlay {
            position: fixed;
            inset: 0;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(0,0,0,.65);
            backdrop-filter: blur(6px);
            font-family: Arial, sans-serif;
            animation: wfFade .3s ease;
        }

        .workforce-update-box {
            position: relative;
            width: min(580px, 100%);
            max-height: 90vh;
            overflow-y: auto;
            padding: 30px;
            background: #fff;
            border-radius: 22px;
            box-shadow: 0 25px 80px rgba(0,0,0,.35);
            animation: wfPopup .35s ease;
        }

        .wf-close {
            position: absolute;
            top: 14px;
            right: 15px;
            width: 36px;
            height: 36px;
            border: 0;
            border-radius: 50%;
            background: #f1f3f5;
            color: #555;
            font-size: 24px;
            cursor: pointer;
        }

        .wf-close:hover {
            background: #e5e7eb;
            transform: rotate(90deg);
        }

        .wf-cloud {
            width: 65px;
            height: 65px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px;
            background: linear-gradient(135deg,#1677ff,#00b7ff);
            font-size: 32px;
            box-shadow: 0 8px 25px rgba(22,119,255,.3);
        }

        .wf-title {
            text-align: center;
            font-size: 25px;
            font-weight: 800;
            color: #111827;
        }

        .wf-subtitle {
            margin-top: 5px;
            text-align: center;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #1677ff;
        }

        .wf-content {
            margin-top: 25px;
            color: #374151;
            font-size: 15px;
            line-height: 1.7;
        }

        .wf-content p {
            margin: 0 0 15px;
        }

        .wf-date {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            background: #eaf3ff;
            color: #1264d8;
            font-weight: 800;
        }

        .wf-warning {
            margin: 20px 0;
            padding: 17px;
            border-radius: 14px;
            background: #fff7ed;
            border: 1px solid #fed7aa;
            color: #9a3412;
        }

        .wf-warning-title {
            margin-bottom: 5px;
            font-weight: 900;
            color: #c2410c;
        }

        .wf-contact {
            margin-top: 20px;
            padding: 16px;
            border-radius: 14px;
            background: #f5f8ff;
            border: 1px solid #dbe7ff;
            color: #374151;
        }

        .wf-contact-title {
            margin-bottom: 7px;
            font-weight: 800;
            color: #1677ff;
        }

        .wf-contact-name {
            margin-top: 8px;
            padding: 10px;
            background: #fff;
            border-radius: 9px;
            color: #111827;
        }

        .wf-confirm {
            width: 100%;
            margin-top: 22px;
            padding: 14px;
            border: 0;
            border-radius: 12px;
            background: linear-gradient(135deg,#1677ff,#0066ff);
            color: white;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: .2s;
        }

        .wf-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(22,119,255,.3);
        }

        @keyframes wfFade {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes wfPopup {
            from {
                opacity: 0;
                transform: translateY(25px) scale(.95);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @media(max-width:600px) {

            .workforce-update-box {
                padding: 24px 20px;
            }

            .wf-title {
                font-size: 21px;
            }

            .wf-content {
                font-size: 14px;
            }
        }
    `;

    document.head.appendChild(style);


    // ================================
    // TẠO THÔNG BÁO
    // ================================

    const overlay = document.createElement("div");

    overlay.className = "workforce-update-overlay";

    overlay.innerHTML = `

        <div class="workforce-update-box">

            <button class="wf-close" id="wfClose">
                ×
            </button>

            <div class="wf-cloud">
                ☁️
            </div>

            <div class="wf-title">
                UPDATE PHẦN MỀM
            </div>

            <div class="wf-subtitle">
                CẬP NHẬT DỮ LIỆU LÊN CLOUD
            </div>

            <div class="wf-content">

                <p>
                    <strong>📢 Xin thông báo!</strong>
                </p>

                <p>
                    Từ ngày
                    <span class="wf-date">01/10/2026</span>,
                    phần mềm chấm công
                    <strong>Workforce 365 HRM</strong>
                    sẽ chính thức cập nhật dữ liệu nhân sự lên
                    <strong>Cloud</strong>.
                </p>

                <p>
                    Việc nâng cấp nhằm đảm bảo dữ liệu nhân viên
                    giữa các cửa hàng được
                    <strong>đồng bộ hóa tập trung</strong>,
                    quản lý thuận tiện và giúp phần mềm
                    hoạt động ổn định hơn.
                </p>

                <p>
                    Đây là một nâng cấp cơ bản và cần thiết
                    nhằm cải thiện khả năng vận hành và
                    đồng bộ dữ liệu của hệ thống.
                </p>

                <div class="wf-warning">

                    <div class="wf-warning-title">
                        ⚠️ LƯU Ý QUAN TRỌNG
                    </div>

                    Toàn bộ dữ liệu cũ trước đây
                    <strong>sẽ được xóa hoàn toàn</strong>
                    trong quá trình chuyển đổi sang hệ thống Cloud.

                    <br><br>

                    Vui lòng kiểm tra và sao lưu các dữ liệu
                    cần thiết trước thời điểm cập nhật.

                </div>

                <p>
                    Rất mong quý anh/chị phối hợp để quá trình
                    chuyển đổi dữ liệu diễn ra thuận lợi.
                </p>

                <p style="text-align:center;color:#6b7280;">
                    Xin chân thành cảm ơn quý anh/chị
                    đã đồng hành cùng
                    <strong>Workforce 365 HRM</strong> ❤️
                </p>

                <div class="wf-contact">

                    <div class="wf-contact-title">
                        📞 HỖ TRỢ & LIÊN HỆ
                    </div>

                    <div>
                        Mọi thắc mắc hoặc cần hỗ trợ
                        trong quá trình cập nhật,
                        vui lòng liên hệ:
                    </div>

                    <div class="wf-contact-name">

                        <strong>
                            DevTech: Trần Minh Khoa
                        </strong>

                        <br>

                        📱
                        <strong style="color:#1677ff;">
                            0867 544 809
                        </strong>

                    </div>

                </div>

            </div>

            <button class="wf-confirm" id="wfConfirm">
                ✓ ĐÃ HIỂU
            </button>

        </div>
    `;

    document.body.appendChild(overlay);


    // ================================
    // ĐÓNG THÔNG BÁO
    // ================================

    function closeNotice() {

        overlay.style.opacity = "0";
        overlay.style.transition = "opacity .2s";

        setTimeout(() => {
            overlay.remove();
        }, 200);

    }

    document
        .getElementById("wfClose")
        .addEventListener("click", closeNotice);

    document
        .getElementById("wfConfirm")
        .addEventListener("click", closeNotice);


})();