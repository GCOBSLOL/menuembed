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

function cheat(name, key, status, update) {
    this.name = name;
    this.key = key;
    this.status = status;
    this.update = update;
    this.toggle = function() {
        this.status = !this.status;
        if (this.name === "blink" && !this.status) {
            var warning = document.createElement("div");
            warning.textContent = "Blink has been turned off!";
            warning.style = "position: fixed; top: 20px; right: 20px; background-color: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-family: sans-serif; border-radius: 25px;";
            document.body.appendChild(warning);
            setTimeout(function() {
                warning.remove();
            }, 3000);
        }
        if (typeof this.update === "function") {
            this.update(this.status, this);
        }
    };
}

function getCheat(name) {
    var cheat;
    cheats.forEach(function(item) {
        if (item.name === name) {
            cheat = item;
        }
    });
    return cheat;
}

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
