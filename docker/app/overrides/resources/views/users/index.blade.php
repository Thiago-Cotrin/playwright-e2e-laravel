@extends('layouts.app')

@section('content')
<h1>Usuários</h1>
<p><a class="btn" href="{{ route('users.create') }}">Criar Novo Usuário</a></p>

<table>
    <thead>
        <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($users as $user)
            <tr>
                <td><a href="{{ route('users.show', $user->id) }}">{{ $user->name }}</a></td>
                <td>{{ $user->email }}</td>
                <td>{{ $user->role }}</td>
                <td class="actions">
                    <a href="{{ route('users.edit', $user->id) }}">Editar</a>
                    <form action="{{ route('users.destroy', $user->id) }}" method="POST"
                          onsubmit="return confirm('Excluir este usuário?')">
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

