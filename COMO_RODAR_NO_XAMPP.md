# Guia de Instalação, Conexão à Base de Dados & Execução no XAMPP (Local)

Este sistema foi concebido para funcionar **100% no seu computador local** dentro do XAMPP (Apache + MySQL + PHP 8.x) localizado em:
`C:\xampp\htdocs\sinprof`

---

## ⚡ RESOLUÇÃO RÁPIDA: "Não estou a conseguir conectar a Base de Dados no XAMPP"

Se o sistema ou a API informar que a base de dados não conectou, siga estes **3 passos simples**:

### Passo 1: Iniciar o MySQL no XAMPP Control Panel
1. Abra o **XAMPP Control Panel** no Windows.
2. Certifique-se de que o **Apache** e o **MySQL** estão com o fundo **VERDE**.
3. Se o botão ao lado de MySQL disser **"Start"**, clique nele para ligar o serviço de base de dados.

### Passo 2: Aceder ao Instalador Automático de 1 Clique
Abra o navegador e aceda directamente a:
```
http://localhost/sinprof/instalar.php
```
ou
```
http://127.0.0.1/sinprof/instalar.php
```

Este instalador:
* Detecta automaticamente a porta activa (`3306` ou `3307`).
* Testa conexões via IPv4 (`127.0.0.1`) e `localhost`.
* Cria a base de dados `sinprof_db` automaticamente com codificação `utf8mb4`.
* Importa todas as 12 tabelas e os dados essenciais com 1 só clique no botão **"Criar Base de Dados & Importar Tabelas"**.
* Configura a conta do **Superadministrador** (`admin@sinprof.ao`).

### Passo 3: Testar o Diagnóstico em Tempo Real
Pode também testar a qualquer momento a conexão em formato JSON:
```
http://localhost/sinprof/testar_conexao.php
```
Deverá retornar `sucesso: true` com a contagem de tabelas e utilizadores.

---

## 👑 Autonomia Total do Superadministrador

O **Superadministrador** possui autonomia total no módulo **Utilizadores e Permissões**:
1. **Criar Utilizador:** Registo com atribuição de qualquer um dos 8 perfis regulamentares (Superadministrador, Presidente, Secretário-geral, Tesoureiro, Delegado provincial, Delegado municipal, Assistente administrativo, Jurídico), com geração e envio automático do **código real de 6 dígitos**.
2. **Editar Utilizador:** Botão de edição (lápis) em cada linha para alterar nome, e-mail, perfil de acesso, cargo oficial, província, município, contacto e estado (Ativo ou Inativo).
3. **Remover Utilizador:** Botão de eliminação (lixo) com modal de confirmação de segurança (protegendo a conta em sessão contra exclusão acidental).
4. **Simular Acesso:** Alternar instantaneamente para a visão de qualquer utilizador para validar o controlo de acesso RBAC.

---

## 🔢 Código de 6 Dígitos Real na Criação de Conta

Ao criar conta ou cadastrar utilizador:
1. O sistema gera um código numérico de 6 dígitos aleatório e seguro (ex.: `849201`).
2. Se configurada a chave da **API do Resend** (`RESEND_API_KEY`), o e-mail oficial é despachado via API REST.
3. Na interface gráfica, surge um alerta/modal de verificação com o **código real em destaque** e o botão **"Preencher Código Automaticamente"** para validação imediata em qualquer ambiente!

---

## 📁 Estrutura de Ficheiros em `C:\xampp\htdocs\sinprof`

```
C:\xampp\htdocs\sinprof\
├── .htaccess                 <-- Configuração Apache (CORS, roteamento)
├── index.php                 <-- Ponto de entrada do sistema
├── instalar.php              <-- Instalador & Reparador automático da BD
├── testar_conexao.php        <-- Diagnóstico JSON da conexão MySQL
├── config.php                <-- Conexão inteligente com detecção de portas
├── api.php                   <-- API RESTful em PHP 8.x (CRUD completo)
├── database.sql              <-- Script SQL com as 12 tabelas do SINPROF
├── dist\                     <-- Código da aplicação compilada e optimizada
│   ├── assets\               <-- JS e CSS minificados (Tailwind + React)
│   └── index.html            <-- Template HTML com metadados do SINPROF
├── public\                   <-- Logótipos e imagens oficiais do SINPROF
└── COMO_RODAR_NO_XAMPP.md    <-- Este guia
```

---

## 🌐 Aceder ao Sistema no Navegador

Após o passo do instalador, aceda à aplicação principal:
```
http://localhost/sinprof
```
ou
```
http://127.0.0.1/sinprof
```

### Contas Pré-configuradas para Teste:
* **Superadministrador:** `admin@sinprof.ao` (Acesso irrestrito a todos os módulos, gestão de contas e logs)
* **Presidente:** `presidente@sinprof.ao` (Radar Nacional, Centro de Inteligência, Indicadores)
* **Secretário-geral:** `secretaria@sinprof.ao` (Associados, Documentos, Convocatórias)
* **Tesoureiro:** `tesouraria@sinprof.ao` (Quotas, Receitas, Despesas, Caixa)
