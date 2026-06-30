@extends('layouts.app')

@section('content')
<h1>Livros</h1>
<p><a class="btn" href="{{ route('livros.create') }}">Cadastrar Novo Livro</a></p>

<table>
    <thead>
        <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Data de publicação</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($livros as $livro)
            <tr>
                <td>{{ $livro->titulo }}</td>
                <td>{{ $livro->autor->nome }}</td>
                <td>{{ $livro->isbn }}</td>
                <td>{{ $livro->data_publicacao }}</td>
                <td class="actions">
                    <a href="{{ route('livros.edit', $livro->id) }}">Editar</a>
                    <form action="{{ route('livros.destroy', $livro->id) }}" method="POST"
                          onsubmit="return confirm('Excluir este livro?')">
                        @csrf
                        @method('DELETE')
                        <button class="btn-small red" type="submit">Excluir</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
@endsection

