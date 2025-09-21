# Planos de Testes de Software

Apresente os casos de testes utilizados na realização da verificação e validação da aplicação. Escolha cenários de testes que demonstrem os requisitos sendo satisfeitos bem como o tratamento de erros (robustez da aplicação).

### Tipo de Teste
- **Sucesso**: Tem o objetivo de verificar se as funcionalidades funcionam corretamente.
- **Insucesso**: Tem o objetivo de verificar se o sistema trata erros de maneira correta.

### ETAPA 2  


<table>
  <tr>
    <th colspan="2" width="1000">CT-001 - S<br>Teste de Login</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se um usuário pode fazer login com sucesso.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">João Victor</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-018</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Abrir o site.<br>
      2. Inserir o Email.<br>
      3. Inserir a senha.<br>
      4. Clicar no botão "Entrar".
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Email:</strong> Colocar Email cadastrado<br>
      - <strong>Senha:</strong> Colocar valor de senha válida
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve redirecionar o usuário para a página inicial do site após o login bem-sucedido.</td>
  </tr>
</table>


<table>
  <tr>
    <th colspan="2" width="1000">CT-002 - S<br>Teste Recuperação de Senha</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se um usuário pode redefinir sua senha.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">João Victor</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Sucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-018</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. selecionar "esqueceu senha".<br>
      2. Inserir o Email cadastrado.<br>
      3. Certificar Recebimento de Email.<br>
      4. Selecionar Mudar senha.<br>
      5. Informar nova senha.
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Email:</strong> Conferir recebimento de email<br>
      - <strong>Senha:</strong> Informar nova senha
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>Uma mensagem de confirmação deve ser exibida e o sistema deve redirecionar o usuário para a página de login.</td>
  </tr>
</table>

__________________________________________________________________________________________________________________________



<table>
  <tr>
    <th colspan="2" width="1000">CT-001 - I01<br>Login com email inexistente ou inválido </th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica o tratamento da tentativa de login com Email inexistente ou inválido.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">João Victor</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-018</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar o site.<br>
      2. Inserir um Email que não foi cadastrado ou inválido.<br>
      3. Inserir senha.<br>
      4. Clicar no botão "Entrar".
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Email:</strong> Colocar Email inexistente<br>
      - <strong>Senha:</strong> Colocar senha.
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve apresentar mensagem de erro.</td>
  </tr>
</table>


<table>
  <tr>
    <th colspan="2" width="1000">CT-001 - I02<br>Login com senha incorreta</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica o tratamento da tentativa de login com senha incorreta.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">João Victor</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-018</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar o site.<br>
      2. Inserir um Email.<br>
      3. Inserir senha incorreta.<br>
      4. Clicar no botão "Entrar".
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Email:</strong> Colocar Email <br>
      - <strong>Senha:</strong> Colocar senha incorreta.
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve apresentar mensagem de erro.</td>
  </tr>
</table>

__________________________________________________________________________________________________________________________

<table>
  <tr>
    <th colspan="2" width="1000">CT-002 - I01<br>Redefinir senha informando um Email não cadastrado.</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica o tratamento de recuperação de senha por meio de um Email não cadastrado.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">João Victor</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-018</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. selecionar "esqueceu senha".<br>
      2. Inserir um Email inválido.<br>
      3. clicar em enviar
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Email:</strong> Colocar Email não cadastrado<br>
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema não deve enviar o e-mail de redefinição.</td>
  </tr>
</table>


<table>
  <tr>
    <th colspan="2" width="1000">CT-002 - I02<br>Redefinição de senha com caracteres inválidos.</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste avalia a redefinição de senha quando os caracteres informados não atendem aos requisitos de segurança.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">João Victor</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-018</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. selecionar "esqueceu senha".<br>
      2. Inserir uma senha que não atende aos requisitos de segurança ou que nao coincidam.<br>
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Senha:</strong> Colocar senha que não cumpra os requisitos<br>
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema instrui o usuário aos critérios de nova senha.</td>
  </tr>
</table>


<table>
  <tr>
    <th colspan="2" width="1000">CT-002 - I03<br>Redefinição de senha com token expirado.</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste avalia se o sistema impede o uso de um token expirado</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste </strong></td>
    <td width="430">João Victor</td>
  </tr>
 <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td width="430">Insucesso</td>
  </tr> 
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-018</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. selecionar "esqueceu senha".<br>
      2. Inserir uma email.<br>
      3. Acessar o link enviado por e-mail contendo o token vencido.
      </td>
  </tr>
    <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Token:</strong> selecionar link após o mesmo estar expirado<br>
  </tr>
    <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve apresentar mensagem de erro.</td>
  </tr>
</table>


 
# Evidências de Testes de Software

Apresente imagens e/ou vídeos que comprovam que um determinado teste foi executado, e o resultado esperado foi obtido. Normalmente são screenshots de telas, ou vídeos do software em funcionamento.

