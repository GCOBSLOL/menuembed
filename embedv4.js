(function() {
    // Create container div
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.zIndex = '10000';
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    // Create input field
    var urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL';
    urlInput.style.height = '30px';
    urlInput.style.width = '300px';
    urlInput.style.marginRight = '10px';
    urlInput.style.borderRadius = '5px';

    // Create submit button
    var submitButton = document.createElement('button');
    submitButton.innerText = 'Embed';
    submitButton.style.marginRight = '10px';
    submitButton.style.borderRadius = '10px';
    submitButton.style.backgroundColor = '#BBCFF0';
    submitButton.style.color = '#fff';
    submitButton.style.border = 'none';
    submitButton.style.padding = '8px 16px';
    submitButton.style.cursor = 'pointer';

    // Preset interstellar button
    var Interstellar = document.createElement('button');
    Interstellar.innerText = 'Interstellar';
    Interstellar.style.marginRight = '10px';
    Interstellar.style.borderRadius = '10px';
    Interstellar.style.backgroundImage = 'linear-gradient(darkgray, black)';
    Interstellar.style.backgroundColor = '#BBCFF0';
    Interstellar.style.color = '#fff';
    Interstellar.style.border = 'none';
    Interstellar.style.padding = '8px 16px';
    Interstellar.style.cursor = 'pointer';
    Interstellar.style.bottom = '10px';
    Interstellar.style.left = '10px';
    Interstellar.style.position = 'fixed';

    // Preset selenite button
    var Selenite = document.createElement('button');
    Selenite.innerText = 'Selenite';
    Selenite.style.borderRadius = '10px';
    Selenite.style.backgroundImage = 'linear-gradient(#FF90D7, purple)';
    Selenite.style.backgroundColor = '#BBCFF0';
    Selenite.style.color = '#fff';
    Selenite.style.border = 'none';
    Selenite.style.padding = '8px 16px';
    Selenite.style.cursor = 'pointer';
    Selenite.style.bottom = '10px';
    Selenite.style.left = '110px';
    Selenite.style.position = 'fixed';

    // Create close button
    var closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.right = '10px';
    closeButton.style.top = '10px';
    closeButton.style.position = 'fixed';
    closeButton.style.borderRadius = '10px';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 16px';
    closeButton.style.cursor = 'pointer';
    
    // Create game button
    var gameButton = document.createElement('button');
    gameButton.innerText = 'Games';
    gameButton.style.right = '10px';
    gameButton.style.bottom = '10px';
    gameButton.style.position = 'fixed';
    gameButton.style.border = 'none';
    gameButton.style.backgroundColor = '#BAF1BE';
    gameButton.style.borderRadius = '10px';
    gameButton.style.padding = '8px 16px';
    gameButton.style.cursor = 'pointer';
    
    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.zIndex = '9999';

    // Event listeners
    submitButton.onclick = function() {
        iframe.src = urlInput.value;
    };

    Interstellar.onclick = function() {
        iframe.src = 'https://glowing-waddle-jx4q6wqxxj6fpjqv-8080.app.github.dev/';
    };

    Selenite.onclick = function() {
        iframe.src = 'https://effective-space-pancake-qw9prg4qqwwh9qr4-3000.app.github.dev/projects.html';
    };
    
     gameButton.onclick = function() {
        iframe.src = 'https://ckpro.w3spaces.com/EmbedGameSelect.html';
    };

    closeButton.onclick = function() {
        document.body.removeChild(container);
        document.body.removeChild(iframe);
    };

    // Append elements to container
    container.appendChild(urlInput);
    container.appendChild(submitButton);
    container.appendChild(Interstellar);
    container.appendChild(Selenite);
    container.appendChild(closeButton);
    container.appendChild(gameButton)

    // Append container and iframe to body
    document.body.appendChild(container);
    document.body.appendChild(iframe);

    // Panic button
    var isHidden = false;

    document.addEventListener('keydown', function(event) {
        if (event.key === '\\') {
            if (isHidden) {
                container.style.display = 'flex';
                iframe.style.display = 'block';
            } else {
                container.style.display = 'none';
                iframe.style.display = 'none';
            }
            isHidden = !isHidden;
        }
    });
})();