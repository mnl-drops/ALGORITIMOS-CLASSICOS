const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const entradaLinhas = rl[Symbol.asyncIterator]();
async function pergunta(mensagem) {
    process.stdout.write(mensagem);
    const { value, done } = await entradaLinhas.next();
    return done ? "" : value;
}
async function lerInteiro(mensagem) {
    while (true) {
        const entrada = await pergunta(mensagem);
        const valor = parseInt(entrada.trim(), 10);
        if (!isNaN(valor)) {
            return valor;
        }
        console.log("Entrada inválida. Digite um número inteiro.");
    }
}


function exibirMenu() {
    console.log("===== ALGORITMOS =====\n");
    console.log("1 - Número Primo");
    console.log("2 - Somatório");
    console.log("3 - Fibonacci");
    console.log("4 - MDC");
    console.log("5 - Quicksort");
    console.log("6 - Contagem");
    console.log("0 - Sair\n");
}

function ehPrimo(n) {
    if (n < 2) {
        return false;
    }
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}

async function executarNumeroPrimo() {
    console.log("\n--- Número Primo ---");
    const n = await lerInteiro("Digite um número inteiro positivo: ");

    if (n < 1) {
        console.log("O número deve ser positivo.");
        return;
    }

    if (ehPrimo(n)) {
        console.log(n + " é um número primo.");
    } else {
        console.log(n + " não é um número primo.");
    }
}

async function executarSomatorio() {
    console.log("\n--- Somatório ---");
    const n = await lerInteiro("Quantos números deseja somar? ");

    if (n <= 0) {
        console.log("A quantidade deve ser maior que zero.");
        return;
    }

    let soma = 0;
    for (let i = 1; i <= n; i++) {
        const valor = await lerInteiro("Digite o número " + i + ": ");
        soma += valor;
    }

    console.log("Somatório dos " + n + " números: " + soma);
}

async function executarFibonacci() {
    console.log("\n--- Fibonacci ---");
    const n = await lerInteiro("Digite a quantidade de termos (N > 1): ");

    if (n <= 1) {
        console.log("N deve ser maior que 1.");
        return;
    }

    const termos = new Array(n);
    termos[0] = 0;
    termos[1] = 1;

    for (let i = 2; i < n; i++) {
        termos[i] = termos[i - 1] + termos[i - 2];
    }

    console.log("Sequência de Fibonacci: " + termos.join(", "));
}

function mdc(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const resto = a % b;
        a = b;
        b = resto;
    }
    return a;
}

async function executarMdc() {
    console.log("\n--- MDC (Algoritmo de Euclides) ---");
    const a = await lerInteiro("Digite o primeiro número (a): ");
    const b = await lerInteiro("Digite o segundo número (b): ");

    const resultado = mdc(a, b);
    console.log("O MDC entre " + a + " e " + b + " é: " + resultado);
}

function quicksort(arr, inicio, fim) {
    if (inicio < fim) {
        const posicaoPivo = particionar(arr, inicio, fim);
        quicksort(arr, inicio, posicaoPivo - 1);
        quicksort(arr, posicaoPivo + 1, fim);
    }
}

function particionar(arr, inicio, fim) {
    const pivo = arr[fim];
    let i = inicio - 1;

    for (let j = inicio; j < fim; j++) {
        if (arr[j] <= pivo) {
            i++;
            trocar(arr, i, j);
        }
    }

    trocar(arr, i + 1, fim);
    return i + 1;
}

function trocar(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

async function executarQuicksort() {
    console.log("\n--- Quicksort ---");
    const n = await lerInteiro("Quantos números deseja ordenar? ");

    if (n <= 0) {
        console.log("A quantidade deve ser maior que zero.");
        return;
    }

    const numeros = [];
    for (let i = 0; i < n; i++) {
        const valor = await lerInteiro("Digite o número " + (i + 1) + ": ");
        numeros.push(valor);
    }

    quicksort(numeros, 0, numeros.length - 1);

    console.log("Números ordenados: " + numeros.join(", "));
}

async function executarContagem() {
    console.log("\n--- Contagem ---");
    console.log("Exemplo: se N = 5 e os números digitados forem [2, 4, 1, 5, 3],");
    console.log("o primeiro valor é 2 e o limite é N = 5.");
    console.log("O programa conta quantos valores do conjunto estão entre 2 e 5 (inclusive).\n");

    const n = await lerInteiro("Digite o valor de N (quantidade de números): ");

    if (n <= 0) {
        console.log("N deve ser maior que zero.");
        return;
    }

    const dados = [];
    for (let i = 0; i < n; i++) {
        const valor = await lerInteiro("Digite o número " + (i + 1) + ": ");
        dados.push(valor);
    }

    const primeiro = dados[0];
    const limiteInferior = Math.min(primeiro, n);
    const limiteSuperior = Math.max(primeiro, n);

    let contador = 0;
    for (const valor of dados) {
        if (valor >= limiteInferior && valor <= limiteSuperior) {
            contador++;
        }
    }

    console.log("Primeiro valor do conjunto: " + primeiro);
    console.log("Intervalo considerado: [" + limiteInferior + ", " + limiteSuperior + "]");
    console.log("Quantidade de valores dentro do intervalo: " + contador);
}

async function main() {
    let opcao;

    do {
        exibirMenu();
        opcao = await lerInteiro("Escolha uma opção: ");

        switch (opcao) {
            case 1:
                await executarNumeroPrimo();
                break;
            case 2:
                await executarSomatorio();
                break;
            case 3:
                await executarFibonacci();
                break;
            case 4:
                await executarMdc();
                break;
            case 5:
                await executarQuicksort();
                break;
            case 6:
                await executarContagem();
                break;
            case 0:
                console.log("\nEncerrando o programa. Até mais!");
                break;
            default:
                console.log("\nOpção inválida. Tente novamente.");
        }

        console.log();

    } while (opcao !== 0);

    rl.close();
}

main();
