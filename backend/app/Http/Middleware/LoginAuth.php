<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Symfony\Component\HttpFoundation\Response;

class LoginAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $encryptedCookie = $request->cookie('admin_token');

        try {
            $decryptedCookie = Crypt::decryptString($encryptedCookie);
        } catch (DecryptException $exception) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        [$hash, $password] = explode('|', $decryptedCookie);

        if ($password !== env('ADMIN_PASSWORD')) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        return $next($request);
    }
}
