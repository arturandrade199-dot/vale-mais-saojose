# Vale Mais São José

App de assinatura mensal (R$ 29,99) que dá acesso a descontos em empresas parceiras de São José, Contendas, Camboatá e Barrinha.

- **Backend:** Python (FastAPI) — auth via JWT do Supabase, regras de negócio, integração com Stripe.
- **Frontend:** React (Vite + Tailwind).
- **Banco de dados / Auth:** Supabase (Postgres + Supabase Auth).
- **Pagamento:** Stripe Checkout (assinatura recorrente mensal).

## 1. Configurar o banco de dados (Supabase)

1. Abra o projeto no [supabase.com](https://supabase.com) → **SQL Editor** → **New query**.
2. Cole e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) (cria tabelas, enums e políticas de RLS).
3. Cole e rode o conteúdo de [`supabase/seed_companies.sql`](supabase/seed_companies.sql) (cria as 16 categorias e as 31 empresas parceiras).
4. Em **Authentication → Providers**, confirme que o login por e-mail/senha está habilitado. Se quiser pular a confirmação de e-mail durante os testes, desative "Confirm email" em **Authentication → Settings**.

As empresas marcadas com percentual "10% (placeholder)" no seed são as que não tinham regra de desconto definida no briefing (salões, clínicas, óticas, academias, pet shops, oficinas, lava-rápidos, lojas de roupa, açougue, padaria, manicures e bar). Edite os valores reais depois via SQL Editor ou uma tela de admin futura:

```sql
update public.partner_companies set discount_value = 12 where name = 'Salão de Beleza Estúdio JR';
```

As 6 empresas que estavam como "(ESCOLHER)" no briefing entraram com nome placeholder (Oficina São José, Açougue São José, Padaria São José, Manicure São José Centro, Manicure Camboatá, Manicure Barrinha) — troque o `name` quando os parceiros reais forem definidos.

## 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # Windows (PowerShell: .venv\Scripts\Activate.ps1)
pip install -r requirements.txt
```

O arquivo `backend/.env` já foi criado com as chaves fornecidas. Confira `backend/.env.example` para a referência de todas as variáveis.

O Product/Price de R$ 29,99/mês já foi criado no Stripe (modo teste) pelo script `backend/scripts/create_stripe_price.py` — o `STRIPE_PRICE_ID` já está preenchido no `.env`. Se precisar recriar (ex.: em outra conta Stripe), rode:

```bash
python scripts/create_stripe_price.py
```

Para rodar o servidor:

```bash
uvicorn app.main:app --reload --port 8000
```

Acesse `http://localhost:8000/docs` para ver a documentação interativa (Swagger).

### Webhook do Stripe (necessário para ativar assinatura automaticamente)

Em desenvolvimento, use a [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:8000/api/webhooks/stripe
```

O comando imprime um `whsec_...` — copie para `STRIPE_WEBHOOK_SECRET` no `backend/.env` e reinicie o backend. Em produção, configure o endpoint do webhook no painel do Stripe apontando para `https://SEU_DOMINIO/api/webhooks/stripe` (não use `stripe listen` em produção — ele é só uma ferramenta de dev para simular o webhook no seu `localhost`; em produção o Stripe manda os eventos direto pro endpoint público).

**Sem o Stripe CLI instalado?** Rode o checkout normalmente pelo navegador e depois sincronize manualmente pelo e-mail usado no cadastro:

```bash
python scripts/sync_subscription.py seuemail@exemplo.com
```

Esse script consulta a API do Stripe diretamente (sem depender de webhook) e atualiza o status da assinatura no Supabase — útil para testes locais.

## 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O `frontend/.env` já está configurado com a URL do Supabase, a chave publicável e a URL da API.

### Logo

O arquivo `frontend/src/components/Logo.jsx` usa um placeholder em SVG. Para usar a logo oficial:

1. Salve a imagem enviada como `frontend/src/assets/logo.png`.
2. Troque o conteúdo de `Logo.jsx` por `<img src={logoUrl} className={className} />` importando `logoUrl` de `../assets/logo.png`.

## 4. Fluxo de teste ponta a ponta

1. Rode backend, frontend e `stripe listen` (os três ao mesmo tempo).
2. Acesse `http://localhost:5173` → **Quero assinar** → preencha o cadastro.
3. Você será redirecionado ao Stripe Checkout — use o cartão de teste `4242 4242 4242 4242`, qualquer validade futura e CVC.
4. Após o pagamento, o Stripe dispara o webhook, o backend marca a assinatura como `active`, e você é redirecionado para `/perfil`.
5. Acesse `/painel` para ver a lista de empresas parceiras, com busca e filtro por ramo.

## Segurança — importante

As chaves secretas (`sk_test_...` do Stripe e `sb_secret_...` do Supabase) estão apenas em `backend/.env`, que está no `.gitignore` e nunca é commitado. Como essas chaves foram compartilhadas em texto puro durante o desenvolvimento, é recomendável **regenerá-las** nos painéis do Stripe e do Supabase antes de ir para produção.

## Estrutura do projeto

```
supabase/       Scripts SQL (schema + seed)
backend/        API FastAPI (auth, perfil, empresas, billing, webhooks)
frontend/       App React (Vite + Tailwind)
```
