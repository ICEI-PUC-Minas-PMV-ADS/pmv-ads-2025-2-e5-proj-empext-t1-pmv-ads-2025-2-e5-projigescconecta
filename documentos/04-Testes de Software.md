# Planos de Testes de Software

Apresente os casos de testes utilizados na realização da verificação e validação da aplicação. Escolha cenários de testes que demonstrem os requisitos sendo satisfeitos bem como o tratamento de erros (robustez da aplicação).

### Tipo de Teste
- **Sucesso**: Tem o objetivo de verificar se as funcionalidades funcionam corretamente.
- **Insucesso**: Tem o objetivo de verificar se o sistema trata erros de maneira correta.

## ETAPA 2  

<details>
<summary><h2>💻 Fluxo de Acesso</h2></summary>
  
<table>
  <tr>
    <th colspan="2" width="1000">CT-001 - S<br>Teste de Login</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se um  pode fazer login com sucesso.</td>
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
</details>



## ETAPA 3  


<details>
<summary><h2>🏛️ OSC</h2></summary>

<table>
  <tr>
    <th colspan="2" width="1000">CT-O01 - S<br>Criar OSC</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite criar uma nova OSC (Organização da Sociedade Civil) com sucesso, preenchendo todos os campos obrigatórios e incluindo a referência à Causa e Público.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-001</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de OSCs.<br>
      2. Clicar em "Nova OSC".<br>
      3. Preencher todos os campos obrigatórios:<br>
      &nbsp;&nbsp;- Nome<br>
      &nbsp;&nbsp;- Telefone<br>
      &nbsp;&nbsp;- Email<br>
      &nbsp;&nbsp;- Website<br>
      &nbsp;&nbsp;- Mídia Social<br>
      &nbsp;&nbsp;- Razão Social<br>
      &nbsp;&nbsp;- Objetivo<br>
      &nbsp;&nbsp;- CEP<br>
      &nbsp;&nbsp;- Endereço<br>
      &nbsp;&nbsp;- Bairro<br>
      &nbsp;&nbsp;- Cidade<br>
      &nbsp;&nbsp;- Estado<br>
      &nbsp;&nbsp;- CNPJ<br>
      4. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Nome:</strong> Instituto Vida Melhor<br>
      - <strong>Telefone:</strong> (11) 98877-6655<br>
      - <strong>Email:</strong> contato@vidamelhor.org.br<br>
      - <strong>Website:</strong> www.vidamelhor.org.br<br>
      - <strong>Mídia Social:</strong> instagram.com/vidamelhor<br>
      - <strong>Razão Social:</strong> Instituto Vida Melhor<br>
      - <strong>Objetivo:</strong> Promover educação e inclusão social<br>
      - <strong>CEP:</strong> 04567-000<br>
      - <strong>Endereço:</strong> Rua das Flores, 120<br>
      - <strong>Bairro:</strong> Jardim Esperança<br>
      - <strong>Cidade:</strong> São Paulo<br>
      - <strong>Estado:</strong> SP<br>
      - <strong>CNPJ:</strong> 12.345.678/0001-90
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve cadastrar a OSC e exibi-la corretamente na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-O02 - S<br>Editar OSC</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite editar as informações de uma OSC existente, modificando qualquer campo obrigatório e salvando com sucesso.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-001</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar uma OSC existente.<br>
      2. Alterar um ou mais campos obrigatórios (ex: Nome, Objetivo ou CNPJ).<br>
      3. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve atualizar as informações e exibi-las corretamente na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-O03 - S<br>Remover OSC</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite excluir uma OSC existente, exibindo modal de confirmação antes da exclusão.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-001</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar uma OSC existente.<br>
      2. Clicar em "Remover".<br>
      3. Confirmar a exclusão no modal exibido.<br>
      4. Verificar a listagem atualizada.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve remover a OSC e atualizar a lista sem o item excluído.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-O04 - I01<br>Criar OSC sem Nome</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema impede o cadastro de uma OSC sem o preenchimento do campo Nome.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-001</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de OSCs.<br>
      2. Clicar em "Nova OSC".<br>
      3. Deixar o campo Nome vazio.<br>
      4. Preencher os demais campos obrigatórios.<br>
      5. Clicar em "Salvar".
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
    <th colspan="2" width="1000">CT-O05 - S<br>Listar OSCs</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema exibe corretamente todas as OSCs cadastradas e permite a filtragem por Nome, Cidade, Estado ou Causa.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-001</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de OSCs.<br>
      2. Visualizar a listagem de OSCs cadastradas.<br>
      3. Aplicar filtros por Nome, Cidade, Estado ou Causa.<br>
      4. Verificar o resultado da pesquisa.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a lista de OSCs corretamente, incluindo os resultados filtrados conforme os critérios informados.</td>
  </tr>
</table>

</details>

<details>
<summary><h2>🧍‍♂️ Público</h2></summary>

<table>
  <tr>
    <th colspan="2" width="1000">CT-PU01 - S<br>Criar Público</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite criar um novo Público com sucesso, preenchendo todos os campos obrigatórios.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-008</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Públicos.<br>
      2. Clicar em "Novo Público".<br>
      3. Preencher os campos obrigatórios:<br>
      &nbsp;&nbsp;- Nome<br>
      &nbsp;&nbsp;- Observações<br>
      4. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Nome:</strong> Jovens em situação de vulnerabilidade<br>
      - <strong>Observações:</strong> Público voltado a adolescentes de 12 a 17 anos em áreas de risco social.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve cadastrar o Público e exibi-lo corretamente na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-PU02 - S<br>Editar Público</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite editar as informações de um Público existente com sucesso.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-008</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar um Público existente.<br>
      2. Alterar o campo Nome ou Observações.<br>
      3. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve atualizar as informações e exibi-las corretamente na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-PU03 - S<br>Remover Público</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite excluir um Público existente, exibindo modal de confirmação antes da exclusão.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-008</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar um Público existente.<br>
      2. Clicar em "Remover".<br>
      3. Confirmar a exclusão no modal exibido.<br>
      4. Verificar a listagem atualizada.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve remover o Público e atualizar a lista sem o item excluído.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-PU04 - I01<br>Criar Público sem Nome</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema impede o cadastro de um Público sem o preenchimento do campo Nome.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-008</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Públicos.<br>
      2. Clicar em "Novo Público".<br>
      3. Deixar o campo Nome vazio.<br>
      4. Preencher apenas o campo Observações.<br>
      5. Clicar em "Salvar".
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
    <th colspan="2" width="1000">CT-PU05 - I02<br>Criar Público sem Observações</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema impede o cadastro de um Público sem o preenchimento do campo Observações.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-008</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Públicos.<br>
      2. Clicar em "Novo Público".<br>
      3. Preencher o campo Nome.<br>
      4. Deixar o campo Observações vazio.<br>
      5. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir uma mensagem de erro informando que o campo Observações é obrigatório.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-PU06 - S<br>Listar Públicos</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema exibe corretamente todos os Públicos cadastrados e permite a filtragem por Nome.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-008</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Públicos.<br>
      2. Visualizar a listagem de Públicos cadastrados.<br>
      3. Aplicar filtro por Nome e pesquisar.<br>
      4. Verificar o resultado exibido.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a lista de Públicos corretamente, incluindo os resultados filtrados conforme o Nome informado.</td>
  </tr>
</table>

</details>


<details>
<summary><h2>💠 Grupo de Causas</h2></summary>

<table>
  <tr>
    <th colspan="2" width="1000">CT-GC01 - S<br>Criar Grupo de Causas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite criar um novo Grupo de Causas preenchendo o campo obrigatório "Nome".</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Grupo de Causas.<br>
      2. Clicar em "Novo Grupo".<br>
      3. Preencher o campo <strong>Nome</strong>.<br>
      4. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td><strong>Nome:</strong> Desenvolvimento Sustentável</td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve cadastrar o Grupo de Causas e exibi-lo na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-GC02 - I01<br>Criar Grupo de Causas sem Nome</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema impede o cadastro de um Grupo de Causas sem preencher o campo obrigatório "Nome".</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Grupo de Causas.<br>
      2. Clicar em "Novo Grupo".<br>
      3. Deixar o campo Nome vazio.<br>
      4. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir mensagem de erro indicando que o campo Nome é obrigatório.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-GC03 - S<br>Editar Grupo de Causas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite editar o Nome de um Grupo de Causas existente com sucesso.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar um Grupo de Causas existente.<br>
      2. Alterar o campo Nome.<br>
      3. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve atualizar o Nome do Grupo de Causas e exibi-lo corretamente na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-GC04 - I01<br>Tentar remover Grupo de Causas com Causas vinculadas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema impede a exclusão de um Grupo de Causas quando existem Causas vinculadas a ele.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar um Grupo de Causas que possua uma ou mais Causas associadas.<br>
      2. Clicar no botão "Remover".<br>
      3. Confirmar a tentativa de exclusão.<br>
      4. Observar o comportamento do sistema.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve impedir a exclusão do Grupo e exibir uma mensagem informando que há Causas vinculadas.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-GC05 - S<br>Remover Grupo de Causas sem Causas vinculadas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite excluir corretamente um Grupo de Causas quando não há Causas associadas a ele.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar um Grupo de Causas que não possua nenhuma Causa vinculada.<br>
      2. Clicar no botão "Remover".<br>
      3. Confirmar a exclusão.<br>
      4. Verificar se o Grupo foi removido da listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve permitir a exclusão do Grupo de Causas e removê-lo corretamente da listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-GC06 - S<br>Listar Grupos de Causas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema exibe corretamente todos os Grupos de Causas cadastrados, permitindo busca por Nome e acesso à tela de Causas.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Grupo de Causas.<br>
      2. Visualizar a listagem de Grupos cadastrados.<br>
      3. Aplicar filtro por Nome.<br>
      4. Clicar no botão "Acessar Causas" para um Grupo.<br>
      5. Verificar redirecionamento para a rota <code>business-case/{id}/origin-business-case</code>.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir os Grupos e permitir o redirecionamento correto para a página de Causas.</td>
  </tr>
</table>

</details>

<details>
<summary><h2>🎯 Causa</h2></summary>

