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

<details>
<summary><h2>🎓 Programa</h2></summary>

<table>
  <tr>
    <th colspan="2" width="1000">CT-P01 - S<br>Criar Programa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite criar um novo Programa com sucesso.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Lucas Xavier</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-003</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar tela de Programas.<br>
      2. Clicar em "Novo".<br>
      3. Preencher o campo Nome.<br>
      4. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Nome:</strong> Programa Desenvolvimento Tech
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve cadastrar o Programa e exibi-lo corretamente na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-P02 - S<br>Editar Programa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite editar as informações de um Programa existente.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Lucas</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-003</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar um Programa existente.<br>
      2. Alterar o campo Nome.<br>
      3. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve atualizar e exibir o novo nome do Programa corretamente na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-P03 - S<br>Remover Programa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite excluir um Programa existente, exibindo modal de confirmação antes da exclusão.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Lucas</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-003</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar um Programa existente.<br>
      2. Clicar em "Remover".<br>
      3. Confirmar a exclusão no modal exibido.<br>
      4. Verificar a listagem atualizada.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve remover o Programa e atualizar a lista sem o item excluído.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-P04 - I01<br>Criar Programa sem nome</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema impede o cadastro de um Programa sem o preenchimento do campo Nome.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Lucas</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-003</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar tela de Programas.<br>
      2. Clicar em "Novo".<br>
      3. Deixar o campo Nome vazio.<br>
      4. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir uma mensagem de erro informando que o campo Nome é obrigatório.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-P05 - S<br>Listar Programas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema exibe corretamente todos os Programas cadastrados e permite a filtragem por Nome.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Lucas</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-003</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar tela de Programas.<br>
      2. Visualizar listagem de Programas cadastrados.<br>
      3. Aplicar filtro por Nome e pesquisar.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a lista de Programas corretamente, incluindo o resultado filtrado conforme o Nome informado.</td>
  </tr>
</table>

</details>

<details>
  <summary><h2>👥 Turma</h2></summary>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-T01 - S<br>Criar Turma</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Este caso de teste verifica se o sistema permite criar uma nova Turma vinculada a um Programa com sucesso.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Lucas</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Sucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-004</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar a tela de Turmas.<br>
        2. Clicar em "Nova Turma".<br>
        3. Preencher os campos: Curso, Número da Turma, Data de Início, Data de Término e Horário.<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Dados de teste</strong></td>
      <td>
        - Curso: Desenvolvimento Tech<br>
        - Nome da Turma: 2025A<br>
        - Data Início: 10/05/2025<br>
        - Data Fim: 10/08/2025<br>
        - Horário: 14h às 18h
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve cadastrar a Turma e exibi-la corretamente na listagem.</td>
    </tr>
  </table>

  ---

  <table>
    <tr>
      <th colspan="2" width="1000">CT-T02 - I01<br>Criar Turma sem Curso associado</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Este caso de teste verifica se o sistema impede o cadastro de uma Turma sem vincular um Curso obrigatório.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Lucas</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Insucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-004</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar a tela de Turmas.<br>
        2. Clicar em "Nova Turma".<br>
        3. Preencher os campos Nome da Turma, Data de Início, Data de Término e Horário, deixando o campo Curso vazio.<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Dados de teste</strong></td>
      <td>
        - Curso: (vazio)<br>
        - Número da Turma: 2025B<br>
        - Data Início: 15/05/2025<br>
        - Data Fim: 15/08/2025<br>
        - Horário: 09h às 13h
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve exibir uma mensagem de erro informando que o campo Curso é obrigatório.</td>
    </tr>
  </table>

  ---

  <table>
    <tr>
      <th colspan="2" width="1000">CT-T03 - S<br>Editar Turma</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Este caso de teste verifica se o sistema permite editar as informações de uma Turma existente, como datas e horário.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Lucas</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Sucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-004</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Selecionar uma Turma existente.<br>
        2. Alterar os campos: Nome, Data Fim e/ou Horário.<br>
        3. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve atualizar e exibir as informações da Turma corretamente na listagem.</td>
    </tr>
  </table>

  ---

  <table>
    <tr>
      <th colspan="2" width="1000">CT-T04 - S<br>Excluir Turma</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Este caso de teste verifica se o sistema permite excluir uma Turma existente, exibindo modal de confirmação antes da exclusão.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Lucas</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Sucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-004</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Selecionar uma Turma existente.<br>
        2. Clicar em "Remover".<br>
        3. Confirmar a exclusão no modal exibido.<br>
        4. Verificar a listagem atualizada.
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve remover a Turma e atualizar a lista sem o item excluído.</td>
    </tr>
  </table>

  ---

  <table>
    <tr>
      <th colspan="2" width="1000">CT-T05 - S<br>Listar Turmas</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Este caso de teste verifica se o sistema exibe corretamente todas as Turmas cadastradas e permite a filtragem por Curso ou Nome da Turma.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Lucas</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Sucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-004</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar a tela de Turmas.<br>
        2. Visualizar a listagem de Turmas cadastradas.<br>
        3. Aplicar filtro por Curso ou Nome da Turma.<br>
        4. Clicar em "Pesquisar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve exibir a lista de Turmas corretamente, incluindo o resultado filtrado conforme o parâmetro informado.</td>
    </tr>
  </table>

