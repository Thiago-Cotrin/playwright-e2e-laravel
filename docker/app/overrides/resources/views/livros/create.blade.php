@extends('layouts.app')

@section('content')
<h1>Cadastrar Livro</h1>

<form action="{{ route('livros.store') }}" method="POST">
    @csrf

    <label for="titulo">Título:</label>
    <input type="text" id="titulo" name="titulo" value="{{ old('titulo') }}" required>

    <label for="isbn">ISBN:</label>
    <input type="text" id="isbn" name="isbn" value="{{ old('isbn') }}" required>

    <label for="data_publicacao">Data de Publicação:</label>
    <input type="date" id="data_publicacao" name="data_publicacao"
           value="{{ old('data_publicacao') }}" required>

    <label for="autor_id">Autor:</label>
    <select id="autor_id" name="autor_id" required>
        @foreach ($autores as $autor)
            <option value="{{ $autor->id }}">{{ $autor->nome }}</option>
        @endforeach
    </select>

    <button class="btn" type="submit">Cadastrar Livro</button>
</form>
@endsection

