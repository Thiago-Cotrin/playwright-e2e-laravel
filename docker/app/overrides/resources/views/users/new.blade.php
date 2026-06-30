@extends('layouts.app')

@section('content')
<h1>Criar Usuário</h1>

<form action="{{ route('users.store') }}" method="POST">
    @csrf

    <label for="name">Nome:</label>
    <input type="text" id="name" name="name" value="{{ old('name') }}" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" value="{{ old('email') }}" required>

    <label for="password">Senha:</label>
    <input type="password" id="password" name="password" required minlength="8">

    <label for="role">Role:</label>
    <select id="role" name="role" required>
        <option value="admin" @selected(old('role') === 'admin')>Admin</option>
        <option value="user" @selected(old('role') === 'user')>User</option>
    </select>

    <button class="btn" type="submit">Criar Usuário</button>
</form>
@endsection