<table>
  <tr>
    <th colspan="2" width="1000">CT-C01 - S<br>Criar Causa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite criar uma nova Causa vinculada automaticamente ao Grupo de Causas acessado.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar um Grupo de Causas existente.<br>
      2. Clicar em "Acessar Causas".<br>
      3. Clicar em "Nova Causa".<br>
      4. Preencher o campo <strong>Nome</strong> e <strong>Observação</strong>.<br>
      5. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Nome:</strong> Inclusão Social e Igualdade <br>
      - <strong>Observação:</strong> objetivo promover oportunidades equitativas e reduzir disparidades sociais, assegurando que indivíduos e grupos em situação de vulnerabilidade tenham acesso igualitário a recursos, direitos e participação ativa na sociedade.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>A Causa deve ser cadastrada e exibida na lista vinculada ao Grupo correspondente.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-C02 - I01<br>Criar Causa sem Nome</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema impede o cadastro de uma Causa sem preenchimento do campo obrigatório "Nome".</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar um Grupo de Causas existente.<br>
      2. Clicar em "Nova Causa".<br>
      3. Deixar o campo Nome vazio.<br>
      4. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir mensagem informando que o campo Nome é obrigatório.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-C03 - S<br>Editar Causa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite editar o Nome de uma Causa existente vinculada a um Grupo.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar um Grupo de Causas existente.<br>
      2. Clicar em "Acessar Causas".<br>
      3. Selecionar uma Causa existente.<br>
      4. Alterar o campo Nome.<br>
      5. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve atualizar o Nome da Causa e exibi-lo corretamente na listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-C04 - S<br>Remover Causa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite remover uma Causa existente vinculada a um Grupo de Causas.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar um Grupo de Causas existente.<br>
      2. Clicar em "Acessar Causas".<br>
      3. Selecionar uma Causa existente.<br>
      4. Clicar em "Remover".<br>
      5. Confirmar exclusão.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve remover a Causa e atualizar a listagem.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-C05 - S<br>Listar Causas por Grupo</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema exibe corretamente todas as Causas pertencentes ao Grupo selecionado, permitindo busca por Nome.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Felipe van Oorschot</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-007</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar um Grupo de Causas existente.<br>
      2. Clicar em "Acessar Causas".<br>
      3. Visualizar a listagem de Causas cadastradas.<br>
      4. Aplicar filtro por Nome.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir todas as Causas associadas ao Grupo corretamente, incluindo o filtro funcional.</td>
  </tr>
</table>
</details>


<details>
<summary><h2>🧍‍♂️🧍‍♂️Pessoas</h2></summary>

<table>
  <tr>
    <th colspan="2" width="1000">CT-P01-S<br>Cadastrar Pessoas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite que a pessoa consiga se cadastrar com sucesso, preenchendo todos os campos obrigatórios.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Kênia Caires</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-002</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Pessoas.<br>
      2. Clicar em "Nova Pessoa".<br>
      3. Preencher todos os campos:<br>
      &nbsp;&nbsp;- Nome<br>
      &nbsp;&nbsp;- CPF<br>
      &nbsp;&nbsp;- Email<br>
      &nbsp;&nbsp;- Segundo email (opcional)<br>
      &nbsp;&nbsp;- Telefone principal<br>
      &nbsp;&nbsp;- Segundo telefone (opcional)<br>
      &nbsp;&nbsp;- Formação (opcional)<br>
      &nbsp;&nbsp;- Formação 2 (opcional)<br>
      &nbsp;&nbsp;- Atuação profissional (opcional)<br>
      4. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Nome:</strong>Ricardo Teixeira<br>
      - <strong>CPF:</strong>03735628702<br>
      - <strong>Email:</strong>rjtsjr@gmail.com<br>
      - <strong>Telefone</strong>21999982464<br>
      - <strong>Formação</strong>ADS<br>
      - <strong>Atuação</strong>Analista e Desenvolvedor de Sistemas<br>
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve cadastrar a pessoa e exibi-la corretamente na listagem.</td>
  </tr>
  
</table>

---

<table>

  <tr>
    <th colspan="2" width="1000">CT-PO02 - S<br>Editar Pessoas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite editar as informações de uma pessoa cadastrada, modificando qualquer campo obrigatório e salvando com sucesso.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Kênia Caires</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-002</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar uma Pessoa cadastrada.<br>
      2. Alterar um ou mais campos obrigatórios (ex: Nome, CPF ou email).<br>
      3. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve atualizar as informações e exibi-las corretamente na listagem.</td>
  </tr>
</table>
 
 ---
 
 <table>
  <tr>
    <th colspan="2" width="1000">CT-PO03 - S <br>Remover Pessoa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite excluir uma pessoa cadastrada, exibindo modal de confirmação antes da exclusão.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Kênia Caires</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-002</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Selecionar uma pessoa cadastrada.<br>
      2. Clicar em "Remover".<br>
      3. Confirmar a exclusão no modal exibido.<br>
      4. Verificar a listagem atualizada.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve remover a pessoa e atualizar a lista sem o item excluído.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-PO04 - S <br>Cadastrar Pessoa sem prencher dados obrigatorios</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema impede o cadastro de uma pessoa sem o preenchimento dos campos obrigatorios.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Kênia Caires</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-002</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Pessoas.<br>
      2. Clicar em "Nova Pessoa".<br>
      3. Deixar algum campo obrigatorio vazio.<br>
      4. Preencher os demais campos obrigatórios.<br>
      5. Clicar em "Salvar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema não permite salvar sem todos os campos obrigatorios preenchidos.</td>
  </tr>
</table>

---

<table>
  <tr>
    <th colspan="2" width="1000">CT-PO05 - S<br>Listar Pessoas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema exibe corretamente todas as pessoas cadastradas e permite a filtragem por Nome.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Kênia Caires</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-002</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de Pessoas.<br>
      2. Visualizar a listagem de Pessoas cadastradas<br>
      3. Aplicar filtros por Nome <br>
      4. Verificar o resultado da pesquisa.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a lista de Pessoas corretamente, incluindo os resultados filtrados conforme o critério informado.</td>
  </tr>
</table>

</details>

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
        3. Preencher os campos: Programa, Número da Turma, Data de Início, Data de Término e Horário.<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Dados de teste</strong></td>
      <td>
        - Programa: Desenvolvimento Tech<br>
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
      <th colspan="2" width="1000">CT-T02 - I01<br>Criar Turma sem Programa associado</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Este caso de teste verifica se o sistema impede o cadastro de uma Turma sem vincular um Programa obrigatório.</td>
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
        3. Preencher os campos Nome da Turma, Data de Início, Data de Término e Horário, deixando o campo Programa vazio.<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Dados de teste</strong></td>
      <td>
        - Programa: (vazio)<br>
        - Número da Turma: 2025B<br>
        - Data Início: 15/05/2025<br>
        - Data Fim: 15/08/2025<br>
        - Horário: 09h às 13h
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve exibir uma mensagem de erro informando que o campo Programa é obrigatório.</td>
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
        3. Aplicar filtro por Programa ou Nome da Turma.<br>
        4. Clicar em "Pesquisar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve exibir a lista de Turmas corretamente, incluindo o resultado filtrado conforme o parâmetro informado.</td>
    </tr>
  </table>

</details>

<details>
<summary><h2>🏢 Empresa</h2></summary>

<table>
  <tr>
    <th colspan="2" width="1000">CT-EMP-01 - S


Criar Empresa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite criar uma nova Empresa com sucesso, preenchendo os campos obrigatórios.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro Roberto</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela "Lista de Empresas".



      2. Clicar no botão "Nova Empresa".



      3. Preencher todos os campos obrigatórios: CNPJ, Razão Social e Nome Fantasia.



      4. Clicar no botão "Criar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>CNPJ:</strong> 98.765.432/0001-10



      - <strong>Razão Social:</strong> Empresa de Teste Sucesso LTDA



      - <strong>Nome Fantasia:</strong> Teste Sucesso
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a mensagem "Empresa criada com sucesso!", fechar o modal e a nova empresa deve aparecer na listagem.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-EMP-02 - S


Editar Empresa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite editar as informações de uma Empresa existente.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro Roberto</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Na listagem de empresas, localizar uma empresa ativa.



      2. Clicar no botão "Editar".



      3. Alterar um ou mais campos (ex: Telefone, E-mail).



      4. Clicar em "Atualizar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a mensagem "Empresa atualizada com sucesso!" e as novas informações devem ser refletidas na listagem.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-EMP-03 - S


Inativar e Reativar Empresa</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite inativar uma empresa ativa e, em seguida, reativá-la, alterando seu status.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro Roberto</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Na lista de empresas "Ativas", clicar no botão "Remover" de uma empresa.



      2. No modal de confirmação, clicar em "Inativar".



      3. Verificar se a empresa sumiu da lista de ativas.



      4. Mudar o filtro para "Inativas" e localizar a empresa recém-inativada.



      5. Clicar no botão "Remover" (que agora deve funcionar como Reativar).



      6. Confirmar a reativação no modal.



      7. Mudar o filtro para "Ativas" e verificar se a empresa retornou à lista.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir mensagens de sucesso para ambas as ações e o status da empresa deve ser alterado corretamente.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-EMP-04 - S


Listar e Filtrar Empresas</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se a listagem de empresas é exibida corretamente e se os filtros por Nome e Status (Ativas/Inativas) funcionam.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro Roberto</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela "Lista de Empresas".



      2. Verificar se a tabela é preenchida com as empresas (por padrão, as ativas).



      3. Digitar um nome de empresa existente no campo "Nome da Empresa" e clicar em "Buscar".



      4. Selecionar o filtro "Inativas".


      5. Verificar se a tabela é preenchida com as empresas Inativas.


      6. Digitar um nome de empresa existente no campo "Nome da Empresa" e clicar em "Buscar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Nome da Empresa:</strong> "Empresa Teste"



      - <strong>Status:</strong> "Ativas" e "Inativas"
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>A tabela deve ser atualizada a cada busca, mostrando apenas os resultados que correspondem aos filtros aplicados.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-EMP-05 - I01


Tentar Criar Empresa com Campos Obrigatórios Vazios</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema impede a criação de uma empresa sem CNPJ, Razão Social ou Nome Fantasia.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-009</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela "Lista de Empresas".



      2. Clicar em "Nova Empresa".



      3. Deixar um dos campos obrigatórios (ex: CNPJ) em branco.



      4. Clicar em "Criar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir uma mensagem de erro informando que os campos são obrigatórios e não deve criar a empresa.</td>
  </tr>
