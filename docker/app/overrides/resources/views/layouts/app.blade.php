<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Biblioteca') }}</title>
        <link href="{{ asset('css/materialize.min.css') }}" rel="stylesheet">
        <style>
            body { display: flex; min-height: 100vh; flex-direction: column; }
            main { flex: 1 0 auto; }
            .actions { display: flex; align-items: center; gap: .75rem; white-space: nowrap; }
            .actions form { margin: 0; }
            .flash { padding: .75rem 1rem; margin-bottom: 1rem; border-radius: 4px; }
            .flash-success { background: #e8f5e9; color: #1b5e20; }
            .flash-error { background: #ffebee; color: #b71c1c; }
            table { margin-bottom: 2rem; }
        </style>
    </head>
    <body>
        <header>
            <nav class="blue-grey darken-3">
                <div class="nav-wrapper container">
                    <a href="/" class="brand-logo">Biblioteca</a>
                    <ul class="right hide-on-med-and-down">
                        <li><a href="{{ route('users.index') }}">Usuários</a></li>
                        <li><a href="{{ route('bibliotecas.index') }}">Bibliotecas</a></li>
                        <li><a href="{{ route('pessoas.index') }}">Pessoas</a></li>
                        <li><a href="{{ route('autores.index') }}">Autores</a></li>
                        <li><a href="{{ route('livros.index') }}">Livros</a></li>
                    </ul>
                </div>
            </nav>
        </header>

        <main class="container" style="margin-top: 2rem">
            @if (session('message') || session('success'))
                <div class="flash flash-success" role="status">
                    {{ session('message') ?? session('success') }}
                </div>
            @endif

            @if (session('error'))
                <div class="flash flash-error" role="alert">{{ session('error') }}</div>
            @endif

            @if ($errors->any())
                <div class="flash flash-error" role="alert">
                    <strong>Revise os dados informados:</strong>
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </main>

        <footer class="page-footer blue-grey darken-3">
            <div class="container">&copy; {{ date('Y') }} {{ config('app.name') }}</div>
        </footer>

        <script src="{{ asset('js/materialize.min.js') }}"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                if (typeof M !== 'undefined' && M.AutoInit) {
                    M.AutoInit();
                }
            });
        </script>
    </body>
</html>

