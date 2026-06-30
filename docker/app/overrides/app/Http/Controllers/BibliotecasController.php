<?php

namespace App\Http\Controllers;

use App\Models\Biblioteca;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BibliotecasController extends Controller
{
    public function index(Request $request): View
    {
        $busca = $request->string('nome')->trim();

        $bibliotecas = Biblioteca::with('creator')
            ->when($busca->isNotEmpty(), fn ($query) => $query->where('nome', 'like', "%{$busca}%"))
            ->get();

        return view('bibliotecas.index', compact('bibliotecas'));
    }

    public function create(): View
    {
        return view('bibliotecas.new', ['users' => User::orderBy('name')->get()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'created_by' => ['required', 'exists:users,id'],
            'nome' => ['required', 'string', 'max:255'],
            'endereco' => ['required', 'string', 'max:255'],
            'telefone' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        Biblioteca::create($dados);

        return redirect()
            ->route('bibliotecas.index')
            ->with('message', 'Biblioteca criada com sucesso.');
    }

    public function edit(int $id): View|RedirectResponse
    {
        $biblioteca = Biblioteca::with('pessoas.bibliotecas')->find($id);

        if (!$biblioteca) {
            return redirect()
                ->route('bibliotecas.index')
                ->with('error', 'Biblioteca não encontrada.');
        }

        return view('bibliotecas.edit', [
            'biblioteca' => $biblioteca,
            'users' => User::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $biblioteca = Biblioteca::find($id);

        if (!$biblioteca) {
            return redirect()
                ->route('bibliotecas.index')
                ->with('error', 'Biblioteca não encontrada.');
        }

        $dados = $request->validate([
            'created_by' => ['required', 'exists:users,id'],
            'nome' => ['required', 'string', 'max:255'],
            'endereco' => ['required', 'string', 'max:255'],
            'telefone' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        $biblioteca->update($dados);

        return redirect()
            ->route('bibliotecas.index')
            ->with('message', 'Biblioteca atualizada com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $biblioteca = Biblioteca::find($id);

        if (!$biblioteca) {
            return redirect()
                ->route('bibliotecas.index')
                ->with('error', 'Biblioteca não encontrada.');
        }

        $biblioteca->delete();

        return redirect()
            ->route('bibliotecas.index')
            ->with('message', 'Biblioteca excluída com sucesso.');
    }
}

