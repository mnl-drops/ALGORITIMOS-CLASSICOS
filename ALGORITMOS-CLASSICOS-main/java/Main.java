import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;

        do {
            exibirMenu();
            opcao = lerInteiro(scanner, "Escolha uma opção: ");

            switch (opcao) {
                case 1:
                    executarNumeroPrimo(scanner);
                    break;
                case 2:
                    executarSomatorio(scanner);
                    break;
                case 3:
                    executarFibonacci(scanner);
                    break;
                case 4:
                    executarMdc(scanner);
                    break;
                case 5:
                    executarQuicksort(scanner);
                    break;
                case 6:
                    executarContagem(scanner);
                    break;
                case 0:
                    System.out.println("\nEncerrando o programa. Até mais!");
                    break;
                default:
                    System.out.println("\nOpção inválida. Tente novamente.");
            }

            System.out.println();

        } while (opcao != 0);

        scanner.close();
    }

    private static void exibirMenu() {
        System.out.println("===== ALGORITMOS =====");
        System.out.println();
        System.out.println("1 - Número Primo");
        System.out.println("2 - Somatório");
        System.out.println("3 - Fibonacci");
        System.out.println("4 - MDC");
        System.out.println("5 - Quicksort");
        System.out.println("6 - Contagem");
        System.out.println("0 - Sair");
        System.out.println();
    }
    private static int lerInteiro(Scanner scanner, String mensagem) {
        int valor;
        while (true) {
            System.out.print(mensagem);
            String entrada = scanner.nextLine().trim();
            try {
                valor = Integer.parseInt(entrada);
                return valor;
            } catch (NumberFormatException e) {
                System.out.println("Entrada inválida. Digite um número inteiro.");
            }
        }
    }

    private static void executarNumeroPrimo(Scanner scanner) {
        System.out.println("\n--- Número Primo ---");
        int n = lerInteiro(scanner, "Digite um número inteiro positivo: ");

        if (n < 1) {
            System.out.println("O número deve ser positivo.");
            return;
        }

        if (ehPrimo(n)) {
            System.out.println(n + " é um número primo.");
        } else {
            System.out.println(n + " não é um número primo.");
        }
    }
    private static boolean ehPrimo(int n) {
        if (n < 2) {
            return false;
        }
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }

    private static void executarSomatorio(Scanner scanner) {
        System.out.println("\n--- Somatório ---");
        int n = lerInteiro(scanner, "Quantos números deseja somar? ");

        if (n <= 0) {
            System.out.println("A quantidade deve ser maior que zero.");
            return;
        }

        int soma = 0;
        for (int i = 1; i <= n; i++) {
            int valor = lerInteiro(scanner, "Digite o número " + i + ": ");
            soma += valor;
        }

        System.out.println("Somatório dos " + n + " números: " + soma);
    }

    private static void executarFibonacci(Scanner scanner) {
        System.out.println("\n--- Fibonacci ---");
        int n = lerInteiro(scanner, "Digite a quantidade de termos (N > 1): ");

        if (n <= 1) {
            System.out.println("N deve ser maior que 1.");
            return;
        }

        long[] termos = new long[n];
        termos[0] = 0;
        termos[1] = 1;

        for (int i = 2; i < n; i++) {
            termos[i] = termos[i - 1] + termos[i - 2];
        }

        System.out.print("Sequência de Fibonacci: ");
        for (int i = 0; i < n; i++) {
            System.out.print(termos[i]);
            if (i < n - 1) {
                System.out.print(", ");
            }
        }
        System.out.println();
    }

    private static void executarMdc(Scanner scanner) {
        System.out.println("\n--- MDC (Algoritmo de Euclides) ---");
        int a = lerInteiro(scanner, "Digite o primeiro número (a): ");
        int b = lerInteiro(scanner, "Digite o segundo número (b): ");

        int resultado = mdc(a, b);
        System.out.println("O MDC entre " + a + " e " + b + " é: " + resultado);
    }
    private static int mdc(int a, int b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b != 0) {
            int resto = a % b;
            a = b;
            b = resto;
        }
        return a;
    }

    private static void executarQuicksort(Scanner scanner) {
        System.out.println("\n--- Quicksort ---");
        int n = lerInteiro(scanner, "Quantos números deseja ordenar? ");

        if (n <= 0) {
            System.out.println("A quantidade deve ser maior que zero.");
            return;
        }

        int[] numeros = new int[n];
        for (int i = 0; i < n; i++) {
            numeros[i] = lerInteiro(scanner, "Digite o número " + (i + 1) + ": ");
        }

        quicksort(numeros, 0, numeros.length - 1);

        System.out.print("Números ordenados: ");
        for (int i = 0; i < numeros.length; i++) {
            System.out.print(numeros[i]);
            if (i < numeros.length - 1) {
                System.out.print(", ");
            }
        }
        System.out.println();
    }

    private static void quicksort(int[] arr, int inicio, int fim) {
        if (inicio < fim) {
            int posicaoPivo = particionar(arr, inicio, fim);
            quicksort(arr, inicio, posicaoPivo - 1);
            quicksort(arr, posicaoPivo + 1, fim);
        }
    }
    private static int particionar(int[] arr, int inicio, int fim) {
        int pivo = arr[fim];
        int i = inicio - 1;

        for (int j = inicio; j < fim; j++) {
            if (arr[j] <= pivo) {
                i++;
                trocar(arr, i, j);
            }
        }

        trocar(arr, i + 1, fim);
        return i + 1;
    }

    private static void trocar(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    private static void executarContagem(Scanner scanner) {
        System.out.println("\n--- Contagem ---");
        System.out.println("Exemplo: se N = 5 e os números digitados forem [2, 4, 1, 5, 3],");
        System.out.println("o primeiro valor é 2 e o limite é N = 5.");
        System.out.println("O programa conta quantos valores do conjunto estão entre 2 e 5 (inclusive).");
        System.out.println();

        int n = lerInteiro(scanner, "Digite o valor de N (quantidade de números): ");

        if (n <= 0) {
            System.out.println("N deve ser maior que zero.");
            return;
        }

        int[] dados = new int[n];
        for (int i = 0; i < n; i++) {
            dados[i] = lerInteiro(scanner, "Digite o número " + (i + 1) + ": ");
        }

        int primeiro = dados[0];
        int limiteInferior = Math.min(primeiro, n);
        int limiteSuperior = Math.max(primeiro, n);
        int contador = 0;
        for (int valor : dados) {
            if (valor >= limiteInferior && valor <= limiteSuperior) {
                contador++;
            }
        }

        System.out.println("Primeiro valor do conjunto: " + primeiro);
        System.out.println("Intervalo considerado: [" + limiteInferior + ", " + limiteSuperior + "]");
        System.out.println("Quantidade de valores dentro do intervalo: " + contador);
    }
}
