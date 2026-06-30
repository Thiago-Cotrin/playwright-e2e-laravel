# Achados e correções na aplicação sob teste

A aplicação original foi mantida como referência e fixada por commit. Durante
o planejamento E2E foram identificados defeitos que impediam a jornada CRUD
pedida na atividade. A imagem Docker aplica os arquivos de `docker/app/overrides`
sobre o código original durante o build.

| Achado | Impacto | Correção aplicada |
|---|---|---|
| Não havia botões de exclusão nas listagens | Usuário não conseguia excluir registros | Ações de exclusão com confirmação adicionadas |
| `PessoaController::destroy()` estava vazio | Pessoa continuava no banco | Exclusão implementada com retorno e mensagem |
| `AutorController` não tinha `destroy()` | Rota de exclusão terminava em erro | Método de exclusão implementado |
| Formulário de autor usava `method="PUT"` | Navegador enviava a requisição incorretamente | Formulário alterado para POST com `_method=PUT` |
| Criação de biblioteca ignorava telefone e email | Dados digitados eram perdidos | Persistência e validação de todos os campos |
| Atualização de biblioteca ignorava telefone | Edição não era completa | Campo incluído na atualização |
| Edição de biblioteca não enviava o responsável | Atualização completa era inconsistente | Seleção do responsável adicionada |
| Criação de usuário não enviava senha | Cadastro gerava dado inválido | Campo de senha e validação adicionados |
| Criação de usuário ignorava a role | Perfil escolhido não era persistido | Campo incluído no cadastro |
| `data_nascimento` não era preenchível em `Autor` | Data podia ser descartada | Campo incluído em `$fillable` |
| Listagens não ofereciam acesso uniforme à edição | Jornada do usuário ficava incompleta | Ações de editar padronizadas |

As correções são pequenas e restritas ao CRUD testado. Nenhuma regra externa à
atividade foi adicionada.

