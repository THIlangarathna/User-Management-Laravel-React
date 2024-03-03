<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        // password -> abcd1234!

        /** @var User $user */
        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        if(!Auth::attempt($data)){
            return response([
                'message' => 'Provided email address or password is incorrect'
            ], 422);
        } else{
            /** @var User $user */
            $user = Auth::user();
            $token = $user->createToken('main')->plainTextToken;

            return response(compact('user', 'token'));
        }
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response('',204);
    }
}