</details>

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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: João Victor </td> </td>
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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: João Victor </td> </td>
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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: João Victor </td> </td>
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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: João Victor </td> </td>
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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: João Victor </td> </td>
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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: João Victor </td> </td>
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

<img width="1560" height="580" alt="Captura de tela 2025-09-21 192326" src="https://github.com/user-attachments/assets/bd2896aa-2e1a-4113-bf76-cc9efd8b02e1" />






## Parte 2 - Testes por pares
A fim de aumentar a qualidade da aplicação desenvolvida, cada funcionalidade deve ser testada por um colega e os testes devem ser evidenciados. O colega "Tester" deve utilizar o caso de teste criado pelo desenvolvedor responsável pela funcionalidade (desenvolveu a funcionalidade e criou o caso de testes descrito no plano de testes) e caso perceba a necessidade de outros casos de teste, deve acrescentá-los na sessão "Plano de Testes".

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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: Lucas Bebiano </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">21/09/2025</td>
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
<img width="1236" height="462" alt="image" src="https://github.com/user-attachments/assets/0793e8f7-e72f-4b3a-9203-cf1c7f71f1fd" />


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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: Lucas Bebiano </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">21/09/2025</td>
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
<img width="1186" height="829" alt="image" src="https://github.com/user-attachments/assets/5c306420-e646-4532-ad8d-d7e334e40398" />



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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: Lucas Bebiano </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">21/09/2025</td>
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
<img width="1005" height="805" alt="image" src="https://github.com/user-attachments/assets/4dbdf91d-c6a3-4969-94ad-2a7156251e87" />


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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: Lucas Bebiano </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">21/09/2025</td>
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
<img width="1154" height="809" alt="image" src="https://github.com/user-attachments/assets/b0070f30-78af-4f71-9f81-907cbd39b70f" />



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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: Lucas Bebiano </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">21/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">O Email não é encaminhado.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="941" height="754" alt="image" src="https://github.com/user-attachments/assets/1cab7ae4-a080-45b7-90e1-46aa106ecf24" />
</td>
  </tr>
</table>


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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: Lucas Bebiano </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">21/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Todos os critérios devem ser respeitados. Valida se as senhas concidem na confirmação. Só permite o botão se tudo estiver correto.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1643" height="582" alt="image" src="https://github.com/user-attachments/assets/80596df8-74ea-4167-a10b-c4121bea636b" />
</td>
  </tr>
</table>


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
    <td width="430">Desenvolvimento: Realizado em grupo <br> Teste: Lucas Bebiano </td>
     <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">21/09/2025</td>
  </tr>
    <tr>
    <td width="170"><strong>Comentário</strong></td>
    <td colspan="5">Apresenta mensagem de erro e não permite a alteração.</td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1525" height="822" alt="image" src="https://github.com/user-attachments/assets/66c95e5f-67b1-4ee0-a6a8-61d63d77e828" />
</td>
  </tr>
</table>
