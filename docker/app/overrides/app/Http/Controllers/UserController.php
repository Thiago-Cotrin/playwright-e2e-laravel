<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(): View
    {
        return view('users.index', ['users' => User::orderBy('name')->get()]);
    }

    public function show(int $id): View|RedirectResponse
    {
        $user = User::with('bibliotecas')->find($id);

        if (!$user) {
            return redirect()
                ->route('users.index')
                ->with('error', 'Usuário não encontrado.');
        }

        return view('users.show', compact('user'));
    }

    public function create(): View
    {
        return view('users.new');
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        $dados['password'] = Hash::make($dados['password']);
        User::create($dados);

        return redirect()
            ->route('users.index')
            ->with('message', 'Usuário criado com sucesso.');
    }

    public function edit(int $id): View|RedirectResponse
    {
        $user = User::find($id);

        if (!$user) {
            return redirect()
                ->route('users.index')
                ->with('error', 'Usuário não encontrado.');
        }

        return view('users.edit', compact('user'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $user = User::find($id);

        if (!$user) {
            return redirect()
                ->route('users.index')
                ->with('error', 'Usuário não encontrado.');
        }

        $dados = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        $user->update($dados);

        return redirect()
            ->route('users.index')
            ->with('message', 'Usuário atualizado com sucesso.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $user = User::find($id);

        if (!$user) {
            return redirect()
                ->route('users.index')
                ->with('error', 'Usuário não encontrado.');
        }

        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('message', 'Usuário excluído com sucesso.');
    }
}

