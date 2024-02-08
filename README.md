# School Grades Management System

## Tabela de Conteúdos

- [Sobre](#about)
- [Iniciando](#getting_started)
- [Usando](#usage)
- [Solucionando Problemas](#troubleshooting)
- [Tecnologias Utilizadas](#tech_stack)

## Sobre <a name = "about"></a>
Este projeto foi um desafio proposto pela empresa [Tunts.Rocks](https://tunts.rocks), para uma vaga de estágio de desenvolvedor de software.<br />
Ele tem como objetivo criar um sistema de gerenciamento de notas escolares, onde é informado uma planilha no Google Sheets, com as informações dos alunos e suas notas, e o sistema retorna a situação de cada aluno, se ele foi aprovado ou reprovado, juntamente com a nota necessária para cada aluno ser aprovado no exame final, caso aplicável.<br />
O sistema foi desenvolvido em Node.js, utilizando a biblioteca [Google Sheets API](https://developers.google.com/sheets/api) para a manipulação da planilha, juntamente com uma integração com o Google Cloud Plataform, para a autenticação do usuário e a utilização da API.

## Iniciando <a name = "getting_started"></a>
Essas instruções fornecerão uma cópia do projeto em execução na sua máquina local para fins de desenvolvimento e testes.

### Pre-requisitos
Primeiramente, é necessário ter o Node.js instalado na sua máquina. Caso não tenha, você pode baixá-lo [aqui](https://nodejs.org/en/download/).

Após, é necessário criar um projeto no Google Cloud Plataform, e habilitar a API do Google Sheets. Para isso, siga os passos abaixo:
- Acesse o [Google Cloud Plataform](https://console.cloud.google.com/).
- Crie sua conta ou faça login, caso já tenha uma.
- Crie um novo projeto.
- Após criar o projeto, vá até a aba <code>APIs e Serviços</code> e clique em <code>Biblioteca</code>.
- Procure por <code>Google Sheets API</code> e habilite-a.
- Após habilitar a API, vá até a aba <code>Credenciais</code> e clique em <code>Criar credenciais</code>.
- Selecione <code>Conta de serviço</code> e clique em <code>Continuar</code>.
- Preencha os campos necessários e clique em <code>Concluir</code>.
- Após criar a conta de serviço, clique em <code>Gerenciar contas de serviço</code> e clique na conta que você acabou de criar.
- Clique em <code>Adicionar chave</code> e selecione <code>Chave de conta de serviço</code> e em <code>Criar nova chave</code>.
- Selecione o tipo de chave <code>JSON</code> e clique em <code>Criar</code>.
- Após criar a chave, um arquivo <code>.json</code> será baixado. Guarde-o, pois ele será necessário para a autenticação do usuário no sistema.</br>
**Obs.:** O arquivo <code>.json</code> contém informações sensíveis, como a chave privada do usuário. Não compartilhe esse arquivo com ninguém.

Você também precisará de uma planilha no Google Sheets, com as informações dos alunos e suas notas. A planilha deverá estar no seguinte formato:
- Linha 1: O título da planilha.
- Linha 2: O total de aulas ministradas.
- Linha 3: O nome das colunas, que devem ser: <code>Matrícula</code>, <code>Nome</code>, <code>Faltas</code>, <code>Nota 1</code>, <code>Nota 2</code>, <code>Nota 3</code>, <code>Situacao</code>, <code>Nota para aprovação</code>.<br />
**Obs.:** Os valores das colunas <code>Situacao</code> e <code>Nota para aprovação</code> são opcionais, e serão preenchidas pelo sistema.
- Linha 4 em diante: As informações dos alunos, com suas respectivas notas e faltas.<br /><br />
**Obs.:** A planilha deve estar compartilhada com o e-mail que está no arquivo <code>.json</code> que você baixou do Google Cloud Plataform ou deixada como pública e com permissão de edição para qualquer pessoa.

Além disso, é necessário que você tenha um aplicativo de requisições HTTP, como o [Postman](https://www.postman.com/downloads/) ou o [Insomnia](https://insomnia.rest/download/), para testar as rotas do sistema.

### Instalando
Essas são as instruções para instalar o projeto na sua máquina local.

1. Clone o repositório ou faça o download do projeto
```bash
git clone https://github.com/LeonardoSPereira/School-Grades-Management
```

2. Instale as dependências
```bash
npm install
```

3. Crie um arquivo <code>.env</code> na raiz do projeto e adicione as variáveis de ambiente conforme o arquivo <code>.env.example</code>.
**Obs.:** O Id da planilha pode ser encontrado na URL da planilha, após o <code>/d/</code> e antes do <code>/edit</code>, como no exemplo abaixo:
```bash
https://docs.google.com/spreadsheets/d/1X2Y3Z4A5B6C7D8E9F0G/edit#gid=0
```
Nesse caso, o Id da planilha é <code>1X2Y3Z4A5B6C7D8E9F0G</code>.

4. Adicione o arquivo <code>.json</code> que você baixou do Google Cloud Plataform na raiz do projeto, com o nome de <code>credentials.json</code>.

5. Execute o projeto
```bash
npm run dev
```
6. Acesse o endereço <code>http://localhost:3000</code> no seu aplicativo de requisições HTTP e teste as rotas do sistema.
**Obs.:** O projeto está configurado para rodar na porta 3000. Caso queira mudar a porta, altere o valor da variável <code>PORT</code> no arquivo <code>.env</code>.

## Usando <a name = "usage"></a>
Agora que o projeto está rodando na sua máquina, você pode testar as rotas do sistema. Abaixo estão as rotas disponíveis no sistema:

- Rota para ler os dados da planilha. **Obs.:** Essa rota é obrigatória para que o sistema funcione corretamente. Isso porque, ao acessar essa rota, o sistema irá ler os dados da planilha e armazená-los em um arquivo <code>.json</code> na raiz do projeto, para que o sistema possa acessar esses dados sem a necessidade de acessar a planilha a cada requisição.
```bash
GET /values
```

- Rota para retornar a situação dos alunos, se eles foram aprovados ou reprovados, juntamente com a nota necessária para cada aluno ser aprovado no exame final, caso aplicável. **Obs.:** Essa rota só irá funcionar corretamente após a leitura dos dados da planilha.
```bash
PUT /values
```

Com isso, os dados dos alunos serão atualizados na planilha, com a situação de cada aluno e a nota necessária para cada aluno ser aprovado no exame final, caso aplicável.

## Solucionando Problemas <a name = "troubleshooting"></a>
Essa seção tem como objetivo ajudar a solucionar problemas comuns que podem ocorrer durante a execução do projeto.

- **Erro ao executar o projeto**
  - Verifique se o Node.js está instalado na sua máquina.
  - Verifique se as dependências do projeto foram instaladas corretamente.
  - Verifique se as variáveis de ambiente foram configuradas corretamente.
  - Verifique se o arquivo <code>credentials.json</code> foi adicionado na raiz do projeto.

- **Erro de autenticação**
  - Verifique se o arquivo <code>credentials.json</code> foi adicionado na raiz do projeto.
  - Verifique se as credenciais do usuário estão corretas.
  - Verifique a configuração do projeto no Google Cloud Plataform.

- **Erro ao acessar a planilha**
  - Verifique se a planilha está compartilhada com o e-mail que está no arquivo <code>credentials.json</code> ou se está pública e com permissão de edição para qualquer pessoa.
  - Verifique se o Id da planilha foi configurado corretamente nas variáveis de ambiente.

- **Erro ao acessar as rotas**
  - Verifique se o projeto está rodando corretamente.
  - Verifique se o endereço da rota está correto.
  - Verifique se o aplicativo de requisições HTTP está configurado corretamente.

- **Erro ao atualizar os dados da planilha**
  - Verifique se a rota para ler os dados da planilha foi acessada corretamente.
  - Verifique se a rota para retornar a situação dos alunos foi acessada corretamente.
  - Verifique se os dados dos alunos foram atualizados corretamente na planilha.

- **Erro de autorização**
  - Verifique se o usuário tem permissão para acessar a planilha.
  - Verifique se o usuário tem permissão para editar a planilha.

- **Erro de formato dos dados ao atualizar a planilha**
  - Verifique se a planilha está no formato correto.
  - Verifique se as colunas da planilha estão no formato correto.
  - Verifique se os dados dos alunos estão no formato correto.
  - Verifique se os dados dos alunos estão sendo enviados corretamente nas requisições.

Caso o problema persista, confira as documentações das [APIs do Google Sheets](https://developers.google.com/sheets/api) e do [Google Cloud Plataform](https://cloud.google.com), ou abra uma issue no repositório do projeto, que eu tentarei te ajudar da melhor forma possível.

## Tecnologias Utilizadas <a name = "tech_stack"></a>

- [Node.js](https://nodejs.org/en/) - JavaScript runtime
- [Express](https://expressjs.com/pt-br/) - Framework web para Node.js
- [Google Sheets API](https://developers.google.com/sheets/api) - API para manipulação de planilhas do Google Sheets
- [Google Cloud Plataform](https://cloud.google.com) - Plataforma de computação em nuvem da Google
- [Nodemon](https://nodemon.io/) - Utilitário que monitora as alterações no código e reinicia automaticamente o servidor.