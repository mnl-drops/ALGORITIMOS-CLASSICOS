# Algoritmos Clássicos

Laboratório interativo para estudar e executar seis algoritmos clássicos. O projeto oferece uma interface web e uma API HTTP com escolha de implementação em JavaScript ou Java.

## Algoritmos

- **Número primo:** verifica se um número inteiro positivo é primo.
- **Somatório:** soma os valores informados.
- **Fibonacci:** gera uma quantidade definida de termos da sequência.
- **MDC de Euclides:** calcula o maior divisor comum entre dois inteiros.
- **Quicksort:** ordena uma lista de inteiros.
- **Contagem por intervalo:** conta os valores que pertencem ao intervalo calculado a partir da entrada.

## API

As operações são requisições `POST` com corpo JSON. A propriedade `linguagem` seleciona `"java"` ou `"javascript"`; quando omitida, usa JavaScript. A rota `GET /api/health` informa se o servidor está disponível.

A atividade também pode ser demonstrada com as rotas `POST /soma`, `/subtracao`, `/multiplicacao` e `/divisao`, que recebem `a` e `b` no JSON.

| Rota | Dados principais |
| --- | --- |
| `/api/primo` | `n` |
| `/api/somatorio` | `valores` |
| `/api/fibonacci` | `n` |
| `/api/mdc` | `a` e `b` |
| `/api/quicksort` | `valores` |
| `/api/contagem` | `valores` |

Os exemplos para Postman estão na pasta `postman/`.
