@extends('layouts.app')

@section('content')
<h1>Pessoas</h1>
<p><a class="btn" href="{{ route('pessoas.create') }}">Criar Nova Pessoa</a></p>

<table>
    <thead>
        <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Matrícula</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($pessoas as $pessoa)
            <tr>
                <td>{{ $pessoa->name }}</td>
                <td>{{ $pessoa->email }}</td>
                <td>{{ $pessoa->telefone }}</td>
                <td>{{ $pessoa->matricula }}</td>
                <td class="actions">
                    <a href="{{ route('pessoas.edit', $pessoa->id) }}">Editar</a>
                    <form action="{{ route('pessoas.destroy', $pessoa->id) }}" method="POST"
                          onsubmit="return confirm('Excluir esta pessoa?')">
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

