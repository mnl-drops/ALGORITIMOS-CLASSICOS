import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Implementações Java chamadas pelo servidor Node quando o usuário escolhe Java. */
public class JavaAlgorithms {
    private static long number(String value) { return Long.parseLong(value); }

    private static long[] list(String[] args, int start) {
        long[] values = new long[args.length - start];
        for (int i = start; i < args.length; i++) values[i - start] = number(args[i]);
        return values;
    }

    private static boolean isPrime(long n) {
        if (n < 2) return false;
        for (long divisor = 2; divisor <= n / divisor; divisor++) {
            if (n % divisor == 0) return false;
        }
        return true;
    }

    private static long gcd(long a, long b) {
        a = Math.abs(a); b = Math.abs(b);
        while (b != 0) { long remainder = a % b; a = b; b = remainder; }
        return a;
    }

    private static void quicksort(long[] values, int low, int high) {
        if (low >= high) return;
        long pivot = values[high]; int smaller = low;
        for (int current = low; current < high; current++) {
            if (values[current] <= pivot) {
                long swap = values[smaller]; values[smaller] = values[current]; values[current] = swap;
                smaller++;
            }
        }
        long swap = values[smaller]; values[smaller] = values[high]; values[high] = swap;
        quicksort(values, low, smaller - 1); quicksort(values, smaller + 1, high);
    }

    private static String jsonArray(long[] values) { return Arrays.toString(values); }

    public static void main(String[] args) {
        if (args.length < 2) throw new IllegalArgumentException("Argumentos insuficientes.");
        String operation = args[0];
        switch (operation) {
            case "primo":
                System.out.print("{\"resultado\":" + isPrime(number(args[1])) + "}");
                break;
            case "somatorio": {
                long total = 0;
                for (long value : list(args, 1)) total = Math.addExact(total, value);
                System.out.print("{\"resultado\":" + total + "}");
                break;
            }
            case "fibonacci": {
                int count = (int) number(args[1]);
                List<Long> terms = new ArrayList<>();
                terms.add(0L); terms.add(1L);
                while (terms.size() < count) terms.add(terms.get(terms.size() - 1) + terms.get(terms.size() - 2));
                StringBuilder result = new StringBuilder("[");
                for (int i = 0; i < terms.size(); i++) { if (i > 0) result.append(','); result.append(terms.get(i)); }
                System.out.print("{\"resultado\":" + result.append(']') + "}");
                break;
            }
            case "mdc":
                System.out.print("{\"resultado\":" + gcd(number(args[1]), number(args[2])) + "}");
                break;
            case "quicksort": {
                long[] values = list(args, 1); quicksort(values, 0, values.length - 1);
                System.out.print("{\"resultado\":" + jsonArray(values) + "}");
                break;
            }
            case "contagem": {
                long[] values = list(args, 1); long first = values[0];
                long lower = Math.min(first, values.length), upper = Math.max(first, values.length), count = 0;
                for (long value : values) if (value >= lower && value <= upper) count++;
                System.out.print("{\"primeiro\":" + first + ",\"intervalo\":[" + lower + "," + upper + "],\"resultado\":" + count + "}");
                break;
            }
            default: throw new IllegalArgumentException("Operação desconhecida: " + operation);
        }
    }
}
