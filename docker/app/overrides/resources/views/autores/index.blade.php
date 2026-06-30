@extends('layouts.app')

@section('content')
<h1>Autores</h1>
<p><a class="btn" href="{{ route('autores.create') }}">Cadastrar novo Autor</a></p>

<table>
    <thead>
        <tr>
            <th>Nome</th>
            <th>Nacionalidade</th>
            <th>Data de nascimento</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($autores as $autor)
            <tr>
                <td>{{ $autor->nome }}</td>
                <td>{{ $autor->nacionalidade }}</td>
                <td>{{ $autor->data_nascimento }}</td>
                <td class="actions">
                    <a href="{{ route('autores.edit', $autor->id) }}">Editar</a>
                    <form action="{{ route('autores.destroy', $autor->id) }}" method="POST"
                          onsubmit="return confirm('Excluir este autor?')">
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