</table>
</details>

<details>
<summary><h2>💝 Doações</h2></summary>

<table>
  <tr>
    <th colspan="2" width="1000">CT-DOA-01 - S


Criar Doação</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Este caso de teste verifica se o sistema permite criar uma nova Doação com sucesso, selecionando um doador e um destino.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro Roberto</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-011</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela de "Lista de Doações".



      2. Clicar no botão "Nova Doação".



      3. Preencher um Valor maior que zero e a Data.



      4. Selecionar um "Tipo de Doador" e escolher uma Pessoa ou Empresa no dropdown.



      5. Selecionar um "Tipo de Destino" e escolher uma OSC, ou um Programa e Turma.



      6. Clicar no botão "Criar".
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>Valor:</strong> 250.00



      - <strong>Doador:</strong> (Selecionar uma pessoa da lista)



      - <strong>Destino:</strong> (Selecionar uma OSC da lista)
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a mensagem "Doação criada com sucesso!", fechar o modal e a nova doação deve aparecer na listagem com os nomes corretos de Doador e Destino.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-DOA-02 - S


Editar Doação</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite editar as informações de uma doação existente (valor, data, destino).</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro Roberto</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-011</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Na listagem, clicar no botão "Editar" de uma doação existente.



      2. No modal, alterar o valor da doação.



      3. Alterar o destino da doação (ex: de OSC para Turma).



      4. Clicar em "Atualizar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a mensagem "Doação atualizada com sucesso!" e as novas informações devem ser refletidas na listagem.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-DOA-03 - S


Excluir Doação</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema permite excluir uma doação existente.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro Roberto</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-011</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Na lista de doações, clicar no botão "Remover" de uma doação.



      2. No modal de confirmação, clicar em "Excluir".



      3. Verificar se a doação desapareceu da lista.
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir a mensagem "Doação excluída com sucesso!" e a doação não deve mais aparecer na listagem.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-DOA-04 - S


Listar e Filtrar Doações por ID</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se a listagem de doações é exibida corretamente e se o filtro por ID funciona.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro Roberto</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Sucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-011</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela "Lista de Doações".



      2. Verificar se a tabela é preenchida com as doações.



      3. Digitar o ID de uma doação existente no campo "Filtrar por ID" e clicar em "Buscar".



      4. Clicar em "Limpar" para ver a lista completa novamente.
    </td>
  </tr>
  <tr>
    <td><strong>Dados de teste</strong></td>
    <td>
      - <strong>ID:</strong> (ID de uma doação existente)
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>A tabela deve ser atualizada a cada busca, mostrando apenas a doação com o ID especificado, e deve retornar à lista completa ao limpar o filtro.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-DOA-05 - I01


Tentar Criar Doação com Valor Zero</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o sistema impede a criação de uma doação com valor igual a zero.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-005</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela "Lista de Doações".



      2. Clicar em "Nova Doação".



      3. Manter o campo "Valor" como 0 ou inserir um valor negativo.



      4. Preencher os outros campos e clicar em "Criar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir uma mensagem de erro informando que "O valor da doação deve ser positivo." e não deve criar a doação.</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="2" width="1000">CT-DOA-06 - I02


Tentar Criar Doação sem Doador</th>
  </tr>
  <tr>
    <td width="150"><strong>Descrição</strong></td>
    <td>Verifica se o backend impede a criação de uma doação quando nenhum doador (Pessoa ou Empresa) é selecionado.</td>
  </tr>
  <tr>
    <td><strong>Responsável Caso de Teste</strong></td>
    <td>Pedro</td>
  </tr>
  <tr>
    <td><strong>Tipo do Teste</strong></td>
    <td>Insucesso</td>
  </tr>
  <tr>
    <td><strong>Requisitos associados</strong></td>
    <td>RF-005</td>
  </tr>
  <tr>
    <td><strong>Passos</strong></td>
    <td>
      1. Acessar a tela "Lista de Doações".



      2. Clicar em "Nova Doação".



      3. Preencher o Valor e a Data.



      4. Deixar a seleção de "Pessoa (Doador)" ou "Empresa (Doador)" vazia.



      5. Clicar em "Criar".
    </td>
  </tr>
  <tr>
    <td><strong>Critérios de êxito</strong></td>
    <td>O sistema deve exibir uma mensagem de erro vinda do backend, como "A doação deve ter exatamente um doador...", e não deve criar a doação.</td>
  </tr>
</table>

</details>


<details>
  <summary><h2>👤 Usuários (RF-010)</h2></summary>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US01 - S<br>Criar Usuário</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica a criação de usuário com Nome, E-mail, Telefone e Tipo (Role).</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Sucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar a tela de Usuários.<br>
        2. Clicar em "Novo Usuário".<br>
        3. Preencher Nome, E-mail, Telefone e Tipo (Administrador / Editor / Leitor).<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Dados de teste</strong></td>
      <td>
        - <strong>Nome:</strong> Ana Paula Sousa<br>
        - <strong>E-mail:</strong> ana.sousa@exemplo.org<br>
        - <strong>Telefone:</strong> (11) 98888-7777<br>
        - <strong>Tipo (Role):</strong> Editor
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve cadastrar o Usuário e exibi-lo corretamente na listagem.</td>
    </tr>
  </table>

  <hr>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US02 - S<br>Editar Usuário</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica a edição de um usuário existente (alterar Nome, Telefone e/ou Tipo).</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Sucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Selecionar um Usuário existente na listagem.<br>
        2. Clicar em "Editar".<br>
        3. Alterar um ou mais campos (por exemplo, Telefone e Tipo).<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve atualizar as informações e exibí-las corretamente na listagem.</td>
    </tr>
  </table>

  <hr>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US03 - S<br>Remover Usuário</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica a exclusão de um usuário existente com confirmação em modal.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Sucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Selecionar um Usuário existente na listagem.<br>
        2. Clicar em "Remover".<br>
        3. Confirmar a exclusão no modal exibido.<br>
        4. Verificar a listagem atualizada.
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve remover o Usuário e atualizar a lista sem o item excluído.</td>
    </tr>
  </table>

  <hr>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US04 - S<br>Listar Usuários</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica a listagem de usuários com filtros por Nome, E-mail e Tipo (Role).</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Sucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar a tela de Usuários.<br>
        2. Visualizar a listagem de usuários cadastrados.<br>
        3. Aplicar filtros por Nome, E-mail e/ou Tipo (Role).<br>
        4. Verificar o resultado exibido.
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve exibir a lista corretamente, incluindo resultados filtrados conforme os critérios informados.</td>
    </tr>
  </table>

  <hr>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US05 - I01<br>Criar Usuário sem Nome</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica se o sistema impede o cadastro sem o campo obrigatório Nome.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Insucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar "Novo Usuário".<br>
        2. Deixar o campo Nome vazio.<br>
        3. Preencher E-mail, Telefone e Tipo (Role).<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve exibir mensagem de erro informando que o campo Nome é obrigatório.</td>
    </tr>
  </table>

  <hr>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US06 - I02<br>Criar Usuário sem E-mail</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica se o sistema impede o cadastro sem o campo obrigatório E-mail.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Insucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar "Novo Usuário".<br>
        2. Deixar o campo E-mail vazio.<br>
        3. Preencher Nome, Telefone e Tipo (Role).<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve exibir mensagem de erro informando que o campo E-mail é obrigatório.</td>
    </tr>
  </table>

  <hr>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US07 - I03<br>Criar Usuário com E-mail inválido</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica a validação de formato de E-mail.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Insucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar "Novo Usuário".<br>
        2. Preencher Nome e Telefone.<br>
        3. Informar E-mail com formato inválido (ex.: "ana.sousa@").<br>
        4. Selecionar Tipo (Role) válido.<br>
        5. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve impedir o cadastro e exibir mensagem sobre E-mail inválido.</td>
    </tr>
  </table>

  <hr>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US08 - I04<br>Criar Usuário sem Telefone</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica se o sistema impede o cadastro sem o campo obrigatório Telefone (se Telefone for obrigatório no seu front; mantenha se aplicável).</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Insucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Acessar "Novo Usuário".<br>
        2. Deixar o campo Telefone vazio.<br>
        3. Preencher Nome, E-mail e Tipo (Role).<br>
        4. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve exibir mensagem de erro informando que o campo Telefone é obrigatório.</td>
    </tr>
  </table>

  <hr>

  <table>
    <tr>
      <th colspan="2" width="1000">CT-US09 - I05<br>Criar Usuário com E-mail já existente</th>
    </tr>
    <tr>
      <td width="150"><strong>Descrição</strong></td>
      <td>Verifica o bloqueio de duplicidade por E-mail.</td>
    </tr>
    <tr>
      <td><strong>Responsável Caso de Teste</strong></td>
      <td>Ricardo Teixeira</td>
    </tr>
    <tr>
      <td><strong>Tipo do Teste</strong></td>
      <td>Insucesso</td>
    </tr>
    <tr>
      <td><strong>Requisitos associados</strong></td>
      <td>RF-010</td>
    </tr>
    <tr>
      <td><strong>Passos</strong></td>
      <td>
        1. Garantir que exista um usuário cadastrado com E-mail "ana.sousa@exemplo.org".<br>
        2. Tentar criar outro usuário com o mesmo E-mail.<br>
        3. Clicar em "Salvar".
      </td>
    </tr>
    <tr>
      <td><strong>Critérios de êxito</strong></td>
      <td>O sistema deve impedir o cadastro e exibir mensagem de que o E-mail já está em uso.</td>
    </tr>
  </table>

</details>





# Evidências de Testes de Software

Apresente imagens e/ou vídeos que comprovam que um determinado teste foi executado, e o resultado esperado foi obtido. Normalmente são screenshots de telas, ou vídeos do software em funcionamento.

## Parte 1 - Testes de desenvolvimento
Cada funcionalidade desenvolvida deve ser testada pelo próprio desenvolvedor, utilizando casos de teste, tanto de sucesso quanto de insucesso, elaborados por ele. Todos os testes devem ser evidenciados.

## ETAPA 2
<details>
<summary><h2>💻 Fluxo de Acesso</h2></summary>
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
</details>

## Etapa 3

<details>
<summary><h2>Testes: 🏛️ OSC</h2></summary>