## Parte 1 - Testes de desenvolvimento
Cada funcionalidade desenvolvida deve ser testada pelo próprio desenvolvedor, utilizando casos de teste, tanto de sucesso quanto de insucesso, elaborados por ele. Todos os testes devem ser evidenciados.

### ETAPA 2
<table>
  <tr>
    <th colspan="6" width="1000">CT-001<br>Teste de Login</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve redirecionar o usuário para a página inicial do aplicativo após o login bem-sucedido.</td>
  </tr>
    <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">João Victor </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">20/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">O sistema está permitindo o login corretamente.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"></td>
  </tr>
</table>

<img width="1655" height="498" alt="Captura de tela 2025-09-20 225859" src="https://github.com/user-attachments/assets/0d39aece-d056-44b7-8189-aaa6749a2803" />

<table>
  <tr>
    <th colspan="6" width="1000">CT-002<br>Teste Recuperação de Senha</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">Uma mensagem de confirmação deve ser exibida e o sistema deve redirecionar o usuário para a página de login.</td>
  </tr>
    <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">João Victor </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">20/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Está sendo possível a recuperação de senha.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"></td>
  </tr>
</table>
<img width="1648" height="787" alt="Captura de tela 2025-09-20 232754" src="https://github.com/user-attachments/assets/96e518c5-f93c-4cd7-aa51-c32e3a85d0ef" />


<table>
  <tr>
    <th colspan="6" width="1000">CT-001 - I01<br>Login com email inexistente ou inválido</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve apresentar mensagem de erro.</td>
  </tr>
    <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">João Victor </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">20/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Não é possivel fazer login com email inexistente ou inválido.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"></td>
  </tr>
</table>
<img width="1300" height="661" alt="Captura de tela 2025-09-20 235820" src="https://github.com/user-attachments/assets/c30de53f-1c47-471e-a9db-636f31c7fa5b" />

<table>
  <tr>
    <th colspan="6" width="1000">CT-001 - I02<br>Login com senha incorreta</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve apresentar mensagem de erro.</td>
  </tr>
    <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">João Victor </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">20/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Não é possivel fazer login com senha incorreta.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"></td>
  </tr>
</table>
<img width="1300" height="661" alt="Captura de tela 2025-09-20 235820" src="https://github.com/user-attachments/assets/c30de53f-1c47-471e-a9db-636f31c7fa5b" />

<table>
  <tr>
    <th colspan="6" width="1000">CT-002 - I01<br>Redefinir senha informando um Email não cadastrado</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema não deve enviar o e-mail de redefinição.</td>
  </tr>
    <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">João Victor </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">20/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">O Email não é encaminhado.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"></td>
  </tr>
</table>
<img width="1319" height="521" alt="Captura de tela 2025-09-21 001917" src="https://github.com/user-attachments/assets/0dbd6de9-4f68-44d2-9b10-cc93dfb4ac74" />

<table>
  <tr>
    <th colspan="6" width="1000">CT-002 - I02<br>Redefinição de senha com caracteres inválidos.</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema instrui o usuário aos critérios de nova senha.</td>
  </tr>
    <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">João Victor </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">20/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Todos os critérios devem ser respeitados.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"></td>
  </tr>
</table>

<img width="1468" height="762" alt="Captura de tela 2025-09-21 003646" src="https://github.com/user-attachments/assets/4a09f6e9-21c9-498b-8e97-4e1f5330af86" />


<table>
  <tr>
    <th colspan="6" width="1000">CT-002 - I03<br>Redefinição de senha com token expirados.</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve apresentar mensagem de erro.</td>
  </tr>
    <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">João Victor </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">20/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Será necessário criar um novo token.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"></td>
  </tr>
</table>




## Parte 2 - Testes por pares
A fim de aumentar a qualidade da aplicação desenvolvida, cada funcionalidade deve ser testada por um colega e os testes devem ser evidenciados. O colega "Tester" deve utilizar o caso de teste criado pelo desenvolvedor responsável pela funcionalidade (desenvolveu a funcionalidade e criou o caso de testes descrito no plano de testes) e caso perceba a necessidade de outros casos de teste, deve acrescentá-los na sessão "Plano de Testes".

### ETAPA 2

<table>
  <tr>
    <th colspan="6" width="1000">CT-001<br>Login com credenciais válidas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">O sistema deve redirecionar o usuário para a página inicial do aplicativo após o login bem-sucedido.</td>
  </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade</strong></td>
    <td width="430">João Victor </td>
      <td><strong>Responsável pelo teste</strong></td>
    <td width="430">João Victor</td>
     <td width="100"><strong>Data do teste</strong></td>
    <td width="150">15/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">O sistema está permitindo o login corretamente.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"> ... </td>
  </tr>
</table>
