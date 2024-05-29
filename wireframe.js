javascript:(function() {
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

    window.addEventListener('keyup', function(event) {
        if (event.code === 'KeyN') {
            settings.wireframe = !settings.wireframe;
        }
    });
})();