<table>
  <tr>
    <th colspan="6" width="1000">CT-O01<br>Criar OSC</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir o cadastro de uma nova OSC, exibindo-a corretamente na listagem após a criação.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Felipe van Oorschot</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O cadastro da OSC foi realizado com sucesso. A nova OSC foi listada corretamente e os campos obrigatórios foram validados.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1855" height="476" alt="image" src="https://github.com/user-attachments/assets/d3d1ee29-f083-4502-a754-1bcdc27b1e08" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-O02<br>Editar OSC</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir editar as informações da OSC e refletir as alterações corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Edição concluída com sucesso. As alterações foram salvas e exibidas corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1808" height="495" alt="image" src="https://github.com/user-attachments/assets/628da359-cb8e-4ec4-8668-bf442b9b3830" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-O03<br>Remover OSC</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve excluir a OSC selecionada e atualizar a listagem, removendo-a completamente após confirmação.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Exclusão realizada corretamente. A OSC foi removida da listagem e não aparece após atualização.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1835" height="488" alt="image" src="https://github.com/user-attachments/assets/87fd76b2-7d34-4e22-af4c-f387a7c6c86a" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-O04<br>Criar OSC sem Nome</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve impedir o cadastro de uma OSC sem o preenchimento do campo obrigatório “Nome”, exibindo mensagem de erro adequada.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O sistema impediu corretamente o cadastro sem nome, exibindo mensagem informando que o campo é obrigatório.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1462" height="827" alt="image" src="https://github.com/user-attachments/assets/05dc0813-49d6-4374-b263-7fa37c3ee920" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-O05<br>Listar OSCs</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve exibir corretamente todas as OSCs cadastradas, com suporte a filtros e pesquisa por Nome.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      A listagem e o filtro por Nome funcionaram corretamente, exibindo os resultados esperados.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1458" height="784" alt="image" src="https://github.com/user-attachments/assets/e3e8ce80-85e8-4942-8583-46b1b076bff7" />
</td>
  </tr>
</table>

</details>

<details>
<summary><h2>Testes: 🧍‍♂️ Público</h2></summary>

<table>
  <tr>
    <th colspan="6" width="1000">CT-PUB01<br>Criar Público</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir o cadastro de um novo Público, exigindo os campos obrigatórios “Nome” e “Observações”, e exibi-lo corretamente na listagem após a criação.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Felipe van Oorschot</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O cadastro do Público foi realizado com sucesso. A listagem refletiu corretamente a nova entrada e os campos obrigatórios foram validados.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1844" height="489" alt="image" src="https://github.com/user-attachments/assets/b7c1fc18-27ec-4c24-aeaa-0714a7c732ee" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-PUB02<br>Editar Público</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir a edição das informações de um Público existente e refletir as alterações na listagem após a atualização.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Edição do Público concluída com sucesso. Alterações refletidas corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1852" height="484" alt="image" src="https://github.com/user-attachments/assets/763932a8-d32e-4951-b829-f9936487a004" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-PUB03<br>Remover Público</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve excluir o Público selecionado após confirmação e atualizar a listagem removendo o item.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Exclusão realizada com sucesso. O item foi removido da listagem e não aparece mais após atualização.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1850" height="493" alt="image" src="https://github.com/user-attachments/assets/fe2c208a-bd0b-4927-96d2-3f07ee5df6ea" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-PUB04 - I01<br>Criar Público sem preencher campos obrigatórios</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve impedir o cadastro de um Público caso os campos “Nome” e/ou “Observações” não sejam preenchidos, exibindo mensagem de erro adequada.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O sistema validou corretamente os campos obrigatórios, impedindo o cadastro e apresentando mensagens de erro apropriadas.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1459" height="788" alt="image" src="https://github.com/user-attachments/assets/e102447f-c597-4a0b-bc1f-8df4fb1f1da8" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-PUB05<br>Listar Públicos</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve exibir corretamente a lista de Públicos cadastrados, com suporte à busca e filtragem por Nome.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      A listagem e o filtro de Públicos funcionaram conforme o esperado, exibindo corretamente os registros e resultados da pesquisa.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1450" height="782" alt="image" src="https://github.com/user-attachments/assets/51eb044b-76c2-4f11-a3d8-78cd9900f92a" />
</td>
  </tr>
</table>

</details>

<details>
<summary><h2>Testes: 💠 Grupo de Causas</h2></summary>

<table>
  <tr>
    <th colspan="6" width="1000">CT-GC01<br>Criar Grupo de Causas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir o cadastro de um novo Grupo de Causas, exigindo o preenchimento do campo “Nome”, e exibi-lo corretamente na listagem após a criação.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Felipe van Oorschot</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Cadastro realizado com sucesso. O novo Grupo de Causas foi exibido corretamente na listagem e validou o campo obrigatório “Nome”.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1839" height="486" alt="image" src="https://github.com/user-attachments/assets/84770ea9-8c93-4125-bd3f-e37c874116f8" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-GC02<br>Editar Grupo de Causas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir a edição do nome de um Grupo de Causas existente e refletir a alteração na listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Edição concluída com sucesso. O novo nome foi atualizado corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1832" height="484" alt="image" src="https://github.com/user-attachments/assets/0421dd7d-e084-49b1-b363-c64bb331ea55" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-GC03<br>Tentar remover Grupo de Causas com Causas vinculadas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve impedir a exclusão do Grupo de Causas e exibir uma mensagem informando que há Causas vinculadas.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O sistema bloqueou corretamente a exclusão do Grupo de Causas e apresentou mensagem informando que existem Causas vinculadas, conforme regra de negócio atualizada.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1712" height="307" alt="image" src="https://github.com/user-attachments/assets/514518d8-81a4-4e46-b04b-fa4f4e6d2df7" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-GC04<br>Remover Grupo de Causas sem Causas vinculadas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir a exclusão do Grupo de Causas quando não houver Causas vinculadas, removendo-o corretamente da listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O sistema permitiu corretamente a exclusão do Grupo de Causas sem vínculos, removendo-o da listagem após confirmação do usuário.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1577" height="417" alt="image" src="https://github.com/user-attachments/assets/ee10800d-cbf1-4280-b752-53e288058965" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-GC05<br>Tentar criar Grupo de Causas sem nome</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve impedir o cadastro de um Grupo de Causas sem preenchimento do campo “Nome”, exibindo mensagem de erro adequada.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Validação de campo obrigatório funcionando corretamente. Sistema bloqueou a criação e apresentou mensagem informativa.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1448" height="775" alt="image" src="https://github.com/user-attachments/assets/77f18259-83e7-4d53-bfda-8a1048956ea7" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-GC06<br>Listar Grupos de Causas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve listar corretamente todos os Grupos de Causas cadastrados, exibindo os resultados de forma ordenada e permitindo busca por nome.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Listagem e filtro funcionando conforme esperado. Todos os registros são exibidos corretamente.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1448" height="781" alt="image" src="https://github.com/user-attachments/assets/f0f59c3d-6afe-4af6-acb7-157b271d3c18" />
</td>
  </tr>
</table>

</details>

<details>
<summary><h2>Testes: 🎯 Causa</h2></summary>

<table>
  <tr>
    <th colspan="6" width="1000">CT-C01<br>Criar Causa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir a criação de uma nova Causa vinculada automaticamente ao Grupo de Causas selecionado, exigindo o preenchimento do campo “Nome”.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Felipe van Oorschot</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Cadastro da Causa realizado com sucesso. O vínculo com o Grupo de Causas foi criado automaticamente e o registro apareceu corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1786" height="943" alt="image" src="https://github.com/user-attachments/assets/c314e0af-679f-4066-9034-cae5b59e14ef" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-C02<br>Editar Causa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir a edição do nome de uma Causa existente e refletir a alteração na listagem da página.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Alteração da Causa realizada com sucesso. A listagem foi atualizada corretamente com o novo nome.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1765" height="467" alt="image" src="https://github.com/user-attachments/assets/74f1b1d1-578a-4304-9465-a22910f7e72b" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-C03<br>Remover Causa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir a exclusão de uma Causa e removê-la da listagem, mantendo o Grupo de Causas associado inalterado.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Exclusão de Causa concluída com sucesso. O Grupo de Causas permanece existente e as demais causas não foram afetadas.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1761" height="461" alt="image" src="https://github.com/user-attachments/assets/45a0af31-b02e-4177-a046-541eb83f4bdb" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-C04<br>Tentar criar Causa sem nome</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve impedir o cadastro de uma Causa sem preenchimento do campo “Nome”, exibindo mensagem de erro adequada.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O sistema bloqueou corretamente a criação da Causa e apresentou mensagem informando a obrigatoriedade do campo “Nome”.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1254" height="672" alt="image" src="https://github.com/user-attachments/assets/8bf024d2-2c65-49fe-ba4d-692ef4194186" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-C05<br>Listar Causas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve exibir corretamente todas as Causas cadastradas para o Grupo de Causas selecionado, permitindo filtragem por nome.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Felipe van Oorschot</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      A listagem de Causas foi exibida corretamente, com os filtros e paginação funcionando conforme esperado.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1441" height="771" alt="image" src="https://github.com/user-attachments/assets/a9db52fa-2933-4c30-b648-902dade4658a" />
</td>
  </tr>
</table>

</details>

<details>

<summary><h2>Testes: 🧍‍♂️🧍‍♂️Pessoas</h2></summary>

<table>
  
<tr>
    <th colspan="6" width="1000">CT-O01<br>Cadastrar Pessoa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir o cadastro de uma pessoa, exibindo-a corretamente na listagem após a criação.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Kênia Caires</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">08/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O cadastro da Pessoa foi realizado com sucesso. A pessoa foi listada corretamente e os campos obrigatórios foram validados.
    </td>
     </tr>
     <tr>
     <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1855" height="476" alt="image" src="https://github.com/user-attachments/assets/693da952-fa47-4980-9dc8-088039cac169" />
