API REST para Agendamento de Consultas com AdonisJS

📋 Sobre o Projeto

API REST completa desenvolvida com AdonisJS para o gerenciamento de um sistema de agendamento de consultas entre profissionais da saúde e pacientes. A aplicação implementa autenticação JWT, validações, regras de negócio específicas e segue as melhores práticas de desenvolvimento back-end.

Tecnologias Utilizadas

· Framework: AdonisJS 6
· Banco de dados: PostgreSQL ou SQLite
· ORM: Lucid ORM
· Autenticação: JWT
· Validações: Validator do AdonisJS
· Arquitetura: MVC

---

🚀 Instalação e Execução

Pré-requisitos

· Node.js 18+
· npm ou yarn
· PostgreSQL (opcional - pode usar SQLite)
· Git


Passo a Passo

1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd consulta-api-adonis
```

2. Instalar Dependências

```bash
npm install
```

3. Configurar Ambiente

```bash
cp .env.example .env
```

4. Configurar Banco de Dados (Escolha uma opção)

PostgreSQL

```bash
# Criar banco de dados
sudo -u postgres psql -c "CREATE DATABASE consulta_api;"
sudo -u postgres psql -c "CREATE USER consulta_user WITH PASSWORD 'SenhaSegura123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE consulta_api TO consulta_user;"

# Configurar .env
DB_CONNECTION=pg
PG_HOST=localhost
PG_PORT=5432
PG_USER=consulta_user
PG_PASSWORD=SenhaSegura123
PG_DB_NAME=consulta_api
```


5. Gerar Chave da Aplicação

```bash
node ace generate:key
```

6. Executar Migrations

```bash
node ace migration:run
```

7. Iniciar Servidor

```bash
# Modo desenvolvimento
npm run dev

# A API estará disponível em: http://localhost:3333
```

---



Tabelas

1. usuarios
   · id (PK)
   · nome (string)
   · email (string, unique)
   · senha (string)
   · tipo (enum: 'paciente', 'profissional')
   · created_at (timestamp)
   · updated_at (timestamp)
2. profissionais
   · id (PK)
   · usuario_id (FK usuarios)
   · especialidade (string)
   · created_at (timestamp)
   · updated_at (timestamp)
3. pacientes
   · id (PK)
   · usuario_id (FK usuarios)
   · created_at (timestamp)
   · updated_at (timestamp)
4. disponibilidades
   · id (PK)
   · profissional_id (FK profissionais)
   · dia_da_semana (int, 0-6)
   · hora_inicio (time)
   · hora_fim (time)
   · created_at (timestamp)
   · updated_at (timestamp)
5. consultas
   · id (PK)
   · paciente_id (FK pacientes)
   · profissional_id (FK profissionais)
   · data (date)
   · hora (time)
   · status (enum: 'agendada', 'cancelada', 'concluida')
   · created_at (timestamp)
   · updated_at (timestamp)

---


Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. Todas as rotas protegidas exigem um token no header:

```http
Authorization: Bearer <seu_token_jwt>
```

Fluxo de Autenticação:

1. Registrar usuário → /auth/register
2. Fazer login → /auth/login (recebe token)
3. Usar token nas requisições protegidas

---

📡 Rotas da API

Rotas Públicas (Sem Autenticação)

Método Rota Descrição
POST /auth/register Cadastro de usuário
POST /auth/login Login com JWT
GET /profissionais Listar todos profissionais
GET /profissionais/:id Detalhes de um profissional

Rotas Protegidas (Com Autenticação)

Método Rota Permissão Descrição
POST /profissionais Profissional Criar perfil profissional
POST /disponibilidades Profissional Criar disponibilidade
GET /disponibilidades/:profissional_id Todos Listar disponibilidades
POST /consultas Paciente Agendar consulta
GET /consultas Paciente Listar consultas do paciente
PUT /consultas/:id Paciente Atualizar consulta
DELETE /consultas/:id Paciente Cancelar consulta



Exemplos de Payload das Requisições

1. Autenticação

Registrar Usuário (Paciente)

```http
POST /auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "tipo": "paciente"
}
```

Registrar Usuário (Profissional)

```http
POST /auth/register
Content-Type: application/json

{
  "nome": "Dra. Maria Santos",
  "email": "maria@email.com",
  "senha": "123456",
  "tipo": "profissional"
}
```

Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "123456"
}
```

Resposta do Login:

```json
{
  "token": {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-12-31T23:59:59.000Z"
  },
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "paciente"
  }
}
```

2. Profissionais

Listar Profissionais

```http
GET /profissionais
```

Resposta:

```json
[
  {
    "id": 1,
    "especialidade": "Cardiologia",
    "usuario_id": 2,
    "usuario": {
      "id": 2,
      "nome": "Dra. Maria Santos",
      "email": "maria@email.com",
      "tipo": "profissional"
    }
  }
]
```

Criar Perfil Profissional

```http
POST /profissionais
Authorization: Bearer <token_do_profissional>
Content-Type: application/json

{
  "especialidade": "Cardiologia"
}
```

3. Disponibilidades

Criar Disponibilidade

```http
POST /disponibilidades
Authorization: Bearer <token_do_profissional>
Content-Type: application/json

{
  "dia_da_semana": 1,
  "hora_inicio": "08:00",
  "hora_fim": "12:00"
}
```

Explicação:

· dia_da_semana: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado

Listar Disponibilidades

```http
GET /disponibilidades/1
```

Resposta:

