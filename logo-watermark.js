(function() {
    // Create overlay container
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.bottom = '16px'; // đặt ở góc dưới
    overlay.style.right = '16px'; // đặt ở góc phải
    overlay.style.top = '';
    overlay.style.left = '';
    overlay.style.transform = ''; // bỏ transform
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0.12'; // có thể tăng nhẹ cho dễ nhìn
    overlay.style.pointerEvents = 'none';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';

    // Create logo image
    var img = document.createElement('img');
    img.src = 'https://www.xaydungmkhome.online/Logo.png';
    img.alt = 'Logo';
    img.style.width = '120px'; // thu nhỏ lại
    img.style.height = 'auto';
    img.style.display = 'block';

    // Create signature text
    var sign = document.createElement('div');
    sign.textContent = 'minhkhoa';
    sign.style.fontSize = '24px'; // thu nhỏ lại
    sign.style.fontFamily = 'cursive, "Brush Script MT", "Comic Sans MS", sans-serif';
    sign.style.fontStyle = 'italic';
    sign.style.color = '#000';
    sign.style.marginTop = '4px';

    // Append elements
    overlay.appendChild(img);
    overlay.appendChild(sign);
    document.body.appendChild(overlay);
})();
