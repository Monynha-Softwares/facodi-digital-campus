# Arquitetura

## Sumário
- [Visão Geral](#visão-geral)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Fluxo de Dados](#fluxo-de-dados)

## Visão Geral
O frontend é construído em React e comunica-se diretamente com o Supabase através do SDK oficial. Não há backend próprio; todo o armazenamento e autenticação ocorrem no Supabase.

```mermaid
flowchart TD
    A[Navegador] -->|HTTP| B[React + Vite]
    B -->|Supabase JS| C[(Supabase API)]
    C --> D[(Banco de Dados)]
```

## Fluxo de Autenticação
```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant S as Supabase Auth
    U->>F: preenche email e senha
    F->>S: `signIn`/`signUp`
    S-->>F: sessão JWT
    F-->>U: acesso liberado
```

## Fluxo de Dados
```mermaid
sequenceDiagram
    participant F as Frontend
    participant DB as Supabase DB
    F->>DB: consultas CRUD via Supabase JS
    DB-->>F: resultados em JSON
```

Principais endpoints utilizados encontram-se nos hooks descritos em [api-hooks.md](./api-hooks.md).
