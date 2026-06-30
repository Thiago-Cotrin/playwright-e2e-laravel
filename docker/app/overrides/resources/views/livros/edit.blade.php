@extends('layouts.app')

@section('content')
<h1>Editar Livro</h1>

<form action="{{ route('livros.update', $livro->id) }}" method="POST">
    @csrf
    @method('PUT')

    <label for="titulo">Título:</label>
    <input type="text" id="titulo" name="titulo" value="{{ old('titulo', $livro->titulo) }}" required>

    <label for="isbn">ISBN:</label>
    <input type="text" id="isbn" name="isbn" value="{{ old('isbn', $livro->isbn) }}" required>

    <label for="data_publicacao">Data de Publicação:</label>
    <input type="date" id="data_publicacao" name="data_publicacao"
           value="{{ old('data_publicacao', $livro->data_publicacao) }}" required>

    <label for="autor_id">Autor:</label>
    <select id="autor_id" name="autor_id" required>
        @foreach ($autores as $autor)
            <option value="{{ $autor->id }}" @selected($livro->autor_id == $autor->id)>
                {{ $autor->nome }}
            </option>
        @endforeach
    </select>

    <button class="btn" type="submit">Atualizar Livro</button>
</form>
@endsection

