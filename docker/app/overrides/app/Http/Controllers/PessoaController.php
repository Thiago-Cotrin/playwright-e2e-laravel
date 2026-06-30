<?php

namespace App\Http\Controllers;

use App\Models\Pessoa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class PessoaController extends Controller
{
    public function index(): View
    {
        return view('pessoas.index', ['pessoas' => Pessoa::orderBy('name')->get()]);
    }

    public function create(): View
    {
        return view('pessoas.new');
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:pessoas,email'],
            'telefone' => ['required', 'string', 'max:30'],
            'matricula' => ['required', 'string', 'max:100'],
            'password' => ['required', 'string', 'min:8'],
            'confirmPassword' => ['required', 'same:password'],
        ]);

        Pessoa::create([
            'name' => $dados['name'],
            'email' => $dados['email'],
            'telefone' => $dados['telefone'],
            'matricula' => $dados['matricula'],
            'password' => Hash::make($dados['password']),
        ]);

        return redirect()
            ->route('pessoas.index')
            ->with('message', 'Pessoa criada com sucesso.');
    }

    public function edit(int $id): View|RedirectResponse
    {
        $pessoa = Pessoa::find($id);

        if (!$pessoa) {
            return redirect()
                ->route('pessoas.index')
                ->with('error', 'Pessoa não encontrada.');
        }

        return view('pessoas.edit', compact('pessoa'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $pessoa = Pessoa::find($id);

        if (!$pessoa) {
            return redirect()
                ->route('pessoas.index')
                ->with('error', 'Pessoa não encontrada.');
        }

        $dados = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('pessoas', 'email')->ignore($pessoa->id),
            ],
            'telefone' => ['required', 'string', 'max:30'],
            'matricula' => ['required', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'min:8'],
            'confirmPassword' => ['nullable', 'same:password'],
        ]);

        $pessoa->fill([
            'name' => $dados['name'],
            'email' => $dados['email'],
            'telefone' => $dados['telefone'],
            'matricula' => $dados['matricula'],
        ]);

        if (!empty($dados['password'])) {
            $pessoa->password = Hash::make($dados['password']);
        }

        $pessoa->save();

        return redirect()
            ->route('pessoas.index')
            ->with('message', 'Pessoa atualizada com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $pessoa = Pessoa::find($id);

        if (!$pessoa) {
            return redirect()
                ->route('pessoas.index')
                ->with('error', 'Pessoa não encontrada.');
        }

        $pessoa->delete();

        return redirect()
            ->route('pessoas.index')
            ->with('message', 'Pessoa excluída com sucesso.');
    }
}

