API REST para Agendamento de Consultas com AdonisJS
Sobre o Projeto
API REST completa desenvolvida com AdonisJS para gerenciamento de sistema de agendamento de consultas entre profissionais da saúde e pacientes.

Tecnologias Utilizadas
Framework: AdonisJS 6

Banco de dados: PostgreSQL ou SQLite

ORM: Lucid ORM

Autenticação: JWT

Validações: Validator do AdonisJS

Arquitetura: MVC

Instalação e Execução
Pré-requisitos
Node.js 18+

npm ou yarn

PostgreSQL (opcional - pode usar SQLite)

Git

Passo a Passo de Instalação
Clonar o repositório

bash
git clone https://github.com/seu-usuario/consulta-api-adonis.git
cd consulta-api-adonis
Instalar dependências

bash
npm install
Configurar ambiente

bash
cp .env.example .env
Configurar banco de dados

Opção A: PostgreSQL (Recomendado)

bash
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
Opção B: SQLite (Desenvolvimento)
No arquivo .env, configure:

text
DB_CONNECTION=sqlite
DATABASE_URL=./database/database.sqlite
Gerar chave da aplicação

bash
node ace generate:key
Executar migrações do banco

bash
node ace migration:run
Iniciar servidor

bash
# Modo desenvolvimento
npm run dev

# A API estará disponível em: http://localhost:3333

Rotas da API
Rotas Públicas (Sem Autenticação)
Método	Rota	Descrição
POST	/auth/register	Cadastro de usuário
POST	/auth/login	Login com JWT
GET	/profissionais	Listar todos profissionais
GET	/profissionais/:id	Detalhes de um profissional
Rotas Protegidas (Com Autenticação)
Método	Rota	Permissão	Descrição
POST	/profissionais	Profissional	Criar perfil profissional
POST	/disponibilidades	Profissional	Criar disponibilidade
GET	/disponibilidades/:profissional_id	Todos	Listar disponibilidades
POST	/consultas	Paciente	Agendar consulta
GET	/consultas	Paciente	Listar consultas do paciente
PUT	/consultas/:id	Paciente	Atualizar consulta
DELETE	/consultas/:id	Paciente	Cancelar consulta


Exemplos de Requisições
1. Autenticação
Registrar Usuário
http
POST /auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "tipo": "paciente"
}
Login
http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "123456"
}
Resposta do Login:

json
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
2. Profissionais
Listar Profissionais
http
GET /profissionais
Criar Perfil Profissional
http
POST /profissionais
Authorization: Bearer <token_do_profissional>
Content-Type: application/json

{
  "especialidade": "Cardiologia"
}
3. Disponibilidades
Criar Disponibilidade
http
POST /disponibilidades
Authorization: Bearer <token_do_profissional>
Content-Type: application/json

{
  "dia_da_semana": 1,
  "hora_inicio": "08:00",
  "hora_fim": "12:00"
}
Nota: dia_da_semana: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado

4. Consultas
Agendar Consulta
http
POST /consultas
Authorization: Bearer <token_do_paciente>
Content-Type: application/json

{
  "profissional_id": 1,
  "data": "2024-12-25",
  "hora": "09:00"
}
Resposta de sucesso:

json
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
Resposta de erro (fora da disponibilidade):

json
{
  "message": "Profissional não está disponível neste horário"
}
Listar Consultas do Paciente
http
GET /consultas
Authorization: Bearer <token_do_paciente>
Atualizar Consulta
http
PUT /consultas/1
Authorization: Bearer <token_do_paciente>
Content-Type: application/json

{
  "status": "concluida"
}
Cancelar Consulta
http
DELETE /consultas/1
Authorization: Bearer <token_do_paciente>
Resposta:

json
{
  "message": "Consulta cancelada com sucesso"
}

Regras de Negócio Implementadas
Validações
Autenticação JWT em rotas protegidas

Campos obrigatórios e formatos validados

Email único no cadastro

Tipo de usuário: apenas 'paciente' ou 'profissional'

Agendamento
Não permite agendamento fora dos horários de disponibilidade

Não permite conflitos de horário para o mesmo profissional

Considera disponibilidade por dia da semana (0-6)

Permissões
Apenas pacientes podem agendar, ver, atualizar e cancelar suas consultas

Apenas profissionais podem criar perfil e cadastrar disponibilidades

Consultas canceladas não podem ser atualizadas

Apenas consultas agendadas podem ser canceladas

Estrutura do Banco de Dados
Tabelas
usuarios: id, nome, email, senha, tipo, created_at, updated_at

profissionais: id, usuario_id, especialidade, created_at, updated_at

pacientes: id, usuario_id, created_at, updated_at

disponibilidades: id, profissional_id, dia_da_semana, hora_inicio, hora_fim, created_at, updated_at

consultas: id, paciente_id, profissional_id, data, hora, status, created_at, updated_at

Testando a API
Usando Insomnia/Postman
Importe as rotas para o cliente HTTP de sua preferência

Base URL: http://localhost:3333

Siga o fluxo: registrar → login → usar token nas rotas protegidas

Fluxo de Teste Recomendado
Registrar profissional

Login profissional → guardar token

Criar perfil profissional

Criar disponibilidades

Registrar paciente

Login paciente → guardar token

Listar profissionais

Agendar consulta

Listar consultas do paciente

Cancelar consulta

Solução de Problemas
Erros Comuns
"Cannot find module": Execute npm install

"Database connection failed": Verifique credenciais no .env e se o PostgreSQL está rodando

"Unauthorized (401)": Token expirado ou inválido, faça login novamente

"Forbidden (403)": Permissão insuficiente para a ação

"Not Found (404)": Recurso não existe, verifique IDs

"Validation Error (422)": Dados inválidos no request

Comandos Úteis
bash
# Ver logs do servidor
npm run dev

# Resetar banco de dados
node ace migration:rollback --batch=0
node ace migration:run

# Verificar rotas disponíveis
node ace list:routes