</td>
  </tr>
  <table>
  <table>
  <tr>
    <th colspan="6" width="1000">CT-O02<br>Editar   Pessoa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve permitir editar as informações da Pessoa cadastrada e refletir as alterações corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Kênia Caires</td>
    <td><strong>Data do Teste</strong></td>
    <td>08/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Edição concluída com sucesso. As alterações foram salvas e exibidas corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1808" height="495" alt="image" src="https://github.com/user-attachments/assets/ccf2eacb-9647-4a49-a118-60c13b921cc6" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-O03<br>Remover Pessoa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve excluir a Pessoa selecionada e atualizar a listagem, removendo-a completamente após confirmação.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Kênia Caires</td>
    <td><strong>Data do Teste</strong></td>
    <td>08/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Exclusão realizada corretamente. A Pessoa foi removida da listagem, não aparece após atualização.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1835" height="488" alt="image" src="https://github.com/user-attachments/assets/f5256123-6d12-49d9-897c-0a0b2adeddb8" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-O04<br>Adicionar Pessoa sem prencher dados obrigatórios</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
     O sistema só permite salvar se todos os campos obrigatórios estiverem preenchidos.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Kênia Caires</td>
    <td><strong>Data do Teste</strong></td>
    <td>08/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O sistema impede corretamente o cadastro se os campos obrigatorios não estiverem todos preenchidos, não é possível salvar.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1462" height="827" alt="image" src="https://github.com/user-attachments/assets/090262ba-e7de-4963-9af6-f5fdb44fa8bb" />
</td>
  </tr>
</table>
<table>
  <tr>
    <th colspan="6" width="1000">CT-O05<br>Listar Pessoas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve exibir corretamente todas as Pessoas cadastradas, com suporte a filtros e pesquisa por Nome.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Kênia Caires</td>
    <td><strong>Data do Teste</strong></td>
    <td>08/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      A listagem e o filtro por Nome funcionaram corretamente, exibindo os resultados esperados.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1458" height="784" alt="image" src="https://github.com/user-attachments/assets/10c18aea-6bac-4644-81dc-3365e7a96343" />
</td>
  </tr>
</table>
</details>


<details>
<summary><h2>Testes: 🎓 Programa</h2></summary>

<table>
  <tr>
    <th colspan="6" width="1000">CT-P01<br>Criar Programa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve cadastrar o Programa e exibi-lo corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Lucas Xavier</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O sistema permite criar o Programa com sucesso, exibindo-o corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"> <img width="1738" height="545" alt="image" src="https://github.com/user-attachments/assets/8b381dcc-c585-466f-a432-0cf9c6916262" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-P02<br>Editar Programa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve atualizar e exibir o novo nome do Programa corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Lucas Xavier</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Edição do Programa realizada com sucesso. Alterações refletidas corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center">
      <img width="1572" height="504" alt="image" src="https://github.com/user-attachments/assets/07ff184c-5327-4f70-884c-dbaac601e02e" /></td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-P03<br>Remover Programa</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve remover o Programa e atualizar a lista sem o item excluído.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Lucas Xavier</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      O sistema exclui o Programa e remove corretamente da listagem após confirmação.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1699" height="519" alt="image" src="https://github.com/user-attachments/assets/b1b7d65c-9745-40ef-96aa-5b3057987fe6" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-P04 - I01<br>Criar Programa sem nome</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve exibir mensagem de erro informando que o campo Nome é obrigatório.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Lucas Xavier</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Sistema impediu corretamente o cadastro e exibiu mensagem de campo obrigatório.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1911" height="713" alt="image" src="https://github.com/user-attachments/assets/99ffb429-1121-4e37-8d99-b1733cac4c4d" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-P05<br>Listar Programas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve exibir a lista de Programas corretamente, incluindo os resultados filtrados por Nome.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Lucas Xavier</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Listagem e filtros funcionando conforme esperado.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1610" height="519" alt="image" src="https://github.com/user-attachments/assets/eaddbd19-f5e3-42e7-a0b5-d28efa8479b2" />
</td>
  </tr>
</table>
</details>

<details>
<summary><h2>Testes: 👥 Turmas</h2></summary>  
  
<table>
  <tr>
    <th colspan="6" width="1000">CT-T01<br>Criar Turma</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve cadastrar a Turma e exibi-la corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td width="430">Lucas Xavier</td>
    <td width="100"><strong>Data do Teste</strong></td>
    <td width="150">15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Criação da Turma realizada com sucesso. A Turma é exibida corretamente na listagem vinculada ao Programa.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1510" height="769" alt="image" src="https://github.com/user-attachments/assets/ae83a9f3-2667-45a2-80dc-95f787a2e361" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-T02 - I01<br>Criar Turma sem Programa associado</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve exibir uma mensagem de erro informando que o campo Programa é obrigatório.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Lucas Xavier</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Sistema impediu corretamente o cadastro e exibiu mensagem de obrigatoriedade do Programa.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1901" height="845" alt="image" src="https://github.com/user-attachments/assets/3a15b3a9-020a-4624-866d-dffcc4967b56" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-T03<br>Editar Turma</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve atualizar e exibir as informações da Turma corretamente na listagem.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Lucas Xavier</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Edição realizada com sucesso. As novas informações da Turma foram atualizadas corretamente.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1427" height="740" alt="image" src="https://github.com/user-attachments/assets/a6a3808f-1c59-4b13-b0c9-a2720a061865" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-T04<br>Excluir Turma</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve remover a Turma e atualizar a lista sem o item excluído.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Lucas Xavier</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      Exclusão confirmada e refletida corretamente na listagem. O item foi removido conforme esperado.
    </td>
  </tr>
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1665" height="475" alt="image" src="https://github.com/user-attachments/assets/0ab89f84-bf43-477c-ac5f-b92ccca76680" />
</td>
  </tr>
</table>

<table>
  <tr>
    <th colspan="6" width="1000">CT-T05<br>Listar Turmas</th>
  </tr>
  <tr>
    <td width="170"><strong>Critérios de êxito</strong></td>
    <td colspan="5">
      O sistema deve exibir a lista de Turmas corretamente, incluindo o resultado filtrado conforme o parâmetro informado.
    </td>
  </tr>
  <tr>
    <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
    <td>Lucas Xavier</td>
    <td><strong>Data do Teste</strong></td>
    <td>15/10/2025</td>
  </tr>
  <tr>
    <td><strong>Comentário</strong></td>
    <td colspan="5">
      A listagem de Turmas e o filtro por Programa e Nome estão funcionando corretamente.
    </td>
  </tr> 
  <tr>
    <td colspan="6" align="center"><strong>Evidência</strong></td>
  </tr>
  <tr>
    <td colspan="6" align="center"><img width="1561" height="731" alt="image" src="https://github.com/user-attachments/assets/f82b497f-c3eb-4886-b22c-62a098d3baae" />
</td>
  </tr>
</table>
</details>


<details> <summary><h2>Testes: 🏢 Empresa</h2></summary>

<table>   <tr>     <th colspan="6" width="1000">CT-EMP-01


Criar Empresa</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Empresa criada com sucesso!", fechar o modal e a nova empresa deve aparecer na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td width="100"><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Cadastro de empresa funcionando corretamente. A nova entrada apareceu na lista após a criação e a mensagem de sucesso foi exibida.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center">
<img width="1913" height="944" alt="image" src="https://github.com/user-attachments/assets/c51e41cc-870a-4e1e-9932-2ff577771e68" />  
<img width="1902" height="929" alt="image" src="https://github.com/user-attachments/assets/849160f0-2ab7-453a-b91c-433547d295df" />

</td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-EMP-02


Editar Empresa</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Empresa atualizada com sucesso!" e as novas informações devem ser refletidas na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Edição concluída com sucesso. As alterações no nome e telefone foram salvas e exibidas corretamente na listagem.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="804" height="414" alt="image" src="https://github.com/user-attachments/assets/1db32b96-60e3-430b-8a05-e0567686d1e0" />

<img width="1902" height="756" alt="image" src="https://github.com/user-attachments/assets/638efd87-b32b-4bf1-9693-6a5908c14ebd" />

 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-EMP-03


Inativar e Reativar Empresa</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir mensagens de sucesso para ambas as ações e o status da empresa deve ser alterado corretamente.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">O fluxo de inativar uma empresa (removendo-a da lista de ativas) e depois reativá-la (fazendo-a retornar) funcionou perfeitamente.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="392" height="199" alt="image" src="https://github.com/user-attachments/assets/3d132ebe-6fec-46b1-8ecb-b323040c8f8e" />

<img width="431" height="116" alt="image" src="https://github.com/user-attachments/assets/1183187c-81c3-4402-bec5-fb8b68b7ecb1" />

<img width="1385" height="850" alt="image" src="https://github.com/user-attachments/assets/df3a747f-be72-417c-88e6-ce7e50751497" />

<img width="398" height="200" alt="image" src="https://github.com/user-attachments/assets/09e5c548-cb6b-4d3c-88d1-8d9d8017153d" />
<img width="1364" height="926" alt="image" src="https://github.com/user-attachments/assets/1a1026bc-0adb-4bea-8637-decafccaaea6" />


 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-EMP-04


Listar e Filtrar Empresas</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">A tabela deve ser atualizada a cada busca, mostrando apenas os resultados que correspondem aos filtros aplicados.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Filtros por nome e por status (Ativas/Inativas) estão funcionando, atualizando a listagem corretamente a cada busca.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="1415" height="543" alt="image" src="https://github.com/user-attachments/assets/23b836f3-4c33-47a3-ba30-7ff2a54d62a1" />
<img width="1371" height="538" alt="image" src="https://github.com/user-attachments/assets/009f97d5-5b37-44c1-a3af-0eafb9054f1b" />

 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-EMP-05


Tentar Criar Empresa com Campos Obrigatórios Vazios</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir uma mensagem de erro informando que os campos são obrigatórios e não deve criar a empresa.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">A validação de campos obrigatórios funcionou. O sistema exibiu a mensagem de erro correta ao tentar salvar sem o CNPJ.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="1418" height="838" alt="image" src="https://github.com/user-attachments/assets/a7bf0947-2f62-4c33-8ea3-0befd720c101" />

</td>   </tr> </table> </details>

<details> <summary><h2>Testes: 💝 Doações</h2></summary>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-01


Criar Doação</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Doação criada com sucesso!", fechar o modal e a nova doação deve aparecer na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td width="100"><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Criação de doação funcionando perfeitamente. Dados carregados nos dropdowns e salvamento ocorrendo como esperado.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center">
<img width="532" height="510" alt="image" src="https://github.com/user-attachments/assets/90b66cd5-2142-4051-8dc0-892dbc9870c4" />
<img width="1403" height="780" alt="image" src="https://github.com/user-attachments/assets/de54766d-5488-4148-8916-8d2fb4196425" />

 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-02


