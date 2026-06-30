@extends('layouts.app')

@section('content')
<h1>Bibliotecas</h1>
<p><a class="btn" href="{{ route('bibliotecas.create') }}">Criar Nova Biblioteca</a></p>

<table>
    <thead>
        <tr>
            <th>Nome</th>
            <th>Responsável</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($bibliotecas as $biblioteca)
            <tr>
                <td>{{ $biblioteca->nome }}</td>
                <td>{{ $biblioteca->creator->name }}</td>
                <td>{{ $biblioteca->endereco }}</td>
                <td>{{ $biblioteca->telefone }}</td>
                <td>{{ $biblioteca->email }}</td>
                <td class="actions">
                    <a href="{{ route('bibliotecas.edit', $biblioteca->id) }}">Editar</a>
                    <form action="{{ route('bibliotecas.destroy', $biblioteca->id) }}" method="POST"
                          onsubmit="return confirm('Excluir esta biblioteca?')">
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

