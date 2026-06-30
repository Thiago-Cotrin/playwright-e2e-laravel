<?php

namespace App\Http\Controllers;

use App\Models\Autor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AutorController extends Controller
{
    public function index(): View
    {
        return view('autores.index', ['autores' => Autor::orderBy('nome')->get()]);
    }

    public function create(): View
    {
        return view('autores.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:200'],
            'nacionalidade' => ['required', 'string', 'max:100'],
            'data_nascimento' => ['required', 'date'],
        ]);

        Autor::create($dados);

        return redirect()
            ->route('autores.index')
            ->with('message', 'Autor criado com sucesso.');
    }

    public function edit(int $id): View
    {
        return view('autores.edit', ['autor' => Autor::findOrFail($id)]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:200'],
            'nacionalidade' => ['required', 'string', 'max:100'],
            'data_nascimento' => ['required', 'date'],
        ]);

        Autor::findOrFail($id)->update($dados);

        return redirect()
            ->route('autores.index')
            ->with('message', 'Autor atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        Autor::findOrFail($id)->delete();

        return redirect()
            ->route('autores.index')
            ->with('message', 'Autor excluído com sucesso.');
    }
}