Editar Doação</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Doação atualizada com sucesso!" e as novas informações devem ser refletidas na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Edição de doação funcionando. Alteração de valor e destino foi salva e refletida corretamente na tabela.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="539" height="511" alt="image" src="https://github.com/user-attachments/assets/253f25d3-648e-4131-a1e8-7421ae37f566" />
<img width="1360" height="422" alt="image" src="https://github.com/user-attachments/assets/f96d9d34-6eb3-45b6-a933-399ffda8de54" />

 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-03


Excluir Doação</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Doação excluída com sucesso!" e a doação não deve mais aparecer na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">A exclusão de doações está funcionando. Após a confirmação, o item é removido da tabela.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="389" height="189" alt="image" src="https://github.com/user-attachments/assets/0845ab25-1379-420d-ae07-dcf80deead1a" />
<img width="1390" height="800" alt="image" src="https://github.com/user-attachments/assets/827cb596-5d2f-4b31-8bdf-68baa7ac0fa2" />

 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-04


Listar e Filtrar Doações por ID</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">A tabela deve ser atualizada a cada busca, mostrando apenas a doação com o ID especificado.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">O filtro por ID está funcionando corretamente. Ao buscar por um ID, apenas o registro correspondente é exibido.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="1400" height="563" alt="image" src="https://github.com/user-attachments/assets/aac0c1e2-34b6-424c-a2ea-06eb4a26acf1" />
 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-05


Tentar Criar Doação com Valor Zero</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir uma mensagem de erro informando que "O valor da doação deve ser positivo." e não deve criar a doação.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">A validação do campo "Valor" está funcionando. O sistema exibiu a mensagem de erro correta ao tentar salvar com valor 0.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="953" height="835" alt="image" src="https://github.com/user-attachments/assets/67a98bd3-279a-4625-bb7e-11cb307eb63e" />

 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-06


Tentar Criar Doação sem Doador</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir uma mensagem de erro, como "Error ao salvar doação...", e não deve criar a doação.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Pedro Roberto</td>     <td><strong>Data do Teste</strong></td>     <td width="150">17/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">A validação de doador no backend está funcionando. O sistema exibiu o erro esperado ao tentar salvar sem selecionar um doador.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> 
<img width="791" height="803" alt="image" src="https://github.com/user-attachments/assets/20204582-e86f-4733-a7fe-7be9f995de70" />

</td>   </tr> </table> </details>

<details>
  <summary><h2>Testes: 👤 Usuários</h2></summary>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US01<br>Criar Usuário</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve cadastrar o Usuário e exibi-lo corretamente na listagem.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Criação realizada com sucesso. Registro visível na listagem com Nome, E-mail, Telefone e Role corretos.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1320" height="631" alt="image" src="https://github.com/user-attachments/assets/76fa891f-95bd-4a8d-a932-9e3f32060328" />
        <img width="1331" height="629" alt="image" src="https://github.com/user-attachments/assets/ffb4ae04-55d7-4ca3-9f3f-dba4cc6f23e2" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US02<br>Editar Usuário</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve atualizar e exibir as informações editadas corretamente na listagem.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Edição concluída (ex.: Telefone e Role). Listagem refletiu os novos valores.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1334" height="629" alt="image" src="https://github.com/user-attachments/assets/d359c4a0-03bc-49c7-9590-4c330e50f940" />
        <img width="1338" height="632" alt="image" src="https://github.com/user-attachments/assets/c0c60723-e2f6-41ac-a7bf-2c4c4bd40460" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US03<br>Remover Usuário</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve remover o Usuário e atualizar a lista sem o item excluído.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Exclusão confirmada no modal. Item não aparece mais na listagem.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1331" height="635" alt="image" src="https://github.com/user-attachments/assets/f2c28013-fd8a-4869-a343-25c89f651e35" />
        <img width="1321" height="625" alt="image" src="https://github.com/user-attachments/assets/83cf4473-dc32-4388-bf45-15d52e2c05a6" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US04<br>Listar Usuários</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir a lista corretamente e respeitar filtros por Nome, E-mail e Tipo (Role).</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Listagem e filtros funcionando como esperado.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1339" height="627" alt="image" src="https://github.com/user-attachments/assets/fe967cde-e979-4538-9210-286e88f08284" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US05 - I01<br>Criar Usuário sem Nome</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir mensagem de erro informando que o campo Nome é obrigatório.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Validação impedindo salvar sem Nome.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1336" height="637" alt="image" src="https://github.com/user-attachments/assets/0bc89c2a-cf36-4f36-9c44-b9a64a8ae207" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US06 - I02<br>Criar Usuário sem E-mail</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir mensagem de erro informando que o campo E-mail é obrigatório.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Validação exibida corretamente para E-mail vazio.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1335" height="636" alt="image" src="https://github.com/user-attachments/assets/33446665-951b-4c39-9573-394571a86167" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US07 - I03<br>Criar Usuário com E-mail inválido</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve impedir o cadastro e exibir mensagem sobre E-mail inválido.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Validação de formato de E-mail funcionando.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1335" height="637" alt="image" src="https://github.com/user-attachments/assets/bc853d24-bb74-4a76-93fa-bb95cc886f42" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US08 - I04<br>Criar Usuário sem Telefone</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir mensagem de erro informando que o campo Telefone é obrigatório (se aplicável).</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Sistema bloqueia salvar sem Telefone (conforme regra do front).</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1339" height="632" alt="image" src="https://github.com/user-attachments/assets/ff89db5a-5113-42ff-8209-da1ee99b28e2" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-US09 - I05<br>Criar Usuário com E-mail já existente</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve impedir o cadastro e exibir mensagem de E-mail já utilizado.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>
      <td width="430">Desenvolvimento: Realizado em grupo<br>Teste: Ricardo Teixeira</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Regra de unicidade de E-mail funcionando corretamente.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1331" height="637" alt="image" src="https://github.com/user-attachments/assets/451c2da7-0a67-4f9b-a866-417465ae393d" />
      </td>
    </tr>
  </table>

</details>



## Parte 2 - Testes por pares
A fim de aumentar a qualidade da aplicação desenvolvida, cada funcionalidade deve ser testada por um colega e os testes devem ser evidenciados. O colega "Tester" deve utilizar o caso de teste criado pelo desenvolvedor responsável pela funcionalidade (desenvolveu a funcionalidade e criou o caso de testes descrito no plano de testes) e caso perceba a necessidade de outros casos de teste, deve acrescentá-los na sessão "Plano de Testes".

## ETAPA 2
<details>
<summary><h2>💻 Fluxo de Acesso</h2></summary>
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
</details>

## ETAPA 3

<details>
  <summary><h2>Testes: 🏛️ OSC</h2></summary>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-O01<br>Criar OSC</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">
        O sistema deve permitir o cadastro de uma nova OSC, exibindo-a corretamente na listagem após a criação.
      </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td width="430">Felipe</td>
      <td width="100"><strong>Responsável pelo teste</strong></td>
      <td width="150">Lucas Xavier</td>
      <td width="100"><strong>Data do Teste</strong></td>
      <td width="150">16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">
        O cadastro da OSC foi efetuado com sucesso. A nova OSC apareceu corretamente na listagem e os campos obrigatórios foram verificados conforme esperado.
      </td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1496" height="585" alt="image" src="https://github.com/user-attachments/assets/7b752d25-dce2-4409-bf0a-7f270b22a38a" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-O02<br>Editar OSC</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">
        O sistema deve permitir editar as informações da OSC e refletir as alterações corretamente na listagem.
      </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">
        A edição foi concluída com êxito. As mudanças realizadas foram salvas e apresentadas corretamente na listagem.
      </td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1673" height="541" alt="image" src="https://github.com/user-attachments/assets/8b429c48-7b2a-405f-b9e8-6202e399ee62" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-O03<br>Remover OSC</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">
        O sistema deve excluir a OSC selecionada e atualizar a listagem, removendo-a completamente após confirmação.
      </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">
        A exclusão ocorreu conforme o esperado. A OSC foi removida da listagem e não reapareceu após a atualização.
      </td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1569" height="496" alt="image" src="https://github.com/user-attachments/assets/0c3304b7-deea-4f5b-adc4-ba72e7f892e1" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-O04<br>Criar OSC sem Nome</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">
        O sistema deve impedir o cadastro de uma OSC sem o preenchimento do campo obrigatório “Nome”, exibindo mensagem de erro adequada.
      </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">
        O sistema bloqueou corretamente a criação sem nome e apresentou a mensagem de validação informando que o campo é obrigatório.
      </td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1324" height="904" alt="image" src="https://github.com/user-attachments/assets/f92462ae-5c76-45a3-abaa-9d1ae2252e6f" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-O05<br>Listar OSCs</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">
        O sistema deve exibir corretamente todas as OSCs cadastradas, com suporte a filtros e pesquisa por Nome.
      </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">
        A listagem e o filtro por nome funcionaram corretamente, apresentando os registros de forma consistente.
      </td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1605" height="501" alt="image" src="https://github.com/user-attachments/assets/ad438383-2f72-4541-9454-1f9d262a54c3" />
</td>
    </tr>
  </table>
</details>

<details>
  <summary><h2>Testes: 🧍‍♂️ Público</h2></summary>

  <table>
    <tr>
        <th colspan="6" width="1000">CT-PUB01<br>Criar Público</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve permitir o cadastro de um novo Público, exigindo os campos obrigatórios “Nome” e “Observações”, e exibi-lo corretamente na listagem após a criação.
        </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Cadastro realizado sem problemas. A listagem exibiu a nova entrada corretamente e os campos obrigatórios foram validados como esperado.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1610" height="509" alt="image" src="https://github.com/user-attachments/assets/93284928-8514-4045-acd4-254153804d42" />
</td>
    </tr>
  </table>

  <table>
    <tr>
        <th colspan="6" width="1000">CT-PUB02<br>Editar Público</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve permitir a edição das informações de um Público existente e refletir as alterações na listagem após a atualização.
        </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            A edição do Público foi efetuada com sucesso e as alterações apareceram corretamente na listagem.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1612" height="518" alt="image" src="https://github.com/user-attachments/assets/f9f4546b-c331-45d8-af6e-c0b0af525158" />
</td>
    </tr>
  </table>

  
