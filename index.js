const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl2");

canvas.width = 512;
canvas.height = 512;

function initShaders() {
  const p = gl.createProgram();

  const v = document.querySelector("#vs").textContent;
  const f = document.querySelector("#fs").textContent;

  const vs = gl.createShader(gl.VERTEX_SHADER);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vs, v);
  gl.shaderSource(fs, f);
  gl.compileShader(vs);
  gl.compileShader(fs);
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.useProgram(p);
  gl.bindAttribLocation(p, 0, "position");
  gl.enableVertexAttribArray(0);
}

let startTimestamp = -1;
let totalTime = 0;
let previousTimestamp = 0;
/**
 * 描画する
 * @param {DOMHighResTimeStamp} currentTimestamp 高精度時刻
 */
function draw(currentTimestamp) {
  if (startTimestamp <= 0) {
    startTimestamp = currentTimestamp;
  }
  totalTime = (currentTimestamp - startTimestamp) / 1000;
  const elapsedTime = (currentTimestamp - previousTimestamp) / 1000;
  previousTimestamp = currentTimestamp;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let data = [];
  const MAX_VERTEX = 20;

  // データ列の生成
  for (let i = 0; i < MAX_VERTEX; i++) {
    const x = 0.9 * ((2 * i) / MAX_VERTEX - 1.0);
    const y = 0.9 * Math.sin((2 * Math.PI * i) / MAX_VERTEX + totalTime);
    data = data.concat([x, y, 0.0]);
  }

  // バッファオブジェクトを作成
  const buffer = gl.createBuffer();
  if (buffer === null) {
    throw new Error("バッファを作成できませんでした");
  }

  // バッファをバインドする
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  // シェーダー側の変数をjs側で受け取る
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

  // 描画
  gl.drawArrays(gl.LINE_STRIP, 0, data.length / 3);
  gl.drawArrays(gl.POINTS, 0, data.length / 3);

  // 更新
  gl.flush();

  requestAnimationFrame(draw);
}

initShaders();

requestAnimationFrame(draw);
