<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $password = $request->input('password');

        if ($password !== env('ADMIN_PASSWORD')) {
            return response()->json(['message' => 'unauthorized'], 401);
        }

        Cookie::queue(
            cookie()->forever(
                'admin_token',
                $password,
                null,
                null,
                true,
                true,
                false,
                'Strict'
            )
        );

        return response()->json(['message' => 'logged in']);
    }

    public function logout(): JsonResponse
    {
        Cookie::queue(Cookie::forget('admin_token'));

        return response()->json(['message' => 'logged out']);
    }
}