<table>
    <tr>
        <th colspan="6" width="1000">CT-PUB03<br>Remover Público</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve excluir o Público selecionado após confirmação e atualizar a listagem removendo o item.
        </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Exclusão realizada corretamente. O item sumiu da listagem e não foi mais exibido após atualização.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1596" height="494" alt="image" src="https://github.com/user-attachments/assets/d5405887-51d4-478d-94f1-87d6fb3f679b" /></td>
    </tr>
  </table>

  <table>
    <tr>
        <th colspan="6" width="1000">CT-PUB04 - I01<br>Criar Público sem preencher campos obrigatórios</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve impedir o cadastro de um Público caso os campos “Nome” e/ou “Observações” não sejam preenchidos, exibindo mensagem de erro adequada.
        </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            O sistema validou corretamente os campos obrigatórios, bloqueando o cadastro e exibindo mensagens de erro apropriadas.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1582" height="737" alt="image" src="https://github.com/user-attachments/assets/e6574d10-73d9-4bad-8dd4-309ba8ebaf1c" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-PUB05<br>Listar Públicos</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve exibir corretamente a lista de Públicos cadastrados, com suporte à busca e filtragem por Nome.
        </td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            A listagem de Públicos funcionou bem. Filtros e busca retornaram os resultados esperados.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1662" height="476" alt="image" src="https://github.com/user-attachments/assets/6066447a-4d51-4af2-8477-7c6f4a33ed88" />
</td>
    </tr>
</table>

</details>

<details> <summary><h2>Testes: 💠 Grupo de Causas</h2></summary>
<table>
    <tr>
        <th colspan="6" width="1000">CT-GC01<br>Criar Grupo de Causas</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve permitir o cadastro de um novo Grupo de Causas, exigindo o preenchimento do campo “Nome”, e exibi-lo corretamente na listagem após a criação.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Cadastro concluído corretamente. O Grupo de Causas apareceu na listagem e validou o campo obrigatório “Nome”.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1624" height="435" alt="image" src="https://github.com/user-attachments/assets/5dd2402f-44ae-4cd3-9c76-8236e5563072" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-GC02<br>Editar Grupo de Causas</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve permitir a edição do nome de um Grupo de Causas existente e refletir a alteração na listagem.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Edição realizada com sucesso. O novo nome do Grupo de Causas foi exibido corretamente na listagem.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1559" height="747" alt="image" src="https://github.com/user-attachments/assets/3122e0c9-be99-4e0a-8bf2-29f567945022" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-GC03<br>Tentar remover Grupo de Causas com Causas vinculadas</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve impedir a exclusão do Grupo de Causas e exibir uma mensagem informando que há Causas vinculadas.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            O sistema bloqueou corretamente a exclusão, exibindo mensagem informativa sobre as Causas vinculadas, conforme esperado.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1659" height="433" alt="image" src="https://github.com/user-attachments/assets/5a8e39b7-b6b0-45a6-ac85-2209a2868d0c" />

</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-GC04<br>Remover Grupo de Causas sem Causas vinculadas</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve permitir a exclusão do Grupo de Causas quando não houver Causas vinculadas, removendo-o corretamente da listagem.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Exclusão realizada corretamente. O Grupo de Causas sem vínculos foi removido da listagem após confirmação.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1648" height="454" alt="image" src="https://github.com/user-attachments/assets/62066720-e183-48f2-aaa2-812bc2beda81" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-GC05<br>Tentar criar Grupo de Causas sem nome</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve impedir o cadastro de um Grupo de Causas sem preenchimento do campo “Nome”, exibindo mensagem de erro adequada.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Validação de obrigatoriedade do campo “Nome” funcionando corretamente. Sistema bloqueou a criação e exibiu mensagem apropriada.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1536" height="663" alt="image" src="https://github.com/user-attachments/assets/a88f90c0-29f7-4def-901b-3031cb6b59bf" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-GC06<br>Listar Grupos de Causas</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve listar corretamente todos os Grupos de Causas cadastrados, exibindo os resultados de forma ordenada e permitindo busca por nome.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Listagem e filtros funcionando conforme esperado. Todos os registros aparecem corretamente.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1669" height="414" alt="image" src="https://github.com/user-attachments/assets/58528a17-7c4d-4e30-8f16-890a90be5eb6" />
</td>
    </tr>
</table>

</details>

<details> <summary><h2>Testes: 🎯 Causa</h2></summary>
<table>
    <tr>
        <th colspan="6" width="1000">CT-C01<br>Criar Causa</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve permitir a criação de uma nova Causa vinculada automaticamente ao Grupo de Causas selecionado, exigindo o preenchimento do campo “Nome”.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Causa cadastrada com sucesso. O vínculo com o Grupo de Causas foi estabelecido automaticamente e o registro aparece corretamente na listagem.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1546" height="641" alt="image" src="https://github.com/user-attachments/assets/a061157e-ceba-41e2-88ba-417e4bdc2b66" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-C02<br>Editar Causa</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve permitir a edição do nome de uma Causa existente e refletir a alteração na listagem da página.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Alteração da Causa realizada com êxito. A listagem refletiu o novo nome corretamente.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1743" height="487" alt="image" src="https://github.com/user-attachments/assets/38790b4e-cef6-4031-bc7e-2396e52379ad" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-C03<br>Remover Causa</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve permitir a exclusão de uma Causa e removê-la da listagem, mantendo o Grupo de Causas associado inalterado.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Exclusão de Causa realizada com sucesso. O Grupo de Causas continua intacto e outras causas não foram afetadas.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1703" height="545" alt="image" src="https://github.com/user-attachments/assets/90ee5033-36ab-44aa-a661-86445c19cb2c" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-C04<br>Tentar criar Causa sem nome</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve impedir o cadastro de uma Causa sem preenchimento do campo “Nome”, exibindo mensagem de erro adequada.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            O sistema bloqueou a criação da Causa corretamente e apresentou mensagem sobre a obrigatoriedade do campo “Nome”.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1520" height="682" alt="image" src="https://github.com/user-attachments/assets/90c8817c-038d-43bc-ba92-ba7a8e6744ed" />
</td>
    </tr>
</table>

<table>
    <tr>
        <th colspan="6" width="1000">CT-C05<br>Listar Causas</th>
    </tr>
    <tr>
        <td width="170"><strong>Critérios de êxito</strong></td>
        <td colspan="5">
            O sistema deve exibir corretamente todas as Causas cadastradas para o Grupo de Causas selecionado, permitindo filtragem por nome.
        </td>
    </tr>
    <tr>
        <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
        <td>Felipe van Oorschot</td>
        <td><strong>Responsável pelo teste</strong></td>
        <td>Lucas Xavier</td>
        <td><strong>Data do Teste</strong></td>
        <td>16/10/2025</td>
    </tr>
    <tr>
        <td><strong>Comentário</strong></td>
        <td colspan="5">
            Listagem de Causas exibida corretamente, com filtros funcionando e registros visíveis conforme esperado.
        </td>
    </tr>
    <tr>
        <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
        <td colspan="6" align="center"><img width="1761" height="495" alt="image" src="https://github.com/user-attachments/assets/a81a0c87-2bd6-4242-a829-30327476f12e" />
</td>
    </tr>
</table>

</details>

<details>
  <summary><h2>Testes: 🧍‍♂️🧍‍♂️ Pessoas</h2></summary>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-P01<br>Cadastrar Pessoas</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve cadastrar a pessoa e exibi-la corretamente na listagem.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Kênia Caires</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Ricardo Teixeira</td>
      <td><strong>Data do Teste</strong></td>
      <td>18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Cadastro realizado com sucesso. Pessoa listada corretamente.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
          <img width="1326" height="626" alt="image" src="https://github.com/user-attachments/assets/26230262-c217-4f72-82c1-83d47a9303d0" />
          <img width="1319" height="618" alt="image" src="https://github.com/user-attachments/assets/44d4aef3-ebe0-4256-86f5-c70a2bdb25d2" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-PO02<br>Editar Pessoas</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve atualizar as informações e exibi-las corretamente na listagem.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Kênia Caires</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Ricardo Teixeira</td>
      <td><strong>Data do Teste</strong></td>
      <td>18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Edição concluída com sucesso. Alterações refletidas na listagem.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
         <img width="1316" height="636" alt="image" src="https://github.com/user-attachments/assets/58c7eec5-8896-46e1-9ed7-0bb524250f01" />
         <img width="1335" height="634" alt="image" src="https://github.com/user-attachments/assets/8de77065-dd69-4b41-ad16-a735bcd111c3" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-PO03<br>Remover Pessoa</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve remover a pessoa e atualizar a lista sem o item excluído.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Kênia Caires</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Ricardo Teixeira</td>
      <td><strong>Data do Teste</strong></td>
      <td>18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Exclusão confirmada e refletida corretamente na listagem.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
          <img width="1328" height="634" alt="image" src="https://github.com/user-attachments/assets/cbbbda11-04c6-40d8-bf9a-f993e09959a8" />
          <img width="1329" height="631" alt="image" src="https://github.com/user-attachments/assets/00ba132d-46b0-4865-8529-4eb1bfde2515" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-PO04<br>Cadastrar Pessoa sem preencher dados obrigatórios</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve impedir o cadastro e exibir mensagem de obrigatoriedade.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Kênia Caires</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Ricardo Teixeira</td>
      <td><strong>Data do Teste</strong></td>
      <td>18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Validação OK: sistema não permitiu salvar sem os campos obrigatórios.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
          <img width="1334" height="637" alt="image" src="https://github.com/user-attachments/assets/0b806136-78e8-4e96-b1a1-0eac28d804f9" />
      </td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-PO05<br>Listar Pessoas</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir a lista de Pessoas corretamente, incluindo resultados filtrados conforme o critério informado.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Kênia Caires</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Ricardo Teixeira</td>
      <td><strong>Data do Teste</strong></td>
      <td>18/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Listagem e filtro por Nome funcionando conforme o esperado.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center">
        <img width="1107" height="609" alt="image" src="https://github.com/user-attachments/assets/7c02de14-8d7a-4684-870b-ceedd9ac0669" />
        <img width="1112" height="596" alt="image" src="https://github.com/user-attachments/assets/cbfcbe03-28bb-4268-9dfe-59956841f57d" />
      </td>
    </tr>
  </table>

