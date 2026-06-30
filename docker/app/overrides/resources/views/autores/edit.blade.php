@extends('layouts.app')

@section('content')
<h1>Editar Autor</h1>

<form action="{{ route('autores.update', $autor->id) }}" method="POST">
    @csrf
    @method('PUT')

    <label for="nome">Nome:</label>
    <input type="text" id="nome" name="nome" value="{{ old('nome', $autor->nome) }}" required>

    <label for="nacionalidade">Nacionalidade:</label>
    <input type="text" id="nacionalidade" name="nacionalidade"
           value="{{ old('nacionalidade', $autor->nacionalidade) }}" required>

    <label for="data_nascimento">Data de Nascimento:</label>
    <input type="date" id="data_nascimento" name="data_nascimento"
           value="{{ old('data_nascimento', $autor->data_nascimento) }}" required>

    <button class="btn" type="submit">Atualizar Autor</button>
</form>
@endsection

