@extends('layouts.app')

@section('content')
<h1>Editar Biblioteca</h1>

<form action="{{ route('bibliotecas.update', $biblioteca->id) }}" method="POST">
    @csrf
    @method('PUT')

    <label for="nome">Nome:</label>
    <input type="text" id="nome" name="nome" value="{{ old('nome', $biblioteca->nome) }}" required>

    <label for="endereco">Endereço:</label>
    <input type="text" id="endereco" name="endereco" value="{{ old('endereco', $biblioteca->endereco) }}" required>

    <label for="telefone">Telefone:</label>
    <input type="text" id="telefone" name="telefone" value="{{ old('telefone', $biblioteca->telefone) }}" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" value="{{ old('email', $biblioteca->email) }}" required>

    <label for="created_by">Responsável:</label>
    <select id="created_by" name="created_by" required>
        @foreach ($users as $user)
            <option value="{{ $user->id }}" @selected(old('created_by', $biblioteca->created_by) == $user->id)>
                {{ $user->name }}
            </option>
        @endforeach
    </select>

    <button class="btn" type="submit">Atualizar Biblioteca</button>
</form>

<hr>
<h2>Pessoas</h2>

<table>
    <thead>
        <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Matrícula</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($biblioteca->pessoas as $pessoa)
            <tr>
                <td>{{ $pessoa->name }}</td>
                <td>{{ $pessoa->email }}</td>
                <td>{{ $pessoa->telefone }}</td>
                <td>{{ $pessoa->matricula }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<p>
    <a class="btn" href="{{ route('bibliotecas.pessoas.create', $biblioteca->id) }}">
        Adicionar Pessoa à Biblioteca
    </a>
</p>
@endsection

