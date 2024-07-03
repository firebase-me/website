# Simple Calculator

This is a simple calculator embedded in a markdown file.

<div id="calculator">
  <input type="text" id="result" disabled>
  <br>
  <button onclick="clearResult()">C</button>
  <button onclick="appendNumber(1)">1</button>
  <button onclick="appendNumber(2)">2</button>
  <button onclick="appendNumber(3)">3</button>
  <button onclick="appendNumber('+')">+</button>
  <br>
  <button onclick="appendNumber(4)">4</button>
  <button onclick="appendNumber(5)">5</button>
  <button onclick="appendNumber(6)">6</button>
  <button onclick="appendNumber('-')">-</button>
  <br>
  <button onclick="appendNumber(7)">7</button>
  <button onclick="appendNumber(8)">8</button>
  <button onclick="appendNumber(9)">9</button>
  <button onclick="appendNumber('*')">*</button>
  <br>
  <button onclick="appendNumber(0)">0</button>
  <button onclick="calculateResult()">=</button>
  <button onclick="appendNumber('/')">/</button>
</div>

<script>
  function appendNumber(number) {
    document.getElementById('result').value += number;
  }

  function clearResult() {
    document.getElementById('result').value = '';
  }

  function calculateResult() {
    var result = eval(document.getElementById('result').value);
    document.getElementById('result').value = result;
  }
</script>
