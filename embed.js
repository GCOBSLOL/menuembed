javascript:(function(){
    var iframe = document.createElement('iframe');
    var closeButton = document.createElement('button');
    var urlInput = document.createElement('input');
    var submitButton = document.createElement('button');
    var presetButton = document.createElement('button');

    closeButton.innerText = 'Close';
    closeButton.style.position = 'fixed';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.zIndex = '10000';
    closeButton.onclick = function(){
        document.body.removeChild(iframe);
        document.body.removeChild(closeButton);
        document.body.removeChild(urlInput);
        document.body.removeChild(submitButton);
        document.body.removeChild(presetButton);
    };

    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL';
    urlInput.style.position = 'fixed';
    urlInput.style.top = '10px';
    urlInput.style.left = '10px';
    urlInput.style.zIndex = '10000';
    urlInput.style.width = '300px';

    submitButton.innerText = 'Embed';
    submitButton.style.position = 'fixed';
    submitButton.style.top = '10px';
    submitButton.style.left = '320px';
    submitButton.style.zIndex = '10000';
    submitButton.onclick = function(){
        iframe.src = urlInput.value;
    };

    presetButton.innerText = 'Interstellar';
    presetButton.style.position = 'fixed';
    presetButton.style.top = '10px';
    presetButton.style.left = '440px';
    presetButton.style.zIndex = '10000';
    presetButton.onclick = function(){
        iframe.src = 'https://glowing-waddle-jx4q6wqxxj6fpjqv-8080.app.github.dev/';
    };

    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.zIndex = '9999';

    document.body.appendChild(closeButton);
    document.body.appendChild(urlInput);
    document.body.appendChild(submitButton);
    document.body.appendChild(presetButton);
    document.body.appendChild(iframe);
})();