```json
[
  {
    "id": 1,
    "profissionalId": 1,
    "diaDaSemana": 1,
    "horaInicio": "08:00",
    "horaFim": "12:00",
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  }
]
```

4. Consultas

Agendar Consulta

```http
POST /consultas
Authorization: Bearer <token_do_paciente>
Content-Type: application/json

{
  "profissional_id": 1,
  "data": "2024-12-25",
  "hora": "09:00"
}
```

Resposta (Sucesso):

```json
{
  "id": 1,
  "pacienteId": 1,
  "profissionalId": 1,
  "data": "2024-12-25",
  "hora": "09:00",
  "status": "agendada",
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-01T10:00:00.000Z"
}
```

Resposta (Erro - Fora da disponibilidade):

```json
{
  "message": "Profissional não está disponível neste horário"
}
```

Resposta (Erro - Conflito de horário):

```json
{
  "message": "Horário já ocupado para este profissional"
}
```

Listar Consultas do Paciente

```http
GET /consultas
Authorization: Bearer <token_do_paciente>
```

Resposta:

```json
[
  {
    "id": 1,
    "pacienteId": 1,
    "profissionalId": 1,
    "data": "2024-12-25",
    "hora": "09:00",
    "status": "agendada",
    "profissional": {
      "id": 1,
      "especialidade": "Cardiologia",
      "usuario": {
        "id": 2,
        "nome": "Dra. Maria Santos",
        "email": "maria@email.com"
      }
    }
  }
]
```

Atualizar Consulta (Marcar como Concluída)

```http
PUT /consultas/1
Authorization: Bearer <token_do_paciente>
Content-Type: application/json

{
  "status": "concluida"
}
```

Cancelar Consulta

```http
DELETE /consultas/1
Authorization: Bearer <token_do_paciente>
```

Resposta:

```json
{
  "message": "Consulta cancelada com sucesso"
}
```

---

⚙️ Regras de Negócio Implementadas

Validações Implementadas:

1. Autenticação JWT: Todas as rotas protegidas exigem token válido
2. Validação de Dados: Campos obrigatórios, formatos e tipos
3. Email único: Não permite cadastro com email duplicado
4. Tipo de usuário: Apenas 'paciente' ou 'profissional'

Regras de Agendamento:

1. Disponibilidade: Não permite agendamento fora dos horários de disponibilidade do profissional
2. Conflitos: Não permite mais de uma consulta no mesmo horário para o mesmo profissional
3. Dia da semana: Considera disponibilidade por dia (0-6)

Permissões e Autorizações:

1. Apenas pacientes podem:
   · Agendar consultas
   · Ver suas próprias consultas
   · Cancelar suas consultas
   · Atualizar status de suas consultas
2. Apenas profissionais podem:
   · Criar perfil profissional
   · Cadastrar suas disponibilidades
3. Consultas canceladas não podem ser atualizadas
4. Apenas consultas agendadas podem ser canceladas

Validações Específicas:

· Data: Formato YYYY-MM-DD
· Hora: Formato HH:MM (24h)
· Dia da semana: 0-6 (0=Domingo)
· Status da consulta: 'agendada', 'cancelada', 'concluida'
· Especialidade: Mínimo 3 caracteres
· Senha: Mínimo 6 caracteres

---

🧪 Testando a API

Usando Insomnia/Postman

1. Importe a Collection:
   · Crie nova collection no Insomnia
   · Base URL: http://localhost:3333
   · Adicione as requisições seguindo os exemplos acima
2. Fluxo de Teste Recomendado:
   ```
   1. Registrar profissional
   2. Login profissional → Guardar token
   3. Criar perfil profissional
   4. Criar disponibilidades
   5. Registrar paciente
   6. Login paciente → Guardar token
   7. Listar profissionais
   8. Agendar consulta
   9. Listar consultas do paciente
   10. Cancelar consulta
   ```

Estrutura do Projeto

```
consulta-api-adonis/
├── .env                      # Variáveis de ambiente
├── .env.example              # Template de variáveis
├── package.json              # Dependências do projeto
├── tsconfig.json             # Configuração TypeScript
├── ace                       # CLI do AdonisJS
│
├── app/
│   ├── controllers/          # Controladores da API
│   │   ├── auth_controller.ts
│   │   ├── profissionais_controller.ts
│   │   ├── disponibilidades_controller.ts
│   │   └── consultas_controller.ts
│   │
│   ├── models/               # Models do banco de dados
│   │   ├── usuario.ts
│   │   ├── profissional.ts
│   │   ├── paciente.ts
│   │   ├── disponibilidade.ts
│   │   ├── consulta.ts
│   │   └── access_token.ts
│   │
│   ├── validators/           # Validações de entrada
│   │   ├── auth.ts
│   │   ├── profissional.ts
│   │   ├── disponibilidade.ts
│   │   └── consulta.ts
│   │
│   └── exceptions/           # Tratamento de erros
│       └── handler.ts
│
├── config/                   # Configurações do framework
│   ├── app.ts
│   ├── auth.ts
│   └── database.ts
│
├── database/
│   ├── migrations/           # Migrations do banco
│   │   ├── XXXX_usuarios.ts
│   │   ├── XXXX_profissionais.ts
│   │   ├── XXXX_pacientes.ts
│   │   ├── XXXX_disponibilidades.ts
│   │   └── XXXX_consultas.ts
│   │
│   └── seeders/              # Dados iniciais
│       └── database_seeder.ts
│
├── start/
│   ├── routes.ts            # Definição de rotas
│   └── kernel.ts            # Configuração inicial
│
└── public/                  # Arquivos estáticos (se houver)
```

---