</details>

      
<details>
  <summary><h2>Testes: 🎓 Programa</h2></summary>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-P01<br>Criar Programa</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve cadastrar o Programa e exibi-lo corretamente na listagem.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Cadastro realizado com sucesso, Programa exibido corretamente na listagem.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1767" height="475" alt="image" src="https://github.com/user-attachments/assets/8395ab77-8bc8-46bb-be72-3fc5278880bf" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-P02<br>Editar Programa</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve atualizar e exibir o novo nome do Programa corretamente na listagem.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Edição realizada com sucesso. Alterações refletidas corretamente na listagem.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1770" height="482" alt="image" src="https://github.com/user-attachments/assets/416412b7-c0d7-4ee8-8ddf-9d5ca637c341" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-P03<br>Remover Programa</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve remover o Programa e atualizar a lista sem o item excluído.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Exclusão realizada com sucesso. Programa removido da listagem corretamente.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1770" height="471" alt="image" src="https://github.com/user-attachments/assets/ed6eb280-0bf5-4173-b6ff-0ab96e6facc0" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-P04<br>Criar Programa sem nome</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir mensagem de erro informando que o campo Nome é obrigatório.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Sistema bloqueou corretamente a criação sem nome, exibindo mensagem de validação.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1309" height="703" alt="image" src="https://github.com/user-attachments/assets/02a038b1-6372-4a21-8945-4c4aa9d4aa4a" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-P05<br>Listar Programas</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir a lista de Programas corretamente, incluindo resultados filtrados por Nome.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Listagem e filtros funcionando corretamente, exibindo os registros de forma consistente.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1308" height="701" alt="image" src="https://github.com/user-attachments/assets/9d36e483-72d6-4bce-bb0a-0a7ea2815743" />
</td>
    </tr>
  </table>

</details>

<details>
  <summary><h2>Testes: 👥 Turma</h2></summary>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-T01<br>Criar Turma</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve cadastrar a Turma e exibi-la corretamente na listagem.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Cadastro realizado com sucesso. Turma exibida corretamente na listagem.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1765" height="472" alt="image" src="https://github.com/user-attachments/assets/f5c89a9f-4cb7-4054-9bb3-b3f50c82d93a" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-T02<br>Criar Turma sem Programa associado</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir mensagem de erro informando que o campo Programa é obrigatório.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Sistema bloqueou corretamente a criação sem Programa associado, exibindo mensagem de validação.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1302" height="699" alt="image" src="https://github.com/user-attachments/assets/dd6a832b-e8ec-464d-855a-2cc5d3d1cfd0" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-T03<br>Editar Turma</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve atualizar e exibir as informações da Turma corretamente na listagem.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Edição realizada com sucesso. Alterações refletidas corretamente na listagem.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1755" height="469" alt="image" src="https://github.com/user-attachments/assets/937c5237-16fe-4bcb-b953-c692b3916077" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-T04<br>Excluir Turma</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve remover a Turma e atualizar a lista sem o item excluído.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Exclusão realizada com sucesso. Turma removida da listagem corretamente.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1308" height="701" alt="image" src="https://github.com/user-attachments/assets/2d71412e-5e1b-415f-902d-5d0f34cfe9e6" />
</td>
    </tr>
  </table>

  <table>
    <tr>
      <th colspan="6" width="1000">CT-T05<br>Listar Turmas</th>
    </tr>
    <tr>
      <td width="170"><strong>Critérios de êxito</strong></td>
      <td colspan="5">O sistema deve exibir a lista de Turmas corretamente, incluindo resultados filtrados conforme o parâmetro informado.</td>
    </tr>
    <tr>
      <td><strong>Responsável pela funcionalidade (desenvolvimento)</strong></td>
      <td>Lucas Xavier</td>
      <td><strong>Responsável pelo teste</strong></td>
      <td>Felipe van Oorschot</td>
      <td><strong>Data do Teste</strong></td>
      <td>16/10/2025</td>
    </tr>
    <tr>
      <td><strong>Comentário</strong></td>
      <td colspan="5">Listagem e filtros funcionando corretamente, exibindo os registros de forma consistente.</td>
    </tr>
    <tr>
      <td colspan="6" align="center"><strong>Evidência</strong></td>
    </tr>
    <tr>
      <td colspan="6" align="center"><img width="1306" height="700" alt="image" src="https://github.com/user-attachments/assets/56a03b8d-14a3-4ec4-b77b-2f0a15c34cd3" />
</td>
    </tr>
  </table>
</details>

<details> <summary><h2>Testes: 🏢 Empresa</h2></summary>
    
<table>   <tr>     <th colspan="6" width="1000">CT-EMP-01
  
Criar Empresa</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Empresa criada com sucesso!", fechar o modal e a nova empresa deve aparecer na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td width="100"><strong>Data do Teste</strong></td>     <td width="150">08/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Cadastro de empresa funcionando corretamente. A nova entrada apareceu na lista após a criação e a mensagem de sucesso foi exibida.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td> 
</tr>   <tr>     <td colspan="6" align="center"> <img width="1306" height="700" alt="image" src="https://github.com/user-attachments/assets/1712b272-9ff1-4544-947b-af37ba3cdbda" /> 

</td>   </tr> </table>
<table>   <tr>     <th colspan="6" width="1000">CT-EMP-02


Editar Empresa</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Empresa atualizada com sucesso!" e as novas informações devem ser refletidas na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">08/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Edição concluída com sucesso. As alterações no nome e telefone foram salvas e exibidas corretamente na listagem.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1306" height="700" alt="image" src="https://github.com/user-attachments/assets/3de56bff-537e-498e-a024-33eb113dbef2" />

<table>   <tr>     <th colspan="6" width="1000">CT-EMP-03

Inativar e Reativar Empresa</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir mensagens de sucesso para ambas as ações e o status da empresa deve ser alterado corretamente.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">08/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">O fluxo de inativar uma empresa (removendo-a da lista de ativas) e depois reativá-la (fazendo-a retornar) funcionou perfeitamente.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1377" height="852" alt="image" src="https://github.com/user-attachments/assets/a213adde-4c76-43e3-a4f5-d90247763fa8" />

 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-EMP-04


Listar e Filtrar Empresas</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">A tabela deve ser atualizada a cada busca, mostrando apenas os resultados que correspondem aos filtros aplicados.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">08/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Filtros por nome e por status (Ativas/Inativas) estão funcionando, atualizando a listagem corretamente a cada busca.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1471" height="882" alt="image" src="https://github.com/user-attachments/assets/3c26ca72-efd5-4cbe-96a0-68eb44b5cefc" />

</td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-EMP-05


Tentar Criar Empresa com Campos Obrigatórios Vazios</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir uma mensagem de erro informando que os campos são obrigatórios e não deve criar a empresa.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">08/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">A validação de campos obrigatórios funcionou. O sistema exibiu a mensagem de erro correta ao tentar salvar sem o CNPJ.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>  <td colspan="6" align="center"> <img width="940" height="682" alt="image" src="https://github.com/user-attachments/assets/26dbf4fb-2e0c-4f42-a69b-9ac2f9a9e590" />

 </td>   </tr> </table> </details>

 </td>
    </tr>
  </table>
</details>

<details> <summary><h2>Testes: 💝 Doações</h2></summary>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-01


Criar Doação</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Doação criada com sucesso!", fechar o modal e a nova doação deve aparecer na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td width="100"><strong>Data do Teste</strong></td>     <td width="150">18/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Criação de doação funcionando perfeitamente. Dados carregados nos dropdowns e salvamento ocorrendo como esperado.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1460" height="826" alt="image" src="https://github.com/user-attachments/assets/bf1b9264-57f2-42ba-879b-abaaf96d8c6b" />
</td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-02


Editar Doação</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Doação atualizada com sucesso!" e as novas informações devem ser refletidas na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">18/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">Edição de doação funcionando. Alteração de valor e destino foi salva e refletida corretamente na tabela.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1306" height="700" alt="image" src="https://github.com/user-attachments/assets/bd260826-8ed9-4f59-bbc9-4cbf91f5d6e8" />
</td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-03


Excluir Doação</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir a mensagem "Doação excluída com sucesso!" e a doação não deve mais aparecer na listagem.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">08/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">A exclusão de doações está funcionando. Após a confirmação, o item é removido da tabela.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1352" height="860" alt="image" src="https://github.com/user-attachments/assets/7f170390-3bba-4f05-b70f-7ef479af2e6a" />

</td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-04


Listar e Filtrar Doações por ID</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">A tabela deve ser atualizada a cada busca, mostrando apenas a doação com o ID especificado.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">18/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">O filtro por ID está funcionando corretamente. Ao buscar por um ID, apenas o registro correspondente é exibido.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1421" height="583" alt="image" src="https://github.com/user-attachments/assets/e68c0f10-79da-48cc-84ba-a698cc3c2994" />
 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-05


Tentar Criar Doação com Valor Zero</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir uma mensagem de erro informando que "O valor da doação deve ser positivo." e não deve criar a doação.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">08/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">A validação do campo "Valor" está funcionando. O sistema exibiu a mensagem de erro correta ao tentar salvar com valor 0.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1118" height="677" alt="image" src="https://github.com/user-attachments/assets/a6c17559-2e0f-4d11-84de-dc62e5061219" />

 </td>   </tr> </table>

<table>   <tr>     <th colspan="6" width="1000">CT-DOA-06


Tentar Criar Doação sem Doador</th>   </tr>   <tr>     <td width="170"><strong>Critérios de êxito</strong></td>     <td colspan="5">O sistema deve exibir uma mensagem de erro, como "Error ao salvar doação...", e não deve criar a doação.</td>   </tr>   <tr>     <td><strong>Responsável pela funcionalidade (desenvolvimento e teste)</strong></td>     <td width="430">Desenvolvimento: Pedro Roberto


Teste: Kênia Caires</td>     <td><strong>Data do Teste</strong></td>     <td width="150">18/10/2025</td>   </tr>   <tr>     <td><strong>Comentário</strong></td>     <td colspan="5">A validação de doador no backend está funcionando. O sistema exibiu o erro esperado ao tentar salvar sem selecionar um doador.</td>   </tr>   <tr>     <td colspan="6" align="center"><strong>Evidência</strong></td>   </tr>   <tr>     <td colspan="6" align="center"> <img width="1215" height="671" alt="image" src="https://github.com/user-attachments/assets/7f01ecaa-d77e-4006-8b4d-4038d9a8aa79" />




</details>

