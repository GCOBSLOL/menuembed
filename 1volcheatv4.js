var version = "v1.2";
fetch("https://raw.githubusercontent.com/Kepler-11/1v1.lmao/main/server/version.json")
    .then(e => e.text())
    .then(e => {
        var t = JSON.parse(e).currentVersion;
        if (t != version) {
            alert("1v1.lmao is outdated!\nYour version: " + version + "\nNewest version: " + t + "\nPlease update.");
            location.href = "https://github.com/Kepler-11/1v1.lmao";
        }
    });

var send = WebSocket.prototype.send;
var buffers = [];
var on = false;
var cheats = [];
var gui = true;

// Cheat constructor
function cheat(name, key, status, update) {
    this.name = name;
    this.key = key;
    this.status = status;
    this.update = update;
    this.toggle = function() {
        this.status = !this.status;
        if (typeof this.update === "function") {
            this.update(this.status, this);
        }
    };
}

// Find cheat by name
function getCheat(name) {
    var cheat;
    cheats.forEach(function(item) {
        if (item.name === name) {
            cheat = item;
        }
    });
    return cheat;
}

// Adding cheats to the array
cheats.push(new cheat("gui", "`", true));
cheats.push(new cheat("blink", "t", false, function(status, cheat) {
    if (status) {
        WebSocket.prototype.send = function() {
            buffers.push([this, arguments]);
        };
    } else {
        getCheat("blink").time = 0;
        if (buffers.length !== 0) {
            for (var i in buffers) {
                var buffer = buffers[i];
                send.apply(buffer[0], buffer[1]);
            }
            buffers = [];
        }
        WebSocket.prototype.send = send;
    }
}));

cheats.push(new cheat("wireframe", "n", false, function(status) {
    settings.wireframe = status;
}));

getCheat("blink").time = 0;

document.addEventListener("keydown", function(e) {
    cheats.forEach(function(item) {
        if (e.key === item.key) {
            item.toggle();
        }
    });
});

setInterval(function() {
    var cheatGui = document.querySelector("#cheatGui");
    if (cheatGui) {
        cheatGui.remove();
    }
    var div = document.createElement("div");
    div.id = "cheatGui";
    div.style = '\n    border-radius: 25px;\n    font-family: "sans-serif";\n    color: pink;\n    text-align: center;\n    top: 0;\n    position: absolute;\n    width: 225px;\n    background-color: rgba(255, 255, 255, .0);\n    z-index:10000;\n     ';
    div.innerHTML += "<h1>1v1.lmao</h1><p>Re-Styled</p>";
    cheats.forEach(function(item) {
        var key = item.key.toUpperCase();
        var name = item.name.toUpperCase();
        var status = item.status ? "ON" : "OFF";
        var color = item.status ? "lime" : "red";
        var time = "";
        if (item.name === "blink" && item.status) {
            time = " (" + parseFloat(item.time / 10) + (parseInt(item.time / 10) === item.time / 10 ? ".0" : "") + ")";
            if (item.time >= 90) {
                item.toggle();
            }
        }
        div.innerHTML += '<span>[' + key + '] ' + name + ' <span style="color:' + color + '">' + status + time + '</span></span><br>';
    });
    var gameContainer = document.querySelector("#gameContainer");
    if (gameContainer && getCheat("gui").status) {
        gameContainer.style.position = "relative";
        gameContainer.appendChild(div);
    }
    if (getCheat("blink").status) {
        getCheat("blink").time += 1;
    }
}, 100);

const settings = {
    wireframe: false,
};

const WebGL = WebGL2RenderingContext.prototype;

HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
    apply(target, thisArgs, args) {
        if (args[1]) {
            args[1].preserveDrawingBuffer = true;
        }
        return Reflect.apply(...arguments);
    }
});

WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
    apply(target, thisArgs, args) {
        let [shader, src] = args;
        if (src.indexOf('gl_Position') > -1) {
            src = src.replace('void main', `
                out float vDepth;
                uniform bool enabled;
                uniform float threshold;
                void main
            `).replace(/return;/, `
                vDepth = gl_Position.z;
                if (enabled && vDepth > threshold) {
                    gl_Position.z = 1.0;
                }
            `);
        } else if (src.indexOf('SV_Target0') > -1) {
            src = src.replace('void main', `
                in float vDepth;
                uniform bool enabled;
                uniform float threshold;
                void main
            `).replace(/return;/, `
                if (enabled && vDepth > threshold) {
                    SV_Target0 = vec4(1.0, 0.0, 0.0, 1.0);
                }
            `);
        }
        args[1] = src;
        return Reflect.apply(...arguments);
    }
});

WebGL.attachShader = new Proxy(WebGL.attachShader, {
    apply(target, thisArgs, [program, shader]) {
        if (shader.isPlayerShader) program.isPlayerProgram = true;
        return Reflect.apply(...arguments);
    }
});

WebGL.getUniformLocation = new Proxy(WebGL.getUniformLocation, {
    apply(target, thisArgs, [program, name]) {
        const result = Reflect.apply(...arguments);
        if (result) {
            result.name = name;
            result.program = program;
        }
        return result;
    }
});

WebGL.uniform4fv = new Proxy(WebGL.uniform4fv, {
    apply(target, thisArgs, [uniform]) {
        const name = uniform && uniform.name;
        if (name === 'hlslcc_mtx4x4unity_ObjectToWorld' || name === 'hlslcc_mtx4x4unity_ObjectToWorld[0]') {
            uniform.program.isUIProgram = true;
        }
        return Reflect.apply(...arguments);
    }
});

let gl;

const handler = {
    apply(target, thisArgs, args) {
        const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);
        if (!program.uniforms) {
            program.uniforms = {
                enabled: thisArgs.getUniformLocation(program, 'enabled'),
                threshold: thisArgs.getUniformLocation(program, 'threshold')
            };
        }
        const couldBePlayer = program.isPlayerProgram && args[1] > 3000;
        program.uniforms.enabled && thisArgs.uniform1i(program.uniforms.enabled, couldBePlayer);
        program.uniforms.threshold && thisArgs.uniform1f(program.uniforms.threshold, 4.5);
        args[0] = settings.wireframe && !program.isUIProgram && args[1] > 6 ? thisArgs.LINES : args[0];
        if (couldBePlayer) {
            gl = thisArgs;
        }
        Reflect.apply(...arguments);
    }
};

WebGL.drawElements = new Proxy(WebGL.drawElements, handler);
WebGL.drawElementsInstanced = new Proxy(WebGL.drawElementsInstanced, handler);
