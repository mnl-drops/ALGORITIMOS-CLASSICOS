'use strict';

const express = require('express');
const path = require('path');
const { execFileSync } = require('child_process');

const app = express();
const javaDirectory = path.join(__dirname, 'java');
const javaSource = path.join(javaDirectory, 'JavaAlgorithms.java');
const names = { primo: 'Número primo', somatorio: 'Somatório', fibonacci: 'Fibonacci', mdc: 'MDC de Euclides', quicksort: 'Quicksort', contagem: 'Contagem por intervalo' };
let javaCompiled = false;

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const integer = Number.isSafeInteger;
const list = (values) => Array.isArray(values) && values.length >= 1 && values.length <= 500 && values.every(integer);
const invalid = (res, message) => res.status(400).json({ erro: message });

function javaResult(operation, body) {
  if (!javaCompiled) {
    execFileSync('javac', ['-encoding', 'UTF-8', javaSource], { cwd: javaDirectory, stdio: 'pipe' });
    javaCompiled = true;
  }
  const args = operation === 'somatorio' || operation === 'quicksort' || operation === 'contagem'
    ? body.valores.map(String)
    : operation === 'mdc' ? [String(body.a), String(body.b)] : [String(body.n)];
  const output = execFileSync('java', ['-cp', javaDirectory, 'JavaAlgorithms', operation, ...args], {
    cwd: javaDirectory, encoding: 'utf8', timeout: 10000, maxBuffer: 1024 * 1024
  });
  return JSON.parse(output);
}

function execute(req, res, operation, javascriptCalculation) {
  const language = req.body?.linguagem ?? 'javascript';
  if (!['java', 'javascript'].includes(language)) return invalid(res, 'Escolha Java ou JavaScript.');
  try {
    const result = language === 'java' ? javaResult(operation, req.body) : javascriptCalculation();
    if (operation === 'somatorio' && !integer(result.resultado)) return invalid(res, 'A soma excede o limite de inteiros seguros.');
    return res.json({ algoritmo: names[operation], linguagem: language === 'java' ? 'Java' : 'JavaScript', ...result });
  } catch (error) {
    if (error.code === 'ENOENT') return res.status(503).json({ erro: 'Para executar em Java, instale um JDK e confirme que javac e java estão disponíveis no PATH.' });
    console.error(error);
    return res.status(500).json({ erro: 'Não foi possível executar esta função no modelo escolhido.' });
  }
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const arithmetic = {
  soma: { nome: 'Soma', calcular: (a, b) => a + b },
  subtracao: { nome: 'Subtração', calcular: (a, b) => a - b },
  multiplicacao: { nome: 'Multiplicação', calcular: (a, b) => a * b },
  divisao: { nome: 'Divisão', calcular: (a, b) => a / b }
};

function arithmeticRoute(req, res, operation) {
  const { a, b } = req.body || {};
  if (!Number.isFinite(a) || !Number.isFinite(b)) return invalid(res, 'Informe os números a e b no corpo JSON.');
  if (operation === 'divisao' && b === 0) return invalid(res, 'O divisor b não pode ser zero.');
  const resultado = arithmetic[operation].calcular(a, b);
  if (!Number.isFinite(resultado)) return invalid(res, 'O resultado está fora do intervalo numérico válido.');
  return res.json({ operacao: arithmetic[operation].nome, a, b, resultado });
}

app.post('/soma', (req, res) => arithmeticRoute(req, res, 'soma'));
app.post('/subtracao', (req, res) => arithmeticRoute(req, res, 'subtracao'));
app.post('/multiplicacao', (req, res) => arithmeticRoute(req, res, 'multiplicacao'));
app.post('/divisao', (req, res) => arithmeticRoute(req, res, 'divisao'));

app.post('/api/primo', (req, res) => {
  const { n } = req.body || {};
  if (!integer(n) || n < 1) return invalid(res, 'Informe um inteiro positivo.');
  return execute(req, res, 'primo', () => {
    let resultado = n >= 2;
    for (let divisor = 2; resultado && divisor <= Math.sqrt(n); divisor++) if (n % divisor === 0) resultado = false;
    return { entrada: n, resultado };
  });
});

app.post('/api/somatorio', (req, res) => {
  const { valores } = req.body || {};
  if (!list(valores)) return invalid(res, 'Envie de 1 a 500 inteiros em valores.');
  return execute(req, res, 'somatorio', () => ({ resultado: valores.reduce((total, value) => total + value, 0) }));
});

app.post('/api/fibonacci', (req, res) => {
  const { n } = req.body || {};
  if (!integer(n) || n < 2 || n > 78) return invalid(res, 'Informe de 2 a 78 termos.');
  return execute(req, res, 'fibonacci', () => {
    const resultado = [0, 1];
    while (resultado.length < n) resultado.push(resultado.at(-1) + resultado.at(-2));
    return { resultado };
  });
});

app.post('/api/mdc', (req, res) => {
  const { a, b } = req.body || {};
  if (!integer(a) || !integer(b)) return invalid(res, 'Informe dois inteiros seguros.');
  return execute(req, res, 'mdc', () => {
    let x = Math.abs(a), y = Math.abs(b);
    while (y) [x, y] = [y, x % y];
    return { resultado: x };
  });
});

app.post('/api/quicksort', (req, res) => {
  const { valores } = req.body || {};
  if (!list(valores)) return invalid(res, 'Envie de 1 a 500 inteiros em valores.');
  return execute(req, res, 'quicksort', () => {
    const resultado = [...valores];
    function ordenar(low, high) {
      if (low >= high) return;
      const pivot = resultado[high]; let smaller = low;
      for (let current = low; current < high; current++) if (resultado[current] <= pivot) {
        [resultado[smaller], resultado[current]] = [resultado[current], resultado[smaller]]; smaller++;
      }
      [resultado[smaller], resultado[high]] = [resultado[high], resultado[smaller]];
      ordenar(low, smaller - 1); ordenar(smaller + 1, high);
    }
    ordenar(0, resultado.length - 1);
    return { resultado };
  });
});

app.post('/api/contagem', (req, res) => {
  const { valores } = req.body || {};
  if (!list(valores)) return invalid(res, 'Envie de 1 a 500 inteiros em valores.');
  return execute(req, res, 'contagem', () => {
    const primeiro = valores[0], inferior = Math.min(primeiro, valores.length), superior = Math.max(primeiro, valores.length);
    const resultado = valores.filter((value) => value >= inferior && value <= superior).length;
    return { primeiro, intervalo: [inferior, superior], resultado };
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) return invalid(res, 'JSON inválido.');
  console.error(error);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const port = Number(process.env.PORT) || 3001;
if (require.main === module) app.listen(port, '0.0.0.0', () => console.log(`Servidor iniciado na porta ${port}`));
module.exports = app;
